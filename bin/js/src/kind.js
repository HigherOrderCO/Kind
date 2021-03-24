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
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
    };
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
    };
    var kind_name_to_bits = name => {
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
        if (typeof window === 'undefined') {
            var rl = eval("require('readline')").createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });
            var fs = eval("require('fs')");
            var pc = eval("process");
        } else {
            var rl = {
                question: (x, f) => f(''),
                close: () => {}
            };
            var fs = {
                readFileSync: () => ''
            };
            var pc = {
                exit: () => {},
                argv: []
            };
        };
        return run_io({
            rl,
            fs,
            pc
        }, p).then((x) => {
            rl.close();
            return x;
        }).catch((e) => {
            rl.close();
            throw e;
        });
    };
    var get_file = (lib, param) => {
        return lib.fs.readFileSync(param, 'utf8');
    }
    var set_file = (lib, param) => {
        var path = '';
        for (var i = 0; i < param.length && param[i] !== '='; ++i) {
            path += param[i];
        };
        var data = param.slice(i + 1);
        lib.fs.mkdirSync(path.split('/').slice(0, -1).join('/'), {
            recursive: true
        });
        lib.fs.writeFileSync(path, data);
        return '';
    };
    var del_file = (lib, param) => {
        try {
            lib.fs.unlinkSync(param);
            return '';
        } catch (e) {
            if (e.message.indexOf('EPERM') !== -1) {
                lib.fs.rmdirSync(param);
                return '';
            } else {
                throw e;
            }
        }
    };
    var get_dir = (lib, param) => {
        return lib.fs.readdirSync(param).join(';');
    };
    var run_io = (lib, p) => {
        switch (p._) {
            case 'IO.end':
                return Promise.resolve(p.value);
            case 'IO.ask':
                return new Promise((res, err) => {
                    switch (p.query) {
                        case 'print':
                            console.log(p.param);
                            run_io(lib, p.then(1)).then(res).catch(err);
                            break;
                        case 'put_string':
                            process.stdout.write(p.param);
                            run_io(lib, p.then(1)).then(res).catch(err);
                            break;
                        case 'exit':
                            lib.pc.exit();
                            break;
                        case 'get_line':
                            lib.rl.question('', (line) => run_io(lib, p.then(line)).then(res).catch(err));
                            break;
                        case 'get_file':
                            try {
                                run_io(lib, p.then(get_file(lib, p.param))).then(res).catch(err);
                            } catch (e) {
                                if (e.message.indexOf('NOENT') !== -1) {
                                    run_io(lib, p.then('')).then(res).catch(err);
                                } else {
                                    err(e);
                                }
                            };
                            break;
                        case 'set_file':
                            try {
                                run_io(lib, p.then(set_file(lib, p.param))).then(res).catch(err);
                            } catch (e) {
                                if (e.message.indexOf('NOENT') !== -1) {
                                    run_io(lib, p.then('')).then(res).catch(err);
                                } else {
                                    err(e);
                                }
                            };
                            break;
                        case 'del_file':
                            try {
                                run_io(lib, p.then(del_file(lib, p.param))).then(res).catch(err);
                            } catch (e) {
                                if (e.message.indexOf('NOENT') !== -1) {
                                    run_io(lib, p.then('')).then(res).catch(err);
                                } else {
                                    err(e);
                                }
                            };
                            break;
                        case 'get_dir':
                            try {
                                run_io(lib, p.then(get_dir(lib, p.param))).then(res).catch(err);
                            } catch (e) {
                                if (e.message.indexOf('NOENT') !== -1) {
                                    run_io(lib, p.then('')).then(res).catch(err);
                                } else {
                                    err(e);
                                }
                            };
                            break;
                        case 'get_args':
                            run_io(lib, p.then(lib.pc.argv[2] || '')).then(res).catch(err);
                            break;
                    }
                });
        }
    };

    function IO$(_A$1) {
        var $23 = null;
        return $23;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $24 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $24;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $26 = self.value;
                var $27 = _f$4($26);
                var $25 = $27;
                break;
            case 'IO.ask':
                var $28 = self.query;
                var $29 = self.param;
                var $30 = self.then;
                var $31 = IO$ask$($28, $29, (_x$8 => {
                    var $32 = IO$bind$($30(_x$8), _f$4);
                    return $32;
                }));
                var $25 = $31;
                break;
        };
        return $25;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $33 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $33;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $34 = _new$2(IO$bind)(IO$end);
        return $34;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Maybe$(_A$1) {
        var $35 = null;
        return $35;
    };
    const Maybe = x0 => Maybe$(x0);

    function BitsMap$(_A$1) {
        var $36 = null;
        return $36;
    };
    const BitsMap = x0 => BitsMap$(x0);
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
                        var $37 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $39 = self.lft;
                                var $40 = BitsMap$get$($37, $39);
                                var $38 = $40;
                                break;
                            case 'BitsMap.new':
                                var $41 = Maybe$none;
                                var $38 = $41;
                                break;
                        };
                        return $38;
                    case 'i':
                        var $42 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $44 = self.rgt;
                                var $45 = BitsMap$get$($42, $44);
                                var $43 = $45;
                                break;
                            case 'BitsMap.new':
                                var $46 = Maybe$none;
                                var $43 = $46;
                                break;
                        };
                        return $43;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $48 = self.val;
                                var $49 = $48;
                                var $47 = $49;
                                break;
                            case 'BitsMap.new':
                                var $50 = Maybe$none;
                                var $47 = $50;
                                break;
                        };
                        return $47;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);
    const Bits$e = '';
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $52 = Bool$true;
                var $51 = $52;
                break;
            case 'Cmp.gtn':
                var $53 = Bool$false;
                var $51 = $53;
                break;
        };
        return $51;
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
            case 'Word.o':
                var $55 = self.pred;
                var $56 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $58 = self.pred;
                            var $59 = (_a$pred$10 => {
                                var $60 = Word$cmp$go$(_a$pred$10, $58, _c$4);
                                return $60;
                            });
                            var $57 = $59;
                            break;
                        case 'Word.i':
                            var $61 = self.pred;
                            var $62 = (_a$pred$10 => {
                                var $63 = Word$cmp$go$(_a$pred$10, $61, Cmp$ltn);
                                return $63;
                            });
                            var $57 = $62;
                            break;
                        case 'Word.e':
                            var $64 = (_a$pred$8 => {
                                var $65 = _c$4;
                                return $65;
                            });
                            var $57 = $64;
                            break;
                    };
                    var $57 = $57($55);
                    return $57;
                });
                var $54 = $56;
                break;
            case 'Word.i':
                var $66 = self.pred;
                var $67 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $69 = self.pred;
                            var $70 = (_a$pred$10 => {
                                var $71 = Word$cmp$go$(_a$pred$10, $69, Cmp$gtn);
                                return $71;
                            });
                            var $68 = $70;
                            break;
                        case 'Word.i':
                            var $72 = self.pred;
                            var $73 = (_a$pred$10 => {
                                var $74 = Word$cmp$go$(_a$pred$10, $72, _c$4);
                                return $74;
                            });
                            var $68 = $73;
                            break;
                        case 'Word.e':
                            var $75 = (_a$pred$8 => {
                                var $76 = _c$4;
                                return $76;
                            });
                            var $68 = $75;
                            break;
                    };
                    var $68 = $68($66);
                    return $68;
                });
                var $54 = $67;
                break;
            case 'Word.e':
                var $77 = (_b$5 => {
                    var $78 = _c$4;
                    return $78;
                });
                var $54 = $77;
                break;
        };
        var $54 = $54(_b$3);
        return $54;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $79 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $79;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $80 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $80;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $81 = 1n + _pred$1;
        return $81;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $82 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $82;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $83 = word_to_u16(_value$1);
        return $83;
    };
    const U16$new = x0 => U16$new$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$(_size$1) {
        var $84 = null;
        return $84;
    };
    const Word = x0 => Word$(x0);

    function Word$i$(_pred$2) {
        var $85 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $85;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $86 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $86;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $88 = self.pred;
                var $89 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $91 = self.pred;
                            var $92 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $94 = Word$i$(Word$subber$(_a$pred$10, $91, Bool$true));
                                    var $93 = $94;
                                } else {
                                    var $95 = Word$o$(Word$subber$(_a$pred$10, $91, Bool$false));
                                    var $93 = $95;
                                };
                                return $93;
                            });
                            var $90 = $92;
                            break;
                        case 'Word.i':
                            var $96 = self.pred;
                            var $97 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $99 = Word$o$(Word$subber$(_a$pred$10, $96, Bool$true));
                                    var $98 = $99;
                                } else {
                                    var $100 = Word$i$(Word$subber$(_a$pred$10, $96, Bool$true));
                                    var $98 = $100;
                                };
                                return $98;
                            });
                            var $90 = $97;
                            break;
                        case 'Word.e':
                            var $101 = (_a$pred$8 => {
                                var $102 = Word$e;
                                return $102;
                            });
                            var $90 = $101;
                            break;
                    };
                    var $90 = $90($88);
                    return $90;
                });
                var $87 = $89;
                break;
            case 'Word.i':
                var $103 = self.pred;
                var $104 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $106 = self.pred;
                            var $107 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $109 = Word$o$(Word$subber$(_a$pred$10, $106, Bool$false));
                                    var $108 = $109;
                                } else {
                                    var $110 = Word$i$(Word$subber$(_a$pred$10, $106, Bool$false));
                                    var $108 = $110;
                                };
                                return $108;
                            });
                            var $105 = $107;
                            break;
                        case 'Word.i':
                            var $111 = self.pred;
                            var $112 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $114 = Word$i$(Word$subber$(_a$pred$10, $111, Bool$true));
                                    var $113 = $114;
                                } else {
                                    var $115 = Word$o$(Word$subber$(_a$pred$10, $111, Bool$false));
                                    var $113 = $115;
                                };
                                return $113;
                            });
                            var $105 = $112;
                            break;
                        case 'Word.e':
                            var $116 = (_a$pred$8 => {
                                var $117 = Word$e;
                                return $117;
                            });
                            var $105 = $116;
                            break;
                    };
                    var $105 = $105($103);
                    return $105;
                });
                var $87 = $104;
                break;
            case 'Word.e':
                var $118 = (_b$5 => {
                    var $119 = Word$e;
                    return $119;
                });
                var $87 = $118;
                break;
        };
        var $87 = $87(_b$3);
        return $87;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $120 = Word$subber$(_a$2, _b$3, Bool$false);
        return $120;
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
                    var $121 = _x$4;
                    return $121;
                } else {
                    var $122 = (self - 1n);
                    var $123 = Nat$apply$($122, _f$3, _f$3(_x$4));
                    return $123;
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
            case 'Word.o':
                var $125 = self.pred;
                var $126 = Word$i$($125);
                var $124 = $126;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = Word$o$(Word$inc$($127));
                var $124 = $128;
                break;
            case 'Word.e':
                var $129 = Word$e;
                var $124 = $129;
                break;
        };
        return $124;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U16$inc$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $131 = u16_to_word(self);
                var $132 = U16$new$(Word$inc$($131));
                var $130 = $132;
                break;
        };
        return $130;
    };
    const U16$inc = x0 => U16$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $134 = Word$e;
            var $133 = $134;
        } else {
            var $135 = (self - 1n);
            var $136 = Word$o$(Word$zero$($135));
            var $133 = $136;
        };
        return $133;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U16$zero = U16$new$(Word$zero$(16n));
    const Nat$to_u16 = a0 => (Number(a0));

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $138 = self.pred;
                var $139 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $141 = self.pred;
                            var $142 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $144 = Word$i$(Word$adder$(_a$pred$10, $141, Bool$false));
                                    var $143 = $144;
                                } else {
                                    var $145 = Word$o$(Word$adder$(_a$pred$10, $141, Bool$false));
                                    var $143 = $145;
                                };
                                return $143;
                            });
                            var $140 = $142;
                            break;
                        case 'Word.i':
                            var $146 = self.pred;
                            var $147 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $149 = Word$o$(Word$adder$(_a$pred$10, $146, Bool$true));
                                    var $148 = $149;
                                } else {
                                    var $150 = Word$i$(Word$adder$(_a$pred$10, $146, Bool$false));
                                    var $148 = $150;
                                };
                                return $148;
                            });
                            var $140 = $147;
                            break;
                        case 'Word.e':
                            var $151 = (_a$pred$8 => {
                                var $152 = Word$e;
                                return $152;
                            });
                            var $140 = $151;
                            break;
                    };
                    var $140 = $140($138);
                    return $140;
                });
                var $137 = $139;
                break;
            case 'Word.i':
                var $153 = self.pred;
                var $154 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $156 = self.pred;
                            var $157 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $159 = Word$o$(Word$adder$(_a$pred$10, $156, Bool$true));
                                    var $158 = $159;
                                } else {
                                    var $160 = Word$i$(Word$adder$(_a$pred$10, $156, Bool$false));
                                    var $158 = $160;
                                };
                                return $158;
                            });
                            var $155 = $157;
                            break;
                        case 'Word.i':
                            var $161 = self.pred;
                            var $162 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $164 = Word$i$(Word$adder$(_a$pred$10, $161, Bool$true));
                                    var $163 = $164;
                                } else {
                                    var $165 = Word$o$(Word$adder$(_a$pred$10, $161, Bool$true));
                                    var $163 = $165;
                                };
                                return $163;
                            });
                            var $155 = $162;
                            break;
                        case 'Word.e':
                            var $166 = (_a$pred$8 => {
                                var $167 = Word$e;
                                return $167;
                            });
                            var $155 = $166;
                            break;
                    };
                    var $155 = $155($153);
                    return $155;
                });
                var $137 = $154;
                break;
            case 'Word.e':
                var $168 = (_b$5 => {
                    var $169 = Word$e;
                    return $169;
                });
                var $137 = $168;
                break;
        };
        var $137 = $137(_b$3);
        return $137;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $170 = Word$adder$(_a$2, _b$3, Bool$false);
        return $170;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $172 = Bool$false;
                var $171 = $172;
                break;
            case 'Cmp.eql':
                var $173 = Bool$true;
                var $171 = $173;
                break;
        };
        return $171;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $174 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $174;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $176 = self.pred;
                var $177 = (Word$to_bits$($176) + '0');
                var $175 = $177;
                break;
            case 'Word.i':
                var $178 = self.pred;
                var $179 = (Word$to_bits$($178) + '1');
                var $175 = $179;
                break;
            case 'Word.e':
                var $180 = Bits$e;
                var $175 = $180;
                break;
        };
        return $175;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $182 = Word$e;
            var $181 = $182;
        } else {
            var $183 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $185 = self.pred;
                    var $186 = Word$o$(Word$trim$($183, $185));
                    var $184 = $186;
                    break;
                case 'Word.i':
                    var $187 = self.pred;
                    var $188 = Word$i$(Word$trim$($183, $187));
                    var $184 = $188;
                    break;
                case 'Word.e':
                    var $189 = Word$o$(Word$trim$($183, Word$e));
                    var $184 = $189;
                    break;
            };
            var $181 = $184;
        };
        return $181;
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
                    case 'o':
                        var $190 = self.slice(0, -1);
                        var $191 = Bits$reverse$tco$($190, (_r$2 + '0'));
                        return $191;
                    case 'i':
                        var $192 = self.slice(0, -1);
                        var $193 = Bits$reverse$tco$($192, (_r$2 + '1'));
                        return $193;
                    case 'e':
                        var $194 = _r$2;
                        return $194;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $195 = Bits$reverse$tco$(_a$1, Bits$e);
        return $195;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);
    const Kind$Name$to_bits = a0 => (kind_name_to_bits(a0));

    function Kind$get$(_name$2, _map$3) {
        var $196 = BitsMap$get$((kind_name_to_bits(_name$2)), _map$3);
        return $196;
    };
    const Kind$get = x0 => x1 => Kind$get$(x0, x1);

    function IO$get_file$(_name$1) {
        var $197 = IO$ask$("get_file", _name$1, (_file$2 => {
            var $198 = IO$end$(_file$2);
            return $198;
        }));
        return $197;
    };
    const IO$get_file = x0 => IO$get_file$(x0);

    function Parser$Reply$(_V$1) {
        var $199 = null;
        return $199;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$value$(_idx$2, _code$3, _val$4) {
        var $200 = ({
            _: 'Parser.Reply.value',
            'idx': _idx$2,
            'code': _code$3,
            'val': _val$4
        });
        return $200;
    };
    const Parser$Reply$value = x0 => x1 => x2 => Parser$Reply$value$(x0, x1, x2);

    function Parser$is_eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $202 = Parser$Reply$value$(_idx$1, _code$2, Bool$true);
            var $201 = $202;
        } else {
            var $203 = self.charCodeAt(0);
            var $204 = self.slice(1);
            var $205 = Parser$Reply$value$(_idx$1, _code$2, Bool$false);
            var $201 = $205;
        };
        return $201;
    };
    const Parser$is_eof = x0 => x1 => Parser$is_eof$(x0, x1);

    function Parser$Reply$error$(_idx$2, _code$3, _err$4) {
        var $206 = ({
            _: 'Parser.Reply.error',
            'idx': _idx$2,
            'code': _code$3,
            'err': _err$4
        });
        return $206;
    };
    const Parser$Reply$error = x0 => x1 => x2 => Parser$Reply$error$(x0, x1, x2);

    function Parser$(_V$1) {
        var $207 = null;
        return $207;
    };
    const Parser = x0 => Parser$(x0);

    function Maybe$some$(_value$2) {
        var $208 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $208;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Parser$ErrorAt$new$(_idx$1, _code$2, _err$3) {
        var $209 = ({
            _: 'Parser.ErrorAt.new',
            'idx': _idx$1,
            'code': _code$2,
            'err': _err$3
        });
        return $209;
    };
    const Parser$ErrorAt$new = x0 => x1 => x2 => Parser$ErrorAt$new$(x0, x1, x2);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$ErrorAt$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $211 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $213 = self.value;
                        var self = $211;
                        switch (self._) {
                            case 'Parser.ErrorAt.new':
                                var $215 = self.idx;
                                var self = $213;
                                switch (self._) {
                                    case 'Parser.ErrorAt.new':
                                        var $217 = self.idx;
                                        var self = ($215 > $217);
                                        if (self) {
                                            var $219 = _a$1;
                                            var $218 = $219;
                                        } else {
                                            var $220 = _b$2;
                                            var $218 = $220;
                                        };
                                        var $216 = $218;
                                        break;
                                };
                                var $214 = $216;
                                break;
                        };
                        var $212 = $214;
                        break;
                    case 'Maybe.none':
                        var $221 = _a$1;
                        var $212 = $221;
                        break;
                };
                var $210 = $212;
                break;
            case 'Maybe.none':
                var $222 = _b$2;
                var $210 = $222;
                break;
        };
        return $210;
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
                    case 'List.cons':
                        var $223 = self.head;
                        var $224 = self.tail;
                        var _parsed$8 = $223(_idx$4)(_code$5);
                        var self = _parsed$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $226 = self.idx;
                                var $227 = self.code;
                                var $228 = self.err;
                                var _neo$12 = Maybe$some$(Parser$ErrorAt$new$($226, $227, $228));
                                var _err$13 = Parser$ErrorAt$combine$(_neo$12, _err$3);
                                var $229 = Parser$first_of$go$($224, _err$13, _idx$4, _code$5);
                                var $225 = $229;
                                break;
                            case 'Parser.Reply.value':
                                var $230 = self.idx;
                                var $231 = self.code;
                                var $232 = self.val;
                                var $233 = Parser$Reply$value$($230, $231, $232);
                                var $225 = $233;
                                break;
                        };
                        return $225;
                    case 'List.nil':
                        var self = _err$3;
                        switch (self._) {
                            case 'Maybe.some':
                                var $235 = self.value;
                                var self = $235;
                                switch (self._) {
                                    case 'Parser.ErrorAt.new':
                                        var $237 = self.idx;
                                        var $238 = self.code;
                                        var $239 = self.err;
                                        var $240 = Parser$Reply$error$($237, $238, $239);
                                        var $236 = $240;
                                        break;
                                };
                                var $234 = $236;
                                break;
                            case 'Maybe.none':
                                var $241 = Parser$Reply$error$(_idx$4, _code$5, "No parse.");
                                var $234 = $241;
                                break;
                        };
                        return $234;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$first_of$go = x0 => x1 => x2 => x3 => Parser$first_of$go$(x0, x1, x2, x3);

    function Parser$first_of$(_pars$2) {
        var $242 = Parser$first_of$go(_pars$2)(Maybe$none);
        return $242;
    };
    const Parser$first_of = x0 => Parser$first_of$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $243 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $243;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function List$(_A$1) {
        var $244 = null;
        return $244;
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
                    case 'Parser.Reply.value':
                        var $245 = self.idx;
                        var $246 = self.code;
                        var $247 = self.val;
                        var $248 = Parser$many$go$(_parse$2, (_xs$9 => {
                            var $249 = _values$3(List$cons$($247, _xs$9));
                            return $249;
                        }), $245, $246);
                        return $248;
                    case 'Parser.Reply.error':
                        var $250 = Parser$Reply$value$(_idx$4, _code$5, _values$3(List$nil));
                        return $250;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => x3 => Parser$many$go$(x0, x1, x2, x3);

    function Parser$many$(_parser$2) {
        var $251 = Parser$many$go(_parser$2)((_x$3 => {
            var $252 = _x$3;
            return $252;
        }));
        return $251;
    };
    const Parser$many = x0 => Parser$many$(x0);
    const Unit$new = 1;

    function String$cons$(_head$1, _tail$2) {
        var $253 = (String.fromCharCode(_head$1) + _tail$2);
        return $253;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
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
                    case 'List.cons':
                        var $254 = self.head;
                        var $255 = self.tail;
                        var $256 = String$flatten$go$($255, (_res$2 + $254));
                        return $256;
                    case 'List.nil':
                        var $257 = _res$2;
                        return $257;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $258 = String$flatten$go$(_xs$1, "");
        return $258;
    };
    const String$flatten = x0 => String$flatten$(x0);
    const String$nil = '';

    function Parser$text$go$(_text$1, _idx$2, _code$3) {
        var self = _text$1;
        if (self.length === 0) {
            var $260 = Parser$Reply$value$(_idx$2, _code$3, Unit$new);
            var $259 = $260;
        } else {
            var $261 = self.charCodeAt(0);
            var $262 = self.slice(1);
            var self = _code$3;
            if (self.length === 0) {
                var _error$6 = String$flatten$(List$cons$("Expected \'", List$cons$(_text$1, List$cons$("\', found end of file.", List$nil))));
                var $264 = Parser$Reply$error$(_idx$2, _code$3, _error$6);
                var $263 = $264;
            } else {
                var $265 = self.charCodeAt(0);
                var $266 = self.slice(1);
                var self = ($261 === $265);
                if (self) {
                    var $268 = Parser$text$($262, Nat$succ$(_idx$2), $266);
                    var $267 = $268;
                } else {
                    var _error$8 = String$flatten$(List$cons$("Expected \'", List$cons$(_text$1, List$cons$("\', found \'", List$cons$(String$cons$($265, String$nil), List$cons$("\'.", List$nil))))));
                    var $269 = Parser$Reply$error$(_idx$2, _code$3, _error$8);
                    var $267 = $269;
                };
                var $263 = $267;
            };
            var $259 = $263;
        };
        return $259;
    };
    const Parser$text$go = x0 => x1 => x2 => Parser$text$go$(x0, x1, x2);

    function Parser$text$(_text$1, _idx$2, _code$3) {
        var self = Parser$text$go$(_text$1, _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $271 = self.err;
                var $272 = Parser$Reply$error$(_idx$2, _code$3, $271);
                var $270 = $272;
                break;
            case 'Parser.Reply.value':
                var $273 = self.idx;
                var $274 = self.code;
                var $275 = self.val;
                var $276 = Parser$Reply$value$($273, $274, $275);
                var $270 = $276;
                break;
        };
        return $270;
    };
    const Parser$text = x0 => x1 => x2 => Parser$text$(x0, x1, x2);

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
                    case 'List.cons':
                        var $277 = self.head;
                        var $278 = self.tail;
                        var $279 = List$reverse$go$($278, List$cons$($277, _res$3));
                        return $279;
                    case 'List.nil':
                        var $280 = _res$3;
                        return $280;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $281 = List$reverse$go$(_xs$2, List$nil);
        return $281;
    };
    const List$reverse = x0 => List$reverse$(x0);

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
                    case 'Parser.Reply.value':
                        var $283 = self.idx;
                        var $284 = self.code;
                        var $285 = Parser$Reply$value$($283, $284, List$reverse$(_values$4));
                        var $282 = $285;
                        break;
                    case 'Parser.Reply.error':
                        var _reply$11 = _parse$3(_idx$5)(_code$6);
                        var self = _reply$11;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $287 = self.idx;
                                var $288 = self.code;
                                var $289 = self.err;
                                var $290 = Parser$Reply$error$($287, $288, $289);
                                var $286 = $290;
                                break;
                            case 'Parser.Reply.value':
                                var $291 = self.idx;
                                var $292 = self.code;
                                var $293 = self.val;
                                var $294 = Parser$until$go$(_until$2, _parse$3, List$cons$($293, _values$4), $291, $292);
                                var $286 = $294;
                                break;
                        };
                        var $282 = $286;
                        break;
                };
                return $282;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => x4 => Parser$until$go$(x0, x1, x2, x3, x4);

    function Parser$until$(_until$2, _parse$3) {
        var $295 = Parser$until$go(_until$2)(_parse$3)(List$nil);
        return $295;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

    function Parser$one$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $297 = Parser$Reply$error$(_idx$1, _code$2, "Unexpected end of file.");
            var $296 = $297;
        } else {
            var $298 = self.charCodeAt(0);
            var $299 = self.slice(1);
            var $300 = Parser$Reply$value$(Nat$succ$(_idx$1), $299, $298);
            var $296 = $300;
        };
        return $296;
    };
    const Parser$one = x0 => x1 => Parser$one$(x0, x1);
    const Kind$Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{9}"), List$cons$(Parser$text("\u{a}"), List$cons$((_idx$1 => _code$2 => {
        var self = Parser$text$("//", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $302 = self.idx;
                var $303 = self.code;
                var $304 = self.err;
                var $305 = Parser$Reply$error$($302, $303, $304);
                var $301 = $305;
                break;
            case 'Parser.Reply.value':
                var $306 = self.idx;
                var $307 = self.code;
                var self = Parser$until$(Parser$text("\u{a}"), Parser$one)($306)($307);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $309 = self.idx;
                        var $310 = self.code;
                        var $311 = self.err;
                        var $312 = Parser$Reply$error$($309, $310, $311);
                        var $308 = $312;
                        break;
                    case 'Parser.Reply.value':
                        var $313 = self.idx;
                        var $314 = self.code;
                        var $315 = Parser$Reply$value$($313, $314, Unit$new);
                        var $308 = $315;
                        break;
                };
                var $301 = $308;
                break;
        };
        return $301;
    }), List$nil))))));

    function Parser$get_index$(_idx$1, _code$2) {
        var $316 = Parser$Reply$value$(_idx$1, _code$2, _idx$1);
        return $316;
    };
    const Parser$get_index = x0 => x1 => Parser$get_index$(x0, x1);

    function Kind$Parser$init$(_idx$1, _code$2) {
        var self = Kind$Parser$spaces(_idx$1)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $318 = self.idx;
                var $319 = self.code;
                var $320 = self.err;
                var $321 = Parser$Reply$error$($318, $319, $320);
                var $317 = $321;
                break;
            case 'Parser.Reply.value':
                var $322 = self.idx;
                var $323 = self.code;
                var self = Parser$get_index$($322, $323);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $325 = self.idx;
                        var $326 = self.code;
                        var $327 = self.err;
                        var $328 = Parser$Reply$error$($325, $326, $327);
                        var $324 = $328;
                        break;
                    case 'Parser.Reply.value':
                        var $329 = self.idx;
                        var $330 = self.code;
                        var $331 = self.val;
                        var $332 = Parser$Reply$value$($329, $330, $331);
                        var $324 = $332;
                        break;
                };
                var $317 = $324;
                break;
        };
        return $317;
    };
    const Kind$Parser$init = x0 => x1 => Kind$Parser$init$(x0, x1);

    function Parser$many1$(_parser$2, _idx$3, _code$4) {
        var self = _parser$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $334 = self.idx;
                var $335 = self.code;
                var $336 = self.err;
                var $337 = Parser$Reply$error$($334, $335, $336);
                var $333 = $337;
                break;
            case 'Parser.Reply.value':
                var $338 = self.idx;
                var $339 = self.code;
                var $340 = self.val;
                var self = Parser$many$(_parser$2)($338)($339);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $342 = self.idx;
                        var $343 = self.code;
                        var $344 = self.err;
                        var $345 = Parser$Reply$error$($342, $343, $344);
                        var $341 = $345;
                        break;
                    case 'Parser.Reply.value':
                        var $346 = self.idx;
                        var $347 = self.code;
                        var $348 = self.val;
                        var $349 = Parser$Reply$value$($346, $347, List$cons$($340, $348));
                        var $341 = $349;
                        break;
                };
                var $333 = $341;
                break;
        };
        return $333;
    };
    const Parser$many1 = x0 => x1 => x2 => Parser$many1$(x0, x1, x2);

    function Kind$Name$is_letter$(_chr$1) {
        var self = U16$btw$(65, _chr$1, 90);
        if (self) {
            var $351 = Bool$true;
            var $350 = $351;
        } else {
            var self = U16$btw$(97, _chr$1, 122);
            if (self) {
                var $353 = Bool$true;
                var $352 = $353;
            } else {
                var self = U16$btw$(48, _chr$1, 57);
                if (self) {
                    var $355 = Bool$true;
                    var $354 = $355;
                } else {
                    var self = (46 === _chr$1);
                    if (self) {
                        var $357 = Bool$true;
                        var $356 = $357;
                    } else {
                        var self = (95 === _chr$1);
                        if (self) {
                            var $359 = Bool$true;
                            var $358 = $359;
                        } else {
                            var self = (94 === _chr$1);
                            if (self) {
                                var $361 = Bool$true;
                                var $360 = $361;
                            } else {
                                var $362 = Bool$false;
                                var $360 = $362;
                            };
                            var $358 = $360;
                        };
                        var $356 = $358;
                    };
                    var $354 = $356;
                };
                var $352 = $354;
            };
            var $350 = $352;
        };
        return $350;
    };
    const Kind$Name$is_letter = x0 => Kind$Name$is_letter$(x0);

    function Kind$Parser$letter$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $364 = Parser$Reply$error$(_idx$1, _code$2, "Unexpected eof.");
            var $363 = $364;
        } else {
            var $365 = self.charCodeAt(0);
            var $366 = self.slice(1);
            var self = Kind$Name$is_letter$($365);
            if (self) {
                var $368 = Parser$Reply$value$(Nat$succ$(_idx$1), $366, $365);
                var $367 = $368;
            } else {
                var $369 = Parser$Reply$error$(_idx$1, _code$2, "Expected letter.");
                var $367 = $369;
            };
            var $363 = $367;
        };
        return $363;
    };
    const Kind$Parser$letter = x0 => x1 => Kind$Parser$letter$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $371 = self.head;
                var $372 = self.tail;
                var $373 = _cons$5($371)(List$fold$($372, _nil$4, _cons$5));
                var $370 = $373;
                break;
            case 'List.nil':
                var $374 = _nil$4;
                var $370 = $374;
                break;
        };
        return $370;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Kind$Parser$name1$(_idx$1, _code$2) {
        var self = Kind$Parser$spaces(_idx$1)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $376 = self.idx;
                var $377 = self.code;
                var $378 = self.err;
                var $379 = Parser$Reply$error$($376, $377, $378);
                var $375 = $379;
                break;
            case 'Parser.Reply.value':
                var $380 = self.idx;
                var $381 = self.code;
                var self = Parser$many1$(Kind$Parser$letter, $380, $381);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $383 = self.idx;
                        var $384 = self.code;
                        var $385 = self.err;
                        var $386 = Parser$Reply$error$($383, $384, $385);
                        var $382 = $386;
                        break;
                    case 'Parser.Reply.value':
                        var $387 = self.idx;
                        var $388 = self.code;
                        var $389 = self.val;
                        var $390 = Parser$Reply$value$($387, $388, List$fold$($389, String$nil, String$cons));
                        var $382 = $390;
                        break;
                };
                var $375 = $382;
                break;
        };
        return $375;
    };
    const Kind$Parser$name1 = x0 => x1 => Kind$Parser$name1$(x0, x1);

    function Kind$Parser$text$(_text$1, _idx$2, _code$3) {
        var self = Kind$Parser$spaces(_idx$2)(_code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $392 = self.idx;
                var $393 = self.code;
                var $394 = self.err;
                var $395 = Parser$Reply$error$($392, $393, $394);
                var $391 = $395;
                break;
            case 'Parser.Reply.value':
                var $396 = self.idx;
                var $397 = self.code;
                var $398 = Parser$text$(_text$1, $396, $397);
                var $391 = $398;
                break;
        };
        return $391;
    };
    const Kind$Parser$text = x0 => x1 => x2 => Kind$Parser$text$(x0, x1, x2);

    function Parser$until1$(_cond$2, _parser$3, _idx$4, _code$5) {
        var self = _parser$3(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $400 = self.idx;
                var $401 = self.code;
                var $402 = self.err;
                var $403 = Parser$Reply$error$($400, $401, $402);
                var $399 = $403;
                break;
            case 'Parser.Reply.value':
                var $404 = self.idx;
                var $405 = self.code;
                var $406 = self.val;
                var self = Parser$until$(_cond$2, _parser$3)($404)($405);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $408 = self.idx;
                        var $409 = self.code;
                        var $410 = self.err;
                        var $411 = Parser$Reply$error$($408, $409, $410);
                        var $407 = $411;
                        break;
                    case 'Parser.Reply.value':
                        var $412 = self.idx;
                        var $413 = self.code;
                        var $414 = self.val;
                        var $415 = Parser$Reply$value$($412, $413, List$cons$($406, $414));
                        var $407 = $415;
                        break;
                };
                var $399 = $407;
                break;
        };
        return $399;
    };
    const Parser$until1 = x0 => x1 => x2 => x3 => Parser$until1$(x0, x1, x2, x3);

    function Pair$(_A$1, _B$2) {
        var $416 = null;
        return $416;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Parser$maybe$(_parse$2, _idx$3, _code$4) {
        var self = _parse$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.value':
                var $418 = self.idx;
                var $419 = self.code;
                var $420 = self.val;
                var $421 = Parser$Reply$value$($418, $419, Maybe$some$($420));
                var $417 = $421;
                break;
            case 'Parser.Reply.error':
                var $422 = Parser$Reply$value$(_idx$3, _code$4, Maybe$none);
                var $417 = $422;
                break;
        };
        return $417;
    };
    const Parser$maybe = x0 => x1 => x2 => Parser$maybe$(x0, x1, x2);

    function Kind$Parser$item$(_parser$2, _idx$3, _code$4) {
        var self = Kind$Parser$spaces(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $424 = self.idx;
                var $425 = self.code;
                var $426 = self.err;
                var $427 = Parser$Reply$error$($424, $425, $426);
                var $423 = $427;
                break;
            case 'Parser.Reply.value':
                var $428 = self.idx;
                var $429 = self.code;
                var self = _parser$2($428)($429);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $431 = self.idx;
                        var $432 = self.code;
                        var $433 = self.err;
                        var $434 = Parser$Reply$error$($431, $432, $433);
                        var $430 = $434;
                        break;
                    case 'Parser.Reply.value':
                        var $435 = self.idx;
                        var $436 = self.code;
                        var $437 = self.val;
                        var self = Parser$maybe$(Kind$Parser$text(","), $435, $436);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $439 = self.idx;
                                var $440 = self.code;
                                var $441 = self.err;
                                var $442 = Parser$Reply$error$($439, $440, $441);
                                var $438 = $442;
                                break;
                            case 'Parser.Reply.value':
                                var $443 = self.idx;
                                var $444 = self.code;
                                var $445 = Parser$Reply$value$($443, $444, $437);
                                var $438 = $445;
                                break;
                        };
                        var $430 = $438;
                        break;
                };
                var $423 = $430;
                break;
        };
        return $423;
    };
    const Kind$Parser$item = x0 => x1 => x2 => Kind$Parser$item$(x0, x1, x2);

    function Kind$Parser$name$(_idx$1, _code$2) {
        var self = Kind$Parser$spaces(_idx$1)(_code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $447 = self.idx;
                var $448 = self.code;
                var $449 = self.err;
                var $450 = Parser$Reply$error$($447, $448, $449);
                var $446 = $450;
                break;
            case 'Parser.Reply.value':
                var $451 = self.idx;
                var $452 = self.code;
                var self = Parser$many$(Kind$Parser$letter)($451)($452);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $454 = self.idx;
                        var $455 = self.code;
                        var $456 = self.err;
                        var $457 = Parser$Reply$error$($454, $455, $456);
                        var $453 = $457;
                        break;
                    case 'Parser.Reply.value':
                        var $458 = self.idx;
                        var $459 = self.code;
                        var $460 = self.val;
                        var $461 = Parser$Reply$value$($458, $459, List$fold$($460, String$nil, String$cons));
                        var $453 = $461;
                        break;
                };
                var $446 = $453;
                break;
        };
        return $446;
    };
    const Kind$Parser$name = x0 => x1 => Kind$Parser$name$(x0, x1);

    function Kind$Term$all$(_eras$1, _self$2, _name$3, _xtyp$4, _body$5) {
        var $462 = ({
            _: 'Kind.Term.all',
            'eras': _eras$1,
            'self': _self$2,
            'name': _name$3,
            'xtyp': _xtyp$4,
            'body': _body$5
        });
        return $462;
    };
    const Kind$Term$all = x0 => x1 => x2 => x3 => x4 => Kind$Term$all$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $463 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $463;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Kind$Parser$stop$(_from$1, _idx$2, _code$3) {
        var self = Parser$get_index$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $465 = self.idx;
                var $466 = self.code;
                var $467 = self.err;
                var $468 = Parser$Reply$error$($465, $466, $467);
                var $464 = $468;
                break;
            case 'Parser.Reply.value':
                var $469 = self.idx;
                var $470 = self.code;
                var $471 = self.val;
                var _orig$7 = Pair$new$(_from$1, $471);
                var $472 = Parser$Reply$value$($469, $470, _orig$7);
                var $464 = $472;
                break;
        };
        return $464;
    };
    const Kind$Parser$stop = x0 => x1 => x2 => Kind$Parser$stop$(x0, x1, x2);

    function Kind$Term$ori$(_orig$1, _expr$2) {
        var $473 = ({
            _: 'Kind.Term.ori',
            'orig': _orig$1,
            'expr': _expr$2
        });
        return $473;
    };
    const Kind$Term$ori = x0 => x1 => Kind$Term$ori$(x0, x1);

    function Kind$Parser$forall$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $475 = self.idx;
                var $476 = self.code;
                var $477 = self.err;
                var $478 = Parser$Reply$error$($475, $476, $477);
                var $474 = $478;
                break;
            case 'Parser.Reply.value':
                var $479 = self.idx;
                var $480 = self.code;
                var $481 = self.val;
                var self = Kind$Parser$name$($479, $480);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $483 = self.idx;
                        var $484 = self.code;
                        var $485 = self.err;
                        var $486 = Parser$Reply$error$($483, $484, $485);
                        var $482 = $486;
                        break;
                    case 'Parser.Reply.value':
                        var $487 = self.idx;
                        var $488 = self.code;
                        var $489 = self.val;
                        var self = Kind$Parser$binder$(":", $487, $488);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $491 = self.idx;
                                var $492 = self.code;
                                var $493 = self.err;
                                var $494 = Parser$Reply$error$($491, $492, $493);
                                var $490 = $494;
                                break;
                            case 'Parser.Reply.value':
                                var $495 = self.idx;
                                var $496 = self.code;
                                var $497 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text("->"), $495, $496);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $499 = self.idx;
                                        var $500 = self.code;
                                        var $501 = self.err;
                                        var $502 = Parser$Reply$error$($499, $500, $501);
                                        var $498 = $502;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $503 = self.idx;
                                        var $504 = self.code;
                                        var self = Kind$Parser$term$($503, $504);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $506 = self.idx;
                                                var $507 = self.code;
                                                var $508 = self.err;
                                                var $509 = Parser$Reply$error$($506, $507, $508);
                                                var $505 = $509;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $510 = self.idx;
                                                var $511 = self.code;
                                                var $512 = self.val;
                                                var _term$18 = List$fold$($497, $512, (_x$18 => _t$19 => {
                                                    var self = _x$18;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $515 = self.eras;
                                                            var $516 = self.name;
                                                            var $517 = self.term;
                                                            var $518 = Kind$Term$all$($515, "", $516, $517, (_s$23 => _x$24 => {
                                                                var $519 = _t$19;
                                                                return $519;
                                                            }));
                                                            var $514 = $518;
                                                            break;
                                                    };
                                                    return $514;
                                                }));
                                                var self = Kind$Parser$stop$($481, $510, $511);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $520 = self.idx;
                                                        var $521 = self.code;
                                                        var $522 = self.err;
                                                        var $523 = Parser$Reply$error$($520, $521, $522);
                                                        var $513 = $523;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $524 = self.idx;
                                                        var $525 = self.code;
                                                        var $526 = self.val;
                                                        var $527 = Parser$Reply$value$($524, $525, (() => {
                                                            var self = _term$18;
                                                            switch (self._) {
                                                                case 'Kind.Term.all':
                                                                    var $528 = self.eras;
                                                                    var $529 = self.name;
                                                                    var $530 = self.xtyp;
                                                                    var $531 = self.body;
                                                                    var $532 = Kind$Term$ori$($526, Kind$Term$all$($528, $489, $529, $530, $531));
                                                                    return $532;
                                                                case 'Kind.Term.var':
                                                                case 'Kind.Term.ref':
                                                                case 'Kind.Term.typ':
                                                                case 'Kind.Term.lam':
                                                                case 'Kind.Term.app':
                                                                case 'Kind.Term.let':
                                                                case 'Kind.Term.def':
                                                                case 'Kind.Term.ann':
                                                                case 'Kind.Term.gol':
                                                                case 'Kind.Term.hol':
                                                                case 'Kind.Term.nat':
                                                                case 'Kind.Term.chr':
                                                                case 'Kind.Term.str':
                                                                case 'Kind.Term.cse':
                                                                case 'Kind.Term.ori':
                                                                    var $533 = _term$18;
                                                                    return $533;
                                                            };
                                                        })());
                                                        var $513 = $527;
                                                        break;
                                                };
                                                var $505 = $513;
                                                break;
                                        };
                                        var $498 = $505;
                                        break;
                                };
                                var $490 = $498;
                                break;
                        };
                        var $482 = $490;
                        break;
                };
                var $474 = $482;
                break;
        };
        return $474;
    };
    const Kind$Parser$forall = x0 => x1 => Kind$Parser$forall$(x0, x1);

    function Kind$Term$lam$(_name$1, _body$2) {
        var $534 = ({
            _: 'Kind.Term.lam',
            'name': _name$1,
            'body': _body$2
        });
        return $534;
    };
    const Kind$Term$lam = x0 => x1 => Kind$Term$lam$(x0, x1);

    function Kind$Parser$make_lambda$(_names$1, _body$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $536 = self.head;
                var $537 = self.tail;
                var $538 = Kind$Term$lam$($536, (_x$5 => {
                    var $539 = Kind$Parser$make_lambda$($537, _body$2);
                    return $539;
                }));
                var $535 = $538;
                break;
            case 'List.nil':
                var $540 = _body$2;
                var $535 = $540;
                break;
        };
        return $535;
    };
    const Kind$Parser$make_lambda = x0 => x1 => Kind$Parser$make_lambda$(x0, x1);

    function Kind$Parser$lambda$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $542 = self.idx;
                var $543 = self.code;
                var $544 = self.err;
                var $545 = Parser$Reply$error$($542, $543, $544);
                var $541 = $545;
                break;
            case 'Parser.Reply.value':
                var $546 = self.idx;
                var $547 = self.code;
                var $548 = self.val;
                var self = Kind$Parser$text$("(", $546, $547);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $550 = self.idx;
                        var $551 = self.code;
                        var $552 = self.err;
                        var $553 = Parser$Reply$error$($550, $551, $552);
                        var $549 = $553;
                        break;
                    case 'Parser.Reply.value':
                        var $554 = self.idx;
                        var $555 = self.code;
                        var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$name1), $554, $555);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $557 = self.idx;
                                var $558 = self.code;
                                var $559 = self.err;
                                var $560 = Parser$Reply$error$($557, $558, $559);
                                var $556 = $560;
                                break;
                            case 'Parser.Reply.value':
                                var $561 = self.idx;
                                var $562 = self.code;
                                var $563 = self.val;
                                var self = Kind$Parser$term$($561, $562);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $565 = self.idx;
                                        var $566 = self.code;
                                        var $567 = self.err;
                                        var $568 = Parser$Reply$error$($565, $566, $567);
                                        var $564 = $568;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $569 = self.idx;
                                        var $570 = self.code;
                                        var $571 = self.val;
                                        var self = Kind$Parser$stop$($548, $569, $570);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $573 = self.idx;
                                                var $574 = self.code;
                                                var $575 = self.err;
                                                var $576 = Parser$Reply$error$($573, $574, $575);
                                                var $572 = $576;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $577 = self.idx;
                                                var $578 = self.code;
                                                var $579 = self.val;
                                                var _expr$18 = Kind$Parser$make_lambda$($563, $571);
                                                var $580 = Parser$Reply$value$($577, $578, Kind$Term$ori$($579, _expr$18));
                                                var $572 = $580;
                                                break;
                                        };
                                        var $564 = $572;
                                        break;
                                };
                                var $556 = $564;
                                break;
                        };
                        var $549 = $556;
                        break;
                };
                var $541 = $549;
                break;
        };
        return $541;
    };
    const Kind$Parser$lambda = x0 => x1 => Kind$Parser$lambda$(x0, x1);

    function Kind$Parser$lambda$erased$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $582 = self.idx;
                var $583 = self.code;
                var $584 = self.err;
                var $585 = Parser$Reply$error$($582, $583, $584);
                var $581 = $585;
                break;
            case 'Parser.Reply.value':
                var $586 = self.idx;
                var $587 = self.code;
                var $588 = self.val;
                var self = Kind$Parser$text$("<", $586, $587);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $590 = self.idx;
                        var $591 = self.code;
                        var $592 = self.err;
                        var $593 = Parser$Reply$error$($590, $591, $592);
                        var $589 = $593;
                        break;
                    case 'Parser.Reply.value':
                        var $594 = self.idx;
                        var $595 = self.code;
                        var self = Parser$until1$(Kind$Parser$text(">"), Kind$Parser$item(Kind$Parser$name1), $594, $595);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $597 = self.idx;
                                var $598 = self.code;
                                var $599 = self.err;
                                var $600 = Parser$Reply$error$($597, $598, $599);
                                var $596 = $600;
                                break;
                            case 'Parser.Reply.value':
                                var $601 = self.idx;
                                var $602 = self.code;
                                var $603 = self.val;
                                var self = Kind$Parser$term$($601, $602);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $605 = self.idx;
                                        var $606 = self.code;
                                        var $607 = self.err;
                                        var $608 = Parser$Reply$error$($605, $606, $607);
                                        var $604 = $608;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $609 = self.idx;
                                        var $610 = self.code;
                                        var $611 = self.val;
                                        var self = Kind$Parser$stop$($588, $609, $610);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $613 = self.idx;
                                                var $614 = self.code;
                                                var $615 = self.err;
                                                var $616 = Parser$Reply$error$($613, $614, $615);
                                                var $612 = $616;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $617 = self.idx;
                                                var $618 = self.code;
                                                var $619 = self.val;
                                                var _expr$18 = Kind$Parser$make_lambda$($603, $611);
                                                var $620 = Parser$Reply$value$($617, $618, Kind$Term$ori$($619, _expr$18));
                                                var $612 = $620;
                                                break;
                                        };
                                        var $604 = $612;
                                        break;
                                };
                                var $596 = $604;
                                break;
                        };
                        var $589 = $596;
                        break;
                };
                var $581 = $589;
                break;
        };
        return $581;
    };
    const Kind$Parser$lambda$erased = x0 => x1 => Kind$Parser$lambda$erased$(x0, x1);

    function Kind$Parser$lambda$nameless$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $622 = self.idx;
                var $623 = self.code;
                var $624 = self.err;
                var $625 = Parser$Reply$error$($622, $623, $624);
                var $621 = $625;
                break;
            case 'Parser.Reply.value':
                var $626 = self.idx;
                var $627 = self.code;
                var $628 = self.val;
                var self = Kind$Parser$text$("()", $626, $627);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $630 = self.idx;
                        var $631 = self.code;
                        var $632 = self.err;
                        var $633 = Parser$Reply$error$($630, $631, $632);
                        var $629 = $633;
                        break;
                    case 'Parser.Reply.value':
                        var $634 = self.idx;
                        var $635 = self.code;
                        var self = Kind$Parser$term$($634, $635);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $637 = self.idx;
                                var $638 = self.code;
                                var $639 = self.err;
                                var $640 = Parser$Reply$error$($637, $638, $639);
                                var $636 = $640;
                                break;
                            case 'Parser.Reply.value':
                                var $641 = self.idx;
                                var $642 = self.code;
                                var $643 = self.val;
                                var self = Kind$Parser$stop$($628, $641, $642);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $645 = self.idx;
                                        var $646 = self.code;
                                        var $647 = self.err;
                                        var $648 = Parser$Reply$error$($645, $646, $647);
                                        var $644 = $648;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $649 = self.idx;
                                        var $650 = self.code;
                                        var $651 = self.val;
                                        var _expr$15 = Kind$Term$lam$("", (_x$15 => {
                                            var $653 = $643;
                                            return $653;
                                        }));
                                        var $652 = Parser$Reply$value$($649, $650, Kind$Term$ori$($651, _expr$15));
                                        var $644 = $652;
                                        break;
                                };
                                var $636 = $644;
                                break;
                        };
                        var $629 = $636;
                        break;
                };
                var $621 = $629;
                break;
        };
        return $621;
    };
    const Kind$Parser$lambda$nameless = x0 => x1 => Kind$Parser$lambda$nameless$(x0, x1);

    function Kind$Parser$parenthesis$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("(", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $655 = self.idx;
                var $656 = self.code;
                var $657 = self.err;
                var $658 = Parser$Reply$error$($655, $656, $657);
                var $654 = $658;
                break;
            case 'Parser.Reply.value':
                var $659 = self.idx;
                var $660 = self.code;
                var self = Kind$Parser$term$($659, $660);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $662 = self.idx;
                        var $663 = self.code;
                        var $664 = self.err;
                        var $665 = Parser$Reply$error$($662, $663, $664);
                        var $661 = $665;
                        break;
                    case 'Parser.Reply.value':
                        var $666 = self.idx;
                        var $667 = self.code;
                        var $668 = self.val;
                        var self = Kind$Parser$text$(")", $666, $667);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $670 = self.idx;
                                var $671 = self.code;
                                var $672 = self.err;
                                var $673 = Parser$Reply$error$($670, $671, $672);
                                var $669 = $673;
                                break;
                            case 'Parser.Reply.value':
                                var $674 = self.idx;
                                var $675 = self.code;
                                var $676 = Parser$Reply$value$($674, $675, $668);
                                var $669 = $676;
                                break;
                        };
                        var $661 = $669;
                        break;
                };
                var $654 = $661;
                break;
        };
        return $654;
    };
    const Kind$Parser$parenthesis = x0 => x1 => Kind$Parser$parenthesis$(x0, x1);

    function Kind$Term$ref$(_name$1) {
        var $677 = ({
            _: 'Kind.Term.ref',
            'name': _name$1
        });
        return $677;
    };
    const Kind$Term$ref = x0 => Kind$Term$ref$(x0);

    function Kind$Term$app$(_func$1, _argm$2) {
        var $678 = ({
            _: 'Kind.Term.app',
            'func': _func$1,
            'argm': _argm$2
        });
        return $678;
    };
    const Kind$Term$app = x0 => x1 => Kind$Term$app$(x0, x1);

    function Kind$Term$hol$(_path$1) {
        var $679 = ({
            _: 'Kind.Term.hol',
            'path': _path$1
        });
        return $679;
    };
    const Kind$Term$hol = x0 => Kind$Term$hol$(x0);

    function Kind$Term$let$(_name$1, _expr$2, _body$3) {
        var $680 = ({
            _: 'Kind.Term.let',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $680;
    };
    const Kind$Term$let = x0 => x1 => x2 => Kind$Term$let$(x0, x1, x2);

    function Kind$Parser$letforrange$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $682 = self.idx;
                var $683 = self.code;
                var $684 = self.err;
                var $685 = Parser$Reply$error$($682, $683, $684);
                var $681 = $685;
                break;
            case 'Parser.Reply.value':
                var $686 = self.idx;
                var $687 = self.code;
                var $688 = self.val;
                var self = Kind$Parser$text$("let ", $686, $687);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $690 = self.idx;
                        var $691 = self.code;
                        var $692 = self.err;
                        var $693 = Parser$Reply$error$($690, $691, $692);
                        var $689 = $693;
                        break;
                    case 'Parser.Reply.value':
                        var $694 = self.idx;
                        var $695 = self.code;
                        var self = Kind$Parser$name1$($694, $695);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $697 = self.idx;
                                var $698 = self.code;
                                var $699 = self.err;
                                var $700 = Parser$Reply$error$($697, $698, $699);
                                var $696 = $700;
                                break;
                            case 'Parser.Reply.value':
                                var $701 = self.idx;
                                var $702 = self.code;
                                var $703 = self.val;
                                var self = Kind$Parser$text$("=", $701, $702);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $705 = self.idx;
                                        var $706 = self.code;
                                        var $707 = self.err;
                                        var $708 = Parser$Reply$error$($705, $706, $707);
                                        var $704 = $708;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $709 = self.idx;
                                        var $710 = self.code;
                                        var self = Kind$Parser$text$("for ", $709, $710);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $712 = self.idx;
                                                var $713 = self.code;
                                                var $714 = self.err;
                                                var $715 = Parser$Reply$error$($712, $713, $714);
                                                var $711 = $715;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $716 = self.idx;
                                                var $717 = self.code;
                                                var self = Kind$Parser$name1$($716, $717);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $719 = self.idx;
                                                        var $720 = self.code;
                                                        var $721 = self.err;
                                                        var $722 = Parser$Reply$error$($719, $720, $721);
                                                        var $718 = $722;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $723 = self.idx;
                                                        var $724 = self.code;
                                                        var $725 = self.val;
                                                        var self = Kind$Parser$text$(":", $723, $724);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $727 = self.idx;
                                                                var $728 = self.code;
                                                                var $729 = self.err;
                                                                var $730 = Parser$Reply$error$($727, $728, $729);
                                                                var $726 = $730;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $731 = self.idx;
                                                                var $732 = self.code;
                                                                var self = Kind$Parser$text$("U32", $731, $732);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $734 = self.idx;
                                                                        var $735 = self.code;
                                                                        var $736 = self.err;
                                                                        var $737 = Parser$Reply$error$($734, $735, $736);
                                                                        var $733 = $737;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $738 = self.idx;
                                                                        var $739 = self.code;
                                                                        var self = Kind$Parser$text$("from", $738, $739);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $741 = self.idx;
                                                                                var $742 = self.code;
                                                                                var $743 = self.err;
                                                                                var $744 = Parser$Reply$error$($741, $742, $743);
                                                                                var $740 = $744;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $745 = self.idx;
                                                                                var $746 = self.code;
                                                                                var self = Kind$Parser$term$($745, $746);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $748 = self.idx;
                                                                                        var $749 = self.code;
                                                                                        var $750 = self.err;
                                                                                        var $751 = Parser$Reply$error$($748, $749, $750);
                                                                                        var $747 = $751;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $752 = self.idx;
                                                                                        var $753 = self.code;
                                                                                        var $754 = self.val;
                                                                                        var self = Kind$Parser$text$("to", $752, $753);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $756 = self.idx;
                                                                                                var $757 = self.code;
                                                                                                var $758 = self.err;
                                                                                                var $759 = Parser$Reply$error$($756, $757, $758);
                                                                                                var $755 = $759;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $760 = self.idx;
                                                                                                var $761 = self.code;
                                                                                                var self = Kind$Parser$term$($760, $761);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $763 = self.idx;
                                                                                                        var $764 = self.code;
                                                                                                        var $765 = self.err;
                                                                                                        var $766 = Parser$Reply$error$($763, $764, $765);
                                                                                                        var $762 = $766;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $767 = self.idx;
                                                                                                        var $768 = self.code;
                                                                                                        var $769 = self.val;
                                                                                                        var self = Kind$Parser$text$(":", $767, $768);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $771 = self.idx;
                                                                                                                var $772 = self.code;
                                                                                                                var $773 = self.err;
                                                                                                                var $774 = Parser$Reply$error$($771, $772, $773);
                                                                                                                var $770 = $774;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $775 = self.idx;
                                                                                                                var $776 = self.code;
                                                                                                                var self = Kind$Parser$term$($775, $776);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $778 = self.idx;
                                                                                                                        var $779 = self.code;
                                                                                                                        var $780 = self.err;
                                                                                                                        var $781 = Parser$Reply$error$($778, $779, $780);
                                                                                                                        var $777 = $781;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $782 = self.idx;
                                                                                                                        var $783 = self.code;
                                                                                                                        var $784 = self.val;
                                                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $782, $783);
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                var $786 = self.idx;
                                                                                                                                var $787 = self.code;
                                                                                                                                var $788 = self.err;
                                                                                                                                var $789 = Parser$Reply$error$($786, $787, $788);
                                                                                                                                var $785 = $789;
                                                                                                                                break;
                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                var $790 = self.idx;
                                                                                                                                var $791 = self.code;
                                                                                                                                var self = Kind$Parser$term$($790, $791);
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                        var $793 = self.idx;
                                                                                                                                        var $794 = self.code;
                                                                                                                                        var $795 = self.err;
                                                                                                                                        var $796 = Parser$Reply$error$($793, $794, $795);
                                                                                                                                        var $792 = $796;
                                                                                                                                        break;
                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                        var $797 = self.idx;
                                                                                                                                        var $798 = self.code;
                                                                                                                                        var $799 = self.val;
                                                                                                                                        var self = Kind$Parser$stop$($688, $797, $798);
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $801 = self.idx;
                                                                                                                                                var $802 = self.code;
                                                                                                                                                var $803 = self.err;
                                                                                                                                                var $804 = Parser$Reply$error$($801, $802, $803);
                                                                                                                                                var $800 = $804;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $805 = self.idx;
                                                                                                                                                var $806 = self.code;
                                                                                                                                                var $807 = self.val;
                                                                                                                                                var _term$54 = Kind$Term$ref$("U32.for");
                                                                                                                                                var _term$55 = Kind$Term$app$(_term$54, Kind$Term$hol$(Bits$e));
                                                                                                                                                var _term$56 = Kind$Term$app$(_term$55, Kind$Term$ref$($703));
                                                                                                                                                var _term$57 = Kind$Term$app$(_term$56, $754);
                                                                                                                                                var _term$58 = Kind$Term$app$(_term$57, $769);
                                                                                                                                                var _lamb$59 = Kind$Term$lam$($725, (_e$59 => {
                                                                                                                                                    var $809 = Kind$Term$lam$($703, (_s$60 => {
                                                                                                                                                        var $810 = $784;
                                                                                                                                                        return $810;
                                                                                                                                                    }));
                                                                                                                                                    return $809;
                                                                                                                                                }));
                                                                                                                                                var _term$60 = Kind$Term$app$(_term$58, _lamb$59);
                                                                                                                                                var _term$61 = Kind$Term$let$($703, _term$60, (_x$61 => {
                                                                                                                                                    var $811 = $799;
                                                                                                                                                    return $811;
                                                                                                                                                }));
                                                                                                                                                var $808 = Parser$Reply$value$($805, $806, Kind$Term$ori$($807, _term$61));
                                                                                                                                                var $800 = $808;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $792 = $800;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $785 = $792;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $777 = $785;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $770 = $777;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $762 = $770;
                                                                                                        break;
                                                                                                };
                                                                                                var $755 = $762;
                                                                                                break;
                                                                                        };
                                                                                        var $747 = $755;
                                                                                        break;
                                                                                };
                                                                                var $740 = $747;
                                                                                break;
                                                                        };
                                                                        var $733 = $740;
                                                                        break;
                                                                };
                                                                var $726 = $733;
                                                                break;
                                                        };
                                                        var $718 = $726;
                                                        break;
                                                };
                                                var $711 = $718;
                                                break;
                                        };
                                        var $704 = $711;
                                        break;
                                };
                                var $696 = $704;
                                break;
                        };
                        var $689 = $696;
                        break;
                };
                var $681 = $689;
                break;
        };
        return $681;
    };
    const Kind$Parser$letforrange$u32 = x0 => x1 => Kind$Parser$letforrange$u32$(x0, x1);

    function Kind$Parser$letforrange$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $813 = self.idx;
                var $814 = self.code;
                var $815 = self.err;
                var $816 = Parser$Reply$error$($813, $814, $815);
                var $812 = $816;
                break;
            case 'Parser.Reply.value':
                var $817 = self.idx;
                var $818 = self.code;
                var $819 = self.val;
                var self = Kind$Parser$text$("let ", $817, $818);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $821 = self.idx;
                        var $822 = self.code;
                        var $823 = self.err;
                        var $824 = Parser$Reply$error$($821, $822, $823);
                        var $820 = $824;
                        break;
                    case 'Parser.Reply.value':
                        var $825 = self.idx;
                        var $826 = self.code;
                        var self = Kind$Parser$name1$($825, $826);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $828 = self.idx;
                                var $829 = self.code;
                                var $830 = self.err;
                                var $831 = Parser$Reply$error$($828, $829, $830);
                                var $827 = $831;
                                break;
                            case 'Parser.Reply.value':
                                var $832 = self.idx;
                                var $833 = self.code;
                                var $834 = self.val;
                                var self = Kind$Parser$text$("=", $832, $833);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $836 = self.idx;
                                        var $837 = self.code;
                                        var $838 = self.err;
                                        var $839 = Parser$Reply$error$($836, $837, $838);
                                        var $835 = $839;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $840 = self.idx;
                                        var $841 = self.code;
                                        var self = Kind$Parser$text$("for ", $840, $841);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $843 = self.idx;
                                                var $844 = self.code;
                                                var $845 = self.err;
                                                var $846 = Parser$Reply$error$($843, $844, $845);
                                                var $842 = $846;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $847 = self.idx;
                                                var $848 = self.code;
                                                var self = Kind$Parser$name1$($847, $848);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $850 = self.idx;
                                                        var $851 = self.code;
                                                        var $852 = self.err;
                                                        var $853 = Parser$Reply$error$($850, $851, $852);
                                                        var $849 = $853;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $854 = self.idx;
                                                        var $855 = self.code;
                                                        var $856 = self.val;
                                                        var self = Kind$Parser$text$("from", $854, $855);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $858 = self.idx;
                                                                var $859 = self.code;
                                                                var $860 = self.err;
                                                                var $861 = Parser$Reply$error$($858, $859, $860);
                                                                var $857 = $861;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $862 = self.idx;
                                                                var $863 = self.code;
                                                                var self = Kind$Parser$term$($862, $863);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $865 = self.idx;
                                                                        var $866 = self.code;
                                                                        var $867 = self.err;
                                                                        var $868 = Parser$Reply$error$($865, $866, $867);
                                                                        var $864 = $868;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $869 = self.idx;
                                                                        var $870 = self.code;
                                                                        var $871 = self.val;
                                                                        var self = Kind$Parser$text$("to", $869, $870);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $873 = self.idx;
                                                                                var $874 = self.code;
                                                                                var $875 = self.err;
                                                                                var $876 = Parser$Reply$error$($873, $874, $875);
                                                                                var $872 = $876;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $877 = self.idx;
                                                                                var $878 = self.code;
                                                                                var self = Kind$Parser$term$($877, $878);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $880 = self.idx;
                                                                                        var $881 = self.code;
                                                                                        var $882 = self.err;
                                                                                        var $883 = Parser$Reply$error$($880, $881, $882);
                                                                                        var $879 = $883;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $884 = self.idx;
                                                                                        var $885 = self.code;
                                                                                        var $886 = self.val;
                                                                                        var self = Kind$Parser$text$(":", $884, $885);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $888 = self.idx;
                                                                                                var $889 = self.code;
                                                                                                var $890 = self.err;
                                                                                                var $891 = Parser$Reply$error$($888, $889, $890);
                                                                                                var $887 = $891;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $892 = self.idx;
                                                                                                var $893 = self.code;
                                                                                                var self = Kind$Parser$term$($892, $893);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $895 = self.idx;
                                                                                                        var $896 = self.code;
                                                                                                        var $897 = self.err;
                                                                                                        var $898 = Parser$Reply$error$($895, $896, $897);
                                                                                                        var $894 = $898;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $899 = self.idx;
                                                                                                        var $900 = self.code;
                                                                                                        var $901 = self.val;
                                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $899, $900);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $903 = self.idx;
                                                                                                                var $904 = self.code;
                                                                                                                var $905 = self.err;
                                                                                                                var $906 = Parser$Reply$error$($903, $904, $905);
                                                                                                                var $902 = $906;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $907 = self.idx;
                                                                                                                var $908 = self.code;
                                                                                                                var self = Kind$Parser$term$($907, $908);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $910 = self.idx;
                                                                                                                        var $911 = self.code;
                                                                                                                        var $912 = self.err;
                                                                                                                        var $913 = Parser$Reply$error$($910, $911, $912);
                                                                                                                        var $909 = $913;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $914 = self.idx;
                                                                                                                        var $915 = self.code;
                                                                                                                        var $916 = self.val;
                                                                                                                        var self = Kind$Parser$stop$($819, $914, $915);
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                var $918 = self.idx;
                                                                                                                                var $919 = self.code;
                                                                                                                                var $920 = self.err;
                                                                                                                                var $921 = Parser$Reply$error$($918, $919, $920);
                                                                                                                                var $917 = $921;
                                                                                                                                break;
                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                var $922 = self.idx;
                                                                                                                                var $923 = self.code;
                                                                                                                                var $924 = self.val;
                                                                                                                                var _term$48 = Kind$Term$ref$("Nat.for");
                                                                                                                                var _term$49 = Kind$Term$app$(_term$48, Kind$Term$hol$(Bits$e));
                                                                                                                                var _term$50 = Kind$Term$app$(_term$49, Kind$Term$ref$($834));
                                                                                                                                var _term$51 = Kind$Term$app$(_term$50, $871);
                                                                                                                                var _term$52 = Kind$Term$app$(_term$51, $886);
                                                                                                                                var _lamb$53 = Kind$Term$lam$($856, (_e$53 => {
                                                                                                                                    var $926 = Kind$Term$lam$($834, (_s$54 => {
                                                                                                                                        var $927 = $901;
                                                                                                                                        return $927;
                                                                                                                                    }));
                                                                                                                                    return $926;
                                                                                                                                }));
                                                                                                                                var _term$54 = Kind$Term$app$(_term$52, _lamb$53);
                                                                                                                                var _term$55 = Kind$Term$let$($834, _term$54, (_x$55 => {
                                                                                                                                    var $928 = $916;
                                                                                                                                    return $928;
                                                                                                                                }));
                                                                                                                                var $925 = Parser$Reply$value$($922, $923, Kind$Term$ori$($924, _term$55));
                                                                                                                                var $917 = $925;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $909 = $917;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $902 = $909;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $894 = $902;
                                                                                                        break;
                                                                                                };
                                                                                                var $887 = $894;
                                                                                                break;
                                                                                        };
                                                                                        var $879 = $887;
                                                                                        break;
                                                                                };
                                                                                var $872 = $879;
                                                                                break;
                                                                        };
                                                                        var $864 = $872;
                                                                        break;
                                                                };
                                                                var $857 = $864;
                                                                break;
                                                        };
                                                        var $849 = $857;
                                                        break;
                                                };
                                                var $842 = $849;
                                                break;
                                        };
                                        var $835 = $842;
                                        break;
                                };
                                var $827 = $835;
                                break;
                        };
                        var $820 = $827;
                        break;
                };
                var $812 = $820;
                break;
        };
        return $812;
    };
    const Kind$Parser$letforrange$nat = x0 => x1 => Kind$Parser$letforrange$nat$(x0, x1);

    function Kind$Parser$letforin$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $930 = self.idx;
                var $931 = self.code;
                var $932 = self.err;
                var $933 = Parser$Reply$error$($930, $931, $932);
                var $929 = $933;
                break;
            case 'Parser.Reply.value':
                var $934 = self.idx;
                var $935 = self.code;
                var $936 = self.val;
                var self = Kind$Parser$text$("let ", $934, $935);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $938 = self.idx;
                        var $939 = self.code;
                        var $940 = self.err;
                        var $941 = Parser$Reply$error$($938, $939, $940);
                        var $937 = $941;
                        break;
                    case 'Parser.Reply.value':
                        var $942 = self.idx;
                        var $943 = self.code;
                        var self = Kind$Parser$name1$($942, $943);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $945 = self.idx;
                                var $946 = self.code;
                                var $947 = self.err;
                                var $948 = Parser$Reply$error$($945, $946, $947);
                                var $944 = $948;
                                break;
                            case 'Parser.Reply.value':
                                var $949 = self.idx;
                                var $950 = self.code;
                                var $951 = self.val;
                                var self = Kind$Parser$text$("=", $949, $950);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $953 = self.idx;
                                        var $954 = self.code;
                                        var $955 = self.err;
                                        var $956 = Parser$Reply$error$($953, $954, $955);
                                        var $952 = $956;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $957 = self.idx;
                                        var $958 = self.code;
                                        var self = Kind$Parser$text$("for ", $957, $958);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $960 = self.idx;
                                                var $961 = self.code;
                                                var $962 = self.err;
                                                var $963 = Parser$Reply$error$($960, $961, $962);
                                                var $959 = $963;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $964 = self.idx;
                                                var $965 = self.code;
                                                var self = Kind$Parser$name1$($964, $965);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $967 = self.idx;
                                                        var $968 = self.code;
                                                        var $969 = self.err;
                                                        var $970 = Parser$Reply$error$($967, $968, $969);
                                                        var $966 = $970;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $971 = self.idx;
                                                        var $972 = self.code;
                                                        var $973 = self.val;
                                                        var self = Kind$Parser$text$("in", $971, $972);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $975 = self.idx;
                                                                var $976 = self.code;
                                                                var $977 = self.err;
                                                                var $978 = Parser$Reply$error$($975, $976, $977);
                                                                var $974 = $978;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $979 = self.idx;
                                                                var $980 = self.code;
                                                                var self = Kind$Parser$term$($979, $980);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $982 = self.idx;
                                                                        var $983 = self.code;
                                                                        var $984 = self.err;
                                                                        var $985 = Parser$Reply$error$($982, $983, $984);
                                                                        var $981 = $985;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $986 = self.idx;
                                                                        var $987 = self.code;
                                                                        var $988 = self.val;
                                                                        var self = Kind$Parser$text$(":", $986, $987);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $990 = self.idx;
                                                                                var $991 = self.code;
                                                                                var $992 = self.err;
                                                                                var $993 = Parser$Reply$error$($990, $991, $992);
                                                                                var $989 = $993;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $994 = self.idx;
                                                                                var $995 = self.code;
                                                                                var self = Kind$Parser$term$($994, $995);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $997 = self.idx;
                                                                                        var $998 = self.code;
                                                                                        var $999 = self.err;
                                                                                        var $1000 = Parser$Reply$error$($997, $998, $999);
                                                                                        var $996 = $1000;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1001 = self.idx;
                                                                                        var $1002 = self.code;
                                                                                        var $1003 = self.val;
                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $1001, $1002);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1005 = self.idx;
                                                                                                var $1006 = self.code;
                                                                                                var $1007 = self.err;
                                                                                                var $1008 = Parser$Reply$error$($1005, $1006, $1007);
                                                                                                var $1004 = $1008;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1009 = self.idx;
                                                                                                var $1010 = self.code;
                                                                                                var self = Kind$Parser$term$($1009, $1010);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1012 = self.idx;
                                                                                                        var $1013 = self.code;
                                                                                                        var $1014 = self.err;
                                                                                                        var $1015 = Parser$Reply$error$($1012, $1013, $1014);
                                                                                                        var $1011 = $1015;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1016 = self.idx;
                                                                                                        var $1017 = self.code;
                                                                                                        var $1018 = self.val;
                                                                                                        var self = Kind$Parser$stop$($936, $1016, $1017);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $1020 = self.idx;
                                                                                                                var $1021 = self.code;
                                                                                                                var $1022 = self.err;
                                                                                                                var $1023 = Parser$Reply$error$($1020, $1021, $1022);
                                                                                                                var $1019 = $1023;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $1024 = self.idx;
                                                                                                                var $1025 = self.code;
                                                                                                                var $1026 = self.val;
                                                                                                                var _term$42 = Kind$Term$ref$("List.for");
                                                                                                                var _term$43 = Kind$Term$app$(_term$42, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$44 = Kind$Term$app$(_term$43, $988);
                                                                                                                var _term$45 = Kind$Term$app$(_term$44, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$46 = Kind$Term$app$(_term$45, Kind$Term$ref$($951));
                                                                                                                var _lamb$47 = Kind$Term$lam$($973, (_i$47 => {
                                                                                                                    var $1028 = Kind$Term$lam$($951, (_x$48 => {
                                                                                                                        var $1029 = $1003;
                                                                                                                        return $1029;
                                                                                                                    }));
                                                                                                                    return $1028;
                                                                                                                }));
                                                                                                                var _term$48 = Kind$Term$app$(_term$46, _lamb$47);
                                                                                                                var _term$49 = Kind$Term$let$($951, _term$48, (_x$49 => {
                                                                                                                    var $1030 = $1018;
                                                                                                                    return $1030;
                                                                                                                }));
                                                                                                                var $1027 = Parser$Reply$value$($1024, $1025, Kind$Term$ori$($1026, _term$49));
                                                                                                                var $1019 = $1027;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1011 = $1019;
                                                                                                        break;
                                                                                                };
                                                                                                var $1004 = $1011;
                                                                                                break;
                                                                                        };
                                                                                        var $996 = $1004;
                                                                                        break;
                                                                                };
                                                                                var $989 = $996;
                                                                                break;
                                                                        };
                                                                        var $981 = $989;
                                                                        break;
                                                                };
                                                                var $974 = $981;
                                                                break;
                                                        };
                                                        var $966 = $974;
                                                        break;
                                                };
                                                var $959 = $966;
                                                break;
                                        };
                                        var $952 = $959;
                                        break;
                                };
                                var $944 = $952;
                                break;
                        };
                        var $937 = $944;
                        break;
                };
                var $929 = $937;
                break;
        };
        return $929;
    };
    const Kind$Parser$letforin = x0 => x1 => Kind$Parser$letforin$(x0, x1);

    function Kind$Parser$let$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1032 = self.idx;
                var $1033 = self.code;
                var $1034 = self.err;
                var $1035 = Parser$Reply$error$($1032, $1033, $1034);
                var $1031 = $1035;
                break;
            case 'Parser.Reply.value':
                var $1036 = self.idx;
                var $1037 = self.code;
                var $1038 = self.val;
                var self = Kind$Parser$text$("let ", $1036, $1037);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1040 = self.idx;
                        var $1041 = self.code;
                        var $1042 = self.err;
                        var $1043 = Parser$Reply$error$($1040, $1041, $1042);
                        var $1039 = $1043;
                        break;
                    case 'Parser.Reply.value':
                        var $1044 = self.idx;
                        var $1045 = self.code;
                        var self = Kind$Parser$name$($1044, $1045);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1047 = self.idx;
                                var $1048 = self.code;
                                var $1049 = self.err;
                                var $1050 = Parser$Reply$error$($1047, $1048, $1049);
                                var $1046 = $1050;
                                break;
                            case 'Parser.Reply.value':
                                var $1051 = self.idx;
                                var $1052 = self.code;
                                var $1053 = self.val;
                                var self = Kind$Parser$text$("=", $1051, $1052);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1055 = self.idx;
                                        var $1056 = self.code;
                                        var $1057 = self.err;
                                        var $1058 = Parser$Reply$error$($1055, $1056, $1057);
                                        var $1054 = $1058;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1059 = self.idx;
                                        var $1060 = self.code;
                                        var self = Kind$Parser$term$($1059, $1060);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1062 = self.idx;
                                                var $1063 = self.code;
                                                var $1064 = self.err;
                                                var $1065 = Parser$Reply$error$($1062, $1063, $1064);
                                                var $1061 = $1065;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1066 = self.idx;
                                                var $1067 = self.code;
                                                var $1068 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1066, $1067);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1070 = self.idx;
                                                        var $1071 = self.code;
                                                        var $1072 = self.err;
                                                        var $1073 = Parser$Reply$error$($1070, $1071, $1072);
                                                        var $1069 = $1073;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1074 = self.idx;
                                                        var $1075 = self.code;
                                                        var self = Kind$Parser$term$($1074, $1075);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1077 = self.idx;
                                                                var $1078 = self.code;
                                                                var $1079 = self.err;
                                                                var $1080 = Parser$Reply$error$($1077, $1078, $1079);
                                                                var $1076 = $1080;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1081 = self.idx;
                                                                var $1082 = self.code;
                                                                var $1083 = self.val;
                                                                var self = Kind$Parser$stop$($1038, $1081, $1082);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1085 = self.idx;
                                                                        var $1086 = self.code;
                                                                        var $1087 = self.err;
                                                                        var $1088 = Parser$Reply$error$($1085, $1086, $1087);
                                                                        var $1084 = $1088;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1089 = self.idx;
                                                                        var $1090 = self.code;
                                                                        var $1091 = self.val;
                                                                        var $1092 = Parser$Reply$value$($1089, $1090, Kind$Term$ori$($1091, Kind$Term$let$($1053, $1068, (_x$27 => {
                                                                            var $1093 = $1083;
                                                                            return $1093;
                                                                        }))));
                                                                        var $1084 = $1092;
                                                                        break;
                                                                };
                                                                var $1076 = $1084;
                                                                break;
                                                        };
                                                        var $1069 = $1076;
                                                        break;
                                                };
                                                var $1061 = $1069;
                                                break;
                                        };
                                        var $1054 = $1061;
                                        break;
                                };
                                var $1046 = $1054;
                                break;
                        };
                        var $1039 = $1046;
                        break;
                };
                var $1031 = $1039;
                break;
        };
        return $1031;
    };
    const Kind$Parser$let = x0 => x1 => Kind$Parser$let$(x0, x1);

    function Kind$Parser$get$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1095 = self.idx;
                var $1096 = self.code;
                var $1097 = self.err;
                var $1098 = Parser$Reply$error$($1095, $1096, $1097);
                var $1094 = $1098;
                break;
            case 'Parser.Reply.value':
                var $1099 = self.idx;
                var $1100 = self.code;
                var $1101 = self.val;
                var self = Kind$Parser$text$("let ", $1099, $1100);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1103 = self.idx;
                        var $1104 = self.code;
                        var $1105 = self.err;
                        var $1106 = Parser$Reply$error$($1103, $1104, $1105);
                        var $1102 = $1106;
                        break;
                    case 'Parser.Reply.value':
                        var $1107 = self.idx;
                        var $1108 = self.code;
                        var self = Kind$Parser$text$("{", $1107, $1108);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1110 = self.idx;
                                var $1111 = self.code;
                                var $1112 = self.err;
                                var $1113 = Parser$Reply$error$($1110, $1111, $1112);
                                var $1109 = $1113;
                                break;
                            case 'Parser.Reply.value':
                                var $1114 = self.idx;
                                var $1115 = self.code;
                                var self = Kind$Parser$name$($1114, $1115);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1117 = self.idx;
                                        var $1118 = self.code;
                                        var $1119 = self.err;
                                        var $1120 = Parser$Reply$error$($1117, $1118, $1119);
                                        var $1116 = $1120;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1121 = self.idx;
                                        var $1122 = self.code;
                                        var $1123 = self.val;
                                        var self = Kind$Parser$text$(",", $1121, $1122);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1125 = self.idx;
                                                var $1126 = self.code;
                                                var $1127 = self.err;
                                                var $1128 = Parser$Reply$error$($1125, $1126, $1127);
                                                var $1124 = $1128;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1129 = self.idx;
                                                var $1130 = self.code;
                                                var self = Kind$Parser$name$($1129, $1130);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1132 = self.idx;
                                                        var $1133 = self.code;
                                                        var $1134 = self.err;
                                                        var $1135 = Parser$Reply$error$($1132, $1133, $1134);
                                                        var $1131 = $1135;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1136 = self.idx;
                                                        var $1137 = self.code;
                                                        var $1138 = self.val;
                                                        var self = Kind$Parser$text$("}", $1136, $1137);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1140 = self.idx;
                                                                var $1141 = self.code;
                                                                var $1142 = self.err;
                                                                var $1143 = Parser$Reply$error$($1140, $1141, $1142);
                                                                var $1139 = $1143;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1144 = self.idx;
                                                                var $1145 = self.code;
                                                                var self = Kind$Parser$text$("=", $1144, $1145);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1147 = self.idx;
                                                                        var $1148 = self.code;
                                                                        var $1149 = self.err;
                                                                        var $1150 = Parser$Reply$error$($1147, $1148, $1149);
                                                                        var $1146 = $1150;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1151 = self.idx;
                                                                        var $1152 = self.code;
                                                                        var self = Kind$Parser$term$($1151, $1152);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1154 = self.idx;
                                                                                var $1155 = self.code;
                                                                                var $1156 = self.err;
                                                                                var $1157 = Parser$Reply$error$($1154, $1155, $1156);
                                                                                var $1153 = $1157;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1158 = self.idx;
                                                                                var $1159 = self.code;
                                                                                var $1160 = self.val;
                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1158, $1159);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1162 = self.idx;
                                                                                        var $1163 = self.code;
                                                                                        var $1164 = self.err;
                                                                                        var $1165 = Parser$Reply$error$($1162, $1163, $1164);
                                                                                        var $1161 = $1165;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1166 = self.idx;
                                                                                        var $1167 = self.code;
                                                                                        var self = Kind$Parser$term$($1166, $1167);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1169 = self.idx;
                                                                                                var $1170 = self.code;
                                                                                                var $1171 = self.err;
                                                                                                var $1172 = Parser$Reply$error$($1169, $1170, $1171);
                                                                                                var $1168 = $1172;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1173 = self.idx;
                                                                                                var $1174 = self.code;
                                                                                                var $1175 = self.val;
                                                                                                var self = Kind$Parser$stop$($1101, $1173, $1174);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1177 = self.idx;
                                                                                                        var $1178 = self.code;
                                                                                                        var $1179 = self.err;
                                                                                                        var $1180 = Parser$Reply$error$($1177, $1178, $1179);
                                                                                                        var $1176 = $1180;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1181 = self.idx;
                                                                                                        var $1182 = self.code;
                                                                                                        var $1183 = self.val;
                                                                                                        var _term$39 = $1160;
                                                                                                        var _term$40 = Kind$Term$app$(_term$39, Kind$Term$lam$("x", (_x$40 => {
                                                                                                            var $1185 = Kind$Term$hol$(Bits$e);
                                                                                                            return $1185;
                                                                                                        })));
                                                                                                        var _term$41 = Kind$Term$app$(_term$40, Kind$Term$lam$($1123, (_x$41 => {
                                                                                                            var $1186 = Kind$Term$lam$($1138, (_y$42 => {
                                                                                                                var $1187 = $1175;
                                                                                                                return $1187;
                                                                                                            }));
                                                                                                            return $1186;
                                                                                                        })));
                                                                                                        var $1184 = Parser$Reply$value$($1181, $1182, Kind$Term$ori$($1183, _term$41));
                                                                                                        var $1176 = $1184;
                                                                                                        break;
                                                                                                };
                                                                                                var $1168 = $1176;
                                                                                                break;
                                                                                        };
                                                                                        var $1161 = $1168;
                                                                                        break;
                                                                                };
                                                                                var $1153 = $1161;
                                                                                break;
                                                                        };
                                                                        var $1146 = $1153;
                                                                        break;
                                                                };
                                                                var $1139 = $1146;
                                                                break;
                                                        };
                                                        var $1131 = $1139;
                                                        break;
                                                };
                                                var $1124 = $1131;
                                                break;
                                        };
                                        var $1116 = $1124;
                                        break;
                                };
                                var $1109 = $1116;
                                break;
                        };
                        var $1102 = $1109;
                        break;
                };
                var $1094 = $1102;
                break;
        };
        return $1094;
    };
    const Kind$Parser$get = x0 => x1 => Kind$Parser$get$(x0, x1);

    function Kind$Term$def$(_name$1, _expr$2, _body$3) {
        var $1188 = ({
            _: 'Kind.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $1188;
    };
    const Kind$Term$def = x0 => x1 => x2 => Kind$Term$def$(x0, x1, x2);

    function Kind$Parser$def$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1190 = self.idx;
                var $1191 = self.code;
                var $1192 = self.err;
                var $1193 = Parser$Reply$error$($1190, $1191, $1192);
                var $1189 = $1193;
                break;
            case 'Parser.Reply.value':
                var $1194 = self.idx;
                var $1195 = self.code;
                var $1196 = self.val;
                var self = Kind$Parser$text$("def ", $1194, $1195);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1198 = self.idx;
                        var $1199 = self.code;
                        var $1200 = self.err;
                        var $1201 = Parser$Reply$error$($1198, $1199, $1200);
                        var $1197 = $1201;
                        break;
                    case 'Parser.Reply.value':
                        var $1202 = self.idx;
                        var $1203 = self.code;
                        var self = Kind$Parser$name$($1202, $1203);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1205 = self.idx;
                                var $1206 = self.code;
                                var $1207 = self.err;
                                var $1208 = Parser$Reply$error$($1205, $1206, $1207);
                                var $1204 = $1208;
                                break;
                            case 'Parser.Reply.value':
                                var $1209 = self.idx;
                                var $1210 = self.code;
                                var $1211 = self.val;
                                var self = Kind$Parser$text$("=", $1209, $1210);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1213 = self.idx;
                                        var $1214 = self.code;
                                        var $1215 = self.err;
                                        var $1216 = Parser$Reply$error$($1213, $1214, $1215);
                                        var $1212 = $1216;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1217 = self.idx;
                                        var $1218 = self.code;
                                        var self = Kind$Parser$term$($1217, $1218);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1220 = self.idx;
                                                var $1221 = self.code;
                                                var $1222 = self.err;
                                                var $1223 = Parser$Reply$error$($1220, $1221, $1222);
                                                var $1219 = $1223;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1224 = self.idx;
                                                var $1225 = self.code;
                                                var $1226 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1224, $1225);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1228 = self.idx;
                                                        var $1229 = self.code;
                                                        var $1230 = self.err;
                                                        var $1231 = Parser$Reply$error$($1228, $1229, $1230);
                                                        var $1227 = $1231;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1232 = self.idx;
                                                        var $1233 = self.code;
                                                        var self = Kind$Parser$term$($1232, $1233);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1235 = self.idx;
                                                                var $1236 = self.code;
                                                                var $1237 = self.err;
                                                                var $1238 = Parser$Reply$error$($1235, $1236, $1237);
                                                                var $1234 = $1238;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1239 = self.idx;
                                                                var $1240 = self.code;
                                                                var $1241 = self.val;
                                                                var self = Kind$Parser$stop$($1196, $1239, $1240);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1243 = self.idx;
                                                                        var $1244 = self.code;
                                                                        var $1245 = self.err;
                                                                        var $1246 = Parser$Reply$error$($1243, $1244, $1245);
                                                                        var $1242 = $1246;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1247 = self.idx;
                                                                        var $1248 = self.code;
                                                                        var $1249 = self.val;
                                                                        var $1250 = Parser$Reply$value$($1247, $1248, Kind$Term$ori$($1249, Kind$Term$def$($1211, $1226, (_x$27 => {
                                                                            var $1251 = $1241;
                                                                            return $1251;
                                                                        }))));
                                                                        var $1242 = $1250;
                                                                        break;
                                                                };
                                                                var $1234 = $1242;
                                                                break;
                                                        };
                                                        var $1227 = $1234;
                                                        break;
                                                };
                                                var $1219 = $1227;
                                                break;
                                        };
                                        var $1212 = $1219;
                                        break;
                                };
                                var $1204 = $1212;
                                break;
                        };
                        var $1197 = $1204;
                        break;
                };
                var $1189 = $1197;
                break;
        };
        return $1189;
    };
    const Kind$Parser$def = x0 => x1 => Kind$Parser$def$(x0, x1);

    function Kind$Parser$goal_rewrite$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1253 = self.idx;
                var $1254 = self.code;
                var $1255 = self.err;
                var $1256 = Parser$Reply$error$($1253, $1254, $1255);
                var $1252 = $1256;
                break;
            case 'Parser.Reply.value':
                var $1257 = self.idx;
                var $1258 = self.code;
                var $1259 = self.val;
                var self = Kind$Parser$text$("rewrite ", $1257, $1258);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1261 = self.idx;
                        var $1262 = self.code;
                        var $1263 = self.err;
                        var $1264 = Parser$Reply$error$($1261, $1262, $1263);
                        var $1260 = $1264;
                        break;
                    case 'Parser.Reply.value':
                        var $1265 = self.idx;
                        var $1266 = self.code;
                        var self = Kind$Parser$name1$($1265, $1266);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1268 = self.idx;
                                var $1269 = self.code;
                                var $1270 = self.err;
                                var $1271 = Parser$Reply$error$($1268, $1269, $1270);
                                var $1267 = $1271;
                                break;
                            case 'Parser.Reply.value':
                                var $1272 = self.idx;
                                var $1273 = self.code;
                                var $1274 = self.val;
                                var self = Kind$Parser$text$("in", $1272, $1273);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1276 = self.idx;
                                        var $1277 = self.code;
                                        var $1278 = self.err;
                                        var $1279 = Parser$Reply$error$($1276, $1277, $1278);
                                        var $1275 = $1279;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1280 = self.idx;
                                        var $1281 = self.code;
                                        var self = Kind$Parser$term$($1280, $1281);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1283 = self.idx;
                                                var $1284 = self.code;
                                                var $1285 = self.err;
                                                var $1286 = Parser$Reply$error$($1283, $1284, $1285);
                                                var $1282 = $1286;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1287 = self.idx;
                                                var $1288 = self.code;
                                                var $1289 = self.val;
                                                var self = Kind$Parser$text$("with", $1287, $1288);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1291 = self.idx;
                                                        var $1292 = self.code;
                                                        var $1293 = self.err;
                                                        var $1294 = Parser$Reply$error$($1291, $1292, $1293);
                                                        var $1290 = $1294;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1295 = self.idx;
                                                        var $1296 = self.code;
                                                        var self = Kind$Parser$term$($1295, $1296);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1298 = self.idx;
                                                                var $1299 = self.code;
                                                                var $1300 = self.err;
                                                                var $1301 = Parser$Reply$error$($1298, $1299, $1300);
                                                                var $1297 = $1301;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1302 = self.idx;
                                                                var $1303 = self.code;
                                                                var $1304 = self.val;
                                                                var self = Kind$Parser$term$($1302, $1303);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1306 = self.idx;
                                                                        var $1307 = self.code;
                                                                        var $1308 = self.err;
                                                                        var $1309 = Parser$Reply$error$($1306, $1307, $1308);
                                                                        var $1305 = $1309;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1310 = self.idx;
                                                                        var $1311 = self.code;
                                                                        var $1312 = self.val;
                                                                        var self = Kind$Parser$stop$($1259, $1310, $1311);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1314 = self.idx;
                                                                                var $1315 = self.code;
                                                                                var $1316 = self.err;
                                                                                var $1317 = Parser$Reply$error$($1314, $1315, $1316);
                                                                                var $1313 = $1317;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1318 = self.idx;
                                                                                var $1319 = self.code;
                                                                                var $1320 = self.val;
                                                                                var _moti$30 = Kind$Term$lam$($1274, (_s$30 => {
                                                                                    var $1322 = Kind$Term$lam$("", (_x$31 => {
                                                                                        var $1323 = $1289;
                                                                                        return $1323;
                                                                                    }));
                                                                                    return $1322;
                                                                                }));
                                                                                var _term$31 = Kind$Term$ref$("Equal.mirror");
                                                                                var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                                var _term$33 = Kind$Term$app$(_term$32, Kind$Term$hol$(Bits$e));
                                                                                var _term$34 = Kind$Term$app$(_term$33, Kind$Term$hol$(Bits$e));
                                                                                var _term$35 = Kind$Term$app$(_term$34, $1304);
                                                                                var _term$36 = Kind$Term$app$(_term$35, _moti$30);
                                                                                var _term$37 = Kind$Term$app$(_term$36, $1312);
                                                                                var $1321 = Parser$Reply$value$($1318, $1319, Kind$Term$ori$($1320, _term$37));
                                                                                var $1313 = $1321;
                                                                                break;
                                                                        };
                                                                        var $1305 = $1313;
                                                                        break;
                                                                };
                                                                var $1297 = $1305;
                                                                break;
                                                        };
                                                        var $1290 = $1297;
                                                        break;
                                                };
                                                var $1282 = $1290;
                                                break;
                                        };
                                        var $1275 = $1282;
                                        break;
                                };
                                var $1267 = $1275;
                                break;
                        };
                        var $1260 = $1267;
                        break;
                };
                var $1252 = $1260;
                break;
        };
        return $1252;
    };
    const Kind$Parser$goal_rewrite = x0 => x1 => Kind$Parser$goal_rewrite$(x0, x1);

    function Kind$Parser$if$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1325 = self.idx;
                var $1326 = self.code;
                var $1327 = self.err;
                var $1328 = Parser$Reply$error$($1325, $1326, $1327);
                var $1324 = $1328;
                break;
            case 'Parser.Reply.value':
                var $1329 = self.idx;
                var $1330 = self.code;
                var $1331 = self.val;
                var self = Kind$Parser$text$("if ", $1329, $1330);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1333 = self.idx;
                        var $1334 = self.code;
                        var $1335 = self.err;
                        var $1336 = Parser$Reply$error$($1333, $1334, $1335);
                        var $1332 = $1336;
                        break;
                    case 'Parser.Reply.value':
                        var $1337 = self.idx;
                        var $1338 = self.code;
                        var self = Kind$Parser$term$($1337, $1338);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1340 = self.idx;
                                var $1341 = self.code;
                                var $1342 = self.err;
                                var $1343 = Parser$Reply$error$($1340, $1341, $1342);
                                var $1339 = $1343;
                                break;
                            case 'Parser.Reply.value':
                                var $1344 = self.idx;
                                var $1345 = self.code;
                                var $1346 = self.val;
                                var self = Kind$Parser$text$("then", $1344, $1345);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1348 = self.idx;
                                        var $1349 = self.code;
                                        var $1350 = self.err;
                                        var $1351 = Parser$Reply$error$($1348, $1349, $1350);
                                        var $1347 = $1351;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1352 = self.idx;
                                        var $1353 = self.code;
                                        var self = Kind$Parser$term$($1352, $1353);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1355 = self.idx;
                                                var $1356 = self.code;
                                                var $1357 = self.err;
                                                var $1358 = Parser$Reply$error$($1355, $1356, $1357);
                                                var $1354 = $1358;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1359 = self.idx;
                                                var $1360 = self.code;
                                                var $1361 = self.val;
                                                var self = Kind$Parser$text$("else", $1359, $1360);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1363 = self.idx;
                                                        var $1364 = self.code;
                                                        var $1365 = self.err;
                                                        var $1366 = Parser$Reply$error$($1363, $1364, $1365);
                                                        var $1362 = $1366;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1367 = self.idx;
                                                        var $1368 = self.code;
                                                        var self = Kind$Parser$term$($1367, $1368);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1370 = self.idx;
                                                                var $1371 = self.code;
                                                                var $1372 = self.err;
                                                                var $1373 = Parser$Reply$error$($1370, $1371, $1372);
                                                                var $1369 = $1373;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1374 = self.idx;
                                                                var $1375 = self.code;
                                                                var $1376 = self.val;
                                                                var self = Kind$Parser$stop$($1331, $1374, $1375);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1378 = self.idx;
                                                                        var $1379 = self.code;
                                                                        var $1380 = self.err;
                                                                        var $1381 = Parser$Reply$error$($1378, $1379, $1380);
                                                                        var $1377 = $1381;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1382 = self.idx;
                                                                        var $1383 = self.code;
                                                                        var $1384 = self.val;
                                                                        var _term$27 = $1346;
                                                                        var _term$28 = Kind$Term$app$(_term$27, Kind$Term$lam$("", (_x$28 => {
                                                                            var $1386 = Kind$Term$hol$(Bits$e);
                                                                            return $1386;
                                                                        })));
                                                                        var _term$29 = Kind$Term$app$(_term$28, $1361);
                                                                        var _term$30 = Kind$Term$app$(_term$29, $1376);
                                                                        var $1385 = Parser$Reply$value$($1382, $1383, Kind$Term$ori$($1384, _term$30));
                                                                        var $1377 = $1385;
                                                                        break;
                                                                };
                                                                var $1369 = $1377;
                                                                break;
                                                        };
                                                        var $1362 = $1369;
                                                        break;
                                                };
                                                var $1354 = $1362;
                                                break;
                                        };
                                        var $1347 = $1354;
                                        break;
                                };
                                var $1339 = $1347;
                                break;
                        };
                        var $1332 = $1339;
                        break;
                };
                var $1324 = $1332;
                break;
        };
        return $1324;
    };
    const Kind$Parser$if = x0 => x1 => Kind$Parser$if$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1388 = self.head;
                var $1389 = self.tail;
                var $1390 = List$cons$(_f$4($1388), List$mapped$($1389, _f$4));
                var $1387 = $1390;
                break;
            case 'List.nil':
                var $1391 = List$nil;
                var $1387 = $1391;
                break;
        };
        return $1387;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);
    const Kind$backslash = 92;
    const Kind$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Kind$backslash, String$cons$(Kind$backslash, String$nil)), Kind$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Kind$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Kind$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $1393 = self.fst;
                var $1394 = self.snd;
                var $1395 = (_idx$4 => _code$5 => {
                    var self = Parser$text$($1393, _idx$4, _code$5);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1397 = self.idx;
                            var $1398 = self.code;
                            var $1399 = self.err;
                            var $1400 = Parser$Reply$error$($1397, $1398, $1399);
                            var $1396 = $1400;
                            break;
                        case 'Parser.Reply.value':
                            var $1401 = self.idx;
                            var $1402 = self.code;
                            var $1403 = Parser$Reply$value$($1401, $1402, $1394);
                            var $1396 = $1403;
                            break;
                    };
                    return $1396;
                });
                var $1392 = $1395;
                break;
        };
        return $1392;
    }))), List$cons$(Parser$one, List$nil)));

    function Kind$Term$chr$(_chrx$1) {
        var $1404 = ({
            _: 'Kind.Term.chr',
            'chrx': _chrx$1
        });
        return $1404;
    };
    const Kind$Term$chr = x0 => Kind$Term$chr$(x0);

    function Kind$Parser$char$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1406 = self.idx;
                var $1407 = self.code;
                var $1408 = self.err;
                var $1409 = Parser$Reply$error$($1406, $1407, $1408);
                var $1405 = $1409;
                break;
            case 'Parser.Reply.value':
                var $1410 = self.idx;
                var $1411 = self.code;
                var $1412 = self.val;
                var self = Kind$Parser$text$("\'", $1410, $1411);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1414 = self.idx;
                        var $1415 = self.code;
                        var $1416 = self.err;
                        var $1417 = Parser$Reply$error$($1414, $1415, $1416);
                        var $1413 = $1417;
                        break;
                    case 'Parser.Reply.value':
                        var $1418 = self.idx;
                        var $1419 = self.code;
                        var self = Kind$Parser$char$single($1418)($1419);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1421 = self.idx;
                                var $1422 = self.code;
                                var $1423 = self.err;
                                var $1424 = Parser$Reply$error$($1421, $1422, $1423);
                                var $1420 = $1424;
                                break;
                            case 'Parser.Reply.value':
                                var $1425 = self.idx;
                                var $1426 = self.code;
                                var $1427 = self.val;
                                var self = Parser$text$("\'", $1425, $1426);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1429 = self.idx;
                                        var $1430 = self.code;
                                        var $1431 = self.err;
                                        var $1432 = Parser$Reply$error$($1429, $1430, $1431);
                                        var $1428 = $1432;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1433 = self.idx;
                                        var $1434 = self.code;
                                        var self = Kind$Parser$stop$($1412, $1433, $1434);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1436 = self.idx;
                                                var $1437 = self.code;
                                                var $1438 = self.err;
                                                var $1439 = Parser$Reply$error$($1436, $1437, $1438);
                                                var $1435 = $1439;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1440 = self.idx;
                                                var $1441 = self.code;
                                                var $1442 = self.val;
                                                var $1443 = Parser$Reply$value$($1440, $1441, Kind$Term$ori$($1442, Kind$Term$chr$($1427)));
                                                var $1435 = $1443;
                                                break;
                                        };
                                        var $1428 = $1435;
                                        break;
                                };
                                var $1420 = $1428;
                                break;
                        };
                        var $1413 = $1420;
                        break;
                };
                var $1405 = $1413;
                break;
        };
        return $1405;
    };
    const Kind$Parser$char = x0 => x1 => Kind$Parser$char$(x0, x1);

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
                    var $1444 = _res$2;
                    return $1444;
                } else {
                    var $1445 = self.charCodeAt(0);
                    var $1446 = self.slice(1);
                    var $1447 = String$reverse$go$($1446, String$cons$($1445, _res$2));
                    return $1447;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1448 = String$reverse$go$(_xs$1, String$nil);
        return $1448;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function Kind$Parser$string$go$(_str$1, _idx$2, _code$3) {
        var Kind$Parser$string$go$ = (_str$1, _idx$2, _code$3) => ({
            ctr: 'TCO',
            arg: [_str$1, _idx$2, _code$3]
        });
        var Kind$Parser$string$go = _str$1 => _idx$2 => _code$3 => Kind$Parser$string$go$(_str$1, _idx$2, _code$3);
        var arg = [_str$1, _idx$2, _code$3];
        while (true) {
            let [_str$1, _idx$2, _code$3] = arg;
            var R = (() => {
                var self = _code$3;
                if (self.length === 0) {
                    var $1449 = Parser$Reply$error$(_idx$2, _code$3, "Non-terminating string.");
                    return $1449;
                } else {
                    var $1450 = self.charCodeAt(0);
                    var $1451 = self.slice(1);
                    var self = ($1450 === 34);
                    if (self) {
                        var $1453 = Parser$Reply$value$(Nat$succ$(_idx$2), $1451, String$reverse$(_str$1));
                        var $1452 = $1453;
                    } else {
                        var self = Kind$Parser$char$single(_idx$2)(_code$3);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1455 = self.idx;
                                var $1456 = self.code;
                                var $1457 = self.err;
                                var $1458 = Parser$Reply$error$($1455, $1456, $1457);
                                var $1454 = $1458;
                                break;
                            case 'Parser.Reply.value':
                                var $1459 = self.idx;
                                var $1460 = self.code;
                                var $1461 = self.val;
                                var $1462 = Kind$Parser$string$go$(String$cons$($1461, _str$1), $1459, $1460);
                                var $1454 = $1462;
                                break;
                        };
                        var $1452 = $1454;
                    };
                    return $1452;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Parser$string$go = x0 => x1 => x2 => Kind$Parser$string$go$(x0, x1, x2);

    function Kind$Term$str$(_strx$1) {
        var $1463 = ({
            _: 'Kind.Term.str',
            'strx': _strx$1
        });
        return $1463;
    };
    const Kind$Term$str = x0 => Kind$Term$str$(x0);

    function Kind$Parser$string$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1465 = self.idx;
                var $1466 = self.code;
                var $1467 = self.err;
                var $1468 = Parser$Reply$error$($1465, $1466, $1467);
                var $1464 = $1468;
                break;
            case 'Parser.Reply.value':
                var $1469 = self.idx;
                var $1470 = self.code;
                var $1471 = self.val;
                var self = Kind$Parser$text$(String$cons$(34, String$nil), $1469, $1470);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1473 = self.idx;
                        var $1474 = self.code;
                        var $1475 = self.err;
                        var $1476 = Parser$Reply$error$($1473, $1474, $1475);
                        var $1472 = $1476;
                        break;
                    case 'Parser.Reply.value':
                        var $1477 = self.idx;
                        var $1478 = self.code;
                        var self = Kind$Parser$string$go$("", $1477, $1478);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1480 = self.idx;
                                var $1481 = self.code;
                                var $1482 = self.err;
                                var $1483 = Parser$Reply$error$($1480, $1481, $1482);
                                var $1479 = $1483;
                                break;
                            case 'Parser.Reply.value':
                                var $1484 = self.idx;
                                var $1485 = self.code;
                                var $1486 = self.val;
                                var self = Kind$Parser$stop$($1471, $1484, $1485);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1488 = self.idx;
                                        var $1489 = self.code;
                                        var $1490 = self.err;
                                        var $1491 = Parser$Reply$error$($1488, $1489, $1490);
                                        var $1487 = $1491;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1492 = self.idx;
                                        var $1493 = self.code;
                                        var $1494 = self.val;
                                        var $1495 = Parser$Reply$value$($1492, $1493, Kind$Term$ori$($1494, Kind$Term$str$($1486)));
                                        var $1487 = $1495;
                                        break;
                                };
                                var $1479 = $1487;
                                break;
                        };
                        var $1472 = $1479;
                        break;
                };
                var $1464 = $1472;
                break;
        };
        return $1464;
    };
    const Kind$Parser$string = x0 => x1 => Kind$Parser$string$(x0, x1);

    function Kind$Parser$pair$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1497 = self.idx;
                var $1498 = self.code;
                var $1499 = self.err;
                var $1500 = Parser$Reply$error$($1497, $1498, $1499);
                var $1496 = $1500;
                break;
            case 'Parser.Reply.value':
                var $1501 = self.idx;
                var $1502 = self.code;
                var $1503 = self.val;
                var self = Kind$Parser$text$("{", $1501, $1502);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1505 = self.idx;
                        var $1506 = self.code;
                        var $1507 = self.err;
                        var $1508 = Parser$Reply$error$($1505, $1506, $1507);
                        var $1504 = $1508;
                        break;
                    case 'Parser.Reply.value':
                        var $1509 = self.idx;
                        var $1510 = self.code;
                        var self = Kind$Parser$term$($1509, $1510);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1512 = self.idx;
                                var $1513 = self.code;
                                var $1514 = self.err;
                                var $1515 = Parser$Reply$error$($1512, $1513, $1514);
                                var $1511 = $1515;
                                break;
                            case 'Parser.Reply.value':
                                var $1516 = self.idx;
                                var $1517 = self.code;
                                var $1518 = self.val;
                                var self = Kind$Parser$text$(",", $1516, $1517);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1520 = self.idx;
                                        var $1521 = self.code;
                                        var $1522 = self.err;
                                        var $1523 = Parser$Reply$error$($1520, $1521, $1522);
                                        var $1519 = $1523;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1524 = self.idx;
                                        var $1525 = self.code;
                                        var self = Kind$Parser$term$($1524, $1525);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1527 = self.idx;
                                                var $1528 = self.code;
                                                var $1529 = self.err;
                                                var $1530 = Parser$Reply$error$($1527, $1528, $1529);
                                                var $1526 = $1530;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1531 = self.idx;
                                                var $1532 = self.code;
                                                var $1533 = self.val;
                                                var self = Kind$Parser$text$("}", $1531, $1532);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1535 = self.idx;
                                                        var $1536 = self.code;
                                                        var $1537 = self.err;
                                                        var $1538 = Parser$Reply$error$($1535, $1536, $1537);
                                                        var $1534 = $1538;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1539 = self.idx;
                                                        var $1540 = self.code;
                                                        var self = Kind$Parser$stop$($1503, $1539, $1540);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1542 = self.idx;
                                                                var $1543 = self.code;
                                                                var $1544 = self.err;
                                                                var $1545 = Parser$Reply$error$($1542, $1543, $1544);
                                                                var $1541 = $1545;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1546 = self.idx;
                                                                var $1547 = self.code;
                                                                var $1548 = self.val;
                                                                var _term$24 = Kind$Term$ref$("Pair.new");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, $1518);
                                                                var _term$28 = Kind$Term$app$(_term$27, $1533);
                                                                var $1549 = Parser$Reply$value$($1546, $1547, Kind$Term$ori$($1548, _term$28));
                                                                var $1541 = $1549;
                                                                break;
                                                        };
                                                        var $1534 = $1541;
                                                        break;
                                                };
                                                var $1526 = $1534;
                                                break;
                                        };
                                        var $1519 = $1526;
                                        break;
                                };
                                var $1511 = $1519;
                                break;
                        };
                        var $1504 = $1511;
                        break;
                };
                var $1496 = $1504;
                break;
        };
        return $1496;
    };
    const Kind$Parser$pair = x0 => x1 => Kind$Parser$pair$(x0, x1);

    function Kind$Parser$sigma$type$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1551 = self.idx;
                var $1552 = self.code;
                var $1553 = self.err;
                var $1554 = Parser$Reply$error$($1551, $1552, $1553);
                var $1550 = $1554;
                break;
            case 'Parser.Reply.value':
                var $1555 = self.idx;
                var $1556 = self.code;
                var $1557 = self.val;
                var self = Kind$Parser$text$("{", $1555, $1556);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1559 = self.idx;
                        var $1560 = self.code;
                        var $1561 = self.err;
                        var $1562 = Parser$Reply$error$($1559, $1560, $1561);
                        var $1558 = $1562;
                        break;
                    case 'Parser.Reply.value':
                        var $1563 = self.idx;
                        var $1564 = self.code;
                        var self = Kind$Parser$name1$($1563, $1564);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1566 = self.idx;
                                var $1567 = self.code;
                                var $1568 = self.err;
                                var $1569 = Parser$Reply$error$($1566, $1567, $1568);
                                var $1565 = $1569;
                                break;
                            case 'Parser.Reply.value':
                                var $1570 = self.idx;
                                var $1571 = self.code;
                                var $1572 = self.val;
                                var self = Kind$Parser$text$(":", $1570, $1571);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1574 = self.idx;
                                        var $1575 = self.code;
                                        var $1576 = self.err;
                                        var $1577 = Parser$Reply$error$($1574, $1575, $1576);
                                        var $1573 = $1577;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1578 = self.idx;
                                        var $1579 = self.code;
                                        var self = Kind$Parser$term$($1578, $1579);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1581 = self.idx;
                                                var $1582 = self.code;
                                                var $1583 = self.err;
                                                var $1584 = Parser$Reply$error$($1581, $1582, $1583);
                                                var $1580 = $1584;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1585 = self.idx;
                                                var $1586 = self.code;
                                                var $1587 = self.val;
                                                var self = Kind$Parser$text$("}", $1585, $1586);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1589 = self.idx;
                                                        var $1590 = self.code;
                                                        var $1591 = self.err;
                                                        var $1592 = Parser$Reply$error$($1589, $1590, $1591);
                                                        var $1588 = $1592;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1593 = self.idx;
                                                        var $1594 = self.code;
                                                        var self = Kind$Parser$term$($1593, $1594);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1596 = self.idx;
                                                                var $1597 = self.code;
                                                                var $1598 = self.err;
                                                                var $1599 = Parser$Reply$error$($1596, $1597, $1598);
                                                                var $1595 = $1599;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1600 = self.idx;
                                                                var $1601 = self.code;
                                                                var $1602 = self.val;
                                                                var self = Kind$Parser$stop$($1557, $1600, $1601);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1604 = self.idx;
                                                                        var $1605 = self.code;
                                                                        var $1606 = self.err;
                                                                        var $1607 = Parser$Reply$error$($1604, $1605, $1606);
                                                                        var $1603 = $1607;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1608 = self.idx;
                                                                        var $1609 = self.code;
                                                                        var $1610 = self.val;
                                                                        var _term$27 = Kind$Term$ref$("Sigma");
                                                                        var _term$28 = Kind$Term$app$(_term$27, $1587);
                                                                        var _term$29 = Kind$Term$app$(_term$28, Kind$Term$lam$($1572, (_x$29 => {
                                                                            var $1612 = $1602;
                                                                            return $1612;
                                                                        })));
                                                                        var $1611 = Parser$Reply$value$($1608, $1609, Kind$Term$ori$($1610, _term$29));
                                                                        var $1603 = $1611;
                                                                        break;
                                                                };
                                                                var $1595 = $1603;
                                                                break;
                                                        };
                                                        var $1588 = $1595;
                                                        break;
                                                };
                                                var $1580 = $1588;
                                                break;
                                        };
                                        var $1573 = $1580;
                                        break;
                                };
                                var $1565 = $1573;
                                break;
                        };
                        var $1558 = $1565;
                        break;
                };
                var $1550 = $1558;
                break;
        };
        return $1550;
    };
    const Kind$Parser$sigma$type = x0 => x1 => Kind$Parser$sigma$type$(x0, x1);

    function Kind$Parser$some$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1614 = self.idx;
                var $1615 = self.code;
                var $1616 = self.err;
                var $1617 = Parser$Reply$error$($1614, $1615, $1616);
                var $1613 = $1617;
                break;
            case 'Parser.Reply.value':
                var $1618 = self.idx;
                var $1619 = self.code;
                var $1620 = self.val;
                var self = Kind$Parser$text$("some(", $1618, $1619);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1622 = self.idx;
                        var $1623 = self.code;
                        var $1624 = self.err;
                        var $1625 = Parser$Reply$error$($1622, $1623, $1624);
                        var $1621 = $1625;
                        break;
                    case 'Parser.Reply.value':
                        var $1626 = self.idx;
                        var $1627 = self.code;
                        var self = Kind$Parser$term$($1626, $1627);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1629 = self.idx;
                                var $1630 = self.code;
                                var $1631 = self.err;
                                var $1632 = Parser$Reply$error$($1629, $1630, $1631);
                                var $1628 = $1632;
                                break;
                            case 'Parser.Reply.value':
                                var $1633 = self.idx;
                                var $1634 = self.code;
                                var $1635 = self.val;
                                var self = Kind$Parser$text$(")", $1633, $1634);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1637 = self.idx;
                                        var $1638 = self.code;
                                        var $1639 = self.err;
                                        var $1640 = Parser$Reply$error$($1637, $1638, $1639);
                                        var $1636 = $1640;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1641 = self.idx;
                                        var $1642 = self.code;
                                        var self = Kind$Parser$stop$($1620, $1641, $1642);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1644 = self.idx;
                                                var $1645 = self.code;
                                                var $1646 = self.err;
                                                var $1647 = Parser$Reply$error$($1644, $1645, $1646);
                                                var $1643 = $1647;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1648 = self.idx;
                                                var $1649 = self.code;
                                                var $1650 = self.val;
                                                var _term$18 = Kind$Term$ref$("Maybe.some");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, $1635);
                                                var $1651 = Parser$Reply$value$($1648, $1649, Kind$Term$ori$($1650, _term$20));
                                                var $1643 = $1651;
                                                break;
                                        };
                                        var $1636 = $1643;
                                        break;
                                };
                                var $1628 = $1636;
                                break;
                        };
                        var $1621 = $1628;
                        break;
                };
                var $1613 = $1621;
                break;
        };
        return $1613;
    };
    const Kind$Parser$some = x0 => x1 => Kind$Parser$some$(x0, x1);

    function Kind$Parser$apply$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1653 = self.idx;
                var $1654 = self.code;
                var $1655 = self.err;
                var $1656 = Parser$Reply$error$($1653, $1654, $1655);
                var $1652 = $1656;
                break;
            case 'Parser.Reply.value':
                var $1657 = self.idx;
                var $1658 = self.code;
                var $1659 = self.val;
                var self = Kind$Parser$text$("apply(", $1657, $1658);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1661 = self.idx;
                        var $1662 = self.code;
                        var $1663 = self.err;
                        var $1664 = Parser$Reply$error$($1661, $1662, $1663);
                        var $1660 = $1664;
                        break;
                    case 'Parser.Reply.value':
                        var $1665 = self.idx;
                        var $1666 = self.code;
                        var self = Kind$Parser$term$($1665, $1666);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1668 = self.idx;
                                var $1669 = self.code;
                                var $1670 = self.err;
                                var $1671 = Parser$Reply$error$($1668, $1669, $1670);
                                var $1667 = $1671;
                                break;
                            case 'Parser.Reply.value':
                                var $1672 = self.idx;
                                var $1673 = self.code;
                                var $1674 = self.val;
                                var self = Kind$Parser$text$(",", $1672, $1673);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1676 = self.idx;
                                        var $1677 = self.code;
                                        var $1678 = self.err;
                                        var $1679 = Parser$Reply$error$($1676, $1677, $1678);
                                        var $1675 = $1679;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1680 = self.idx;
                                        var $1681 = self.code;
                                        var self = Kind$Parser$term$($1680, $1681);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1683 = self.idx;
                                                var $1684 = self.code;
                                                var $1685 = self.err;
                                                var $1686 = Parser$Reply$error$($1683, $1684, $1685);
                                                var $1682 = $1686;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1687 = self.idx;
                                                var $1688 = self.code;
                                                var $1689 = self.val;
                                                var self = Kind$Parser$text$(")", $1687, $1688);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1691 = self.idx;
                                                        var $1692 = self.code;
                                                        var $1693 = self.err;
                                                        var $1694 = Parser$Reply$error$($1691, $1692, $1693);
                                                        var $1690 = $1694;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1695 = self.idx;
                                                        var $1696 = self.code;
                                                        var self = Kind$Parser$stop$($1659, $1695, $1696);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1698 = self.idx;
                                                                var $1699 = self.code;
                                                                var $1700 = self.err;
                                                                var $1701 = Parser$Reply$error$($1698, $1699, $1700);
                                                                var $1697 = $1701;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1702 = self.idx;
                                                                var $1703 = self.code;
                                                                var $1704 = self.val;
                                                                var _term$24 = Kind$Term$ref$("Equal.apply");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$hol$(Bits$e));
                                                                var _term$28 = Kind$Term$app$(_term$27, Kind$Term$hol$(Bits$e));
                                                                var _term$29 = Kind$Term$app$(_term$28, $1674);
                                                                var _term$30 = Kind$Term$app$(_term$29, $1689);
                                                                var $1705 = Parser$Reply$value$($1702, $1703, Kind$Term$ori$($1704, _term$30));
                                                                var $1697 = $1705;
                                                                break;
                                                        };
                                                        var $1690 = $1697;
                                                        break;
                                                };
                                                var $1682 = $1690;
                                                break;
                                        };
                                        var $1675 = $1682;
                                        break;
                                };
                                var $1667 = $1675;
                                break;
                        };
                        var $1660 = $1667;
                        break;
                };
                var $1652 = $1660;
                break;
        };
        return $1652;
    };
    const Kind$Parser$apply = x0 => x1 => Kind$Parser$apply$(x0, x1);

    function Kind$Parser$mirror$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1707 = self.idx;
                var $1708 = self.code;
                var $1709 = self.err;
                var $1710 = Parser$Reply$error$($1707, $1708, $1709);
                var $1706 = $1710;
                break;
            case 'Parser.Reply.value':
                var $1711 = self.idx;
                var $1712 = self.code;
                var $1713 = self.val;
                var self = Kind$Parser$text$("mirror(", $1711, $1712);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1715 = self.idx;
                        var $1716 = self.code;
                        var $1717 = self.err;
                        var $1718 = Parser$Reply$error$($1715, $1716, $1717);
                        var $1714 = $1718;
                        break;
                    case 'Parser.Reply.value':
                        var $1719 = self.idx;
                        var $1720 = self.code;
                        var self = Kind$Parser$term$($1719, $1720);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1722 = self.idx;
                                var $1723 = self.code;
                                var $1724 = self.err;
                                var $1725 = Parser$Reply$error$($1722, $1723, $1724);
                                var $1721 = $1725;
                                break;
                            case 'Parser.Reply.value':
                                var $1726 = self.idx;
                                var $1727 = self.code;
                                var $1728 = self.val;
                                var self = Kind$Parser$text$(")", $1726, $1727);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1730 = self.idx;
                                        var $1731 = self.code;
                                        var $1732 = self.err;
                                        var $1733 = Parser$Reply$error$($1730, $1731, $1732);
                                        var $1729 = $1733;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1734 = self.idx;
                                        var $1735 = self.code;
                                        var self = Kind$Parser$stop$($1713, $1734, $1735);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1737 = self.idx;
                                                var $1738 = self.code;
                                                var $1739 = self.err;
                                                var $1740 = Parser$Reply$error$($1737, $1738, $1739);
                                                var $1736 = $1740;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1741 = self.idx;
                                                var $1742 = self.code;
                                                var $1743 = self.val;
                                                var _term$18 = Kind$Term$ref$("Equal.mirror");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, Kind$Term$hol$(Bits$e));
                                                var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                var _term$22 = Kind$Term$app$(_term$21, $1728);
                                                var $1744 = Parser$Reply$value$($1741, $1742, Kind$Term$ori$($1743, _term$22));
                                                var $1736 = $1744;
                                                break;
                                        };
                                        var $1729 = $1736;
                                        break;
                                };
                                var $1721 = $1729;
                                break;
                        };
                        var $1714 = $1721;
                        break;
                };
                var $1706 = $1714;
                break;
        };
        return $1706;
    };
    const Kind$Parser$mirror = x0 => x1 => Kind$Parser$mirror$(x0, x1);

    function Kind$Name$read$(_str$1) {
        var $1745 = _str$1;
        return $1745;
    };
    const Kind$Name$read = x0 => Kind$Name$read$(x0);

    function Kind$Parser$list$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1747 = self.idx;
                var $1748 = self.code;
                var $1749 = self.err;
                var $1750 = Parser$Reply$error$($1747, $1748, $1749);
                var $1746 = $1750;
                break;
            case 'Parser.Reply.value':
                var $1751 = self.idx;
                var $1752 = self.code;
                var $1753 = self.val;
                var self = Kind$Parser$text$("[", $1751, $1752);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1755 = self.idx;
                        var $1756 = self.code;
                        var $1757 = self.err;
                        var $1758 = Parser$Reply$error$($1755, $1756, $1757);
                        var $1754 = $1758;
                        break;
                    case 'Parser.Reply.value':
                        var $1759 = self.idx;
                        var $1760 = self.code;
                        var self = Parser$until$(Kind$Parser$text("]"), Kind$Parser$item(Kind$Parser$term))($1759)($1760);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1762 = self.idx;
                                var $1763 = self.code;
                                var $1764 = self.err;
                                var $1765 = Parser$Reply$error$($1762, $1763, $1764);
                                var $1761 = $1765;
                                break;
                            case 'Parser.Reply.value':
                                var $1766 = self.idx;
                                var $1767 = self.code;
                                var $1768 = self.val;
                                var self = Kind$Parser$stop$($1753, $1766, $1767);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1770 = self.idx;
                                        var $1771 = self.code;
                                        var $1772 = self.err;
                                        var $1773 = Parser$Reply$error$($1770, $1771, $1772);
                                        var $1769 = $1773;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1774 = self.idx;
                                        var $1775 = self.code;
                                        var $1776 = self.val;
                                        var $1777 = Parser$Reply$value$($1774, $1775, List$fold$($1768, Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("List.nil")), Kind$Term$hol$(Bits$e)), (_x$15 => _xs$16 => {
                                            var _term$17 = Kind$Term$ref$(Kind$Name$read$("List.cons"));
                                            var _term$18 = Kind$Term$app$(_term$17, Kind$Term$hol$(Bits$e));
                                            var _term$19 = Kind$Term$app$(_term$18, _x$15);
                                            var _term$20 = Kind$Term$app$(_term$19, _xs$16);
                                            var $1778 = Kind$Term$ori$($1776, _term$20);
                                            return $1778;
                                        })));
                                        var $1769 = $1777;
                                        break;
                                };
                                var $1761 = $1769;
                                break;
                        };
                        var $1754 = $1761;
                        break;
                };
                var $1746 = $1754;
                break;
        };
        return $1746;
    };
    const Kind$Parser$list = x0 => x1 => Kind$Parser$list$(x0, x1);

    function Kind$Parser$map$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1780 = self.idx;
                var $1781 = self.code;
                var $1782 = self.err;
                var $1783 = Parser$Reply$error$($1780, $1781, $1782);
                var $1779 = $1783;
                break;
            case 'Parser.Reply.value':
                var $1784 = self.idx;
                var $1785 = self.code;
                var $1786 = self.val;
                var self = Kind$Parser$text$("{", $1784, $1785);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1788 = self.idx;
                        var $1789 = self.code;
                        var $1790 = self.err;
                        var $1791 = Parser$Reply$error$($1788, $1789, $1790);
                        var $1787 = $1791;
                        break;
                    case 'Parser.Reply.value':
                        var $1792 = self.idx;
                        var $1793 = self.code;
                        var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item((_idx$9 => _code$10 => {
                            var self = Kind$Parser$term$(_idx$9, _code$10);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1796 = self.idx;
                                    var $1797 = self.code;
                                    var $1798 = self.err;
                                    var $1799 = Parser$Reply$error$($1796, $1797, $1798);
                                    var $1795 = $1799;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1800 = self.idx;
                                    var $1801 = self.code;
                                    var $1802 = self.val;
                                    var self = Kind$Parser$text$(":", $1800, $1801);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1804 = self.idx;
                                            var $1805 = self.code;
                                            var $1806 = self.err;
                                            var $1807 = Parser$Reply$error$($1804, $1805, $1806);
                                            var $1803 = $1807;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1808 = self.idx;
                                            var $1809 = self.code;
                                            var self = Kind$Parser$term$($1808, $1809);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1811 = self.idx;
                                                    var $1812 = self.code;
                                                    var $1813 = self.err;
                                                    var $1814 = Parser$Reply$error$($1811, $1812, $1813);
                                                    var $1810 = $1814;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1815 = self.idx;
                                                    var $1816 = self.code;
                                                    var $1817 = self.val;
                                                    var $1818 = Parser$Reply$value$($1815, $1816, Pair$new$($1802, $1817));
                                                    var $1810 = $1818;
                                                    break;
                                            };
                                            var $1803 = $1810;
                                            break;
                                    };
                                    var $1795 = $1803;
                                    break;
                            };
                            return $1795;
                        })))($1792)($1793);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1819 = self.idx;
                                var $1820 = self.code;
                                var $1821 = self.err;
                                var $1822 = Parser$Reply$error$($1819, $1820, $1821);
                                var $1794 = $1822;
                                break;
                            case 'Parser.Reply.value':
                                var $1823 = self.idx;
                                var $1824 = self.code;
                                var $1825 = self.val;
                                var self = Kind$Parser$stop$($1786, $1823, $1824);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1827 = self.idx;
                                        var $1828 = self.code;
                                        var $1829 = self.err;
                                        var $1830 = Parser$Reply$error$($1827, $1828, $1829);
                                        var $1826 = $1830;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1831 = self.idx;
                                        var $1832 = self.code;
                                        var $1833 = self.val;
                                        var _list$15 = List$fold$($1825, Kind$Term$app$(Kind$Term$ref$("List.nil"), Kind$Term$hol$(Bits$e)), (_kv$15 => _xs$16 => {
                                            var self = _kv$15;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $1836 = self.fst;
                                                    var $1837 = self.snd;
                                                    var _pair$19 = Kind$Term$ref$("Pair.new");
                                                    var _pair$20 = Kind$Term$app$(_pair$19, Kind$Term$hol$(Bits$e));
                                                    var _pair$21 = Kind$Term$app$(_pair$20, Kind$Term$hol$(Bits$e));
                                                    var _pair$22 = Kind$Term$app$(_pair$21, $1836);
                                                    var _pair$23 = Kind$Term$app$(_pair$22, $1837);
                                                    var _term$24 = Kind$Term$ref$("List.cons");
                                                    var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                    var _term$26 = Kind$Term$app$(_term$25, _pair$23);
                                                    var _term$27 = Kind$Term$app$(_term$26, _xs$16);
                                                    var $1838 = Kind$Term$ori$($1833, _term$27);
                                                    var $1835 = $1838;
                                                    break;
                                            };
                                            return $1835;
                                        }));
                                        var _term$16 = Kind$Term$ref$("Map.from_list");
                                        var _term$17 = Kind$Term$app$(_term$16, Kind$Term$hol$(Bits$e));
                                        var _term$18 = Kind$Term$app$(_term$17, _list$15);
                                        var $1834 = Parser$Reply$value$($1831, $1832, Kind$Term$ori$($1833, _term$18));
                                        var $1826 = $1834;
                                        break;
                                };
                                var $1794 = $1826;
                                break;
                        };
                        var $1787 = $1794;
                        break;
                };
                var $1779 = $1787;
                break;
        };
        return $1779;
    };
    const Kind$Parser$map = x0 => x1 => Kind$Parser$map$(x0, x1);

    function Kind$Parser$log$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1840 = self.idx;
                var $1841 = self.code;
                var $1842 = self.err;
                var $1843 = Parser$Reply$error$($1840, $1841, $1842);
                var $1839 = $1843;
                break;
            case 'Parser.Reply.value':
                var $1844 = self.idx;
                var $1845 = self.code;
                var $1846 = self.val;
                var self = Kind$Parser$text$("log(", $1844, $1845);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1848 = self.idx;
                        var $1849 = self.code;
                        var $1850 = self.err;
                        var $1851 = Parser$Reply$error$($1848, $1849, $1850);
                        var $1847 = $1851;
                        break;
                    case 'Parser.Reply.value':
                        var $1852 = self.idx;
                        var $1853 = self.code;
                        var self = Parser$until$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term))($1852)($1853);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1855 = self.idx;
                                var $1856 = self.code;
                                var $1857 = self.err;
                                var $1858 = Parser$Reply$error$($1855, $1856, $1857);
                                var $1854 = $1858;
                                break;
                            case 'Parser.Reply.value':
                                var $1859 = self.idx;
                                var $1860 = self.code;
                                var $1861 = self.val;
                                var self = Kind$Parser$term$($1859, $1860);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1863 = self.idx;
                                        var $1864 = self.code;
                                        var $1865 = self.err;
                                        var $1866 = Parser$Reply$error$($1863, $1864, $1865);
                                        var $1862 = $1866;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1867 = self.idx;
                                        var $1868 = self.code;
                                        var $1869 = self.val;
                                        var _term$15 = Kind$Term$ref$("Debug.log");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                        var _args$17 = List$fold$($1861, Kind$Term$ref$("String.nil"), (_x$17 => _xs$18 => {
                                            var _arg$19 = Kind$Term$ref$("String.concat");
                                            var _arg$20 = Kind$Term$app$(_arg$19, _x$17);
                                            var _arg$21 = Kind$Term$app$(_arg$20, _xs$18);
                                            var $1871 = _arg$21;
                                            return $1871;
                                        }));
                                        var _term$18 = Kind$Term$app$(_term$16, _args$17);
                                        var _term$19 = Kind$Term$app$(_term$18, Kind$Term$lam$("x", (_x$19 => {
                                            var $1872 = $1869;
                                            return $1872;
                                        })));
                                        var self = Kind$Parser$stop$($1846, $1867, $1868);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1873 = self.idx;
                                                var $1874 = self.code;
                                                var $1875 = self.err;
                                                var $1876 = Parser$Reply$error$($1873, $1874, $1875);
                                                var $1870 = $1876;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1877 = self.idx;
                                                var $1878 = self.code;
                                                var $1879 = self.val;
                                                var $1880 = Parser$Reply$value$($1877, $1878, Kind$Term$ori$($1879, _term$19));
                                                var $1870 = $1880;
                                                break;
                                        };
                                        var $1862 = $1870;
                                        break;
                                };
                                var $1854 = $1862;
                                break;
                        };
                        var $1847 = $1854;
                        break;
                };
                var $1839 = $1847;
                break;
        };
        return $1839;
    };
    const Kind$Parser$log = x0 => x1 => Kind$Parser$log$(x0, x1);

    function Kind$Parser$do$statements$(_monad_name$1) {
        var $1881 = Parser$first_of$(List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1883 = self.idx;
                    var $1884 = self.code;
                    var $1885 = self.err;
                    var $1886 = Parser$Reply$error$($1883, $1884, $1885);
                    var $1882 = $1886;
                    break;
                case 'Parser.Reply.value':
                    var $1887 = self.idx;
                    var $1888 = self.code;
                    var $1889 = self.val;
                    var self = Parser$first_of$(List$cons$(Kind$Parser$text("var "), List$cons$(Kind$Parser$text("get "), List$nil)))($1887)($1888);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1891 = self.idx;
                            var $1892 = self.code;
                            var $1893 = self.err;
                            var $1894 = Parser$Reply$error$($1891, $1892, $1893);
                            var $1890 = $1894;
                            break;
                        case 'Parser.Reply.value':
                            var $1895 = self.idx;
                            var $1896 = self.code;
                            var self = Kind$Parser$name1$($1895, $1896);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1898 = self.idx;
                                    var $1899 = self.code;
                                    var $1900 = self.err;
                                    var $1901 = Parser$Reply$error$($1898, $1899, $1900);
                                    var $1897 = $1901;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1902 = self.idx;
                                    var $1903 = self.code;
                                    var $1904 = self.val;
                                    var self = Kind$Parser$text$("=", $1902, $1903);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1906 = self.idx;
                                            var $1907 = self.code;
                                            var $1908 = self.err;
                                            var $1909 = Parser$Reply$error$($1906, $1907, $1908);
                                            var $1905 = $1909;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1910 = self.idx;
                                            var $1911 = self.code;
                                            var self = Kind$Parser$term$($1910, $1911);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1913 = self.idx;
                                                    var $1914 = self.code;
                                                    var $1915 = self.err;
                                                    var $1916 = Parser$Reply$error$($1913, $1914, $1915);
                                                    var $1912 = $1916;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1917 = self.idx;
                                                    var $1918 = self.code;
                                                    var $1919 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1917, $1918);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1921 = self.idx;
                                                            var $1922 = self.code;
                                                            var $1923 = self.err;
                                                            var $1924 = Parser$Reply$error$($1921, $1922, $1923);
                                                            var $1920 = $1924;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1925 = self.idx;
                                                            var $1926 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($1925)($1926);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $1928 = self.idx;
                                                                    var $1929 = self.code;
                                                                    var $1930 = self.err;
                                                                    var $1931 = Parser$Reply$error$($1928, $1929, $1930);
                                                                    var $1927 = $1931;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $1932 = self.idx;
                                                                    var $1933 = self.code;
                                                                    var $1934 = self.val;
                                                                    var self = Kind$Parser$stop$($1889, $1932, $1933);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $1936 = self.idx;
                                                                            var $1937 = self.code;
                                                                            var $1938 = self.err;
                                                                            var $1939 = Parser$Reply$error$($1936, $1937, $1938);
                                                                            var $1935 = $1939;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $1940 = self.idx;
                                                                            var $1941 = self.code;
                                                                            var $1942 = self.val;
                                                                            var _term$28 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                                            var _term$29 = Kind$Term$app$(_term$28, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                                            var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                            var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                            var _term$32 = Kind$Term$app$(_term$31, $1919);
                                                                            var _term$33 = Kind$Term$app$(_term$32, Kind$Term$lam$($1904, (_x$33 => {
                                                                                var $1944 = $1934;
                                                                                return $1944;
                                                                            })));
                                                                            var $1943 = Parser$Reply$value$($1940, $1941, Kind$Term$ori$($1942, _term$33));
                                                                            var $1935 = $1943;
                                                                            break;
                                                                    };
                                                                    var $1927 = $1935;
                                                                    break;
                                                            };
                                                            var $1920 = $1927;
                                                            break;
                                                    };
                                                    var $1912 = $1920;
                                                    break;
                                            };
                                            var $1905 = $1912;
                                            break;
                                    };
                                    var $1897 = $1905;
                                    break;
                            };
                            var $1890 = $1897;
                            break;
                    };
                    var $1882 = $1890;
                    break;
            };
            return $1882;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1946 = self.idx;
                    var $1947 = self.code;
                    var $1948 = self.err;
                    var $1949 = Parser$Reply$error$($1946, $1947, $1948);
                    var $1945 = $1949;
                    break;
                case 'Parser.Reply.value':
                    var $1950 = self.idx;
                    var $1951 = self.code;
                    var $1952 = self.val;
                    var self = Kind$Parser$text$("let ", $1950, $1951);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1954 = self.idx;
                            var $1955 = self.code;
                            var $1956 = self.err;
                            var $1957 = Parser$Reply$error$($1954, $1955, $1956);
                            var $1953 = $1957;
                            break;
                        case 'Parser.Reply.value':
                            var $1958 = self.idx;
                            var $1959 = self.code;
                            var self = Kind$Parser$name1$($1958, $1959);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1961 = self.idx;
                                    var $1962 = self.code;
                                    var $1963 = self.err;
                                    var $1964 = Parser$Reply$error$($1961, $1962, $1963);
                                    var $1960 = $1964;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1965 = self.idx;
                                    var $1966 = self.code;
                                    var $1967 = self.val;
                                    var self = Kind$Parser$text$("=", $1965, $1966);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1969 = self.idx;
                                            var $1970 = self.code;
                                            var $1971 = self.err;
                                            var $1972 = Parser$Reply$error$($1969, $1970, $1971);
                                            var $1968 = $1972;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1973 = self.idx;
                                            var $1974 = self.code;
                                            var self = Kind$Parser$term$($1973, $1974);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1976 = self.idx;
                                                    var $1977 = self.code;
                                                    var $1978 = self.err;
                                                    var $1979 = Parser$Reply$error$($1976, $1977, $1978);
                                                    var $1975 = $1979;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1980 = self.idx;
                                                    var $1981 = self.code;
                                                    var $1982 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1980, $1981);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1984 = self.idx;
                                                            var $1985 = self.code;
                                                            var $1986 = self.err;
                                                            var $1987 = Parser$Reply$error$($1984, $1985, $1986);
                                                            var $1983 = $1987;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1988 = self.idx;
                                                            var $1989 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($1988)($1989);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $1991 = self.idx;
                                                                    var $1992 = self.code;
                                                                    var $1993 = self.err;
                                                                    var $1994 = Parser$Reply$error$($1991, $1992, $1993);
                                                                    var $1990 = $1994;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $1995 = self.idx;
                                                                    var $1996 = self.code;
                                                                    var $1997 = self.val;
                                                                    var self = Kind$Parser$stop$($1952, $1995, $1996);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $1999 = self.idx;
                                                                            var $2000 = self.code;
                                                                            var $2001 = self.err;
                                                                            var $2002 = Parser$Reply$error$($1999, $2000, $2001);
                                                                            var $1998 = $2002;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2003 = self.idx;
                                                                            var $2004 = self.code;
                                                                            var $2005 = self.val;
                                                                            var $2006 = Parser$Reply$value$($2003, $2004, Kind$Term$ori$($2005, Kind$Term$let$($1967, $1982, (_x$28 => {
                                                                                var $2007 = $1997;
                                                                                return $2007;
                                                                            }))));
                                                                            var $1998 = $2006;
                                                                            break;
                                                                    };
                                                                    var $1990 = $1998;
                                                                    break;
                                                            };
                                                            var $1983 = $1990;
                                                            break;
                                                    };
                                                    var $1975 = $1983;
                                                    break;
                                            };
                                            var $1968 = $1975;
                                            break;
                                    };
                                    var $1960 = $1968;
                                    break;
                            };
                            var $1953 = $1960;
                            break;
                    };
                    var $1945 = $1953;
                    break;
            };
            return $1945;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2009 = self.idx;
                    var $2010 = self.code;
                    var $2011 = self.err;
                    var $2012 = Parser$Reply$error$($2009, $2010, $2011);
                    var $2008 = $2012;
                    break;
                case 'Parser.Reply.value':
                    var $2013 = self.idx;
                    var $2014 = self.code;
                    var $2015 = self.val;
                    var self = Kind$Parser$text$("return ", $2013, $2014);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2017 = self.idx;
                            var $2018 = self.code;
                            var $2019 = self.err;
                            var $2020 = Parser$Reply$error$($2017, $2018, $2019);
                            var $2016 = $2020;
                            break;
                        case 'Parser.Reply.value':
                            var $2021 = self.idx;
                            var $2022 = self.code;
                            var self = Kind$Parser$term$($2021, $2022);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2024 = self.idx;
                                    var $2025 = self.code;
                                    var $2026 = self.err;
                                    var $2027 = Parser$Reply$error$($2024, $2025, $2026);
                                    var $2023 = $2027;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2028 = self.idx;
                                    var $2029 = self.code;
                                    var $2030 = self.val;
                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2028, $2029);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2032 = self.idx;
                                            var $2033 = self.code;
                                            var $2034 = self.err;
                                            var $2035 = Parser$Reply$error$($2032, $2033, $2034);
                                            var $2031 = $2035;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2036 = self.idx;
                                            var $2037 = self.code;
                                            var self = Kind$Parser$stop$($2015, $2036, $2037);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2039 = self.idx;
                                                    var $2040 = self.code;
                                                    var $2041 = self.err;
                                                    var $2042 = Parser$Reply$error$($2039, $2040, $2041);
                                                    var $2038 = $2042;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2043 = self.idx;
                                                    var $2044 = self.code;
                                                    var $2045 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.pure"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, $2030);
                                                    var $2046 = Parser$Reply$value$($2043, $2044, Kind$Term$ori$($2045, _term$22));
                                                    var $2038 = $2046;
                                                    break;
                                            };
                                            var $2031 = $2038;
                                            break;
                                    };
                                    var $2023 = $2031;
                                    break;
                            };
                            var $2016 = $2023;
                            break;
                    };
                    var $2008 = $2016;
                    break;
            };
            return $2008;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2048 = self.idx;
                    var $2049 = self.code;
                    var $2050 = self.err;
                    var $2051 = Parser$Reply$error$($2048, $2049, $2050);
                    var $2047 = $2051;
                    break;
                case 'Parser.Reply.value':
                    var $2052 = self.idx;
                    var $2053 = self.code;
                    var $2054 = self.val;
                    var self = Kind$Parser$term$($2052, $2053);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2056 = self.idx;
                            var $2057 = self.code;
                            var $2058 = self.err;
                            var $2059 = Parser$Reply$error$($2056, $2057, $2058);
                            var $2055 = $2059;
                            break;
                        case 'Parser.Reply.value':
                            var $2060 = self.idx;
                            var $2061 = self.code;
                            var $2062 = self.val;
                            var self = Parser$maybe$(Kind$Parser$text(";"), $2060, $2061);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2064 = self.idx;
                                    var $2065 = self.code;
                                    var $2066 = self.err;
                                    var $2067 = Parser$Reply$error$($2064, $2065, $2066);
                                    var $2063 = $2067;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2068 = self.idx;
                                    var $2069 = self.code;
                                    var self = Kind$Parser$do$statements$(_monad_name$1)($2068)($2069);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2071 = self.idx;
                                            var $2072 = self.code;
                                            var $2073 = self.err;
                                            var $2074 = Parser$Reply$error$($2071, $2072, $2073);
                                            var $2070 = $2074;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2075 = self.idx;
                                            var $2076 = self.code;
                                            var $2077 = self.val;
                                            var self = Kind$Parser$stop$($2054, $2075, $2076);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2079 = self.idx;
                                                    var $2080 = self.code;
                                                    var $2081 = self.err;
                                                    var $2082 = Parser$Reply$error$($2079, $2080, $2081);
                                                    var $2078 = $2082;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2083 = self.idx;
                                                    var $2084 = self.code;
                                                    var $2085 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, Kind$Term$hol$(Bits$e));
                                                    var _term$23 = Kind$Term$app$(_term$22, $2062);
                                                    var _term$24 = Kind$Term$app$(_term$23, Kind$Term$lam$("", (_x$24 => {
                                                        var $2087 = $2077;
                                                        return $2087;
                                                    })));
                                                    var $2086 = Parser$Reply$value$($2083, $2084, Kind$Term$ori$($2085, _term$24));
                                                    var $2078 = $2086;
                                                    break;
                                            };
                                            var $2070 = $2078;
                                            break;
                                    };
                                    var $2063 = $2070;
                                    break;
                            };
                            var $2055 = $2063;
                            break;
                    };
                    var $2047 = $2055;
                    break;
            };
            return $2047;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$term$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2089 = self.idx;
                    var $2090 = self.code;
                    var $2091 = self.err;
                    var $2092 = Parser$Reply$error$($2089, $2090, $2091);
                    var $2088 = $2092;
                    break;
                case 'Parser.Reply.value':
                    var $2093 = self.idx;
                    var $2094 = self.code;
                    var $2095 = self.val;
                    var self = Parser$maybe$(Kind$Parser$text(";"), $2093, $2094);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2097 = self.idx;
                            var $2098 = self.code;
                            var $2099 = self.err;
                            var $2100 = Parser$Reply$error$($2097, $2098, $2099);
                            var $2096 = $2100;
                            break;
                        case 'Parser.Reply.value':
                            var $2101 = self.idx;
                            var $2102 = self.code;
                            var $2103 = Parser$Reply$value$($2101, $2102, $2095);
                            var $2096 = $2103;
                            break;
                    };
                    var $2088 = $2096;
                    break;
            };
            return $2088;
        }), List$nil))))));
        return $1881;
    };
    const Kind$Parser$do$statements = x0 => Kind$Parser$do$statements$(x0);

    function Kind$Parser$do$(_idx$1, _code$2) {
        var self = Parser$maybe$(Kind$Parser$text("do "), _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2105 = self.idx;
                var $2106 = self.code;
                var $2107 = self.err;
                var $2108 = Parser$Reply$error$($2105, $2106, $2107);
                var $2104 = $2108;
                break;
            case 'Parser.Reply.value':
                var $2109 = self.idx;
                var $2110 = self.code;
                var self = Kind$Parser$name1$($2109, $2110);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2112 = self.idx;
                        var $2113 = self.code;
                        var $2114 = self.err;
                        var $2115 = Parser$Reply$error$($2112, $2113, $2114);
                        var $2111 = $2115;
                        break;
                    case 'Parser.Reply.value':
                        var $2116 = self.idx;
                        var $2117 = self.code;
                        var $2118 = self.val;
                        var self = Kind$Parser$text$("{", $2116, $2117);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2120 = self.idx;
                                var $2121 = self.code;
                                var $2122 = self.err;
                                var $2123 = Parser$Reply$error$($2120, $2121, $2122);
                                var $2119 = $2123;
                                break;
                            case 'Parser.Reply.value':
                                var $2124 = self.idx;
                                var $2125 = self.code;
                                var self = Kind$Parser$do$statements$($2118)($2124)($2125);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2127 = self.idx;
                                        var $2128 = self.code;
                                        var $2129 = self.err;
                                        var $2130 = Parser$Reply$error$($2127, $2128, $2129);
                                        var $2126 = $2130;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2131 = self.idx;
                                        var $2132 = self.code;
                                        var $2133 = self.val;
                                        var self = Kind$Parser$text$("}", $2131, $2132);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2135 = self.idx;
                                                var $2136 = self.code;
                                                var $2137 = self.err;
                                                var $2138 = Parser$Reply$error$($2135, $2136, $2137);
                                                var $2134 = $2138;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2139 = self.idx;
                                                var $2140 = self.code;
                                                var $2141 = Parser$Reply$value$($2139, $2140, $2133);
                                                var $2134 = $2141;
                                                break;
                                        };
                                        var $2126 = $2134;
                                        break;
                                };
                                var $2119 = $2126;
                                break;
                        };
                        var $2111 = $2119;
                        break;
                };
                var $2104 = $2111;
                break;
        };
        return $2104;
    };
    const Kind$Parser$do = x0 => x1 => Kind$Parser$do$(x0, x1);

    function Kind$Term$nat$(_natx$1) {
        var $2142 = ({
            _: 'Kind.Term.nat',
            'natx': _natx$1
        });
        return $2142;
    };
    const Kind$Term$nat = x0 => Kind$Term$nat$(x0);

    function Kind$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $2144 = Kind$Term$ref$(Kind$Name$read$("Nat.zero"));
            var $2143 = $2144;
        } else {
            var $2145 = (self - 1n);
            var _func$3 = Kind$Term$ref$(Kind$Name$read$("Nat.succ"));
            var _argm$4 = Kind$Term$nat$($2145);
            var $2146 = Kind$Term$app$(_func$3, _argm$4);
            var $2143 = $2146;
        };
        return $2143;
    };
    const Kind$Term$unroll_nat = x0 => Kind$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Kind$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2148 = self.slice(0, -1);
                var $2149 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.o")), Kind$Term$unroll_chr$bits$($2148));
                var $2147 = $2149;
                break;
            case 'i':
                var $2150 = self.slice(0, -1);
                var $2151 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.i")), Kind$Term$unroll_chr$bits$($2150));
                var $2147 = $2151;
                break;
            case 'e':
                var $2152 = Kind$Term$ref$(Kind$Name$read$("Bits.e"));
                var $2147 = $2152;
                break;
        };
        return $2147;
    };
    const Kind$Term$unroll_chr$bits = x0 => Kind$Term$unroll_chr$bits$(x0);

    function Kind$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Kind$Term$ref$(Kind$Name$read$("Word.from_bits"));
        var _term$4 = Kind$Term$app$(_term$3, Kind$Term$nat$(16n));
        var _term$5 = Kind$Term$app$(_term$4, Kind$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("U16.new")), _term$5);
        var $2153 = _term$6;
        return $2153;
    };
    const Kind$Term$unroll_chr = x0 => Kind$Term$unroll_chr$(x0);

    function Kind$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $2155 = Kind$Term$ref$(Kind$Name$read$("String.nil"));
            var $2154 = $2155;
        } else {
            var $2156 = self.charCodeAt(0);
            var $2157 = self.slice(1);
            var _char$4 = Kind$Term$chr$($2156);
            var _term$5 = Kind$Term$ref$(Kind$Name$read$("String.cons"));
            var _term$6 = Kind$Term$app$(_term$5, _char$4);
            var _term$7 = Kind$Term$app$(_term$6, Kind$Term$str$($2157));
            var $2158 = _term$7;
            var $2154 = $2158;
        };
        return $2154;
    };
    const Kind$Term$unroll_str = x0 => Kind$Term$unroll_str$(x0);

    function Kind$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $2160 = self.name;
                var self = Kind$get$($2160, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $2162 = self.value;
                        var self = $2162;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $2164 = self.term;
                                var $2165 = Kind$Term$reduce$($2164, _defs$2);
                                var $2163 = $2165;
                                break;
                        };
                        var $2161 = $2163;
                        break;
                    case 'Maybe.none':
                        var $2166 = Kind$Term$ref$($2160);
                        var $2161 = $2166;
                        break;
                };
                var $2159 = $2161;
                break;
            case 'Kind.Term.app':
                var $2167 = self.func;
                var $2168 = self.argm;
                var _func$5 = Kind$Term$reduce$($2167, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $2170 = self.body;
                        var $2171 = Kind$Term$reduce$($2170($2168), _defs$2);
                        var $2169 = $2171;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $2172 = _term$1;
                        var $2169 = $2172;
                        break;
                };
                var $2159 = $2169;
                break;
            case 'Kind.Term.let':
                var $2173 = self.expr;
                var $2174 = self.body;
                var $2175 = Kind$Term$reduce$($2174($2173), _defs$2);
                var $2159 = $2175;
                break;
            case 'Kind.Term.def':
                var $2176 = self.expr;
                var $2177 = self.body;
                var $2178 = Kind$Term$reduce$($2177($2176), _defs$2);
                var $2159 = $2178;
                break;
            case 'Kind.Term.ann':
                var $2179 = self.term;
                var $2180 = Kind$Term$reduce$($2179, _defs$2);
                var $2159 = $2180;
                break;
            case 'Kind.Term.nat':
                var $2181 = self.natx;
                var $2182 = Kind$Term$reduce$(Kind$Term$unroll_nat$($2181), _defs$2);
                var $2159 = $2182;
                break;
            case 'Kind.Term.chr':
                var $2183 = self.chrx;
                var $2184 = Kind$Term$reduce$(Kind$Term$unroll_chr$($2183), _defs$2);
                var $2159 = $2184;
                break;
            case 'Kind.Term.str':
                var $2185 = self.strx;
                var $2186 = Kind$Term$reduce$(Kind$Term$unroll_str$($2185), _defs$2);
                var $2159 = $2186;
                break;
            case 'Kind.Term.ori':
                var $2187 = self.expr;
                var $2188 = Kind$Term$reduce$($2187, _defs$2);
                var $2159 = $2188;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.cse':
                var $2189 = _term$1;
                var $2159 = $2189;
                break;
        };
        return $2159;
    };
    const Kind$Term$reduce = x0 => x1 => Kind$Term$reduce$(x0, x1);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$9) {
        var $2190 = ({
            _: 'Kind.Def.new',
            'file': _file$1,
            'code': _code$2,
            'orig': _orig$3,
            'name': _name$4,
            'term': _term$5,
            'type': _type$6,
            'isct': _isct$7,
            'arit': _arit$8,
            'stat': _stat$9
        });
        return $2190;
    };
    const Kind$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Def$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const Kind$Status$init = ({
        _: 'Kind.Status.init'
    });

    function Kind$Parser$case$with$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("with", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2192 = self.idx;
                var $2193 = self.code;
                var $2194 = self.err;
                var $2195 = Parser$Reply$error$($2192, $2193, $2194);
                var $2191 = $2195;
                break;
            case 'Parser.Reply.value':
                var $2196 = self.idx;
                var $2197 = self.code;
                var self = Kind$Parser$name1$($2196, $2197);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2199 = self.idx;
                        var $2200 = self.code;
                        var $2201 = self.err;
                        var $2202 = Parser$Reply$error$($2199, $2200, $2201);
                        var $2198 = $2202;
                        break;
                    case 'Parser.Reply.value':
                        var $2203 = self.idx;
                        var $2204 = self.code;
                        var $2205 = self.val;
                        var self = Kind$Parser$text$(":", $2203, $2204);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2207 = self.idx;
                                var $2208 = self.code;
                                var $2209 = self.err;
                                var $2210 = Parser$Reply$error$($2207, $2208, $2209);
                                var $2206 = $2210;
                                break;
                            case 'Parser.Reply.value':
                                var $2211 = self.idx;
                                var $2212 = self.code;
                                var self = Kind$Parser$term$($2211, $2212);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2214 = self.idx;
                                        var $2215 = self.code;
                                        var $2216 = self.err;
                                        var $2217 = Parser$Reply$error$($2214, $2215, $2216);
                                        var $2213 = $2217;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2218 = self.idx;
                                        var $2219 = self.code;
                                        var $2220 = self.val;
                                        var self = Kind$Parser$text$("=", $2218, $2219);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2222 = self.idx;
                                                var $2223 = self.code;
                                                var $2224 = self.err;
                                                var $2225 = Parser$Reply$error$($2222, $2223, $2224);
                                                var $2221 = $2225;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2226 = self.idx;
                                                var $2227 = self.code;
                                                var self = Kind$Parser$term$($2226, $2227);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2229 = self.idx;
                                                        var $2230 = self.code;
                                                        var $2231 = self.err;
                                                        var $2232 = Parser$Reply$error$($2229, $2230, $2231);
                                                        var $2228 = $2232;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2233 = self.idx;
                                                        var $2234 = self.code;
                                                        var $2235 = self.val;
                                                        var $2236 = Parser$Reply$value$($2233, $2234, Kind$Def$new$("", "", Pair$new$(0n, 0n), $2205, $2235, $2220, Bool$false, 0n, Kind$Status$init));
                                                        var $2228 = $2236;
                                                        break;
                                                };
                                                var $2221 = $2228;
                                                break;
                                        };
                                        var $2213 = $2221;
                                        break;
                                };
                                var $2206 = $2213;
                                break;
                        };
                        var $2198 = $2206;
                        break;
                };
                var $2191 = $2198;
                break;
        };
        return $2191;
    };
    const Kind$Parser$case$with = x0 => x1 => Kind$Parser$case$with$(x0, x1);

    function Kind$Parser$case$case$(_idx$1, _code$2) {
        var self = Kind$Parser$name1$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2238 = self.idx;
                var $2239 = self.code;
                var $2240 = self.err;
                var $2241 = Parser$Reply$error$($2238, $2239, $2240);
                var $2237 = $2241;
                break;
            case 'Parser.Reply.value':
                var $2242 = self.idx;
                var $2243 = self.code;
                var $2244 = self.val;
                var self = Kind$Parser$text$(":", $2242, $2243);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2246 = self.idx;
                        var $2247 = self.code;
                        var $2248 = self.err;
                        var $2249 = Parser$Reply$error$($2246, $2247, $2248);
                        var $2245 = $2249;
                        break;
                    case 'Parser.Reply.value':
                        var $2250 = self.idx;
                        var $2251 = self.code;
                        var self = Kind$Parser$term$($2250, $2251);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2253 = self.idx;
                                var $2254 = self.code;
                                var $2255 = self.err;
                                var $2256 = Parser$Reply$error$($2253, $2254, $2255);
                                var $2252 = $2256;
                                break;
                            case 'Parser.Reply.value':
                                var $2257 = self.idx;
                                var $2258 = self.code;
                                var $2259 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text(","), $2257, $2258);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2261 = self.idx;
                                        var $2262 = self.code;
                                        var $2263 = self.err;
                                        var $2264 = Parser$Reply$error$($2261, $2262, $2263);
                                        var $2260 = $2264;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2265 = self.idx;
                                        var $2266 = self.code;
                                        var $2267 = Parser$Reply$value$($2265, $2266, Pair$new$($2244, $2259));
                                        var $2260 = $2267;
                                        break;
                                };
                                var $2252 = $2260;
                                break;
                        };
                        var $2245 = $2252;
                        break;
                };
                var $2237 = $2245;
                break;
        };
        return $2237;
    };
    const Kind$Parser$case$case = x0 => x1 => Kind$Parser$case$case$(x0, x1);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $2268 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $2268;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2270 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2272 = self.val;
                        var $2273 = self.lft;
                        var $2274 = self.rgt;
                        var $2275 = BitsMap$tie$($2272, BitsMap$set$($2270, _val$3, $2273), $2274);
                        var $2271 = $2275;
                        break;
                    case 'BitsMap.new':
                        var $2276 = BitsMap$tie$(Maybe$none, BitsMap$set$($2270, _val$3, BitsMap$new), BitsMap$new);
                        var $2271 = $2276;
                        break;
                };
                var $2269 = $2271;
                break;
            case 'i':
                var $2277 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2279 = self.val;
                        var $2280 = self.lft;
                        var $2281 = self.rgt;
                        var $2282 = BitsMap$tie$($2279, $2280, BitsMap$set$($2277, _val$3, $2281));
                        var $2278 = $2282;
                        break;
                    case 'BitsMap.new':
                        var $2283 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($2277, _val$3, BitsMap$new));
                        var $2278 = $2283;
                        break;
                };
                var $2269 = $2278;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2285 = self.lft;
                        var $2286 = self.rgt;
                        var $2287 = BitsMap$tie$(Maybe$some$(_val$3), $2285, $2286);
                        var $2284 = $2287;
                        break;
                    case 'BitsMap.new':
                        var $2288 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $2284 = $2288;
                        break;
                };
                var $2269 = $2284;
                break;
        };
        return $2269;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);

    function BitsMap$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $2290 = self.head;
                var $2291 = self.tail;
                var self = $2290;
                switch (self._) {
                    case 'Pair.new':
                        var $2293 = self.fst;
                        var $2294 = self.snd;
                        var $2295 = BitsMap$set$($2293, $2294, BitsMap$from_list$($2291));
                        var $2292 = $2295;
                        break;
                };
                var $2289 = $2292;
                break;
            case 'List.nil':
                var $2296 = BitsMap$new;
                var $2289 = $2296;
                break;
        };
        return $2289;
    };
    const BitsMap$from_list = x0 => BitsMap$from_list$(x0);

    function Kind$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $2297 = ({
            _: 'Kind.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $2297;
    };
    const Kind$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$cse$(x0, x1, x2, x3, x4, x5);

    function Kind$Parser$case$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2299 = self.idx;
                var $2300 = self.code;
                var $2301 = self.err;
                var $2302 = Parser$Reply$error$($2299, $2300, $2301);
                var $2298 = $2302;
                break;
            case 'Parser.Reply.value':
                var $2303 = self.idx;
                var $2304 = self.code;
                var $2305 = self.val;
                var self = Kind$Parser$text$("case ", $2303, $2304);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2307 = self.idx;
                        var $2308 = self.code;
                        var $2309 = self.err;
                        var $2310 = Parser$Reply$error$($2307, $2308, $2309);
                        var $2306 = $2310;
                        break;
                    case 'Parser.Reply.value':
                        var $2311 = self.idx;
                        var $2312 = self.code;
                        var self = Kind$Parser$spaces($2311)($2312);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2314 = self.idx;
                                var $2315 = self.code;
                                var $2316 = self.err;
                                var $2317 = Parser$Reply$error$($2314, $2315, $2316);
                                var $2313 = $2317;
                                break;
                            case 'Parser.Reply.value':
                                var $2318 = self.idx;
                                var $2319 = self.code;
                                var self = Kind$Parser$term$($2318, $2319);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2321 = self.idx;
                                        var $2322 = self.code;
                                        var $2323 = self.err;
                                        var $2324 = Parser$Reply$error$($2321, $2322, $2323);
                                        var $2320 = $2324;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2325 = self.idx;
                                        var $2326 = self.code;
                                        var $2327 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2330 = self.idx;
                                                    var $2331 = self.code;
                                                    var $2332 = self.err;
                                                    var $2333 = Parser$Reply$error$($2330, $2331, $2332);
                                                    var $2329 = $2333;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2334 = self.idx;
                                                    var $2335 = self.code;
                                                    var $2336 = Kind$Parser$name1$($2334, $2335);
                                                    var $2329 = $2336;
                                                    break;
                                            };
                                            return $2329;
                                        }), $2325, $2326);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2337 = self.idx;
                                                var $2338 = self.code;
                                                var $2339 = self.err;
                                                var $2340 = Parser$Reply$error$($2337, $2338, $2339);
                                                var $2328 = $2340;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2341 = self.idx;
                                                var $2342 = self.code;
                                                var $2343 = self.val;
                                                var self = $2343;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2345 = self.value;
                                                        var $2346 = $2345;
                                                        var _name$18 = $2346;
                                                        break;
                                                    case 'Maybe.none':
                                                        var self = Kind$Term$reduce$($2327, BitsMap$new);
                                                        switch (self._) {
                                                            case 'Kind.Term.var':
                                                                var $2348 = self.name;
                                                                var $2349 = $2348;
                                                                var $2347 = $2349;
                                                                break;
                                                            case 'Kind.Term.ref':
                                                                var $2350 = self.name;
                                                                var $2351 = $2350;
                                                                var $2347 = $2351;
                                                                break;
                                                            case 'Kind.Term.typ':
                                                            case 'Kind.Term.all':
                                                            case 'Kind.Term.lam':
                                                            case 'Kind.Term.app':
                                                            case 'Kind.Term.let':
                                                            case 'Kind.Term.def':
                                                            case 'Kind.Term.ann':
                                                            case 'Kind.Term.gol':
                                                            case 'Kind.Term.hol':
                                                            case 'Kind.Term.nat':
                                                            case 'Kind.Term.chr':
                                                            case 'Kind.Term.str':
                                                            case 'Kind.Term.cse':
                                                            case 'Kind.Term.ori':
                                                                var $2352 = Kind$Name$read$("self");
                                                                var $2347 = $2352;
                                                                break;
                                                        };
                                                        var _name$18 = $2347;
                                                        break;
                                                };
                                                var self = Parser$many$(Kind$Parser$case$with)($2341)($2342);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2353 = self.idx;
                                                        var $2354 = self.code;
                                                        var $2355 = self.err;
                                                        var $2356 = Parser$Reply$error$($2353, $2354, $2355);
                                                        var $2344 = $2356;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2357 = self.idx;
                                                        var $2358 = self.code;
                                                        var $2359 = self.val;
                                                        var self = Kind$Parser$text$("{", $2357, $2358);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2361 = self.idx;
                                                                var $2362 = self.code;
                                                                var $2363 = self.err;
                                                                var $2364 = Parser$Reply$error$($2361, $2362, $2363);
                                                                var $2360 = $2364;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2365 = self.idx;
                                                                var $2366 = self.code;
                                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$case$case)($2365)($2366);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2368 = self.idx;
                                                                        var $2369 = self.code;
                                                                        var $2370 = self.err;
                                                                        var $2371 = Parser$Reply$error$($2368, $2369, $2370);
                                                                        var $2367 = $2371;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2372 = self.idx;
                                                                        var $2373 = self.code;
                                                                        var $2374 = self.val;
                                                                        var self = Parser$maybe$((_idx$28 => _code$29 => {
                                                                            var self = Kind$Parser$text$("else ", _idx$28, _code$29);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2377 = self.idx;
                                                                                    var $2378 = self.code;
                                                                                    var $2379 = self.err;
                                                                                    var $2380 = Parser$Reply$error$($2377, $2378, $2379);
                                                                                    var $2376 = $2380;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2381 = self.idx;
                                                                                    var $2382 = self.code;
                                                                                    var self = Kind$Parser$term$($2381, $2382);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2384 = self.idx;
                                                                                            var $2385 = self.code;
                                                                                            var $2386 = self.err;
                                                                                            var $2387 = Parser$Reply$error$($2384, $2385, $2386);
                                                                                            var $2383 = $2387;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2388 = self.idx;
                                                                                            var $2389 = self.code;
                                                                                            var $2390 = self.val;
                                                                                            var $2391 = Parser$Reply$value$($2388, $2389, $2390);
                                                                                            var $2383 = $2391;
                                                                                            break;
                                                                                    };
                                                                                    var $2376 = $2383;
                                                                                    break;
                                                                            };
                                                                            return $2376;
                                                                        }), $2372, $2373);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2392 = self.idx;
                                                                                var $2393 = self.code;
                                                                                var $2394 = self.err;
                                                                                var $2395 = Parser$Reply$error$($2392, $2393, $2394);
                                                                                var $2375 = $2395;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2396 = self.idx;
                                                                                var $2397 = self.code;
                                                                                var $2398 = self.val;
                                                                                var self = $2398;
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $2400 = self.value;
                                                                                        var $2401 = List$cons$(Pair$new$("_", $2400), $2374);
                                                                                        var _cses$31 = $2401;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $2402 = $2374;
                                                                                        var _cses$31 = $2402;
                                                                                        break;
                                                                                };
                                                                                var _cses$32 = BitsMap$from_list$(List$mapped$(_cses$31, (_kv$32 => {
                                                                                    var self = _kv$32;
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $2404 = self.fst;
                                                                                            var $2405 = self.snd;
                                                                                            var $2406 = Pair$new$((kind_name_to_bits($2404)), $2405);
                                                                                            var $2403 = $2406;
                                                                                            break;
                                                                                    };
                                                                                    return $2403;
                                                                                })));
                                                                                var self = Parser$first_of$(List$cons$((_idx$33 => _code$34 => {
                                                                                    var self = Kind$Parser$text$(":", _idx$33, _code$34);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2408 = self.idx;
                                                                                            var $2409 = self.code;
                                                                                            var $2410 = self.err;
                                                                                            var $2411 = Parser$Reply$error$($2408, $2409, $2410);
                                                                                            var $2407 = $2411;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2412 = self.idx;
                                                                                            var $2413 = self.code;
                                                                                            var self = Kind$Parser$term$($2412, $2413);
                                                                                            switch (self._) {
                                                                                                case 'Parser.Reply.error':
                                                                                                    var $2415 = self.idx;
                                                                                                    var $2416 = self.code;
                                                                                                    var $2417 = self.err;
                                                                                                    var $2418 = Parser$Reply$error$($2415, $2416, $2417);
                                                                                                    var $2414 = $2418;
                                                                                                    break;
                                                                                                case 'Parser.Reply.value':
                                                                                                    var $2419 = self.idx;
                                                                                                    var $2420 = self.code;
                                                                                                    var $2421 = self.val;
                                                                                                    var $2422 = Parser$Reply$value$($2419, $2420, Maybe$some$($2421));
                                                                                                    var $2414 = $2422;
                                                                                                    break;
                                                                                            };
                                                                                            var $2407 = $2414;
                                                                                            break;
                                                                                    };
                                                                                    return $2407;
                                                                                }), List$cons$((_idx$33 => _code$34 => {
                                                                                    var self = Kind$Parser$text$("!", _idx$33, _code$34);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2424 = self.idx;
                                                                                            var $2425 = self.code;
                                                                                            var $2426 = self.err;
                                                                                            var $2427 = Parser$Reply$error$($2424, $2425, $2426);
                                                                                            var $2423 = $2427;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2428 = self.idx;
                                                                                            var $2429 = self.code;
                                                                                            var $2430 = Parser$Reply$value$($2428, $2429, Maybe$none);
                                                                                            var $2423 = $2430;
                                                                                            break;
                                                                                    };
                                                                                    return $2423;
                                                                                }), List$cons$((_idx$33 => _code$34 => {
                                                                                    var $2431 = Parser$Reply$value$(_idx$33, _code$34, Maybe$some$(Kind$Term$hol$(Bits$e)));
                                                                                    return $2431;
                                                                                }), List$nil))))($2396)($2397);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2432 = self.idx;
                                                                                        var $2433 = self.code;
                                                                                        var $2434 = self.err;
                                                                                        var $2435 = Parser$Reply$error$($2432, $2433, $2434);
                                                                                        var $2399 = $2435;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2436 = self.idx;
                                                                                        var $2437 = self.code;
                                                                                        var $2438 = self.val;
                                                                                        var self = Kind$Parser$stop$($2305, $2436, $2437);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2440 = self.idx;
                                                                                                var $2441 = self.code;
                                                                                                var $2442 = self.err;
                                                                                                var $2443 = Parser$Reply$error$($2440, $2441, $2442);
                                                                                                var $2439 = $2443;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2444 = self.idx;
                                                                                                var $2445 = self.code;
                                                                                                var $2446 = self.val;
                                                                                                var $2447 = Parser$Reply$value$($2444, $2445, Kind$Term$ori$($2446, Kind$Term$cse$(Bits$e, $2327, _name$18, $2359, _cses$32, $2438)));
                                                                                                var $2439 = $2447;
                                                                                                break;
                                                                                        };
                                                                                        var $2399 = $2439;
                                                                                        break;
                                                                                };
                                                                                var $2375 = $2399;
                                                                                break;
                                                                        };
                                                                        var $2367 = $2375;
                                                                        break;
                                                                };
                                                                var $2360 = $2367;
                                                                break;
                                                        };
                                                        var $2344 = $2360;
                                                        break;
                                                };
                                                var $2328 = $2344;
                                                break;
                                        };
                                        var $2320 = $2328;
                                        break;
                                };
                                var $2313 = $2320;
                                break;
                        };
                        var $2306 = $2313;
                        break;
                };
                var $2298 = $2306;
                break;
        };
        return $2298;
    };
    const Kind$Parser$case = x0 => x1 => Kind$Parser$case$(x0, x1);

    function Kind$set$(_name$2, _val$3, _map$4) {
        var $2448 = BitsMap$set$((kind_name_to_bits(_name$2)), _val$3, _map$4);
        return $2448;
    };
    const Kind$set = x0 => x1 => x2 => Kind$set$(x0, x1, x2);

    function Kind$Parser$open$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2450 = self.idx;
                var $2451 = self.code;
                var $2452 = self.err;
                var $2453 = Parser$Reply$error$($2450, $2451, $2452);
                var $2449 = $2453;
                break;
            case 'Parser.Reply.value':
                var $2454 = self.idx;
                var $2455 = self.code;
                var $2456 = self.val;
                var self = Kind$Parser$text$("open ", $2454, $2455);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2458 = self.idx;
                        var $2459 = self.code;
                        var $2460 = self.err;
                        var $2461 = Parser$Reply$error$($2458, $2459, $2460);
                        var $2457 = $2461;
                        break;
                    case 'Parser.Reply.value':
                        var $2462 = self.idx;
                        var $2463 = self.code;
                        var self = Kind$Parser$spaces($2462)($2463);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2465 = self.idx;
                                var $2466 = self.code;
                                var $2467 = self.err;
                                var $2468 = Parser$Reply$error$($2465, $2466, $2467);
                                var $2464 = $2468;
                                break;
                            case 'Parser.Reply.value':
                                var $2469 = self.idx;
                                var $2470 = self.code;
                                var self = Kind$Parser$term$($2469, $2470);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2472 = self.idx;
                                        var $2473 = self.code;
                                        var $2474 = self.err;
                                        var $2475 = Parser$Reply$error$($2472, $2473, $2474);
                                        var $2471 = $2475;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2476 = self.idx;
                                        var $2477 = self.code;
                                        var $2478 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2481 = self.idx;
                                                    var $2482 = self.code;
                                                    var $2483 = self.err;
                                                    var $2484 = Parser$Reply$error$($2481, $2482, $2483);
                                                    var $2480 = $2484;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2485 = self.idx;
                                                    var $2486 = self.code;
                                                    var $2487 = Kind$Parser$name1$($2485, $2486);
                                                    var $2480 = $2487;
                                                    break;
                                            };
                                            return $2480;
                                        }), $2476, $2477);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2488 = self.idx;
                                                var $2489 = self.code;
                                                var $2490 = self.err;
                                                var $2491 = Parser$Reply$error$($2488, $2489, $2490);
                                                var $2479 = $2491;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2492 = self.idx;
                                                var $2493 = self.code;
                                                var $2494 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2492, $2493);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2496 = self.idx;
                                                        var $2497 = self.code;
                                                        var $2498 = self.err;
                                                        var $2499 = Parser$Reply$error$($2496, $2497, $2498);
                                                        var $2495 = $2499;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2500 = self.idx;
                                                        var $2501 = self.code;
                                                        var self = $2494;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2503 = self.value;
                                                                var $2504 = $2503;
                                                                var _name$21 = $2504;
                                                                break;
                                                            case 'Maybe.none':
                                                                var self = Kind$Term$reduce$($2478, BitsMap$new);
                                                                switch (self._) {
                                                                    case 'Kind.Term.var':
                                                                        var $2506 = self.name;
                                                                        var $2507 = $2506;
                                                                        var $2505 = $2507;
                                                                        break;
                                                                    case 'Kind.Term.ref':
                                                                        var $2508 = self.name;
                                                                        var $2509 = $2508;
                                                                        var $2505 = $2509;
                                                                        break;
                                                                    case 'Kind.Term.typ':
                                                                    case 'Kind.Term.all':
                                                                    case 'Kind.Term.lam':
                                                                    case 'Kind.Term.app':
                                                                    case 'Kind.Term.let':
                                                                    case 'Kind.Term.def':
                                                                    case 'Kind.Term.ann':
                                                                    case 'Kind.Term.gol':
                                                                    case 'Kind.Term.hol':
                                                                    case 'Kind.Term.nat':
                                                                    case 'Kind.Term.chr':
                                                                    case 'Kind.Term.str':
                                                                    case 'Kind.Term.cse':
                                                                    case 'Kind.Term.ori':
                                                                        var $2510 = Kind$Name$read$("self");
                                                                        var $2505 = $2510;
                                                                        break;
                                                                };
                                                                var _name$21 = $2505;
                                                                break;
                                                        };
                                                        var _wyth$22 = List$nil;
                                                        var self = Kind$Parser$term$($2500, $2501);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2511 = self.idx;
                                                                var $2512 = self.code;
                                                                var $2513 = self.err;
                                                                var $2514 = Parser$Reply$error$($2511, $2512, $2513);
                                                                var $2502 = $2514;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2515 = self.idx;
                                                                var $2516 = self.code;
                                                                var $2517 = self.val;
                                                                var _cses$26 = Kind$set$("_", $2517, BitsMap$new);
                                                                var _moti$27 = Maybe$some$(Kind$Term$hol$(Bits$e));
                                                                var self = Kind$Parser$stop$($2456, $2515, $2516);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2519 = self.idx;
                                                                        var $2520 = self.code;
                                                                        var $2521 = self.err;
                                                                        var $2522 = Parser$Reply$error$($2519, $2520, $2521);
                                                                        var $2518 = $2522;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2523 = self.idx;
                                                                        var $2524 = self.code;
                                                                        var $2525 = self.val;
                                                                        var $2526 = Parser$Reply$value$($2523, $2524, Kind$Term$ori$($2525, Kind$Term$cse$(Bits$e, $2478, _name$21, _wyth$22, _cses$26, _moti$27)));
                                                                        var $2518 = $2526;
                                                                        break;
                                                                };
                                                                var $2502 = $2518;
                                                                break;
                                                        };
                                                        var $2495 = $2502;
                                                        break;
                                                };
                                                var $2479 = $2495;
                                                break;
                                        };
                                        var $2471 = $2479;
                                        break;
                                };
                                var $2464 = $2471;
                                break;
                        };
                        var $2457 = $2464;
                        break;
                };
                var $2449 = $2457;
                break;
        };
        return $2449;
    };
    const Kind$Parser$open = x0 => x1 => Kind$Parser$open$(x0, x1);

    function Kind$Parser$without$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2528 = self.idx;
                var $2529 = self.code;
                var $2530 = self.err;
                var $2531 = Parser$Reply$error$($2528, $2529, $2530);
                var $2527 = $2531;
                break;
            case 'Parser.Reply.value':
                var $2532 = self.idx;
                var $2533 = self.code;
                var $2534 = self.val;
                var self = Kind$Parser$text$("without ", $2532, $2533);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2536 = self.idx;
                        var $2537 = self.code;
                        var $2538 = self.err;
                        var $2539 = Parser$Reply$error$($2536, $2537, $2538);
                        var $2535 = $2539;
                        break;
                    case 'Parser.Reply.value':
                        var $2540 = self.idx;
                        var $2541 = self.code;
                        var self = Kind$Parser$name1$($2540, $2541);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2543 = self.idx;
                                var $2544 = self.code;
                                var $2545 = self.err;
                                var $2546 = Parser$Reply$error$($2543, $2544, $2545);
                                var $2542 = $2546;
                                break;
                            case 'Parser.Reply.value':
                                var $2547 = self.idx;
                                var $2548 = self.code;
                                var $2549 = self.val;
                                var self = Kind$Parser$text$(":", $2547, $2548);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2551 = self.idx;
                                        var $2552 = self.code;
                                        var $2553 = self.err;
                                        var $2554 = Parser$Reply$error$($2551, $2552, $2553);
                                        var $2550 = $2554;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2555 = self.idx;
                                        var $2556 = self.code;
                                        var self = Kind$Parser$term$($2555, $2556);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2558 = self.idx;
                                                var $2559 = self.code;
                                                var $2560 = self.err;
                                                var $2561 = Parser$Reply$error$($2558, $2559, $2560);
                                                var $2557 = $2561;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2562 = self.idx;
                                                var $2563 = self.code;
                                                var $2564 = self.val;
                                                var self = Kind$Parser$term$($2562, $2563);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2566 = self.idx;
                                                        var $2567 = self.code;
                                                        var $2568 = self.err;
                                                        var $2569 = Parser$Reply$error$($2566, $2567, $2568);
                                                        var $2565 = $2569;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2570 = self.idx;
                                                        var $2571 = self.code;
                                                        var $2572 = self.val;
                                                        var self = Kind$Parser$stop$($2534, $2570, $2571);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2574 = self.idx;
                                                                var $2575 = self.code;
                                                                var $2576 = self.err;
                                                                var $2577 = Parser$Reply$error$($2574, $2575, $2576);
                                                                var $2573 = $2577;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2578 = self.idx;
                                                                var $2579 = self.code;
                                                                var $2580 = self.val;
                                                                var _term$24 = Kind$Term$ref$($2549);
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$lam$("x", (_x$25 => {
                                                                    var $2582 = Kind$Term$hol$(Bits$e);
                                                                    return $2582;
                                                                })));
                                                                var _term$26 = Kind$Term$app$(_term$25, $2564);
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$lam$($2549, (_x$27 => {
                                                                    var $2583 = $2572;
                                                                    return $2583;
                                                                })));
                                                                var $2581 = Parser$Reply$value$($2578, $2579, Kind$Term$ori$($2580, _term$27));
                                                                var $2573 = $2581;
                                                                break;
                                                        };
                                                        var $2565 = $2573;
                                                        break;
                                                };
                                                var $2557 = $2565;
                                                break;
                                        };
                                        var $2550 = $2557;
                                        break;
                                };
                                var $2542 = $2550;
                                break;
                        };
                        var $2535 = $2542;
                        break;
                };
                var $2527 = $2535;
                break;
        };
        return $2527;
    };
    const Kind$Parser$without = x0 => x1 => Kind$Parser$without$(x0, x1);

    function Kind$Parser$switch$case$(_idx$1, _code$2) {
        var self = Kind$Parser$term$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2585 = self.idx;
                var $2586 = self.code;
                var $2587 = self.err;
                var $2588 = Parser$Reply$error$($2585, $2586, $2587);
                var $2584 = $2588;
                break;
            case 'Parser.Reply.value':
                var $2589 = self.idx;
                var $2590 = self.code;
                var $2591 = self.val;
                var self = Kind$Parser$text$(":", $2589, $2590);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2593 = self.idx;
                        var $2594 = self.code;
                        var $2595 = self.err;
                        var $2596 = Parser$Reply$error$($2593, $2594, $2595);
                        var $2592 = $2596;
                        break;
                    case 'Parser.Reply.value':
                        var $2597 = self.idx;
                        var $2598 = self.code;
                        var self = Kind$Parser$term$($2597, $2598);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2600 = self.idx;
                                var $2601 = self.code;
                                var $2602 = self.err;
                                var $2603 = Parser$Reply$error$($2600, $2601, $2602);
                                var $2599 = $2603;
                                break;
                            case 'Parser.Reply.value':
                                var $2604 = self.idx;
                                var $2605 = self.code;
                                var $2606 = self.val;
                                var $2607 = Parser$Reply$value$($2604, $2605, Pair$new$($2591, $2606));
                                var $2599 = $2607;
                                break;
                        };
                        var $2592 = $2599;
                        break;
                };
                var $2584 = $2592;
                break;
        };
        return $2584;
    };
    const Kind$Parser$switch$case = x0 => x1 => Kind$Parser$switch$case$(x0, x1);

    function Kind$Parser$switch$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2609 = self.idx;
                var $2610 = self.code;
                var $2611 = self.err;
                var $2612 = Parser$Reply$error$($2609, $2610, $2611);
                var $2608 = $2612;
                break;
            case 'Parser.Reply.value':
                var $2613 = self.idx;
                var $2614 = self.code;
                var $2615 = self.val;
                var self = Kind$Parser$text$("switch ", $2613, $2614);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2617 = self.idx;
                        var $2618 = self.code;
                        var $2619 = self.err;
                        var $2620 = Parser$Reply$error$($2617, $2618, $2619);
                        var $2616 = $2620;
                        break;
                    case 'Parser.Reply.value':
                        var $2621 = self.idx;
                        var $2622 = self.code;
                        var self = Kind$Parser$term$($2621, $2622);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2624 = self.idx;
                                var $2625 = self.code;
                                var $2626 = self.err;
                                var $2627 = Parser$Reply$error$($2624, $2625, $2626);
                                var $2623 = $2627;
                                break;
                            case 'Parser.Reply.value':
                                var $2628 = self.idx;
                                var $2629 = self.code;
                                var $2630 = self.val;
                                var self = Kind$Parser$text$("{", $2628, $2629);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2632 = self.idx;
                                        var $2633 = self.code;
                                        var $2634 = self.err;
                                        var $2635 = Parser$Reply$error$($2632, $2633, $2634);
                                        var $2631 = $2635;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2636 = self.idx;
                                        var $2637 = self.code;
                                        var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$switch$case)($2636)($2637);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2639 = self.idx;
                                                var $2640 = self.code;
                                                var $2641 = self.err;
                                                var $2642 = Parser$Reply$error$($2639, $2640, $2641);
                                                var $2638 = $2642;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2643 = self.idx;
                                                var $2644 = self.code;
                                                var $2645 = self.val;
                                                var self = Kind$Parser$text$("else", $2643, $2644);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2647 = self.idx;
                                                        var $2648 = self.code;
                                                        var $2649 = self.err;
                                                        var $2650 = Parser$Reply$error$($2647, $2648, $2649);
                                                        var $2646 = $2650;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2651 = self.idx;
                                                        var $2652 = self.code;
                                                        var self = Kind$Parser$term$($2651, $2652);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2654 = self.idx;
                                                                var $2655 = self.code;
                                                                var $2656 = self.err;
                                                                var $2657 = Parser$Reply$error$($2654, $2655, $2656);
                                                                var $2653 = $2657;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2658 = self.idx;
                                                                var $2659 = self.code;
                                                                var $2660 = self.val;
                                                                var self = Kind$Parser$stop$($2615, $2658, $2659);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2662 = self.idx;
                                                                        var $2663 = self.code;
                                                                        var $2664 = self.err;
                                                                        var $2665 = Parser$Reply$error$($2662, $2663, $2664);
                                                                        var $2661 = $2665;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2666 = self.idx;
                                                                        var $2667 = self.code;
                                                                        var $2668 = self.val;
                                                                        var _term$27 = List$fold$($2645, $2660, (_cse$27 => _rest$28 => {
                                                                            var self = _cse$27;
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $2671 = self.fst;
                                                                                    var $2672 = self.snd;
                                                                                    var _term$31 = Kind$Term$app$($2630, $2671);
                                                                                    var _term$32 = Kind$Term$app$(_term$31, Kind$Term$lam$("", (_x$32 => {
                                                                                        var $2674 = Kind$Term$hol$(Bits$e);
                                                                                        return $2674;
                                                                                    })));
                                                                                    var _term$33 = Kind$Term$app$(_term$32, $2672);
                                                                                    var _term$34 = Kind$Term$app$(_term$33, _rest$28);
                                                                                    var $2673 = _term$34;
                                                                                    var $2670 = $2673;
                                                                                    break;
                                                                            };
                                                                            return $2670;
                                                                        }));
                                                                        var $2669 = Parser$Reply$value$($2666, $2667, Kind$Term$ori$($2668, _term$27));
                                                                        var $2661 = $2669;
                                                                        break;
                                                                };
                                                                var $2653 = $2661;
                                                                break;
                                                        };
                                                        var $2646 = $2653;
                                                        break;
                                                };
                                                var $2638 = $2646;
                                                break;
                                        };
                                        var $2631 = $2638;
                                        break;
                                };
                                var $2623 = $2631;
                                break;
                        };
                        var $2616 = $2623;
                        break;
                };
                var $2608 = $2616;
                break;
        };
        return $2608;
    };
    const Kind$Parser$switch = x0 => x1 => Kind$Parser$switch$(x0, x1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $2676 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $2675 = $2676;
        } else {
            var $2677 = self.charCodeAt(0);
            var $2678 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($2677 === 48);
            if (self) {
                var $2680 = Parser$Reply$value$(_sidx$5, $2678, 0n);
                var $2679 = $2680;
            } else {
                var self = ($2677 === 49);
                if (self) {
                    var $2682 = Parser$Reply$value$(_sidx$5, $2678, 1n);
                    var $2681 = $2682;
                } else {
                    var self = ($2677 === 50);
                    if (self) {
                        var $2684 = Parser$Reply$value$(_sidx$5, $2678, 2n);
                        var $2683 = $2684;
                    } else {
                        var self = ($2677 === 51);
                        if (self) {
                            var $2686 = Parser$Reply$value$(_sidx$5, $2678, 3n);
                            var $2685 = $2686;
                        } else {
                            var self = ($2677 === 52);
                            if (self) {
                                var $2688 = Parser$Reply$value$(_sidx$5, $2678, 4n);
                                var $2687 = $2688;
                            } else {
                                var self = ($2677 === 53);
                                if (self) {
                                    var $2690 = Parser$Reply$value$(_sidx$5, $2678, 5n);
                                    var $2689 = $2690;
                                } else {
                                    var self = ($2677 === 54);
                                    if (self) {
                                        var $2692 = Parser$Reply$value$(_sidx$5, $2678, 6n);
                                        var $2691 = $2692;
                                    } else {
                                        var self = ($2677 === 55);
                                        if (self) {
                                            var $2694 = Parser$Reply$value$(_sidx$5, $2678, 7n);
                                            var $2693 = $2694;
                                        } else {
                                            var self = ($2677 === 56);
                                            if (self) {
                                                var $2696 = Parser$Reply$value$(_sidx$5, $2678, 8n);
                                                var $2695 = $2696;
                                            } else {
                                                var self = ($2677 === 57);
                                                if (self) {
                                                    var $2698 = Parser$Reply$value$(_sidx$5, $2678, 9n);
                                                    var $2697 = $2698;
                                                } else {
                                                    var $2699 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $2697 = $2699;
                                                };
                                                var $2695 = $2697;
                                            };
                                            var $2693 = $2695;
                                        };
                                        var $2691 = $2693;
                                    };
                                    var $2689 = $2691;
                                };
                                var $2687 = $2689;
                            };
                            var $2685 = $2687;
                        };
                        var $2683 = $2685;
                    };
                    var $2681 = $2683;
                };
                var $2679 = $2681;
            };
            var $2675 = $2679;
        };
        return $2675;
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
                    case 'List.cons':
                        var $2700 = self.head;
                        var $2701 = self.tail;
                        var $2702 = Nat$from_base$go$(_b$1, $2701, (_b$1 * _p$3), (($2700 * _p$3) + _res$4));
                        return $2702;
                    case 'List.nil':
                        var $2703 = _res$4;
                        return $2703;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $2704 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $2704;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2706 = self.idx;
                var $2707 = self.code;
                var $2708 = self.err;
                var $2709 = Parser$Reply$error$($2706, $2707, $2708);
                var $2705 = $2709;
                break;
            case 'Parser.Reply.value':
                var $2710 = self.idx;
                var $2711 = self.code;
                var $2712 = self.val;
                var $2713 = Parser$Reply$value$($2710, $2711, Nat$from_base$(10n, $2712));
                var $2705 = $2713;
                break;
        };
        return $2705;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2715 = self.slice(0, -1);
                var $2716 = $2715;
                var $2714 = $2716;
                break;
            case 'i':
                var $2717 = self.slice(0, -1);
                var $2718 = $2717;
                var $2714 = $2718;
                break;
            case 'e':
                var $2719 = Bits$e;
                var $2714 = $2719;
                break;
        };
        return $2714;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2721 = self.slice(0, -1);
                var $2722 = ($2721 + '1');
                var $2720 = $2722;
                break;
            case 'i':
                var $2723 = self.slice(0, -1);
                var $2724 = (Bits$inc$($2723) + '0');
                var $2720 = $2724;
                break;
            case 'e':
                var $2725 = (Bits$e + '1');
                var $2720 = $2725;
                break;
        };
        return $2720;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2727 = Bool$false;
                var $2726 = $2727;
                break;
            case 'Maybe.some':
                var $2728 = Bool$true;
                var $2726 = $2728;
                break;
        };
        return $2726;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Kind$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $2729 = ({
            _: 'Kind.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $2729;
    };
    const Kind$Term$gol = x0 => x1 => x2 => Kind$Term$gol$(x0, x1, x2);

    function Kind$Parser$goal$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2731 = self.idx;
                var $2732 = self.code;
                var $2733 = self.err;
                var $2734 = Parser$Reply$error$($2731, $2732, $2733);
                var $2730 = $2734;
                break;
            case 'Parser.Reply.value':
                var $2735 = self.idx;
                var $2736 = self.code;
                var $2737 = self.val;
                var self = Kind$Parser$text$("?", $2735, $2736);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2739 = self.idx;
                        var $2740 = self.code;
                        var $2741 = self.err;
                        var $2742 = Parser$Reply$error$($2739, $2740, $2741);
                        var $2738 = $2742;
                        break;
                    case 'Parser.Reply.value':
                        var $2743 = self.idx;
                        var $2744 = self.code;
                        var self = Kind$Parser$name$($2743, $2744);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2746 = self.idx;
                                var $2747 = self.code;
                                var $2748 = self.err;
                                var $2749 = Parser$Reply$error$($2746, $2747, $2748);
                                var $2745 = $2749;
                                break;
                            case 'Parser.Reply.value':
                                var $2750 = self.idx;
                                var $2751 = self.code;
                                var $2752 = self.val;
                                var self = Parser$many$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("-", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2755 = self.idx;
                                            var $2756 = self.code;
                                            var $2757 = self.err;
                                            var $2758 = Parser$Reply$error$($2755, $2756, $2757);
                                            var $2754 = $2758;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2759 = self.idx;
                                            var $2760 = self.code;
                                            var self = Parser$nat$($2759, $2760);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2762 = self.idx;
                                                    var $2763 = self.code;
                                                    var $2764 = self.err;
                                                    var $2765 = Parser$Reply$error$($2762, $2763, $2764);
                                                    var $2761 = $2765;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2766 = self.idx;
                                                    var $2767 = self.code;
                                                    var $2768 = self.val;
                                                    var _bits$20 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits($2768)))));
                                                    var $2769 = Parser$Reply$value$($2766, $2767, _bits$20);
                                                    var $2761 = $2769;
                                                    break;
                                            };
                                            var $2754 = $2761;
                                            break;
                                    };
                                    return $2754;
                                }))($2750)($2751);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2770 = self.idx;
                                        var $2771 = self.code;
                                        var $2772 = self.err;
                                        var $2773 = Parser$Reply$error$($2770, $2771, $2772);
                                        var $2753 = $2773;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2774 = self.idx;
                                        var $2775 = self.code;
                                        var $2776 = self.val;
                                        var self = Parser$maybe$(Parser$text("-"), $2774, $2775);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2778 = self.idx;
                                                var $2779 = self.code;
                                                var $2780 = self.err;
                                                var $2781 = Parser$Reply$error$($2778, $2779, $2780);
                                                var self = $2781;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2782 = self.idx;
                                                var $2783 = self.code;
                                                var $2784 = self.val;
                                                var $2785 = Parser$Reply$value$($2782, $2783, Maybe$to_bool$($2784));
                                                var self = $2785;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2786 = self.idx;
                                                var $2787 = self.code;
                                                var $2788 = self.err;
                                                var $2789 = Parser$Reply$error$($2786, $2787, $2788);
                                                var $2777 = $2789;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2790 = self.idx;
                                                var $2791 = self.code;
                                                var $2792 = self.val;
                                                var self = Kind$Parser$stop$($2737, $2790, $2791);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2794 = self.idx;
                                                        var $2795 = self.code;
                                                        var $2796 = self.err;
                                                        var $2797 = Parser$Reply$error$($2794, $2795, $2796);
                                                        var $2793 = $2797;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2798 = self.idx;
                                                        var $2799 = self.code;
                                                        var $2800 = self.val;
                                                        var $2801 = Parser$Reply$value$($2798, $2799, Kind$Term$ori$($2800, Kind$Term$gol$($2752, $2776, $2792)));
                                                        var $2793 = $2801;
                                                        break;
                                                };
                                                var $2777 = $2793;
                                                break;
                                        };
                                        var $2753 = $2777;
                                        break;
                                };
                                var $2745 = $2753;
                                break;
                        };
                        var $2738 = $2745;
                        break;
                };
                var $2730 = $2738;
                break;
        };
        return $2730;
    };
    const Kind$Parser$goal = x0 => x1 => Kind$Parser$goal$(x0, x1);

    function Kind$Parser$hole$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2803 = self.idx;
                var $2804 = self.code;
                var $2805 = self.err;
                var $2806 = Parser$Reply$error$($2803, $2804, $2805);
                var $2802 = $2806;
                break;
            case 'Parser.Reply.value':
                var $2807 = self.idx;
                var $2808 = self.code;
                var $2809 = self.val;
                var self = Kind$Parser$text$("_", $2807, $2808);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2811 = self.idx;
                        var $2812 = self.code;
                        var $2813 = self.err;
                        var $2814 = Parser$Reply$error$($2811, $2812, $2813);
                        var $2810 = $2814;
                        break;
                    case 'Parser.Reply.value':
                        var $2815 = self.idx;
                        var $2816 = self.code;
                        var self = Kind$Parser$stop$($2809, $2815, $2816);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2818 = self.idx;
                                var $2819 = self.code;
                                var $2820 = self.err;
                                var $2821 = Parser$Reply$error$($2818, $2819, $2820);
                                var $2817 = $2821;
                                break;
                            case 'Parser.Reply.value':
                                var $2822 = self.idx;
                                var $2823 = self.code;
                                var $2824 = self.val;
                                var $2825 = Parser$Reply$value$($2822, $2823, Kind$Term$ori$($2824, Kind$Term$hol$(Bits$e)));
                                var $2817 = $2825;
                                break;
                        };
                        var $2810 = $2817;
                        break;
                };
                var $2802 = $2810;
                break;
        };
        return $2802;
    };
    const Kind$Parser$hole = x0 => x1 => Kind$Parser$hole$(x0, x1);

    function Kind$Parser$u8$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2827 = self.idx;
                var $2828 = self.code;
                var $2829 = self.err;
                var $2830 = Parser$Reply$error$($2827, $2828, $2829);
                var $2826 = $2830;
                break;
            case 'Parser.Reply.value':
                var $2831 = self.idx;
                var $2832 = self.code;
                var $2833 = self.val;
                var self = Kind$Parser$spaces($2831)($2832);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2835 = self.idx;
                        var $2836 = self.code;
                        var $2837 = self.err;
                        var $2838 = Parser$Reply$error$($2835, $2836, $2837);
                        var $2834 = $2838;
                        break;
                    case 'Parser.Reply.value':
                        var $2839 = self.idx;
                        var $2840 = self.code;
                        var self = Parser$nat$($2839, $2840);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2842 = self.idx;
                                var $2843 = self.code;
                                var $2844 = self.err;
                                var $2845 = Parser$Reply$error$($2842, $2843, $2844);
                                var $2841 = $2845;
                                break;
                            case 'Parser.Reply.value':
                                var $2846 = self.idx;
                                var $2847 = self.code;
                                var $2848 = self.val;
                                var self = Parser$text$("b", $2846, $2847);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2850 = self.idx;
                                        var $2851 = self.code;
                                        var $2852 = self.err;
                                        var $2853 = Parser$Reply$error$($2850, $2851, $2852);
                                        var $2849 = $2853;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2854 = self.idx;
                                        var $2855 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u8");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2848));
                                        var self = Kind$Parser$stop$($2833, $2854, $2855);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2857 = self.idx;
                                                var $2858 = self.code;
                                                var $2859 = self.err;
                                                var $2860 = Parser$Reply$error$($2857, $2858, $2859);
                                                var $2856 = $2860;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2861 = self.idx;
                                                var $2862 = self.code;
                                                var $2863 = self.val;
                                                var $2864 = Parser$Reply$value$($2861, $2862, Kind$Term$ori$($2863, _term$16));
                                                var $2856 = $2864;
                                                break;
                                        };
                                        var $2849 = $2856;
                                        break;
                                };
                                var $2841 = $2849;
                                break;
                        };
                        var $2834 = $2841;
                        break;
                };
                var $2826 = $2834;
                break;
        };
        return $2826;
    };
    const Kind$Parser$u8 = x0 => x1 => Kind$Parser$u8$(x0, x1);

    function Kind$Parser$u16$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2866 = self.idx;
                var $2867 = self.code;
                var $2868 = self.err;
                var $2869 = Parser$Reply$error$($2866, $2867, $2868);
                var $2865 = $2869;
                break;
            case 'Parser.Reply.value':
                var $2870 = self.idx;
                var $2871 = self.code;
                var $2872 = self.val;
                var self = Kind$Parser$spaces($2870)($2871);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2874 = self.idx;
                        var $2875 = self.code;
                        var $2876 = self.err;
                        var $2877 = Parser$Reply$error$($2874, $2875, $2876);
                        var $2873 = $2877;
                        break;
                    case 'Parser.Reply.value':
                        var $2878 = self.idx;
                        var $2879 = self.code;
                        var self = Parser$nat$($2878, $2879);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2881 = self.idx;
                                var $2882 = self.code;
                                var $2883 = self.err;
                                var $2884 = Parser$Reply$error$($2881, $2882, $2883);
                                var $2880 = $2884;
                                break;
                            case 'Parser.Reply.value':
                                var $2885 = self.idx;
                                var $2886 = self.code;
                                var $2887 = self.val;
                                var self = Parser$text$("s", $2885, $2886);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2889 = self.idx;
                                        var $2890 = self.code;
                                        var $2891 = self.err;
                                        var $2892 = Parser$Reply$error$($2889, $2890, $2891);
                                        var $2888 = $2892;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2893 = self.idx;
                                        var $2894 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u16");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2887));
                                        var self = Kind$Parser$stop$($2872, $2893, $2894);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2896 = self.idx;
                                                var $2897 = self.code;
                                                var $2898 = self.err;
                                                var $2899 = Parser$Reply$error$($2896, $2897, $2898);
                                                var $2895 = $2899;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2900 = self.idx;
                                                var $2901 = self.code;
                                                var $2902 = self.val;
                                                var $2903 = Parser$Reply$value$($2900, $2901, Kind$Term$ori$($2902, _term$16));
                                                var $2895 = $2903;
                                                break;
                                        };
                                        var $2888 = $2895;
                                        break;
                                };
                                var $2880 = $2888;
                                break;
                        };
                        var $2873 = $2880;
                        break;
                };
                var $2865 = $2873;
                break;
        };
        return $2865;
    };
    const Kind$Parser$u16 = x0 => x1 => Kind$Parser$u16$(x0, x1);

    function Kind$Parser$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2905 = self.idx;
                var $2906 = self.code;
                var $2907 = self.err;
                var $2908 = Parser$Reply$error$($2905, $2906, $2907);
                var $2904 = $2908;
                break;
            case 'Parser.Reply.value':
                var $2909 = self.idx;
                var $2910 = self.code;
                var $2911 = self.val;
                var self = Kind$Parser$spaces($2909)($2910);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2913 = self.idx;
                        var $2914 = self.code;
                        var $2915 = self.err;
                        var $2916 = Parser$Reply$error$($2913, $2914, $2915);
                        var $2912 = $2916;
                        break;
                    case 'Parser.Reply.value':
                        var $2917 = self.idx;
                        var $2918 = self.code;
                        var self = Parser$nat$($2917, $2918);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2920 = self.idx;
                                var $2921 = self.code;
                                var $2922 = self.err;
                                var $2923 = Parser$Reply$error$($2920, $2921, $2922);
                                var $2919 = $2923;
                                break;
                            case 'Parser.Reply.value':
                                var $2924 = self.idx;
                                var $2925 = self.code;
                                var $2926 = self.val;
                                var self = Parser$text$("u", $2924, $2925);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2928 = self.idx;
                                        var $2929 = self.code;
                                        var $2930 = self.err;
                                        var $2931 = Parser$Reply$error$($2928, $2929, $2930);
                                        var $2927 = $2931;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2932 = self.idx;
                                        var $2933 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u32");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2926));
                                        var self = Kind$Parser$stop$($2911, $2932, $2933);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2935 = self.idx;
                                                var $2936 = self.code;
                                                var $2937 = self.err;
                                                var $2938 = Parser$Reply$error$($2935, $2936, $2937);
                                                var $2934 = $2938;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2939 = self.idx;
                                                var $2940 = self.code;
                                                var $2941 = self.val;
                                                var $2942 = Parser$Reply$value$($2939, $2940, Kind$Term$ori$($2941, _term$16));
                                                var $2934 = $2942;
                                                break;
                                        };
                                        var $2927 = $2934;
                                        break;
                                };
                                var $2919 = $2927;
                                break;
                        };
                        var $2912 = $2919;
                        break;
                };
                var $2904 = $2912;
                break;
        };
        return $2904;
    };
    const Kind$Parser$u32 = x0 => x1 => Kind$Parser$u32$(x0, x1);

    function Kind$Parser$u64$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2944 = self.idx;
                var $2945 = self.code;
                var $2946 = self.err;
                var $2947 = Parser$Reply$error$($2944, $2945, $2946);
                var $2943 = $2947;
                break;
            case 'Parser.Reply.value':
                var $2948 = self.idx;
                var $2949 = self.code;
                var $2950 = self.val;
                var self = Kind$Parser$spaces($2948)($2949);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2952 = self.idx;
                        var $2953 = self.code;
                        var $2954 = self.err;
                        var $2955 = Parser$Reply$error$($2952, $2953, $2954);
                        var $2951 = $2955;
                        break;
                    case 'Parser.Reply.value':
                        var $2956 = self.idx;
                        var $2957 = self.code;
                        var self = Parser$nat$($2956, $2957);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2959 = self.idx;
                                var $2960 = self.code;
                                var $2961 = self.err;
                                var $2962 = Parser$Reply$error$($2959, $2960, $2961);
                                var $2958 = $2962;
                                break;
                            case 'Parser.Reply.value':
                                var $2963 = self.idx;
                                var $2964 = self.code;
                                var $2965 = self.val;
                                var self = Parser$text$("l", $2963, $2964);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2967 = self.idx;
                                        var $2968 = self.code;
                                        var $2969 = self.err;
                                        var $2970 = Parser$Reply$error$($2967, $2968, $2969);
                                        var $2966 = $2970;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2971 = self.idx;
                                        var $2972 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u64");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2965));
                                        var self = Kind$Parser$stop$($2950, $2971, $2972);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2974 = self.idx;
                                                var $2975 = self.code;
                                                var $2976 = self.err;
                                                var $2977 = Parser$Reply$error$($2974, $2975, $2976);
                                                var $2973 = $2977;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2978 = self.idx;
                                                var $2979 = self.code;
                                                var $2980 = self.val;
                                                var $2981 = Parser$Reply$value$($2978, $2979, Kind$Term$ori$($2980, _term$16));
                                                var $2973 = $2981;
                                                break;
                                        };
                                        var $2966 = $2973;
                                        break;
                                };
                                var $2958 = $2966;
                                break;
                        };
                        var $2951 = $2958;
                        break;
                };
                var $2943 = $2951;
                break;
        };
        return $2943;
    };
    const Kind$Parser$u64 = x0 => x1 => Kind$Parser$u64$(x0, x1);

    function Kind$Parser$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2983 = self.idx;
                var $2984 = self.code;
                var $2985 = self.err;
                var $2986 = Parser$Reply$error$($2983, $2984, $2985);
                var $2982 = $2986;
                break;
            case 'Parser.Reply.value':
                var $2987 = self.idx;
                var $2988 = self.code;
                var $2989 = self.val;
                var self = Kind$Parser$spaces($2987)($2988);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2991 = self.idx;
                        var $2992 = self.code;
                        var $2993 = self.err;
                        var $2994 = Parser$Reply$error$($2991, $2992, $2993);
                        var $2990 = $2994;
                        break;
                    case 'Parser.Reply.value':
                        var $2995 = self.idx;
                        var $2996 = self.code;
                        var self = Parser$nat$($2995, $2996);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2998 = self.idx;
                                var $2999 = self.code;
                                var $3000 = self.err;
                                var $3001 = Parser$Reply$error$($2998, $2999, $3000);
                                var $2997 = $3001;
                                break;
                            case 'Parser.Reply.value':
                                var $3002 = self.idx;
                                var $3003 = self.code;
                                var $3004 = self.val;
                                var self = Kind$Parser$stop$($2989, $3002, $3003);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3006 = self.idx;
                                        var $3007 = self.code;
                                        var $3008 = self.err;
                                        var $3009 = Parser$Reply$error$($3006, $3007, $3008);
                                        var $3005 = $3009;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3010 = self.idx;
                                        var $3011 = self.code;
                                        var $3012 = self.val;
                                        var $3013 = Parser$Reply$value$($3010, $3011, Kind$Term$ori$($3012, Kind$Term$nat$($3004)));
                                        var $3005 = $3013;
                                        break;
                                };
                                var $2997 = $3005;
                                break;
                        };
                        var $2990 = $2997;
                        break;
                };
                var $2982 = $2990;
                break;
        };
        return $2982;
    };
    const Kind$Parser$nat = x0 => x1 => Kind$Parser$nat$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $3014 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $3014;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Kind$Term$typ = ({
        _: 'Kind.Term.typ'
    });

    function Kind$Parser$reference$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3016 = self.idx;
                var $3017 = self.code;
                var $3018 = self.err;
                var $3019 = Parser$Reply$error$($3016, $3017, $3018);
                var $3015 = $3019;
                break;
            case 'Parser.Reply.value':
                var $3020 = self.idx;
                var $3021 = self.code;
                var $3022 = self.val;
                var self = Kind$Parser$name1$($3020, $3021);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3024 = self.idx;
                        var $3025 = self.code;
                        var $3026 = self.err;
                        var $3027 = Parser$Reply$error$($3024, $3025, $3026);
                        var $3023 = $3027;
                        break;
                    case 'Parser.Reply.value':
                        var $3028 = self.idx;
                        var $3029 = self.code;
                        var $3030 = self.val;
                        var self = ($3030 === "case");
                        if (self) {
                            var $3032 = Parser$fail("Reserved keyword.");
                            var $3031 = $3032;
                        } else {
                            var self = ($3030 === "do");
                            if (self) {
                                var $3034 = Parser$fail("Reserved keyword.");
                                var $3033 = $3034;
                            } else {
                                var self = ($3030 === "if");
                                if (self) {
                                    var $3036 = Parser$fail("Reserved keyword.");
                                    var $3035 = $3036;
                                } else {
                                    var self = ($3030 === "with");
                                    if (self) {
                                        var $3038 = Parser$fail("Reserved keyword.");
                                        var $3037 = $3038;
                                    } else {
                                        var self = ($3030 === "let");
                                        if (self) {
                                            var $3040 = Parser$fail("Reserved keyword.");
                                            var $3039 = $3040;
                                        } else {
                                            var self = ($3030 === "def");
                                            if (self) {
                                                var $3042 = Parser$fail("Reserved keyword.");
                                                var $3041 = $3042;
                                            } else {
                                                var self = ($3030 === "Type");
                                                if (self) {
                                                    var $3044 = (_idx$9 => _code$10 => {
                                                        var $3045 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$typ);
                                                        return $3045;
                                                    });
                                                    var $3043 = $3044;
                                                } else {
                                                    var self = ($3030 === "true");
                                                    if (self) {
                                                        var $3047 = (_idx$9 => _code$10 => {
                                                            var $3048 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.true"));
                                                            return $3048;
                                                        });
                                                        var $3046 = $3047;
                                                    } else {
                                                        var self = ($3030 === "false");
                                                        if (self) {
                                                            var $3050 = (_idx$9 => _code$10 => {
                                                                var $3051 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.false"));
                                                                return $3051;
                                                            });
                                                            var $3049 = $3050;
                                                        } else {
                                                            var self = ($3030 === "unit");
                                                            if (self) {
                                                                var $3053 = (_idx$9 => _code$10 => {
                                                                    var $3054 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Unit.new"));
                                                                    return $3054;
                                                                });
                                                                var $3052 = $3053;
                                                            } else {
                                                                var self = ($3030 === "none");
                                                                if (self) {
                                                                    var _term$9 = Kind$Term$ref$("Maybe.none");
                                                                    var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                    var $3056 = (_idx$11 => _code$12 => {
                                                                        var $3057 = Parser$Reply$value$(_idx$11, _code$12, _term$10);
                                                                        return $3057;
                                                                    });
                                                                    var $3055 = $3056;
                                                                } else {
                                                                    var self = ($3030 === "refl");
                                                                    if (self) {
                                                                        var _term$9 = Kind$Term$ref$("Equal.refl");
                                                                        var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                        var _term$11 = Kind$Term$app$(_term$10, Kind$Term$hol$(Bits$e));
                                                                        var $3059 = (_idx$12 => _code$13 => {
                                                                            var $3060 = Parser$Reply$value$(_idx$12, _code$13, _term$11);
                                                                            return $3060;
                                                                        });
                                                                        var $3058 = $3059;
                                                                    } else {
                                                                        var $3061 = (_idx$9 => _code$10 => {
                                                                            var self = Kind$Parser$stop$($3022, _idx$9, _code$10);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $3063 = self.idx;
                                                                                    var $3064 = self.code;
                                                                                    var $3065 = self.err;
                                                                                    var $3066 = Parser$Reply$error$($3063, $3064, $3065);
                                                                                    var $3062 = $3066;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $3067 = self.idx;
                                                                                    var $3068 = self.code;
                                                                                    var $3069 = self.val;
                                                                                    var $3070 = Parser$Reply$value$($3067, $3068, Kind$Term$ori$($3069, Kind$Term$ref$($3030)));
                                                                                    var $3062 = $3070;
                                                                                    break;
                                                                            };
                                                                            return $3062;
                                                                        });
                                                                        var $3058 = $3061;
                                                                    };
                                                                    var $3055 = $3058;
                                                                };
                                                                var $3052 = $3055;
                                                            };
                                                            var $3049 = $3052;
                                                        };
                                                        var $3046 = $3049;
                                                    };
                                                    var $3043 = $3046;
                                                };
                                                var $3041 = $3043;
                                            };
                                            var $3039 = $3041;
                                        };
                                        var $3037 = $3039;
                                    };
                                    var $3035 = $3037;
                                };
                                var $3033 = $3035;
                            };
                            var $3031 = $3033;
                        };
                        var $3031 = $3031($3028)($3029);
                        var $3023 = $3031;
                        break;
                };
                var $3015 = $3023;
                break;
        };
        return $3015;
    };
    const Kind$Parser$reference = x0 => x1 => Kind$Parser$reference$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kind$Parser$application$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$text$("(", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3072 = self.idx;
                var $3073 = self.code;
                var $3074 = self.err;
                var $3075 = Parser$Reply$error$($3072, $3073, $3074);
                var $3071 = $3075;
                break;
            case 'Parser.Reply.value':
                var $3076 = self.idx;
                var $3077 = self.code;
                var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term), $3076, $3077);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3079 = self.idx;
                        var $3080 = self.code;
                        var $3081 = self.err;
                        var $3082 = Parser$Reply$error$($3079, $3080, $3081);
                        var $3078 = $3082;
                        break;
                    case 'Parser.Reply.value':
                        var $3083 = self.idx;
                        var $3084 = self.code;
                        var $3085 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3083, $3084);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3087 = self.idx;
                                var $3088 = self.code;
                                var $3089 = self.err;
                                var $3090 = Parser$Reply$error$($3087, $3088, $3089);
                                var $3086 = $3090;
                                break;
                            case 'Parser.Reply.value':
                                var $3091 = self.idx;
                                var $3092 = self.code;
                                var $3093 = self.val;
                                var _expr$14 = (() => {
                                    var $3096 = _func$2;
                                    var $3097 = $3085;
                                    let _f$15 = $3096;
                                    let _x$14;
                                    while ($3097._ === 'List.cons') {
                                        _x$14 = $3097.head;
                                        var $3096 = Kind$Term$app$(_f$15, _x$14);
                                        _f$15 = $3096;
                                        $3097 = $3097.tail;
                                    }
                                    return _f$15;
                                })();
                                var $3094 = Parser$Reply$value$($3091, $3092, Kind$Term$ori$($3093, _expr$14));
                                var $3086 = $3094;
                                break;
                        };
                        var $3078 = $3086;
                        break;
                };
                var $3071 = $3078;
                break;
        };
        return $3071;
    };
    const Kind$Parser$application = x0 => x1 => x2 => x3 => Kind$Parser$application$(x0, x1, x2, x3);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1, _idx$2, _code$3) {
        var self = Parser$spaces(_idx$2)(_code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3099 = self.idx;
                var $3100 = self.code;
                var $3101 = self.err;
                var $3102 = Parser$Reply$error$($3099, $3100, $3101);
                var $3098 = $3102;
                break;
            case 'Parser.Reply.value':
                var $3103 = self.idx;
                var $3104 = self.code;
                var $3105 = Parser$text$(_text$1, $3103, $3104);
                var $3098 = $3105;
                break;
        };
        return $3098;
    };
    const Parser$spaces_text = x0 => x1 => x2 => Parser$spaces_text$(x0, x1, x2);

    function Kind$Parser$application$erased$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$get_index$(_idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3107 = self.idx;
                var $3108 = self.code;
                var $3109 = self.err;
                var $3110 = Parser$Reply$error$($3107, $3108, $3109);
                var $3106 = $3110;
                break;
            case 'Parser.Reply.value':
                var $3111 = self.idx;
                var $3112 = self.code;
                var $3113 = self.val;
                var self = Parser$text$("<", $3111, $3112);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3115 = self.idx;
                        var $3116 = self.code;
                        var $3117 = self.err;
                        var $3118 = Parser$Reply$error$($3115, $3116, $3117);
                        var $3114 = $3118;
                        break;
                    case 'Parser.Reply.value':
                        var $3119 = self.idx;
                        var $3120 = self.code;
                        var self = Parser$until1$(Parser$spaces_text(">"), Kind$Parser$item(Kind$Parser$term), $3119, $3120);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3122 = self.idx;
                                var $3123 = self.code;
                                var $3124 = self.err;
                                var $3125 = Parser$Reply$error$($3122, $3123, $3124);
                                var $3121 = $3125;
                                break;
                            case 'Parser.Reply.value':
                                var $3126 = self.idx;
                                var $3127 = self.code;
                                var $3128 = self.val;
                                var self = Kind$Parser$stop$($3113, $3126, $3127);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3130 = self.idx;
                                        var $3131 = self.code;
                                        var $3132 = self.err;
                                        var $3133 = Parser$Reply$error$($3130, $3131, $3132);
                                        var $3129 = $3133;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3134 = self.idx;
                                        var $3135 = self.code;
                                        var $3136 = self.val;
                                        var _expr$17 = (() => {
                                            var $3139 = _func$2;
                                            var $3140 = $3128;
                                            let _f$18 = $3139;
                                            let _x$17;
                                            while ($3140._ === 'List.cons') {
                                                _x$17 = $3140.head;
                                                var $3139 = Kind$Term$app$(_f$18, _x$17);
                                                _f$18 = $3139;
                                                $3140 = $3140.tail;
                                            }
                                            return _f$18;
                                        })();
                                        var $3137 = Parser$Reply$value$($3134, $3135, Kind$Term$ori$($3136, _expr$17));
                                        var $3129 = $3137;
                                        break;
                                };
                                var $3121 = $3129;
                                break;
                        };
                        var $3114 = $3121;
                        break;
                };
                var $3106 = $3114;
                break;
        };
        return $3106;
    };
    const Kind$Parser$application$erased = x0 => x1 => x2 => x3 => Kind$Parser$application$erased$(x0, x1, x2, x3);

    function Kind$Parser$arrow$(_init$1, _xtyp$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("->", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3142 = self.idx;
                var $3143 = self.code;
                var $3144 = self.err;
                var $3145 = Parser$Reply$error$($3142, $3143, $3144);
                var $3141 = $3145;
                break;
            case 'Parser.Reply.value':
                var $3146 = self.idx;
                var $3147 = self.code;
                var self = Kind$Parser$term$($3146, $3147);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3149 = self.idx;
                        var $3150 = self.code;
                        var $3151 = self.err;
                        var $3152 = Parser$Reply$error$($3149, $3150, $3151);
                        var $3148 = $3152;
                        break;
                    case 'Parser.Reply.value':
                        var $3153 = self.idx;
                        var $3154 = self.code;
                        var $3155 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3153, $3154);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3157 = self.idx;
                                var $3158 = self.code;
                                var $3159 = self.err;
                                var $3160 = Parser$Reply$error$($3157, $3158, $3159);
                                var $3156 = $3160;
                                break;
                            case 'Parser.Reply.value':
                                var $3161 = self.idx;
                                var $3162 = self.code;
                                var $3163 = self.val;
                                var $3164 = Parser$Reply$value$($3161, $3162, Kind$Term$ori$($3163, Kind$Term$all$(Bool$false, "", "", _xtyp$2, (_s$14 => _x$15 => {
                                    var $3165 = $3155;
                                    return $3165;
                                }))));
                                var $3156 = $3164;
                                break;
                        };
                        var $3148 = $3156;
                        break;
                };
                var $3141 = $3148;
                break;
        };
        return $3141;
    };
    const Kind$Parser$arrow = x0 => x1 => x2 => x3 => Kind$Parser$arrow$(x0, x1, x2, x3);

    function Kind$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4, _idx$5, _code$6) {
        var self = Kind$Parser$text$(_sym$1, _idx$5, _code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3167 = self.idx;
                var $3168 = self.code;
                var $3169 = self.err;
                var $3170 = Parser$Reply$error$($3167, $3168, $3169);
                var $3166 = $3170;
                break;
            case 'Parser.Reply.value':
                var $3171 = self.idx;
                var $3172 = self.code;
                var self = Kind$Parser$term$($3171, $3172);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3174 = self.idx;
                        var $3175 = self.code;
                        var $3176 = self.err;
                        var $3177 = Parser$Reply$error$($3174, $3175, $3176);
                        var $3173 = $3177;
                        break;
                    case 'Parser.Reply.value':
                        var $3178 = self.idx;
                        var $3179 = self.code;
                        var $3180 = self.val;
                        var self = Kind$Parser$stop$(_init$3, $3178, $3179);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3182 = self.idx;
                                var $3183 = self.code;
                                var $3184 = self.err;
                                var $3185 = Parser$Reply$error$($3182, $3183, $3184);
                                var $3181 = $3185;
                                break;
                            case 'Parser.Reply.value':
                                var $3186 = self.idx;
                                var $3187 = self.code;
                                var $3188 = self.val;
                                var _term$16 = Kind$Term$ref$(_ref$2);
                                var _term$17 = Kind$Term$app$(_term$16, _val0$4);
                                var _term$18 = Kind$Term$app$(_term$17, $3180);
                                var $3189 = Parser$Reply$value$($3186, $3187, Kind$Term$ori$($3188, _term$18));
                                var $3181 = $3189;
                                break;
                        };
                        var $3173 = $3181;
                        break;
                };
                var $3166 = $3173;
                break;
        };
        return $3166;
    };
    const Kind$Parser$op = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Parser$op$(x0, x1, x2, x3, x4, x5);
    const Kind$Parser$add = Kind$Parser$op("+")("Nat.add");
    const Kind$Parser$sub = Kind$Parser$op("+")("Nat.add");
    const Kind$Parser$mul = Kind$Parser$op("*")("Nat.mul");
    const Kind$Parser$div = Kind$Parser$op("/")("Nat.div");
    const Kind$Parser$mod = Kind$Parser$op("%")("Nat.mod");

    function Kind$Parser$cons$(_init$1, _head$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("&", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3191 = self.idx;
                var $3192 = self.code;
                var $3193 = self.err;
                var $3194 = Parser$Reply$error$($3191, $3192, $3193);
                var $3190 = $3194;
                break;
            case 'Parser.Reply.value':
                var $3195 = self.idx;
                var $3196 = self.code;
                var self = Kind$Parser$term$($3195, $3196);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3198 = self.idx;
                        var $3199 = self.code;
                        var $3200 = self.err;
                        var $3201 = Parser$Reply$error$($3198, $3199, $3200);
                        var $3197 = $3201;
                        break;
                    case 'Parser.Reply.value':
                        var $3202 = self.idx;
                        var $3203 = self.code;
                        var $3204 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3202, $3203);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3206 = self.idx;
                                var $3207 = self.code;
                                var $3208 = self.err;
                                var $3209 = Parser$Reply$error$($3206, $3207, $3208);
                                var $3205 = $3209;
                                break;
                            case 'Parser.Reply.value':
                                var $3210 = self.idx;
                                var $3211 = self.code;
                                var _term$14 = Kind$Term$ref$("List.cons");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _head$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3204);
                                var self = Kind$Parser$stop$(_init$1, $3210, $3211);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3213 = self.idx;
                                        var $3214 = self.code;
                                        var $3215 = self.err;
                                        var $3216 = Parser$Reply$error$($3213, $3214, $3215);
                                        var $3212 = $3216;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3217 = self.idx;
                                        var $3218 = self.code;
                                        var $3219 = self.val;
                                        var $3220 = Parser$Reply$value$($3217, $3218, Kind$Term$ori$($3219, _term$17));
                                        var $3212 = $3220;
                                        break;
                                };
                                var $3205 = $3212;
                                break;
                        };
                        var $3197 = $3205;
                        break;
                };
                var $3190 = $3197;
                break;
        };
        return $3190;
    };
    const Kind$Parser$cons = x0 => x1 => x2 => x3 => Kind$Parser$cons$(x0, x1, x2, x3);

    function Kind$Parser$concat$(_init$1, _lst0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("++", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3222 = self.idx;
                var $3223 = self.code;
                var $3224 = self.err;
                var $3225 = Parser$Reply$error$($3222, $3223, $3224);
                var $3221 = $3225;
                break;
            case 'Parser.Reply.value':
                var $3226 = self.idx;
                var $3227 = self.code;
                var self = Kind$Parser$term$($3226, $3227);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3229 = self.idx;
                        var $3230 = self.code;
                        var $3231 = self.err;
                        var $3232 = Parser$Reply$error$($3229, $3230, $3231);
                        var $3228 = $3232;
                        break;
                    case 'Parser.Reply.value':
                        var $3233 = self.idx;
                        var $3234 = self.code;
                        var $3235 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3233, $3234);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3237 = self.idx;
                                var $3238 = self.code;
                                var $3239 = self.err;
                                var $3240 = Parser$Reply$error$($3237, $3238, $3239);
                                var $3236 = $3240;
                                break;
                            case 'Parser.Reply.value':
                                var $3241 = self.idx;
                                var $3242 = self.code;
                                var _term$14 = Kind$Term$ref$("List.concat");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _lst0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3235);
                                var self = Kind$Parser$stop$(_init$1, $3241, $3242);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3244 = self.idx;
                                        var $3245 = self.code;
                                        var $3246 = self.err;
                                        var $3247 = Parser$Reply$error$($3244, $3245, $3246);
                                        var $3243 = $3247;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3248 = self.idx;
                                        var $3249 = self.code;
                                        var $3250 = self.val;
                                        var $3251 = Parser$Reply$value$($3248, $3249, Kind$Term$ori$($3250, _term$17));
                                        var $3243 = $3251;
                                        break;
                                };
                                var $3236 = $3243;
                                break;
                        };
                        var $3228 = $3236;
                        break;
                };
                var $3221 = $3228;
                break;
        };
        return $3221;
    };
    const Kind$Parser$concat = x0 => x1 => x2 => x3 => Kind$Parser$concat$(x0, x1, x2, x3);

    function Kind$Parser$string_concat$(_init$1, _str0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("|", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3253 = self.idx;
                var $3254 = self.code;
                var $3255 = self.err;
                var $3256 = Parser$Reply$error$($3253, $3254, $3255);
                var $3252 = $3256;
                break;
            case 'Parser.Reply.value':
                var $3257 = self.idx;
                var $3258 = self.code;
                var self = Kind$Parser$term$($3257, $3258);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3260 = self.idx;
                        var $3261 = self.code;
                        var $3262 = self.err;
                        var $3263 = Parser$Reply$error$($3260, $3261, $3262);
                        var $3259 = $3263;
                        break;
                    case 'Parser.Reply.value':
                        var $3264 = self.idx;
                        var $3265 = self.code;
                        var $3266 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3264, $3265);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3268 = self.idx;
                                var $3269 = self.code;
                                var $3270 = self.err;
                                var $3271 = Parser$Reply$error$($3268, $3269, $3270);
                                var $3267 = $3271;
                                break;
                            case 'Parser.Reply.value':
                                var $3272 = self.idx;
                                var $3273 = self.code;
                                var _term$14 = Kind$Term$ref$("String.concat");
                                var _term$15 = Kind$Term$app$(_term$14, _str0$2);
                                var _term$16 = Kind$Term$app$(_term$15, $3266);
                                var self = Kind$Parser$stop$(_init$1, $3272, $3273);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3275 = self.idx;
                                        var $3276 = self.code;
                                        var $3277 = self.err;
                                        var $3278 = Parser$Reply$error$($3275, $3276, $3277);
                                        var $3274 = $3278;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3279 = self.idx;
                                        var $3280 = self.code;
                                        var $3281 = self.val;
                                        var $3282 = Parser$Reply$value$($3279, $3280, Kind$Term$ori$($3281, _term$16));
                                        var $3274 = $3282;
                                        break;
                                };
                                var $3267 = $3274;
                                break;
                        };
                        var $3259 = $3267;
                        break;
                };
                var $3252 = $3259;
                break;
        };
        return $3252;
    };
    const Kind$Parser$string_concat = x0 => x1 => x2 => x3 => Kind$Parser$string_concat$(x0, x1, x2, x3);

    function Kind$Parser$sigma$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("~", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3284 = self.idx;
                var $3285 = self.code;
                var $3286 = self.err;
                var $3287 = Parser$Reply$error$($3284, $3285, $3286);
                var $3283 = $3287;
                break;
            case 'Parser.Reply.value':
                var $3288 = self.idx;
                var $3289 = self.code;
                var self = Kind$Parser$term$($3288, $3289);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3291 = self.idx;
                        var $3292 = self.code;
                        var $3293 = self.err;
                        var $3294 = Parser$Reply$error$($3291, $3292, $3293);
                        var $3290 = $3294;
                        break;
                    case 'Parser.Reply.value':
                        var $3295 = self.idx;
                        var $3296 = self.code;
                        var $3297 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3295, $3296);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3299 = self.idx;
                                var $3300 = self.code;
                                var $3301 = self.err;
                                var $3302 = Parser$Reply$error$($3299, $3300, $3301);
                                var $3298 = $3302;
                                break;
                            case 'Parser.Reply.value':
                                var $3303 = self.idx;
                                var $3304 = self.code;
                                var $3305 = self.val;
                                var _term$14 = Kind$Term$ref$("Sigma.new");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                var _term$17 = Kind$Term$app$(_term$16, _val0$2);
                                var _term$18 = Kind$Term$app$(_term$17, $3297);
                                var $3306 = Parser$Reply$value$($3303, $3304, Kind$Term$ori$($3305, _term$18));
                                var $3298 = $3306;
                                break;
                        };
                        var $3290 = $3298;
                        break;
                };
                var $3283 = $3290;
                break;
        };
        return $3283;
    };
    const Kind$Parser$sigma = x0 => x1 => x2 => x3 => Kind$Parser$sigma$(x0, x1, x2, x3);

    function Kind$Parser$equality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("==", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3308 = self.idx;
                var $3309 = self.code;
                var $3310 = self.err;
                var $3311 = Parser$Reply$error$($3308, $3309, $3310);
                var $3307 = $3311;
                break;
            case 'Parser.Reply.value':
                var $3312 = self.idx;
                var $3313 = self.code;
                var self = Kind$Parser$term$($3312, $3313);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3315 = self.idx;
                        var $3316 = self.code;
                        var $3317 = self.err;
                        var $3318 = Parser$Reply$error$($3315, $3316, $3317);
                        var $3314 = $3318;
                        break;
                    case 'Parser.Reply.value':
                        var $3319 = self.idx;
                        var $3320 = self.code;
                        var $3321 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3319, $3320);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3323 = self.idx;
                                var $3324 = self.code;
                                var $3325 = self.err;
                                var $3326 = Parser$Reply$error$($3323, $3324, $3325);
                                var $3322 = $3326;
                                break;
                            case 'Parser.Reply.value':
                                var $3327 = self.idx;
                                var $3328 = self.code;
                                var $3329 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3321);
                                var $3330 = Parser$Reply$value$($3327, $3328, Kind$Term$ori$($3329, _term$17));
                                var $3322 = $3330;
                                break;
                        };
                        var $3314 = $3322;
                        break;
                };
                var $3307 = $3314;
                break;
        };
        return $3307;
    };
    const Kind$Parser$equality = x0 => x1 => x2 => x3 => Kind$Parser$equality$(x0, x1, x2, x3);

    function Kind$Parser$inequality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!=", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3332 = self.idx;
                var $3333 = self.code;
                var $3334 = self.err;
                var $3335 = Parser$Reply$error$($3332, $3333, $3334);
                var $3331 = $3335;
                break;
            case 'Parser.Reply.value':
                var $3336 = self.idx;
                var $3337 = self.code;
                var self = Kind$Parser$term$($3336, $3337);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3339 = self.idx;
                        var $3340 = self.code;
                        var $3341 = self.err;
                        var $3342 = Parser$Reply$error$($3339, $3340, $3341);
                        var $3338 = $3342;
                        break;
                    case 'Parser.Reply.value':
                        var $3343 = self.idx;
                        var $3344 = self.code;
                        var $3345 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3343, $3344);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3347 = self.idx;
                                var $3348 = self.code;
                                var $3349 = self.err;
                                var $3350 = Parser$Reply$error$($3347, $3348, $3349);
                                var $3346 = $3350;
                                break;
                            case 'Parser.Reply.value':
                                var $3351 = self.idx;
                                var $3352 = self.code;
                                var $3353 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3345);
                                var _term$18 = Kind$Term$app$(Kind$Term$ref$("Not"), _term$17);
                                var $3354 = Parser$Reply$value$($3351, $3352, Kind$Term$ori$($3353, _term$18));
                                var $3346 = $3354;
                                break;
                        };
                        var $3338 = $3346;
                        break;
                };
                var $3331 = $3338;
                break;
        };
        return $3331;
    };
    const Kind$Parser$inequality = x0 => x1 => x2 => x3 => Kind$Parser$inequality$(x0, x1, x2, x3);

    function Kind$Parser$rewrite$(_init$1, _subt$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3356 = self.idx;
                var $3357 = self.code;
                var $3358 = self.err;
                var $3359 = Parser$Reply$error$($3356, $3357, $3358);
                var $3355 = $3359;
                break;
            case 'Parser.Reply.value':
                var $3360 = self.idx;
                var $3361 = self.code;
                var self = Kind$Parser$text$("rewrite", $3360, $3361);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3363 = self.idx;
                        var $3364 = self.code;
                        var $3365 = self.err;
                        var $3366 = Parser$Reply$error$($3363, $3364, $3365);
                        var $3362 = $3366;
                        break;
                    case 'Parser.Reply.value':
                        var $3367 = self.idx;
                        var $3368 = self.code;
                        var self = Kind$Parser$name1$($3367, $3368);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3370 = self.idx;
                                var $3371 = self.code;
                                var $3372 = self.err;
                                var $3373 = Parser$Reply$error$($3370, $3371, $3372);
                                var $3369 = $3373;
                                break;
                            case 'Parser.Reply.value':
                                var $3374 = self.idx;
                                var $3375 = self.code;
                                var $3376 = self.val;
                                var self = Kind$Parser$text$("in", $3374, $3375);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3378 = self.idx;
                                        var $3379 = self.code;
                                        var $3380 = self.err;
                                        var $3381 = Parser$Reply$error$($3378, $3379, $3380);
                                        var $3377 = $3381;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3382 = self.idx;
                                        var $3383 = self.code;
                                        var self = Kind$Parser$term$($3382, $3383);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3385 = self.idx;
                                                var $3386 = self.code;
                                                var $3387 = self.err;
                                                var $3388 = Parser$Reply$error$($3385, $3386, $3387);
                                                var $3384 = $3388;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3389 = self.idx;
                                                var $3390 = self.code;
                                                var $3391 = self.val;
                                                var self = Kind$Parser$text$("with", $3389, $3390);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3393 = self.idx;
                                                        var $3394 = self.code;
                                                        var $3395 = self.err;
                                                        var $3396 = Parser$Reply$error$($3393, $3394, $3395);
                                                        var $3392 = $3396;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3397 = self.idx;
                                                        var $3398 = self.code;
                                                        var self = Kind$Parser$term$($3397, $3398);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3400 = self.idx;
                                                                var $3401 = self.code;
                                                                var $3402 = self.err;
                                                                var $3403 = Parser$Reply$error$($3400, $3401, $3402);
                                                                var $3399 = $3403;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3404 = self.idx;
                                                                var $3405 = self.code;
                                                                var $3406 = self.val;
                                                                var self = Kind$Parser$stop$(_init$1, $3404, $3405);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $3408 = self.idx;
                                                                        var $3409 = self.code;
                                                                        var $3410 = self.err;
                                                                        var $3411 = Parser$Reply$error$($3408, $3409, $3410);
                                                                        var $3407 = $3411;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $3412 = self.idx;
                                                                        var $3413 = self.code;
                                                                        var $3414 = self.val;
                                                                        var _term$29 = Kind$Term$ref$("Equal.rewrite");
                                                                        var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                        var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                        var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                        var _term$33 = Kind$Term$app$(_term$32, $3406);
                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$lam$($3376, (_x$34 => {
                                                                            var $3416 = $3391;
                                                                            return $3416;
                                                                        })));
                                                                        var _term$35 = Kind$Term$app$(_term$34, _subt$2);
                                                                        var $3415 = Parser$Reply$value$($3412, $3413, Kind$Term$ori$($3414, _term$35));
                                                                        var $3407 = $3415;
                                                                        break;
                                                                };
                                                                var $3399 = $3407;
                                                                break;
                                                        };
                                                        var $3392 = $3399;
                                                        break;
                                                };
                                                var $3384 = $3392;
                                                break;
                                        };
                                        var $3377 = $3384;
                                        break;
                                };
                                var $3369 = $3377;
                                break;
                        };
                        var $3362 = $3369;
                        break;
                };
                var $3355 = $3362;
                break;
        };
        return $3355;
    };
    const Kind$Parser$rewrite = x0 => x1 => x2 => x3 => Kind$Parser$rewrite$(x0, x1, x2, x3);

    function Kind$Term$ann$(_done$1, _term$2, _type$3) {
        var $3417 = ({
            _: 'Kind.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $3417;
    };
    const Kind$Term$ann = x0 => x1 => x2 => Kind$Term$ann$(x0, x1, x2);

    function Kind$Parser$annotation$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3419 = self.idx;
                var $3420 = self.code;
                var $3421 = self.err;
                var $3422 = Parser$Reply$error$($3419, $3420, $3421);
                var $3418 = $3422;
                break;
            case 'Parser.Reply.value':
                var $3423 = self.idx;
                var $3424 = self.code;
                var self = Kind$Parser$term$($3423, $3424);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3426 = self.idx;
                        var $3427 = self.code;
                        var $3428 = self.err;
                        var $3429 = Parser$Reply$error$($3426, $3427, $3428);
                        var $3425 = $3429;
                        break;
                    case 'Parser.Reply.value':
                        var $3430 = self.idx;
                        var $3431 = self.code;
                        var $3432 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3430, $3431);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3434 = self.idx;
                                var $3435 = self.code;
                                var $3436 = self.err;
                                var $3437 = Parser$Reply$error$($3434, $3435, $3436);
                                var $3433 = $3437;
                                break;
                            case 'Parser.Reply.value':
                                var $3438 = self.idx;
                                var $3439 = self.code;
                                var $3440 = self.val;
                                var $3441 = Parser$Reply$value$($3438, $3439, Kind$Term$ori$($3440, Kind$Term$ann$(Bool$false, _term$2, $3432)));
                                var $3433 = $3441;
                                break;
                        };
                        var $3425 = $3433;
                        break;
                };
                var $3418 = $3425;
                break;
        };
        return $3418;
    };
    const Kind$Parser$annotation = x0 => x1 => x2 => x3 => Kind$Parser$annotation$(x0, x1, x2, x3);

    function Kind$Parser$application$hole$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3443 = self.idx;
                var $3444 = self.code;
                var $3445 = self.err;
                var $3446 = Parser$Reply$error$($3443, $3444, $3445);
                var $3442 = $3446;
                break;
            case 'Parser.Reply.value':
                var $3447 = self.idx;
                var $3448 = self.code;
                var self = Kind$Parser$stop$(_init$1, $3447, $3448);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3450 = self.idx;
                        var $3451 = self.code;
                        var $3452 = self.err;
                        var $3453 = Parser$Reply$error$($3450, $3451, $3452);
                        var $3449 = $3453;
                        break;
                    case 'Parser.Reply.value':
                        var $3454 = self.idx;
                        var $3455 = self.code;
                        var $3456 = self.val;
                        var $3457 = Parser$Reply$value$($3454, $3455, Kind$Term$ori$($3456, Kind$Term$app$(_term$2, Kind$Term$hol$(Bits$e))));
                        var $3449 = $3457;
                        break;
                };
                var $3442 = $3449;
                break;
        };
        return $3442;
    };
    const Kind$Parser$application$hole = x0 => x1 => x2 => x3 => Kind$Parser$application$hole$(x0, x1, x2, x3);

    function Kind$Parser$suffix$(_init$1, _term$2, _idx$3, _code$4) {
        var Kind$Parser$suffix$ = (_init$1, _term$2, _idx$3, _code$4) => ({
            ctr: 'TCO',
            arg: [_init$1, _term$2, _idx$3, _code$4]
        });
        var Kind$Parser$suffix = _init$1 => _term$2 => _idx$3 => _code$4 => Kind$Parser$suffix$(_init$1, _term$2, _idx$3, _code$4);
        var arg = [_init$1, _term$2, _idx$3, _code$4];
        while (true) {
            let [_init$1, _term$2, _idx$3, _code$4] = arg;
            var R = (() => {
                var _suffix_parser$5 = Parser$first_of$(List$cons$(Kind$Parser$application(_init$1)(_term$2), List$cons$(Kind$Parser$application$erased(_init$1)(_term$2), List$cons$(Kind$Parser$arrow(_init$1)(_term$2), List$cons$(Kind$Parser$add(_init$1)(_term$2), List$cons$(Kind$Parser$sub(_init$1)(_term$2), List$cons$(Kind$Parser$mul(_init$1)(_term$2), List$cons$(Kind$Parser$div(_init$1)(_term$2), List$cons$(Kind$Parser$mod(_init$1)(_term$2), List$cons$(Kind$Parser$cons(_init$1)(_term$2), List$cons$(Kind$Parser$concat(_init$1)(_term$2), List$cons$(Kind$Parser$string_concat(_init$1)(_term$2), List$cons$(Kind$Parser$sigma(_init$1)(_term$2), List$cons$(Kind$Parser$equality(_init$1)(_term$2), List$cons$(Kind$Parser$inequality(_init$1)(_term$2), List$cons$(Kind$Parser$rewrite(_init$1)(_term$2), List$cons$(Kind$Parser$annotation(_init$1)(_term$2), List$cons$(Kind$Parser$application$hole(_init$1)(_term$2), List$nil))))))))))))))))));
                var self = _suffix_parser$5(_idx$3)(_code$4);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $3459 = self.idx;
                        var $3460 = self.code;
                        var $3461 = self.val;
                        var $3462 = Kind$Parser$suffix$(_init$1, $3461, $3459, $3460);
                        var $3458 = $3462;
                        break;
                    case 'Parser.Reply.error':
                        var $3463 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $3458 = $3463;
                        break;
                };
                return $3458;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Parser$suffix = x0 => x1 => x2 => x3 => Kind$Parser$suffix$(x0, x1, x2, x3);

    function Kind$Parser$term$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3465 = self.idx;
                var $3466 = self.code;
                var $3467 = self.err;
                var $3468 = Parser$Reply$error$($3465, $3466, $3467);
                var $3464 = $3468;
                break;
            case 'Parser.Reply.value':
                var $3469 = self.idx;
                var $3470 = self.code;
                var $3471 = self.val;
                var self = Parser$first_of$(List$cons$(Kind$Parser$forall, List$cons$(Kind$Parser$lambda, List$cons$(Kind$Parser$lambda$erased, List$cons$(Kind$Parser$lambda$nameless, List$cons$(Kind$Parser$parenthesis, List$cons$(Kind$Parser$letforrange$u32, List$cons$(Kind$Parser$letforrange$nat, List$cons$(Kind$Parser$letforin, List$cons$(Kind$Parser$let, List$cons$(Kind$Parser$get, List$cons$(Kind$Parser$def, List$cons$(Kind$Parser$goal_rewrite, List$cons$(Kind$Parser$if, List$cons$(Kind$Parser$char, List$cons$(Kind$Parser$string, List$cons$(Kind$Parser$pair, List$cons$(Kind$Parser$sigma$type, List$cons$(Kind$Parser$some, List$cons$(Kind$Parser$apply, List$cons$(Kind$Parser$mirror, List$cons$(Kind$Parser$list, List$cons$(Kind$Parser$map, List$cons$(Kind$Parser$log, List$cons$(Kind$Parser$do, List$cons$(Kind$Parser$case, List$cons$(Kind$Parser$open, List$cons$(Kind$Parser$without, List$cons$(Kind$Parser$switch, List$cons$(Kind$Parser$goal, List$cons$(Kind$Parser$hole, List$cons$(Kind$Parser$u8, List$cons$(Kind$Parser$u16, List$cons$(Kind$Parser$u32, List$cons$(Kind$Parser$u64, List$cons$(Kind$Parser$nat, List$cons$(Kind$Parser$reference, List$nil)))))))))))))))))))))))))))))))))))))($3469)($3470);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3473 = self.idx;
                        var $3474 = self.code;
                        var $3475 = self.err;
                        var $3476 = Parser$Reply$error$($3473, $3474, $3475);
                        var $3472 = $3476;
                        break;
                    case 'Parser.Reply.value':
                        var $3477 = self.idx;
                        var $3478 = self.code;
                        var $3479 = self.val;
                        var $3480 = Kind$Parser$suffix$($3471, $3479, $3477, $3478);
                        var $3472 = $3480;
                        break;
                };
                var $3464 = $3472;
                break;
        };
        return $3464;
    };
    const Kind$Parser$term = x0 => x1 => Kind$Parser$term$(x0, x1);

    function Kind$Parser$name_term$(_sep$1, _idx$2, _code$3) {
        var self = Kind$Parser$name$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3482 = self.idx;
                var $3483 = self.code;
                var $3484 = self.err;
                var $3485 = Parser$Reply$error$($3482, $3483, $3484);
                var $3481 = $3485;
                break;
            case 'Parser.Reply.value':
                var $3486 = self.idx;
                var $3487 = self.code;
                var $3488 = self.val;
                var self = Kind$Parser$text$(_sep$1, $3486, $3487);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3490 = self.idx;
                        var $3491 = self.code;
                        var $3492 = self.err;
                        var $3493 = Parser$Reply$error$($3490, $3491, $3492);
                        var $3489 = $3493;
                        break;
                    case 'Parser.Reply.value':
                        var $3494 = self.idx;
                        var $3495 = self.code;
                        var self = Kind$Parser$term$($3494, $3495);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3497 = self.idx;
                                var $3498 = self.code;
                                var $3499 = self.err;
                                var $3500 = Parser$Reply$error$($3497, $3498, $3499);
                                var $3496 = $3500;
                                break;
                            case 'Parser.Reply.value':
                                var $3501 = self.idx;
                                var $3502 = self.code;
                                var $3503 = self.val;
                                var $3504 = Parser$Reply$value$($3501, $3502, Pair$new$($3488, $3503));
                                var $3496 = $3504;
                                break;
                        };
                        var $3489 = $3496;
                        break;
                };
                var $3481 = $3489;
                break;
        };
        return $3481;
    };
    const Kind$Parser$name_term = x0 => x1 => x2 => Kind$Parser$name_term$(x0, x1, x2);

    function Kind$Binder$new$(_eras$1, _name$2, _term$3) {
        var $3505 = ({
            _: 'Kind.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $3505;
    };
    const Kind$Binder$new = x0 => x1 => x2 => Kind$Binder$new$(x0, x1, x2);

    function Kind$Parser$binder$homo$(_sep$1, _eras$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$((() => {
            var self = _eras$2;
            if (self) {
                var $3507 = "<";
                return $3507;
            } else {
                var $3508 = "(";
                return $3508;
            };
        })(), _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3509 = self.idx;
                var $3510 = self.code;
                var $3511 = self.err;
                var $3512 = Parser$Reply$error$($3509, $3510, $3511);
                var $3506 = $3512;
                break;
            case 'Parser.Reply.value':
                var $3513 = self.idx;
                var $3514 = self.code;
                var self = Parser$until1$(Kind$Parser$text((() => {
                    var self = _eras$2;
                    if (self) {
                        var $3516 = ">";
                        return $3516;
                    } else {
                        var $3517 = ")";
                        return $3517;
                    };
                })()), Kind$Parser$item(Kind$Parser$name_term(_sep$1)), $3513, $3514);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3518 = self.idx;
                        var $3519 = self.code;
                        var $3520 = self.err;
                        var $3521 = Parser$Reply$error$($3518, $3519, $3520);
                        var $3515 = $3521;
                        break;
                    case 'Parser.Reply.value':
                        var $3522 = self.idx;
                        var $3523 = self.code;
                        var $3524 = self.val;
                        var $3525 = Parser$Reply$value$($3522, $3523, List$mapped$($3524, (_pair$11 => {
                            var self = _pair$11;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3527 = self.fst;
                                    var $3528 = self.snd;
                                    var $3529 = Kind$Binder$new$(_eras$2, $3527, $3528);
                                    var $3526 = $3529;
                                    break;
                            };
                            return $3526;
                        })));
                        var $3515 = $3525;
                        break;
                };
                var $3506 = $3515;
                break;
        };
        return $3506;
    };
    const Kind$Parser$binder$homo = x0 => x1 => x2 => x3 => Kind$Parser$binder$homo$(x0, x1, x2, x3);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3531 = self.head;
                var $3532 = self.tail;
                var $3533 = List$cons$($3531, List$concat$($3532, _bs$3));
                var $3530 = $3533;
                break;
            case 'List.nil':
                var $3534 = _bs$3;
                var $3530 = $3534;
                break;
        };
        return $3530;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $3536 = self.head;
                var $3537 = self.tail;
                var $3538 = List$concat$($3536, List$flatten$($3537));
                var $3535 = $3538;
                break;
            case 'List.nil':
                var $3539 = List$nil;
                var $3535 = $3539;
                break;
        };
        return $3535;
    };
    const List$flatten = x0 => List$flatten$(x0);

    function Kind$Parser$binder$(_sep$1, _idx$2, _code$3) {
        var self = Parser$many1$(Parser$first_of$(List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$true), List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$false), List$nil))), _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3541 = self.idx;
                var $3542 = self.code;
                var $3543 = self.err;
                var $3544 = Parser$Reply$error$($3541, $3542, $3543);
                var $3540 = $3544;
                break;
            case 'Parser.Reply.value':
                var $3545 = self.idx;
                var $3546 = self.code;
                var $3547 = self.val;
                var $3548 = Parser$Reply$value$($3545, $3546, List$flatten$($3547));
                var $3540 = $3548;
                break;
        };
        return $3540;
    };
    const Kind$Parser$binder = x0 => x1 => x2 => Kind$Parser$binder$(x0, x1, x2);
    const List$length = a0 => (list_length(a0));

    function Kind$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.cons':
                var $3550 = self.head;
                var $3551 = self.tail;
                var self = $3550;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3553 = self.eras;
                        var $3554 = self.name;
                        var $3555 = self.term;
                        var $3556 = Kind$Term$all$($3553, "", $3554, $3555, (_s$8 => _x$9 => {
                            var $3557 = Kind$Parser$make_forall$($3551, _body$2);
                            return $3557;
                        }));
                        var $3552 = $3556;
                        break;
                };
                var $3549 = $3552;
                break;
            case 'List.nil':
                var $3558 = _body$2;
                var $3549 = $3558;
                break;
        };
        return $3549;
    };
    const Kind$Parser$make_forall = x0 => x1 => Kind$Parser$make_forall$(x0, x1);

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
                    case 'List.cons':
                        var $3559 = self.head;
                        var $3560 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $3562 = Maybe$some$($3559);
                            var $3561 = $3562;
                        } else {
                            var $3563 = (self - 1n);
                            var $3564 = List$at$($3563, $3560);
                            var $3561 = $3564;
                        };
                        return $3561;
                    case 'List.nil':
                        var $3565 = Maybe$none;
                        return $3565;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $3566 = List$at$(_index$2, List$reverse$(_list$3));
        return $3566;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Kind$Term$var$(_name$1, _indx$2) {
        var $3567 = ({
            _: 'Kind.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $3567;
    };
    const Kind$Term$var = x0 => x1 => Kind$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $3569 = self.snd;
                var $3570 = $3569;
                var $3568 = $3570;
                break;
        };
        return $3568;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Kind$Context$get_name_skips$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3572 = Pair$new$("", 0n);
            var $3571 = $3572;
        } else {
            var $3573 = self.charCodeAt(0);
            var $3574 = self.slice(1);
            var _name_skips$4 = Kind$Context$get_name_skips$($3574);
            var self = _name_skips$4;
            switch (self._) {
                case 'Pair.new':
                    var $3576 = self.fst;
                    var $3577 = self.snd;
                    var self = ($3573 === 94);
                    if (self) {
                        var $3579 = Pair$new$($3576, Nat$succ$($3577));
                        var $3578 = $3579;
                    } else {
                        var $3580 = Pair$new$(String$cons$($3573, $3576), $3577);
                        var $3578 = $3580;
                    };
                    var $3575 = $3578;
                    break;
            };
            var $3571 = $3575;
        };
        return $3571;
    };
    const Kind$Context$get_name_skips = x0 => Kind$Context$get_name_skips$(x0);

    function Kind$Name$eql$(_a$1, _b$2) {
        var $3581 = (_a$1 === _b$2);
        return $3581;
    };
    const Kind$Name$eql = x0 => x1 => Kind$Name$eql$(x0, x1);

    function Kind$Context$find$go$(_name$1, _skip$2, _ctx$3) {
        var Kind$Context$find$go$ = (_name$1, _skip$2, _ctx$3) => ({
            ctr: 'TCO',
            arg: [_name$1, _skip$2, _ctx$3]
        });
        var Kind$Context$find$go = _name$1 => _skip$2 => _ctx$3 => Kind$Context$find$go$(_name$1, _skip$2, _ctx$3);
        var arg = [_name$1, _skip$2, _ctx$3];
        while (true) {
            let [_name$1, _skip$2, _ctx$3] = arg;
            var R = (() => {
                var self = _ctx$3;
                switch (self._) {
                    case 'List.cons':
                        var $3582 = self.head;
                        var $3583 = self.tail;
                        var self = $3582;
                        switch (self._) {
                            case 'Pair.new':
                                var $3585 = self.fst;
                                var $3586 = self.snd;
                                var self = Kind$Name$eql$(_name$1, $3585);
                                if (self) {
                                    var self = _skip$2;
                                    if (self === 0n) {
                                        var $3589 = Maybe$some$($3586);
                                        var $3588 = $3589;
                                    } else {
                                        var $3590 = (self - 1n);
                                        var $3591 = Kind$Context$find$go$(_name$1, $3590, $3583);
                                        var $3588 = $3591;
                                    };
                                    var $3587 = $3588;
                                } else {
                                    var $3592 = Kind$Context$find$go$(_name$1, _skip$2, $3583);
                                    var $3587 = $3592;
                                };
                                var $3584 = $3587;
                                break;
                        };
                        return $3584;
                    case 'List.nil':
                        var $3593 = Maybe$none;
                        return $3593;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Context$find$go = x0 => x1 => x2 => Kind$Context$find$go$(x0, x1, x2);

    function Kind$Context$find$(_name$1, _ctx$2) {
        var self = Kind$Context$get_name_skips$(_name$1);
        switch (self._) {
            case 'Pair.new':
                var $3595 = self.fst;
                var $3596 = self.snd;
                var $3597 = Kind$Context$find$go$($3595, $3596, _ctx$2);
                var $3594 = $3597;
                break;
        };
        return $3594;
    };
    const Kind$Context$find = x0 => x1 => Kind$Context$find$(x0, x1);

    function Kind$Path$o$(_path$1, _x$2) {
        var $3598 = _path$1((_x$2 + '0'));
        return $3598;
    };
    const Kind$Path$o = x0 => x1 => Kind$Path$o$(x0, x1);

    function Kind$Path$i$(_path$1, _x$2) {
        var $3599 = _path$1((_x$2 + '1'));
        return $3599;
    };
    const Kind$Path$i = x0 => x1 => Kind$Path$i$(x0, x1);

    function Kind$Path$to_bits$(_path$1) {
        var $3600 = _path$1(Bits$e);
        return $3600;
    };
    const Kind$Path$to_bits = x0 => Kind$Path$to_bits$(x0);

    function Kind$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kind.Term.var':
                var $3602 = self.name;
                var $3603 = self.indx;
                var self = List$at_last$($3603, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3605 = self.value;
                        var $3606 = Pair$snd$($3605);
                        var $3604 = $3606;
                        break;
                    case 'Maybe.none':
                        var $3607 = Kind$Term$var$($3602, $3603);
                        var $3604 = $3607;
                        break;
                };
                var $3601 = $3604;
                break;
            case 'Kind.Term.ref':
                var $3608 = self.name;
                var self = Kind$Context$find$($3608, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3610 = self.value;
                        var $3611 = $3610;
                        var $3609 = $3611;
                        break;
                    case 'Maybe.none':
                        var $3612 = Kind$Term$ref$($3608);
                        var $3609 = $3612;
                        break;
                };
                var $3601 = $3609;
                break;
            case 'Kind.Term.all':
                var $3613 = self.eras;
                var $3614 = self.self;
                var $3615 = self.name;
                var $3616 = self.xtyp;
                var $3617 = self.body;
                var _vlen$9 = (list_length(_vars$1));
                var $3618 = Kind$Term$all$($3613, $3614, $3615, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3616), (_s$10 => _x$11 => {
                    var $3619 = Kind$Term$bind$(List$cons$(Pair$new$($3615, _x$11), List$cons$(Pair$new$($3614, _s$10), _vars$1)), Kind$Path$i(_path$2), $3617(Kind$Term$var$($3614, _vlen$9))(Kind$Term$var$($3615, Nat$succ$(_vlen$9))));
                    return $3619;
                }));
                var $3601 = $3618;
                break;
            case 'Kind.Term.lam':
                var $3620 = self.name;
                var $3621 = self.body;
                var _vlen$6 = (list_length(_vars$1));
                var $3622 = Kind$Term$lam$($3620, (_x$7 => {
                    var $3623 = Kind$Term$bind$(List$cons$(Pair$new$($3620, _x$7), _vars$1), Kind$Path$o(_path$2), $3621(Kind$Term$var$($3620, _vlen$6)));
                    return $3623;
                }));
                var $3601 = $3622;
                break;
            case 'Kind.Term.app':
                var $3624 = self.func;
                var $3625 = self.argm;
                var $3626 = Kind$Term$app$(Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3624), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3625));
                var $3601 = $3626;
                break;
            case 'Kind.Term.let':
                var $3627 = self.name;
                var $3628 = self.expr;
                var $3629 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3630 = Kind$Term$let$($3627, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3628), (_x$8 => {
                    var $3631 = Kind$Term$bind$(List$cons$(Pair$new$($3627, _x$8), _vars$1), Kind$Path$i(_path$2), $3629(Kind$Term$var$($3627, _vlen$7)));
                    return $3631;
                }));
                var $3601 = $3630;
                break;
            case 'Kind.Term.def':
                var $3632 = self.name;
                var $3633 = self.expr;
                var $3634 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3635 = Kind$Term$def$($3632, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3633), (_x$8 => {
                    var $3636 = Kind$Term$bind$(List$cons$(Pair$new$($3632, _x$8), _vars$1), Kind$Path$i(_path$2), $3634(Kind$Term$var$($3632, _vlen$7)));
                    return $3636;
                }));
                var $3601 = $3635;
                break;
            case 'Kind.Term.ann':
                var $3637 = self.done;
                var $3638 = self.term;
                var $3639 = self.type;
                var $3640 = Kind$Term$ann$($3637, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3638), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3639));
                var $3601 = $3640;
                break;
            case 'Kind.Term.gol':
                var $3641 = self.name;
                var $3642 = self.dref;
                var $3643 = self.verb;
                var $3644 = Kind$Term$gol$($3641, $3642, $3643);
                var $3601 = $3644;
                break;
            case 'Kind.Term.nat':
                var $3645 = self.natx;
                var $3646 = Kind$Term$nat$($3645);
                var $3601 = $3646;
                break;
            case 'Kind.Term.chr':
                var $3647 = self.chrx;
                var $3648 = Kind$Term$chr$($3647);
                var $3601 = $3648;
                break;
            case 'Kind.Term.str':
                var $3649 = self.strx;
                var $3650 = Kind$Term$str$($3649);
                var $3601 = $3650;
                break;
            case 'Kind.Term.cse':
                var $3651 = self.expr;
                var $3652 = self.name;
                var $3653 = self.with;
                var $3654 = self.cses;
                var $3655 = self.moti;
                var _expr$10 = Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3651);
                var _name$11 = $3652;
                var _wyth$12 = $3653;
                var _cses$13 = $3654;
                var _moti$14 = $3655;
                var $3656 = Kind$Term$cse$(Kind$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $3601 = $3656;
                break;
            case 'Kind.Term.ori':
                var $3657 = self.orig;
                var $3658 = self.expr;
                var $3659 = Kind$Term$ori$($3657, Kind$Term$bind$(_vars$1, _path$2, $3658));
                var $3601 = $3659;
                break;
            case 'Kind.Term.typ':
                var $3660 = Kind$Term$typ;
                var $3601 = $3660;
                break;
            case 'Kind.Term.hol':
                var $3661 = Kind$Term$hol$(Kind$Path$to_bits$(_path$2));
                var $3601 = $3661;
                break;
        };
        return $3601;
    };
    const Kind$Term$bind = x0 => x1 => x2 => Kind$Term$bind$(x0, x1, x2);
    const Kind$Status$done = ({
        _: 'Kind.Status.done'
    });

    function Kind$define$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _done$9, _defs$10) {
        var self = _done$9;
        if (self) {
            var $3663 = Kind$Status$done;
            var _stat$11 = $3663;
        } else {
            var $3664 = Kind$Status$init;
            var _stat$11 = $3664;
        };
        var $3662 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$11), _defs$10);
        return $3662;
    };
    const Kind$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Kind$define$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Kind$Parser$file$def$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3666 = self.idx;
                var $3667 = self.code;
                var $3668 = self.err;
                var $3669 = Parser$Reply$error$($3666, $3667, $3668);
                var $3665 = $3669;
                break;
            case 'Parser.Reply.value':
                var $3670 = self.idx;
                var $3671 = self.code;
                var $3672 = self.val;
                var self = Kind$Parser$name1$($3670, $3671);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3674 = self.idx;
                        var $3675 = self.code;
                        var $3676 = self.err;
                        var $3677 = Parser$Reply$error$($3674, $3675, $3676);
                        var $3673 = $3677;
                        break;
                    case 'Parser.Reply.value':
                        var $3678 = self.idx;
                        var $3679 = self.code;
                        var $3680 = self.val;
                        var self = Parser$many$(Kind$Parser$binder(":"))($3678)($3679);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3682 = self.idx;
                                var $3683 = self.code;
                                var $3684 = self.err;
                                var $3685 = Parser$Reply$error$($3682, $3683, $3684);
                                var $3681 = $3685;
                                break;
                            case 'Parser.Reply.value':
                                var $3686 = self.idx;
                                var $3687 = self.code;
                                var $3688 = self.val;
                                var _args$15 = List$flatten$($3688);
                                var self = Kind$Parser$text$(":", $3686, $3687);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3690 = self.idx;
                                        var $3691 = self.code;
                                        var $3692 = self.err;
                                        var $3693 = Parser$Reply$error$($3690, $3691, $3692);
                                        var $3689 = $3693;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3694 = self.idx;
                                        var $3695 = self.code;
                                        var self = Kind$Parser$term$($3694, $3695);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3697 = self.idx;
                                                var $3698 = self.code;
                                                var $3699 = self.err;
                                                var $3700 = Parser$Reply$error$($3697, $3698, $3699);
                                                var $3696 = $3700;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3701 = self.idx;
                                                var $3702 = self.code;
                                                var $3703 = self.val;
                                                var self = Kind$Parser$term$($3701, $3702);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3705 = self.idx;
                                                        var $3706 = self.code;
                                                        var $3707 = self.err;
                                                        var $3708 = Parser$Reply$error$($3705, $3706, $3707);
                                                        var $3704 = $3708;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3709 = self.idx;
                                                        var $3710 = self.code;
                                                        var $3711 = self.val;
                                                        var self = Kind$Parser$stop$($3672, $3709, $3710);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3713 = self.idx;
                                                                var $3714 = self.code;
                                                                var $3715 = self.err;
                                                                var $3716 = Parser$Reply$error$($3713, $3714, $3715);
                                                                var $3712 = $3716;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3717 = self.idx;
                                                                var $3718 = self.code;
                                                                var $3719 = self.val;
                                                                var _arit$28 = (list_length(_args$15));
                                                                var _type$29 = Kind$Parser$make_forall$(_args$15, $3703);
                                                                var _term$30 = Kind$Parser$make_lambda$(List$mapped$(_args$15, (_x$30 => {
                                                                    var self = _x$30;
                                                                    switch (self._) {
                                                                        case 'Kind.Binder.new':
                                                                            var $3722 = self.name;
                                                                            var $3723 = $3722;
                                                                            var $3721 = $3723;
                                                                            break;
                                                                    };
                                                                    return $3721;
                                                                })), $3711);
                                                                var _type$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                                    var $3724 = (_x$31 + '1');
                                                                    return $3724;
                                                                }), _type$29);
                                                                var _term$32 = Kind$Term$bind$(List$nil, (_x$32 => {
                                                                    var $3725 = (_x$32 + '0');
                                                                    return $3725;
                                                                }), _term$30);
                                                                var _defs$33 = Kind$define$(_file$1, _code$2, $3719, $3680, _term$32, _type$31, Bool$false, _arit$28, Bool$false, _defs$3);
                                                                var $3720 = Parser$Reply$value$($3717, $3718, _defs$33);
                                                                var $3712 = $3720;
                                                                break;
                                                        };
                                                        var $3704 = $3712;
                                                        break;
                                                };
                                                var $3696 = $3704;
                                                break;
                                        };
                                        var $3689 = $3696;
                                        break;
                                };
                                var $3681 = $3689;
                                break;
                        };
                        var $3673 = $3681;
                        break;
                };
                var $3665 = $3673;
                break;
        };
        return $3665;
    };
    const Kind$Parser$file$def = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$def$(x0, x1, x2, x3, x4);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $3727 = self.value;
                var $3728 = $3727;
                var $3726 = $3728;
                break;
            case 'Maybe.none':
                var $3729 = _a$2;
                var $3726 = $3729;
                break;
        };
        return $3726;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Kind$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $3730 = ({
            _: 'Kind.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $3730;
    };
    const Kind$Constructor$new = x0 => x1 => x2 => Kind$Constructor$new$(x0, x1, x2);

    function Kind$Parser$constructor$(_namespace$1, _idx$2, _code$3) {
        var self = Kind$Parser$name1$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3732 = self.idx;
                var $3733 = self.code;
                var $3734 = self.err;
                var $3735 = Parser$Reply$error$($3732, $3733, $3734);
                var $3731 = $3735;
                break;
            case 'Parser.Reply.value':
                var $3736 = self.idx;
                var $3737 = self.code;
                var $3738 = self.val;
                var self = Parser$maybe$(Kind$Parser$binder(":"), $3736, $3737);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3740 = self.idx;
                        var $3741 = self.code;
                        var $3742 = self.err;
                        var $3743 = Parser$Reply$error$($3740, $3741, $3742);
                        var $3739 = $3743;
                        break;
                    case 'Parser.Reply.value':
                        var $3744 = self.idx;
                        var $3745 = self.code;
                        var $3746 = self.val;
                        var self = Parser$maybe$((_idx$10 => _code$11 => {
                            var self = Kind$Parser$text$("~", _idx$10, _code$11);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $3749 = self.idx;
                                    var $3750 = self.code;
                                    var $3751 = self.err;
                                    var $3752 = Parser$Reply$error$($3749, $3750, $3751);
                                    var $3748 = $3752;
                                    break;
                                case 'Parser.Reply.value':
                                    var $3753 = self.idx;
                                    var $3754 = self.code;
                                    var $3755 = Kind$Parser$binder$("=", $3753, $3754);
                                    var $3748 = $3755;
                                    break;
                            };
                            return $3748;
                        }), $3744, $3745);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3756 = self.idx;
                                var $3757 = self.code;
                                var $3758 = self.err;
                                var $3759 = Parser$Reply$error$($3756, $3757, $3758);
                                var $3747 = $3759;
                                break;
                            case 'Parser.Reply.value':
                                var $3760 = self.idx;
                                var $3761 = self.code;
                                var $3762 = self.val;
                                var _args$13 = Maybe$default$(List$nil, $3746);
                                var _inds$14 = Maybe$default$(List$nil, $3762);
                                var $3763 = Parser$Reply$value$($3760, $3761, Kind$Constructor$new$($3738, _args$13, _inds$14));
                                var $3747 = $3763;
                                break;
                        };
                        var $3739 = $3747;
                        break;
                };
                var $3731 = $3739;
                break;
        };
        return $3731;
    };
    const Kind$Parser$constructor = x0 => x1 => x2 => Kind$Parser$constructor$(x0, x1, x2);

    function Kind$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $3764 = ({
            _: 'Kind.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $3764;
    };
    const Kind$Datatype$new = x0 => x1 => x2 => x3 => Kind$Datatype$new$(x0, x1, x2, x3);

    function Kind$Parser$datatype$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("type ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3766 = self.idx;
                var $3767 = self.code;
                var $3768 = self.err;
                var $3769 = Parser$Reply$error$($3766, $3767, $3768);
                var $3765 = $3769;
                break;
            case 'Parser.Reply.value':
                var $3770 = self.idx;
                var $3771 = self.code;
                var self = Kind$Parser$name1$($3770, $3771);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3773 = self.idx;
                        var $3774 = self.code;
                        var $3775 = self.err;
                        var $3776 = Parser$Reply$error$($3773, $3774, $3775);
                        var $3772 = $3776;
                        break;
                    case 'Parser.Reply.value':
                        var $3777 = self.idx;
                        var $3778 = self.code;
                        var $3779 = self.val;
                        var self = Parser$maybe$(Kind$Parser$binder(":"), $3777, $3778);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3781 = self.idx;
                                var $3782 = self.code;
                                var $3783 = self.err;
                                var $3784 = Parser$Reply$error$($3781, $3782, $3783);
                                var $3780 = $3784;
                                break;
                            case 'Parser.Reply.value':
                                var $3785 = self.idx;
                                var $3786 = self.code;
                                var $3787 = self.val;
                                var self = Parser$maybe$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("~", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $3790 = self.idx;
                                            var $3791 = self.code;
                                            var $3792 = self.err;
                                            var $3793 = Parser$Reply$error$($3790, $3791, $3792);
                                            var $3789 = $3793;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $3794 = self.idx;
                                            var $3795 = self.code;
                                            var $3796 = Kind$Parser$binder$(":", $3794, $3795);
                                            var $3789 = $3796;
                                            break;
                                    };
                                    return $3789;
                                }), $3785, $3786);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3797 = self.idx;
                                        var $3798 = self.code;
                                        var $3799 = self.err;
                                        var $3800 = Parser$Reply$error$($3797, $3798, $3799);
                                        var $3788 = $3800;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3801 = self.idx;
                                        var $3802 = self.code;
                                        var $3803 = self.val;
                                        var _pars$15 = Maybe$default$(List$nil, $3787);
                                        var _inds$16 = Maybe$default$(List$nil, $3803);
                                        var self = Kind$Parser$text$("{", $3801, $3802);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3805 = self.idx;
                                                var $3806 = self.code;
                                                var $3807 = self.err;
                                                var $3808 = Parser$Reply$error$($3805, $3806, $3807);
                                                var $3804 = $3808;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3809 = self.idx;
                                                var $3810 = self.code;
                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item(Kind$Parser$constructor($3779)))($3809)($3810);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3812 = self.idx;
                                                        var $3813 = self.code;
                                                        var $3814 = self.err;
                                                        var $3815 = Parser$Reply$error$($3812, $3813, $3814);
                                                        var $3811 = $3815;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3816 = self.idx;
                                                        var $3817 = self.code;
                                                        var $3818 = self.val;
                                                        var $3819 = Parser$Reply$value$($3816, $3817, Kind$Datatype$new$($3779, _pars$15, _inds$16, $3818));
                                                        var $3811 = $3819;
                                                        break;
                                                };
                                                var $3804 = $3811;
                                                break;
                                        };
                                        var $3788 = $3804;
                                        break;
                                };
                                var $3780 = $3788;
                                break;
                        };
                        var $3772 = $3780;
                        break;
                };
                var $3765 = $3772;
                break;
        };
        return $3765;
    };
    const Kind$Parser$datatype = x0 => x1 => Kind$Parser$datatype$(x0, x1);

    function Kind$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.cons':
                var $3821 = self.head;
                var $3822 = self.tail;
                var self = $3821;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3824 = self.eras;
                        var $3825 = self.name;
                        var $3826 = self.term;
                        var $3827 = Kind$Term$all$($3824, "", $3825, $3826, (_s$9 => _x$10 => {
                            var $3828 = Kind$Datatype$build_term$motive$go$(_type$1, _name$2, $3822);
                            return $3828;
                        }));
                        var $3823 = $3827;
                        break;
                };
                var $3820 = $3823;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3830 = self.pars;
                        var $3831 = self.inds;
                        var _slf$8 = Kind$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $3834 = _slf$8;
                            var $3835 = $3830;
                            let _slf$10 = $3834;
                            let _v$9;
                            while ($3835._ === 'List.cons') {
                                _v$9 = $3835.head;
                                var $3834 = Kind$Term$app$(_slf$10, Kind$Term$ref$((() => {
                                    var self = _v$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3836 = self.name;
                                            var $3837 = $3836;
                                            return $3837;
                                    };
                                })()));
                                _slf$10 = $3834;
                                $3835 = $3835.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $3839 = _slf$9;
                            var $3840 = $3831;
                            let _slf$11 = $3839;
                            let _v$10;
                            while ($3840._ === 'List.cons') {
                                _v$10 = $3840.head;
                                var $3839 = Kind$Term$app$(_slf$11, Kind$Term$ref$((() => {
                                    var self = _v$10;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3841 = self.name;
                                            var $3842 = $3841;
                                            return $3842;
                                    };
                                })()));
                                _slf$11 = $3839;
                                $3840 = $3840.tail;
                            }
                            return _slf$11;
                        })();
                        var $3832 = Kind$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $3843 = Kind$Term$typ;
                            return $3843;
                        }));
                        var $3829 = $3832;
                        break;
                };
                var $3820 = $3829;
                break;
        };
        return $3820;
    };
    const Kind$Datatype$build_term$motive$go = x0 => x1 => x2 => Kind$Datatype$build_term$motive$go$(x0, x1, x2);

    function Kind$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3845 = self.name;
                var $3846 = self.inds;
                var $3847 = Kind$Datatype$build_term$motive$go$(_type$1, $3845, $3846);
                var $3844 = $3847;
                break;
        };
        return $3844;
    };
    const Kind$Datatype$build_term$motive = x0 => Kind$Datatype$build_term$motive$(x0);

    function Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.cons':
                var $3849 = self.head;
                var $3850 = self.tail;
                var self = $3849;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3852 = self.eras;
                        var $3853 = self.name;
                        var $3854 = self.term;
                        var _eras$9 = $3852;
                        var _name$10 = $3853;
                        var _xtyp$11 = $3854;
                        var _body$12 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3850);
                        var $3855 = Kind$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $3856 = _body$12;
                            return $3856;
                        }));
                        var $3851 = $3855;
                        break;
                };
                var $3848 = $3851;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3858 = self.name;
                        var $3859 = self.pars;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Kind.Constructor.new':
                                var $3861 = self.name;
                                var $3862 = self.args;
                                var $3863 = self.inds;
                                var _ret$11 = Kind$Term$ref$(Kind$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $3866 = _ret$11;
                                    var $3867 = $3863;
                                    let _ret$13 = $3866;
                                    let _v$12;
                                    while ($3867._ === 'List.cons') {
                                        _v$12 = $3867.head;
                                        var $3866 = Kind$Term$app$(_ret$13, (() => {
                                            var self = _v$12;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3868 = self.term;
                                                    var $3869 = $3868;
                                                    return $3869;
                                            };
                                        })());
                                        _ret$13 = $3866;
                                        $3867 = $3867.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($3858, List$cons$(Kind$Name$read$("."), List$cons$($3861, List$nil))));
                                var _slf$14 = Kind$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $3871 = _slf$14;
                                    var $3872 = $3859;
                                    let _slf$16 = $3871;
                                    let _v$15;
                                    while ($3872._ === 'List.cons') {
                                        _v$15 = $3872.head;
                                        var $3871 = Kind$Term$app$(_slf$16, Kind$Term$ref$((() => {
                                            var self = _v$15;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3873 = self.name;
                                                    var $3874 = $3873;
                                                    return $3874;
                                            };
                                        })()));
                                        _slf$16 = $3871;
                                        $3872 = $3872.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $3876 = _slf$15;
                                    var $3877 = $3862;
                                    let _slf$17 = $3876;
                                    let _v$16;
                                    while ($3877._ === 'List.cons') {
                                        _v$16 = $3877.head;
                                        var $3876 = Kind$Term$app$(_slf$17, Kind$Term$ref$((() => {
                                            var self = _v$16;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3878 = self.name;
                                                    var $3879 = $3878;
                                                    return $3879;
                                            };
                                        })()));
                                        _slf$17 = $3876;
                                        $3877 = $3877.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $3864 = Kind$Term$app$(_ret$12, _slf$16);
                                var $3860 = $3864;
                                break;
                        };
                        var $3857 = $3860;
                        break;
                };
                var $3848 = $3857;
                break;
        };
        return $3848;
    };
    const Kind$Datatype$build_term$constructor$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kind.Constructor.new':
                var $3881 = self.args;
                var $3882 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3881);
                var $3880 = $3882;
                break;
        };
        return $3880;
    };
    const Kind$Datatype$build_term$constructor = x0 => x1 => Kind$Datatype$build_term$constructor$(x0, x1);

    function Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3884 = self.head;
                var $3885 = self.tail;
                var self = $3884;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3887 = self.name;
                        var $3888 = Kind$Term$all$(Bool$false, "", $3887, Kind$Datatype$build_term$constructor$(_type$1, $3884), (_s$9 => _x$10 => {
                            var $3889 = Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, $3885);
                            return $3889;
                        }));
                        var $3886 = $3888;
                        break;
                };
                var $3883 = $3886;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3891 = self.inds;
                        var _ret$8 = Kind$Term$ref$(Kind$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $3894 = _ret$8;
                            var $3895 = $3891;
                            let _ret$10 = $3894;
                            let _v$9;
                            while ($3895._ === 'List.cons') {
                                _v$9 = $3895.head;
                                var $3894 = Kind$Term$app$(_ret$10, Kind$Term$ref$((() => {
                                    var self = _v$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3896 = self.name;
                                            var $3897 = $3896;
                                            return $3897;
                                    };
                                })()));
                                _ret$10 = $3894;
                                $3895 = $3895.tail;
                            }
                            return _ret$10;
                        })();
                        var $3892 = Kind$Term$app$(_ret$9, Kind$Term$ref$((_name$2 + ".Self")));
                        var $3890 = $3892;
                        break;
                };
                var $3883 = $3890;
                break;
        };
        return $3883;
    };
    const Kind$Datatype$build_term$constructors$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3899 = self.name;
                var $3900 = self.ctrs;
                var $3901 = Kind$Datatype$build_term$constructors$go$(_type$1, $3899, $3900);
                var $3898 = $3901;
                break;
        };
        return $3898;
    };
    const Kind$Datatype$build_term$constructors = x0 => Kind$Datatype$build_term$constructors$(x0);

    function Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3903 = self.head;
                var $3904 = self.tail;
                var self = $3903;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3906 = self.name;
                        var $3907 = Kind$Term$lam$($3906, (_x$10 => {
                            var $3908 = Kind$Datatype$build_term$go$(_type$1, _name$2, $3904, _inds$4);
                            return $3908;
                        }));
                        var $3905 = $3907;
                        break;
                };
                var $3902 = $3905;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3910 = self.head;
                        var $3911 = self.tail;
                        var self = $3910;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3913 = self.name;
                                var $3914 = Kind$Term$lam$($3913, (_x$10 => {
                                    var $3915 = Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $3911);
                                    return $3915;
                                }));
                                var $3912 = $3914;
                                break;
                        };
                        var $3909 = $3912;
                        break;
                    case 'List.nil':
                        var $3916 = Kind$Term$all$(Bool$true, (_name$2 + ".Self"), Kind$Name$read$("P"), Kind$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $3917 = Kind$Datatype$build_term$constructors$(_type$1);
                            return $3917;
                        }));
                        var $3909 = $3916;
                        break;
                };
                var $3902 = $3909;
                break;
        };
        return $3902;
    };
    const Kind$Datatype$build_term$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_term$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3919 = self.name;
                var $3920 = self.pars;
                var $3921 = self.inds;
                var $3922 = Kind$Datatype$build_term$go$(_type$1, $3919, $3920, $3921);
                var $3918 = $3922;
                break;
        };
        return $3918;
    };
    const Kind$Datatype$build_term = x0 => Kind$Datatype$build_term$(x0);

    function Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3924 = self.head;
                var $3925 = self.tail;
                var self = $3924;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3927 = self.name;
                        var $3928 = self.term;
                        var $3929 = Kind$Term$all$(Bool$false, "", $3927, $3928, (_s$10 => _x$11 => {
                            var $3930 = Kind$Datatype$build_type$go$(_type$1, _name$2, $3925, _inds$4);
                            return $3930;
                        }));
                        var $3926 = $3929;
                        break;
                };
                var $3923 = $3926;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3932 = self.head;
                        var $3933 = self.tail;
                        var self = $3932;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3935 = self.name;
                                var $3936 = self.term;
                                var $3937 = Kind$Term$all$(Bool$false, "", $3935, $3936, (_s$10 => _x$11 => {
                                    var $3938 = Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $3933);
                                    return $3938;
                                }));
                                var $3934 = $3937;
                                break;
                        };
                        var $3931 = $3934;
                        break;
                    case 'List.nil':
                        var $3939 = Kind$Term$typ;
                        var $3931 = $3939;
                        break;
                };
                var $3923 = $3931;
                break;
        };
        return $3923;
    };
    const Kind$Datatype$build_type$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_type$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3941 = self.name;
                var $3942 = self.pars;
                var $3943 = self.inds;
                var $3944 = Kind$Datatype$build_type$go$(_type$1, $3941, $3942, $3943);
                var $3940 = $3944;
                break;
        };
        return $3940;
    };
    const Kind$Datatype$build_type = x0 => Kind$Datatype$build_type$(x0);

    function Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3946 = self.head;
                var $3947 = self.tail;
                var self = $3946;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3949 = self.name;
                        var $3950 = Kind$Term$lam$($3949, (_x$9 => {
                            var $3951 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3947);
                            return $3951;
                        }));
                        var $3948 = $3950;
                        break;
                };
                var $3945 = $3948;
                break;
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3953 = self.name;
                        var $3954 = self.args;
                        var _ret$7 = Kind$Term$ref$($3953);
                        var _ret$8 = (() => {
                            var $3957 = _ret$7;
                            var $3958 = $3954;
                            let _ret$9 = $3957;
                            let _arg$8;
                            while ($3958._ === 'List.cons') {
                                _arg$8 = $3958.head;
                                var $3957 = Kind$Term$app$(_ret$9, Kind$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3959 = self.name;
                                            var $3960 = $3959;
                                            return $3960;
                                    };
                                })()));
                                _ret$9 = $3957;
                                $3958 = $3958.tail;
                            }
                            return _ret$9;
                        })();
                        var $3955 = _ret$8;
                        var $3952 = $3955;
                        break;
                };
                var $3945 = $3952;
                break;
        };
        return $3945;
    };
    const Kind$Constructor$build_term$opt$go = x0 => x1 => x2 => Kind$Constructor$build_term$opt$go$(x0, x1, x2);

    function Kind$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3962 = self.ctrs;
                var $3963 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3962);
                var $3961 = $3963;
                break;
        };
        return $3961;
    };
    const Kind$Constructor$build_term$opt = x0 => x1 => Kind$Constructor$build_term$opt$(x0, x1);

    function Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3965 = self.head;
                var $3966 = self.tail;
                var self = $3965;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3968 = self.name;
                        var $3969 = Kind$Term$lam$($3968, (_x$11 => {
                            var $3970 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $3966, _args$5);
                            return $3970;
                        }));
                        var $3967 = $3969;
                        break;
                };
                var $3964 = $3967;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3972 = self.head;
                        var $3973 = self.tail;
                        var self = $3972;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3975 = self.name;
                                var $3976 = Kind$Term$lam$($3975, (_x$11 => {
                                    var $3977 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $3973);
                                    return $3977;
                                }));
                                var $3974 = $3976;
                                break;
                        };
                        var $3971 = $3974;
                        break;
                    case 'List.nil':
                        var $3978 = Kind$Term$lam$(Kind$Name$read$("P"), (_x$6 => {
                            var $3979 = Kind$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $3979;
                        }));
                        var $3971 = $3978;
                        break;
                };
                var $3964 = $3971;
                break;
        };
        return $3964;
    };
    const Kind$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3981 = self.name;
                var $3982 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3984 = self.args;
                        var $3985 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, $3981, $3982, $3984);
                        var $3983 = $3985;
                        break;
                };
                var $3980 = $3983;
                break;
        };
        return $3980;
    };
    const Kind$Constructor$build_term = x0 => x1 => Kind$Constructor$build_term$(x0, x1);

    function Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3987 = self.head;
                var $3988 = self.tail;
                var self = $3987;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3990 = self.eras;
                        var $3991 = self.name;
                        var $3992 = self.term;
                        var $3993 = Kind$Term$all$($3990, "", $3991, $3992, (_s$11 => _x$12 => {
                            var $3994 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $3988, _args$5);
                            return $3994;
                        }));
                        var $3989 = $3993;
                        break;
                };
                var $3986 = $3989;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3996 = self.head;
                        var $3997 = self.tail;
                        var self = $3996;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3999 = self.eras;
                                var $4000 = self.name;
                                var $4001 = self.term;
                                var $4002 = Kind$Term$all$($3999, "", $4000, $4001, (_s$11 => _x$12 => {
                                    var $4003 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $3997);
                                    return $4003;
                                }));
                                var $3998 = $4002;
                                break;
                        };
                        var $3995 = $3998;
                        break;
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Kind.Datatype.new':
                                var $4005 = self.pars;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Kind.Constructor.new':
                                        var $4007 = self.inds;
                                        var _type$13 = Kind$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $4010 = _type$13;
                                            var $4011 = $4005;
                                            let _type$15 = $4010;
                                            let _v$14;
                                            while ($4011._ === 'List.cons') {
                                                _v$14 = $4011.head;
                                                var $4010 = Kind$Term$app$(_type$15, Kind$Term$ref$((() => {
                                                    var self = _v$14;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4012 = self.name;
                                                            var $4013 = $4012;
                                                            return $4013;
                                                    };
                                                })()));
                                                _type$15 = $4010;
                                                $4011 = $4011.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $4015 = _type$14;
                                            var $4016 = $4007;
                                            let _type$16 = $4015;
                                            let _v$15;
                                            while ($4016._ === 'List.cons') {
                                                _v$15 = $4016.head;
                                                var $4015 = Kind$Term$app$(_type$16, (() => {
                                                    var self = _v$15;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4017 = self.term;
                                                            var $4018 = $4017;
                                                            return $4018;
                                                    };
                                                })());
                                                _type$16 = $4015;
                                                $4016 = $4016.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $4008 = _type$15;
                                        var $4006 = $4008;
                                        break;
                                };
                                var $4004 = $4006;
                                break;
                        };
                        var $3995 = $4004;
                        break;
                };
                var $3986 = $3995;
                break;
        };
        return $3986;
    };
    const Kind$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4020 = self.name;
                var $4021 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4023 = self.args;
                        var $4024 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, $4020, $4021, $4023);
                        var $4022 = $4024;
                        break;
                };
                var $4019 = $4022;
                break;
        };
        return $4019;
    };
    const Kind$Constructor$build_type = x0 => x1 => Kind$Constructor$build_type$(x0, x1);

    function Kind$Parser$file$adt$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4026 = self.idx;
                var $4027 = self.code;
                var $4028 = self.err;
                var $4029 = Parser$Reply$error$($4026, $4027, $4028);
                var $4025 = $4029;
                break;
            case 'Parser.Reply.value':
                var $4030 = self.idx;
                var $4031 = self.code;
                var $4032 = self.val;
                var self = Kind$Parser$datatype$($4030, $4031);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4034 = self.idx;
                        var $4035 = self.code;
                        var $4036 = self.err;
                        var $4037 = Parser$Reply$error$($4034, $4035, $4036);
                        var $4033 = $4037;
                        break;
                    case 'Parser.Reply.value':
                        var $4038 = self.idx;
                        var $4039 = self.code;
                        var $4040 = self.val;
                        var self = Kind$Parser$stop$($4032, $4038, $4039);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $4042 = self.idx;
                                var $4043 = self.code;
                                var $4044 = self.err;
                                var $4045 = Parser$Reply$error$($4042, $4043, $4044);
                                var $4041 = $4045;
                                break;
                            case 'Parser.Reply.value':
                                var $4046 = self.idx;
                                var $4047 = self.code;
                                var $4048 = self.val;
                                var self = $4040;
                                switch (self._) {
                                    case 'Kind.Datatype.new':
                                        var $4050 = self.name;
                                        var $4051 = self.pars;
                                        var $4052 = self.inds;
                                        var $4053 = self.ctrs;
                                        var _term$19 = Kind$Datatype$build_term$($4040);
                                        var _term$20 = Kind$Term$bind$(List$nil, (_x$20 => {
                                            var $4055 = (_x$20 + '1');
                                            return $4055;
                                        }), _term$19);
                                        var _type$21 = Kind$Datatype$build_type$($4040);
                                        var _type$22 = Kind$Term$bind$(List$nil, (_x$22 => {
                                            var $4056 = (_x$22 + '0');
                                            return $4056;
                                        }), _type$21);
                                        var _arit$23 = ((list_length($4051)) + (list_length($4052)));
                                        var _defs$24 = Kind$define$(_file$1, _code$2, $4048, $4050, _term$20, _type$22, Bool$false, _arit$23, Bool$false, _defs$3);
                                        var _defs$25 = List$fold$($4053, _defs$24, (_ctr$25 => _defs$26 => {
                                            var _typ_name$27 = $4050;
                                            var _ctr_arit$28 = (_arit$23 + (list_length((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4058 = self.args;
                                                        var $4059 = $4058;
                                                        return $4059;
                                                };
                                            })())));
                                            var _ctr_name$29 = String$flatten$(List$cons$(_typ_name$27, List$cons$(Kind$Name$read$("."), List$cons$((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4060 = self.name;
                                                        var $4061 = $4060;
                                                        return $4061;
                                                };
                                            })(), List$nil))));
                                            var _ctr_term$30 = Kind$Constructor$build_term$($4040, _ctr$25);
                                            var _ctr_term$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                var $4062 = (_x$31 + '1');
                                                return $4062;
                                            }), _ctr_term$30);
                                            var _ctr_type$32 = Kind$Constructor$build_type$($4040, _ctr$25);
                                            var _ctr_type$33 = Kind$Term$bind$(List$nil, (_x$33 => {
                                                var $4063 = (_x$33 + '0');
                                                return $4063;
                                            }), _ctr_type$32);
                                            var $4057 = Kind$define$(_file$1, _code$2, $4048, _ctr_name$29, _ctr_term$31, _ctr_type$33, Bool$true, _ctr_arit$28, Bool$false, _defs$26);
                                            return $4057;
                                        }));
                                        var $4054 = (_idx$26 => _code$27 => {
                                            var $4064 = Parser$Reply$value$(_idx$26, _code$27, _defs$25);
                                            return $4064;
                                        });
                                        var $4049 = $4054;
                                        break;
                                };
                                var $4049 = $4049($4046)($4047);
                                var $4041 = $4049;
                                break;
                        };
                        var $4033 = $4041;
                        break;
                };
                var $4025 = $4033;
                break;
        };
        return $4025;
    };
    const Kind$Parser$file$adt = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$adt$(x0, x1, x2, x3, x4);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $4066 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $4065 = $4066;
        } else {
            var $4067 = self.charCodeAt(0);
            var $4068 = self.slice(1);
            var $4069 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $4065 = $4069;
        };
        return $4065;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Kind$Parser$file$end$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$spaces(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4071 = self.idx;
                var $4072 = self.code;
                var $4073 = self.err;
                var $4074 = Parser$Reply$error$($4071, $4072, $4073);
                var $4070 = $4074;
                break;
            case 'Parser.Reply.value':
                var $4075 = self.idx;
                var $4076 = self.code;
                var self = Parser$eof$($4075, $4076);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4078 = self.idx;
                        var $4079 = self.code;
                        var $4080 = self.err;
                        var $4081 = Parser$Reply$error$($4078, $4079, $4080);
                        var $4077 = $4081;
                        break;
                    case 'Parser.Reply.value':
                        var $4082 = self.idx;
                        var $4083 = self.code;
                        var $4084 = Parser$Reply$value$($4082, $4083, _defs$3);
                        var $4077 = $4084;
                        break;
                };
                var $4070 = $4077;
                break;
        };
        return $4070;
    };
    const Kind$Parser$file$end = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$end$(x0, x1, x2, x3, x4);

    function Kind$Parser$file$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Parser$is_eof$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4086 = self.idx;
                var $4087 = self.code;
                var $4088 = self.err;
                var $4089 = Parser$Reply$error$($4086, $4087, $4088);
                var $4085 = $4089;
                break;
            case 'Parser.Reply.value':
                var $4090 = self.idx;
                var $4091 = self.code;
                var $4092 = self.val;
                var self = $4092;
                if (self) {
                    var $4094 = (_idx$9 => _code$10 => {
                        var $4095 = Parser$Reply$value$(_idx$9, _code$10, _defs$3);
                        return $4095;
                    });
                    var $4093 = $4094;
                } else {
                    var $4096 = (_idx$9 => _code$10 => {
                        var self = Parser$first_of$(List$cons$(Kind$Parser$file$def(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$adt(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$end(_file$1)(_code$2)(_defs$3), List$nil))))(_idx$9)(_code$10);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $4098 = self.idx;
                                var $4099 = self.code;
                                var $4100 = self.err;
                                var $4101 = Parser$Reply$error$($4098, $4099, $4100);
                                var $4097 = $4101;
                                break;
                            case 'Parser.Reply.value':
                                var $4102 = self.idx;
                                var $4103 = self.code;
                                var $4104 = self.val;
                                var $4105 = Kind$Parser$file$(_file$1, _code$2, $4104, $4102, $4103);
                                var $4097 = $4105;
                                break;
                        };
                        return $4097;
                    });
                    var $4093 = $4096;
                };
                var $4093 = $4093($4090)($4091);
                var $4085 = $4093;
                break;
        };
        return $4085;
    };
    const Kind$Parser$file = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$(x0, x1, x2, x3, x4);

    function Either$(_A$1, _B$2) {
        var $4106 = null;
        return $4106;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $4108 = self.head;
                var $4109 = self.tail;
                var $4110 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $4111 = "";
                        return $4111;
                    } else {
                        var $4112 = _sep$1;
                        return $4112;
                    };
                })(), List$cons$($4108, List$cons$(String$join$go$(_sep$1, $4109, Bool$false), List$nil))));
                var $4107 = $4110;
                break;
            case 'List.nil':
                var $4113 = "";
                var $4107 = $4113;
                break;
        };
        return $4107;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $4114 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $4114;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$highlight$end$(_col$1, _row$2, _res$3) {
        var $4115 = String$join$("\u{a}", _res$3);
        return $4115;
    };
    const Kind$highlight$end = x0 => x1 => x2 => Kind$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4117 = self.value;
                var $4118 = _f$5($4117);
                var $4116 = $4118;
                break;
            case 'Maybe.none':
                var $4119 = _a$4;
                var $4116 = $4119;
                break;
        };
        return $4116;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4121 = Bool$true;
            var $4120 = $4121;
        } else {
            var $4122 = (self - 1n);
            var $4123 = Bool$false;
            var $4120 = $4123;
        };
        return $4120;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4125 = Nat$zero;
            var $4124 = $4125;
        } else {
            var $4126 = (self - 1n);
            var $4127 = Nat$succ$(Nat$succ$(Nat$double$($4126)));
            var $4124 = $4127;
        };
        return $4124;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4129 = Nat$zero;
            var $4128 = $4129;
        } else {
            var $4130 = (self - 1n);
            var $4131 = $4130;
            var $4128 = $4131;
        };
        return $4128;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $4133 = _str$3;
            var $4132 = $4133;
        } else {
            var $4134 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $4136 = String$cons$(_chr$2, String$pad_right$($4134, _chr$2, ""));
                var $4135 = $4136;
            } else {
                var $4137 = self.charCodeAt(0);
                var $4138 = self.slice(1);
                var $4139 = String$cons$($4137, String$pad_right$($4134, _chr$2, $4138));
                var $4135 = $4139;
            };
            var $4132 = $4135;
        };
        return $4132;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $4140 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $4140;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $4141 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $4141;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $4142 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $4142;
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
                    var $4143 = Either$left$(_n$1);
                    return $4143;
                } else {
                    var $4144 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4146 = Either$right$(Nat$succ$($4144));
                        var $4145 = $4146;
                    } else {
                        var $4147 = (self - 1n);
                        var $4148 = Nat$sub_rem$($4147, $4144);
                        var $4145 = $4148;
                    };
                    return $4145;
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
                        var $4149 = self.value;
                        var $4150 = Nat$div_mod$go$($4149, _m$2, Nat$succ$(_d$3));
                        return $4150;
                    case 'Either.right':
                        var $4151 = Pair$new$(_d$3, _n$1);
                        return $4151;
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
                        var $4152 = self.fst;
                        var $4153 = self.snd;
                        var self = $4152;
                        if (self === 0n) {
                            var $4155 = List$cons$($4153, _res$3);
                            var $4154 = $4155;
                        } else {
                            var $4156 = (self - 1n);
                            var $4157 = Nat$to_base$go$(_base$1, $4152, List$cons$($4153, _res$3));
                            var $4154 = $4157;
                        };
                        return $4154;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $4158 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $4158;
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
                    var $4159 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $4159;
                } else {
                    var $4160 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4162 = _r$3;
                        var $4161 = $4162;
                    } else {
                        var $4163 = (self - 1n);
                        var $4164 = Nat$mod$go$($4163, $4160, Nat$succ$(_r$3));
                        var $4161 = $4164;
                    };
                    return $4161;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $4165 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $4165;
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
                case 'Maybe.some':
                    var $4168 = self.value;
                    var $4169 = $4168;
                    var $4167 = $4169;
                    break;
                case 'Maybe.none':
                    var $4170 = 35;
                    var $4167 = $4170;
                    break;
            };
            var $4166 = $4167;
        } else {
            var $4171 = 35;
            var $4166 = $4171;
        };
        return $4166;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $4172 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $4173 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $4173;
        }));
        return $4172;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $4174 = Nat$to_string_base$(10n, _n$1);
        return $4174;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Kind$color$(_col$1, _str$2) {
        var $4175 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $4175;
    };
    const Kind$color = x0 => x1 => Kind$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $4177 = self.head;
                var $4178 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $4180 = List$nil;
                    var $4179 = $4180;
                } else {
                    var $4181 = (self - 1n);
                    var $4182 = List$cons$($4177, List$take$($4181, $4178));
                    var $4179 = $4182;
                };
                var $4176 = $4179;
                break;
            case 'List.nil':
                var $4183 = List$nil;
                var $4176 = $4183;
                break;
        };
        return $4176;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Kind$highlight$tc$(_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8) {
        var Kind$highlight$tc$ = (_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8) => ({
            ctr: 'TCO',
            arg: [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8]
        });
        var Kind$highlight$tc = _code$1 => _ix0$2 => _ix1$3 => _col$4 => _row$5 => _lft$6 => _lin$7 => _res$8 => Kind$highlight$tc$(_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8);
        var arg = [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8];
        while (true) {
            let [_code$1, _ix0$2, _ix1$3, _col$4, _row$5, _lft$6, _lin$7, _res$8] = arg;
            var R = (() => {
                var _spa$9 = 3n;
                var self = _code$1;
                if (self.length === 0) {
                    var $4185 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    var $4184 = $4185;
                } else {
                    var $4186 = self.charCodeAt(0);
                    var $4187 = self.slice(1);
                    var self = ($4186 === 10);
                    if (self) {
                        var _stp$12 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$12;
                        if (self) {
                            var $4190 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $4189 = $4190;
                        } else {
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$9));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4193 = self.value;
                                        var $4194 = Maybe$some$(Nat$pred$($4193));
                                        var $4192 = $4194;
                                        break;
                                    case 'Maybe.none':
                                        var $4195 = Maybe$some$(_spa$9);
                                        var $4192 = $4195;
                                        break;
                                };
                                var _lft$14 = $4192;
                            } else {
                                var $4196 = (self - 1n);
                                var $4197 = _lft$6;
                                var _lft$14 = $4197;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$cons$(String$reverse$(_lin$7), _res$8);
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $4191 = Kind$highlight$tc$($4187, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $4189 = $4191;
                        };
                        var $4188 = $4189;
                    } else {
                        var _chr$12 = String$cons$($4186, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $4199 = String$reverse$(Kind$color$("31", Kind$color$("4", _chr$12)));
                            var _chr$13 = $4199;
                        } else {
                            var $4200 = _chr$12;
                            var _chr$13 = $4200;
                        };
                        var self = (_ix0$2 === 1n);
                        if (self) {
                            var $4201 = List$take$(_spa$9, _res$8);
                            var _res$14 = $4201;
                        } else {
                            var $4202 = _res$8;
                            var _res$14 = $4202;
                        };
                        var _ix0$15 = Nat$pred$(_ix0$2);
                        var _ix1$16 = Nat$pred$(_ix1$3);
                        var _col$17 = Nat$succ$(_col$4);
                        var _lin$18 = String$flatten$(List$cons$(_chr$13, List$cons$(_lin$7, List$nil)));
                        var $4198 = Kind$highlight$tc$($4187, _ix0$15, _ix1$16, _col$17, _row$5, _lft$6, _lin$18, _res$14);
                        var $4188 = $4198;
                    };
                    var $4184 = $4188;
                };
                return $4184;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $4203 = Kind$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $4203;
    };
    const Kind$highlight = x0 => x1 => x2 => Kind$highlight$(x0, x1, x2);

    function Kind$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Kind$Parser$file$(_file$1, _code$2, _defs$3, 0n, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4205 = self.idx;
                var $4206 = self.err;
                var _err$7 = $4206;
                var _hig$8 = Kind$highlight$(_code$2, $4205, Nat$succ$($4205));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $4207 = Either$left$(_str$9);
                var $4204 = $4207;
                break;
            case 'Parser.Reply.value':
                var $4208 = self.val;
                var $4209 = Either$right$($4208);
                var $4204 = $4209;
                break;
        };
        return $4204;
    };
    const Kind$Defs$read = x0 => x1 => x2 => Kind$Defs$read$(x0, x1, x2);

    function Kind$Synth$load$go$(_name$1, _files$2, _defs$3) {
        var self = _files$2;
        switch (self._) {
            case 'List.cons':
                var $4211 = self.head;
                var $4212 = self.tail;
                var $4213 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $4214 = _m$bind$6;
                    return $4214;
                }))(IO$get_file$($4211))((_code$6 => {
                    var _read$7 = Kind$Defs$read$($4211, _code$6, _defs$3);
                    var self = _read$7;
                    switch (self._) {
                        case 'Either.right':
                            var $4216 = self.value;
                            var _defs$9 = $4216;
                            var self = Kind$get$(_name$1, _defs$9);
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4218 = Kind$Synth$load$go$(_name$1, $4212, _defs$9);
                                    var $4217 = $4218;
                                    break;
                                case 'Maybe.some':
                                    var $4219 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                        var $4220 = _m$pure$12;
                                        return $4220;
                                    }))(Maybe$some$(_defs$9));
                                    var $4217 = $4219;
                                    break;
                            };
                            var $4215 = $4217;
                            break;
                        case 'Either.left':
                            var $4221 = Kind$Synth$load$go$(_name$1, $4212, _defs$3);
                            var $4215 = $4221;
                            break;
                    };
                    return $4215;
                }));
                var $4210 = $4213;
                break;
            case 'List.nil':
                var $4222 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4223 = _m$pure$5;
                    return $4223;
                }))(Maybe$none);
                var $4210 = $4222;
                break;
        };
        return $4210;
    };
    const Kind$Synth$load$go = x0 => x1 => x2 => Kind$Synth$load$go$(x0, x1, x2);

    function Kind$Synth$files_of$make$(_names$1, _last$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $4225 = self.head;
                var $4226 = self.tail;
                var _head$5 = (_last$2 + ($4225 + ".kind"));
                var _tail$6 = Kind$Synth$files_of$make$($4226, (_last$2 + ($4225 + "/")));
                var $4227 = List$cons$(_head$5, _tail$6);
                var $4224 = $4227;
                break;
            case 'List.nil':
                var $4228 = List$nil;
                var $4224 = $4228;
                break;
        };
        return $4224;
    };
    const Kind$Synth$files_of$make = x0 => x1 => Kind$Synth$files_of$make$(x0, x1);

    function Char$eql$(_a$1, _b$2) {
        var $4229 = (_a$1 === _b$2);
        return $4229;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $4230 = Bool$true;
                    return $4230;
                } else {
                    var $4231 = self.charCodeAt(0);
                    var $4232 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $4234 = Bool$false;
                        var $4233 = $4234;
                    } else {
                        var $4235 = self.charCodeAt(0);
                        var $4236 = self.slice(1);
                        var self = Char$eql$($4231, $4235);
                        if (self) {
                            var $4238 = String$starts_with$($4236, $4232);
                            var $4237 = $4238;
                        } else {
                            var $4239 = Bool$false;
                            var $4237 = $4239;
                        };
                        var $4233 = $4237;
                    };
                    return $4233;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $4240 = _xs$2;
                    return $4240;
                } else {
                    var $4241 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $4243 = String$nil;
                        var $4242 = $4243;
                    } else {
                        var $4244 = self.charCodeAt(0);
                        var $4245 = self.slice(1);
                        var $4246 = String$drop$($4241, $4245);
                        var $4242 = $4246;
                    };
                    return $4242;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function String$length$go$(_xs$1, _n$2) {
        var String$length$go$ = (_xs$1, _n$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _n$2]
        });
        var String$length$go = _xs$1 => _n$2 => String$length$go$(_xs$1, _n$2);
        var arg = [_xs$1, _n$2];
        while (true) {
            let [_xs$1, _n$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $4247 = _n$2;
                    return $4247;
                } else {
                    var $4248 = self.charCodeAt(0);
                    var $4249 = self.slice(1);
                    var $4250 = String$length$go$($4249, Nat$succ$(_n$2));
                    return $4250;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $4251 = String$length$go$(_xs$1, 0n);
        return $4251;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $4253 = List$cons$(_last$3, List$nil);
            var $4252 = $4253;
        } else {
            var $4254 = self.charCodeAt(0);
            var $4255 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $4257 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $4256 = $4257;
            } else {
                var _next$6 = String$cons$($4254, String$nil);
                var $4258 = String$split$go$($4255, _match$2, (_last$3 + _next$6));
                var $4256 = $4258;
            };
            var $4252 = $4256;
        };
        return $4252;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $4259 = String$split$go$(_xs$1, _match$2, "");
        return $4259;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Kind$Synth$files_of$(_name$1) {
        var $4260 = List$reverse$(Kind$Synth$files_of$make$(String$split$(_name$1, "."), ""));
        return $4260;
    };
    const Kind$Synth$files_of = x0 => Kind$Synth$files_of$(x0);

    function Kind$Synth$load$(_name$1, _defs$2) {
        var $4261 = Kind$Synth$load$go$(_name$1, Kind$Synth$files_of$(_name$1), _defs$2);
        return $4261;
    };
    const Kind$Synth$load = x0 => x1 => Kind$Synth$load$(x0, x1);
    const Kind$Status$wait = ({
        _: 'Kind.Status.wait'
    });

    function Kind$Check$(_V$1) {
        var $4262 = null;
        return $4262;
    };
    const Kind$Check = x0 => Kind$Check$(x0);

    function Kind$Check$result$(_value$2, _errors$3) {
        var $4263 = ({
            _: 'Kind.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $4263;
    };
    const Kind$Check$result = x0 => x1 => Kind$Check$result$(x0, x1);

    function Kind$Error$undefined_reference$(_origin$1, _name$2) {
        var $4264 = ({
            _: 'Kind.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $4264;
    };
    const Kind$Error$undefined_reference = x0 => x1 => Kind$Error$undefined_reference$(x0, x1);

    function Kind$Error$waiting$(_name$1) {
        var $4265 = ({
            _: 'Kind.Error.waiting',
            'name': _name$1
        });
        return $4265;
    };
    const Kind$Error$waiting = x0 => Kind$Error$waiting$(x0);

    function Kind$Error$indirect$(_name$1) {
        var $4266 = ({
            _: 'Kind.Error.indirect',
            'name': _name$1
        });
        return $4266;
    };
    const Kind$Error$indirect = x0 => Kind$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4268 = self.value;
                var $4269 = Maybe$some$(_f$4($4268));
                var $4267 = $4269;
                break;
            case 'Maybe.none':
                var $4270 = Maybe$none;
                var $4267 = $4270;
                break;
        };
        return $4267;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Kind$MPath$o$(_path$1) {
        var $4271 = Maybe$mapped$(_path$1, Kind$Path$o);
        return $4271;
    };
    const Kind$MPath$o = x0 => Kind$MPath$o$(x0);

    function Kind$MPath$i$(_path$1) {
        var $4272 = Maybe$mapped$(_path$1, Kind$Path$i);
        return $4272;
    };
    const Kind$MPath$i = x0 => Kind$MPath$i$(x0);

    function Kind$Error$patch$(_path$1, _term$2) {
        var $4273 = ({
            _: 'Kind.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $4273;
    };
    const Kind$Error$patch = x0 => x1 => Kind$Error$patch$(x0, x1);

    function Kind$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.some':
                var $4275 = self.value;
                var $4276 = $4275(Bits$e);
                var $4274 = $4276;
                break;
            case 'Maybe.none':
                var $4277 = Bits$e;
                var $4274 = $4277;
                break;
        };
        return $4274;
    };
    const Kind$MPath$to_bits = x0 => Kind$MPath$to_bits$(x0);

    function Kind$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $4278 = ({
            _: 'Kind.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $4278;
    };
    const Kind$Error$type_mismatch = x0 => x1 => x2 => x3 => Kind$Error$type_mismatch$(x0, x1, x2, x3);

    function Kind$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $4279 = ({
            _: 'Kind.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $4279;
    };
    const Kind$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Kind$Error$show_goal$(x0, x1, x2, x3, x4);

    function Kind$Term$normalize$(_term$1, _defs$2) {
        var self = Kind$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $4281 = self.name;
                var $4282 = self.indx;
                var $4283 = Kind$Term$var$($4281, $4282);
                var $4280 = $4283;
                break;
            case 'Kind.Term.ref':
                var $4284 = self.name;
                var $4285 = Kind$Term$ref$($4284);
                var $4280 = $4285;
                break;
            case 'Kind.Term.all':
                var $4286 = self.eras;
                var $4287 = self.self;
                var $4288 = self.name;
                var $4289 = self.xtyp;
                var $4290 = self.body;
                var $4291 = Kind$Term$all$($4286, $4287, $4288, Kind$Term$normalize$($4289, _defs$2), (_s$8 => _x$9 => {
                    var $4292 = Kind$Term$normalize$($4290(_s$8)(_x$9), _defs$2);
                    return $4292;
                }));
                var $4280 = $4291;
                break;
            case 'Kind.Term.lam':
                var $4293 = self.name;
                var $4294 = self.body;
                var $4295 = Kind$Term$lam$($4293, (_x$5 => {
                    var $4296 = Kind$Term$normalize$($4294(_x$5), _defs$2);
                    return $4296;
                }));
                var $4280 = $4295;
                break;
            case 'Kind.Term.app':
                var $4297 = self.func;
                var $4298 = self.argm;
                var $4299 = Kind$Term$app$(Kind$Term$normalize$($4297, _defs$2), Kind$Term$normalize$($4298, _defs$2));
                var $4280 = $4299;
                break;
            case 'Kind.Term.let':
                var $4300 = self.name;
                var $4301 = self.expr;
                var $4302 = self.body;
                var $4303 = Kind$Term$let$($4300, Kind$Term$normalize$($4301, _defs$2), (_x$6 => {
                    var $4304 = Kind$Term$normalize$($4302(_x$6), _defs$2);
                    return $4304;
                }));
                var $4280 = $4303;
                break;
            case 'Kind.Term.def':
                var $4305 = self.name;
                var $4306 = self.expr;
                var $4307 = self.body;
                var $4308 = Kind$Term$def$($4305, Kind$Term$normalize$($4306, _defs$2), (_x$6 => {
                    var $4309 = Kind$Term$normalize$($4307(_x$6), _defs$2);
                    return $4309;
                }));
                var $4280 = $4308;
                break;
            case 'Kind.Term.ann':
                var $4310 = self.done;
                var $4311 = self.term;
                var $4312 = self.type;
                var $4313 = Kind$Term$ann$($4310, Kind$Term$normalize$($4311, _defs$2), Kind$Term$normalize$($4312, _defs$2));
                var $4280 = $4313;
                break;
            case 'Kind.Term.gol':
                var $4314 = self.name;
                var $4315 = self.dref;
                var $4316 = self.verb;
                var $4317 = Kind$Term$gol$($4314, $4315, $4316);
                var $4280 = $4317;
                break;
            case 'Kind.Term.hol':
                var $4318 = self.path;
                var $4319 = Kind$Term$hol$($4318);
                var $4280 = $4319;
                break;
            case 'Kind.Term.nat':
                var $4320 = self.natx;
                var $4321 = Kind$Term$nat$($4320);
                var $4280 = $4321;
                break;
            case 'Kind.Term.chr':
                var $4322 = self.chrx;
                var $4323 = Kind$Term$chr$($4322);
                var $4280 = $4323;
                break;
            case 'Kind.Term.str':
                var $4324 = self.strx;
                var $4325 = Kind$Term$str$($4324);
                var $4280 = $4325;
                break;
            case 'Kind.Term.ori':
                var $4326 = self.expr;
                var $4327 = Kind$Term$normalize$($4326, _defs$2);
                var $4280 = $4327;
                break;
            case 'Kind.Term.typ':
                var $4328 = Kind$Term$typ;
                var $4280 = $4328;
                break;
            case 'Kind.Term.cse':
                var $4329 = _term$1;
                var $4280 = $4329;
                break;
        };
        return $4280;
    };
    const Kind$Term$normalize = x0 => x1 => Kind$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $4331 = self.tail;
                var $4332 = $4331;
                var $4330 = $4332;
                break;
            case 'List.nil':
                var $4333 = List$nil;
                var $4330 = $4333;
                break;
        };
        return $4330;
    };
    const List$tail = x0 => List$tail$(x0);

    function Kind$SmartMotive$vals$cont$(_expr$1, _term$2, _args$3, _defs$4) {
        var Kind$SmartMotive$vals$cont$ = (_expr$1, _term$2, _args$3, _defs$4) => ({
            ctr: 'TCO',
            arg: [_expr$1, _term$2, _args$3, _defs$4]
        });
        var Kind$SmartMotive$vals$cont = _expr$1 => _term$2 => _args$3 => _defs$4 => Kind$SmartMotive$vals$cont$(_expr$1, _term$2, _args$3, _defs$4);
        var arg = [_expr$1, _term$2, _args$3, _defs$4];
        while (true) {
            let [_expr$1, _term$2, _args$3, _defs$4] = arg;
            var R = (() => {
                var self = Kind$Term$reduce$(_term$2, _defs$4);
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4334 = self.func;
                        var $4335 = self.argm;
                        var $4336 = Kind$SmartMotive$vals$cont$(_expr$1, $4334, List$cons$($4335, _args$3), _defs$4);
                        return $4336;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $4337 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $4337;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$SmartMotive$vals$cont = x0 => x1 => x2 => x3 => Kind$SmartMotive$vals$cont$(x0, x1, x2, x3);

    function Kind$SmartMotive$vals$(_expr$1, _type$2, _defs$3) {
        var Kind$SmartMotive$vals$ = (_expr$1, _type$2, _defs$3) => ({
            ctr: 'TCO',
            arg: [_expr$1, _type$2, _defs$3]
        });
        var Kind$SmartMotive$vals = _expr$1 => _type$2 => _defs$3 => Kind$SmartMotive$vals$(_expr$1, _type$2, _defs$3);
        var arg = [_expr$1, _type$2, _defs$3];
        while (true) {
            let [_expr$1, _type$2, _defs$3] = arg;
            var R = (() => {
                var self = Kind$Term$reduce$(_type$2, _defs$3);
                switch (self._) {
                    case 'Kind.Term.all':
                        var $4338 = self.body;
                        var $4339 = Kind$SmartMotive$vals$(_expr$1, $4338(Kind$Term$typ)(Kind$Term$typ), _defs$3);
                        return $4339;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $4340 = Kind$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $4340;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$SmartMotive$vals = x0 => x1 => x2 => Kind$SmartMotive$vals$(x0, x1, x2);

    function Kind$SmartMotive$nams$cont$(_name$1, _term$2, _binds$3, _defs$4) {
        var Kind$SmartMotive$nams$cont$ = (_name$1, _term$2, _binds$3, _defs$4) => ({
            ctr: 'TCO',
            arg: [_name$1, _term$2, _binds$3, _defs$4]
        });
        var Kind$SmartMotive$nams$cont = _name$1 => _term$2 => _binds$3 => _defs$4 => Kind$SmartMotive$nams$cont$(_name$1, _term$2, _binds$3, _defs$4);
        var arg = [_name$1, _term$2, _binds$3, _defs$4];
        while (true) {
            let [_name$1, _term$2, _binds$3, _defs$4] = arg;
            var R = (() => {
                var self = Kind$Term$reduce$(_term$2, _defs$4);
                switch (self._) {
                    case 'Kind.Term.all':
                        var $4341 = self.self;
                        var $4342 = self.name;
                        var $4343 = self.body;
                        var $4344 = Kind$SmartMotive$nams$cont$(_name$1, $4343(Kind$Term$ref$($4341))(Kind$Term$ref$($4342)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4342, List$nil)))), _binds$3), _defs$4);
                        return $4344;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $4345 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $4345;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$SmartMotive$nams$cont = x0 => x1 => x2 => x3 => Kind$SmartMotive$nams$cont$(x0, x1, x2, x3);

    function Kind$SmartMotive$nams$(_name$1, _type$2, _defs$3) {
        var self = Kind$Term$reduce$(_type$2, _defs$3);
        switch (self._) {
            case 'Kind.Term.all':
                var $4347 = self.xtyp;
                var $4348 = Kind$SmartMotive$nams$cont$(_name$1, $4347, List$nil, _defs$3);
                var $4346 = $4348;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
            case 'Kind.Term.ori':
                var $4349 = List$nil;
                var $4346 = $4349;
                break;
        };
        return $4346;
    };
    const Kind$SmartMotive$nams = x0 => x1 => x2 => Kind$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $4351 = self.head;
                var $4352 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $4354 = self.head;
                        var $4355 = self.tail;
                        var $4356 = List$cons$(Pair$new$($4351, $4354), List$zip$($4352, $4355));
                        var $4353 = $4356;
                        break;
                    case 'List.nil':
                        var $4357 = List$nil;
                        var $4353 = $4357;
                        break;
                };
                var $4350 = $4353;
                break;
            case 'List.nil':
                var $4358 = List$nil;
                var $4350 = $4358;
                break;
        };
        return $4350;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Kind$Term$serialize$name$(_name$1) {
        var $4359 = (kind_name_to_bits(_name$1));
        return $4359;
    };
    const Kind$Term$serialize$name = x0 => Kind$Term$serialize$name$(x0);

    function Kind$Term$serialize$(_term$1, _depth$2, _init$3, _diff$4, _x$5) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4361 = self.indx;
                var self = ($4361 >= _init$3);
                if (self) {
                    var _name$8 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $4361 <= 0n ? 0n : _depth$2 - $4361)))));
                    var $4363 = (((_name$8(_x$5) + '1') + '0') + '0');
                    var $4362 = $4363;
                } else {
                    var _name$8 = a1 => (a1 + (nat_to_bits($4361)));
                    var $4364 = (((_name$8(_x$5) + '0') + '1') + '0');
                    var $4362 = $4364;
                };
                var $4360 = $4362;
                break;
            case 'Kind.Term.ref':
                var $4365 = self.name;
                var _name$7 = a1 => (a1 + Kind$Term$serialize$name$($4365));
                var $4366 = (((_name$7(_x$5) + '0') + '0') + '0');
                var $4360 = $4366;
                break;
            case 'Kind.Term.all':
                var $4367 = self.eras;
                var $4368 = self.self;
                var $4369 = self.name;
                var $4370 = self.xtyp;
                var $4371 = self.body;
                var self = $4367;
                if (self) {
                    var $4373 = Bits$i;
                    var _eras$11 = $4373;
                } else {
                    var $4374 = Bits$o;
                    var _eras$11 = $4374;
                };
                var _self$12 = a1 => (a1 + (kind_name_to_bits($4368)));
                var _xtyp$13 = Kind$Term$serialize($4370)(_depth$2)(_init$3)(_diff$4);
                var _body$14 = Kind$Term$serialize($4371(Kind$Term$var$($4368, _depth$2))(Kind$Term$var$($4369, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3)(_diff$4);
                var $4372 = (((_eras$11(_self$12(_xtyp$13(_body$14(_x$5)))) + '0') + '0') + '1');
                var $4360 = $4372;
                break;
            case 'Kind.Term.lam':
                var $4375 = self.name;
                var $4376 = self.body;
                var _body$8 = Kind$Term$serialize($4376(Kind$Term$var$($4375, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4377 = (((_body$8(_x$5) + '1') + '0') + '1');
                var $4360 = $4377;
                break;
            case 'Kind.Term.app':
                var $4378 = self.func;
                var $4379 = self.argm;
                var _func$8 = Kind$Term$serialize($4378)(_depth$2)(_init$3)(_diff$4);
                var _argm$9 = Kind$Term$serialize($4379)(_depth$2)(_init$3)(_diff$4);
                var $4380 = (((_func$8(_argm$9(_x$5)) + '0') + '1') + '1');
                var $4360 = $4380;
                break;
            case 'Kind.Term.let':
                var $4381 = self.name;
                var $4382 = self.expr;
                var $4383 = self.body;
                var _expr$9 = Kind$Term$serialize($4382)(_depth$2)(_init$3)(_diff$4);
                var _body$10 = Kind$Term$serialize($4383(Kind$Term$var$($4381, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4384 = (((_expr$9(_body$10(_x$5)) + '1') + '1') + '1');
                var $4360 = $4384;
                break;
            case 'Kind.Term.def':
                var $4385 = self.expr;
                var $4386 = self.body;
                var $4387 = Kind$Term$serialize$($4386($4385), _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4387;
                break;
            case 'Kind.Term.ann':
                var $4388 = self.term;
                var $4389 = Kind$Term$serialize$($4388, _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4389;
                break;
            case 'Kind.Term.gol':
                var $4390 = self.name;
                var _name$9 = a1 => (a1 + (kind_name_to_bits($4390)));
                var $4391 = (((_name$9(_x$5) + '0') + '0') + '0');
                var $4360 = $4391;
                break;
            case 'Kind.Term.nat':
                var $4392 = self.natx;
                var $4393 = Kind$Term$serialize$(Kind$Term$unroll_nat$($4392), _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4393;
                break;
            case 'Kind.Term.chr':
                var $4394 = self.chrx;
                var $4395 = Kind$Term$serialize$(Kind$Term$unroll_chr$($4394), _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4395;
                break;
            case 'Kind.Term.str':
                var $4396 = self.strx;
                var $4397 = Kind$Term$serialize$(Kind$Term$unroll_str$($4396), _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4397;
                break;
            case 'Kind.Term.ori':
                var $4398 = self.expr;
                var $4399 = Kind$Term$serialize$($4398, _depth$2, _init$3, _diff$4, _x$5);
                var $4360 = $4399;
                break;
            case 'Kind.Term.typ':
                var $4400 = (((_x$5 + '1') + '1') + '0');
                var $4360 = $4400;
                break;
            case 'Kind.Term.hol':
                var $4401 = _x$5;
                var $4360 = $4401;
                break;
            case 'Kind.Term.cse':
                var $4402 = _diff$4(_x$5);
                var $4360 = $4402;
                break;
        };
        return $4360;
    };
    const Kind$Term$serialize = x0 => x1 => x2 => x3 => x4 => Kind$Term$serialize$(x0, x1, x2, x3, x4);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kind$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Kind$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$o, Bits$e);
        var _bh$5 = Kind$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$i, Bits$e);
        var $4403 = (_bh$5 === _ah$4);
        return $4403;
    };
    const Kind$Term$identical = x0 => x1 => x2 => Kind$Term$identical$(x0, x1, x2);

    function Kind$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Kind$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $4405 = _to$3;
            var $4404 = $4405;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Kind.Term.var':
                    var $4407 = self.name;
                    var $4408 = self.indx;
                    var $4409 = Kind$Term$var$($4407, $4408);
                    var $4406 = $4409;
                    break;
                case 'Kind.Term.ref':
                    var $4410 = self.name;
                    var $4411 = Kind$Term$ref$($4410);
                    var $4406 = $4411;
                    break;
                case 'Kind.Term.all':
                    var $4412 = self.eras;
                    var $4413 = self.self;
                    var $4414 = self.name;
                    var $4415 = self.xtyp;
                    var $4416 = self.body;
                    var _xtyp$10 = Kind$SmartMotive$replace$($4415, _from$2, _to$3, _lv$4);
                    var _body$11 = $4416(Kind$Term$ref$($4413))(Kind$Term$ref$($4414));
                    var _body$12 = Kind$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $4417 = Kind$Term$all$($4412, $4413, $4414, _xtyp$10, (_s$13 => _x$14 => {
                        var $4418 = _body$12;
                        return $4418;
                    }));
                    var $4406 = $4417;
                    break;
                case 'Kind.Term.lam':
                    var $4419 = self.name;
                    var $4420 = self.body;
                    var _body$7 = $4420(Kind$Term$ref$($4419));
                    var _body$8 = Kind$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4421 = Kind$Term$lam$($4419, (_x$9 => {
                        var $4422 = _body$8;
                        return $4422;
                    }));
                    var $4406 = $4421;
                    break;
                case 'Kind.Term.app':
                    var $4423 = self.func;
                    var $4424 = self.argm;
                    var _func$7 = Kind$SmartMotive$replace$($4423, _from$2, _to$3, _lv$4);
                    var _argm$8 = Kind$SmartMotive$replace$($4424, _from$2, _to$3, _lv$4);
                    var $4425 = Kind$Term$app$(_func$7, _argm$8);
                    var $4406 = $4425;
                    break;
                case 'Kind.Term.let':
                    var $4426 = self.name;
                    var $4427 = self.expr;
                    var $4428 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4427, _from$2, _to$3, _lv$4);
                    var _body$9 = $4428(Kind$Term$ref$($4426));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4429 = Kind$Term$let$($4426, _expr$8, (_x$11 => {
                        var $4430 = _body$10;
                        return $4430;
                    }));
                    var $4406 = $4429;
                    break;
                case 'Kind.Term.def':
                    var $4431 = self.name;
                    var $4432 = self.expr;
                    var $4433 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4432, _from$2, _to$3, _lv$4);
                    var _body$9 = $4433(Kind$Term$ref$($4431));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4434 = Kind$Term$def$($4431, _expr$8, (_x$11 => {
                        var $4435 = _body$10;
                        return $4435;
                    }));
                    var $4406 = $4434;
                    break;
                case 'Kind.Term.ann':
                    var $4436 = self.done;
                    var $4437 = self.term;
                    var $4438 = self.type;
                    var _term$8 = Kind$SmartMotive$replace$($4437, _from$2, _to$3, _lv$4);
                    var _type$9 = Kind$SmartMotive$replace$($4438, _from$2, _to$3, _lv$4);
                    var $4439 = Kind$Term$ann$($4436, _term$8, _type$9);
                    var $4406 = $4439;
                    break;
                case 'Kind.Term.ori':
                    var $4440 = self.expr;
                    var $4441 = Kind$SmartMotive$replace$($4440, _from$2, _to$3, _lv$4);
                    var $4406 = $4441;
                    break;
                case 'Kind.Term.typ':
                    var $4442 = Kind$Term$typ;
                    var $4406 = $4442;
                    break;
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                    var $4443 = _term$1;
                    var $4406 = $4443;
                    break;
            };
            var $4404 = $4406;
        };
        return $4404;
    };
    const Kind$SmartMotive$replace = x0 => x1 => x2 => x3 => Kind$SmartMotive$replace$(x0, x1, x2, x3);

    function Kind$SmartMotive$make$(_name$1, _expr$2, _type$3, _moti$4, _lv$5, _defs$6) {
        var _vals$7 = Kind$SmartMotive$vals$(_expr$2, _type$3, _defs$6);
        var _nams$8 = Kind$SmartMotive$nams$(_name$1, _type$3, _defs$6);
        var _subs$9 = List$zip$(_nams$8, _vals$7);
        var _moti$10 = List$fold$(_subs$9, _moti$4, (_sub$10 => _moti$11 => {
            var self = _sub$10;
            switch (self._) {
                case 'Pair.new':
                    var $4446 = self.fst;
                    var $4447 = self.snd;
                    var $4448 = Kind$SmartMotive$replace$(_moti$11, $4447, Kind$Term$ref$($4446), _lv$5);
                    var $4445 = $4448;
                    break;
            };
            return $4445;
        }));
        var $4444 = _moti$10;
        return $4444;
    };
    const Kind$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Kind$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Kind$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.cons':
                var $4450 = self.head;
                var $4451 = self.tail;
                var self = $4450;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $4453 = self.name;
                        var $4454 = self.type;
                        var $4455 = Kind$Term$all$(Bool$false, "", $4453, $4454, (_s$14 => _x$15 => {
                            var $4456 = Kind$Term$desugar_cse$motive$($4451, _moti$2);
                            return $4456;
                        }));
                        var $4452 = $4455;
                        break;
                };
                var $4449 = $4452;
                break;
            case 'List.nil':
                var $4457 = _moti$2;
                var $4449 = $4457;
                break;
        };
        return $4449;
    };
    const Kind$Term$desugar_cse$motive = x0 => x1 => Kind$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4459 = Bool$true;
            var $4458 = $4459;
        } else {
            var $4460 = self.charCodeAt(0);
            var $4461 = self.slice(1);
            var $4462 = Bool$false;
            var $4458 = $4462;
        };
        return $4458;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Kind$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Kind.Term.all':
                var $4464 = self.self;
                var $4465 = self.name;
                var $4466 = self.body;
                var $4467 = Kind$Term$lam$((() => {
                    var self = String$is_empty$($4465);
                    if (self) {
                        var $4468 = _name$1;
                        return $4468;
                    } else {
                        var $4469 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4465, List$nil))));
                        return $4469;
                    };
                })(), (_x$11 => {
                    var $4470 = Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, $4466(Kind$Term$var$($4464, 0n))(Kind$Term$var$($4465, 0n)), _body$4, _defs$5);
                    return $4470;
                }));
                var $4463 = $4467;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.ori':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4472 = self.head;
                        var $4473 = self.tail;
                        var self = $4472;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4475 = self.name;
                                var $4476 = Kind$Term$lam$($4475, (_x$19 => {
                                    var $4477 = Kind$Term$desugar_cse$argument$(_name$1, $4473, _type$3, _body$4, _defs$5);
                                    return $4477;
                                }));
                                var $4474 = $4476;
                                break;
                        };
                        var $4471 = $4474;
                        break;
                    case 'List.nil':
                        var $4478 = _body$4;
                        var $4471 = $4478;
                        break;
                };
                var $4463 = $4471;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4480 = self.head;
                        var $4481 = self.tail;
                        var self = $4480;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4483 = self.name;
                                var $4484 = Kind$Term$lam$($4483, (_x$18 => {
                                    var $4485 = Kind$Term$desugar_cse$argument$(_name$1, $4481, _type$3, _body$4, _defs$5);
                                    return $4485;
                                }));
                                var $4482 = $4484;
                                break;
                        };
                        var $4479 = $4482;
                        break;
                    case 'List.nil':
                        var $4486 = _body$4;
                        var $4479 = $4486;
                        break;
                };
                var $4463 = $4479;
                break;
            case 'Kind.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4488 = self.head;
                        var $4489 = self.tail;
                        var self = $4488;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4491 = self.name;
                                var $4492 = Kind$Term$lam$($4491, (_x$17 => {
                                    var $4493 = Kind$Term$desugar_cse$argument$(_name$1, $4489, _type$3, _body$4, _defs$5);
                                    return $4493;
                                }));
                                var $4490 = $4492;
                                break;
                        };
                        var $4487 = $4490;
                        break;
                    case 'List.nil':
                        var $4494 = _body$4;
                        var $4487 = $4494;
                        break;
                };
                var $4463 = $4487;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4496 = self.head;
                        var $4497 = self.tail;
                        var self = $4496;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4499 = self.name;
                                var $4500 = Kind$Term$lam$($4499, (_x$20 => {
                                    var $4501 = Kind$Term$desugar_cse$argument$(_name$1, $4497, _type$3, _body$4, _defs$5);
                                    return $4501;
                                }));
                                var $4498 = $4500;
                                break;
                        };
                        var $4495 = $4498;
                        break;
                    case 'List.nil':
                        var $4502 = _body$4;
                        var $4495 = $4502;
                        break;
                };
                var $4463 = $4495;
                break;
            case 'Kind.Term.cse':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4504 = self.head;
                        var $4505 = self.tail;
                        var self = $4504;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4507 = self.name;
                                var $4508 = Kind$Term$lam$($4507, (_x$23 => {
                                    var $4509 = Kind$Term$desugar_cse$argument$(_name$1, $4505, _type$3, _body$4, _defs$5);
                                    return $4509;
                                }));
                                var $4506 = $4508;
                                break;
                        };
                        var $4503 = $4506;
                        break;
                    case 'List.nil':
                        var $4510 = _body$4;
                        var $4503 = $4510;
                        break;
                };
                var $4463 = $4503;
                break;
        };
        return $4463;
    };
    const Kind$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Kind$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $4512 = self.value;
                var $4513 = Maybe$some$($4512);
                var $4511 = $4513;
                break;
            case 'Maybe.none':
                var $4514 = _b$3;
                var $4511 = $4514;
                break;
        };
        return $4511;
    };
    const Maybe$or = x0 => x1 => Maybe$or$(x0, x1);

    function Kind$Term$desugar_cse$cases$(_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7) {
        var Kind$Term$desugar_cse$cases$ = (_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7) => ({
            ctr: 'TCO',
            arg: [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7]
        });
        var Kind$Term$desugar_cse$cases = _expr$1 => _name$2 => _wyth$3 => _cses$4 => _type$5 => _defs$6 => _ctxt$7 => Kind$Term$desugar_cse$cases$(_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7);
        var arg = [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7];
        while (true) {
            let [_expr$1, _name$2, _wyth$3, _cses$4, _type$5, _defs$6, _ctxt$7] = arg;
            var R = (() => {
                var self = Kind$Term$reduce$(_type$5, _defs$6);
                switch (self._) {
                    case 'Kind.Term.all':
                        var $4515 = self.self;
                        var $4516 = self.name;
                        var $4517 = self.xtyp;
                        var $4518 = self.body;
                        var _got$13 = Maybe$or$(Kind$get$($4516, _cses$4), Kind$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4520 = self.value;
                                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, _wyth$3, $4517, $4520, _defs$6);
                                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $4518(Kind$Term$var$($4515, 0n))(Kind$Term$var$($4516, 0n));
                                var $4521 = Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $4519 = $4521;
                                break;
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $4524 = _expr$1;
                                    var $4525 = _wyth$3;
                                    let _expr$15 = $4524;
                                    let _defn$14;
                                    while ($4525._ === 'List.cons') {
                                        _defn$14 = $4525.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Kind.Def.new':
                                                var $4526 = self.term;
                                                var $4527 = Kind$Term$app$(_expr$15, $4526);
                                                var $4524 = $4527;
                                                break;
                                        };
                                        _expr$15 = $4524;
                                        $4525 = $4525.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $4522 = _expr$14;
                                var $4519 = $4522;
                                break;
                        };
                        return $4519;
                    case 'Kind.Term.var':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.ori':
                        var _expr$10 = (() => {
                            var $4530 = _expr$1;
                            var $4531 = _wyth$3;
                            let _expr$11 = $4530;
                            let _defn$10;
                            while ($4531._ === 'List.cons') {
                                _defn$10 = $4531.head;
                                var $4530 = Kind$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4532 = self.term;
                                            var $4533 = $4532;
                                            return $4533;
                                    };
                                })());
                                _expr$11 = $4530;
                                $4531 = $4531.tail;
                            }
                            return _expr$11;
                        })();
                        var $4528 = _expr$10;
                        return $4528;
                    case 'Kind.Term.ref':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                        var _expr$9 = (() => {
                            var $4536 = _expr$1;
                            var $4537 = _wyth$3;
                            let _expr$10 = $4536;
                            let _defn$9;
                            while ($4537._ === 'List.cons') {
                                _defn$9 = $4537.head;
                                var $4536 = Kind$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4538 = self.term;
                                            var $4539 = $4538;
                                            return $4539;
                                    };
                                })());
                                _expr$10 = $4536;
                                $4537 = $4537.tail;
                            }
                            return _expr$10;
                        })();
                        var $4534 = _expr$9;
                        return $4534;
                    case 'Kind.Term.typ':
                        var _expr$8 = (() => {
                            var $4542 = _expr$1;
                            var $4543 = _wyth$3;
                            let _expr$9 = $4542;
                            let _defn$8;
                            while ($4543._ === 'List.cons') {
                                _defn$8 = $4543.head;
                                var $4542 = Kind$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4544 = self.term;
                                            var $4545 = $4544;
                                            return $4545;
                                    };
                                })());
                                _expr$9 = $4542;
                                $4543 = $4543.tail;
                            }
                            return _expr$9;
                        })();
                        var $4540 = _expr$8;
                        return $4540;
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                        var _expr$11 = (() => {
                            var $4548 = _expr$1;
                            var $4549 = _wyth$3;
                            let _expr$12 = $4548;
                            let _defn$11;
                            while ($4549._ === 'List.cons') {
                                _defn$11 = $4549.head;
                                var $4548 = Kind$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4550 = self.term;
                                            var $4551 = $4550;
                                            return $4551;
                                    };
                                })());
                                _expr$12 = $4548;
                                $4549 = $4549.tail;
                            }
                            return _expr$12;
                        })();
                        var $4546 = _expr$11;
                        return $4546;
                    case 'Kind.Term.cse':
                        var _expr$14 = (() => {
                            var $4554 = _expr$1;
                            var $4555 = _wyth$3;
                            let _expr$15 = $4554;
                            let _defn$14;
                            while ($4555._ === 'List.cons') {
                                _defn$14 = $4555.head;
                                var $4554 = Kind$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4556 = self.term;
                                            var $4557 = $4556;
                                            return $4557;
                                    };
                                })());
                                _expr$15 = $4554;
                                $4555 = $4555.tail;
                            }
                            return _expr$15;
                        })();
                        var $4552 = _expr$14;
                        return $4552;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Term$desugar_cse$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Kind$Term$desugar_cse$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Kind$Term$desugar_cse$(_expr$1, _name$2, _wyth$3, _cses$4, _moti$5, _type$6, _defs$7, _ctxt$8) {
        var self = Kind$Term$reduce$(_type$6, _defs$7);
        switch (self._) {
            case 'Kind.Term.all':
                var $4559 = self.self;
                var $4560 = self.name;
                var $4561 = self.xtyp;
                var $4562 = self.body;
                var _moti$14 = Kind$Term$desugar_cse$motive$(_wyth$3, _moti$5);
                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, List$nil, $4561, _moti$14, _defs$7);
                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                var _type$17 = $4562(Kind$Term$var$($4559, 0n))(Kind$Term$var$($4560, 0n));
                var $4563 = Maybe$some$(Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $4558 = $4563;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
            case 'Kind.Term.ori':
                var $4564 = Maybe$none;
                var $4558 = $4564;
                break;
        };
        return $4558;
    };
    const Kind$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $4565 = ({
            _: 'Kind.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $4565;
    };
    const Kind$Error$cant_infer = x0 => x1 => x2 => Kind$Error$cant_infer$(x0, x1, x2);

    function BitsSet$has$(_bits$1, _set$2) {
        var self = BitsMap$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $4567 = Bool$false;
                var $4566 = $4567;
                break;
            case 'Maybe.some':
                var $4568 = Bool$true;
                var $4566 = $4568;
                break;
        };
        return $4566;
    };
    const BitsSet$has = x0 => x1 => BitsSet$has$(x0, x1);

    function BitsSet$mut$has$(_bits$1, _set$2) {
        var $4569 = BitsSet$has$(_bits$1, _set$2);
        return $4569;
    };
    const BitsSet$mut$has = x0 => x1 => BitsSet$mut$has$(x0, x1);

    function Kind$Term$equal$extra_holes$funari$(_term$1, _arity$2) {
        var Kind$Term$equal$extra_holes$funari$ = (_term$1, _arity$2) => ({
            ctr: 'TCO',
            arg: [_term$1, _arity$2]
        });
        var Kind$Term$equal$extra_holes$funari = _term$1 => _arity$2 => Kind$Term$equal$extra_holes$funari$(_term$1, _arity$2);
        var arg = [_term$1, _arity$2];
        while (true) {
            let [_term$1, _arity$2] = arg;
            var R = (() => {
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $4570 = self.name;
                        var $4571 = Maybe$some$(Pair$new$($4570, _arity$2));
                        return $4571;
                    case 'Kind.Term.ref':
                        var $4572 = self.name;
                        var $4573 = Maybe$some$(Pair$new$($4572, _arity$2));
                        return $4573;
                    case 'Kind.Term.app':
                        var $4574 = self.func;
                        var $4575 = Kind$Term$equal$extra_holes$funari$($4574, Nat$succ$(_arity$2));
                        return $4575;
                    case 'Kind.Term.ori':
                        var $4576 = self.expr;
                        var $4577 = Kind$Term$equal$extra_holes$funari$($4576, _arity$2);
                        return $4577;
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4578 = Maybe$none;
                        return $4578;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Term$equal$extra_holes$funari = x0 => x1 => Kind$Term$equal$extra_holes$funari$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Kind$Term$has_holes$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.all':
                var $4580 = self.xtyp;
                var $4581 = self.body;
                var $4582 = (Kind$Term$has_holes$($4580) || Kind$Term$has_holes$($4581(Kind$Term$typ)(Kind$Term$typ)));
                var $4579 = $4582;
                break;
            case 'Kind.Term.lam':
                var $4583 = self.body;
                var $4584 = Kind$Term$has_holes$($4583(Kind$Term$typ));
                var $4579 = $4584;
                break;
            case 'Kind.Term.app':
                var $4585 = self.func;
                var $4586 = self.argm;
                var $4587 = (Kind$Term$has_holes$($4585) || Kind$Term$has_holes$($4586));
                var $4579 = $4587;
                break;
            case 'Kind.Term.let':
                var $4588 = self.expr;
                var $4589 = self.body;
                var $4590 = (Kind$Term$has_holes$($4588) || Kind$Term$has_holes$($4589(Kind$Term$typ)));
                var $4579 = $4590;
                break;
            case 'Kind.Term.def':
                var $4591 = self.expr;
                var $4592 = self.body;
                var $4593 = (Kind$Term$has_holes$($4591) || Kind$Term$has_holes$($4592(Kind$Term$typ)));
                var $4579 = $4593;
                break;
            case 'Kind.Term.ann':
                var $4594 = self.term;
                var $4595 = self.type;
                var $4596 = (Kind$Term$has_holes$($4594) || Kind$Term$has_holes$($4595));
                var $4579 = $4596;
                break;
            case 'Kind.Term.ori':
                var $4597 = self.expr;
                var $4598 = Kind$Term$has_holes$($4597);
                var $4579 = $4598;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $4599 = Bool$false;
                var $4579 = $4599;
                break;
            case 'Kind.Term.hol':
                var $4600 = Bool$true;
                var $4579 = $4600;
                break;
        };
        return $4579;
    };
    const Kind$Term$has_holes = x0 => Kind$Term$has_holes$(x0);

    function Kind$Term$equal$hole$(_path$1, _term$2) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
            case 'Kind.Term.ori':
                var self = Kind$Term$has_holes$(_term$2);
                if (self) {
                    var $4603 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                    var $4602 = $4603;
                } else {
                    var $4604 = Kind$Check$result$(Maybe$some$(Bool$true), List$cons$(Kind$Error$patch$(_path$1, Kind$Term$normalize$(_term$2, BitsMap$new)), List$nil));
                    var $4602 = $4604;
                };
                var $4601 = $4602;
                break;
            case 'Kind.Term.hol':
                var $4605 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4601 = $4605;
                break;
        };
        return $4601;
    };
    const Kind$Term$equal$hole = x0 => x1 => Kind$Term$equal$hole$(x0, x1);

    function Kind$Term$equal$extra_holes$filler$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kind.Term.app':
                var $4607 = self.func;
                var $4608 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4610 = self.func;
                        var $4611 = self.argm;
                        var self = Kind$Term$equal$extra_holes$filler$($4607, $4610);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4613 = self.value;
                                var $4614 = self.errors;
                                var self = $4613;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4616 = Kind$Check$result$(Maybe$none, $4614);
                                        var $4615 = $4616;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Term$equal$extra_holes$filler$($4608, $4611);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4618 = self.value;
                                                var $4619 = self.errors;
                                                var $4620 = Kind$Check$result$($4618, List$concat$($4614, $4619));
                                                var $4617 = $4620;
                                                break;
                                        };
                                        var $4615 = $4617;
                                        break;
                                };
                                var $4612 = $4615;
                                break;
                        };
                        var $4609 = $4612;
                        break;
                    case 'Kind.Term.hol':
                        var $4621 = self.path;
                        var self = Kind$Term$equal$hole$($4621, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4623 = self.value;
                                var $4624 = self.errors;
                                var self = $4623;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4626 = Kind$Check$result$(Maybe$none, $4624);
                                        var $4625 = $4626;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4628 = self.value;
                                                var $4629 = self.errors;
                                                var $4630 = Kind$Check$result$($4628, List$concat$($4624, $4629));
                                                var $4627 = $4630;
                                                break;
                                        };
                                        var $4625 = $4627;
                                        break;
                                };
                                var $4622 = $4625;
                                break;
                        };
                        var $4609 = $4622;
                        break;
                    case 'Kind.Term.ori':
                        var $4631 = self.expr;
                        var $4632 = Kind$Term$equal$extra_holes$filler$(_a$1, $4631);
                        var $4609 = $4632;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4633 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4609 = $4633;
                        break;
                };
                var $4606 = $4609;
                break;
            case 'Kind.Term.hol':
                var $4634 = self.path;
                var self = Kind$Term$equal$hole$($4634, _b$2);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4636 = self.value;
                        var $4637 = self.errors;
                        var self = $4636;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4639 = Kind$Check$result$(Maybe$none, $4637);
                                var $4638 = $4639;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4641 = self.value;
                                        var $4642 = self.errors;
                                        var $4643 = Kind$Check$result$($4641, List$concat$($4637, $4642));
                                        var $4640 = $4643;
                                        break;
                                };
                                var $4638 = $4640;
                                break;
                        };
                        var $4635 = $4638;
                        break;
                };
                var $4606 = $4635;
                break;
            case 'Kind.Term.ori':
                var $4644 = self.expr;
                var $4645 = Kind$Term$equal$extra_holes$filler$($4644, _b$2);
                var $4606 = $4645;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4647 = self.path;
                        var self = Kind$Term$equal$hole$($4647, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4649 = self.value;
                                var $4650 = self.errors;
                                var self = $4649;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4652 = Kind$Check$result$(Maybe$none, $4650);
                                        var $4651 = $4652;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4654 = self.value;
                                                var $4655 = self.errors;
                                                var $4656 = Kind$Check$result$($4654, List$concat$($4650, $4655));
                                                var $4653 = $4656;
                                                break;
                                        };
                                        var $4651 = $4653;
                                        break;
                                };
                                var $4648 = $4651;
                                break;
                        };
                        var $4646 = $4648;
                        break;
                    case 'Kind.Term.ori':
                        var $4657 = self.expr;
                        var $4658 = Kind$Term$equal$extra_holes$filler$(_a$1, $4657);
                        var $4646 = $4658;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4659 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4646 = $4659;
                        break;
                };
                var $4606 = $4646;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4661 = self.path;
                        var self = Kind$Term$equal$hole$($4661, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4663 = self.value;
                                var $4664 = self.errors;
                                var self = $4663;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4666 = Kind$Check$result$(Maybe$none, $4664);
                                        var $4665 = $4666;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4668 = self.value;
                                                var $4669 = self.errors;
                                                var $4670 = Kind$Check$result$($4668, List$concat$($4664, $4669));
                                                var $4667 = $4670;
                                                break;
                                        };
                                        var $4665 = $4667;
                                        break;
                                };
                                var $4662 = $4665;
                                break;
                        };
                        var $4660 = $4662;
                        break;
                    case 'Kind.Term.ori':
                        var $4671 = self.expr;
                        var $4672 = Kind$Term$equal$extra_holes$filler$(_a$1, $4671);
                        var $4660 = $4672;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4673 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4660 = $4673;
                        break;
                };
                var $4606 = $4660;
                break;
            case 'Kind.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4675 = self.path;
                        var self = Kind$Term$equal$hole$($4675, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4677 = self.value;
                                var $4678 = self.errors;
                                var self = $4677;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4680 = Kind$Check$result$(Maybe$none, $4678);
                                        var $4679 = $4680;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4682 = self.value;
                                                var $4683 = self.errors;
                                                var $4684 = Kind$Check$result$($4682, List$concat$($4678, $4683));
                                                var $4681 = $4684;
                                                break;
                                        };
                                        var $4679 = $4681;
                                        break;
                                };
                                var $4676 = $4679;
                                break;
                        };
                        var $4674 = $4676;
                        break;
                    case 'Kind.Term.ori':
                        var $4685 = self.expr;
                        var $4686 = Kind$Term$equal$extra_holes$filler$(_a$1, $4685);
                        var $4674 = $4686;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4687 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4674 = $4687;
                        break;
                };
                var $4606 = $4674;
                break;
            case 'Kind.Term.all':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4689 = self.path;
                        var self = Kind$Term$equal$hole$($4689, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4691 = self.value;
                                var $4692 = self.errors;
                                var self = $4691;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4694 = Kind$Check$result$(Maybe$none, $4692);
                                        var $4693 = $4694;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4696 = self.value;
                                                var $4697 = self.errors;
                                                var $4698 = Kind$Check$result$($4696, List$concat$($4692, $4697));
                                                var $4695 = $4698;
                                                break;
                                        };
                                        var $4693 = $4695;
                                        break;
                                };
                                var $4690 = $4693;
                                break;
                        };
                        var $4688 = $4690;
                        break;
                    case 'Kind.Term.ori':
                        var $4699 = self.expr;
                        var $4700 = Kind$Term$equal$extra_holes$filler$(_a$1, $4699);
                        var $4688 = $4700;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4701 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4688 = $4701;
                        break;
                };
                var $4606 = $4688;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4703 = self.path;
                        var self = Kind$Term$equal$hole$($4703, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4705 = self.value;
                                var $4706 = self.errors;
                                var self = $4705;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4708 = Kind$Check$result$(Maybe$none, $4706);
                                        var $4707 = $4708;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4710 = self.value;
                                                var $4711 = self.errors;
                                                var $4712 = Kind$Check$result$($4710, List$concat$($4706, $4711));
                                                var $4709 = $4712;
                                                break;
                                        };
                                        var $4707 = $4709;
                                        break;
                                };
                                var $4704 = $4707;
                                break;
                        };
                        var $4702 = $4704;
                        break;
                    case 'Kind.Term.ori':
                        var $4713 = self.expr;
                        var $4714 = Kind$Term$equal$extra_holes$filler$(_a$1, $4713);
                        var $4702 = $4714;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4715 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4702 = $4715;
                        break;
                };
                var $4606 = $4702;
                break;
            case 'Kind.Term.cse':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4717 = self.path;
                        var self = Kind$Term$equal$hole$($4717, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4719 = self.value;
                                var $4720 = self.errors;
                                var self = $4719;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4722 = Kind$Check$result$(Maybe$none, $4720);
                                        var $4721 = $4722;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4724 = self.value;
                                                var $4725 = self.errors;
                                                var $4726 = Kind$Check$result$($4724, List$concat$($4720, $4725));
                                                var $4723 = $4726;
                                                break;
                                        };
                                        var $4721 = $4723;
                                        break;
                                };
                                var $4718 = $4721;
                                break;
                        };
                        var $4716 = $4718;
                        break;
                    case 'Kind.Term.ori':
                        var $4727 = self.expr;
                        var $4728 = Kind$Term$equal$extra_holes$filler$(_a$1, $4727);
                        var $4716 = $4728;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $4729 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4716 = $4729;
                        break;
                };
                var $4606 = $4716;
                break;
        };
        return $4606;
    };
    const Kind$Term$equal$extra_holes$filler = x0 => x1 => Kind$Term$equal$extra_holes$filler$(x0, x1);

    function Kind$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = Kind$Term$equal$extra_holes$funari$(_a$1, 0n);
        switch (self._) {
            case 'Maybe.some':
                var $4731 = self.value;
                var self = Kind$Term$equal$extra_holes$funari$(_b$2, 0n);
                switch (self._) {
                    case 'Maybe.some':
                        var $4733 = self.value;
                        var self = $4731;
                        switch (self._) {
                            case 'Pair.new':
                                var $4735 = self.fst;
                                var $4736 = self.snd;
                                var self = $4733;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4738 = self.fst;
                                        var $4739 = self.snd;
                                        var _same_fun$9 = ($4735 === $4738);
                                        var _same_ari$10 = ($4736 === $4739);
                                        var self = (_same_fun$9 && _same_ari$10);
                                        if (self) {
                                            var $4741 = Kind$Term$equal$extra_holes$filler$(_a$1, _b$2);
                                            var $4740 = $4741;
                                        } else {
                                            var $4742 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                            var $4740 = $4742;
                                        };
                                        var $4737 = $4740;
                                        break;
                                };
                                var $4734 = $4737;
                                break;
                        };
                        var $4732 = $4734;
                        break;
                    case 'Maybe.none':
                        var $4743 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4732 = $4743;
                        break;
                };
                var $4730 = $4732;
                break;
            case 'Maybe.none':
                var $4744 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                var $4730 = $4744;
                break;
        };
        return $4730;
    };
    const Kind$Term$equal$extra_holes = x0 => x1 => Kind$Term$equal$extra_holes$(x0, x1);

    function BitsSet$set$(_bits$1, _set$2) {
        var $4745 = BitsMap$set$(_bits$1, Unit$new, _set$2);
        return $4745;
    };
    const BitsSet$set = x0 => x1 => BitsSet$set$(x0, x1);

    function BitsSet$mut$set$(_bits$1, _set$2) {
        var $4746 = BitsSet$set$(_bits$1, _set$2);
        return $4746;
    };
    const BitsSet$mut$set = x0 => x1 => BitsSet$mut$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $4748 = _b$2;
            var $4747 = $4748;
        } else {
            var $4749 = (!_b$2);
            var $4747 = $4749;
        };
        return $4747;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Kind$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Kind$Term$serialize$(Kind$Term$reduce$(_a$1, BitsMap$new), _lv$4, _lv$4, Bits$o, Bits$e);
        var _bh$7 = Kind$Term$serialize$(Kind$Term$reduce$(_b$2, BitsMap$new), _lv$4, _lv$4, Bits$i, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $4751 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
            var $4750 = $4751;
        } else {
            var _a1$8 = Kind$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Kind$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Kind$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$o, Bits$e);
            var _bh$11 = Kind$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$i, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $4753 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4752 = $4753;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = BitsSet$mut$has$(_id$12, _seen$5);
                if (self) {
                    var self = Kind$Term$equal$extra_holes$(_a$1, _b$2);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4756 = self.value;
                            var $4757 = self.errors;
                            var self = $4756;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4759 = Kind$Check$result$(Maybe$none, $4757);
                                    var $4758 = $4759;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4761 = self.value;
                                            var $4762 = self.errors;
                                            var $4763 = Kind$Check$result$($4761, List$concat$($4757, $4762));
                                            var $4760 = $4763;
                                            break;
                                    };
                                    var $4758 = $4760;
                                    break;
                            };
                            var $4755 = $4758;
                            break;
                    };
                    var $4754 = $4755;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Kind.Term.all':
                            var $4765 = self.eras;
                            var $4766 = self.self;
                            var $4767 = self.name;
                            var $4768 = self.xtyp;
                            var $4769 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.all':
                                    var $4771 = self.eras;
                                    var $4772 = self.self;
                                    var $4773 = self.name;
                                    var $4774 = self.xtyp;
                                    var $4775 = self.body;
                                    var _seen$23 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $4769(Kind$Term$var$($4766, _lv$4))(Kind$Term$var$($4767, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $4775(Kind$Term$var$($4772, _lv$4))(Kind$Term$var$($4773, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($4766 === $4772);
                                    var _eq_eras$27 = Bool$eql$($4765, $4771);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var self = Kind$Term$equal$($4768, $4774, _defs$3, _lv$4, _seen$23);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4778 = self.value;
                                                var $4779 = self.errors;
                                                var self = $4778;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $4781 = self.value;
                                                        var self = Kind$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4783 = self.value;
                                                                var $4784 = self.errors;
                                                                var self = $4783;
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $4786 = self.value;
                                                                        var self = Kind$Check$result$(Maybe$some$(($4781 && $4786)), List$nil);
                                                                        switch (self._) {
                                                                            case 'Kind.Check.result':
                                                                                var $4788 = self.value;
                                                                                var $4789 = self.errors;
                                                                                var $4790 = Kind$Check$result$($4788, List$concat$($4784, $4789));
                                                                                var $4787 = $4790;
                                                                                break;
                                                                        };
                                                                        var $4785 = $4787;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $4791 = Kind$Check$result$(Maybe$none, $4784);
                                                                        var $4785 = $4791;
                                                                        break;
                                                                };
                                                                var self = $4785;
                                                                break;
                                                        };
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4792 = self.value;
                                                                var $4793 = self.errors;
                                                                var $4794 = Kind$Check$result$($4792, List$concat$($4779, $4793));
                                                                var $4782 = $4794;
                                                                break;
                                                        };
                                                        var $4780 = $4782;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $4795 = Kind$Check$result$(Maybe$none, $4779);
                                                        var $4780 = $4795;
                                                        break;
                                                };
                                                var $4777 = $4780;
                                                break;
                                        };
                                        var $4776 = $4777;
                                    } else {
                                        var $4796 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                        var $4776 = $4796;
                                    };
                                    var $4770 = $4776;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4797 = self.path;
                                    var $4798 = Kind$Term$equal$hole$($4797, _a$1);
                                    var $4770 = $4798;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4799 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4770 = $4799;
                                    break;
                            };
                            var $4764 = $4770;
                            break;
                        case 'Kind.Term.lam':
                            var $4800 = self.name;
                            var $4801 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.lam':
                                    var $4803 = self.name;
                                    var $4804 = self.body;
                                    var _seen$17 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $4801(Kind$Term$var$($4800, _lv$4));
                                    var _b1_body$19 = $4804(Kind$Term$var$($4803, _lv$4));
                                    var self = Kind$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4806 = self.value;
                                            var $4807 = self.errors;
                                            var self = $4806;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4809 = self.value;
                                                    var self = Kind$Check$result$(Maybe$some$($4809), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4811 = self.value;
                                                            var $4812 = self.errors;
                                                            var $4813 = Kind$Check$result$($4811, List$concat$($4807, $4812));
                                                            var $4810 = $4813;
                                                            break;
                                                    };
                                                    var $4808 = $4810;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4814 = Kind$Check$result$(Maybe$none, $4807);
                                                    var $4808 = $4814;
                                                    break;
                                            };
                                            var $4805 = $4808;
                                            break;
                                    };
                                    var $4802 = $4805;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4815 = self.path;
                                    var $4816 = Kind$Term$equal$hole$($4815, _a$1);
                                    var $4802 = $4816;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4817 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4802 = $4817;
                                    break;
                            };
                            var $4764 = $4802;
                            break;
                        case 'Kind.Term.app':
                            var $4818 = self.func;
                            var $4819 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.app':
                                    var $4821 = self.func;
                                    var $4822 = self.argm;
                                    var _seen$17 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var self = Kind$Term$equal$($4818, $4821, _defs$3, _lv$4, _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4824 = self.value;
                                            var $4825 = self.errors;
                                            var self = $4824;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4827 = self.value;
                                                    var self = Kind$Term$equal$($4819, $4822, _defs$3, _lv$4, _seen$17);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4829 = self.value;
                                                            var $4830 = self.errors;
                                                            var self = $4829;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4832 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4827 && $4832)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4834 = self.value;
                                                                            var $4835 = self.errors;
                                                                            var $4836 = Kind$Check$result$($4834, List$concat$($4830, $4835));
                                                                            var $4833 = $4836;
                                                                            break;
                                                                    };
                                                                    var $4831 = $4833;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4837 = Kind$Check$result$(Maybe$none, $4830);
                                                                    var $4831 = $4837;
                                                                    break;
                                                            };
                                                            var self = $4831;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4838 = self.value;
                                                            var $4839 = self.errors;
                                                            var $4840 = Kind$Check$result$($4838, List$concat$($4825, $4839));
                                                            var $4828 = $4840;
                                                            break;
                                                    };
                                                    var $4826 = $4828;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4841 = Kind$Check$result$(Maybe$none, $4825);
                                                    var $4826 = $4841;
                                                    break;
                                            };
                                            var $4823 = $4826;
                                            break;
                                    };
                                    var $4820 = $4823;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4842 = self.path;
                                    var $4843 = Kind$Term$equal$hole$($4842, _a$1);
                                    var $4820 = $4843;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4844 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4820 = $4844;
                                    break;
                            };
                            var $4764 = $4820;
                            break;
                        case 'Kind.Term.let':
                            var $4845 = self.name;
                            var $4846 = self.expr;
                            var $4847 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.let':
                                    var $4849 = self.name;
                                    var $4850 = self.expr;
                                    var $4851 = self.body;
                                    var _seen$19 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $4847(Kind$Term$var$($4845, _lv$4));
                                    var _b1_body$21 = $4851(Kind$Term$var$($4849, _lv$4));
                                    var self = Kind$Term$equal$($4846, $4850, _defs$3, _lv$4, _seen$19);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4853 = self.value;
                                            var $4854 = self.errors;
                                            var self = $4853;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4856 = self.value;
                                                    var self = Kind$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4858 = self.value;
                                                            var $4859 = self.errors;
                                                            var self = $4858;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4861 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4856 && $4861)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4863 = self.value;
                                                                            var $4864 = self.errors;
                                                                            var $4865 = Kind$Check$result$($4863, List$concat$($4859, $4864));
                                                                            var $4862 = $4865;
                                                                            break;
                                                                    };
                                                                    var $4860 = $4862;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4866 = Kind$Check$result$(Maybe$none, $4859);
                                                                    var $4860 = $4866;
                                                                    break;
                                                            };
                                                            var self = $4860;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4867 = self.value;
                                                            var $4868 = self.errors;
                                                            var $4869 = Kind$Check$result$($4867, List$concat$($4854, $4868));
                                                            var $4857 = $4869;
                                                            break;
                                                    };
                                                    var $4855 = $4857;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4870 = Kind$Check$result$(Maybe$none, $4854);
                                                    var $4855 = $4870;
                                                    break;
                                            };
                                            var $4852 = $4855;
                                            break;
                                    };
                                    var $4848 = $4852;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4871 = self.path;
                                    var $4872 = Kind$Term$equal$hole$($4871, _a$1);
                                    var $4848 = $4872;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4873 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4848 = $4873;
                                    break;
                            };
                            var $4764 = $4848;
                            break;
                        case 'Kind.Term.hol':
                            var $4874 = self.path;
                            var $4875 = Kind$Term$equal$hole$($4874, _b$2);
                            var $4764 = $4875;
                            break;
                        case 'Kind.Term.var':
                        case 'Kind.Term.ori':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4877 = self.path;
                                    var $4878 = Kind$Term$equal$hole$($4877, _a$1);
                                    var $4876 = $4878;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4879 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4876 = $4879;
                                    break;
                            };
                            var $4764 = $4876;
                            break;
                        case 'Kind.Term.ref':
                        case 'Kind.Term.nat':
                        case 'Kind.Term.chr':
                        case 'Kind.Term.str':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4881 = self.path;
                                    var $4882 = Kind$Term$equal$hole$($4881, _a$1);
                                    var $4880 = $4882;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4883 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4880 = $4883;
                                    break;
                            };
                            var $4764 = $4880;
                            break;
                        case 'Kind.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4885 = self.path;
                                    var $4886 = Kind$Term$equal$hole$($4885, _a$1);
                                    var $4884 = $4886;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4887 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4884 = $4887;
                                    break;
                            };
                            var $4764 = $4884;
                            break;
                        case 'Kind.Term.def':
                        case 'Kind.Term.ann':
                        case 'Kind.Term.gol':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4889 = self.path;
                                    var $4890 = Kind$Term$equal$hole$($4889, _a$1);
                                    var $4888 = $4890;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4891 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4888 = $4891;
                                    break;
                            };
                            var $4764 = $4888;
                            break;
                        case 'Kind.Term.cse':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4893 = self.path;
                                    var $4894 = Kind$Term$equal$hole$($4893, _a$1);
                                    var $4892 = $4894;
                                    break;
                                case 'Kind.Term.var':
                                case 'Kind.Term.ref':
                                case 'Kind.Term.typ':
                                case 'Kind.Term.all':
                                case 'Kind.Term.lam':
                                case 'Kind.Term.app':
                                case 'Kind.Term.let':
                                case 'Kind.Term.def':
                                case 'Kind.Term.ann':
                                case 'Kind.Term.gol':
                                case 'Kind.Term.nat':
                                case 'Kind.Term.chr':
                                case 'Kind.Term.str':
                                case 'Kind.Term.cse':
                                case 'Kind.Term.ori':
                                    var $4895 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4892 = $4895;
                                    break;
                            };
                            var $4764 = $4892;
                            break;
                    };
                    var $4754 = $4764;
                };
                var $4752 = $4754;
            };
            var $4750 = $4752;
        };
        return $4750;
    };
    const Kind$Term$equal = x0 => x1 => x2 => x3 => x4 => Kind$Term$equal$(x0, x1, x2, x3, x4);
    const BitsSet$new = BitsMap$new;

    function BitsSet$mut$new$(_a$1) {
        var $4896 = BitsSet$new;
        return $4896;
    };
    const BitsSet$mut$new = x0 => BitsSet$mut$new$(x0);

    function Kind$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4898 = self.name;
                var $4899 = self.indx;
                var self = List$at_last$($4899, _ctx$4);
                switch (self._) {
                    case 'Maybe.some':
                        var $4901 = self.value;
                        var $4902 = Kind$Check$result$(Maybe$some$((() => {
                            var self = $4901;
                            switch (self._) {
                                case 'Pair.new':
                                    var $4903 = self.snd;
                                    var $4904 = $4903;
                                    return $4904;
                            };
                        })()), List$nil);
                        var $4900 = $4902;
                        break;
                    case 'Maybe.none':
                        var $4905 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4898), List$nil));
                        var $4900 = $4905;
                        break;
                };
                var self = $4900;
                break;
            case 'Kind.Term.ref':
                var $4906 = self.name;
                var self = Kind$get$($4906, _defs$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $4908 = self.value;
                        var self = $4908;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4910 = self.name;
                                var $4911 = self.term;
                                var $4912 = self.type;
                                var $4913 = self.stat;
                                var _ref_name$18 = $4910;
                                var _ref_type$19 = $4912;
                                var _ref_term$20 = $4911;
                                var _ref_stat$21 = $4913;
                                var self = _ref_stat$21;
                                switch (self._) {
                                    case 'Kind.Status.init':
                                        var $4915 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$waiting$(_ref_name$18), List$nil));
                                        var $4914 = $4915;
                                        break;
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $4916 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$nil);
                                        var $4914 = $4916;
                                        break;
                                    case 'Kind.Status.fail':
                                        var $4917 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$indirect$(_ref_name$18), List$nil));
                                        var $4914 = $4917;
                                        break;
                                };
                                var $4909 = $4914;
                                break;
                        };
                        var $4907 = $4909;
                        break;
                    case 'Maybe.none':
                        var $4918 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4906), List$nil));
                        var $4907 = $4918;
                        break;
                };
                var self = $4907;
                break;
            case 'Kind.Term.all':
                var $4919 = self.self;
                var $4920 = self.name;
                var $4921 = self.xtyp;
                var $4922 = self.body;
                var _ctx_size$12 = (list_length(_ctx$4));
                var _self_var$13 = Kind$Term$var$($4919, _ctx_size$12);
                var _body_var$14 = Kind$Term$var$($4920, Nat$succ$(_ctx_size$12));
                var _body_ctx$15 = List$cons$(Pair$new$($4920, $4921), List$cons$(Pair$new$($4919, _term$1), _ctx$4));
                var self = Kind$Term$check$($4921, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4924 = self.value;
                        var $4925 = self.errors;
                        var self = $4924;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4927 = Kind$Check$result$(Maybe$none, $4925);
                                var $4926 = $4927;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Term$check$($4922(_self_var$13)(_body_var$14), Maybe$some$(Kind$Term$typ), _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4929 = self.value;
                                        var $4930 = self.errors;
                                        var self = $4929;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4932 = Kind$Check$result$(Maybe$none, $4930);
                                                var $4931 = $4932;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4934 = self.value;
                                                        var $4935 = self.errors;
                                                        var $4936 = Kind$Check$result$($4934, List$concat$($4930, $4935));
                                                        var $4933 = $4936;
                                                        break;
                                                };
                                                var $4931 = $4933;
                                                break;
                                        };
                                        var self = $4931;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4937 = self.value;
                                        var $4938 = self.errors;
                                        var $4939 = Kind$Check$result$($4937, List$concat$($4925, $4938));
                                        var $4928 = $4939;
                                        break;
                                };
                                var $4926 = $4928;
                                break;
                        };
                        var $4923 = $4926;
                        break;
                };
                var self = $4923;
                break;
            case 'Kind.Term.lam':
                var $4940 = self.name;
                var $4941 = self.body;
                var self = _type$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $4943 = self.value;
                        var _typv$10 = Kind$Term$reduce$($4943, _defs$3);
                        var self = _typv$10;
                        switch (self._) {
                            case 'Kind.Term.all':
                                var $4945 = self.xtyp;
                                var $4946 = self.body;
                                var _ctx_size$16 = (list_length(_ctx$4));
                                var _self_var$17 = _term$1;
                                var _body_var$18 = Kind$Term$var$($4940, _ctx_size$16);
                                var _body_typ$19 = $4946(_self_var$17)(_body_var$18);
                                var _body_ctx$20 = List$cons$(Pair$new$($4940, $4945), _ctx$4);
                                var self = Kind$Term$check$($4941(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Kind$MPath$o$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4948 = self.value;
                                        var $4949 = self.errors;
                                        var self = $4948;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4951 = Kind$Check$result$(Maybe$none, $4949);
                                                var $4950 = $4951;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$($4943), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4953 = self.value;
                                                        var $4954 = self.errors;
                                                        var $4955 = Kind$Check$result$($4953, List$concat$($4949, $4954));
                                                        var $4952 = $4955;
                                                        break;
                                                };
                                                var $4950 = $4952;
                                                break;
                                        };
                                        var $4947 = $4950;
                                        break;
                                };
                                var $4944 = $4947;
                                break;
                            case 'Kind.Term.var':
                            case 'Kind.Term.lam':
                            case 'Kind.Term.app':
                            case 'Kind.Term.ori':
                                var _expected$13 = Either$left$("(function type)");
                                var _detected$14 = Either$right$($4943);
                                var $4956 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4944 = $4956;
                                break;
                            case 'Kind.Term.ref':
                            case 'Kind.Term.hol':
                            case 'Kind.Term.nat':
                            case 'Kind.Term.chr':
                            case 'Kind.Term.str':
                                var _expected$12 = Either$left$("(function type)");
                                var _detected$13 = Either$right$($4943);
                                var $4957 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4944 = $4957;
                                break;
                            case 'Kind.Term.typ':
                                var _expected$11 = Either$left$("(function type)");
                                var _detected$12 = Either$right$($4943);
                                var $4958 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4944 = $4958;
                                break;
                            case 'Kind.Term.let':
                            case 'Kind.Term.def':
                            case 'Kind.Term.ann':
                            case 'Kind.Term.gol':
                                var _expected$14 = Either$left$("(function type)");
                                var _detected$15 = Either$right$($4943);
                                var $4959 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4944 = $4959;
                                break;
                            case 'Kind.Term.cse':
                                var _expected$17 = Either$left$("(function type)");
                                var _detected$18 = Either$right$($4943);
                                var $4960 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4944 = $4960;
                                break;
                        };
                        var $4942 = $4944;
                        break;
                    case 'Maybe.none':
                        var _lam_type$9 = Kind$Term$hol$(Bits$e);
                        var _lam_term$10 = Kind$Term$ann$(Bool$false, _term$1, _lam_type$9);
                        var $4961 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), _lam_term$10), List$nil));
                        var $4942 = $4961;
                        break;
                };
                var self = $4942;
                break;
            case 'Kind.Term.app':
                var $4962 = self.func;
                var $4963 = self.argm;
                var self = Kind$Term$check$($4962, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4965 = self.value;
                        var $4966 = self.errors;
                        var self = $4965;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4968 = self.value;
                                var _func_typ$12 = Kind$Term$reduce$($4968, _defs$3);
                                var self = _func_typ$12;
                                switch (self._) {
                                    case 'Kind.Term.all':
                                        var $4970 = self.xtyp;
                                        var $4971 = self.body;
                                        var self = Kind$Term$check$($4963, Maybe$some$($4970), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4973 = self.value;
                                                var $4974 = self.errors;
                                                var self = $4973;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $4976 = Kind$Check$result$(Maybe$none, $4974);
                                                        var $4975 = $4976;
                                                        break;
                                                    case 'Maybe.some':
                                                        var self = Kind$Check$result$(Maybe$some$($4971($4962)($4963)), List$nil);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4978 = self.value;
                                                                var $4979 = self.errors;
                                                                var $4980 = Kind$Check$result$($4978, List$concat$($4974, $4979));
                                                                var $4977 = $4980;
                                                                break;
                                                        };
                                                        var $4975 = $4977;
                                                        break;
                                                };
                                                var $4972 = $4975;
                                                break;
                                        };
                                        var self = $4972;
                                        break;
                                    case 'Kind.Term.var':
                                    case 'Kind.Term.lam':
                                    case 'Kind.Term.app':
                                    case 'Kind.Term.ori':
                                        var _expected$15 = Either$left$("(function type)");
                                        var _detected$16 = Either$right$(_func_typ$12);
                                        var $4981 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$15, _detected$16, _ctx$4), List$nil));
                                        var self = $4981;
                                        break;
                                    case 'Kind.Term.ref':
                                    case 'Kind.Term.hol':
                                    case 'Kind.Term.nat':
                                    case 'Kind.Term.chr':
                                    case 'Kind.Term.str':
                                        var _expected$14 = Either$left$("(function type)");
                                        var _detected$15 = Either$right$(_func_typ$12);
                                        var $4982 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                        var self = $4982;
                                        break;
                                    case 'Kind.Term.typ':
                                        var _expected$13 = Either$left$("(function type)");
                                        var _detected$14 = Either$right$(_func_typ$12);
                                        var $4983 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                        var self = $4983;
                                        break;
                                    case 'Kind.Term.let':
                                    case 'Kind.Term.def':
                                    case 'Kind.Term.ann':
                                    case 'Kind.Term.gol':
                                        var _expected$16 = Either$left$("(function type)");
                                        var _detected$17 = Either$right$(_func_typ$12);
                                        var $4984 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$16, _detected$17, _ctx$4), List$nil));
                                        var self = $4984;
                                        break;
                                    case 'Kind.Term.cse':
                                        var _expected$19 = Either$left$("(function type)");
                                        var _detected$20 = Either$right$(_func_typ$12);
                                        var $4985 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$19, _detected$20, _ctx$4), List$nil));
                                        var self = $4985;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4986 = self.value;
                                        var $4987 = self.errors;
                                        var $4988 = Kind$Check$result$($4986, List$concat$($4966, $4987));
                                        var $4969 = $4988;
                                        break;
                                };
                                var $4967 = $4969;
                                break;
                            case 'Maybe.none':
                                var $4989 = Kind$Check$result$(Maybe$none, $4966);
                                var $4967 = $4989;
                                break;
                        };
                        var $4964 = $4967;
                        break;
                };
                var self = $4964;
                break;
            case 'Kind.Term.let':
                var $4990 = self.name;
                var $4991 = self.expr;
                var $4992 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($4991, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4994 = self.value;
                        var $4995 = self.errors;
                        var self = $4994;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4997 = self.value;
                                var _body_val$14 = $4992(Kind$Term$var$($4990, _ctx_size$10));
                                var _body_ctx$15 = List$cons$(Pair$new$($4990, $4997), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4999 = self.value;
                                        var $5000 = self.errors;
                                        var self = $4999;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5002 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5002), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5004 = self.value;
                                                        var $5005 = self.errors;
                                                        var $5006 = Kind$Check$result$($5004, List$concat$($5000, $5005));
                                                        var $5003 = $5006;
                                                        break;
                                                };
                                                var $5001 = $5003;
                                                break;
                                            case 'Maybe.none':
                                                var $5007 = Kind$Check$result$(Maybe$none, $5000);
                                                var $5001 = $5007;
                                                break;
                                        };
                                        var self = $5001;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5008 = self.value;
                                        var $5009 = self.errors;
                                        var $5010 = Kind$Check$result$($5008, List$concat$($4995, $5009));
                                        var $4998 = $5010;
                                        break;
                                };
                                var $4996 = $4998;
                                break;
                            case 'Maybe.none':
                                var $5011 = Kind$Check$result$(Maybe$none, $4995);
                                var $4996 = $5011;
                                break;
                        };
                        var $4993 = $4996;
                        break;
                };
                var self = $4993;
                break;
            case 'Kind.Term.def':
                var $5012 = self.name;
                var $5013 = self.expr;
                var $5014 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5013, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5016 = self.value;
                        var $5017 = self.errors;
                        var self = $5016;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5019 = self.value;
                                var _body_val$14 = $5014(Kind$Term$ann$(Bool$true, $5013, $5019));
                                var _body_ctx$15 = List$cons$(Pair$new$($5012, $5019), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5021 = self.value;
                                        var $5022 = self.errors;
                                        var self = $5021;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5024 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5024), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5026 = self.value;
                                                        var $5027 = self.errors;
                                                        var $5028 = Kind$Check$result$($5026, List$concat$($5022, $5027));
                                                        var $5025 = $5028;
                                                        break;
                                                };
                                                var $5023 = $5025;
                                                break;
                                            case 'Maybe.none':
                                                var $5029 = Kind$Check$result$(Maybe$none, $5022);
                                                var $5023 = $5029;
                                                break;
                                        };
                                        var self = $5023;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5030 = self.value;
                                        var $5031 = self.errors;
                                        var $5032 = Kind$Check$result$($5030, List$concat$($5017, $5031));
                                        var $5020 = $5032;
                                        break;
                                };
                                var $5018 = $5020;
                                break;
                            case 'Maybe.none':
                                var $5033 = Kind$Check$result$(Maybe$none, $5017);
                                var $5018 = $5033;
                                break;
                        };
                        var $5015 = $5018;
                        break;
                };
                var self = $5015;
                break;
            case 'Kind.Term.ann':
                var $5034 = self.done;
                var $5035 = self.term;
                var $5036 = self.type;
                var self = $5034;
                if (self) {
                    var $5038 = Kind$Check$result$(Maybe$some$($5036), List$nil);
                    var $5037 = $5038;
                } else {
                    var self = Kind$Term$check$($5035, Maybe$some$($5036), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $5040 = self.value;
                            var $5041 = self.errors;
                            var self = $5040;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $5043 = Kind$Check$result$(Maybe$none, $5041);
                                    var $5042 = $5043;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Term$check$($5036, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5045 = self.value;
                                            var $5046 = self.errors;
                                            var self = $5045;
                                            switch (self._) {
                                                case 'Maybe.none':
                                                    var $5048 = Kind$Check$result$(Maybe$none, $5046);
                                                    var $5047 = $5048;
                                                    break;
                                                case 'Maybe.some':
                                                    var self = Kind$Check$result$(Maybe$some$($5036), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $5050 = self.value;
                                                            var $5051 = self.errors;
                                                            var $5052 = Kind$Check$result$($5050, List$concat$($5046, $5051));
                                                            var $5049 = $5052;
                                                            break;
                                                    };
                                                    var $5047 = $5049;
                                                    break;
                                            };
                                            var self = $5047;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5053 = self.value;
                                            var $5054 = self.errors;
                                            var $5055 = Kind$Check$result$($5053, List$concat$($5041, $5054));
                                            var $5044 = $5055;
                                            break;
                                    };
                                    var $5042 = $5044;
                                    break;
                            };
                            var $5039 = $5042;
                            break;
                    };
                    var $5037 = $5039;
                };
                var self = $5037;
                break;
            case 'Kind.Term.gol':
                var $5056 = self.name;
                var $5057 = self.dref;
                var $5058 = self.verb;
                var $5059 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$show_goal$($5056, $5057, $5058, _type$2, _ctx$4), List$nil));
                var self = $5059;
                break;
            case 'Kind.Term.cse':
                var $5060 = self.path;
                var $5061 = self.expr;
                var $5062 = self.name;
                var $5063 = self.with;
                var $5064 = self.cses;
                var $5065 = self.moti;
                var _expr$13 = $5061;
                var self = Kind$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5067 = self.value;
                        var $5068 = self.errors;
                        var self = $5067;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5070 = self.value;
                                var self = $5065;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5072 = self.value;
                                        var $5073 = Kind$Term$desugar_cse$($5061, $5062, $5063, $5064, $5072, $5070, _defs$3, _ctx$4);
                                        var _dsug$17 = $5073;
                                        break;
                                    case 'Maybe.none':
                                        var self = _type$2;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5075 = self.value;
                                                var _size$18 = (list_length(_ctx$4));
                                                var _typv$19 = Kind$Term$normalize$($5075, BitsMap$new);
                                                var _moti$20 = Kind$SmartMotive$make$($5062, $5061, $5070, _typv$19, _size$18, _defs$3);
                                                var $5076 = _moti$20;
                                                var _moti$17 = $5076;
                                                break;
                                            case 'Maybe.none':
                                                var $5077 = Kind$Term$hol$(Bits$e);
                                                var _moti$17 = $5077;
                                                break;
                                        };
                                        var $5074 = Maybe$some$(Kind$Term$cse$($5060, $5061, $5062, $5063, $5064, Maybe$some$(_moti$17)));
                                        var _dsug$17 = $5074;
                                        break;
                                };
                                var self = _dsug$17;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5078 = self.value;
                                        var $5079 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), $5078), List$nil));
                                        var self = $5079;
                                        break;
                                    case 'Maybe.none':
                                        var $5080 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                        var self = $5080;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5081 = self.value;
                                        var $5082 = self.errors;
                                        var $5083 = Kind$Check$result$($5081, List$concat$($5068, $5082));
                                        var $5071 = $5083;
                                        break;
                                };
                                var $5069 = $5071;
                                break;
                            case 'Maybe.none':
                                var $5084 = Kind$Check$result$(Maybe$none, $5068);
                                var $5069 = $5084;
                                break;
                        };
                        var $5066 = $5069;
                        break;
                };
                var self = $5066;
                break;
            case 'Kind.Term.ori':
                var $5085 = self.orig;
                var $5086 = self.expr;
                var $5087 = Kind$Term$check$($5086, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($5085));
                var self = $5087;
                break;
            case 'Kind.Term.typ':
                var $5088 = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                var self = $5088;
                break;
            case 'Kind.Term.hol':
                var $5089 = Kind$Check$result$(_type$2, List$nil);
                var self = $5089;
                break;
            case 'Kind.Term.nat':
                var $5090 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Nat")), List$nil);
                var self = $5090;
                break;
            case 'Kind.Term.chr':
                var $5091 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Char")), List$nil);
                var self = $5091;
                break;
            case 'Kind.Term.str':
                var $5092 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("String")), List$nil);
                var self = $5092;
                break;
        };
        switch (self._) {
            case 'Kind.Check.result':
                var $5093 = self.value;
                var $5094 = self.errors;
                var self = $5093;
                switch (self._) {
                    case 'Maybe.some':
                        var $5096 = self.value;
                        var self = _type$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5098 = self.value;
                                var self = Kind$Term$equal$($5098, $5096, _defs$3, (list_length(_ctx$4)), BitsSet$mut$new$(Unit$new));
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5100 = self.value;
                                        var $5101 = self.errors;
                                        var self = $5100;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5103 = self.value;
                                                var self = $5103;
                                                if (self) {
                                                    var $5105 = Kind$Check$result$(Maybe$some$($5098), List$nil);
                                                    var self = $5105;
                                                } else {
                                                    var $5106 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, Either$right$($5098), Either$right$($5096), _ctx$4), List$nil));
                                                    var self = $5106;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5107 = self.value;
                                                        var $5108 = self.errors;
                                                        var $5109 = Kind$Check$result$($5107, List$concat$($5101, $5108));
                                                        var $5104 = $5109;
                                                        break;
                                                };
                                                var $5102 = $5104;
                                                break;
                                            case 'Maybe.none':
                                                var $5110 = Kind$Check$result$(Maybe$none, $5101);
                                                var $5102 = $5110;
                                                break;
                                        };
                                        var $5099 = $5102;
                                        break;
                                };
                                var self = $5099;
                                break;
                            case 'Maybe.none':
                                var $5111 = Kind$Check$result$(Maybe$some$($5096), List$nil);
                                var self = $5111;
                                break;
                        };
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $5112 = self.value;
                                var $5113 = self.errors;
                                var $5114 = Kind$Check$result$($5112, List$concat$($5094, $5113));
                                var $5097 = $5114;
                                break;
                        };
                        var $5095 = $5097;
                        break;
                    case 'Maybe.none':
                        var $5115 = Kind$Check$result$(Maybe$none, $5094);
                        var $5095 = $5115;
                        break;
                };
                var $4897 = $5095;
                break;
        };
        return $4897;
    };
    const Kind$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$check$(x0, x1, x2, x3, x4, x5);

    function Kind$Path$nil$(_x$1) {
        var $5116 = _x$1;
        return $5116;
    };
    const Kind$Path$nil = x0 => Kind$Path$nil$(x0);
    const Kind$MPath$nil = Maybe$some$(Kind$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $5118 = Bool$true;
                var $5117 = $5118;
                break;
            case 'List.cons':
                var $5119 = Bool$false;
                var $5117 = $5119;
                break;
        };
        return $5117;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kind$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.all':
                var $5121 = self.eras;
                var $5122 = self.self;
                var $5123 = self.name;
                var $5124 = self.xtyp;
                var $5125 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5127 = self.slice(0, -1);
                        var $5128 = Kind$Term$all$($5121, $5122, $5123, Kind$Term$patch_at$($5127, $5124, _fn$3), $5125);
                        var $5126 = $5128;
                        break;
                    case 'i':
                        var $5129 = self.slice(0, -1);
                        var $5130 = Kind$Term$all$($5121, $5122, $5123, $5124, (_s$10 => _x$11 => {
                            var $5131 = Kind$Term$patch_at$($5129, $5125(_s$10)(_x$11), _fn$3);
                            return $5131;
                        }));
                        var $5126 = $5130;
                        break;
                    case 'e':
                        var $5132 = _fn$3(_term$2);
                        var $5126 = $5132;
                        break;
                };
                var $5120 = $5126;
                break;
            case 'Kind.Term.lam':
                var $5133 = self.name;
                var $5134 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5136 = _fn$3(_term$2);
                        var $5135 = $5136;
                        break;
                    case 'o':
                    case 'i':
                        var $5137 = Kind$Term$lam$($5133, (_x$7 => {
                            var $5138 = Kind$Term$patch_at$(Bits$tail$(_path$1), $5134(_x$7), _fn$3);
                            return $5138;
                        }));
                        var $5135 = $5137;
                        break;
                };
                var $5120 = $5135;
                break;
            case 'Kind.Term.app':
                var $5139 = self.func;
                var $5140 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5142 = self.slice(0, -1);
                        var $5143 = Kind$Term$app$(Kind$Term$patch_at$($5142, $5139, _fn$3), $5140);
                        var $5141 = $5143;
                        break;
                    case 'i':
                        var $5144 = self.slice(0, -1);
                        var $5145 = Kind$Term$app$($5139, Kind$Term$patch_at$($5144, $5140, _fn$3));
                        var $5141 = $5145;
                        break;
                    case 'e':
                        var $5146 = _fn$3(_term$2);
                        var $5141 = $5146;
                        break;
                };
                var $5120 = $5141;
                break;
            case 'Kind.Term.let':
                var $5147 = self.name;
                var $5148 = self.expr;
                var $5149 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5151 = self.slice(0, -1);
                        var $5152 = Kind$Term$let$($5147, Kind$Term$patch_at$($5151, $5148, _fn$3), $5149);
                        var $5150 = $5152;
                        break;
                    case 'i':
                        var $5153 = self.slice(0, -1);
                        var $5154 = Kind$Term$let$($5147, $5148, (_x$8 => {
                            var $5155 = Kind$Term$patch_at$($5153, $5149(_x$8), _fn$3);
                            return $5155;
                        }));
                        var $5150 = $5154;
                        break;
                    case 'e':
                        var $5156 = _fn$3(_term$2);
                        var $5150 = $5156;
                        break;
                };
                var $5120 = $5150;
                break;
            case 'Kind.Term.def':
                var $5157 = self.name;
                var $5158 = self.expr;
                var $5159 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5161 = self.slice(0, -1);
                        var $5162 = Kind$Term$def$($5157, Kind$Term$patch_at$($5161, $5158, _fn$3), $5159);
                        var $5160 = $5162;
                        break;
                    case 'i':
                        var $5163 = self.slice(0, -1);
                        var $5164 = Kind$Term$def$($5157, $5158, (_x$8 => {
                            var $5165 = Kind$Term$patch_at$($5163, $5159(_x$8), _fn$3);
                            return $5165;
                        }));
                        var $5160 = $5164;
                        break;
                    case 'e':
                        var $5166 = _fn$3(_term$2);
                        var $5160 = $5166;
                        break;
                };
                var $5120 = $5160;
                break;
            case 'Kind.Term.ann':
                var $5167 = self.done;
                var $5168 = self.term;
                var $5169 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5171 = self.slice(0, -1);
                        var $5172 = Kind$Term$ann$($5167, Kind$Term$patch_at$($5171, $5168, _fn$3), $5169);
                        var $5170 = $5172;
                        break;
                    case 'i':
                        var $5173 = self.slice(0, -1);
                        var $5174 = Kind$Term$ann$($5167, $5168, Kind$Term$patch_at$($5173, $5169, _fn$3));
                        var $5170 = $5174;
                        break;
                    case 'e':
                        var $5175 = _fn$3(_term$2);
                        var $5170 = $5175;
                        break;
                };
                var $5120 = $5170;
                break;
            case 'Kind.Term.ori':
                var $5176 = self.orig;
                var $5177 = self.expr;
                var $5178 = Kind$Term$ori$($5176, Kind$Term$patch_at$(_path$1, $5177, _fn$3));
                var $5120 = $5178;
                break;
            case 'Kind.Term.var':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5180 = _fn$3(_term$2);
                        var $5179 = $5180;
                        break;
                    case 'o':
                    case 'i':
                        var $5181 = _term$2;
                        var $5179 = $5181;
                        break;
                };
                var $5120 = $5179;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5183 = _fn$3(_term$2);
                        var $5182 = $5183;
                        break;
                    case 'o':
                    case 'i':
                        var $5184 = _term$2;
                        var $5182 = $5184;
                        break;
                };
                var $5120 = $5182;
                break;
            case 'Kind.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5186 = _fn$3(_term$2);
                        var $5185 = $5186;
                        break;
                    case 'o':
                    case 'i':
                        var $5187 = _term$2;
                        var $5185 = $5187;
                        break;
                };
                var $5120 = $5185;
                break;
            case 'Kind.Term.gol':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5189 = _fn$3(_term$2);
                        var $5188 = $5189;
                        break;
                    case 'o':
                    case 'i':
                        var $5190 = _term$2;
                        var $5188 = $5190;
                        break;
                };
                var $5120 = $5188;
                break;
            case 'Kind.Term.cse':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5192 = _fn$3(_term$2);
                        var $5191 = $5192;
                        break;
                    case 'o':
                    case 'i':
                        var $5193 = _term$2;
                        var $5191 = $5193;
                        break;
                };
                var $5120 = $5191;
                break;
        };
        return $5120;
    };
    const Kind$Term$patch_at = x0 => x1 => x2 => Kind$Term$patch_at$(x0, x1, x2);

    function Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, _errs$10, _fixd$11) {
        var self = _errs$10;
        switch (self._) {
            case 'List.cons':
                var $5195 = self.head;
                var $5196 = self.tail;
                var self = $5195;
                switch (self._) {
                    case 'Kind.Error.waiting':
                        var $5198 = self.name;
                        var $5199 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                            var $5200 = _m$bind$15;
                            return $5200;
                        }))(Kind$Synth$one$($5198, _defs$9))((_new_defs$15 => {
                            var self = _new_defs$15;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5202 = self.value;
                                    var $5203 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5202, $5196, Bool$true);
                                    var $5201 = $5203;
                                    break;
                                case 'Maybe.none':
                                    var $5204 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5196, _fixd$11);
                                    var $5201 = $5204;
                                    break;
                            };
                            return $5201;
                        }));
                        var $5197 = $5199;
                        break;
                    case 'Kind.Error.patch':
                        var $5205 = self.path;
                        var $5206 = self.term;
                        var self = $5205;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $5208 = self.slice(0, -1);
                                var _term$17 = Kind$Term$patch_at$($5208, _term$5, (_x$17 => {
                                    var $5210 = $5206;
                                    return $5210;
                                }));
                                var $5209 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$17, _type$6, _isct$7, _arit$8, _defs$9, $5196, Bool$true);
                                var $5207 = $5209;
                                break;
                            case 'i':
                                var $5211 = self.slice(0, -1);
                                var _type$17 = Kind$Term$patch_at$($5211, _type$6, (_x$17 => {
                                    var $5213 = $5206;
                                    return $5213;
                                }));
                                var $5212 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$17, _isct$7, _arit$8, _defs$9, $5196, Bool$true);
                                var $5207 = $5212;
                                break;
                            case 'e':
                                var $5214 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $5215 = _m$pure$17;
                                    return $5215;
                                }))(Maybe$none);
                                var $5207 = $5214;
                                break;
                        };
                        var $5197 = $5207;
                        break;
                    case 'Kind.Error.undefined_reference':
                        var $5216 = self.name;
                        var $5217 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                            var $5218 = _m$bind$16;
                            return $5218;
                        }))(Kind$Synth$one$($5216, _defs$9))((_new_defs$16 => {
                            var self = _new_defs$16;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5220 = self.value;
                                    var $5221 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5220, $5196, Bool$true);
                                    var $5219 = $5221;
                                    break;
                                case 'Maybe.none':
                                    var $5222 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5196, _fixd$11);
                                    var $5219 = $5222;
                                    break;
                            };
                            return $5219;
                        }));
                        var $5197 = $5217;
                        break;
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.cant_infer':
                        var $5223 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5196, _fixd$11);
                        var $5197 = $5223;
                        break;
                };
                var $5194 = $5197;
                break;
            case 'List.nil':
                var self = _fixd$11;
                if (self) {
                    var _type$12 = Kind$Term$bind$(List$nil, (_x$12 => {
                        var $5226 = (_x$12 + '1');
                        return $5226;
                    }), _type$6);
                    var _term$13 = Kind$Term$bind$(List$nil, (_x$13 => {
                        var $5227 = (_x$13 + '0');
                        return $5227;
                    }), _term$5);
                    var _defs$14 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$13, _type$12, _isct$7, _arit$8, Kind$Status$init), _defs$9);
                    var $5225 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                        var $5228 = _m$pure$16;
                        return $5228;
                    }))(Maybe$some$(_defs$14));
                    var $5224 = $5225;
                } else {
                    var $5229 = IO$monad$((_m$bind$12 => _m$pure$13 => {
                        var $5230 = _m$pure$13;
                        return $5230;
                    }))(Maybe$none);
                    var $5224 = $5229;
                };
                var $5194 = $5224;
                break;
        };
        return $5194;
    };
    const Kind$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Kind$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);

    function Kind$Status$fail$(_errors$1) {
        var $5231 = ({
            _: 'Kind.Status.fail',
            'errors': _errors$1
        });
        return $5231;
    };
    const Kind$Status$fail = x0 => Kind$Status$fail$(x0);

    function Kind$Synth$one$(_name$1, _defs$2) {
        var self = Kind$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.some':
                var $5233 = self.value;
                var self = $5233;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5235 = self.file;
                        var $5236 = self.code;
                        var $5237 = self.orig;
                        var $5238 = self.name;
                        var $5239 = self.term;
                        var $5240 = self.type;
                        var $5241 = self.isct;
                        var $5242 = self.arit;
                        var $5243 = self.stat;
                        var _file$13 = $5235;
                        var _code$14 = $5236;
                        var _orig$15 = $5237;
                        var _name$16 = $5238;
                        var _term$17 = $5239;
                        var _type$18 = $5240;
                        var _isct$19 = $5241;
                        var _arit$20 = $5242;
                        var _stat$21 = $5243;
                        var self = _stat$21;
                        switch (self._) {
                            case 'Kind.Status.init':
                                var _defs$22 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Kind$Status$wait), _defs$2);
                                var self = Kind$Term$check$(_type$18, Maybe$some$(Kind$Term$typ), _defs$22, List$nil, Kind$MPath$i$(Kind$MPath$nil), Maybe$none);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5246 = self.value;
                                        var $5247 = self.errors;
                                        var self = $5246;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5249 = Kind$Check$result$(Maybe$none, $5247);
                                                var $5248 = $5249;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Term$check$(_term$17, Maybe$some$(_type$18), _defs$22, List$nil, Kind$MPath$o$(Kind$MPath$nil), Maybe$none);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5251 = self.value;
                                                        var $5252 = self.errors;
                                                        var self = $5251;
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $5254 = Kind$Check$result$(Maybe$none, $5252);
                                                                var $5253 = $5254;
                                                                break;
                                                            case 'Maybe.some':
                                                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                                                switch (self._) {
                                                                    case 'Kind.Check.result':
                                                                        var $5256 = self.value;
                                                                        var $5257 = self.errors;
                                                                        var $5258 = Kind$Check$result$($5256, List$concat$($5252, $5257));
                                                                        var $5255 = $5258;
                                                                        break;
                                                                };
                                                                var $5253 = $5255;
                                                                break;
                                                        };
                                                        var self = $5253;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5259 = self.value;
                                                        var $5260 = self.errors;
                                                        var $5261 = Kind$Check$result$($5259, List$concat$($5247, $5260));
                                                        var $5250 = $5261;
                                                        break;
                                                };
                                                var $5248 = $5250;
                                                break;
                                        };
                                        var _checked$23 = $5248;
                                        break;
                                };
                                var self = _checked$23;
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5262 = self.errors;
                                        var self = List$is_empty$($5262);
                                        if (self) {
                                            var _defs$26 = Kind$define$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Bool$true, _defs$22);
                                            var $5264 = IO$monad$((_m$bind$27 => _m$pure$28 => {
                                                var $5265 = _m$pure$28;
                                                return $5265;
                                            }))(Maybe$some$(_defs$26));
                                            var $5263 = $5264;
                                        } else {
                                            var $5266 = IO$monad$((_m$bind$26 => _m$pure$27 => {
                                                var $5267 = _m$bind$26;
                                                return $5267;
                                            }))(Kind$Synth$fix$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _defs$22, $5262, Bool$false))((_fixed$26 => {
                                                var self = _fixed$26;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $5269 = self.value;
                                                        var $5270 = Kind$Synth$one$(_name$16, $5269);
                                                        var $5268 = $5270;
                                                        break;
                                                    case 'Maybe.none':
                                                        var _stat$27 = Kind$Status$fail$($5262);
                                                        var _defs$28 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _stat$27), _defs$22);
                                                        var $5271 = IO$monad$((_m$bind$29 => _m$pure$30 => {
                                                            var $5272 = _m$pure$30;
                                                            return $5272;
                                                        }))(Maybe$some$(_defs$28));
                                                        var $5268 = $5271;
                                                        break;
                                                };
                                                return $5268;
                                            }));
                                            var $5263 = $5266;
                                        };
                                        var $5245 = $5263;
                                        break;
                                };
                                var $5244 = $5245;
                                break;
                            case 'Kind.Status.wait':
                            case 'Kind.Status.done':
                                var $5273 = IO$monad$((_m$bind$22 => _m$pure$23 => {
                                    var $5274 = _m$pure$23;
                                    return $5274;
                                }))(Maybe$some$(_defs$2));
                                var $5244 = $5273;
                                break;
                            case 'Kind.Status.fail':
                                var $5275 = IO$monad$((_m$bind$23 => _m$pure$24 => {
                                    var $5276 = _m$pure$24;
                                    return $5276;
                                }))(Maybe$some$(_defs$2));
                                var $5244 = $5275;
                                break;
                        };
                        var $5234 = $5244;
                        break;
                };
                var $5232 = $5234;
                break;
            case 'Maybe.none':
                var $5277 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5278 = _m$bind$3;
                    return $5278;
                }))(Kind$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5280 = self.value;
                            var $5281 = Kind$Synth$one$(_name$1, $5280);
                            var $5279 = $5281;
                            break;
                        case 'Maybe.none':
                            var $5282 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                                var $5283 = _m$pure$5;
                                return $5283;
                            }))(Maybe$none);
                            var $5279 = $5282;
                            break;
                    };
                    return $5279;
                }));
                var $5232 = $5277;
                break;
        };
        return $5232;
    };
    const Kind$Synth$one = x0 => x1 => Kind$Synth$one$(x0, x1);

    function BitsMap$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'BitsMap.tie':
                var $5285 = self.val;
                var $5286 = self.lft;
                var $5287 = self.rgt;
                var self = $5285;
                switch (self._) {
                    case 'Maybe.some':
                        var $5289 = self.value;
                        var $5290 = Maybe$some$(_fn$3($5289));
                        var _val$8 = $5290;
                        break;
                    case 'Maybe.none':
                        var $5291 = Maybe$none;
                        var _val$8 = $5291;
                        break;
                };
                var _lft$9 = BitsMap$map$(_fn$3, $5286);
                var _rgt$10 = BitsMap$map$(_fn$3, $5287);
                var $5288 = BitsMap$tie$(_val$8, _lft$9, _rgt$10);
                var $5284 = $5288;
                break;
            case 'BitsMap.new':
                var $5292 = BitsMap$new;
                var $5284 = $5292;
                break;
        };
        return $5284;
    };
    const BitsMap$map = x0 => x1 => BitsMap$map$(x0, x1);
    const Kind$Term$inline$names = (() => {
        var _inl$1 = List$cons$("Monad.pure", List$cons$("Monad.bind", List$cons$("Monad.new", List$cons$("Parser.monad", List$cons$("Parser.bind", List$cons$("Parser.pure", List$cons$("Kind.Check.pure", List$cons$("Kind.Check.bind", List$cons$("Kind.Check.monad", List$cons$("Kind.Check.value", List$cons$("Kind.Check.none", List$nil)))))))))));
        var _kvs$2 = List$mapped$(_inl$1, (_x$2 => {
            var $5294 = Pair$new$((kind_name_to_bits(_x$2)), Unit$new);
            return $5294;
        }));
        var $5293 = BitsMap$from_list$(_kvs$2);
        return $5293;
    })();

    function Kind$Term$inline$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5296 = self.name;
                var _inli$4 = BitsSet$has$((kind_name_to_bits($5296)), Kind$Term$inline$names);
                var self = _inli$4;
                if (self) {
                    var self = Kind$get$($5296, _defs$2);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5299 = self.value;
                            var self = $5299;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5301 = self.term;
                                    var $5302 = Kind$Term$inline$reduce$($5301, _defs$2);
                                    var $5300 = $5302;
                                    break;
                            };
                            var $5298 = $5300;
                            break;
                        case 'Maybe.none':
                            var $5303 = Kind$Term$ref$($5296);
                            var $5298 = $5303;
                            break;
                    };
                    var $5297 = $5298;
                } else {
                    var $5304 = _term$1;
                    var $5297 = $5304;
                };
                var $5295 = $5297;
                break;
            case 'Kind.Term.app':
                var $5305 = self.func;
                var $5306 = self.argm;
                var _func$5 = Kind$Term$inline$reduce$($5305, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $5308 = self.body;
                        var $5309 = Kind$Term$inline$reduce$($5308($5306), _defs$2);
                        var $5307 = $5309;
                        break;
                    case 'Kind.Term.let':
                        var $5310 = self.name;
                        var $5311 = self.expr;
                        var $5312 = self.body;
                        var $5313 = Kind$Term$let$($5310, $5311, (_x$9 => {
                            var $5314 = Kind$Term$inline$reduce$(Kind$Term$app$($5312(_x$9), $5306), _defs$2);
                            return $5314;
                        }));
                        var $5307 = $5313;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.app':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $5315 = _term$1;
                        var $5307 = $5315;
                        break;
                };
                var $5295 = $5307;
                break;
            case 'Kind.Term.ori':
                var $5316 = self.expr;
                var $5317 = Kind$Term$inline$reduce$($5316, _defs$2);
                var $5295 = $5317;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $5318 = _term$1;
                var $5295 = $5318;
                break;
        };
        return $5295;
    };
    const Kind$Term$inline$reduce = x0 => x1 => Kind$Term$inline$reduce$(x0, x1);

    function Kind$Term$inline$(_term$1, _defs$2) {
        var self = Kind$Term$inline$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $5320 = self.name;
                var $5321 = self.indx;
                var $5322 = Kind$Term$var$($5320, $5321);
                var $5319 = $5322;
                break;
            case 'Kind.Term.ref':
                var $5323 = self.name;
                var $5324 = Kind$Term$ref$($5323);
                var $5319 = $5324;
                break;
            case 'Kind.Term.all':
                var $5325 = self.eras;
                var $5326 = self.self;
                var $5327 = self.name;
                var $5328 = self.xtyp;
                var $5329 = self.body;
                var $5330 = Kind$Term$all$($5325, $5326, $5327, Kind$Term$inline$($5328, _defs$2), (_s$8 => _x$9 => {
                    var $5331 = Kind$Term$inline$($5329(_s$8)(_x$9), _defs$2);
                    return $5331;
                }));
                var $5319 = $5330;
                break;
            case 'Kind.Term.lam':
                var $5332 = self.name;
                var $5333 = self.body;
                var $5334 = Kind$Term$lam$($5332, (_x$5 => {
                    var $5335 = Kind$Term$inline$($5333(_x$5), _defs$2);
                    return $5335;
                }));
                var $5319 = $5334;
                break;
            case 'Kind.Term.app':
                var $5336 = self.func;
                var $5337 = self.argm;
                var $5338 = Kind$Term$app$(Kind$Term$inline$($5336, _defs$2), Kind$Term$inline$($5337, _defs$2));
                var $5319 = $5338;
                break;
            case 'Kind.Term.let':
                var $5339 = self.name;
                var $5340 = self.expr;
                var $5341 = self.body;
                var $5342 = Kind$Term$let$($5339, Kind$Term$inline$($5340, _defs$2), (_x$6 => {
                    var $5343 = Kind$Term$inline$($5341(_x$6), _defs$2);
                    return $5343;
                }));
                var $5319 = $5342;
                break;
            case 'Kind.Term.def':
                var $5344 = self.name;
                var $5345 = self.expr;
                var $5346 = self.body;
                var $5347 = Kind$Term$def$($5344, Kind$Term$inline$($5345, _defs$2), (_x$6 => {
                    var $5348 = Kind$Term$inline$($5346(_x$6), _defs$2);
                    return $5348;
                }));
                var $5319 = $5347;
                break;
            case 'Kind.Term.ann':
                var $5349 = self.done;
                var $5350 = self.term;
                var $5351 = self.type;
                var $5352 = Kind$Term$ann$($5349, Kind$Term$inline$($5350, _defs$2), Kind$Term$inline$($5351, _defs$2));
                var $5319 = $5352;
                break;
            case 'Kind.Term.gol':
                var $5353 = self.name;
                var $5354 = self.dref;
                var $5355 = self.verb;
                var $5356 = Kind$Term$gol$($5353, $5354, $5355);
                var $5319 = $5356;
                break;
            case 'Kind.Term.hol':
                var $5357 = self.path;
                var $5358 = Kind$Term$hol$($5357);
                var $5319 = $5358;
                break;
            case 'Kind.Term.nat':
                var $5359 = self.natx;
                var $5360 = Kind$Term$nat$($5359);
                var $5319 = $5360;
                break;
            case 'Kind.Term.chr':
                var $5361 = self.chrx;
                var $5362 = Kind$Term$chr$($5361);
                var $5319 = $5362;
                break;
            case 'Kind.Term.str':
                var $5363 = self.strx;
                var $5364 = Kind$Term$str$($5363);
                var $5319 = $5364;
                break;
            case 'Kind.Term.ori':
                var $5365 = self.expr;
                var $5366 = Kind$Term$inline$($5365, _defs$2);
                var $5319 = $5366;
                break;
            case 'Kind.Term.typ':
                var $5367 = Kind$Term$typ;
                var $5319 = $5367;
                break;
            case 'Kind.Term.cse':
                var $5368 = _term$1;
                var $5319 = $5368;
                break;
        };
        return $5319;
    };
    const Kind$Term$inline = x0 => x1 => Kind$Term$inline$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $5370 = self.val;
                var $5371 = self.lft;
                var $5372 = self.rgt;
                var self = $5370;
                switch (self._) {
                    case 'Maybe.some':
                        var $5374 = self.value;
                        var $5375 = List$cons$($5374, _list$3);
                        var _list0$7 = $5375;
                        break;
                    case 'Maybe.none':
                        var $5376 = _list$3;
                        var _list0$7 = $5376;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($5371, _list0$7);
                var _list2$9 = BitsMap$values$go$($5372, _list1$8);
                var $5373 = _list2$9;
                var $5369 = $5373;
                break;
            case 'BitsMap.new':
                var $5377 = _list$3;
                var $5369 = $5377;
                break;
        };
        return $5369;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function BitsMap$values$(_xs$2) {
        var $5378 = BitsMap$values$go$(_xs$2, List$nil);
        return $5378;
    };
    const BitsMap$values = x0 => BitsMap$values$(x0);

    function Kind$Core$var_name$(_indx$1, _name$2, _brui$3, _vars$4) {
        var Kind$Core$var_name$ = (_indx$1, _name$2, _brui$3, _vars$4) => ({
            ctr: 'TCO',
            arg: [_indx$1, _name$2, _brui$3, _vars$4]
        });
        var Kind$Core$var_name = _indx$1 => _name$2 => _brui$3 => _vars$4 => Kind$Core$var_name$(_indx$1, _name$2, _brui$3, _vars$4);
        var arg = [_indx$1, _name$2, _brui$3, _vars$4];
        while (true) {
            let [_indx$1, _name$2, _brui$3, _vars$4] = arg;
            var R = (() => {
                var self = _indx$1;
                if (self === 0n) {
                    var self = _brui$3;
                    if (self === 0n) {
                        var $5380 = _name$2;
                        var $5379 = $5380;
                    } else {
                        var $5381 = (self - 1n);
                        var $5382 = (_name$2 + ("^" + Nat$show$(_brui$3)));
                        var $5379 = $5382;
                    };
                    return $5379;
                } else {
                    var $5383 = (self - 1n);
                    var self = _vars$4;
                    switch (self._) {
                        case 'List.cons':
                            var $5385 = self.head;
                            var $5386 = self.tail;
                            var self = (_name$2 === $5385);
                            if (self) {
                                var $5388 = Nat$succ$(_brui$3);
                                var _brui$8 = $5388;
                            } else {
                                var $5389 = _brui$3;
                                var _brui$8 = $5389;
                            };
                            var $5387 = Kind$Core$var_name$($5383, _name$2, _brui$8, $5386);
                            var $5384 = $5387;
                            break;
                        case 'List.nil':
                            var $5390 = "unbound";
                            var $5384 = $5390;
                            break;
                    };
                    return $5384;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Core$var_name = x0 => x1 => x2 => x3 => Kind$Core$var_name$(x0, x1, x2, x3);

    function Kind$Name$show$(_name$1) {
        var $5391 = _name$1;
        return $5391;
    };
    const Kind$Name$show = x0 => Kind$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5393 = self.slice(0, -1);
                var $5394 = (2n * Bits$to_nat$($5393));
                var $5392 = $5394;
                break;
            case 'i':
                var $5395 = self.slice(0, -1);
                var $5396 = Nat$succ$((2n * Bits$to_nat$($5395)));
                var $5392 = $5396;
                break;
            case 'e':
                var $5397 = 0n;
                var $5392 = $5397;
                break;
        };
        return $5392;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $5399 = u16_to_word(self);
                var $5400 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($5399)));
                var $5398 = $5400;
                break;
        };
        return $5398;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Kind$escape$char$(_chr$1) {
        var self = (_chr$1 === Kind$backslash);
        if (self) {
            var $5402 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
            var $5401 = $5402;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $5404 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                var $5403 = $5404;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $5406 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                    var $5405 = $5406;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $5408 = String$cons$(_chr$1, String$nil);
                        var $5407 = $5408;
                    } else {
                        var $5409 = String$flatten$(List$cons$(String$cons$(Kind$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $5407 = $5409;
                    };
                    var $5405 = $5407;
                };
                var $5403 = $5405;
            };
            var $5401 = $5403;
        };
        return $5401;
    };
    const Kind$escape$char = x0 => Kind$escape$char$(x0);

    function Kind$escape$go$(_str$1, _result$2) {
        var Kind$escape$go$ = (_str$1, _result$2) => ({
            ctr: 'TCO',
            arg: [_str$1, _result$2]
        });
        var Kind$escape$go = _str$1 => _result$2 => Kind$escape$go$(_str$1, _result$2);
        var arg = [_str$1, _result$2];
        while (true) {
            let [_str$1, _result$2] = arg;
            var R = (() => {
                var self = _str$1;
                if (self.length === 0) {
                    var $5410 = String$reverse$(_result$2);
                    return $5410;
                } else {
                    var $5411 = self.charCodeAt(0);
                    var $5412 = self.slice(1);
                    var $5413 = Kind$escape$go$($5412, (String$reverse$(Kind$escape$char$($5411)) + _result$2));
                    return $5413;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$escape$go = x0 => x1 => Kind$escape$go$(x0, x1);

    function Kind$escape$(_str$1) {
        var $5414 = Kind$escape$go$(_str$1, "");
        return $5414;
    };
    const Kind$escape = x0 => Kind$escape$(x0);

    function Kind$Core$show$(_term$1, _indx$2, _vars$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5416 = self.name;
                var $5417 = self.indx;
                var $5418 = Kind$Core$var_name$(Nat$pred$((_indx$2 - $5417 <= 0n ? 0n : _indx$2 - $5417)), $5416, 0n, _vars$3);
                var $5415 = $5418;
                break;
            case 'Kind.Term.ref':
                var $5419 = self.name;
                var $5420 = Kind$Name$show$($5419);
                var $5415 = $5420;
                break;
            case 'Kind.Term.all':
                var $5421 = self.eras;
                var $5422 = self.self;
                var $5423 = self.name;
                var $5424 = self.xtyp;
                var $5425 = self.body;
                var _eras$9 = $5421;
                var self = _eras$9;
                if (self) {
                    var $5427 = "%";
                    var _init$10 = $5427;
                } else {
                    var $5428 = "@";
                    var _init$10 = $5428;
                };
                var _self$11 = Kind$Name$show$($5422);
                var _name$12 = Kind$Name$show$($5423);
                var _xtyp$13 = Kind$Core$show$($5424, _indx$2, _vars$3);
                var _body$14 = Kind$Core$show$($5425(Kind$Term$var$($5422, _indx$2))(Kind$Term$var$($5423, Nat$succ$(_indx$2))), Nat$succ$(Nat$succ$(_indx$2)), List$cons$($5423, List$cons$($5422, _vars$3)));
                var $5426 = String$flatten$(List$cons$(_init$10, List$cons$(_self$11, List$cons$("(", List$cons$(_name$12, List$cons$(":", List$cons$(_xtyp$13, List$cons$(") ", List$cons$(_body$14, List$nil)))))))));
                var $5415 = $5426;
                break;
            case 'Kind.Term.lam':
                var $5429 = self.name;
                var $5430 = self.body;
                var _name$6 = Kind$Name$show$($5429);
                var _body$7 = Kind$Core$show$($5430(Kind$Term$var$($5429, _indx$2)), Nat$succ$(_indx$2), List$cons$($5429, _vars$3));
                var $5431 = String$flatten$(List$cons$("#", List$cons$(_name$6, List$cons$(" ", List$cons$(_body$7, List$nil)))));
                var $5415 = $5431;
                break;
            case 'Kind.Term.app':
                var $5432 = self.func;
                var $5433 = self.argm;
                var _func$6 = Kind$Core$show$($5432, _indx$2, _vars$3);
                var _argm$7 = Kind$Core$show$($5433, _indx$2, _vars$3);
                var $5434 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(" ", List$cons$(_argm$7, List$cons$(")", List$nil))))));
                var $5415 = $5434;
                break;
            case 'Kind.Term.let':
                var $5435 = self.name;
                var $5436 = self.expr;
                var $5437 = self.body;
                var _name$7 = Kind$Name$show$($5435);
                var _expr$8 = Kind$Core$show$($5436, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5437(Kind$Term$var$($5435, _indx$2)), Nat$succ$(_indx$2), List$cons$($5435, _vars$3));
                var $5438 = String$flatten$(List$cons$("!", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5415 = $5438;
                break;
            case 'Kind.Term.def':
                var $5439 = self.name;
                var $5440 = self.expr;
                var $5441 = self.body;
                var _name$7 = Kind$Name$show$($5439);
                var _expr$8 = Kind$Core$show$($5440, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5441(Kind$Term$var$($5439, _indx$2)), Nat$succ$(_indx$2), List$cons$($5439, _vars$3));
                var $5442 = String$flatten$(List$cons$("$", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5415 = $5442;
                break;
            case 'Kind.Term.ann':
                var $5443 = self.term;
                var $5444 = self.type;
                var _term$7 = Kind$Core$show$($5443, _indx$2, _vars$3);
                var _type$8 = Kind$Core$show$($5444, _indx$2, _vars$3);
                var $5445 = String$flatten$(List$cons$("{", List$cons$(_term$7, List$cons$(":", List$cons$(_type$8, List$cons$("}", List$nil))))));
                var $5415 = $5445;
                break;
            case 'Kind.Term.nat':
                var $5446 = self.natx;
                var $5447 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($5446), List$nil)));
                var $5415 = $5447;
                break;
            case 'Kind.Term.chr':
                var $5448 = self.chrx;
                var $5449 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5448), List$cons$("\'", List$nil))));
                var $5415 = $5449;
                break;
            case 'Kind.Term.str':
                var $5450 = self.strx;
                var $5451 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5450), List$cons$("\"", List$nil))));
                var $5415 = $5451;
                break;
            case 'Kind.Term.ori':
                var $5452 = self.expr;
                var $5453 = Kind$Core$show$($5452, _indx$2, _vars$3);
                var $5415 = $5453;
                break;
            case 'Kind.Term.typ':
                var $5454 = "*";
                var $5415 = $5454;
                break;
            case 'Kind.Term.gol':
                var $5455 = "<GOL>";
                var $5415 = $5455;
                break;
            case 'Kind.Term.hol':
                var $5456 = "<HOL>";
                var $5415 = $5456;
                break;
            case 'Kind.Term.cse':
                var $5457 = "<CSE>";
                var $5415 = $5457;
                break;
        };
        return $5415;
    };
    const Kind$Core$show = x0 => x1 => x2 => Kind$Core$show$(x0, x1, x2);

    function Kind$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $5460 = _result$2;
            var $5461 = BitsMap$values$(_defs$1);
            let _result$4 = $5460;
            let _defn$3;
            while ($5461._ === 'List.cons') {
                _defn$3 = $5461.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5462 = self.name;
                        var $5463 = self.term;
                        var $5464 = self.type;
                        var $5465 = self.stat;
                        var self = $5465;
                        switch (self._) {
                            case 'Kind.Status.init':
                            case 'Kind.Status.wait':
                            case 'Kind.Status.fail':
                                var $5467 = _result$4;
                                var $5466 = $5467;
                                break;
                            case 'Kind.Status.done':
                                var _name$14 = $5462;
                                var _term$15 = Kind$Core$show$($5463, 0n, List$nil);
                                var _type$16 = Kind$Core$show$($5464, 0n, List$nil);
                                var $5468 = String$flatten$(List$cons$(_result$4, List$cons$(_name$14, List$cons$(" : ", List$cons$(_type$16, List$cons$(" = ", List$cons$(_term$15, List$cons$(";\u{a}", List$nil))))))));
                                var $5466 = $5468;
                                break;
                        };
                        var $5460 = $5466;
                        break;
                };
                _result$4 = $5460;
                $5461 = $5461.tail;
            }
            return _result$4;
        })();
        var $5458 = _result$3;
        return $5458;
    };
    const Kind$Defs$core = x0 => Kind$Defs$core$(x0);

    function Kind$to_core$io$one$(_name$1) {
        var $5469 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5470 = _m$bind$2;
            return $5470;
        }))(Kind$Synth$one$(_name$1, BitsMap$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5472 = self.value;
                    var $5473 = $5472;
                    var _defs$3 = $5473;
                    break;
                case 'Maybe.none':
                    var $5474 = BitsMap$new;
                    var _defs$3 = $5474;
                    break;
            };
            var _defs$4 = BitsMap$map$((_defn$4 => {
                var self = _defn$4;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5476 = self.file;
                        var $5477 = self.code;
                        var $5478 = self.orig;
                        var $5479 = self.name;
                        var $5480 = self.term;
                        var $5481 = self.type;
                        var $5482 = self.isct;
                        var $5483 = self.arit;
                        var $5484 = self.stat;
                        var _term$14 = Kind$Term$inline$($5480, _defs$3);
                        var _type$15 = Kind$Term$inline$($5481, _defs$3);
                        var $5485 = Kind$Def$new$($5476, $5477, $5478, $5479, _term$14, _type$15, $5482, $5483, $5484);
                        var $5475 = $5485;
                        break;
                };
                return $5475;
            }), _defs$3);
            var $5471 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                var $5486 = _m$pure$6;
                return $5486;
            }))(Kind$Defs$core$(_defs$4));
            return $5471;
        }));
        return $5469;
    };
    const Kind$to_core$io$one = x0 => Kind$to_core$io$one$(x0);

    function IO$put_string$(_text$1) {
        var $5487 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $5488 = IO$end$(Unit$new);
            return $5488;
        }));
        return $5487;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $5489 = IO$put_string$((_text$1 + "\u{a}"));
        return $5489;
    };
    const IO$print = x0 => IO$print$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $5491 = self.value;
                var $5492 = _f$4($5491);
                var $5490 = $5492;
                break;
            case 'Maybe.none':
                var $5493 = Maybe$none;
                var $5490 = $5493;
                break;
        };
        return $5490;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $5494 = _new$2(Maybe$bind)(Maybe$some);
        return $5494;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Kind$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5496 = self.name;
                var self = ($5496 === "Nat.zero");
                if (self) {
                    var $5498 = Maybe$some$(0n);
                    var $5497 = $5498;
                } else {
                    var $5499 = Maybe$none;
                    var $5497 = $5499;
                };
                var $5495 = $5497;
                break;
            case 'Kind.Term.app':
                var $5500 = self.func;
                var $5501 = self.argm;
                var self = $5500;
                switch (self._) {
                    case 'Kind.Term.ref':
                        var $5503 = self.name;
                        var self = ($5503 === "Nat.succ");
                        if (self) {
                            var $5505 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $5506 = _m$bind$5;
                                return $5506;
                            }))(Kind$Term$show$as_nat$go$($5501))((_pred$5 => {
                                var $5507 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $5508 = _m$pure$7;
                                    return $5508;
                                }))(Nat$succ$(_pred$5));
                                return $5507;
                            }));
                            var $5504 = $5505;
                        } else {
                            var $5509 = Maybe$none;
                            var $5504 = $5509;
                        };
                        var $5502 = $5504;
                        break;
                    case 'Kind.Term.var':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                    case 'Kind.Term.ori':
                        var $5510 = Maybe$none;
                        var $5502 = $5510;
                        break;
                };
                var $5495 = $5502;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
            case 'Kind.Term.ori':
                var $5511 = Maybe$none;
                var $5495 = $5511;
                break;
        };
        return $5495;
    };
    const Kind$Term$show$as_nat$go = x0 => Kind$Term$show$as_nat$go$(x0);

    function Kind$Term$show$as_nat$(_term$1) {
        var $5512 = Maybe$mapped$(Kind$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5512;
    };
    const Kind$Term$show$as_nat = x0 => Kind$Term$show$as_nat$(x0);

    function Kind$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5514 = self.name;
                var $5515 = (_name$2 === $5514);
                var $5513 = $5515;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
            case 'Kind.Term.ori':
                var $5516 = Bool$false;
                var $5513 = $5516;
                break;
        };
        return $5513;
    };
    const Kind$Term$show$is_ref = x0 => x1 => Kind$Term$show$is_ref$(x0, x1);

    function Kind$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Kind$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $5518 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $5517 = $5518;
        } else {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $5520 = Bool$false;
                var _wrap$6 = $5520;
            } else {
                var $5521 = self.charCodeAt(0);
                var $5522 = self.slice(1);
                var $5523 = ($5521 === 40);
                var _wrap$6 = $5523;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $5524 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $5524;
            } else {
                var $5525 = _func$5;
                var _func$8 = $5525;
            };
            var $5519 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $5517 = $5519;
        };
        return $5517;
    };
    const Kind$Term$show$app$done = x0 => x1 => x2 => Kind$Term$show$app$done$(x0, x1, x2);

    function Kind$Term$show$app$(_term$1, _path$2, _args$3) {
        var Kind$Term$show$app$ = (_term$1, _path$2, _args$3) => ({
            ctr: 'TCO',
            arg: [_term$1, _path$2, _args$3]
        });
        var Kind$Term$show$app = _term$1 => _path$2 => _args$3 => Kind$Term$show$app$(_term$1, _path$2, _args$3);
        var arg = [_term$1, _path$2, _args$3];
        while (true) {
            let [_term$1, _path$2, _args$3] = arg;
            var R = (() => {
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $5526 = self.func;
                        var $5527 = self.argm;
                        var $5528 = Kind$Term$show$app$($5526, Kind$MPath$o$(_path$2), List$cons$(Kind$Term$show$go$($5527, Kind$MPath$i$(_path$2)), _args$3));
                        return $5528;
                    case 'Kind.Term.ori':
                        var $5529 = self.expr;
                        var $5530 = Kind$Term$show$app$($5529, _path$2, _args$3);
                        return $5530;
                    case 'Kind.Term.var':
                    case 'Kind.Term.ref':
                    case 'Kind.Term.typ':
                    case 'Kind.Term.all':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                    case 'Kind.Term.cse':
                        var $5531 = Kind$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $5531;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Term$show$app = x0 => x1 => x2 => Kind$Term$show$app$(x0, x1, x2);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $5533 = self.val;
                var $5534 = self.lft;
                var $5535 = self.rgt;
                var self = $5533;
                switch (self._) {
                    case 'Maybe.some':
                        var $5537 = self.value;
                        var $5538 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5537), _list$4);
                        var _list0$8 = $5538;
                        break;
                    case 'Maybe.none':
                        var $5539 = _list$4;
                        var _list0$8 = $5539;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($5534, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($5535, (_key$3 + '1'), _list1$9);
                var $5536 = _list2$10;
                var $5532 = $5536;
                break;
            case 'BitsMap.new':
                var $5540 = _list$4;
                var $5532 = $5540;
                break;
        };
        return $5532;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function BitsMap$to_list$(_xs$2) {
        var $5541 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5541;
    };
    const BitsMap$to_list = x0 => BitsMap$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5543 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5545 = List$cons$(_head$6, _tail$7);
                    var $5544 = $5545;
                } else {
                    var $5546 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5547 = Bits$chunks_of$go$(_len$1, $5543, $5546, _chunk$7);
                    var $5544 = $5547;
                };
                var $5542 = $5544;
                break;
            case 'i':
                var $5548 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5550 = List$cons$(_head$6, _tail$7);
                    var $5549 = $5550;
                } else {
                    var $5551 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5552 = Bits$chunks_of$go$(_len$1, $5548, $5551, _chunk$7);
                    var $5549 = $5552;
                };
                var $5542 = $5549;
                break;
            case 'e':
                var $5553 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5542 = $5553;
                break;
        };
        return $5542;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5554 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5554;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5556 = Word$e;
            var $5555 = $5556;
        } else {
            var $5557 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $5559 = self.slice(0, -1);
                    var $5560 = Word$o$(Word$from_bits$($5557, $5559));
                    var $5558 = $5560;
                    break;
                case 'i':
                    var $5561 = self.slice(0, -1);
                    var $5562 = Word$i$(Word$from_bits$($5557, $5561));
                    var $5558 = $5562;
                    break;
                case 'e':
                    var $5563 = Word$o$(Word$from_bits$($5557, Bits$e));
                    var $5558 = $5563;
                    break;
            };
            var $5555 = $5558;
        };
        return $5555;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Kind$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5566 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5566;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5568 = ((_u16$5 + 71) & 0xFFFF);
                    var $5567 = $5568;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5570 = (Math.max(_u16$5 - 4, 0));
                        var $5569 = $5570;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5572 = 46;
                            var $5571 = $5572;
                        } else {
                            var $5573 = 95;
                            var $5571 = $5573;
                        };
                        var $5569 = $5571;
                    };
                    var $5567 = $5569;
                };
                var _chr$6 = $5567;
            };
            var $5565 = String$cons$(_chr$6, _name$4);
            return $5565;
        }));
        var $5564 = _name$3;
        return $5564;
    };
    const Kind$Name$from_bits = x0 => Kind$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5575 = self.fst;
                var $5576 = $5575;
                var $5574 = $5576;
                break;
        };
        return $5574;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Kind$Term$show$go$(_term$1, _path$2) {
        var self = Kind$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.some':
                var $5578 = self.value;
                var $5579 = $5578;
                var $5577 = $5579;
                break;
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $5581 = self.name;
                        var $5582 = Kind$Name$show$($5581);
                        var $5580 = $5582;
                        break;
                    case 'Kind.Term.ref':
                        var $5583 = self.name;
                        var _name$4 = Kind$Name$show$($5583);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5585 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Kind$Path$to_bits$($5585));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5586 = String$flatten$(List$cons$(_name$4, List$cons$(Kind$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5584 = $5586;
                                break;
                            case 'Maybe.none':
                                var $5587 = _name$4;
                                var $5584 = $5587;
                                break;
                        };
                        var $5580 = $5584;
                        break;
                    case 'Kind.Term.all':
                        var $5588 = self.eras;
                        var $5589 = self.self;
                        var $5590 = self.name;
                        var $5591 = self.xtyp;
                        var $5592 = self.body;
                        var _eras$8 = $5588;
                        var _self$9 = Kind$Name$show$($5589);
                        var _name$10 = Kind$Name$show$($5590);
                        var _type$11 = Kind$Term$show$go$($5591, Kind$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5594 = "<";
                            var _open$12 = $5594;
                        } else {
                            var $5595 = "(";
                            var _open$12 = $5595;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5596 = ">";
                            var _clos$13 = $5596;
                        } else {
                            var $5597 = ")";
                            var _clos$13 = $5597;
                        };
                        var _body$14 = Kind$Term$show$go$($5592(Kind$Term$var$($5589, 0n))(Kind$Term$var$($5590, 0n)), Kind$MPath$i$(_path$2));
                        var $5593 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5580 = $5593;
                        break;
                    case 'Kind.Term.lam':
                        var $5598 = self.name;
                        var $5599 = self.body;
                        var _name$5 = Kind$Name$show$($5598);
                        var _body$6 = Kind$Term$show$go$($5599(Kind$Term$var$($5598, 0n)), Kind$MPath$o$(_path$2));
                        var $5600 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5580 = $5600;
                        break;
                    case 'Kind.Term.let':
                        var $5601 = self.name;
                        var $5602 = self.expr;
                        var $5603 = self.body;
                        var _name$6 = Kind$Name$show$($5601);
                        var _expr$7 = Kind$Term$show$go$($5602, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5603(Kind$Term$var$($5601, 0n)), Kind$MPath$i$(_path$2));
                        var $5604 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5580 = $5604;
                        break;
                    case 'Kind.Term.def':
                        var $5605 = self.name;
                        var $5606 = self.expr;
                        var $5607 = self.body;
                        var _name$6 = Kind$Name$show$($5605);
                        var _expr$7 = Kind$Term$show$go$($5606, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5607(Kind$Term$var$($5605, 0n)), Kind$MPath$i$(_path$2));
                        var $5608 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5580 = $5608;
                        break;
                    case 'Kind.Term.ann':
                        var $5609 = self.term;
                        var $5610 = self.type;
                        var _term$6 = Kind$Term$show$go$($5609, Kind$MPath$o$(_path$2));
                        var _type$7 = Kind$Term$show$go$($5610, Kind$MPath$i$(_path$2));
                        var $5611 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5580 = $5611;
                        break;
                    case 'Kind.Term.gol':
                        var $5612 = self.name;
                        var _name$6 = Kind$Name$show$($5612);
                        var $5613 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5580 = $5613;
                        break;
                    case 'Kind.Term.nat':
                        var $5614 = self.natx;
                        var $5615 = String$flatten$(List$cons$(Nat$show$($5614), List$nil));
                        var $5580 = $5615;
                        break;
                    case 'Kind.Term.chr':
                        var $5616 = self.chrx;
                        var $5617 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5616), List$cons$("\'", List$nil))));
                        var $5580 = $5617;
                        break;
                    case 'Kind.Term.str':
                        var $5618 = self.strx;
                        var $5619 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5618), List$cons$("\"", List$nil))));
                        var $5580 = $5619;
                        break;
                    case 'Kind.Term.cse':
                        var $5620 = self.expr;
                        var $5621 = self.name;
                        var $5622 = self.with;
                        var $5623 = self.cses;
                        var $5624 = self.moti;
                        var _expr$9 = Kind$Term$show$go$($5620, Kind$MPath$o$(_path$2));
                        var _name$10 = Kind$Name$show$($5621);
                        var _wyth$11 = String$join$("", List$mapped$($5622, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5627 = self.name;
                                    var $5628 = self.term;
                                    var $5629 = self.type;
                                    var _name$21 = Kind$Name$show$($5627);
                                    var _type$22 = Kind$Term$show$go$($5629, Maybe$none);
                                    var _term$23 = Kind$Term$show$go$($5628, Maybe$none);
                                    var $5630 = String$flatten$(List$cons$(_name$21, List$cons$(": ", List$cons$(_type$22, List$cons$(" = ", List$cons$(_term$23, List$cons$(";", List$nil)))))));
                                    var $5626 = $5630;
                                    break;
                            };
                            return $5626;
                        })));
                        var _cses$12 = BitsMap$to_list$($5623);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Kind$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Kind$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5631 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5631;
                        })));
                        var self = $5624;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5632 = self.value;
                                var $5633 = String$flatten$(List$cons$(": ", List$cons$(Kind$Term$show$go$($5632, Maybe$none), List$nil)));
                                var _moti$14 = $5633;
                                break;
                            case 'Maybe.none':
                                var $5634 = "";
                                var _moti$14 = $5634;
                                break;
                        };
                        var $5625 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5580 = $5625;
                        break;
                    case 'Kind.Term.ori':
                        var $5635 = self.expr;
                        var $5636 = Kind$Term$show$go$($5635, _path$2);
                        var $5580 = $5636;
                        break;
                    case 'Kind.Term.typ':
                        var $5637 = "Type";
                        var $5580 = $5637;
                        break;
                    case 'Kind.Term.app':
                        var $5638 = Kind$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5580 = $5638;
                        break;
                    case 'Kind.Term.hol':
                        var $5639 = "_";
                        var $5580 = $5639;
                        break;
                };
                var $5577 = $5580;
                break;
        };
        return $5577;
    };
    const Kind$Term$show$go = x0 => x1 => Kind$Term$show$go$(x0, x1);

    function Kind$Term$show$(_term$1) {
        var $5640 = Kind$Term$show$go$(_term$1, Maybe$none);
        return $5640;
    };
    const Kind$Term$show = x0 => Kind$Term$show$(x0);

    function Kind$Defs$report$types$(_defs$1, _names$2) {
        var _types$3 = "";
        var _types$4 = (() => {
            var $5643 = _types$3;
            var $5644 = _names$2;
            let _types$5 = $5643;
            let _name$4;
            while ($5644._ === 'List.cons') {
                _name$4 = $5644.head;
                var self = Kind$get$(_name$4, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5645 = self.value;
                        var self = $5645;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5647 = self.type;
                                var $5648 = (_types$5 + (_name$4 + (": " + (Kind$Term$show$($5647) + "\u{a}"))));
                                var $5646 = $5648;
                                break;
                        };
                        var $5643 = $5646;
                        break;
                    case 'Maybe.none':
                        var $5649 = _types$5;
                        var $5643 = $5649;
                        break;
                };
                _types$5 = $5643;
                $5644 = $5644.tail;
            }
            return _types$5;
        })();
        var $5641 = _types$4;
        return $5641;
    };
    const Kind$Defs$report$types = x0 => x1 => Kind$Defs$report$types$(x0, x1);

    function BitsMap$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
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
                        var $5656 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5656;
                        break;
                };
                var _list1$9 = BitsMap$keys$go$($5652, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$keys$go$($5653, (_key$3 + '1'), _list1$9);
                var $5654 = _list2$10;
                var $5650 = $5654;
                break;
            case 'BitsMap.new':
                var $5657 = _list$4;
                var $5650 = $5657;
                break;
        };
        return $5650;
    };
    const BitsMap$keys$go = x0 => x1 => x2 => BitsMap$keys$go$(x0, x1, x2);

    function BitsMap$keys$(_xs$2) {
        var $5658 = List$reverse$(BitsMap$keys$go$(_xs$2, Bits$e, List$nil));
        return $5658;
    };
    const BitsMap$keys = x0 => BitsMap$keys$(x0);

    function Kind$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.cons':
                var $5660 = self.head;
                var $5661 = self.tail;
                var self = $5660;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                    case 'Kind.Error.cant_infer':
                        var $5663 = (!_got$2);
                        var _keep$5 = $5663;
                        break;
                    case 'Kind.Error.show_goal':
                        var $5664 = Bool$true;
                        var _keep$5 = $5664;
                        break;
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                        var $5665 = Bool$false;
                        var _keep$5 = $5665;
                        break;
                };
                var self = $5660;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                        var $5666 = Bool$true;
                        var _got$6 = $5666;
                        break;
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                    case 'Kind.Error.cant_infer':
                        var $5667 = _got$2;
                        var _got$6 = $5667;
                        break;
                };
                var _tail$7 = Kind$Error$relevant$($5661, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5668 = List$cons$($5660, _tail$7);
                    var $5662 = $5668;
                } else {
                    var $5669 = _tail$7;
                    var $5662 = $5669;
                };
                var $5659 = $5662;
                break;
            case 'List.nil':
                var $5670 = List$nil;
                var $5659 = $5670;
                break;
        };
        return $5659;
    };
    const Kind$Error$relevant = x0 => x1 => Kind$Error$relevant$(x0, x1);

    function Kind$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.cons':
                var $5672 = self.head;
                var $5673 = self.tail;
                var self = $5672;
                switch (self._) {
                    case 'Pair.new':
                        var $5675 = self.fst;
                        var $5676 = self.snd;
                        var _name$6 = Kind$Name$show$($5675);
                        var _type$7 = Kind$Term$show$(Kind$Term$normalize$($5676, BitsMap$new));
                        var _rest$8 = Kind$Context$show$($5673);
                        var $5677 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5674 = $5677;
                        break;
                };
                var $5671 = $5674;
                break;
            case 'List.nil':
                var $5678 = "";
                var $5671 = $5678;
                break;
        };
        return $5671;
    };
    const Kind$Context$show = x0 => Kind$Context$show$(x0);

    function Kind$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5679 = Kind$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Kind.Term.ref':
                    var $5681 = self.name;
                    var self = Kind$get$($5681, _defs$3);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5683 = self.value;
                            var self = $5683;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5685 = self.term;
                                    var $5686 = $5685;
                                    var $5684 = $5686;
                                    break;
                            };
                            var $5682 = $5684;
                            break;
                        case 'Maybe.none':
                            var $5687 = Kind$Term$ref$($5681);
                            var $5682 = $5687;
                            break;
                    };
                    var $5680 = $5682;
                    break;
                case 'Kind.Term.var':
                case 'Kind.Term.typ':
                case 'Kind.Term.all':
                case 'Kind.Term.lam':
                case 'Kind.Term.app':
                case 'Kind.Term.let':
                case 'Kind.Term.def':
                case 'Kind.Term.ann':
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                case 'Kind.Term.ori':
                    var $5688 = _term$4;
                    var $5680 = $5688;
                    break;
            };
            return $5680;
        }));
        return $5679;
    };
    const Kind$Term$expand_at = x0 => x1 => x2 => Kind$Term$expand_at$(x0, x1, x2);

    function Kind$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5690 = self.name;
                var $5691 = self.indx;
                var $5692 = Kind$Term$var$($5690, $5691);
                var $5689 = $5692;
                break;
            case 'Kind.Term.ref':
                var $5693 = self.name;
                var self = Kind$get$($5693, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $5695 = self.value;
                        var self = $5695;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5697 = self.term;
                                var $5698 = self.isct;
                                var $5699 = self.arit;
                                var self = ($5698 && (_arity$3 > $5699));
                                if (self) {
                                    var $5701 = $5697;
                                    var $5700 = $5701;
                                } else {
                                    var $5702 = Kind$Term$ref$($5693);
                                    var $5700 = $5702;
                                };
                                var $5696 = $5700;
                                break;
                        };
                        var $5694 = $5696;
                        break;
                    case 'Maybe.none':
                        var $5703 = Kind$Term$ref$($5693);
                        var $5694 = $5703;
                        break;
                };
                var $5689 = $5694;
                break;
            case 'Kind.Term.all':
                var $5704 = self.eras;
                var $5705 = self.self;
                var $5706 = self.name;
                var $5707 = self.xtyp;
                var $5708 = self.body;
                var $5709 = Kind$Term$all$($5704, $5705, $5706, Kind$Term$expand_ct$($5707, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5710 = Kind$Term$expand_ct$($5708(_s$9)(_x$10), _defs$2, 0n);
                    return $5710;
                }));
                var $5689 = $5709;
                break;
            case 'Kind.Term.lam':
                var $5711 = self.name;
                var $5712 = self.body;
                var $5713 = Kind$Term$lam$($5711, (_x$6 => {
                    var $5714 = Kind$Term$expand_ct$($5712(_x$6), _defs$2, 0n);
                    return $5714;
                }));
                var $5689 = $5713;
                break;
            case 'Kind.Term.app':
                var $5715 = self.func;
                var $5716 = self.argm;
                var $5717 = Kind$Term$app$(Kind$Term$expand_ct$($5715, _defs$2, Nat$succ$(_arity$3)), Kind$Term$expand_ct$($5716, _defs$2, 0n));
                var $5689 = $5717;
                break;
            case 'Kind.Term.let':
                var $5718 = self.name;
                var $5719 = self.expr;
                var $5720 = self.body;
                var $5721 = Kind$Term$let$($5718, Kind$Term$expand_ct$($5719, _defs$2, 0n), (_x$7 => {
                    var $5722 = Kind$Term$expand_ct$($5720(_x$7), _defs$2, 0n);
                    return $5722;
                }));
                var $5689 = $5721;
                break;
            case 'Kind.Term.def':
                var $5723 = self.name;
                var $5724 = self.expr;
                var $5725 = self.body;
                var $5726 = Kind$Term$def$($5723, Kind$Term$expand_ct$($5724, _defs$2, 0n), (_x$7 => {
                    var $5727 = Kind$Term$expand_ct$($5725(_x$7), _defs$2, 0n);
                    return $5727;
                }));
                var $5689 = $5726;
                break;
            case 'Kind.Term.ann':
                var $5728 = self.done;
                var $5729 = self.term;
                var $5730 = self.type;
                var $5731 = Kind$Term$ann$($5728, Kind$Term$expand_ct$($5729, _defs$2, 0n), Kind$Term$expand_ct$($5730, _defs$2, 0n));
                var $5689 = $5731;
                break;
            case 'Kind.Term.gol':
                var $5732 = self.name;
                var $5733 = self.dref;
                var $5734 = self.verb;
                var $5735 = Kind$Term$gol$($5732, $5733, $5734);
                var $5689 = $5735;
                break;
            case 'Kind.Term.hol':
                var $5736 = self.path;
                var $5737 = Kind$Term$hol$($5736);
                var $5689 = $5737;
                break;
            case 'Kind.Term.nat':
                var $5738 = self.natx;
                var $5739 = Kind$Term$nat$($5738);
                var $5689 = $5739;
                break;
            case 'Kind.Term.chr':
                var $5740 = self.chrx;
                var $5741 = Kind$Term$chr$($5740);
                var $5689 = $5741;
                break;
            case 'Kind.Term.str':
                var $5742 = self.strx;
                var $5743 = Kind$Term$str$($5742);
                var $5689 = $5743;
                break;
            case 'Kind.Term.ori':
                var $5744 = self.orig;
                var $5745 = self.expr;
                var $5746 = Kind$Term$ori$($5744, $5745);
                var $5689 = $5746;
                break;
            case 'Kind.Term.typ':
                var $5747 = Kind$Term$typ;
                var $5689 = $5747;
                break;
            case 'Kind.Term.cse':
                var $5748 = _term$1;
                var $5689 = $5748;
                break;
        };
        return $5689;
    };
    const Kind$Term$expand_ct = x0 => x1 => x2 => Kind$Term$expand_ct$(x0, x1, x2);

    function Kind$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Kind$Term$normalize$(_term$2, BitsMap$new);
        var _term$5 = (() => {
            var $5751 = _term$4;
            var $5752 = _dref$1;
            let _term$6 = $5751;
            let _path$5;
            while ($5752._ === 'List.cons') {
                _path$5 = $5752.head;
                var _term$7 = Kind$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Kind$Term$normalize$(_term$7, BitsMap$new);
                var _term$9 = Kind$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Kind$Term$normalize$(_term$9, BitsMap$new);
                var $5751 = _term$10;
                _term$6 = $5751;
                $5752 = $5752.tail;
            }
            return _term$6;
        })();
        var $5749 = _term$5;
        return $5749;
    };
    const Kind$Term$expand = x0 => x1 => x2 => Kind$Term$expand$(x0, x1, x2);

    function Kind$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5754 = self.expected;
                var $5755 = self.detected;
                var $5756 = self.context;
                var self = $5754;
                switch (self._) {
                    case 'Either.left':
                        var $5758 = self.value;
                        var $5759 = $5758;
                        var _expected$7 = $5759;
                        break;
                    case 'Either.right':
                        var $5760 = self.value;
                        var $5761 = Kind$Term$show$(Kind$Term$normalize$($5760, BitsMap$new));
                        var _expected$7 = $5761;
                        break;
                };
                var self = $5755;
                switch (self._) {
                    case 'Either.left':
                        var $5762 = self.value;
                        var $5763 = $5762;
                        var _detected$8 = $5763;
                        break;
                    case 'Either.right':
                        var $5764 = self.value;
                        var $5765 = Kind$Term$show$(Kind$Term$normalize$($5764, BitsMap$new));
                        var _detected$8 = $5765;
                        break;
                };
                var $5757 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5756;
                    switch (self._) {
                        case 'List.nil':
                            var $5766 = "";
                            return $5766;
                        case 'List.cons':
                            var $5767 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Kind$Context$show$($5756), List$nil)));
                            return $5767;
                    };
                })(), List$nil)))))))));
                var $5753 = $5757;
                break;
            case 'Kind.Error.show_goal':
                var $5768 = self.name;
                var $5769 = self.dref;
                var $5770 = self.verb;
                var $5771 = self.goal;
                var $5772 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Kind$Name$show$($5768), List$cons$(":\u{a}", List$nil))));
                var self = $5771;
                switch (self._) {
                    case 'Maybe.some':
                        var $5774 = self.value;
                        var _goal$10 = Kind$Term$expand$($5769, $5774, _defs$2);
                        var $5775 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5770;
                            if (self) {
                                var $5776 = Kind$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5777 = _x$11;
                                    return $5777;
                                })));
                                return $5776;
                            } else {
                                var $5778 = Kind$Term$show$(_goal$10);
                                return $5778;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5775;
                        break;
                    case 'Maybe.none':
                        var $5779 = "";
                        var _with_type$9 = $5779;
                        break;
                };
                var self = $5772;
                switch (self._) {
                    case 'List.nil':
                        var $5780 = "";
                        var _with_ctxt$10 = $5780;
                        break;
                    case 'List.cons':
                        var $5781 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Kind$Context$show$($5772), List$nil)));
                        var _with_ctxt$10 = $5781;
                        break;
                };
                var $5773 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5753 = $5773;
                break;
            case 'Kind.Error.waiting':
                var $5782 = self.name;
                var $5783 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5782, List$cons$("\'.", List$nil))));
                var $5753 = $5783;
                break;
            case 'Kind.Error.indirect':
                var $5784 = self.name;
                var $5785 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5784, List$cons$("\'.", List$nil))));
                var $5753 = $5785;
                break;
            case 'Kind.Error.patch':
                var $5786 = self.term;
                var $5787 = String$flatten$(List$cons$("Patching: ", List$cons$(Kind$Term$show$($5786), List$nil)));
                var $5753 = $5787;
                break;
            case 'Kind.Error.undefined_reference':
                var $5788 = self.name;
                var $5789 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Kind$Name$show$($5788), List$cons$("\u{a}", List$nil))));
                var $5753 = $5789;
                break;
            case 'Kind.Error.cant_infer':
                var $5790 = self.term;
                var $5791 = self.context;
                var _term$6 = Kind$Term$show$($5790);
                var _context$7 = Kind$Context$show$($5791);
                var $5792 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5753 = $5792;
                break;
        };
        return $5753;
    };
    const Kind$Error$show = x0 => x1 => Kind$Error$show$(x0, x1);

    function Kind$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5794 = self.origin;
                var $5795 = $5794;
                var $5793 = $5795;
                break;
            case 'Kind.Error.undefined_reference':
                var $5796 = self.origin;
                var $5797 = $5796;
                var $5793 = $5797;
                break;
            case 'Kind.Error.cant_infer':
                var $5798 = self.origin;
                var $5799 = $5798;
                var $5793 = $5799;
                break;
            case 'Kind.Error.show_goal':
            case 'Kind.Error.waiting':
            case 'Kind.Error.indirect':
            case 'Kind.Error.patch':
                var $5800 = Maybe$none;
                var $5793 = $5800;
                break;
        };
        return $5793;
    };
    const Kind$Error$origin = x0 => Kind$Error$origin$(x0);

    function Kind$Defs$report$errors$(_defs$1) {
        var _errors$2 = "";
        var _errors$3 = (() => {
            var $5803 = _errors$2;
            var $5804 = BitsMap$keys$(_defs$1);
            let _errors$4 = $5803;
            let _key$3;
            while ($5804._ === 'List.cons') {
                _key$3 = $5804.head;
                var _name$5 = Kind$Name$from_bits$(_key$3);
                var self = Kind$get$(_name$5, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5805 = self.value;
                        var self = $5805;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5807 = self.file;
                                var $5808 = self.code;
                                var $5809 = self.name;
                                var $5810 = self.stat;
                                var self = $5810;
                                switch (self._) {
                                    case 'Kind.Status.fail':
                                        var $5812 = self.errors;
                                        var self = $5812;
                                        switch (self._) {
                                            case 'List.nil':
                                                var $5814 = _errors$4;
                                                var $5813 = $5814;
                                                break;
                                            case 'List.cons':
                                                var _name_str$19 = $5809;
                                                var _rel_errs$20 = Kind$Error$relevant$($5812, Bool$false);
                                                var _errors$21 = (() => {
                                                    var $5817 = _errors$4;
                                                    var $5818 = _rel_errs$20;
                                                    let _errors$22 = $5817;
                                                    let _err$21;
                                                    while ($5818._ === 'List.cons') {
                                                        _err$21 = $5818.head;
                                                        var _err_msg$23 = Kind$Error$show$(_err$21, _defs$1);
                                                        var self = Kind$Error$origin$(_err$21);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $5819 = self.value;
                                                                var self = $5819;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $5821 = self.fst;
                                                                        var $5822 = self.snd;
                                                                        var _inside$27 = ("Inside \'" + ($5807 + "\':\u{a}"));
                                                                        var _source$28 = Kind$highlight$($5808, $5821, $5822);
                                                                        var $5823 = (_inside$27 + (_source$28 + "\u{a}"));
                                                                        var $5820 = $5823;
                                                                        break;
                                                                };
                                                                var _ori_msg$24 = $5820;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $5824 = "";
                                                                var _ori_msg$24 = $5824;
                                                                break;
                                                        };
                                                        var $5817 = (_errors$22 + (_err_msg$23 + (_ori_msg$24 + "\u{a}")));
                                                        _errors$22 = $5817;
                                                        $5818 = $5818.tail;
                                                    }
                                                    return _errors$22;
                                                })();
                                                var $5815 = _errors$21;
                                                var $5813 = $5815;
                                                break;
                                        };
                                        var $5811 = $5813;
                                        break;
                                    case 'Kind.Status.init':
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $5825 = _errors$4;
                                        var $5811 = $5825;
                                        break;
                                };
                                var $5806 = $5811;
                                break;
                        };
                        var $5803 = $5806;
                        break;
                    case 'Maybe.none':
                        var $5826 = _errors$4;
                        var $5803 = $5826;
                        break;
                };
                _errors$4 = $5803;
                $5804 = $5804.tail;
            }
            return _errors$4;
        })();
        var $5801 = _errors$3;
        return $5801;
    };
    const Kind$Defs$report$errors = x0 => Kind$Defs$report$errors$(x0);

    function Kind$Defs$report$(_defs$1, _names$2) {
        var _types$3 = Kind$Defs$report$types$(_defs$1, _names$2);
        var _errors$4 = Kind$Defs$report$errors$(_defs$1);
        var self = _errors$4;
        if (self.length === 0) {
            var $5828 = "All terms check.";
            var _errors$5 = $5828;
        } else {
            var $5829 = self.charCodeAt(0);
            var $5830 = self.slice(1);
            var $5831 = _errors$4;
            var _errors$5 = $5831;
        };
        var $5827 = (_types$3 + ("\u{a}" + _errors$5));
        return $5827;
    };
    const Kind$Defs$report = x0 => x1 => Kind$Defs$report$(x0, x1);

    function Kind$checker$io$one$(_name$1) {
        var $5832 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5833 = _m$bind$2;
            return $5833;
        }))(Kind$Synth$one$(_name$1, BitsMap$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5835 = self.value;
                    var $5836 = IO$print$(Kind$Defs$report$($5835, List$cons$(_name$1, List$nil)));
                    var $5834 = $5836;
                    break;
                case 'Maybe.none':
                    var _notfound$3 = ("Term not found: \'" + (_name$1 + "\'."));
                    var _filelist$4 = List$mapped$(Kind$Synth$files_of$(_name$1), (_x$4 => {
                        var $5838 = ("\'" + (_x$4 + "\'"));
                        return $5838;
                    }));
                    var _searched$5 = ("Searched on: " + (String$join$(", ", _filelist$4) + "."));
                    var $5837 = IO$print$((_notfound$3 + ("\u{a}" + _searched$5)));
                    var $5834 = $5837;
                    break;
            };
            return $5834;
        }));
        return $5832;
    };
    const Kind$checker$io$one = x0 => Kind$checker$io$one$(x0);

    function Kind$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $5840 = self.head;
                var $5841 = self.tail;
                var $5842 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $5843 = _m$bind$5;
                    return $5843;
                }))(Kind$Synth$one$($5840, _defs$2))((_new_defs$5 => {
                    var self = _new_defs$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5845 = self.value;
                            var $5846 = Kind$Synth$many$($5841, $5845);
                            var $5844 = $5846;
                            break;
                        case 'Maybe.none':
                            var $5847 = Kind$Synth$many$($5841, _defs$2);
                            var $5844 = $5847;
                            break;
                    };
                    return $5844;
                }));
                var $5839 = $5842;
                break;
            case 'List.nil':
                var $5848 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5849 = _m$pure$4;
                    return $5849;
                }))(_defs$2);
                var $5839 = $5848;
                break;
        };
        return $5839;
    };
    const Kind$Synth$many = x0 => x1 => Kind$Synth$many$(x0, x1);

    function Kind$Synth$file$(_file$1, _defs$2) {
        var $5850 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $5851 = _m$bind$3;
            return $5851;
        }))(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Kind$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5853 = self.value;
                    var $5854 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $5855 = _m$pure$7;
                        return $5855;
                    }))(Either$left$($5853));
                    var $5852 = $5854;
                    break;
                case 'Either.right':
                    var $5856 = self.value;
                    var _file_defs$6 = $5856;
                    var _file_keys$7 = BitsMap$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Kind$Name$from_bits);
                    var $5857 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $5858 = _m$bind$9;
                        return $5858;
                    }))(Kind$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5859 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $5860 = _m$pure$11;
                            return $5860;
                        }))(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5859;
                    }));
                    var $5852 = $5857;
                    break;
            };
            return $5852;
        }));
        return $5850;
    };
    const Kind$Synth$file = x0 => x1 => Kind$Synth$file$(x0, x1);

    function Kind$checker$io$file$(_file$1) {
        var $5861 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5862 = _m$bind$2;
            return $5862;
        }))(Kind$Synth$file$(_file$1, BitsMap$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5864 = self.value;
                    var $5865 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                        var $5866 = _m$bind$4;
                        return $5866;
                    }))(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5867 = IO$print$($5864);
                        return $5867;
                    }));
                    var $5863 = $5865;
                    break;
                case 'Either.right':
                    var $5868 = self.value;
                    var self = $5868;
                    switch (self._) {
                        case 'Pair.new':
                            var $5870 = self.fst;
                            var $5871 = self.snd;
                            var _nams$6 = $5870;
                            var _defs$7 = $5871;
                            var self = _nams$6;
                            switch (self._) {
                                case 'List.nil':
                                    var $5873 = IO$print$(("File not found or empty: \'" + (_file$1 + "\'.")));
                                    var $5872 = $5873;
                                    break;
                                case 'List.cons':
                                    var $5874 = IO$print$(Kind$Defs$report$(_defs$7, _nams$6));
                                    var $5872 = $5874;
                                    break;
                            };
                            var $5869 = $5872;
                            break;
                    };
                    var $5863 = $5869;
                    break;
            };
            return $5863;
        }));
        return $5861;
    };
    const Kind$checker$io$file = x0 => Kind$checker$io$file$(x0);

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
                        var $5875 = self.value;
                        var $5876 = $5875;
                        return $5876;
                    case 'IO.ask':
                        var $5877 = self.then;
                        var $5878 = IO$purify$($5877(""));
                        return $5878;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const IO$purify = x0 => IO$purify$(x0);

    function Kind$checker$code$(_code$1) {
        var self = Kind$Defs$read$("Main.kind", _code$1, BitsMap$new);
        switch (self._) {
            case 'Either.left':
                var $5880 = self.value;
                var $5881 = $5880;
                var $5879 = $5881;
                break;
            case 'Either.right':
                var $5882 = self.value;
                var $5883 = IO$purify$((() => {
                    var _defs$3 = $5882;
                    var _nams$4 = List$mapped$(BitsMap$keys$(_defs$3), Kind$Name$from_bits);
                    var $5884 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $5885 = _m$bind$5;
                        return $5885;
                    }))(Kind$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5886 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $5887 = _m$pure$7;
                            return $5887;
                        }))(Kind$Defs$report$(_defs$5, _nams$4));
                        return $5886;
                    }));
                    return $5884;
                })());
                var $5879 = $5883;
                break;
        };
        return $5879;
    };
    const Kind$checker$code = x0 => Kind$checker$code$(x0);

    function Kind$Term$read$(_code$1) {
        var self = Kind$Parser$term$(0n, _code$1);
        switch (self._) {
            case 'Parser.Reply.value':
                var $5889 = self.val;
                var $5890 = Maybe$some$($5889);
                var $5888 = $5890;
                break;
            case 'Parser.Reply.error':
                var $5891 = Maybe$none;
                var $5888 = $5891;
                break;
        };
        return $5888;
    };
    const Kind$Term$read = x0 => Kind$Term$read$(x0);
    const Kind = (() => {
        var __$1 = Kind$to_core$io$one;
        var __$2 = Kind$checker$io$one;
        var __$3 = Kind$checker$io$file;
        var __$4 = Kind$checker$code;
        var __$5 = Kind$Term$read;
        var $5892 = IO$monad$((_m$bind$6 => _m$pure$7 => {
            var $5893 = _m$pure$7;
            return $5893;
        }))(Unit$new);
        return $5892;
    })();
    return {
        '$main$': () => run(Kind),
        'run': run,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Maybe': Maybe,
        'BitsMap': BitsMap,
        'Maybe.none': Maybe$none,
        'BitsMap.get': BitsMap$get,
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
        'Kind.Name.to_bits': Kind$Name$to_bits,
        'Kind.get': Kind$get,
        'IO.get_file': IO$get_file,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.is_eof': Parser$is_eof,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser': Parser,
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
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Parser.until.go': Parser$until$go,
        'Parser.until': Parser$until,
        'Parser.one': Parser$one,
        'Kind.Parser.spaces': Kind$Parser$spaces,
        'Parser.get_index': Parser$get_index,
        'Kind.Parser.init': Kind$Parser$init,
        'Parser.many1': Parser$many1,
        'Kind.Name.is_letter': Kind$Name$is_letter,
        'Kind.Parser.letter': Kind$Parser$letter,
        'List.fold': List$fold,
        'Kind.Parser.name1': Kind$Parser$name1,
        'Kind.Parser.text': Kind$Parser$text,
        'Parser.until1': Parser$until1,
        'Pair': Pair,
        'Parser.maybe': Parser$maybe,
        'Kind.Parser.item': Kind$Parser$item,
        'Kind.Parser.name': Kind$Parser$name,
        'Kind.Term.all': Kind$Term$all,
        'Pair.new': Pair$new,
        'Kind.Parser.stop': Kind$Parser$stop,
        'Kind.Term.ori': Kind$Term$ori,
        'Kind.Parser.forall': Kind$Parser$forall,
        'Kind.Term.lam': Kind$Term$lam,
        'Kind.Parser.make_lambda': Kind$Parser$make_lambda,
        'Kind.Parser.lambda': Kind$Parser$lambda,
        'Kind.Parser.lambda.erased': Kind$Parser$lambda$erased,
        'Kind.Parser.lambda.nameless': Kind$Parser$lambda$nameless,
        'Kind.Parser.parenthesis': Kind$Parser$parenthesis,
        'Kind.Term.ref': Kind$Term$ref,
        'Kind.Term.app': Kind$Term$app,
        'Kind.Term.hol': Kind$Term$hol,
        'Kind.Term.let': Kind$Term$let,
        'Kind.Parser.letforrange.u32': Kind$Parser$letforrange$u32,
        'Kind.Parser.letforrange.nat': Kind$Parser$letforrange$nat,
        'Kind.Parser.letforin': Kind$Parser$letforin,
        'Kind.Parser.let': Kind$Parser$let,
        'Kind.Parser.get': Kind$Parser$get,
        'Kind.Term.def': Kind$Term$def,
        'Kind.Parser.def': Kind$Parser$def,
        'Kind.Parser.goal_rewrite': Kind$Parser$goal_rewrite,
        'Kind.Parser.if': Kind$Parser$if,
        'List.mapped': List$mapped,
        'Kind.backslash': Kind$backslash,
        'Kind.escapes': Kind$escapes,
        'Kind.Parser.char.single': Kind$Parser$char$single,
        'Kind.Term.chr': Kind$Term$chr,
        'Kind.Parser.char': Kind$Parser$char,
        'String.reverse.go': String$reverse$go,
        'String.reverse': String$reverse,
        'Kind.Parser.string.go': Kind$Parser$string$go,
        'Kind.Term.str': Kind$Term$str,
        'Kind.Parser.string': Kind$Parser$string,
        'Kind.Parser.pair': Kind$Parser$pair,
        'Kind.Parser.sigma.type': Kind$Parser$sigma$type,
        'Kind.Parser.some': Kind$Parser$some,
        'Kind.Parser.apply': Kind$Parser$apply,
        'Kind.Parser.mirror': Kind$Parser$mirror,
        'Kind.Name.read': Kind$Name$read,
        'Kind.Parser.list': Kind$Parser$list,
        'Kind.Parser.map': Kind$Parser$map,
        'Kind.Parser.log': Kind$Parser$log,
        'Kind.Parser.do.statements': Kind$Parser$do$statements,
        'Kind.Parser.do': Kind$Parser$do,
        'Kind.Term.nat': Kind$Term$nat,
        'Kind.Term.unroll_nat': Kind$Term$unroll_nat,
        'U16.to_bits': U16$to_bits,
        'Kind.Term.unroll_chr.bits': Kind$Term$unroll_chr$bits,
        'Kind.Term.unroll_chr': Kind$Term$unroll_chr,
        'Kind.Term.unroll_str': Kind$Term$unroll_str,
        'Kind.Term.reduce': Kind$Term$reduce,
        'BitsMap.new': BitsMap$new,
        'Kind.Def.new': Kind$Def$new,
        'Kind.Status.init': Kind$Status$init,
        'Kind.Parser.case.with': Kind$Parser$case$with,
        'Kind.Parser.case.case': Kind$Parser$case$case,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.set': BitsMap$set,
        'BitsMap.from_list': BitsMap$from_list,
        'Kind.Term.cse': Kind$Term$cse,
        'Kind.Parser.case': Kind$Parser$case,
        'Kind.set': Kind$set,
        'Kind.Parser.open': Kind$Parser$open,
        'Kind.Parser.without': Kind$Parser$without,
        'Kind.Parser.switch.case': Kind$Parser$switch$case,
        'Kind.Parser.switch': Kind$Parser$switch,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Bits.tail': Bits$tail,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'Maybe.to_bool': Maybe$to_bool,
        'Kind.Term.gol': Kind$Term$gol,
        'Kind.Parser.goal': Kind$Parser$goal,
        'Kind.Parser.hole': Kind$Parser$hole,
        'Kind.Parser.u8': Kind$Parser$u8,
        'Kind.Parser.u16': Kind$Parser$u16,
        'Kind.Parser.u32': Kind$Parser$u32,
        'Kind.Parser.u64': Kind$Parser$u64,
        'Kind.Parser.nat': Kind$Parser$nat,
        'String.eql': String$eql,
        'Parser.fail': Parser$fail,
        'Kind.Term.typ': Kind$Term$typ,
        'Kind.Parser.reference': Kind$Parser$reference,
        'List.for': List$for,
        'Kind.Parser.application': Kind$Parser$application,
        'Parser.spaces': Parser$spaces,
        'Parser.spaces_text': Parser$spaces_text,
        'Kind.Parser.application.erased': Kind$Parser$application$erased,
        'Kind.Parser.arrow': Kind$Parser$arrow,
        'Kind.Parser.op': Kind$Parser$op,
        'Kind.Parser.add': Kind$Parser$add,
        'Kind.Parser.sub': Kind$Parser$sub,
        'Kind.Parser.mul': Kind$Parser$mul,
        'Kind.Parser.div': Kind$Parser$div,
        'Kind.Parser.mod': Kind$Parser$mod,
        'Kind.Parser.cons': Kind$Parser$cons,
        'Kind.Parser.concat': Kind$Parser$concat,
        'Kind.Parser.string_concat': Kind$Parser$string_concat,
        'Kind.Parser.sigma': Kind$Parser$sigma,
        'Kind.Parser.equality': Kind$Parser$equality,
        'Kind.Parser.inequality': Kind$Parser$inequality,
        'Kind.Parser.rewrite': Kind$Parser$rewrite,
        'Kind.Term.ann': Kind$Term$ann,
        'Kind.Parser.annotation': Kind$Parser$annotation,
        'Kind.Parser.application.hole': Kind$Parser$application$hole,
        'Kind.Parser.suffix': Kind$Parser$suffix,
        'Kind.Parser.term': Kind$Parser$term,
        'Kind.Parser.name_term': Kind$Parser$name_term,
        'Kind.Binder.new': Kind$Binder$new,
        'Kind.Parser.binder.homo': Kind$Parser$binder$homo,
        'List.concat': List$concat,
        'List.flatten': List$flatten,
        'Kind.Parser.binder': Kind$Parser$binder,
        'List.length': List$length,
        'Kind.Parser.make_forall': Kind$Parser$make_forall,
        'List.at': List$at,
        'List.at_last': List$at_last,
        'Kind.Term.var': Kind$Term$var,
        'Pair.snd': Pair$snd,
        'Kind.Context.get_name_skips': Kind$Context$get_name_skips,
        'Kind.Name.eql': Kind$Name$eql,
        'Kind.Context.find.go': Kind$Context$find$go,
        'Kind.Context.find': Kind$Context$find,
        'Kind.Path.o': Kind$Path$o,
        'Kind.Path.i': Kind$Path$i,
        'Kind.Path.to_bits': Kind$Path$to_bits,
        'Kind.Term.bind': Kind$Term$bind,
        'Kind.Status.done': Kind$Status$done,
        'Kind.define': Kind$define,
        'Kind.Parser.file.def': Kind$Parser$file$def,
        'Maybe.default': Maybe$default,
        'Kind.Constructor.new': Kind$Constructor$new,
        'Kind.Parser.constructor': Kind$Parser$constructor,
        'Kind.Datatype.new': Kind$Datatype$new,
        'Kind.Parser.datatype': Kind$Parser$datatype,
        'Kind.Datatype.build_term.motive.go': Kind$Datatype$build_term$motive$go,
        'Kind.Datatype.build_term.motive': Kind$Datatype$build_term$motive,
        'Kind.Datatype.build_term.constructor.go': Kind$Datatype$build_term$constructor$go,
        'Kind.Datatype.build_term.constructor': Kind$Datatype$build_term$constructor,
        'Kind.Datatype.build_term.constructors.go': Kind$Datatype$build_term$constructors$go,
        'Kind.Datatype.build_term.constructors': Kind$Datatype$build_term$constructors,
        'Kind.Datatype.build_term.go': Kind$Datatype$build_term$go,
        'Kind.Datatype.build_term': Kind$Datatype$build_term,
        'Kind.Datatype.build_type.go': Kind$Datatype$build_type$go,
        'Kind.Datatype.build_type': Kind$Datatype$build_type,
        'Kind.Constructor.build_term.opt.go': Kind$Constructor$build_term$opt$go,
        'Kind.Constructor.build_term.opt': Kind$Constructor$build_term$opt,
        'Kind.Constructor.build_term.go': Kind$Constructor$build_term$go,
        'Kind.Constructor.build_term': Kind$Constructor$build_term,
        'Kind.Constructor.build_type.go': Kind$Constructor$build_type$go,
        'Kind.Constructor.build_type': Kind$Constructor$build_type,
        'Kind.Parser.file.adt': Kind$Parser$file$adt,
        'Parser.eof': Parser$eof,
        'Kind.Parser.file.end': Kind$Parser$file$end,
        'Kind.Parser.file': Kind$Parser$file,
        'Either': Either,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Kind.highlight.end': Kind$highlight$end,
        'Maybe.extract': Maybe$extract,
        'Nat.is_zero': Nat$is_zero,
        'Nat.double': Nat$double,
        'Nat.pred': Nat$pred,
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
        'Kind.color': Kind$color,
        'Nat.eql': Nat$eql,
        'List.take': List$take,
        'Kind.highlight.tc': Kind$highlight$tc,
        'Kind.highlight': Kind$highlight,
        'Kind.Defs.read': Kind$Defs$read,
        'Kind.Synth.load.go': Kind$Synth$load$go,
        'Kind.Synth.files_of.make': Kind$Synth$files_of$make,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'String.drop': String$drop,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.split.go': String$split$go,
        'String.split': String$split,
        'Kind.Synth.files_of': Kind$Synth$files_of,
        'Kind.Synth.load': Kind$Synth$load,
        'Kind.Status.wait': Kind$Status$wait,
        'Kind.Check': Kind$Check,
        'Kind.Check.result': Kind$Check$result,
        'Kind.Error.undefined_reference': Kind$Error$undefined_reference,
        'Kind.Error.waiting': Kind$Error$waiting,
        'Kind.Error.indirect': Kind$Error$indirect,
        'Maybe.mapped': Maybe$mapped,
        'Kind.MPath.o': Kind$MPath$o,
        'Kind.MPath.i': Kind$MPath$i,
        'Kind.Error.patch': Kind$Error$patch,
        'Kind.MPath.to_bits': Kind$MPath$to_bits,
        'Kind.Error.type_mismatch': Kind$Error$type_mismatch,
        'Kind.Error.show_goal': Kind$Error$show_goal,
        'Kind.Term.normalize': Kind$Term$normalize,
        'List.tail': List$tail,
        'Kind.SmartMotive.vals.cont': Kind$SmartMotive$vals$cont,
        'Kind.SmartMotive.vals': Kind$SmartMotive$vals,
        'Kind.SmartMotive.nams.cont': Kind$SmartMotive$nams$cont,
        'Kind.SmartMotive.nams': Kind$SmartMotive$nams,
        'List.zip': List$zip,
        'Nat.gte': Nat$gte,
        'Nat.sub': Nat$sub,
        'Kind.Term.serialize.name': Kind$Term$serialize$name,
        'Kind.Term.serialize': Kind$Term$serialize,
        'Bits.eql': Bits$eql,
        'Kind.Term.identical': Kind$Term$identical,
        'Kind.SmartMotive.replace': Kind$SmartMotive$replace,
        'Kind.SmartMotive.make': Kind$SmartMotive$make,
        'Kind.Term.desugar_cse.motive': Kind$Term$desugar_cse$motive,
        'String.is_empty': String$is_empty,
        'Kind.Term.desugar_cse.argument': Kind$Term$desugar_cse$argument,
        'Maybe.or': Maybe$or,
        'Kind.Term.desugar_cse.cases': Kind$Term$desugar_cse$cases,
        'Kind.Term.desugar_cse': Kind$Term$desugar_cse,
        'Kind.Error.cant_infer': Kind$Error$cant_infer,
        'BitsSet.has': BitsSet$has,
        'BitsSet.mut.has': BitsSet$mut$has,
        'Kind.Term.equal.extra_holes.funari': Kind$Term$equal$extra_holes$funari,
        'Bool.or': Bool$or,
        'Kind.Term.has_holes': Kind$Term$has_holes,
        'Kind.Term.equal.hole': Kind$Term$equal$hole,
        'Kind.Term.equal.extra_holes.filler': Kind$Term$equal$extra_holes$filler,
        'Kind.Term.equal.extra_holes': Kind$Term$equal$extra_holes,
        'BitsSet.set': BitsSet$set,
        'BitsSet.mut.set': BitsSet$mut$set,
        'Bool.eql': Bool$eql,
        'Kind.Term.equal': Kind$Term$equal,
        'BitsSet.new': BitsSet$new,
        'BitsSet.mut.new': BitsSet$mut$new,
        'Kind.Term.check': Kind$Term$check,
        'Kind.Path.nil': Kind$Path$nil,
        'Kind.MPath.nil': Kind$MPath$nil,
        'List.is_empty': List$is_empty,
        'Kind.Term.patch_at': Kind$Term$patch_at,
        'Kind.Synth.fix': Kind$Synth$fix,
        'Kind.Status.fail': Kind$Status$fail,
        'Kind.Synth.one': Kind$Synth$one,
        'BitsMap.map': BitsMap$map,
        'Kind.Term.inline.names': Kind$Term$inline$names,
        'Kind.Term.inline.reduce': Kind$Term$inline$reduce,
        'Kind.Term.inline': Kind$Term$inline,
        'BitsMap.values.go': BitsMap$values$go,
        'BitsMap.values': BitsMap$values,
        'Kind.Core.var_name': Kind$Core$var_name,
        'Kind.Name.show': Kind$Name$show,
        'Bits.to_nat': Bits$to_nat,
        'U16.show_hex': U16$show_hex,
        'Kind.escape.char': Kind$escape$char,
        'Kind.escape.go': Kind$escape$go,
        'Kind.escape': Kind$escape,
        'Kind.Core.show': Kind$Core$show,
        'Kind.Defs.core': Kind$Defs$core,
        'Kind.to_core.io.one': Kind$to_core$io$one,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Kind.Term.show.as_nat.go': Kind$Term$show$as_nat$go,
        'Kind.Term.show.as_nat': Kind$Term$show$as_nat,
        'Kind.Term.show.is_ref': Kind$Term$show$is_ref,
        'Kind.Term.show.app.done': Kind$Term$show$app$done,
        'Kind.Term.show.app': Kind$Term$show$app,
        'BitsMap.to_list.go': BitsMap$to_list$go,
        'BitsMap.to_list': BitsMap$to_list,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Word.from_bits': Word$from_bits,
        'Kind.Name.from_bits': Kind$Name$from_bits,
        'Pair.fst': Pair$fst,
        'Kind.Term.show.go': Kind$Term$show$go,
        'Kind.Term.show': Kind$Term$show,
        'Kind.Defs.report.types': Kind$Defs$report$types,
        'BitsMap.keys.go': BitsMap$keys$go,
        'BitsMap.keys': BitsMap$keys,
        'Kind.Error.relevant': Kind$Error$relevant,
        'Kind.Context.show': Kind$Context$show,
        'Kind.Term.expand_at': Kind$Term$expand_at,
        'Kind.Term.expand_ct': Kind$Term$expand_ct,
        'Kind.Term.expand': Kind$Term$expand,
        'Kind.Error.show': Kind$Error$show,
        'Kind.Error.origin': Kind$Error$origin,
        'Kind.Defs.report.errors': Kind$Defs$report$errors,
        'Kind.Defs.report': Kind$Defs$report,
        'Kind.checker.io.one': Kind$checker$io$one,
        'Kind.Synth.many': Kind$Synth$many,
        'Kind.Synth.file': Kind$Synth$file,
        'Kind.checker.io.file': Kind$checker$io$file,
        'IO.purify': IO$purify,
        'Kind.checker.code': Kind$checker$code,
        'Kind.Term.read': Kind$Term$read,
        'Kind': Kind,
    };
})();