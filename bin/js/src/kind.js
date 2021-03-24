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

    function Pair$new$(_fst$3, _snd$4) {
        var $462 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $462;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Kind$Parser$stop$(_from$1, _idx$2, _code$3) {
        var self = Parser$get_index$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $464 = self.idx;
                var $465 = self.code;
                var $466 = self.err;
                var $467 = Parser$Reply$error$($464, $465, $466);
                var $463 = $467;
                break;
            case 'Parser.Reply.value':
                var $468 = self.idx;
                var $469 = self.code;
                var $470 = self.val;
                var _orig$7 = Pair$new$(_from$1, $470);
                var $471 = Parser$Reply$value$($468, $469, _orig$7);
                var $463 = $471;
                break;
        };
        return $463;
    };
    const Kind$Parser$stop = x0 => x1 => x2 => Kind$Parser$stop$(x0, x1, x2);

    function Kind$Term$ori$(_orig$1, _expr$2) {
        var $472 = ({
            _: 'Kind.Term.ori',
            'orig': _orig$1,
            'expr': _expr$2
        });
        return $472;
    };
    const Kind$Term$ori = x0 => x1 => Kind$Term$ori$(x0, x1);
    const Kind$Term$typ = ({
        _: 'Kind.Term.typ'
    });

    function Kind$Parser$type$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $474 = self.idx;
                var $475 = self.code;
                var $476 = self.err;
                var $477 = Parser$Reply$error$($474, $475, $476);
                var $473 = $477;
                break;
            case 'Parser.Reply.value':
                var $478 = self.idx;
                var $479 = self.code;
                var $480 = self.val;
                var self = Kind$Parser$text$("Type", $478, $479);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $482 = self.idx;
                        var $483 = self.code;
                        var $484 = self.err;
                        var $485 = Parser$Reply$error$($482, $483, $484);
                        var $481 = $485;
                        break;
                    case 'Parser.Reply.value':
                        var $486 = self.idx;
                        var $487 = self.code;
                        var self = Kind$Parser$stop$($480, $486, $487);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $489 = self.idx;
                                var $490 = self.code;
                                var $491 = self.err;
                                var $492 = Parser$Reply$error$($489, $490, $491);
                                var $488 = $492;
                                break;
                            case 'Parser.Reply.value':
                                var $493 = self.idx;
                                var $494 = self.code;
                                var $495 = self.val;
                                var $496 = Parser$Reply$value$($493, $494, Kind$Term$ori$($495, Kind$Term$typ));
                                var $488 = $496;
                                break;
                        };
                        var $481 = $488;
                        break;
                };
                var $473 = $481;
                break;
        };
        return $473;
    };
    const Kind$Parser$type = x0 => x1 => Kind$Parser$type$(x0, x1);

    function Kind$Term$all$(_eras$1, _self$2, _name$3, _xtyp$4, _body$5) {
        var $497 = ({
            _: 'Kind.Term.all',
            'eras': _eras$1,
            'self': _self$2,
            'name': _name$3,
            'xtyp': _xtyp$4,
            'body': _body$5
        });
        return $497;
    };
    const Kind$Term$all = x0 => x1 => x2 => x3 => x4 => Kind$Term$all$(x0, x1, x2, x3, x4);

    function Kind$Parser$forall$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $505 = self.val;
                var self = Kind$Parser$name$($503, $504);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $507 = self.idx;
                        var $508 = self.code;
                        var $509 = self.err;
                        var $510 = Parser$Reply$error$($507, $508, $509);
                        var $506 = $510;
                        break;
                    case 'Parser.Reply.value':
                        var $511 = self.idx;
                        var $512 = self.code;
                        var $513 = self.val;
                        var self = Kind$Parser$binder$(":", $511, $512);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $515 = self.idx;
                                var $516 = self.code;
                                var $517 = self.err;
                                var $518 = Parser$Reply$error$($515, $516, $517);
                                var $514 = $518;
                                break;
                            case 'Parser.Reply.value':
                                var $519 = self.idx;
                                var $520 = self.code;
                                var $521 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text("->"), $519, $520);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $523 = self.idx;
                                        var $524 = self.code;
                                        var $525 = self.err;
                                        var $526 = Parser$Reply$error$($523, $524, $525);
                                        var $522 = $526;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $527 = self.idx;
                                        var $528 = self.code;
                                        var self = Kind$Parser$term$($527, $528);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $530 = self.idx;
                                                var $531 = self.code;
                                                var $532 = self.err;
                                                var $533 = Parser$Reply$error$($530, $531, $532);
                                                var $529 = $533;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $534 = self.idx;
                                                var $535 = self.code;
                                                var $536 = self.val;
                                                var _term$18 = List$fold$($521, $536, (_x$18 => _t$19 => {
                                                    var self = _x$18;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $539 = self.eras;
                                                            var $540 = self.name;
                                                            var $541 = self.term;
                                                            var $542 = Kind$Term$all$($539, "", $540, $541, (_s$23 => _x$24 => {
                                                                var $543 = _t$19;
                                                                return $543;
                                                            }));
                                                            var $538 = $542;
                                                            break;
                                                    };
                                                    return $538;
                                                }));
                                                var self = Kind$Parser$stop$($505, $534, $535);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $544 = self.idx;
                                                        var $545 = self.code;
                                                        var $546 = self.err;
                                                        var $547 = Parser$Reply$error$($544, $545, $546);
                                                        var $537 = $547;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $548 = self.idx;
                                                        var $549 = self.code;
                                                        var $550 = self.val;
                                                        var $551 = Parser$Reply$value$($548, $549, (() => {
                                                            var self = _term$18;
                                                            switch (self._) {
                                                                case 'Kind.Term.all':
                                                                    var $552 = self.eras;
                                                                    var $553 = self.name;
                                                                    var $554 = self.xtyp;
                                                                    var $555 = self.body;
                                                                    var $556 = Kind$Term$ori$($550, Kind$Term$all$($552, $513, $553, $554, $555));
                                                                    return $556;
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
                                                                    var $557 = _term$18;
                                                                    return $557;
                                                            };
                                                        })());
                                                        var $537 = $551;
                                                        break;
                                                };
                                                var $529 = $537;
                                                break;
                                        };
                                        var $522 = $529;
                                        break;
                                };
                                var $514 = $522;
                                break;
                        };
                        var $506 = $514;
                        break;
                };
                var $498 = $506;
                break;
        };
        return $498;
    };
    const Kind$Parser$forall = x0 => x1 => Kind$Parser$forall$(x0, x1);

    function Kind$Term$lam$(_name$1, _body$2) {
        var $558 = ({
            _: 'Kind.Term.lam',
            'name': _name$1,
            'body': _body$2
        });
        return $558;
    };
    const Kind$Term$lam = x0 => x1 => Kind$Term$lam$(x0, x1);

    function Kind$Parser$make_lambda$(_names$1, _body$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $560 = self.head;
                var $561 = self.tail;
                var $562 = Kind$Term$lam$($560, (_x$5 => {
                    var $563 = Kind$Parser$make_lambda$($561, _body$2);
                    return $563;
                }));
                var $559 = $562;
                break;
            case 'List.nil':
                var $564 = _body$2;
                var $559 = $564;
                break;
        };
        return $559;
    };
    const Kind$Parser$make_lambda = x0 => x1 => Kind$Parser$make_lambda$(x0, x1);

    function Kind$Parser$lambda$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $566 = self.idx;
                var $567 = self.code;
                var $568 = self.err;
                var $569 = Parser$Reply$error$($566, $567, $568);
                var $565 = $569;
                break;
            case 'Parser.Reply.value':
                var $570 = self.idx;
                var $571 = self.code;
                var $572 = self.val;
                var self = Kind$Parser$text$("(", $570, $571);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $574 = self.idx;
                        var $575 = self.code;
                        var $576 = self.err;
                        var $577 = Parser$Reply$error$($574, $575, $576);
                        var $573 = $577;
                        break;
                    case 'Parser.Reply.value':
                        var $578 = self.idx;
                        var $579 = self.code;
                        var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$name1), $578, $579);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $581 = self.idx;
                                var $582 = self.code;
                                var $583 = self.err;
                                var $584 = Parser$Reply$error$($581, $582, $583);
                                var $580 = $584;
                                break;
                            case 'Parser.Reply.value':
                                var $585 = self.idx;
                                var $586 = self.code;
                                var $587 = self.val;
                                var self = Kind$Parser$term$($585, $586);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $589 = self.idx;
                                        var $590 = self.code;
                                        var $591 = self.err;
                                        var $592 = Parser$Reply$error$($589, $590, $591);
                                        var $588 = $592;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $593 = self.idx;
                                        var $594 = self.code;
                                        var $595 = self.val;
                                        var self = Kind$Parser$stop$($572, $593, $594);
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
                                                var _expr$18 = Kind$Parser$make_lambda$($587, $595);
                                                var $604 = Parser$Reply$value$($601, $602, Kind$Term$ori$($603, _expr$18));
                                                var $596 = $604;
                                                break;
                                        };
                                        var $588 = $596;
                                        break;
                                };
                                var $580 = $588;
                                break;
                        };
                        var $573 = $580;
                        break;
                };
                var $565 = $573;
                break;
        };
        return $565;
    };
    const Kind$Parser$lambda = x0 => x1 => Kind$Parser$lambda$(x0, x1);

    function Kind$Parser$lambda$erased$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $606 = self.idx;
                var $607 = self.code;
                var $608 = self.err;
                var $609 = Parser$Reply$error$($606, $607, $608);
                var $605 = $609;
                break;
            case 'Parser.Reply.value':
                var $610 = self.idx;
                var $611 = self.code;
                var $612 = self.val;
                var self = Kind$Parser$text$("<", $610, $611);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $614 = self.idx;
                        var $615 = self.code;
                        var $616 = self.err;
                        var $617 = Parser$Reply$error$($614, $615, $616);
                        var $613 = $617;
                        break;
                    case 'Parser.Reply.value':
                        var $618 = self.idx;
                        var $619 = self.code;
                        var self = Parser$until1$(Kind$Parser$text(">"), Kind$Parser$item(Kind$Parser$name1), $618, $619);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $621 = self.idx;
                                var $622 = self.code;
                                var $623 = self.err;
                                var $624 = Parser$Reply$error$($621, $622, $623);
                                var $620 = $624;
                                break;
                            case 'Parser.Reply.value':
                                var $625 = self.idx;
                                var $626 = self.code;
                                var $627 = self.val;
                                var self = Kind$Parser$term$($625, $626);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $629 = self.idx;
                                        var $630 = self.code;
                                        var $631 = self.err;
                                        var $632 = Parser$Reply$error$($629, $630, $631);
                                        var $628 = $632;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $633 = self.idx;
                                        var $634 = self.code;
                                        var $635 = self.val;
                                        var self = Kind$Parser$stop$($612, $633, $634);
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
                                                var _expr$18 = Kind$Parser$make_lambda$($627, $635);
                                                var $644 = Parser$Reply$value$($641, $642, Kind$Term$ori$($643, _expr$18));
                                                var $636 = $644;
                                                break;
                                        };
                                        var $628 = $636;
                                        break;
                                };
                                var $620 = $628;
                                break;
                        };
                        var $613 = $620;
                        break;
                };
                var $605 = $613;
                break;
        };
        return $605;
    };
    const Kind$Parser$lambda$erased = x0 => x1 => Kind$Parser$lambda$erased$(x0, x1);

    function Kind$Parser$lambda$nameless$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $646 = self.idx;
                var $647 = self.code;
                var $648 = self.err;
                var $649 = Parser$Reply$error$($646, $647, $648);
                var $645 = $649;
                break;
            case 'Parser.Reply.value':
                var $650 = self.idx;
                var $651 = self.code;
                var $652 = self.val;
                var self = Kind$Parser$text$("()", $650, $651);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $654 = self.idx;
                        var $655 = self.code;
                        var $656 = self.err;
                        var $657 = Parser$Reply$error$($654, $655, $656);
                        var $653 = $657;
                        break;
                    case 'Parser.Reply.value':
                        var $658 = self.idx;
                        var $659 = self.code;
                        var self = Kind$Parser$term$($658, $659);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $661 = self.idx;
                                var $662 = self.code;
                                var $663 = self.err;
                                var $664 = Parser$Reply$error$($661, $662, $663);
                                var $660 = $664;
                                break;
                            case 'Parser.Reply.value':
                                var $665 = self.idx;
                                var $666 = self.code;
                                var $667 = self.val;
                                var self = Kind$Parser$stop$($652, $665, $666);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $669 = self.idx;
                                        var $670 = self.code;
                                        var $671 = self.err;
                                        var $672 = Parser$Reply$error$($669, $670, $671);
                                        var $668 = $672;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $673 = self.idx;
                                        var $674 = self.code;
                                        var $675 = self.val;
                                        var _expr$15 = Kind$Term$lam$("", (_x$15 => {
                                            var $677 = $667;
                                            return $677;
                                        }));
                                        var $676 = Parser$Reply$value$($673, $674, Kind$Term$ori$($675, _expr$15));
                                        var $668 = $676;
                                        break;
                                };
                                var $660 = $668;
                                break;
                        };
                        var $653 = $660;
                        break;
                };
                var $645 = $653;
                break;
        };
        return $645;
    };
    const Kind$Parser$lambda$nameless = x0 => x1 => Kind$Parser$lambda$nameless$(x0, x1);

    function Kind$Parser$parenthesis$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("(", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $679 = self.idx;
                var $680 = self.code;
                var $681 = self.err;
                var $682 = Parser$Reply$error$($679, $680, $681);
                var $678 = $682;
                break;
            case 'Parser.Reply.value':
                var $683 = self.idx;
                var $684 = self.code;
                var self = Kind$Parser$term$($683, $684);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $686 = self.idx;
                        var $687 = self.code;
                        var $688 = self.err;
                        var $689 = Parser$Reply$error$($686, $687, $688);
                        var $685 = $689;
                        break;
                    case 'Parser.Reply.value':
                        var $690 = self.idx;
                        var $691 = self.code;
                        var $692 = self.val;
                        var self = Kind$Parser$text$(")", $690, $691);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $694 = self.idx;
                                var $695 = self.code;
                                var $696 = self.err;
                                var $697 = Parser$Reply$error$($694, $695, $696);
                                var $693 = $697;
                                break;
                            case 'Parser.Reply.value':
                                var $698 = self.idx;
                                var $699 = self.code;
                                var $700 = Parser$Reply$value$($698, $699, $692);
                                var $693 = $700;
                                break;
                        };
                        var $685 = $693;
                        break;
                };
                var $678 = $685;
                break;
        };
        return $678;
    };
    const Kind$Parser$parenthesis = x0 => x1 => Kind$Parser$parenthesis$(x0, x1);

    function Kind$Term$ref$(_name$1) {
        var $701 = ({
            _: 'Kind.Term.ref',
            'name': _name$1
        });
        return $701;
    };
    const Kind$Term$ref = x0 => Kind$Term$ref$(x0);

    function Kind$Term$app$(_func$1, _argm$2) {
        var $702 = ({
            _: 'Kind.Term.app',
            'func': _func$1,
            'argm': _argm$2
        });
        return $702;
    };
    const Kind$Term$app = x0 => x1 => Kind$Term$app$(x0, x1);

    function Kind$Term$hol$(_path$1) {
        var $703 = ({
            _: 'Kind.Term.hol',
            'path': _path$1
        });
        return $703;
    };
    const Kind$Term$hol = x0 => Kind$Term$hol$(x0);

    function Kind$Term$let$(_name$1, _expr$2, _body$3) {
        var $704 = ({
            _: 'Kind.Term.let',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $704;
    };
    const Kind$Term$let = x0 => x1 => x2 => Kind$Term$let$(x0, x1, x2);

    function Kind$Parser$letforrange$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $706 = self.idx;
                var $707 = self.code;
                var $708 = self.err;
                var $709 = Parser$Reply$error$($706, $707, $708);
                var $705 = $709;
                break;
            case 'Parser.Reply.value':
                var $710 = self.idx;
                var $711 = self.code;
                var $712 = self.val;
                var self = Kind$Parser$text$("let ", $710, $711);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $714 = self.idx;
                        var $715 = self.code;
                        var $716 = self.err;
                        var $717 = Parser$Reply$error$($714, $715, $716);
                        var $713 = $717;
                        break;
                    case 'Parser.Reply.value':
                        var $718 = self.idx;
                        var $719 = self.code;
                        var self = Kind$Parser$name1$($718, $719);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $721 = self.idx;
                                var $722 = self.code;
                                var $723 = self.err;
                                var $724 = Parser$Reply$error$($721, $722, $723);
                                var $720 = $724;
                                break;
                            case 'Parser.Reply.value':
                                var $725 = self.idx;
                                var $726 = self.code;
                                var $727 = self.val;
                                var self = Kind$Parser$text$("=", $725, $726);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $729 = self.idx;
                                        var $730 = self.code;
                                        var $731 = self.err;
                                        var $732 = Parser$Reply$error$($729, $730, $731);
                                        var $728 = $732;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $733 = self.idx;
                                        var $734 = self.code;
                                        var self = Kind$Parser$text$("for ", $733, $734);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $736 = self.idx;
                                                var $737 = self.code;
                                                var $738 = self.err;
                                                var $739 = Parser$Reply$error$($736, $737, $738);
                                                var $735 = $739;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $740 = self.idx;
                                                var $741 = self.code;
                                                var self = Kind$Parser$name1$($740, $741);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $743 = self.idx;
                                                        var $744 = self.code;
                                                        var $745 = self.err;
                                                        var $746 = Parser$Reply$error$($743, $744, $745);
                                                        var $742 = $746;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $747 = self.idx;
                                                        var $748 = self.code;
                                                        var $749 = self.val;
                                                        var self = Kind$Parser$text$(":", $747, $748);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $751 = self.idx;
                                                                var $752 = self.code;
                                                                var $753 = self.err;
                                                                var $754 = Parser$Reply$error$($751, $752, $753);
                                                                var $750 = $754;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $755 = self.idx;
                                                                var $756 = self.code;
                                                                var self = Kind$Parser$text$("U32", $755, $756);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $758 = self.idx;
                                                                        var $759 = self.code;
                                                                        var $760 = self.err;
                                                                        var $761 = Parser$Reply$error$($758, $759, $760);
                                                                        var $757 = $761;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $762 = self.idx;
                                                                        var $763 = self.code;
                                                                        var self = Kind$Parser$text$("from", $762, $763);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $765 = self.idx;
                                                                                var $766 = self.code;
                                                                                var $767 = self.err;
                                                                                var $768 = Parser$Reply$error$($765, $766, $767);
                                                                                var $764 = $768;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $769 = self.idx;
                                                                                var $770 = self.code;
                                                                                var self = Kind$Parser$term$($769, $770);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $772 = self.idx;
                                                                                        var $773 = self.code;
                                                                                        var $774 = self.err;
                                                                                        var $775 = Parser$Reply$error$($772, $773, $774);
                                                                                        var $771 = $775;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $776 = self.idx;
                                                                                        var $777 = self.code;
                                                                                        var $778 = self.val;
                                                                                        var self = Kind$Parser$text$("to", $776, $777);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $780 = self.idx;
                                                                                                var $781 = self.code;
                                                                                                var $782 = self.err;
                                                                                                var $783 = Parser$Reply$error$($780, $781, $782);
                                                                                                var $779 = $783;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $784 = self.idx;
                                                                                                var $785 = self.code;
                                                                                                var self = Kind$Parser$term$($784, $785);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $787 = self.idx;
                                                                                                        var $788 = self.code;
                                                                                                        var $789 = self.err;
                                                                                                        var $790 = Parser$Reply$error$($787, $788, $789);
                                                                                                        var $786 = $790;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $791 = self.idx;
                                                                                                        var $792 = self.code;
                                                                                                        var $793 = self.val;
                                                                                                        var self = Kind$Parser$text$(":", $791, $792);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $795 = self.idx;
                                                                                                                var $796 = self.code;
                                                                                                                var $797 = self.err;
                                                                                                                var $798 = Parser$Reply$error$($795, $796, $797);
                                                                                                                var $794 = $798;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $799 = self.idx;
                                                                                                                var $800 = self.code;
                                                                                                                var self = Kind$Parser$term$($799, $800);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $802 = self.idx;
                                                                                                                        var $803 = self.code;
                                                                                                                        var $804 = self.err;
                                                                                                                        var $805 = Parser$Reply$error$($802, $803, $804);
                                                                                                                        var $801 = $805;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $806 = self.idx;
                                                                                                                        var $807 = self.code;
                                                                                                                        var $808 = self.val;
                                                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $806, $807);
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                var $810 = self.idx;
                                                                                                                                var $811 = self.code;
                                                                                                                                var $812 = self.err;
                                                                                                                                var $813 = Parser$Reply$error$($810, $811, $812);
                                                                                                                                var $809 = $813;
                                                                                                                                break;
                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                var $814 = self.idx;
                                                                                                                                var $815 = self.code;
                                                                                                                                var self = Kind$Parser$term$($814, $815);
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                        var $817 = self.idx;
                                                                                                                                        var $818 = self.code;
                                                                                                                                        var $819 = self.err;
                                                                                                                                        var $820 = Parser$Reply$error$($817, $818, $819);
                                                                                                                                        var $816 = $820;
                                                                                                                                        break;
                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                        var $821 = self.idx;
                                                                                                                                        var $822 = self.code;
                                                                                                                                        var $823 = self.val;
                                                                                                                                        var self = Kind$Parser$stop$($712, $821, $822);
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $825 = self.idx;
                                                                                                                                                var $826 = self.code;
                                                                                                                                                var $827 = self.err;
                                                                                                                                                var $828 = Parser$Reply$error$($825, $826, $827);
                                                                                                                                                var $824 = $828;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $829 = self.idx;
                                                                                                                                                var $830 = self.code;
                                                                                                                                                var $831 = self.val;
                                                                                                                                                var _term$54 = Kind$Term$ref$("U32.for");
                                                                                                                                                var _term$55 = Kind$Term$app$(_term$54, Kind$Term$hol$(Bits$e));
                                                                                                                                                var _term$56 = Kind$Term$app$(_term$55, Kind$Term$ref$($727));
                                                                                                                                                var _term$57 = Kind$Term$app$(_term$56, $778);
                                                                                                                                                var _term$58 = Kind$Term$app$(_term$57, $793);
                                                                                                                                                var _lamb$59 = Kind$Term$lam$($749, (_e$59 => {
                                                                                                                                                    var $833 = Kind$Term$lam$($727, (_s$60 => {
                                                                                                                                                        var $834 = $808;
                                                                                                                                                        return $834;
                                                                                                                                                    }));
                                                                                                                                                    return $833;
                                                                                                                                                }));
                                                                                                                                                var _term$60 = Kind$Term$app$(_term$58, _lamb$59);
                                                                                                                                                var _term$61 = Kind$Term$let$($727, _term$60, (_x$61 => {
                                                                                                                                                    var $835 = $823;
                                                                                                                                                    return $835;
                                                                                                                                                }));
                                                                                                                                                var $832 = Parser$Reply$value$($829, $830, Kind$Term$ori$($831, _term$61));
                                                                                                                                                var $824 = $832;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $816 = $824;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $809 = $816;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $801 = $809;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $794 = $801;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $786 = $794;
                                                                                                        break;
                                                                                                };
                                                                                                var $779 = $786;
                                                                                                break;
                                                                                        };
                                                                                        var $771 = $779;
                                                                                        break;
                                                                                };
                                                                                var $764 = $771;
                                                                                break;
                                                                        };
                                                                        var $757 = $764;
                                                                        break;
                                                                };
                                                                var $750 = $757;
                                                                break;
                                                        };
                                                        var $742 = $750;
                                                        break;
                                                };
                                                var $735 = $742;
                                                break;
                                        };
                                        var $728 = $735;
                                        break;
                                };
                                var $720 = $728;
                                break;
                        };
                        var $713 = $720;
                        break;
                };
                var $705 = $713;
                break;
        };
        return $705;
    };
    const Kind$Parser$letforrange$u32 = x0 => x1 => Kind$Parser$letforrange$u32$(x0, x1);

    function Kind$Parser$letforrange$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $837 = self.idx;
                var $838 = self.code;
                var $839 = self.err;
                var $840 = Parser$Reply$error$($837, $838, $839);
                var $836 = $840;
                break;
            case 'Parser.Reply.value':
                var $841 = self.idx;
                var $842 = self.code;
                var $843 = self.val;
                var self = Kind$Parser$text$("let ", $841, $842);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $845 = self.idx;
                        var $846 = self.code;
                        var $847 = self.err;
                        var $848 = Parser$Reply$error$($845, $846, $847);
                        var $844 = $848;
                        break;
                    case 'Parser.Reply.value':
                        var $849 = self.idx;
                        var $850 = self.code;
                        var self = Kind$Parser$name1$($849, $850);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $852 = self.idx;
                                var $853 = self.code;
                                var $854 = self.err;
                                var $855 = Parser$Reply$error$($852, $853, $854);
                                var $851 = $855;
                                break;
                            case 'Parser.Reply.value':
                                var $856 = self.idx;
                                var $857 = self.code;
                                var $858 = self.val;
                                var self = Kind$Parser$text$("=", $856, $857);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $860 = self.idx;
                                        var $861 = self.code;
                                        var $862 = self.err;
                                        var $863 = Parser$Reply$error$($860, $861, $862);
                                        var $859 = $863;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $864 = self.idx;
                                        var $865 = self.code;
                                        var self = Kind$Parser$text$("for ", $864, $865);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $867 = self.idx;
                                                var $868 = self.code;
                                                var $869 = self.err;
                                                var $870 = Parser$Reply$error$($867, $868, $869);
                                                var $866 = $870;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $871 = self.idx;
                                                var $872 = self.code;
                                                var self = Kind$Parser$name1$($871, $872);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $874 = self.idx;
                                                        var $875 = self.code;
                                                        var $876 = self.err;
                                                        var $877 = Parser$Reply$error$($874, $875, $876);
                                                        var $873 = $877;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $878 = self.idx;
                                                        var $879 = self.code;
                                                        var $880 = self.val;
                                                        var self = Kind$Parser$text$("from", $878, $879);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $882 = self.idx;
                                                                var $883 = self.code;
                                                                var $884 = self.err;
                                                                var $885 = Parser$Reply$error$($882, $883, $884);
                                                                var $881 = $885;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $886 = self.idx;
                                                                var $887 = self.code;
                                                                var self = Kind$Parser$term$($886, $887);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $889 = self.idx;
                                                                        var $890 = self.code;
                                                                        var $891 = self.err;
                                                                        var $892 = Parser$Reply$error$($889, $890, $891);
                                                                        var $888 = $892;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $893 = self.idx;
                                                                        var $894 = self.code;
                                                                        var $895 = self.val;
                                                                        var self = Kind$Parser$text$("to", $893, $894);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $897 = self.idx;
                                                                                var $898 = self.code;
                                                                                var $899 = self.err;
                                                                                var $900 = Parser$Reply$error$($897, $898, $899);
                                                                                var $896 = $900;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $901 = self.idx;
                                                                                var $902 = self.code;
                                                                                var self = Kind$Parser$term$($901, $902);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $904 = self.idx;
                                                                                        var $905 = self.code;
                                                                                        var $906 = self.err;
                                                                                        var $907 = Parser$Reply$error$($904, $905, $906);
                                                                                        var $903 = $907;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $908 = self.idx;
                                                                                        var $909 = self.code;
                                                                                        var $910 = self.val;
                                                                                        var self = Kind$Parser$text$(":", $908, $909);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $912 = self.idx;
                                                                                                var $913 = self.code;
                                                                                                var $914 = self.err;
                                                                                                var $915 = Parser$Reply$error$($912, $913, $914);
                                                                                                var $911 = $915;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $916 = self.idx;
                                                                                                var $917 = self.code;
                                                                                                var self = Kind$Parser$term$($916, $917);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $919 = self.idx;
                                                                                                        var $920 = self.code;
                                                                                                        var $921 = self.err;
                                                                                                        var $922 = Parser$Reply$error$($919, $920, $921);
                                                                                                        var $918 = $922;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $923 = self.idx;
                                                                                                        var $924 = self.code;
                                                                                                        var $925 = self.val;
                                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $923, $924);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $927 = self.idx;
                                                                                                                var $928 = self.code;
                                                                                                                var $929 = self.err;
                                                                                                                var $930 = Parser$Reply$error$($927, $928, $929);
                                                                                                                var $926 = $930;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $931 = self.idx;
                                                                                                                var $932 = self.code;
                                                                                                                var self = Kind$Parser$term$($931, $932);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $934 = self.idx;
                                                                                                                        var $935 = self.code;
                                                                                                                        var $936 = self.err;
                                                                                                                        var $937 = Parser$Reply$error$($934, $935, $936);
                                                                                                                        var $933 = $937;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $938 = self.idx;
                                                                                                                        var $939 = self.code;
                                                                                                                        var $940 = self.val;
                                                                                                                        var self = Kind$Parser$stop$($843, $938, $939);
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                var $942 = self.idx;
                                                                                                                                var $943 = self.code;
                                                                                                                                var $944 = self.err;
                                                                                                                                var $945 = Parser$Reply$error$($942, $943, $944);
                                                                                                                                var $941 = $945;
                                                                                                                                break;
                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                var $946 = self.idx;
                                                                                                                                var $947 = self.code;
                                                                                                                                var $948 = self.val;
                                                                                                                                var _term$48 = Kind$Term$ref$("Nat.for");
                                                                                                                                var _term$49 = Kind$Term$app$(_term$48, Kind$Term$hol$(Bits$e));
                                                                                                                                var _term$50 = Kind$Term$app$(_term$49, Kind$Term$ref$($858));
                                                                                                                                var _term$51 = Kind$Term$app$(_term$50, $895);
                                                                                                                                var _term$52 = Kind$Term$app$(_term$51, $910);
                                                                                                                                var _lamb$53 = Kind$Term$lam$($880, (_e$53 => {
                                                                                                                                    var $950 = Kind$Term$lam$($858, (_s$54 => {
                                                                                                                                        var $951 = $925;
                                                                                                                                        return $951;
                                                                                                                                    }));
                                                                                                                                    return $950;
                                                                                                                                }));
                                                                                                                                var _term$54 = Kind$Term$app$(_term$52, _lamb$53);
                                                                                                                                var _term$55 = Kind$Term$let$($858, _term$54, (_x$55 => {
                                                                                                                                    var $952 = $940;
                                                                                                                                    return $952;
                                                                                                                                }));
                                                                                                                                var $949 = Parser$Reply$value$($946, $947, Kind$Term$ori$($948, _term$55));
                                                                                                                                var $941 = $949;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $933 = $941;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $926 = $933;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $918 = $926;
                                                                                                        break;
                                                                                                };
                                                                                                var $911 = $918;
                                                                                                break;
                                                                                        };
                                                                                        var $903 = $911;
                                                                                        break;
                                                                                };
                                                                                var $896 = $903;
                                                                                break;
                                                                        };
                                                                        var $888 = $896;
                                                                        break;
                                                                };
                                                                var $881 = $888;
                                                                break;
                                                        };
                                                        var $873 = $881;
                                                        break;
                                                };
                                                var $866 = $873;
                                                break;
                                        };
                                        var $859 = $866;
                                        break;
                                };
                                var $851 = $859;
                                break;
                        };
                        var $844 = $851;
                        break;
                };
                var $836 = $844;
                break;
        };
        return $836;
    };
    const Kind$Parser$letforrange$nat = x0 => x1 => Kind$Parser$letforrange$nat$(x0, x1);

    function Kind$Parser$letforin$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $954 = self.idx;
                var $955 = self.code;
                var $956 = self.err;
                var $957 = Parser$Reply$error$($954, $955, $956);
                var $953 = $957;
                break;
            case 'Parser.Reply.value':
                var $958 = self.idx;
                var $959 = self.code;
                var $960 = self.val;
                var self = Kind$Parser$text$("let ", $958, $959);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $962 = self.idx;
                        var $963 = self.code;
                        var $964 = self.err;
                        var $965 = Parser$Reply$error$($962, $963, $964);
                        var $961 = $965;
                        break;
                    case 'Parser.Reply.value':
                        var $966 = self.idx;
                        var $967 = self.code;
                        var self = Kind$Parser$name1$($966, $967);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $969 = self.idx;
                                var $970 = self.code;
                                var $971 = self.err;
                                var $972 = Parser$Reply$error$($969, $970, $971);
                                var $968 = $972;
                                break;
                            case 'Parser.Reply.value':
                                var $973 = self.idx;
                                var $974 = self.code;
                                var $975 = self.val;
                                var self = Kind$Parser$text$("=", $973, $974);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $977 = self.idx;
                                        var $978 = self.code;
                                        var $979 = self.err;
                                        var $980 = Parser$Reply$error$($977, $978, $979);
                                        var $976 = $980;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $981 = self.idx;
                                        var $982 = self.code;
                                        var self = Kind$Parser$text$("for ", $981, $982);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $984 = self.idx;
                                                var $985 = self.code;
                                                var $986 = self.err;
                                                var $987 = Parser$Reply$error$($984, $985, $986);
                                                var $983 = $987;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $988 = self.idx;
                                                var $989 = self.code;
                                                var self = Kind$Parser$name1$($988, $989);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $991 = self.idx;
                                                        var $992 = self.code;
                                                        var $993 = self.err;
                                                        var $994 = Parser$Reply$error$($991, $992, $993);
                                                        var $990 = $994;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $995 = self.idx;
                                                        var $996 = self.code;
                                                        var $997 = self.val;
                                                        var self = Kind$Parser$text$("in", $995, $996);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $999 = self.idx;
                                                                var $1000 = self.code;
                                                                var $1001 = self.err;
                                                                var $1002 = Parser$Reply$error$($999, $1000, $1001);
                                                                var $998 = $1002;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1003 = self.idx;
                                                                var $1004 = self.code;
                                                                var self = Kind$Parser$term$($1003, $1004);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1006 = self.idx;
                                                                        var $1007 = self.code;
                                                                        var $1008 = self.err;
                                                                        var $1009 = Parser$Reply$error$($1006, $1007, $1008);
                                                                        var $1005 = $1009;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1010 = self.idx;
                                                                        var $1011 = self.code;
                                                                        var $1012 = self.val;
                                                                        var self = Kind$Parser$text$(":", $1010, $1011);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1014 = self.idx;
                                                                                var $1015 = self.code;
                                                                                var $1016 = self.err;
                                                                                var $1017 = Parser$Reply$error$($1014, $1015, $1016);
                                                                                var $1013 = $1017;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1018 = self.idx;
                                                                                var $1019 = self.code;
                                                                                var self = Kind$Parser$term$($1018, $1019);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1021 = self.idx;
                                                                                        var $1022 = self.code;
                                                                                        var $1023 = self.err;
                                                                                        var $1024 = Parser$Reply$error$($1021, $1022, $1023);
                                                                                        var $1020 = $1024;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1025 = self.idx;
                                                                                        var $1026 = self.code;
                                                                                        var $1027 = self.val;
                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $1025, $1026);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1029 = self.idx;
                                                                                                var $1030 = self.code;
                                                                                                var $1031 = self.err;
                                                                                                var $1032 = Parser$Reply$error$($1029, $1030, $1031);
                                                                                                var $1028 = $1032;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1033 = self.idx;
                                                                                                var $1034 = self.code;
                                                                                                var self = Kind$Parser$term$($1033, $1034);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1036 = self.idx;
                                                                                                        var $1037 = self.code;
                                                                                                        var $1038 = self.err;
                                                                                                        var $1039 = Parser$Reply$error$($1036, $1037, $1038);
                                                                                                        var $1035 = $1039;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1040 = self.idx;
                                                                                                        var $1041 = self.code;
                                                                                                        var $1042 = self.val;
                                                                                                        var self = Kind$Parser$stop$($960, $1040, $1041);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $1044 = self.idx;
                                                                                                                var $1045 = self.code;
                                                                                                                var $1046 = self.err;
                                                                                                                var $1047 = Parser$Reply$error$($1044, $1045, $1046);
                                                                                                                var $1043 = $1047;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $1048 = self.idx;
                                                                                                                var $1049 = self.code;
                                                                                                                var $1050 = self.val;
                                                                                                                var _term$42 = Kind$Term$ref$("List.for");
                                                                                                                var _term$43 = Kind$Term$app$(_term$42, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$44 = Kind$Term$app$(_term$43, $1012);
                                                                                                                var _term$45 = Kind$Term$app$(_term$44, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$46 = Kind$Term$app$(_term$45, Kind$Term$ref$($975));
                                                                                                                var _lamb$47 = Kind$Term$lam$($997, (_i$47 => {
                                                                                                                    var $1052 = Kind$Term$lam$($975, (_x$48 => {
                                                                                                                        var $1053 = $1027;
                                                                                                                        return $1053;
                                                                                                                    }));
                                                                                                                    return $1052;
                                                                                                                }));
                                                                                                                var _term$48 = Kind$Term$app$(_term$46, _lamb$47);
                                                                                                                var _term$49 = Kind$Term$let$($975, _term$48, (_x$49 => {
                                                                                                                    var $1054 = $1042;
                                                                                                                    return $1054;
                                                                                                                }));
                                                                                                                var $1051 = Parser$Reply$value$($1048, $1049, Kind$Term$ori$($1050, _term$49));
                                                                                                                var $1043 = $1051;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1035 = $1043;
                                                                                                        break;
                                                                                                };
                                                                                                var $1028 = $1035;
                                                                                                break;
                                                                                        };
                                                                                        var $1020 = $1028;
                                                                                        break;
                                                                                };
                                                                                var $1013 = $1020;
                                                                                break;
                                                                        };
                                                                        var $1005 = $1013;
                                                                        break;
                                                                };
                                                                var $998 = $1005;
                                                                break;
                                                        };
                                                        var $990 = $998;
                                                        break;
                                                };
                                                var $983 = $990;
                                                break;
                                        };
                                        var $976 = $983;
                                        break;
                                };
                                var $968 = $976;
                                break;
                        };
                        var $961 = $968;
                        break;
                };
                var $953 = $961;
                break;
        };
        return $953;
    };
    const Kind$Parser$letforin = x0 => x1 => Kind$Parser$letforin$(x0, x1);

    function Kind$Parser$let$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1056 = self.idx;
                var $1057 = self.code;
                var $1058 = self.err;
                var $1059 = Parser$Reply$error$($1056, $1057, $1058);
                var $1055 = $1059;
                break;
            case 'Parser.Reply.value':
                var $1060 = self.idx;
                var $1061 = self.code;
                var $1062 = self.val;
                var self = Kind$Parser$text$("let ", $1060, $1061);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1064 = self.idx;
                        var $1065 = self.code;
                        var $1066 = self.err;
                        var $1067 = Parser$Reply$error$($1064, $1065, $1066);
                        var $1063 = $1067;
                        break;
                    case 'Parser.Reply.value':
                        var $1068 = self.idx;
                        var $1069 = self.code;
                        var self = Kind$Parser$name$($1068, $1069);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1071 = self.idx;
                                var $1072 = self.code;
                                var $1073 = self.err;
                                var $1074 = Parser$Reply$error$($1071, $1072, $1073);
                                var $1070 = $1074;
                                break;
                            case 'Parser.Reply.value':
                                var $1075 = self.idx;
                                var $1076 = self.code;
                                var $1077 = self.val;
                                var self = Kind$Parser$text$("=", $1075, $1076);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1079 = self.idx;
                                        var $1080 = self.code;
                                        var $1081 = self.err;
                                        var $1082 = Parser$Reply$error$($1079, $1080, $1081);
                                        var $1078 = $1082;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1083 = self.idx;
                                        var $1084 = self.code;
                                        var self = Kind$Parser$term$($1083, $1084);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1086 = self.idx;
                                                var $1087 = self.code;
                                                var $1088 = self.err;
                                                var $1089 = Parser$Reply$error$($1086, $1087, $1088);
                                                var $1085 = $1089;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1090 = self.idx;
                                                var $1091 = self.code;
                                                var $1092 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1090, $1091);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1094 = self.idx;
                                                        var $1095 = self.code;
                                                        var $1096 = self.err;
                                                        var $1097 = Parser$Reply$error$($1094, $1095, $1096);
                                                        var $1093 = $1097;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1098 = self.idx;
                                                        var $1099 = self.code;
                                                        var self = Kind$Parser$term$($1098, $1099);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1101 = self.idx;
                                                                var $1102 = self.code;
                                                                var $1103 = self.err;
                                                                var $1104 = Parser$Reply$error$($1101, $1102, $1103);
                                                                var $1100 = $1104;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1105 = self.idx;
                                                                var $1106 = self.code;
                                                                var $1107 = self.val;
                                                                var self = Kind$Parser$stop$($1062, $1105, $1106);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1109 = self.idx;
                                                                        var $1110 = self.code;
                                                                        var $1111 = self.err;
                                                                        var $1112 = Parser$Reply$error$($1109, $1110, $1111);
                                                                        var $1108 = $1112;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1113 = self.idx;
                                                                        var $1114 = self.code;
                                                                        var $1115 = self.val;
                                                                        var $1116 = Parser$Reply$value$($1113, $1114, Kind$Term$ori$($1115, Kind$Term$let$($1077, $1092, (_x$27 => {
                                                                            var $1117 = $1107;
                                                                            return $1117;
                                                                        }))));
                                                                        var $1108 = $1116;
                                                                        break;
                                                                };
                                                                var $1100 = $1108;
                                                                break;
                                                        };
                                                        var $1093 = $1100;
                                                        break;
                                                };
                                                var $1085 = $1093;
                                                break;
                                        };
                                        var $1078 = $1085;
                                        break;
                                };
                                var $1070 = $1078;
                                break;
                        };
                        var $1063 = $1070;
                        break;
                };
                var $1055 = $1063;
                break;
        };
        return $1055;
    };
    const Kind$Parser$let = x0 => x1 => Kind$Parser$let$(x0, x1);

    function Kind$Parser$get$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1119 = self.idx;
                var $1120 = self.code;
                var $1121 = self.err;
                var $1122 = Parser$Reply$error$($1119, $1120, $1121);
                var $1118 = $1122;
                break;
            case 'Parser.Reply.value':
                var $1123 = self.idx;
                var $1124 = self.code;
                var $1125 = self.val;
                var self = Kind$Parser$text$("let ", $1123, $1124);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1127 = self.idx;
                        var $1128 = self.code;
                        var $1129 = self.err;
                        var $1130 = Parser$Reply$error$($1127, $1128, $1129);
                        var $1126 = $1130;
                        break;
                    case 'Parser.Reply.value':
                        var $1131 = self.idx;
                        var $1132 = self.code;
                        var self = Kind$Parser$text$("{", $1131, $1132);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1134 = self.idx;
                                var $1135 = self.code;
                                var $1136 = self.err;
                                var $1137 = Parser$Reply$error$($1134, $1135, $1136);
                                var $1133 = $1137;
                                break;
                            case 'Parser.Reply.value':
                                var $1138 = self.idx;
                                var $1139 = self.code;
                                var self = Kind$Parser$name$($1138, $1139);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1141 = self.idx;
                                        var $1142 = self.code;
                                        var $1143 = self.err;
                                        var $1144 = Parser$Reply$error$($1141, $1142, $1143);
                                        var $1140 = $1144;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1145 = self.idx;
                                        var $1146 = self.code;
                                        var $1147 = self.val;
                                        var self = Kind$Parser$text$(",", $1145, $1146);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1149 = self.idx;
                                                var $1150 = self.code;
                                                var $1151 = self.err;
                                                var $1152 = Parser$Reply$error$($1149, $1150, $1151);
                                                var $1148 = $1152;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1153 = self.idx;
                                                var $1154 = self.code;
                                                var self = Kind$Parser$name$($1153, $1154);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1156 = self.idx;
                                                        var $1157 = self.code;
                                                        var $1158 = self.err;
                                                        var $1159 = Parser$Reply$error$($1156, $1157, $1158);
                                                        var $1155 = $1159;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1160 = self.idx;
                                                        var $1161 = self.code;
                                                        var $1162 = self.val;
                                                        var self = Kind$Parser$text$("}", $1160, $1161);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1164 = self.idx;
                                                                var $1165 = self.code;
                                                                var $1166 = self.err;
                                                                var $1167 = Parser$Reply$error$($1164, $1165, $1166);
                                                                var $1163 = $1167;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1168 = self.idx;
                                                                var $1169 = self.code;
                                                                var self = Kind$Parser$text$("=", $1168, $1169);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1171 = self.idx;
                                                                        var $1172 = self.code;
                                                                        var $1173 = self.err;
                                                                        var $1174 = Parser$Reply$error$($1171, $1172, $1173);
                                                                        var $1170 = $1174;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1175 = self.idx;
                                                                        var $1176 = self.code;
                                                                        var self = Kind$Parser$term$($1175, $1176);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1178 = self.idx;
                                                                                var $1179 = self.code;
                                                                                var $1180 = self.err;
                                                                                var $1181 = Parser$Reply$error$($1178, $1179, $1180);
                                                                                var $1177 = $1181;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1182 = self.idx;
                                                                                var $1183 = self.code;
                                                                                var $1184 = self.val;
                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1182, $1183);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1186 = self.idx;
                                                                                        var $1187 = self.code;
                                                                                        var $1188 = self.err;
                                                                                        var $1189 = Parser$Reply$error$($1186, $1187, $1188);
                                                                                        var $1185 = $1189;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1190 = self.idx;
                                                                                        var $1191 = self.code;
                                                                                        var self = Kind$Parser$term$($1190, $1191);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1193 = self.idx;
                                                                                                var $1194 = self.code;
                                                                                                var $1195 = self.err;
                                                                                                var $1196 = Parser$Reply$error$($1193, $1194, $1195);
                                                                                                var $1192 = $1196;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1197 = self.idx;
                                                                                                var $1198 = self.code;
                                                                                                var $1199 = self.val;
                                                                                                var self = Kind$Parser$stop$($1125, $1197, $1198);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1201 = self.idx;
                                                                                                        var $1202 = self.code;
                                                                                                        var $1203 = self.err;
                                                                                                        var $1204 = Parser$Reply$error$($1201, $1202, $1203);
                                                                                                        var $1200 = $1204;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1205 = self.idx;
                                                                                                        var $1206 = self.code;
                                                                                                        var $1207 = self.val;
                                                                                                        var _term$39 = $1184;
                                                                                                        var _term$40 = Kind$Term$app$(_term$39, Kind$Term$lam$("x", (_x$40 => {
                                                                                                            var $1209 = Kind$Term$hol$(Bits$e);
                                                                                                            return $1209;
                                                                                                        })));
                                                                                                        var _term$41 = Kind$Term$app$(_term$40, Kind$Term$lam$($1147, (_x$41 => {
                                                                                                            var $1210 = Kind$Term$lam$($1162, (_y$42 => {
                                                                                                                var $1211 = $1199;
                                                                                                                return $1211;
                                                                                                            }));
                                                                                                            return $1210;
                                                                                                        })));
                                                                                                        var $1208 = Parser$Reply$value$($1205, $1206, Kind$Term$ori$($1207, _term$41));
                                                                                                        var $1200 = $1208;
                                                                                                        break;
                                                                                                };
                                                                                                var $1192 = $1200;
                                                                                                break;
                                                                                        };
                                                                                        var $1185 = $1192;
                                                                                        break;
                                                                                };
                                                                                var $1177 = $1185;
                                                                                break;
                                                                        };
                                                                        var $1170 = $1177;
                                                                        break;
                                                                };
                                                                var $1163 = $1170;
                                                                break;
                                                        };
                                                        var $1155 = $1163;
                                                        break;
                                                };
                                                var $1148 = $1155;
                                                break;
                                        };
                                        var $1140 = $1148;
                                        break;
                                };
                                var $1133 = $1140;
                                break;
                        };
                        var $1126 = $1133;
                        break;
                };
                var $1118 = $1126;
                break;
        };
        return $1118;
    };
    const Kind$Parser$get = x0 => x1 => Kind$Parser$get$(x0, x1);

    function Kind$Term$def$(_name$1, _expr$2, _body$3) {
        var $1212 = ({
            _: 'Kind.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $1212;
    };
    const Kind$Term$def = x0 => x1 => x2 => Kind$Term$def$(x0, x1, x2);

    function Kind$Parser$def$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1214 = self.idx;
                var $1215 = self.code;
                var $1216 = self.err;
                var $1217 = Parser$Reply$error$($1214, $1215, $1216);
                var $1213 = $1217;
                break;
            case 'Parser.Reply.value':
                var $1218 = self.idx;
                var $1219 = self.code;
                var $1220 = self.val;
                var self = Kind$Parser$text$("def ", $1218, $1219);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1222 = self.idx;
                        var $1223 = self.code;
                        var $1224 = self.err;
                        var $1225 = Parser$Reply$error$($1222, $1223, $1224);
                        var $1221 = $1225;
                        break;
                    case 'Parser.Reply.value':
                        var $1226 = self.idx;
                        var $1227 = self.code;
                        var self = Kind$Parser$name$($1226, $1227);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1229 = self.idx;
                                var $1230 = self.code;
                                var $1231 = self.err;
                                var $1232 = Parser$Reply$error$($1229, $1230, $1231);
                                var $1228 = $1232;
                                break;
                            case 'Parser.Reply.value':
                                var $1233 = self.idx;
                                var $1234 = self.code;
                                var $1235 = self.val;
                                var self = Kind$Parser$text$("=", $1233, $1234);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1237 = self.idx;
                                        var $1238 = self.code;
                                        var $1239 = self.err;
                                        var $1240 = Parser$Reply$error$($1237, $1238, $1239);
                                        var $1236 = $1240;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1241 = self.idx;
                                        var $1242 = self.code;
                                        var self = Kind$Parser$term$($1241, $1242);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1244 = self.idx;
                                                var $1245 = self.code;
                                                var $1246 = self.err;
                                                var $1247 = Parser$Reply$error$($1244, $1245, $1246);
                                                var $1243 = $1247;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1248 = self.idx;
                                                var $1249 = self.code;
                                                var $1250 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1248, $1249);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1252 = self.idx;
                                                        var $1253 = self.code;
                                                        var $1254 = self.err;
                                                        var $1255 = Parser$Reply$error$($1252, $1253, $1254);
                                                        var $1251 = $1255;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1256 = self.idx;
                                                        var $1257 = self.code;
                                                        var self = Kind$Parser$term$($1256, $1257);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1259 = self.idx;
                                                                var $1260 = self.code;
                                                                var $1261 = self.err;
                                                                var $1262 = Parser$Reply$error$($1259, $1260, $1261);
                                                                var $1258 = $1262;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1263 = self.idx;
                                                                var $1264 = self.code;
                                                                var $1265 = self.val;
                                                                var self = Kind$Parser$stop$($1220, $1263, $1264);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1267 = self.idx;
                                                                        var $1268 = self.code;
                                                                        var $1269 = self.err;
                                                                        var $1270 = Parser$Reply$error$($1267, $1268, $1269);
                                                                        var $1266 = $1270;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1271 = self.idx;
                                                                        var $1272 = self.code;
                                                                        var $1273 = self.val;
                                                                        var $1274 = Parser$Reply$value$($1271, $1272, Kind$Term$ori$($1273, Kind$Term$def$($1235, $1250, (_x$27 => {
                                                                            var $1275 = $1265;
                                                                            return $1275;
                                                                        }))));
                                                                        var $1266 = $1274;
                                                                        break;
                                                                };
                                                                var $1258 = $1266;
                                                                break;
                                                        };
                                                        var $1251 = $1258;
                                                        break;
                                                };
                                                var $1243 = $1251;
                                                break;
                                        };
                                        var $1236 = $1243;
                                        break;
                                };
                                var $1228 = $1236;
                                break;
                        };
                        var $1221 = $1228;
                        break;
                };
                var $1213 = $1221;
                break;
        };
        return $1213;
    };
    const Kind$Parser$def = x0 => x1 => Kind$Parser$def$(x0, x1);

    function Kind$Parser$goal_rewrite$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1277 = self.idx;
                var $1278 = self.code;
                var $1279 = self.err;
                var $1280 = Parser$Reply$error$($1277, $1278, $1279);
                var $1276 = $1280;
                break;
            case 'Parser.Reply.value':
                var $1281 = self.idx;
                var $1282 = self.code;
                var $1283 = self.val;
                var self = Kind$Parser$text$("rewrite ", $1281, $1282);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1285 = self.idx;
                        var $1286 = self.code;
                        var $1287 = self.err;
                        var $1288 = Parser$Reply$error$($1285, $1286, $1287);
                        var $1284 = $1288;
                        break;
                    case 'Parser.Reply.value':
                        var $1289 = self.idx;
                        var $1290 = self.code;
                        var self = Kind$Parser$name1$($1289, $1290);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1292 = self.idx;
                                var $1293 = self.code;
                                var $1294 = self.err;
                                var $1295 = Parser$Reply$error$($1292, $1293, $1294);
                                var $1291 = $1295;
                                break;
                            case 'Parser.Reply.value':
                                var $1296 = self.idx;
                                var $1297 = self.code;
                                var $1298 = self.val;
                                var self = Kind$Parser$text$("in", $1296, $1297);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1300 = self.idx;
                                        var $1301 = self.code;
                                        var $1302 = self.err;
                                        var $1303 = Parser$Reply$error$($1300, $1301, $1302);
                                        var $1299 = $1303;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1304 = self.idx;
                                        var $1305 = self.code;
                                        var self = Kind$Parser$term$($1304, $1305);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1307 = self.idx;
                                                var $1308 = self.code;
                                                var $1309 = self.err;
                                                var $1310 = Parser$Reply$error$($1307, $1308, $1309);
                                                var $1306 = $1310;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1311 = self.idx;
                                                var $1312 = self.code;
                                                var $1313 = self.val;
                                                var self = Kind$Parser$text$("with", $1311, $1312);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1315 = self.idx;
                                                        var $1316 = self.code;
                                                        var $1317 = self.err;
                                                        var $1318 = Parser$Reply$error$($1315, $1316, $1317);
                                                        var $1314 = $1318;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1319 = self.idx;
                                                        var $1320 = self.code;
                                                        var self = Kind$Parser$term$($1319, $1320);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1322 = self.idx;
                                                                var $1323 = self.code;
                                                                var $1324 = self.err;
                                                                var $1325 = Parser$Reply$error$($1322, $1323, $1324);
                                                                var $1321 = $1325;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1326 = self.idx;
                                                                var $1327 = self.code;
                                                                var $1328 = self.val;
                                                                var self = Kind$Parser$term$($1326, $1327);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1330 = self.idx;
                                                                        var $1331 = self.code;
                                                                        var $1332 = self.err;
                                                                        var $1333 = Parser$Reply$error$($1330, $1331, $1332);
                                                                        var $1329 = $1333;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1334 = self.idx;
                                                                        var $1335 = self.code;
                                                                        var $1336 = self.val;
                                                                        var self = Kind$Parser$stop$($1283, $1334, $1335);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1338 = self.idx;
                                                                                var $1339 = self.code;
                                                                                var $1340 = self.err;
                                                                                var $1341 = Parser$Reply$error$($1338, $1339, $1340);
                                                                                var $1337 = $1341;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1342 = self.idx;
                                                                                var $1343 = self.code;
                                                                                var $1344 = self.val;
                                                                                var _moti$30 = Kind$Term$lam$($1298, (_s$30 => {
                                                                                    var $1346 = Kind$Term$lam$("", (_x$31 => {
                                                                                        var $1347 = $1313;
                                                                                        return $1347;
                                                                                    }));
                                                                                    return $1346;
                                                                                }));
                                                                                var _term$31 = Kind$Term$ref$("Equal.mirror");
                                                                                var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                                var _term$33 = Kind$Term$app$(_term$32, Kind$Term$hol$(Bits$e));
                                                                                var _term$34 = Kind$Term$app$(_term$33, Kind$Term$hol$(Bits$e));
                                                                                var _term$35 = Kind$Term$app$(_term$34, $1328);
                                                                                var _term$36 = Kind$Term$app$(_term$35, _moti$30);
                                                                                var _term$37 = Kind$Term$app$(_term$36, $1336);
                                                                                var $1345 = Parser$Reply$value$($1342, $1343, Kind$Term$ori$($1344, _term$37));
                                                                                var $1337 = $1345;
                                                                                break;
                                                                        };
                                                                        var $1329 = $1337;
                                                                        break;
                                                                };
                                                                var $1321 = $1329;
                                                                break;
                                                        };
                                                        var $1314 = $1321;
                                                        break;
                                                };
                                                var $1306 = $1314;
                                                break;
                                        };
                                        var $1299 = $1306;
                                        break;
                                };
                                var $1291 = $1299;
                                break;
                        };
                        var $1284 = $1291;
                        break;
                };
                var $1276 = $1284;
                break;
        };
        return $1276;
    };
    const Kind$Parser$goal_rewrite = x0 => x1 => Kind$Parser$goal_rewrite$(x0, x1);

    function Kind$Parser$if$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1349 = self.idx;
                var $1350 = self.code;
                var $1351 = self.err;
                var $1352 = Parser$Reply$error$($1349, $1350, $1351);
                var $1348 = $1352;
                break;
            case 'Parser.Reply.value':
                var $1353 = self.idx;
                var $1354 = self.code;
                var $1355 = self.val;
                var self = Kind$Parser$text$("if ", $1353, $1354);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1357 = self.idx;
                        var $1358 = self.code;
                        var $1359 = self.err;
                        var $1360 = Parser$Reply$error$($1357, $1358, $1359);
                        var $1356 = $1360;
                        break;
                    case 'Parser.Reply.value':
                        var $1361 = self.idx;
                        var $1362 = self.code;
                        var self = Kind$Parser$term$($1361, $1362);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1364 = self.idx;
                                var $1365 = self.code;
                                var $1366 = self.err;
                                var $1367 = Parser$Reply$error$($1364, $1365, $1366);
                                var $1363 = $1367;
                                break;
                            case 'Parser.Reply.value':
                                var $1368 = self.idx;
                                var $1369 = self.code;
                                var $1370 = self.val;
                                var self = Kind$Parser$text$("then", $1368, $1369);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1372 = self.idx;
                                        var $1373 = self.code;
                                        var $1374 = self.err;
                                        var $1375 = Parser$Reply$error$($1372, $1373, $1374);
                                        var $1371 = $1375;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1376 = self.idx;
                                        var $1377 = self.code;
                                        var self = Kind$Parser$term$($1376, $1377);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1379 = self.idx;
                                                var $1380 = self.code;
                                                var $1381 = self.err;
                                                var $1382 = Parser$Reply$error$($1379, $1380, $1381);
                                                var $1378 = $1382;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1383 = self.idx;
                                                var $1384 = self.code;
                                                var $1385 = self.val;
                                                var self = Kind$Parser$text$("else", $1383, $1384);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1387 = self.idx;
                                                        var $1388 = self.code;
                                                        var $1389 = self.err;
                                                        var $1390 = Parser$Reply$error$($1387, $1388, $1389);
                                                        var $1386 = $1390;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1391 = self.idx;
                                                        var $1392 = self.code;
                                                        var self = Kind$Parser$term$($1391, $1392);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1394 = self.idx;
                                                                var $1395 = self.code;
                                                                var $1396 = self.err;
                                                                var $1397 = Parser$Reply$error$($1394, $1395, $1396);
                                                                var $1393 = $1397;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1398 = self.idx;
                                                                var $1399 = self.code;
                                                                var $1400 = self.val;
                                                                var self = Kind$Parser$stop$($1355, $1398, $1399);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1402 = self.idx;
                                                                        var $1403 = self.code;
                                                                        var $1404 = self.err;
                                                                        var $1405 = Parser$Reply$error$($1402, $1403, $1404);
                                                                        var $1401 = $1405;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1406 = self.idx;
                                                                        var $1407 = self.code;
                                                                        var $1408 = self.val;
                                                                        var _term$27 = $1370;
                                                                        var _term$28 = Kind$Term$app$(_term$27, Kind$Term$lam$("", (_x$28 => {
                                                                            var $1410 = Kind$Term$hol$(Bits$e);
                                                                            return $1410;
                                                                        })));
                                                                        var _term$29 = Kind$Term$app$(_term$28, $1385);
                                                                        var _term$30 = Kind$Term$app$(_term$29, $1400);
                                                                        var $1409 = Parser$Reply$value$($1406, $1407, Kind$Term$ori$($1408, _term$30));
                                                                        var $1401 = $1409;
                                                                        break;
                                                                };
                                                                var $1393 = $1401;
                                                                break;
                                                        };
                                                        var $1386 = $1393;
                                                        break;
                                                };
                                                var $1378 = $1386;
                                                break;
                                        };
                                        var $1371 = $1378;
                                        break;
                                };
                                var $1363 = $1371;
                                break;
                        };
                        var $1356 = $1363;
                        break;
                };
                var $1348 = $1356;
                break;
        };
        return $1348;
    };
    const Kind$Parser$if = x0 => x1 => Kind$Parser$if$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1412 = self.head;
                var $1413 = self.tail;
                var $1414 = List$cons$(_f$4($1412), List$mapped$($1413, _f$4));
                var $1411 = $1414;
                break;
            case 'List.nil':
                var $1415 = List$nil;
                var $1411 = $1415;
                break;
        };
        return $1411;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);
    const Kind$backslash = 92;
    const Kind$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Kind$backslash, String$cons$(Kind$backslash, String$nil)), Kind$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Kind$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Kind$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $1417 = self.fst;
                var $1418 = self.snd;
                var $1419 = (_idx$4 => _code$5 => {
                    var self = Parser$text$($1417, _idx$4, _code$5);
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
                            var $1427 = Parser$Reply$value$($1425, $1426, $1418);
                            var $1420 = $1427;
                            break;
                    };
                    return $1420;
                });
                var $1416 = $1419;
                break;
        };
        return $1416;
    }))), List$cons$(Parser$one, List$nil)));

    function Kind$Term$chr$(_chrx$1) {
        var $1428 = ({
            _: 'Kind.Term.chr',
            'chrx': _chrx$1
        });
        return $1428;
    };
    const Kind$Term$chr = x0 => Kind$Term$chr$(x0);

    function Kind$Parser$char$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1430 = self.idx;
                var $1431 = self.code;
                var $1432 = self.err;
                var $1433 = Parser$Reply$error$($1430, $1431, $1432);
                var $1429 = $1433;
                break;
            case 'Parser.Reply.value':
                var $1434 = self.idx;
                var $1435 = self.code;
                var $1436 = self.val;
                var self = Kind$Parser$text$("\'", $1434, $1435);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1438 = self.idx;
                        var $1439 = self.code;
                        var $1440 = self.err;
                        var $1441 = Parser$Reply$error$($1438, $1439, $1440);
                        var $1437 = $1441;
                        break;
                    case 'Parser.Reply.value':
                        var $1442 = self.idx;
                        var $1443 = self.code;
                        var self = Kind$Parser$char$single($1442)($1443);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1445 = self.idx;
                                var $1446 = self.code;
                                var $1447 = self.err;
                                var $1448 = Parser$Reply$error$($1445, $1446, $1447);
                                var $1444 = $1448;
                                break;
                            case 'Parser.Reply.value':
                                var $1449 = self.idx;
                                var $1450 = self.code;
                                var $1451 = self.val;
                                var self = Parser$text$("\'", $1449, $1450);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1453 = self.idx;
                                        var $1454 = self.code;
                                        var $1455 = self.err;
                                        var $1456 = Parser$Reply$error$($1453, $1454, $1455);
                                        var $1452 = $1456;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1457 = self.idx;
                                        var $1458 = self.code;
                                        var self = Kind$Parser$stop$($1436, $1457, $1458);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1460 = self.idx;
                                                var $1461 = self.code;
                                                var $1462 = self.err;
                                                var $1463 = Parser$Reply$error$($1460, $1461, $1462);
                                                var $1459 = $1463;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1464 = self.idx;
                                                var $1465 = self.code;
                                                var $1466 = self.val;
                                                var $1467 = Parser$Reply$value$($1464, $1465, Kind$Term$ori$($1466, Kind$Term$chr$($1451)));
                                                var $1459 = $1467;
                                                break;
                                        };
                                        var $1452 = $1459;
                                        break;
                                };
                                var $1444 = $1452;
                                break;
                        };
                        var $1437 = $1444;
                        break;
                };
                var $1429 = $1437;
                break;
        };
        return $1429;
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
                    var $1468 = _res$2;
                    return $1468;
                } else {
                    var $1469 = self.charCodeAt(0);
                    var $1470 = self.slice(1);
                    var $1471 = String$reverse$go$($1470, String$cons$($1469, _res$2));
                    return $1471;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1472 = String$reverse$go$(_xs$1, String$nil);
        return $1472;
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
                    var $1473 = Parser$Reply$error$(_idx$2, _code$3, "Non-terminating string.");
                    return $1473;
                } else {
                    var $1474 = self.charCodeAt(0);
                    var $1475 = self.slice(1);
                    var self = ($1474 === 34);
                    if (self) {
                        var $1477 = Parser$Reply$value$(Nat$succ$(_idx$2), $1475, String$reverse$(_str$1));
                        var $1476 = $1477;
                    } else {
                        var self = Kind$Parser$char$single(_idx$2)(_code$3);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1479 = self.idx;
                                var $1480 = self.code;
                                var $1481 = self.err;
                                var $1482 = Parser$Reply$error$($1479, $1480, $1481);
                                var $1478 = $1482;
                                break;
                            case 'Parser.Reply.value':
                                var $1483 = self.idx;
                                var $1484 = self.code;
                                var $1485 = self.val;
                                var $1486 = Kind$Parser$string$go$(String$cons$($1485, _str$1), $1483, $1484);
                                var $1478 = $1486;
                                break;
                        };
                        var $1476 = $1478;
                    };
                    return $1476;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Parser$string$go = x0 => x1 => x2 => Kind$Parser$string$go$(x0, x1, x2);

    function Kind$Term$str$(_strx$1) {
        var $1487 = ({
            _: 'Kind.Term.str',
            'strx': _strx$1
        });
        return $1487;
    };
    const Kind$Term$str = x0 => Kind$Term$str$(x0);

    function Kind$Parser$string$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1489 = self.idx;
                var $1490 = self.code;
                var $1491 = self.err;
                var $1492 = Parser$Reply$error$($1489, $1490, $1491);
                var $1488 = $1492;
                break;
            case 'Parser.Reply.value':
                var $1493 = self.idx;
                var $1494 = self.code;
                var $1495 = self.val;
                var self = Kind$Parser$text$(String$cons$(34, String$nil), $1493, $1494);
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
                        var self = Kind$Parser$string$go$("", $1501, $1502);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1504 = self.idx;
                                var $1505 = self.code;
                                var $1506 = self.err;
                                var $1507 = Parser$Reply$error$($1504, $1505, $1506);
                                var $1503 = $1507;
                                break;
                            case 'Parser.Reply.value':
                                var $1508 = self.idx;
                                var $1509 = self.code;
                                var $1510 = self.val;
                                var self = Kind$Parser$stop$($1495, $1508, $1509);
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
                                        var $1519 = Parser$Reply$value$($1516, $1517, Kind$Term$ori$($1518, Kind$Term$str$($1510)));
                                        var $1511 = $1519;
                                        break;
                                };
                                var $1503 = $1511;
                                break;
                        };
                        var $1496 = $1503;
                        break;
                };
                var $1488 = $1496;
                break;
        };
        return $1488;
    };
    const Kind$Parser$string = x0 => x1 => Kind$Parser$string$(x0, x1);

    function Kind$Parser$pair$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1521 = self.idx;
                var $1522 = self.code;
                var $1523 = self.err;
                var $1524 = Parser$Reply$error$($1521, $1522, $1523);
                var $1520 = $1524;
                break;
            case 'Parser.Reply.value':
                var $1525 = self.idx;
                var $1526 = self.code;
                var $1527 = self.val;
                var self = Kind$Parser$text$("{", $1525, $1526);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1529 = self.idx;
                        var $1530 = self.code;
                        var $1531 = self.err;
                        var $1532 = Parser$Reply$error$($1529, $1530, $1531);
                        var $1528 = $1532;
                        break;
                    case 'Parser.Reply.value':
                        var $1533 = self.idx;
                        var $1534 = self.code;
                        var self = Kind$Parser$term$($1533, $1534);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1536 = self.idx;
                                var $1537 = self.code;
                                var $1538 = self.err;
                                var $1539 = Parser$Reply$error$($1536, $1537, $1538);
                                var $1535 = $1539;
                                break;
                            case 'Parser.Reply.value':
                                var $1540 = self.idx;
                                var $1541 = self.code;
                                var $1542 = self.val;
                                var self = Kind$Parser$text$(",", $1540, $1541);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1544 = self.idx;
                                        var $1545 = self.code;
                                        var $1546 = self.err;
                                        var $1547 = Parser$Reply$error$($1544, $1545, $1546);
                                        var $1543 = $1547;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1548 = self.idx;
                                        var $1549 = self.code;
                                        var self = Kind$Parser$term$($1548, $1549);
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
                                                var self = Kind$Parser$text$("}", $1555, $1556);
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
                                                        var self = Kind$Parser$stop$($1527, $1563, $1564);
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
                                                                var _term$24 = Kind$Term$ref$("Pair.new");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, $1542);
                                                                var _term$28 = Kind$Term$app$(_term$27, $1557);
                                                                var $1573 = Parser$Reply$value$($1570, $1571, Kind$Term$ori$($1572, _term$28));
                                                                var $1565 = $1573;
                                                                break;
                                                        };
                                                        var $1558 = $1565;
                                                        break;
                                                };
                                                var $1550 = $1558;
                                                break;
                                        };
                                        var $1543 = $1550;
                                        break;
                                };
                                var $1535 = $1543;
                                break;
                        };
                        var $1528 = $1535;
                        break;
                };
                var $1520 = $1528;
                break;
        };
        return $1520;
    };
    const Kind$Parser$pair = x0 => x1 => Kind$Parser$pair$(x0, x1);

    function Kind$Parser$sigma$type$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1575 = self.idx;
                var $1576 = self.code;
                var $1577 = self.err;
                var $1578 = Parser$Reply$error$($1575, $1576, $1577);
                var $1574 = $1578;
                break;
            case 'Parser.Reply.value':
                var $1579 = self.idx;
                var $1580 = self.code;
                var $1581 = self.val;
                var self = Kind$Parser$text$("{", $1579, $1580);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1583 = self.idx;
                        var $1584 = self.code;
                        var $1585 = self.err;
                        var $1586 = Parser$Reply$error$($1583, $1584, $1585);
                        var $1582 = $1586;
                        break;
                    case 'Parser.Reply.value':
                        var $1587 = self.idx;
                        var $1588 = self.code;
                        var self = Kind$Parser$name1$($1587, $1588);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1590 = self.idx;
                                var $1591 = self.code;
                                var $1592 = self.err;
                                var $1593 = Parser$Reply$error$($1590, $1591, $1592);
                                var $1589 = $1593;
                                break;
                            case 'Parser.Reply.value':
                                var $1594 = self.idx;
                                var $1595 = self.code;
                                var $1596 = self.val;
                                var self = Kind$Parser$text$(":", $1594, $1595);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1598 = self.idx;
                                        var $1599 = self.code;
                                        var $1600 = self.err;
                                        var $1601 = Parser$Reply$error$($1598, $1599, $1600);
                                        var $1597 = $1601;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1602 = self.idx;
                                        var $1603 = self.code;
                                        var self = Kind$Parser$term$($1602, $1603);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1605 = self.idx;
                                                var $1606 = self.code;
                                                var $1607 = self.err;
                                                var $1608 = Parser$Reply$error$($1605, $1606, $1607);
                                                var $1604 = $1608;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1609 = self.idx;
                                                var $1610 = self.code;
                                                var $1611 = self.val;
                                                var self = Kind$Parser$text$("}", $1609, $1610);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1613 = self.idx;
                                                        var $1614 = self.code;
                                                        var $1615 = self.err;
                                                        var $1616 = Parser$Reply$error$($1613, $1614, $1615);
                                                        var $1612 = $1616;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1617 = self.idx;
                                                        var $1618 = self.code;
                                                        var self = Kind$Parser$term$($1617, $1618);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1620 = self.idx;
                                                                var $1621 = self.code;
                                                                var $1622 = self.err;
                                                                var $1623 = Parser$Reply$error$($1620, $1621, $1622);
                                                                var $1619 = $1623;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1624 = self.idx;
                                                                var $1625 = self.code;
                                                                var $1626 = self.val;
                                                                var self = Kind$Parser$stop$($1581, $1624, $1625);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1628 = self.idx;
                                                                        var $1629 = self.code;
                                                                        var $1630 = self.err;
                                                                        var $1631 = Parser$Reply$error$($1628, $1629, $1630);
                                                                        var $1627 = $1631;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1632 = self.idx;
                                                                        var $1633 = self.code;
                                                                        var $1634 = self.val;
                                                                        var _term$27 = Kind$Term$ref$("Sigma");
                                                                        var _term$28 = Kind$Term$app$(_term$27, $1611);
                                                                        var _term$29 = Kind$Term$app$(_term$28, Kind$Term$lam$($1596, (_x$29 => {
                                                                            var $1636 = $1626;
                                                                            return $1636;
                                                                        })));
                                                                        var $1635 = Parser$Reply$value$($1632, $1633, Kind$Term$ori$($1634, _term$29));
                                                                        var $1627 = $1635;
                                                                        break;
                                                                };
                                                                var $1619 = $1627;
                                                                break;
                                                        };
                                                        var $1612 = $1619;
                                                        break;
                                                };
                                                var $1604 = $1612;
                                                break;
                                        };
                                        var $1597 = $1604;
                                        break;
                                };
                                var $1589 = $1597;
                                break;
                        };
                        var $1582 = $1589;
                        break;
                };
                var $1574 = $1582;
                break;
        };
        return $1574;
    };
    const Kind$Parser$sigma$type = x0 => x1 => Kind$Parser$sigma$type$(x0, x1);

    function Kind$Parser$some$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1638 = self.idx;
                var $1639 = self.code;
                var $1640 = self.err;
                var $1641 = Parser$Reply$error$($1638, $1639, $1640);
                var $1637 = $1641;
                break;
            case 'Parser.Reply.value':
                var $1642 = self.idx;
                var $1643 = self.code;
                var $1644 = self.val;
                var self = Kind$Parser$text$("some(", $1642, $1643);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1646 = self.idx;
                        var $1647 = self.code;
                        var $1648 = self.err;
                        var $1649 = Parser$Reply$error$($1646, $1647, $1648);
                        var $1645 = $1649;
                        break;
                    case 'Parser.Reply.value':
                        var $1650 = self.idx;
                        var $1651 = self.code;
                        var self = Kind$Parser$term$($1650, $1651);
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
                                var self = Kind$Parser$text$(")", $1657, $1658);
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
                                        var self = Kind$Parser$stop$($1644, $1665, $1666);
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
                                                var _term$18 = Kind$Term$ref$("Maybe.some");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, $1659);
                                                var $1675 = Parser$Reply$value$($1672, $1673, Kind$Term$ori$($1674, _term$20));
                                                var $1667 = $1675;
                                                break;
                                        };
                                        var $1660 = $1667;
                                        break;
                                };
                                var $1652 = $1660;
                                break;
                        };
                        var $1645 = $1652;
                        break;
                };
                var $1637 = $1645;
                break;
        };
        return $1637;
    };
    const Kind$Parser$some = x0 => x1 => Kind$Parser$some$(x0, x1);

    function Kind$Parser$apply$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1677 = self.idx;
                var $1678 = self.code;
                var $1679 = self.err;
                var $1680 = Parser$Reply$error$($1677, $1678, $1679);
                var $1676 = $1680;
                break;
            case 'Parser.Reply.value':
                var $1681 = self.idx;
                var $1682 = self.code;
                var $1683 = self.val;
                var self = Kind$Parser$text$("apply(", $1681, $1682);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1685 = self.idx;
                        var $1686 = self.code;
                        var $1687 = self.err;
                        var $1688 = Parser$Reply$error$($1685, $1686, $1687);
                        var $1684 = $1688;
                        break;
                    case 'Parser.Reply.value':
                        var $1689 = self.idx;
                        var $1690 = self.code;
                        var self = Kind$Parser$term$($1689, $1690);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1692 = self.idx;
                                var $1693 = self.code;
                                var $1694 = self.err;
                                var $1695 = Parser$Reply$error$($1692, $1693, $1694);
                                var $1691 = $1695;
                                break;
                            case 'Parser.Reply.value':
                                var $1696 = self.idx;
                                var $1697 = self.code;
                                var $1698 = self.val;
                                var self = Kind$Parser$text$(",", $1696, $1697);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1700 = self.idx;
                                        var $1701 = self.code;
                                        var $1702 = self.err;
                                        var $1703 = Parser$Reply$error$($1700, $1701, $1702);
                                        var $1699 = $1703;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1704 = self.idx;
                                        var $1705 = self.code;
                                        var self = Kind$Parser$term$($1704, $1705);
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
                                                var self = Kind$Parser$text$(")", $1711, $1712);
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
                                                        var self = Kind$Parser$stop$($1683, $1719, $1720);
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
                                                                var _term$24 = Kind$Term$ref$("Equal.apply");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$hol$(Bits$e));
                                                                var _term$28 = Kind$Term$app$(_term$27, Kind$Term$hol$(Bits$e));
                                                                var _term$29 = Kind$Term$app$(_term$28, $1698);
                                                                var _term$30 = Kind$Term$app$(_term$29, $1713);
                                                                var $1729 = Parser$Reply$value$($1726, $1727, Kind$Term$ori$($1728, _term$30));
                                                                var $1721 = $1729;
                                                                break;
                                                        };
                                                        var $1714 = $1721;
                                                        break;
                                                };
                                                var $1706 = $1714;
                                                break;
                                        };
                                        var $1699 = $1706;
                                        break;
                                };
                                var $1691 = $1699;
                                break;
                        };
                        var $1684 = $1691;
                        break;
                };
                var $1676 = $1684;
                break;
        };
        return $1676;
    };
    const Kind$Parser$apply = x0 => x1 => Kind$Parser$apply$(x0, x1);

    function Kind$Parser$mirror$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1731 = self.idx;
                var $1732 = self.code;
                var $1733 = self.err;
                var $1734 = Parser$Reply$error$($1731, $1732, $1733);
                var $1730 = $1734;
                break;
            case 'Parser.Reply.value':
                var $1735 = self.idx;
                var $1736 = self.code;
                var $1737 = self.val;
                var self = Kind$Parser$text$("mirror(", $1735, $1736);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1739 = self.idx;
                        var $1740 = self.code;
                        var $1741 = self.err;
                        var $1742 = Parser$Reply$error$($1739, $1740, $1741);
                        var $1738 = $1742;
                        break;
                    case 'Parser.Reply.value':
                        var $1743 = self.idx;
                        var $1744 = self.code;
                        var self = Kind$Parser$term$($1743, $1744);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1746 = self.idx;
                                var $1747 = self.code;
                                var $1748 = self.err;
                                var $1749 = Parser$Reply$error$($1746, $1747, $1748);
                                var $1745 = $1749;
                                break;
                            case 'Parser.Reply.value':
                                var $1750 = self.idx;
                                var $1751 = self.code;
                                var $1752 = self.val;
                                var self = Kind$Parser$text$(")", $1750, $1751);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1754 = self.idx;
                                        var $1755 = self.code;
                                        var $1756 = self.err;
                                        var $1757 = Parser$Reply$error$($1754, $1755, $1756);
                                        var $1753 = $1757;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1758 = self.idx;
                                        var $1759 = self.code;
                                        var self = Kind$Parser$stop$($1737, $1758, $1759);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1761 = self.idx;
                                                var $1762 = self.code;
                                                var $1763 = self.err;
                                                var $1764 = Parser$Reply$error$($1761, $1762, $1763);
                                                var $1760 = $1764;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1765 = self.idx;
                                                var $1766 = self.code;
                                                var $1767 = self.val;
                                                var _term$18 = Kind$Term$ref$("Equal.mirror");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, Kind$Term$hol$(Bits$e));
                                                var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                var _term$22 = Kind$Term$app$(_term$21, $1752);
                                                var $1768 = Parser$Reply$value$($1765, $1766, Kind$Term$ori$($1767, _term$22));
                                                var $1760 = $1768;
                                                break;
                                        };
                                        var $1753 = $1760;
                                        break;
                                };
                                var $1745 = $1753;
                                break;
                        };
                        var $1738 = $1745;
                        break;
                };
                var $1730 = $1738;
                break;
        };
        return $1730;
    };
    const Kind$Parser$mirror = x0 => x1 => Kind$Parser$mirror$(x0, x1);

    function Kind$Name$read$(_str$1) {
        var $1769 = _str$1;
        return $1769;
    };
    const Kind$Name$read = x0 => Kind$Name$read$(x0);

    function Kind$Parser$list$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1771 = self.idx;
                var $1772 = self.code;
                var $1773 = self.err;
                var $1774 = Parser$Reply$error$($1771, $1772, $1773);
                var $1770 = $1774;
                break;
            case 'Parser.Reply.value':
                var $1775 = self.idx;
                var $1776 = self.code;
                var $1777 = self.val;
                var self = Kind$Parser$text$("[", $1775, $1776);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1779 = self.idx;
                        var $1780 = self.code;
                        var $1781 = self.err;
                        var $1782 = Parser$Reply$error$($1779, $1780, $1781);
                        var $1778 = $1782;
                        break;
                    case 'Parser.Reply.value':
                        var $1783 = self.idx;
                        var $1784 = self.code;
                        var self = Parser$until$(Kind$Parser$text("]"), Kind$Parser$item(Kind$Parser$term))($1783)($1784);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1786 = self.idx;
                                var $1787 = self.code;
                                var $1788 = self.err;
                                var $1789 = Parser$Reply$error$($1786, $1787, $1788);
                                var $1785 = $1789;
                                break;
                            case 'Parser.Reply.value':
                                var $1790 = self.idx;
                                var $1791 = self.code;
                                var $1792 = self.val;
                                var self = Kind$Parser$stop$($1777, $1790, $1791);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1794 = self.idx;
                                        var $1795 = self.code;
                                        var $1796 = self.err;
                                        var $1797 = Parser$Reply$error$($1794, $1795, $1796);
                                        var $1793 = $1797;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1798 = self.idx;
                                        var $1799 = self.code;
                                        var $1800 = self.val;
                                        var $1801 = Parser$Reply$value$($1798, $1799, List$fold$($1792, Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("List.nil")), Kind$Term$hol$(Bits$e)), (_x$15 => _xs$16 => {
                                            var _term$17 = Kind$Term$ref$(Kind$Name$read$("List.cons"));
                                            var _term$18 = Kind$Term$app$(_term$17, Kind$Term$hol$(Bits$e));
                                            var _term$19 = Kind$Term$app$(_term$18, _x$15);
                                            var _term$20 = Kind$Term$app$(_term$19, _xs$16);
                                            var $1802 = Kind$Term$ori$($1800, _term$20);
                                            return $1802;
                                        })));
                                        var $1793 = $1801;
                                        break;
                                };
                                var $1785 = $1793;
                                break;
                        };
                        var $1778 = $1785;
                        break;
                };
                var $1770 = $1778;
                break;
        };
        return $1770;
    };
    const Kind$Parser$list = x0 => x1 => Kind$Parser$list$(x0, x1);

    function Kind$Parser$map$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $1810 = self.val;
                var self = Kind$Parser$text$("{", $1808, $1809);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1812 = self.idx;
                        var $1813 = self.code;
                        var $1814 = self.err;
                        var $1815 = Parser$Reply$error$($1812, $1813, $1814);
                        var $1811 = $1815;
                        break;
                    case 'Parser.Reply.value':
                        var $1816 = self.idx;
                        var $1817 = self.code;
                        var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item((_idx$9 => _code$10 => {
                            var self = Kind$Parser$term$(_idx$9, _code$10);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1820 = self.idx;
                                    var $1821 = self.code;
                                    var $1822 = self.err;
                                    var $1823 = Parser$Reply$error$($1820, $1821, $1822);
                                    var $1819 = $1823;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1824 = self.idx;
                                    var $1825 = self.code;
                                    var $1826 = self.val;
                                    var self = Kind$Parser$text$(":", $1824, $1825);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1828 = self.idx;
                                            var $1829 = self.code;
                                            var $1830 = self.err;
                                            var $1831 = Parser$Reply$error$($1828, $1829, $1830);
                                            var $1827 = $1831;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1832 = self.idx;
                                            var $1833 = self.code;
                                            var self = Kind$Parser$term$($1832, $1833);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1835 = self.idx;
                                                    var $1836 = self.code;
                                                    var $1837 = self.err;
                                                    var $1838 = Parser$Reply$error$($1835, $1836, $1837);
                                                    var $1834 = $1838;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1839 = self.idx;
                                                    var $1840 = self.code;
                                                    var $1841 = self.val;
                                                    var $1842 = Parser$Reply$value$($1839, $1840, Pair$new$($1826, $1841));
                                                    var $1834 = $1842;
                                                    break;
                                            };
                                            var $1827 = $1834;
                                            break;
                                    };
                                    var $1819 = $1827;
                                    break;
                            };
                            return $1819;
                        })))($1816)($1817);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1843 = self.idx;
                                var $1844 = self.code;
                                var $1845 = self.err;
                                var $1846 = Parser$Reply$error$($1843, $1844, $1845);
                                var $1818 = $1846;
                                break;
                            case 'Parser.Reply.value':
                                var $1847 = self.idx;
                                var $1848 = self.code;
                                var $1849 = self.val;
                                var self = Kind$Parser$stop$($1810, $1847, $1848);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1851 = self.idx;
                                        var $1852 = self.code;
                                        var $1853 = self.err;
                                        var $1854 = Parser$Reply$error$($1851, $1852, $1853);
                                        var $1850 = $1854;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1855 = self.idx;
                                        var $1856 = self.code;
                                        var $1857 = self.val;
                                        var _list$15 = List$fold$($1849, Kind$Term$app$(Kind$Term$ref$("List.nil"), Kind$Term$hol$(Bits$e)), (_kv$15 => _xs$16 => {
                                            var self = _kv$15;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $1860 = self.fst;
                                                    var $1861 = self.snd;
                                                    var _pair$19 = Kind$Term$ref$("Pair.new");
                                                    var _pair$20 = Kind$Term$app$(_pair$19, Kind$Term$hol$(Bits$e));
                                                    var _pair$21 = Kind$Term$app$(_pair$20, Kind$Term$hol$(Bits$e));
                                                    var _pair$22 = Kind$Term$app$(_pair$21, $1860);
                                                    var _pair$23 = Kind$Term$app$(_pair$22, $1861);
                                                    var _term$24 = Kind$Term$ref$("List.cons");
                                                    var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                    var _term$26 = Kind$Term$app$(_term$25, _pair$23);
                                                    var _term$27 = Kind$Term$app$(_term$26, _xs$16);
                                                    var $1862 = Kind$Term$ori$($1857, _term$27);
                                                    var $1859 = $1862;
                                                    break;
                                            };
                                            return $1859;
                                        }));
                                        var _term$16 = Kind$Term$ref$("Map.from_list");
                                        var _term$17 = Kind$Term$app$(_term$16, Kind$Term$hol$(Bits$e));
                                        var _term$18 = Kind$Term$app$(_term$17, _list$15);
                                        var $1858 = Parser$Reply$value$($1855, $1856, Kind$Term$ori$($1857, _term$18));
                                        var $1850 = $1858;
                                        break;
                                };
                                var $1818 = $1850;
                                break;
                        };
                        var $1811 = $1818;
                        break;
                };
                var $1803 = $1811;
                break;
        };
        return $1803;
    };
    const Kind$Parser$map = x0 => x1 => Kind$Parser$map$(x0, x1);

    function Kind$Parser$log$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1864 = self.idx;
                var $1865 = self.code;
                var $1866 = self.err;
                var $1867 = Parser$Reply$error$($1864, $1865, $1866);
                var $1863 = $1867;
                break;
            case 'Parser.Reply.value':
                var $1868 = self.idx;
                var $1869 = self.code;
                var $1870 = self.val;
                var self = Kind$Parser$text$("log(", $1868, $1869);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1872 = self.idx;
                        var $1873 = self.code;
                        var $1874 = self.err;
                        var $1875 = Parser$Reply$error$($1872, $1873, $1874);
                        var $1871 = $1875;
                        break;
                    case 'Parser.Reply.value':
                        var $1876 = self.idx;
                        var $1877 = self.code;
                        var self = Parser$until$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term))($1876)($1877);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1879 = self.idx;
                                var $1880 = self.code;
                                var $1881 = self.err;
                                var $1882 = Parser$Reply$error$($1879, $1880, $1881);
                                var $1878 = $1882;
                                break;
                            case 'Parser.Reply.value':
                                var $1883 = self.idx;
                                var $1884 = self.code;
                                var $1885 = self.val;
                                var self = Kind$Parser$term$($1883, $1884);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1887 = self.idx;
                                        var $1888 = self.code;
                                        var $1889 = self.err;
                                        var $1890 = Parser$Reply$error$($1887, $1888, $1889);
                                        var $1886 = $1890;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1891 = self.idx;
                                        var $1892 = self.code;
                                        var $1893 = self.val;
                                        var _term$15 = Kind$Term$ref$("Debug.log");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                        var _args$17 = List$fold$($1885, Kind$Term$ref$("String.nil"), (_x$17 => _xs$18 => {
                                            var _arg$19 = Kind$Term$ref$("String.concat");
                                            var _arg$20 = Kind$Term$app$(_arg$19, _x$17);
                                            var _arg$21 = Kind$Term$app$(_arg$20, _xs$18);
                                            var $1895 = _arg$21;
                                            return $1895;
                                        }));
                                        var _term$18 = Kind$Term$app$(_term$16, _args$17);
                                        var _term$19 = Kind$Term$app$(_term$18, Kind$Term$lam$("x", (_x$19 => {
                                            var $1896 = $1893;
                                            return $1896;
                                        })));
                                        var self = Kind$Parser$stop$($1870, $1891, $1892);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1897 = self.idx;
                                                var $1898 = self.code;
                                                var $1899 = self.err;
                                                var $1900 = Parser$Reply$error$($1897, $1898, $1899);
                                                var $1894 = $1900;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1901 = self.idx;
                                                var $1902 = self.code;
                                                var $1903 = self.val;
                                                var $1904 = Parser$Reply$value$($1901, $1902, Kind$Term$ori$($1903, _term$19));
                                                var $1894 = $1904;
                                                break;
                                        };
                                        var $1886 = $1894;
                                        break;
                                };
                                var $1878 = $1886;
                                break;
                        };
                        var $1871 = $1878;
                        break;
                };
                var $1863 = $1871;
                break;
        };
        return $1863;
    };
    const Kind$Parser$log = x0 => x1 => Kind$Parser$log$(x0, x1);

    function Kind$Parser$do$statements$(_monad_name$1) {
        var $1905 = Parser$first_of$(List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1907 = self.idx;
                    var $1908 = self.code;
                    var $1909 = self.err;
                    var $1910 = Parser$Reply$error$($1907, $1908, $1909);
                    var $1906 = $1910;
                    break;
                case 'Parser.Reply.value':
                    var $1911 = self.idx;
                    var $1912 = self.code;
                    var $1913 = self.val;
                    var self = Parser$first_of$(List$cons$(Kind$Parser$text("var "), List$cons$(Kind$Parser$text("get "), List$nil)))($1911)($1912);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1915 = self.idx;
                            var $1916 = self.code;
                            var $1917 = self.err;
                            var $1918 = Parser$Reply$error$($1915, $1916, $1917);
                            var $1914 = $1918;
                            break;
                        case 'Parser.Reply.value':
                            var $1919 = self.idx;
                            var $1920 = self.code;
                            var self = Kind$Parser$name1$($1919, $1920);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1922 = self.idx;
                                    var $1923 = self.code;
                                    var $1924 = self.err;
                                    var $1925 = Parser$Reply$error$($1922, $1923, $1924);
                                    var $1921 = $1925;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1926 = self.idx;
                                    var $1927 = self.code;
                                    var $1928 = self.val;
                                    var self = Kind$Parser$text$("=", $1926, $1927);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1930 = self.idx;
                                            var $1931 = self.code;
                                            var $1932 = self.err;
                                            var $1933 = Parser$Reply$error$($1930, $1931, $1932);
                                            var $1929 = $1933;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1934 = self.idx;
                                            var $1935 = self.code;
                                            var self = Kind$Parser$term$($1934, $1935);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1937 = self.idx;
                                                    var $1938 = self.code;
                                                    var $1939 = self.err;
                                                    var $1940 = Parser$Reply$error$($1937, $1938, $1939);
                                                    var $1936 = $1940;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1941 = self.idx;
                                                    var $1942 = self.code;
                                                    var $1943 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1941, $1942);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1945 = self.idx;
                                                            var $1946 = self.code;
                                                            var $1947 = self.err;
                                                            var $1948 = Parser$Reply$error$($1945, $1946, $1947);
                                                            var $1944 = $1948;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1949 = self.idx;
                                                            var $1950 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($1949)($1950);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $1952 = self.idx;
                                                                    var $1953 = self.code;
                                                                    var $1954 = self.err;
                                                                    var $1955 = Parser$Reply$error$($1952, $1953, $1954);
                                                                    var $1951 = $1955;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $1956 = self.idx;
                                                                    var $1957 = self.code;
                                                                    var $1958 = self.val;
                                                                    var self = Kind$Parser$stop$($1913, $1956, $1957);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $1960 = self.idx;
                                                                            var $1961 = self.code;
                                                                            var $1962 = self.err;
                                                                            var $1963 = Parser$Reply$error$($1960, $1961, $1962);
                                                                            var $1959 = $1963;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $1964 = self.idx;
                                                                            var $1965 = self.code;
                                                                            var $1966 = self.val;
                                                                            var _term$28 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                                            var _term$29 = Kind$Term$app$(_term$28, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                                            var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                            var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                            var _term$32 = Kind$Term$app$(_term$31, $1943);
                                                                            var _term$33 = Kind$Term$app$(_term$32, Kind$Term$lam$($1928, (_x$33 => {
                                                                                var $1968 = $1958;
                                                                                return $1968;
                                                                            })));
                                                                            var $1967 = Parser$Reply$value$($1964, $1965, Kind$Term$ori$($1966, _term$33));
                                                                            var $1959 = $1967;
                                                                            break;
                                                                    };
                                                                    var $1951 = $1959;
                                                                    break;
                                                            };
                                                            var $1944 = $1951;
                                                            break;
                                                    };
                                                    var $1936 = $1944;
                                                    break;
                                            };
                                            var $1929 = $1936;
                                            break;
                                    };
                                    var $1921 = $1929;
                                    break;
                            };
                            var $1914 = $1921;
                            break;
                    };
                    var $1906 = $1914;
                    break;
            };
            return $1906;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1970 = self.idx;
                    var $1971 = self.code;
                    var $1972 = self.err;
                    var $1973 = Parser$Reply$error$($1970, $1971, $1972);
                    var $1969 = $1973;
                    break;
                case 'Parser.Reply.value':
                    var $1974 = self.idx;
                    var $1975 = self.code;
                    var $1976 = self.val;
                    var self = Kind$Parser$text$("let ", $1974, $1975);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1978 = self.idx;
                            var $1979 = self.code;
                            var $1980 = self.err;
                            var $1981 = Parser$Reply$error$($1978, $1979, $1980);
                            var $1977 = $1981;
                            break;
                        case 'Parser.Reply.value':
                            var $1982 = self.idx;
                            var $1983 = self.code;
                            var self = Kind$Parser$name1$($1982, $1983);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1985 = self.idx;
                                    var $1986 = self.code;
                                    var $1987 = self.err;
                                    var $1988 = Parser$Reply$error$($1985, $1986, $1987);
                                    var $1984 = $1988;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1989 = self.idx;
                                    var $1990 = self.code;
                                    var $1991 = self.val;
                                    var self = Kind$Parser$text$("=", $1989, $1990);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1993 = self.idx;
                                            var $1994 = self.code;
                                            var $1995 = self.err;
                                            var $1996 = Parser$Reply$error$($1993, $1994, $1995);
                                            var $1992 = $1996;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1997 = self.idx;
                                            var $1998 = self.code;
                                            var self = Kind$Parser$term$($1997, $1998);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2000 = self.idx;
                                                    var $2001 = self.code;
                                                    var $2002 = self.err;
                                                    var $2003 = Parser$Reply$error$($2000, $2001, $2002);
                                                    var $1999 = $2003;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2004 = self.idx;
                                                    var $2005 = self.code;
                                                    var $2006 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2004, $2005);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2008 = self.idx;
                                                            var $2009 = self.code;
                                                            var $2010 = self.err;
                                                            var $2011 = Parser$Reply$error$($2008, $2009, $2010);
                                                            var $2007 = $2011;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2012 = self.idx;
                                                            var $2013 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($2012)($2013);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $2015 = self.idx;
                                                                    var $2016 = self.code;
                                                                    var $2017 = self.err;
                                                                    var $2018 = Parser$Reply$error$($2015, $2016, $2017);
                                                                    var $2014 = $2018;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $2019 = self.idx;
                                                                    var $2020 = self.code;
                                                                    var $2021 = self.val;
                                                                    var self = Kind$Parser$stop$($1976, $2019, $2020);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $2023 = self.idx;
                                                                            var $2024 = self.code;
                                                                            var $2025 = self.err;
                                                                            var $2026 = Parser$Reply$error$($2023, $2024, $2025);
                                                                            var $2022 = $2026;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2027 = self.idx;
                                                                            var $2028 = self.code;
                                                                            var $2029 = self.val;
                                                                            var $2030 = Parser$Reply$value$($2027, $2028, Kind$Term$ori$($2029, Kind$Term$let$($1991, $2006, (_x$28 => {
                                                                                var $2031 = $2021;
                                                                                return $2031;
                                                                            }))));
                                                                            var $2022 = $2030;
                                                                            break;
                                                                    };
                                                                    var $2014 = $2022;
                                                                    break;
                                                            };
                                                            var $2007 = $2014;
                                                            break;
                                                    };
                                                    var $1999 = $2007;
                                                    break;
                                            };
                                            var $1992 = $1999;
                                            break;
                                    };
                                    var $1984 = $1992;
                                    break;
                            };
                            var $1977 = $1984;
                            break;
                    };
                    var $1969 = $1977;
                    break;
            };
            return $1969;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2033 = self.idx;
                    var $2034 = self.code;
                    var $2035 = self.err;
                    var $2036 = Parser$Reply$error$($2033, $2034, $2035);
                    var $2032 = $2036;
                    break;
                case 'Parser.Reply.value':
                    var $2037 = self.idx;
                    var $2038 = self.code;
                    var $2039 = self.val;
                    var self = Kind$Parser$text$("return ", $2037, $2038);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2041 = self.idx;
                            var $2042 = self.code;
                            var $2043 = self.err;
                            var $2044 = Parser$Reply$error$($2041, $2042, $2043);
                            var $2040 = $2044;
                            break;
                        case 'Parser.Reply.value':
                            var $2045 = self.idx;
                            var $2046 = self.code;
                            var self = Kind$Parser$term$($2045, $2046);
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
                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2052, $2053);
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
                                            var self = Kind$Parser$stop$($2039, $2060, $2061);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2063 = self.idx;
                                                    var $2064 = self.code;
                                                    var $2065 = self.err;
                                                    var $2066 = Parser$Reply$error$($2063, $2064, $2065);
                                                    var $2062 = $2066;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2067 = self.idx;
                                                    var $2068 = self.code;
                                                    var $2069 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.pure"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, $2054);
                                                    var $2070 = Parser$Reply$value$($2067, $2068, Kind$Term$ori$($2069, _term$22));
                                                    var $2062 = $2070;
                                                    break;
                                            };
                                            var $2055 = $2062;
                                            break;
                                    };
                                    var $2047 = $2055;
                                    break;
                            };
                            var $2040 = $2047;
                            break;
                    };
                    var $2032 = $2040;
                    break;
            };
            return $2032;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2072 = self.idx;
                    var $2073 = self.code;
                    var $2074 = self.err;
                    var $2075 = Parser$Reply$error$($2072, $2073, $2074);
                    var $2071 = $2075;
                    break;
                case 'Parser.Reply.value':
                    var $2076 = self.idx;
                    var $2077 = self.code;
                    var $2078 = self.val;
                    var self = Kind$Parser$term$($2076, $2077);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2080 = self.idx;
                            var $2081 = self.code;
                            var $2082 = self.err;
                            var $2083 = Parser$Reply$error$($2080, $2081, $2082);
                            var $2079 = $2083;
                            break;
                        case 'Parser.Reply.value':
                            var $2084 = self.idx;
                            var $2085 = self.code;
                            var $2086 = self.val;
                            var self = Parser$maybe$(Kind$Parser$text(";"), $2084, $2085);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2088 = self.idx;
                                    var $2089 = self.code;
                                    var $2090 = self.err;
                                    var $2091 = Parser$Reply$error$($2088, $2089, $2090);
                                    var $2087 = $2091;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2092 = self.idx;
                                    var $2093 = self.code;
                                    var self = Kind$Parser$do$statements$(_monad_name$1)($2092)($2093);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2095 = self.idx;
                                            var $2096 = self.code;
                                            var $2097 = self.err;
                                            var $2098 = Parser$Reply$error$($2095, $2096, $2097);
                                            var $2094 = $2098;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2099 = self.idx;
                                            var $2100 = self.code;
                                            var $2101 = self.val;
                                            var self = Kind$Parser$stop$($2078, $2099, $2100);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2103 = self.idx;
                                                    var $2104 = self.code;
                                                    var $2105 = self.err;
                                                    var $2106 = Parser$Reply$error$($2103, $2104, $2105);
                                                    var $2102 = $2106;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2107 = self.idx;
                                                    var $2108 = self.code;
                                                    var $2109 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, Kind$Term$hol$(Bits$e));
                                                    var _term$23 = Kind$Term$app$(_term$22, $2086);
                                                    var _term$24 = Kind$Term$app$(_term$23, Kind$Term$lam$("", (_x$24 => {
                                                        var $2111 = $2101;
                                                        return $2111;
                                                    })));
                                                    var $2110 = Parser$Reply$value$($2107, $2108, Kind$Term$ori$($2109, _term$24));
                                                    var $2102 = $2110;
                                                    break;
                                            };
                                            var $2094 = $2102;
                                            break;
                                    };
                                    var $2087 = $2094;
                                    break;
                            };
                            var $2079 = $2087;
                            break;
                    };
                    var $2071 = $2079;
                    break;
            };
            return $2071;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$term$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2113 = self.idx;
                    var $2114 = self.code;
                    var $2115 = self.err;
                    var $2116 = Parser$Reply$error$($2113, $2114, $2115);
                    var $2112 = $2116;
                    break;
                case 'Parser.Reply.value':
                    var $2117 = self.idx;
                    var $2118 = self.code;
                    var $2119 = self.val;
                    var self = Parser$maybe$(Kind$Parser$text(";"), $2117, $2118);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2121 = self.idx;
                            var $2122 = self.code;
                            var $2123 = self.err;
                            var $2124 = Parser$Reply$error$($2121, $2122, $2123);
                            var $2120 = $2124;
                            break;
                        case 'Parser.Reply.value':
                            var $2125 = self.idx;
                            var $2126 = self.code;
                            var $2127 = Parser$Reply$value$($2125, $2126, $2119);
                            var $2120 = $2127;
                            break;
                    };
                    var $2112 = $2120;
                    break;
            };
            return $2112;
        }), List$nil))))));
        return $1905;
    };
    const Kind$Parser$do$statements = x0 => Kind$Parser$do$statements$(x0);

    function Kind$Parser$do$(_idx$1, _code$2) {
        var self = Parser$maybe$(Kind$Parser$text("do "), _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2129 = self.idx;
                var $2130 = self.code;
                var $2131 = self.err;
                var $2132 = Parser$Reply$error$($2129, $2130, $2131);
                var $2128 = $2132;
                break;
            case 'Parser.Reply.value':
                var $2133 = self.idx;
                var $2134 = self.code;
                var self = Kind$Parser$name1$($2133, $2134);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2136 = self.idx;
                        var $2137 = self.code;
                        var $2138 = self.err;
                        var $2139 = Parser$Reply$error$($2136, $2137, $2138);
                        var $2135 = $2139;
                        break;
                    case 'Parser.Reply.value':
                        var $2140 = self.idx;
                        var $2141 = self.code;
                        var $2142 = self.val;
                        var self = Kind$Parser$text$("{", $2140, $2141);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2144 = self.idx;
                                var $2145 = self.code;
                                var $2146 = self.err;
                                var $2147 = Parser$Reply$error$($2144, $2145, $2146);
                                var $2143 = $2147;
                                break;
                            case 'Parser.Reply.value':
                                var $2148 = self.idx;
                                var $2149 = self.code;
                                var self = Kind$Parser$do$statements$($2142)($2148)($2149);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2151 = self.idx;
                                        var $2152 = self.code;
                                        var $2153 = self.err;
                                        var $2154 = Parser$Reply$error$($2151, $2152, $2153);
                                        var $2150 = $2154;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2155 = self.idx;
                                        var $2156 = self.code;
                                        var $2157 = self.val;
                                        var self = Kind$Parser$text$("}", $2155, $2156);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2159 = self.idx;
                                                var $2160 = self.code;
                                                var $2161 = self.err;
                                                var $2162 = Parser$Reply$error$($2159, $2160, $2161);
                                                var $2158 = $2162;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2163 = self.idx;
                                                var $2164 = self.code;
                                                var $2165 = Parser$Reply$value$($2163, $2164, $2157);
                                                var $2158 = $2165;
                                                break;
                                        };
                                        var $2150 = $2158;
                                        break;
                                };
                                var $2143 = $2150;
                                break;
                        };
                        var $2135 = $2143;
                        break;
                };
                var $2128 = $2135;
                break;
        };
        return $2128;
    };
    const Kind$Parser$do = x0 => x1 => Kind$Parser$do$(x0, x1);

    function Kind$Term$nat$(_natx$1) {
        var $2166 = ({
            _: 'Kind.Term.nat',
            'natx': _natx$1
        });
        return $2166;
    };
    const Kind$Term$nat = x0 => Kind$Term$nat$(x0);

    function Kind$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $2168 = Kind$Term$ref$(Kind$Name$read$("Nat.zero"));
            var $2167 = $2168;
        } else {
            var $2169 = (self - 1n);
            var _func$3 = Kind$Term$ref$(Kind$Name$read$("Nat.succ"));
            var _argm$4 = Kind$Term$nat$($2169);
            var $2170 = Kind$Term$app$(_func$3, _argm$4);
            var $2167 = $2170;
        };
        return $2167;
    };
    const Kind$Term$unroll_nat = x0 => Kind$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Kind$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2172 = self.slice(0, -1);
                var $2173 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.o")), Kind$Term$unroll_chr$bits$($2172));
                var $2171 = $2173;
                break;
            case 'i':
                var $2174 = self.slice(0, -1);
                var $2175 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.i")), Kind$Term$unroll_chr$bits$($2174));
                var $2171 = $2175;
                break;
            case 'e':
                var $2176 = Kind$Term$ref$(Kind$Name$read$("Bits.e"));
                var $2171 = $2176;
                break;
        };
        return $2171;
    };
    const Kind$Term$unroll_chr$bits = x0 => Kind$Term$unroll_chr$bits$(x0);

    function Kind$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Kind$Term$ref$(Kind$Name$read$("Word.from_bits"));
        var _term$4 = Kind$Term$app$(_term$3, Kind$Term$nat$(16n));
        var _term$5 = Kind$Term$app$(_term$4, Kind$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("U16.new")), _term$5);
        var $2177 = _term$6;
        return $2177;
    };
    const Kind$Term$unroll_chr = x0 => Kind$Term$unroll_chr$(x0);

    function Kind$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $2179 = Kind$Term$ref$(Kind$Name$read$("String.nil"));
            var $2178 = $2179;
        } else {
            var $2180 = self.charCodeAt(0);
            var $2181 = self.slice(1);
            var _char$4 = Kind$Term$chr$($2180);
            var _term$5 = Kind$Term$ref$(Kind$Name$read$("String.cons"));
            var _term$6 = Kind$Term$app$(_term$5, _char$4);
            var _term$7 = Kind$Term$app$(_term$6, Kind$Term$str$($2181));
            var $2182 = _term$7;
            var $2178 = $2182;
        };
        return $2178;
    };
    const Kind$Term$unroll_str = x0 => Kind$Term$unroll_str$(x0);

    function Kind$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $2184 = self.name;
                var self = Kind$get$($2184, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $2186 = self.value;
                        var self = $2186;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $2188 = self.term;
                                var $2189 = Kind$Term$reduce$($2188, _defs$2);
                                var $2187 = $2189;
                                break;
                        };
                        var $2185 = $2187;
                        break;
                    case 'Maybe.none':
                        var $2190 = Kind$Term$ref$($2184);
                        var $2185 = $2190;
                        break;
                };
                var $2183 = $2185;
                break;
            case 'Kind.Term.app':
                var $2191 = self.func;
                var $2192 = self.argm;
                var _func$5 = Kind$Term$reduce$($2191, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $2194 = self.body;
                        var $2195 = Kind$Term$reduce$($2194($2192), _defs$2);
                        var $2193 = $2195;
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
                        var $2196 = _term$1;
                        var $2193 = $2196;
                        break;
                };
                var $2183 = $2193;
                break;
            case 'Kind.Term.let':
                var $2197 = self.expr;
                var $2198 = self.body;
                var $2199 = Kind$Term$reduce$($2198($2197), _defs$2);
                var $2183 = $2199;
                break;
            case 'Kind.Term.def':
                var $2200 = self.expr;
                var $2201 = self.body;
                var $2202 = Kind$Term$reduce$($2201($2200), _defs$2);
                var $2183 = $2202;
                break;
            case 'Kind.Term.ann':
                var $2203 = self.term;
                var $2204 = Kind$Term$reduce$($2203, _defs$2);
                var $2183 = $2204;
                break;
            case 'Kind.Term.nat':
                var $2205 = self.natx;
                var $2206 = Kind$Term$reduce$(Kind$Term$unroll_nat$($2205), _defs$2);
                var $2183 = $2206;
                break;
            case 'Kind.Term.chr':
                var $2207 = self.chrx;
                var $2208 = Kind$Term$reduce$(Kind$Term$unroll_chr$($2207), _defs$2);
                var $2183 = $2208;
                break;
            case 'Kind.Term.str':
                var $2209 = self.strx;
                var $2210 = Kind$Term$reduce$(Kind$Term$unroll_str$($2209), _defs$2);
                var $2183 = $2210;
                break;
            case 'Kind.Term.ori':
                var $2211 = self.expr;
                var $2212 = Kind$Term$reduce$($2211, _defs$2);
                var $2183 = $2212;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.cse':
                var $2213 = _term$1;
                var $2183 = $2213;
                break;
        };
        return $2183;
    };
    const Kind$Term$reduce = x0 => x1 => Kind$Term$reduce$(x0, x1);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$9) {
        var $2214 = ({
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
        return $2214;
    };
    const Kind$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Def$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const Kind$Status$init = ({
        _: 'Kind.Status.init'
    });

    function Kind$Parser$case$with$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("with", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2216 = self.idx;
                var $2217 = self.code;
                var $2218 = self.err;
                var $2219 = Parser$Reply$error$($2216, $2217, $2218);
                var $2215 = $2219;
                break;
            case 'Parser.Reply.value':
                var $2220 = self.idx;
                var $2221 = self.code;
                var self = Kind$Parser$name1$($2220, $2221);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2223 = self.idx;
                        var $2224 = self.code;
                        var $2225 = self.err;
                        var $2226 = Parser$Reply$error$($2223, $2224, $2225);
                        var $2222 = $2226;
                        break;
                    case 'Parser.Reply.value':
                        var $2227 = self.idx;
                        var $2228 = self.code;
                        var $2229 = self.val;
                        var self = Kind$Parser$text$(":", $2227, $2228);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2231 = self.idx;
                                var $2232 = self.code;
                                var $2233 = self.err;
                                var $2234 = Parser$Reply$error$($2231, $2232, $2233);
                                var $2230 = $2234;
                                break;
                            case 'Parser.Reply.value':
                                var $2235 = self.idx;
                                var $2236 = self.code;
                                var self = Kind$Parser$term$($2235, $2236);
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
                                        var self = Kind$Parser$text$("=", $2242, $2243);
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
                                                        var $2260 = Parser$Reply$value$($2257, $2258, Kind$Def$new$("", "", Pair$new$(0n, 0n), $2229, $2259, $2244, Bool$false, 0n, Kind$Status$init));
                                                        var $2252 = $2260;
                                                        break;
                                                };
                                                var $2245 = $2252;
                                                break;
                                        };
                                        var $2237 = $2245;
                                        break;
                                };
                                var $2230 = $2237;
                                break;
                        };
                        var $2222 = $2230;
                        break;
                };
                var $2215 = $2222;
                break;
        };
        return $2215;
    };
    const Kind$Parser$case$with = x0 => x1 => Kind$Parser$case$with$(x0, x1);

    function Kind$Parser$case$case$(_idx$1, _code$2) {
        var self = Kind$Parser$name1$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2262 = self.idx;
                var $2263 = self.code;
                var $2264 = self.err;
                var $2265 = Parser$Reply$error$($2262, $2263, $2264);
                var $2261 = $2265;
                break;
            case 'Parser.Reply.value':
                var $2266 = self.idx;
                var $2267 = self.code;
                var $2268 = self.val;
                var self = Kind$Parser$text$(":", $2266, $2267);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2270 = self.idx;
                        var $2271 = self.code;
                        var $2272 = self.err;
                        var $2273 = Parser$Reply$error$($2270, $2271, $2272);
                        var $2269 = $2273;
                        break;
                    case 'Parser.Reply.value':
                        var $2274 = self.idx;
                        var $2275 = self.code;
                        var self = Kind$Parser$term$($2274, $2275);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2277 = self.idx;
                                var $2278 = self.code;
                                var $2279 = self.err;
                                var $2280 = Parser$Reply$error$($2277, $2278, $2279);
                                var $2276 = $2280;
                                break;
                            case 'Parser.Reply.value':
                                var $2281 = self.idx;
                                var $2282 = self.code;
                                var $2283 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text(","), $2281, $2282);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2285 = self.idx;
                                        var $2286 = self.code;
                                        var $2287 = self.err;
                                        var $2288 = Parser$Reply$error$($2285, $2286, $2287);
                                        var $2284 = $2288;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2289 = self.idx;
                                        var $2290 = self.code;
                                        var $2291 = Parser$Reply$value$($2289, $2290, Pair$new$($2268, $2283));
                                        var $2284 = $2291;
                                        break;
                                };
                                var $2276 = $2284;
                                break;
                        };
                        var $2269 = $2276;
                        break;
                };
                var $2261 = $2269;
                break;
        };
        return $2261;
    };
    const Kind$Parser$case$case = x0 => x1 => Kind$Parser$case$case$(x0, x1);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $2292 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $2292;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2294 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2296 = self.val;
                        var $2297 = self.lft;
                        var $2298 = self.rgt;
                        var $2299 = BitsMap$tie$($2296, BitsMap$set$($2294, _val$3, $2297), $2298);
                        var $2295 = $2299;
                        break;
                    case 'BitsMap.new':
                        var $2300 = BitsMap$tie$(Maybe$none, BitsMap$set$($2294, _val$3, BitsMap$new), BitsMap$new);
                        var $2295 = $2300;
                        break;
                };
                var $2293 = $2295;
                break;
            case 'i':
                var $2301 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2303 = self.val;
                        var $2304 = self.lft;
                        var $2305 = self.rgt;
                        var $2306 = BitsMap$tie$($2303, $2304, BitsMap$set$($2301, _val$3, $2305));
                        var $2302 = $2306;
                        break;
                    case 'BitsMap.new':
                        var $2307 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($2301, _val$3, BitsMap$new));
                        var $2302 = $2307;
                        break;
                };
                var $2293 = $2302;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $2309 = self.lft;
                        var $2310 = self.rgt;
                        var $2311 = BitsMap$tie$(Maybe$some$(_val$3), $2309, $2310);
                        var $2308 = $2311;
                        break;
                    case 'BitsMap.new':
                        var $2312 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $2308 = $2312;
                        break;
                };
                var $2293 = $2308;
                break;
        };
        return $2293;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);

    function BitsMap$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $2314 = self.head;
                var $2315 = self.tail;
                var self = $2314;
                switch (self._) {
                    case 'Pair.new':
                        var $2317 = self.fst;
                        var $2318 = self.snd;
                        var $2319 = BitsMap$set$($2317, $2318, BitsMap$from_list$($2315));
                        var $2316 = $2319;
                        break;
                };
                var $2313 = $2316;
                break;
            case 'List.nil':
                var $2320 = BitsMap$new;
                var $2313 = $2320;
                break;
        };
        return $2313;
    };
    const BitsMap$from_list = x0 => BitsMap$from_list$(x0);

    function Kind$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $2321 = ({
            _: 'Kind.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $2321;
    };
    const Kind$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$cse$(x0, x1, x2, x3, x4, x5);

    function Kind$Parser$case$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2323 = self.idx;
                var $2324 = self.code;
                var $2325 = self.err;
                var $2326 = Parser$Reply$error$($2323, $2324, $2325);
                var $2322 = $2326;
                break;
            case 'Parser.Reply.value':
                var $2327 = self.idx;
                var $2328 = self.code;
                var $2329 = self.val;
                var self = Kind$Parser$text$("case ", $2327, $2328);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2331 = self.idx;
                        var $2332 = self.code;
                        var $2333 = self.err;
                        var $2334 = Parser$Reply$error$($2331, $2332, $2333);
                        var $2330 = $2334;
                        break;
                    case 'Parser.Reply.value':
                        var $2335 = self.idx;
                        var $2336 = self.code;
                        var self = Kind$Parser$spaces($2335)($2336);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2338 = self.idx;
                                var $2339 = self.code;
                                var $2340 = self.err;
                                var $2341 = Parser$Reply$error$($2338, $2339, $2340);
                                var $2337 = $2341;
                                break;
                            case 'Parser.Reply.value':
                                var $2342 = self.idx;
                                var $2343 = self.code;
                                var self = Kind$Parser$term$($2342, $2343);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2345 = self.idx;
                                        var $2346 = self.code;
                                        var $2347 = self.err;
                                        var $2348 = Parser$Reply$error$($2345, $2346, $2347);
                                        var $2344 = $2348;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2349 = self.idx;
                                        var $2350 = self.code;
                                        var $2351 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2354 = self.idx;
                                                    var $2355 = self.code;
                                                    var $2356 = self.err;
                                                    var $2357 = Parser$Reply$error$($2354, $2355, $2356);
                                                    var $2353 = $2357;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2358 = self.idx;
                                                    var $2359 = self.code;
                                                    var $2360 = Kind$Parser$name1$($2358, $2359);
                                                    var $2353 = $2360;
                                                    break;
                                            };
                                            return $2353;
                                        }), $2349, $2350);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2361 = self.idx;
                                                var $2362 = self.code;
                                                var $2363 = self.err;
                                                var $2364 = Parser$Reply$error$($2361, $2362, $2363);
                                                var $2352 = $2364;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2365 = self.idx;
                                                var $2366 = self.code;
                                                var $2367 = self.val;
                                                var self = $2367;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2369 = self.value;
                                                        var $2370 = $2369;
                                                        var _name$18 = $2370;
                                                        break;
                                                    case 'Maybe.none':
                                                        var self = Kind$Term$reduce$($2351, BitsMap$new);
                                                        switch (self._) {
                                                            case 'Kind.Term.var':
                                                                var $2372 = self.name;
                                                                var $2373 = $2372;
                                                                var $2371 = $2373;
                                                                break;
                                                            case 'Kind.Term.ref':
                                                                var $2374 = self.name;
                                                                var $2375 = $2374;
                                                                var $2371 = $2375;
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
                                                                var $2376 = Kind$Name$read$("self");
                                                                var $2371 = $2376;
                                                                break;
                                                        };
                                                        var _name$18 = $2371;
                                                        break;
                                                };
                                                var self = Parser$many$(Kind$Parser$case$with)($2365)($2366);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2377 = self.idx;
                                                        var $2378 = self.code;
                                                        var $2379 = self.err;
                                                        var $2380 = Parser$Reply$error$($2377, $2378, $2379);
                                                        var $2368 = $2380;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2381 = self.idx;
                                                        var $2382 = self.code;
                                                        var $2383 = self.val;
                                                        var self = Kind$Parser$text$("{", $2381, $2382);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2385 = self.idx;
                                                                var $2386 = self.code;
                                                                var $2387 = self.err;
                                                                var $2388 = Parser$Reply$error$($2385, $2386, $2387);
                                                                var $2384 = $2388;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2389 = self.idx;
                                                                var $2390 = self.code;
                                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$case$case)($2389)($2390);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2392 = self.idx;
                                                                        var $2393 = self.code;
                                                                        var $2394 = self.err;
                                                                        var $2395 = Parser$Reply$error$($2392, $2393, $2394);
                                                                        var $2391 = $2395;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2396 = self.idx;
                                                                        var $2397 = self.code;
                                                                        var $2398 = self.val;
                                                                        var self = Parser$maybe$((_idx$28 => _code$29 => {
                                                                            var self = Kind$Parser$text$("else ", _idx$28, _code$29);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2401 = self.idx;
                                                                                    var $2402 = self.code;
                                                                                    var $2403 = self.err;
                                                                                    var $2404 = Parser$Reply$error$($2401, $2402, $2403);
                                                                                    var $2400 = $2404;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2405 = self.idx;
                                                                                    var $2406 = self.code;
                                                                                    var self = Kind$Parser$term$($2405, $2406);
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
                                                                                            var $2414 = self.val;
                                                                                            var $2415 = Parser$Reply$value$($2412, $2413, $2414);
                                                                                            var $2407 = $2415;
                                                                                            break;
                                                                                    };
                                                                                    var $2400 = $2407;
                                                                                    break;
                                                                            };
                                                                            return $2400;
                                                                        }), $2396, $2397);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2416 = self.idx;
                                                                                var $2417 = self.code;
                                                                                var $2418 = self.err;
                                                                                var $2419 = Parser$Reply$error$($2416, $2417, $2418);
                                                                                var $2399 = $2419;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2420 = self.idx;
                                                                                var $2421 = self.code;
                                                                                var $2422 = self.val;
                                                                                var self = $2422;
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $2424 = self.value;
                                                                                        var $2425 = List$cons$(Pair$new$("_", $2424), $2398);
                                                                                        var _cses$31 = $2425;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $2426 = $2398;
                                                                                        var _cses$31 = $2426;
                                                                                        break;
                                                                                };
                                                                                var _cses$32 = BitsMap$from_list$(List$mapped$(_cses$31, (_kv$32 => {
                                                                                    var self = _kv$32;
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $2428 = self.fst;
                                                                                            var $2429 = self.snd;
                                                                                            var $2430 = Pair$new$((kind_name_to_bits($2428)), $2429);
                                                                                            var $2427 = $2430;
                                                                                            break;
                                                                                    };
                                                                                    return $2427;
                                                                                })));
                                                                                var self = Parser$first_of$(List$cons$((_idx$33 => _code$34 => {
                                                                                    var self = Kind$Parser$text$(":", _idx$33, _code$34);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2432 = self.idx;
                                                                                            var $2433 = self.code;
                                                                                            var $2434 = self.err;
                                                                                            var $2435 = Parser$Reply$error$($2432, $2433, $2434);
                                                                                            var $2431 = $2435;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2436 = self.idx;
                                                                                            var $2437 = self.code;
                                                                                            var self = Kind$Parser$term$($2436, $2437);
                                                                                            switch (self._) {
                                                                                                case 'Parser.Reply.error':
                                                                                                    var $2439 = self.idx;
                                                                                                    var $2440 = self.code;
                                                                                                    var $2441 = self.err;
                                                                                                    var $2442 = Parser$Reply$error$($2439, $2440, $2441);
                                                                                                    var $2438 = $2442;
                                                                                                    break;
                                                                                                case 'Parser.Reply.value':
                                                                                                    var $2443 = self.idx;
                                                                                                    var $2444 = self.code;
                                                                                                    var $2445 = self.val;
                                                                                                    var $2446 = Parser$Reply$value$($2443, $2444, Maybe$some$($2445));
                                                                                                    var $2438 = $2446;
                                                                                                    break;
                                                                                            };
                                                                                            var $2431 = $2438;
                                                                                            break;
                                                                                    };
                                                                                    return $2431;
                                                                                }), List$cons$((_idx$33 => _code$34 => {
                                                                                    var self = Kind$Parser$text$("!", _idx$33, _code$34);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2448 = self.idx;
                                                                                            var $2449 = self.code;
                                                                                            var $2450 = self.err;
                                                                                            var $2451 = Parser$Reply$error$($2448, $2449, $2450);
                                                                                            var $2447 = $2451;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2452 = self.idx;
                                                                                            var $2453 = self.code;
                                                                                            var $2454 = Parser$Reply$value$($2452, $2453, Maybe$none);
                                                                                            var $2447 = $2454;
                                                                                            break;
                                                                                    };
                                                                                    return $2447;
                                                                                }), List$cons$((_idx$33 => _code$34 => {
                                                                                    var $2455 = Parser$Reply$value$(_idx$33, _code$34, Maybe$some$(Kind$Term$hol$(Bits$e)));
                                                                                    return $2455;
                                                                                }), List$nil))))($2420)($2421);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2456 = self.idx;
                                                                                        var $2457 = self.code;
                                                                                        var $2458 = self.err;
                                                                                        var $2459 = Parser$Reply$error$($2456, $2457, $2458);
                                                                                        var $2423 = $2459;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2460 = self.idx;
                                                                                        var $2461 = self.code;
                                                                                        var $2462 = self.val;
                                                                                        var self = Kind$Parser$stop$($2329, $2460, $2461);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2464 = self.idx;
                                                                                                var $2465 = self.code;
                                                                                                var $2466 = self.err;
                                                                                                var $2467 = Parser$Reply$error$($2464, $2465, $2466);
                                                                                                var $2463 = $2467;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2468 = self.idx;
                                                                                                var $2469 = self.code;
                                                                                                var $2470 = self.val;
                                                                                                var $2471 = Parser$Reply$value$($2468, $2469, Kind$Term$ori$($2470, Kind$Term$cse$(Bits$e, $2351, _name$18, $2383, _cses$32, $2462)));
                                                                                                var $2463 = $2471;
                                                                                                break;
                                                                                        };
                                                                                        var $2423 = $2463;
                                                                                        break;
                                                                                };
                                                                                var $2399 = $2423;
                                                                                break;
                                                                        };
                                                                        var $2391 = $2399;
                                                                        break;
                                                                };
                                                                var $2384 = $2391;
                                                                break;
                                                        };
                                                        var $2368 = $2384;
                                                        break;
                                                };
                                                var $2352 = $2368;
                                                break;
                                        };
                                        var $2344 = $2352;
                                        break;
                                };
                                var $2337 = $2344;
                                break;
                        };
                        var $2330 = $2337;
                        break;
                };
                var $2322 = $2330;
                break;
        };
        return $2322;
    };
    const Kind$Parser$case = x0 => x1 => Kind$Parser$case$(x0, x1);

    function Kind$set$(_name$2, _val$3, _map$4) {
        var $2472 = BitsMap$set$((kind_name_to_bits(_name$2)), _val$3, _map$4);
        return $2472;
    };
    const Kind$set = x0 => x1 => x2 => Kind$set$(x0, x1, x2);

    function Kind$Parser$open$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2474 = self.idx;
                var $2475 = self.code;
                var $2476 = self.err;
                var $2477 = Parser$Reply$error$($2474, $2475, $2476);
                var $2473 = $2477;
                break;
            case 'Parser.Reply.value':
                var $2478 = self.idx;
                var $2479 = self.code;
                var $2480 = self.val;
                var self = Kind$Parser$text$("open ", $2478, $2479);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2482 = self.idx;
                        var $2483 = self.code;
                        var $2484 = self.err;
                        var $2485 = Parser$Reply$error$($2482, $2483, $2484);
                        var $2481 = $2485;
                        break;
                    case 'Parser.Reply.value':
                        var $2486 = self.idx;
                        var $2487 = self.code;
                        var self = Kind$Parser$spaces($2486)($2487);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2489 = self.idx;
                                var $2490 = self.code;
                                var $2491 = self.err;
                                var $2492 = Parser$Reply$error$($2489, $2490, $2491);
                                var $2488 = $2492;
                                break;
                            case 'Parser.Reply.value':
                                var $2493 = self.idx;
                                var $2494 = self.code;
                                var self = Kind$Parser$term$($2493, $2494);
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
                                        var $2502 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2505 = self.idx;
                                                    var $2506 = self.code;
                                                    var $2507 = self.err;
                                                    var $2508 = Parser$Reply$error$($2505, $2506, $2507);
                                                    var $2504 = $2508;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2509 = self.idx;
                                                    var $2510 = self.code;
                                                    var $2511 = Kind$Parser$name1$($2509, $2510);
                                                    var $2504 = $2511;
                                                    break;
                                            };
                                            return $2504;
                                        }), $2500, $2501);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2512 = self.idx;
                                                var $2513 = self.code;
                                                var $2514 = self.err;
                                                var $2515 = Parser$Reply$error$($2512, $2513, $2514);
                                                var $2503 = $2515;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2516 = self.idx;
                                                var $2517 = self.code;
                                                var $2518 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2516, $2517);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2520 = self.idx;
                                                        var $2521 = self.code;
                                                        var $2522 = self.err;
                                                        var $2523 = Parser$Reply$error$($2520, $2521, $2522);
                                                        var $2519 = $2523;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2524 = self.idx;
                                                        var $2525 = self.code;
                                                        var self = $2518;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2527 = self.value;
                                                                var $2528 = $2527;
                                                                var _name$21 = $2528;
                                                                break;
                                                            case 'Maybe.none':
                                                                var self = Kind$Term$reduce$($2502, BitsMap$new);
                                                                switch (self._) {
                                                                    case 'Kind.Term.var':
                                                                        var $2530 = self.name;
                                                                        var $2531 = $2530;
                                                                        var $2529 = $2531;
                                                                        break;
                                                                    case 'Kind.Term.ref':
                                                                        var $2532 = self.name;
                                                                        var $2533 = $2532;
                                                                        var $2529 = $2533;
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
                                                                        var $2534 = Kind$Name$read$("self");
                                                                        var $2529 = $2534;
                                                                        break;
                                                                };
                                                                var _name$21 = $2529;
                                                                break;
                                                        };
                                                        var _wyth$22 = List$nil;
                                                        var self = Kind$Parser$term$($2524, $2525);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2535 = self.idx;
                                                                var $2536 = self.code;
                                                                var $2537 = self.err;
                                                                var $2538 = Parser$Reply$error$($2535, $2536, $2537);
                                                                var $2526 = $2538;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2539 = self.idx;
                                                                var $2540 = self.code;
                                                                var $2541 = self.val;
                                                                var _cses$26 = Kind$set$("_", $2541, BitsMap$new);
                                                                var _moti$27 = Maybe$some$(Kind$Term$hol$(Bits$e));
                                                                var self = Kind$Parser$stop$($2480, $2539, $2540);
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
                                                                        var $2550 = Parser$Reply$value$($2547, $2548, Kind$Term$ori$($2549, Kind$Term$cse$(Bits$e, $2502, _name$21, _wyth$22, _cses$26, _moti$27)));
                                                                        var $2542 = $2550;
                                                                        break;
                                                                };
                                                                var $2526 = $2542;
                                                                break;
                                                        };
                                                        var $2519 = $2526;
                                                        break;
                                                };
                                                var $2503 = $2519;
                                                break;
                                        };
                                        var $2495 = $2503;
                                        break;
                                };
                                var $2488 = $2495;
                                break;
                        };
                        var $2481 = $2488;
                        break;
                };
                var $2473 = $2481;
                break;
        };
        return $2473;
    };
    const Kind$Parser$open = x0 => x1 => Kind$Parser$open$(x0, x1);

    function Kind$Parser$without$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2552 = self.idx;
                var $2553 = self.code;
                var $2554 = self.err;
                var $2555 = Parser$Reply$error$($2552, $2553, $2554);
                var $2551 = $2555;
                break;
            case 'Parser.Reply.value':
                var $2556 = self.idx;
                var $2557 = self.code;
                var $2558 = self.val;
                var self = Kind$Parser$text$("without ", $2556, $2557);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2560 = self.idx;
                        var $2561 = self.code;
                        var $2562 = self.err;
                        var $2563 = Parser$Reply$error$($2560, $2561, $2562);
                        var $2559 = $2563;
                        break;
                    case 'Parser.Reply.value':
                        var $2564 = self.idx;
                        var $2565 = self.code;
                        var self = Kind$Parser$name1$($2564, $2565);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2567 = self.idx;
                                var $2568 = self.code;
                                var $2569 = self.err;
                                var $2570 = Parser$Reply$error$($2567, $2568, $2569);
                                var $2566 = $2570;
                                break;
                            case 'Parser.Reply.value':
                                var $2571 = self.idx;
                                var $2572 = self.code;
                                var $2573 = self.val;
                                var self = Kind$Parser$text$(":", $2571, $2572);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2575 = self.idx;
                                        var $2576 = self.code;
                                        var $2577 = self.err;
                                        var $2578 = Parser$Reply$error$($2575, $2576, $2577);
                                        var $2574 = $2578;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2579 = self.idx;
                                        var $2580 = self.code;
                                        var self = Kind$Parser$term$($2579, $2580);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2582 = self.idx;
                                                var $2583 = self.code;
                                                var $2584 = self.err;
                                                var $2585 = Parser$Reply$error$($2582, $2583, $2584);
                                                var $2581 = $2585;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2586 = self.idx;
                                                var $2587 = self.code;
                                                var $2588 = self.val;
                                                var self = Kind$Parser$term$($2586, $2587);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2590 = self.idx;
                                                        var $2591 = self.code;
                                                        var $2592 = self.err;
                                                        var $2593 = Parser$Reply$error$($2590, $2591, $2592);
                                                        var $2589 = $2593;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2594 = self.idx;
                                                        var $2595 = self.code;
                                                        var $2596 = self.val;
                                                        var self = Kind$Parser$stop$($2558, $2594, $2595);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2598 = self.idx;
                                                                var $2599 = self.code;
                                                                var $2600 = self.err;
                                                                var $2601 = Parser$Reply$error$($2598, $2599, $2600);
                                                                var $2597 = $2601;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2602 = self.idx;
                                                                var $2603 = self.code;
                                                                var $2604 = self.val;
                                                                var _term$24 = Kind$Term$ref$($2573);
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$lam$("x", (_x$25 => {
                                                                    var $2606 = Kind$Term$hol$(Bits$e);
                                                                    return $2606;
                                                                })));
                                                                var _term$26 = Kind$Term$app$(_term$25, $2588);
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$lam$($2573, (_x$27 => {
                                                                    var $2607 = $2596;
                                                                    return $2607;
                                                                })));
                                                                var $2605 = Parser$Reply$value$($2602, $2603, Kind$Term$ori$($2604, _term$27));
                                                                var $2597 = $2605;
                                                                break;
                                                        };
                                                        var $2589 = $2597;
                                                        break;
                                                };
                                                var $2581 = $2589;
                                                break;
                                        };
                                        var $2574 = $2581;
                                        break;
                                };
                                var $2566 = $2574;
                                break;
                        };
                        var $2559 = $2566;
                        break;
                };
                var $2551 = $2559;
                break;
        };
        return $2551;
    };
    const Kind$Parser$without = x0 => x1 => Kind$Parser$without$(x0, x1);

    function Kind$Parser$switch$case$(_idx$1, _code$2) {
        var self = Kind$Parser$term$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$(":", $2613, $2614);
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
                                var $2631 = Parser$Reply$value$($2628, $2629, Pair$new$($2615, $2630));
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
    const Kind$Parser$switch$case = x0 => x1 => Kind$Parser$switch$case$(x0, x1);

    function Kind$Parser$switch$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2633 = self.idx;
                var $2634 = self.code;
                var $2635 = self.err;
                var $2636 = Parser$Reply$error$($2633, $2634, $2635);
                var $2632 = $2636;
                break;
            case 'Parser.Reply.value':
                var $2637 = self.idx;
                var $2638 = self.code;
                var $2639 = self.val;
                var self = Kind$Parser$text$("switch ", $2637, $2638);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2641 = self.idx;
                        var $2642 = self.code;
                        var $2643 = self.err;
                        var $2644 = Parser$Reply$error$($2641, $2642, $2643);
                        var $2640 = $2644;
                        break;
                    case 'Parser.Reply.value':
                        var $2645 = self.idx;
                        var $2646 = self.code;
                        var self = Kind$Parser$term$($2645, $2646);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2648 = self.idx;
                                var $2649 = self.code;
                                var $2650 = self.err;
                                var $2651 = Parser$Reply$error$($2648, $2649, $2650);
                                var $2647 = $2651;
                                break;
                            case 'Parser.Reply.value':
                                var $2652 = self.idx;
                                var $2653 = self.code;
                                var $2654 = self.val;
                                var self = Kind$Parser$text$("{", $2652, $2653);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2656 = self.idx;
                                        var $2657 = self.code;
                                        var $2658 = self.err;
                                        var $2659 = Parser$Reply$error$($2656, $2657, $2658);
                                        var $2655 = $2659;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2660 = self.idx;
                                        var $2661 = self.code;
                                        var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$switch$case)($2660)($2661);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2663 = self.idx;
                                                var $2664 = self.code;
                                                var $2665 = self.err;
                                                var $2666 = Parser$Reply$error$($2663, $2664, $2665);
                                                var $2662 = $2666;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2667 = self.idx;
                                                var $2668 = self.code;
                                                var $2669 = self.val;
                                                var self = Kind$Parser$text$("else", $2667, $2668);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2671 = self.idx;
                                                        var $2672 = self.code;
                                                        var $2673 = self.err;
                                                        var $2674 = Parser$Reply$error$($2671, $2672, $2673);
                                                        var $2670 = $2674;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2675 = self.idx;
                                                        var $2676 = self.code;
                                                        var self = Kind$Parser$term$($2675, $2676);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2678 = self.idx;
                                                                var $2679 = self.code;
                                                                var $2680 = self.err;
                                                                var $2681 = Parser$Reply$error$($2678, $2679, $2680);
                                                                var $2677 = $2681;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2682 = self.idx;
                                                                var $2683 = self.code;
                                                                var $2684 = self.val;
                                                                var self = Kind$Parser$stop$($2639, $2682, $2683);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2686 = self.idx;
                                                                        var $2687 = self.code;
                                                                        var $2688 = self.err;
                                                                        var $2689 = Parser$Reply$error$($2686, $2687, $2688);
                                                                        var $2685 = $2689;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2690 = self.idx;
                                                                        var $2691 = self.code;
                                                                        var $2692 = self.val;
                                                                        var _term$27 = List$fold$($2669, $2684, (_cse$27 => _rest$28 => {
                                                                            var self = _cse$27;
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $2695 = self.fst;
                                                                                    var $2696 = self.snd;
                                                                                    var _term$31 = Kind$Term$app$($2654, $2695);
                                                                                    var _term$32 = Kind$Term$app$(_term$31, Kind$Term$lam$("", (_x$32 => {
                                                                                        var $2698 = Kind$Term$hol$(Bits$e);
                                                                                        return $2698;
                                                                                    })));
                                                                                    var _term$33 = Kind$Term$app$(_term$32, $2696);
                                                                                    var _term$34 = Kind$Term$app$(_term$33, _rest$28);
                                                                                    var $2697 = _term$34;
                                                                                    var $2694 = $2697;
                                                                                    break;
                                                                            };
                                                                            return $2694;
                                                                        }));
                                                                        var $2693 = Parser$Reply$value$($2690, $2691, Kind$Term$ori$($2692, _term$27));
                                                                        var $2685 = $2693;
                                                                        break;
                                                                };
                                                                var $2677 = $2685;
                                                                break;
                                                        };
                                                        var $2670 = $2677;
                                                        break;
                                                };
                                                var $2662 = $2670;
                                                break;
                                        };
                                        var $2655 = $2662;
                                        break;
                                };
                                var $2647 = $2655;
                                break;
                        };
                        var $2640 = $2647;
                        break;
                };
                var $2632 = $2640;
                break;
        };
        return $2632;
    };
    const Kind$Parser$switch = x0 => x1 => Kind$Parser$switch$(x0, x1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $2700 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $2699 = $2700;
        } else {
            var $2701 = self.charCodeAt(0);
            var $2702 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($2701 === 48);
            if (self) {
                var $2704 = Parser$Reply$value$(_sidx$5, $2702, 0n);
                var $2703 = $2704;
            } else {
                var self = ($2701 === 49);
                if (self) {
                    var $2706 = Parser$Reply$value$(_sidx$5, $2702, 1n);
                    var $2705 = $2706;
                } else {
                    var self = ($2701 === 50);
                    if (self) {
                        var $2708 = Parser$Reply$value$(_sidx$5, $2702, 2n);
                        var $2707 = $2708;
                    } else {
                        var self = ($2701 === 51);
                        if (self) {
                            var $2710 = Parser$Reply$value$(_sidx$5, $2702, 3n);
                            var $2709 = $2710;
                        } else {
                            var self = ($2701 === 52);
                            if (self) {
                                var $2712 = Parser$Reply$value$(_sidx$5, $2702, 4n);
                                var $2711 = $2712;
                            } else {
                                var self = ($2701 === 53);
                                if (self) {
                                    var $2714 = Parser$Reply$value$(_sidx$5, $2702, 5n);
                                    var $2713 = $2714;
                                } else {
                                    var self = ($2701 === 54);
                                    if (self) {
                                        var $2716 = Parser$Reply$value$(_sidx$5, $2702, 6n);
                                        var $2715 = $2716;
                                    } else {
                                        var self = ($2701 === 55);
                                        if (self) {
                                            var $2718 = Parser$Reply$value$(_sidx$5, $2702, 7n);
                                            var $2717 = $2718;
                                        } else {
                                            var self = ($2701 === 56);
                                            if (self) {
                                                var $2720 = Parser$Reply$value$(_sidx$5, $2702, 8n);
                                                var $2719 = $2720;
                                            } else {
                                                var self = ($2701 === 57);
                                                if (self) {
                                                    var $2722 = Parser$Reply$value$(_sidx$5, $2702, 9n);
                                                    var $2721 = $2722;
                                                } else {
                                                    var $2723 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $2721 = $2723;
                                                };
                                                var $2719 = $2721;
                                            };
                                            var $2717 = $2719;
                                        };
                                        var $2715 = $2717;
                                    };
                                    var $2713 = $2715;
                                };
                                var $2711 = $2713;
                            };
                            var $2709 = $2711;
                        };
                        var $2707 = $2709;
                    };
                    var $2705 = $2707;
                };
                var $2703 = $2705;
            };
            var $2699 = $2703;
        };
        return $2699;
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
                        var $2724 = self.head;
                        var $2725 = self.tail;
                        var $2726 = Nat$from_base$go$(_b$1, $2725, (_b$1 * _p$3), (($2724 * _p$3) + _res$4));
                        return $2726;
                    case 'List.nil':
                        var $2727 = _res$4;
                        return $2727;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $2728 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $2728;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2730 = self.idx;
                var $2731 = self.code;
                var $2732 = self.err;
                var $2733 = Parser$Reply$error$($2730, $2731, $2732);
                var $2729 = $2733;
                break;
            case 'Parser.Reply.value':
                var $2734 = self.idx;
                var $2735 = self.code;
                var $2736 = self.val;
                var $2737 = Parser$Reply$value$($2734, $2735, Nat$from_base$(10n, $2736));
                var $2729 = $2737;
                break;
        };
        return $2729;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2739 = self.slice(0, -1);
                var $2740 = $2739;
                var $2738 = $2740;
                break;
            case 'i':
                var $2741 = self.slice(0, -1);
                var $2742 = $2741;
                var $2738 = $2742;
                break;
            case 'e':
                var $2743 = Bits$e;
                var $2738 = $2743;
                break;
        };
        return $2738;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2745 = self.slice(0, -1);
                var $2746 = ($2745 + '1');
                var $2744 = $2746;
                break;
            case 'i':
                var $2747 = self.slice(0, -1);
                var $2748 = (Bits$inc$($2747) + '0');
                var $2744 = $2748;
                break;
            case 'e':
                var $2749 = (Bits$e + '1');
                var $2744 = $2749;
                break;
        };
        return $2744;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2751 = Bool$false;
                var $2750 = $2751;
                break;
            case 'Maybe.some':
                var $2752 = Bool$true;
                var $2750 = $2752;
                break;
        };
        return $2750;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Kind$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $2753 = ({
            _: 'Kind.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $2753;
    };
    const Kind$Term$gol = x0 => x1 => x2 => Kind$Term$gol$(x0, x1, x2);

    function Kind$Parser$goal$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $2761 = self.val;
                var self = Kind$Parser$text$("?", $2759, $2760);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2763 = self.idx;
                        var $2764 = self.code;
                        var $2765 = self.err;
                        var $2766 = Parser$Reply$error$($2763, $2764, $2765);
                        var $2762 = $2766;
                        break;
                    case 'Parser.Reply.value':
                        var $2767 = self.idx;
                        var $2768 = self.code;
                        var self = Kind$Parser$name$($2767, $2768);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2770 = self.idx;
                                var $2771 = self.code;
                                var $2772 = self.err;
                                var $2773 = Parser$Reply$error$($2770, $2771, $2772);
                                var $2769 = $2773;
                                break;
                            case 'Parser.Reply.value':
                                var $2774 = self.idx;
                                var $2775 = self.code;
                                var $2776 = self.val;
                                var self = Parser$many$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("-", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2779 = self.idx;
                                            var $2780 = self.code;
                                            var $2781 = self.err;
                                            var $2782 = Parser$Reply$error$($2779, $2780, $2781);
                                            var $2778 = $2782;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2783 = self.idx;
                                            var $2784 = self.code;
                                            var self = Parser$nat$($2783, $2784);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2786 = self.idx;
                                                    var $2787 = self.code;
                                                    var $2788 = self.err;
                                                    var $2789 = Parser$Reply$error$($2786, $2787, $2788);
                                                    var $2785 = $2789;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2790 = self.idx;
                                                    var $2791 = self.code;
                                                    var $2792 = self.val;
                                                    var _bits$20 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits($2792)))));
                                                    var $2793 = Parser$Reply$value$($2790, $2791, _bits$20);
                                                    var $2785 = $2793;
                                                    break;
                                            };
                                            var $2778 = $2785;
                                            break;
                                    };
                                    return $2778;
                                }))($2774)($2775);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2794 = self.idx;
                                        var $2795 = self.code;
                                        var $2796 = self.err;
                                        var $2797 = Parser$Reply$error$($2794, $2795, $2796);
                                        var $2777 = $2797;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2798 = self.idx;
                                        var $2799 = self.code;
                                        var $2800 = self.val;
                                        var self = Parser$maybe$(Parser$text("-"), $2798, $2799);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2802 = self.idx;
                                                var $2803 = self.code;
                                                var $2804 = self.err;
                                                var $2805 = Parser$Reply$error$($2802, $2803, $2804);
                                                var self = $2805;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2806 = self.idx;
                                                var $2807 = self.code;
                                                var $2808 = self.val;
                                                var $2809 = Parser$Reply$value$($2806, $2807, Maybe$to_bool$($2808));
                                                var self = $2809;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2810 = self.idx;
                                                var $2811 = self.code;
                                                var $2812 = self.err;
                                                var $2813 = Parser$Reply$error$($2810, $2811, $2812);
                                                var $2801 = $2813;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2814 = self.idx;
                                                var $2815 = self.code;
                                                var $2816 = self.val;
                                                var self = Kind$Parser$stop$($2761, $2814, $2815);
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
                                                        var $2825 = Parser$Reply$value$($2822, $2823, Kind$Term$ori$($2824, Kind$Term$gol$($2776, $2800, $2816)));
                                                        var $2817 = $2825;
                                                        break;
                                                };
                                                var $2801 = $2817;
                                                break;
                                        };
                                        var $2777 = $2801;
                                        break;
                                };
                                var $2769 = $2777;
                                break;
                        };
                        var $2762 = $2769;
                        break;
                };
                var $2754 = $2762;
                break;
        };
        return $2754;
    };
    const Kind$Parser$goal = x0 => x1 => Kind$Parser$goal$(x0, x1);

    function Kind$Parser$hole$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("_", $2831, $2832);
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
                        var self = Kind$Parser$stop$($2833, $2839, $2840);
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
                                var $2849 = Parser$Reply$value$($2846, $2847, Kind$Term$ori$($2848, Kind$Term$hol$(Bits$e)));
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
    const Kind$Parser$hole = x0 => x1 => Kind$Parser$hole$(x0, x1);

    function Kind$Parser$u8$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2851 = self.idx;
                var $2852 = self.code;
                var $2853 = self.err;
                var $2854 = Parser$Reply$error$($2851, $2852, $2853);
                var $2850 = $2854;
                break;
            case 'Parser.Reply.value':
                var $2855 = self.idx;
                var $2856 = self.code;
                var $2857 = self.val;
                var self = Kind$Parser$spaces($2855)($2856);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2859 = self.idx;
                        var $2860 = self.code;
                        var $2861 = self.err;
                        var $2862 = Parser$Reply$error$($2859, $2860, $2861);
                        var $2858 = $2862;
                        break;
                    case 'Parser.Reply.value':
                        var $2863 = self.idx;
                        var $2864 = self.code;
                        var self = Parser$nat$($2863, $2864);
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
                                var self = Parser$text$("b", $2870, $2871);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u8");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2872));
                                        var self = Kind$Parser$stop$($2857, $2878, $2879);
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
                                                var $2888 = Parser$Reply$value$($2885, $2886, Kind$Term$ori$($2887, _term$16));
                                                var $2880 = $2888;
                                                break;
                                        };
                                        var $2873 = $2880;
                                        break;
                                };
                                var $2865 = $2873;
                                break;
                        };
                        var $2858 = $2865;
                        break;
                };
                var $2850 = $2858;
                break;
        };
        return $2850;
    };
    const Kind$Parser$u8 = x0 => x1 => Kind$Parser$u8$(x0, x1);

    function Kind$Parser$u16$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2890 = self.idx;
                var $2891 = self.code;
                var $2892 = self.err;
                var $2893 = Parser$Reply$error$($2890, $2891, $2892);
                var $2889 = $2893;
                break;
            case 'Parser.Reply.value':
                var $2894 = self.idx;
                var $2895 = self.code;
                var $2896 = self.val;
                var self = Kind$Parser$spaces($2894)($2895);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2898 = self.idx;
                        var $2899 = self.code;
                        var $2900 = self.err;
                        var $2901 = Parser$Reply$error$($2898, $2899, $2900);
                        var $2897 = $2901;
                        break;
                    case 'Parser.Reply.value':
                        var $2902 = self.idx;
                        var $2903 = self.code;
                        var self = Parser$nat$($2902, $2903);
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
                                var self = Parser$text$("s", $2909, $2910);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u16");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2911));
                                        var self = Kind$Parser$stop$($2896, $2917, $2918);
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
                                                var $2927 = Parser$Reply$value$($2924, $2925, Kind$Term$ori$($2926, _term$16));
                                                var $2919 = $2927;
                                                break;
                                        };
                                        var $2912 = $2919;
                                        break;
                                };
                                var $2904 = $2912;
                                break;
                        };
                        var $2897 = $2904;
                        break;
                };
                var $2889 = $2897;
                break;
        };
        return $2889;
    };
    const Kind$Parser$u16 = x0 => x1 => Kind$Parser$u16$(x0, x1);

    function Kind$Parser$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2929 = self.idx;
                var $2930 = self.code;
                var $2931 = self.err;
                var $2932 = Parser$Reply$error$($2929, $2930, $2931);
                var $2928 = $2932;
                break;
            case 'Parser.Reply.value':
                var $2933 = self.idx;
                var $2934 = self.code;
                var $2935 = self.val;
                var self = Kind$Parser$spaces($2933)($2934);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2937 = self.idx;
                        var $2938 = self.code;
                        var $2939 = self.err;
                        var $2940 = Parser$Reply$error$($2937, $2938, $2939);
                        var $2936 = $2940;
                        break;
                    case 'Parser.Reply.value':
                        var $2941 = self.idx;
                        var $2942 = self.code;
                        var self = Parser$nat$($2941, $2942);
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
                                var self = Parser$text$("u", $2948, $2949);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u32");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2950));
                                        var self = Kind$Parser$stop$($2935, $2956, $2957);
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
                                                var $2966 = Parser$Reply$value$($2963, $2964, Kind$Term$ori$($2965, _term$16));
                                                var $2958 = $2966;
                                                break;
                                        };
                                        var $2951 = $2958;
                                        break;
                                };
                                var $2943 = $2951;
                                break;
                        };
                        var $2936 = $2943;
                        break;
                };
                var $2928 = $2936;
                break;
        };
        return $2928;
    };
    const Kind$Parser$u32 = x0 => x1 => Kind$Parser$u32$(x0, x1);

    function Kind$Parser$u64$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2968 = self.idx;
                var $2969 = self.code;
                var $2970 = self.err;
                var $2971 = Parser$Reply$error$($2968, $2969, $2970);
                var $2967 = $2971;
                break;
            case 'Parser.Reply.value':
                var $2972 = self.idx;
                var $2973 = self.code;
                var $2974 = self.val;
                var self = Kind$Parser$spaces($2972)($2973);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2976 = self.idx;
                        var $2977 = self.code;
                        var $2978 = self.err;
                        var $2979 = Parser$Reply$error$($2976, $2977, $2978);
                        var $2975 = $2979;
                        break;
                    case 'Parser.Reply.value':
                        var $2980 = self.idx;
                        var $2981 = self.code;
                        var self = Parser$nat$($2980, $2981);
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
                                var self = Parser$text$("l", $2987, $2988);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u64");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2989));
                                        var self = Kind$Parser$stop$($2974, $2995, $2996);
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
                                                var $3005 = Parser$Reply$value$($3002, $3003, Kind$Term$ori$($3004, _term$16));
                                                var $2997 = $3005;
                                                break;
                                        };
                                        var $2990 = $2997;
                                        break;
                                };
                                var $2982 = $2990;
                                break;
                        };
                        var $2975 = $2982;
                        break;
                };
                var $2967 = $2975;
                break;
        };
        return $2967;
    };
    const Kind$Parser$u64 = x0 => x1 => Kind$Parser$u64$(x0, x1);

    function Kind$Parser$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3007 = self.idx;
                var $3008 = self.code;
                var $3009 = self.err;
                var $3010 = Parser$Reply$error$($3007, $3008, $3009);
                var $3006 = $3010;
                break;
            case 'Parser.Reply.value':
                var $3011 = self.idx;
                var $3012 = self.code;
                var $3013 = self.val;
                var self = Kind$Parser$spaces($3011)($3012);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3015 = self.idx;
                        var $3016 = self.code;
                        var $3017 = self.err;
                        var $3018 = Parser$Reply$error$($3015, $3016, $3017);
                        var $3014 = $3018;
                        break;
                    case 'Parser.Reply.value':
                        var $3019 = self.idx;
                        var $3020 = self.code;
                        var self = Parser$nat$($3019, $3020);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3022 = self.idx;
                                var $3023 = self.code;
                                var $3024 = self.err;
                                var $3025 = Parser$Reply$error$($3022, $3023, $3024);
                                var $3021 = $3025;
                                break;
                            case 'Parser.Reply.value':
                                var $3026 = self.idx;
                                var $3027 = self.code;
                                var $3028 = self.val;
                                var self = Kind$Parser$stop$($3013, $3026, $3027);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3030 = self.idx;
                                        var $3031 = self.code;
                                        var $3032 = self.err;
                                        var $3033 = Parser$Reply$error$($3030, $3031, $3032);
                                        var $3029 = $3033;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3034 = self.idx;
                                        var $3035 = self.code;
                                        var $3036 = self.val;
                                        var $3037 = Parser$Reply$value$($3034, $3035, Kind$Term$ori$($3036, Kind$Term$nat$($3028)));
                                        var $3029 = $3037;
                                        break;
                                };
                                var $3021 = $3029;
                                break;
                        };
                        var $3014 = $3021;
                        break;
                };
                var $3006 = $3014;
                break;
        };
        return $3006;
    };
    const Kind$Parser$nat = x0 => x1 => Kind$Parser$nat$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $3038 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $3038;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);

    function Kind$Parser$reference$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3040 = self.idx;
                var $3041 = self.code;
                var $3042 = self.err;
                var $3043 = Parser$Reply$error$($3040, $3041, $3042);
                var $3039 = $3043;
                break;
            case 'Parser.Reply.value':
                var $3044 = self.idx;
                var $3045 = self.code;
                var $3046 = self.val;
                var self = Kind$Parser$name1$($3044, $3045);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3048 = self.idx;
                        var $3049 = self.code;
                        var $3050 = self.err;
                        var $3051 = Parser$Reply$error$($3048, $3049, $3050);
                        var $3047 = $3051;
                        break;
                    case 'Parser.Reply.value':
                        var $3052 = self.idx;
                        var $3053 = self.code;
                        var $3054 = self.val;
                        var self = ($3054 === "case");
                        if (self) {
                            var $3056 = Parser$fail("Reserved keyword.");
                            var $3055 = $3056;
                        } else {
                            var self = ($3054 === "do");
                            if (self) {
                                var $3058 = Parser$fail("Reserved keyword.");
                                var $3057 = $3058;
                            } else {
                                var self = ($3054 === "if");
                                if (self) {
                                    var $3060 = Parser$fail("Reserved keyword.");
                                    var $3059 = $3060;
                                } else {
                                    var self = ($3054 === "with");
                                    if (self) {
                                        var $3062 = Parser$fail("Reserved keyword.");
                                        var $3061 = $3062;
                                    } else {
                                        var self = ($3054 === "let");
                                        if (self) {
                                            var $3064 = Parser$fail("Reserved keyword.");
                                            var $3063 = $3064;
                                        } else {
                                            var self = ($3054 === "def");
                                            if (self) {
                                                var $3066 = Parser$fail("Reserved keyword.");
                                                var $3065 = $3066;
                                            } else {
                                                var self = ($3054 === "true");
                                                if (self) {
                                                    var $3068 = (_idx$9 => _code$10 => {
                                                        var $3069 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.true"));
                                                        return $3069;
                                                    });
                                                    var $3067 = $3068;
                                                } else {
                                                    var self = ($3054 === "false");
                                                    if (self) {
                                                        var $3071 = (_idx$9 => _code$10 => {
                                                            var $3072 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.false"));
                                                            return $3072;
                                                        });
                                                        var $3070 = $3071;
                                                    } else {
                                                        var self = ($3054 === "unit");
                                                        if (self) {
                                                            var $3074 = (_idx$9 => _code$10 => {
                                                                var $3075 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Unit.new"));
                                                                return $3075;
                                                            });
                                                            var $3073 = $3074;
                                                        } else {
                                                            var self = ($3054 === "none");
                                                            if (self) {
                                                                var _term$9 = Kind$Term$ref$("Maybe.none");
                                                                var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                var $3077 = (_idx$11 => _code$12 => {
                                                                    var $3078 = Parser$Reply$value$(_idx$11, _code$12, _term$10);
                                                                    return $3078;
                                                                });
                                                                var $3076 = $3077;
                                                            } else {
                                                                var self = ($3054 === "refl");
                                                                if (self) {
                                                                    var _term$9 = Kind$Term$ref$("Equal.refl");
                                                                    var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                    var _term$11 = Kind$Term$app$(_term$10, Kind$Term$hol$(Bits$e));
                                                                    var $3080 = (_idx$12 => _code$13 => {
                                                                        var $3081 = Parser$Reply$value$(_idx$12, _code$13, _term$11);
                                                                        return $3081;
                                                                    });
                                                                    var $3079 = $3080;
                                                                } else {
                                                                    var $3082 = (_idx$9 => _code$10 => {
                                                                        var self = Kind$Parser$stop$($3046, _idx$9, _code$10);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $3084 = self.idx;
                                                                                var $3085 = self.code;
                                                                                var $3086 = self.err;
                                                                                var $3087 = Parser$Reply$error$($3084, $3085, $3086);
                                                                                var $3083 = $3087;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $3088 = self.idx;
                                                                                var $3089 = self.code;
                                                                                var $3090 = self.val;
                                                                                var $3091 = Parser$Reply$value$($3088, $3089, Kind$Term$ori$($3090, Kind$Term$ref$($3054)));
                                                                                var $3083 = $3091;
                                                                                break;
                                                                        };
                                                                        return $3083;
                                                                    });
                                                                    var $3079 = $3082;
                                                                };
                                                                var $3076 = $3079;
                                                            };
                                                            var $3073 = $3076;
                                                        };
                                                        var $3070 = $3073;
                                                    };
                                                    var $3067 = $3070;
                                                };
                                                var $3065 = $3067;
                                            };
                                            var $3063 = $3065;
                                        };
                                        var $3061 = $3063;
                                    };
                                    var $3059 = $3061;
                                };
                                var $3057 = $3059;
                            };
                            var $3055 = $3057;
                        };
                        var $3055 = $3055($3052)($3053);
                        var $3047 = $3055;
                        break;
                };
                var $3039 = $3047;
                break;
        };
        return $3039;
    };
    const Kind$Parser$reference = x0 => x1 => Kind$Parser$reference$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kind$Parser$application$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$text$("(", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3093 = self.idx;
                var $3094 = self.code;
                var $3095 = self.err;
                var $3096 = Parser$Reply$error$($3093, $3094, $3095);
                var $3092 = $3096;
                break;
            case 'Parser.Reply.value':
                var $3097 = self.idx;
                var $3098 = self.code;
                var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term), $3097, $3098);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3100 = self.idx;
                        var $3101 = self.code;
                        var $3102 = self.err;
                        var $3103 = Parser$Reply$error$($3100, $3101, $3102);
                        var $3099 = $3103;
                        break;
                    case 'Parser.Reply.value':
                        var $3104 = self.idx;
                        var $3105 = self.code;
                        var $3106 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3104, $3105);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3108 = self.idx;
                                var $3109 = self.code;
                                var $3110 = self.err;
                                var $3111 = Parser$Reply$error$($3108, $3109, $3110);
                                var $3107 = $3111;
                                break;
                            case 'Parser.Reply.value':
                                var $3112 = self.idx;
                                var $3113 = self.code;
                                var $3114 = self.val;
                                var _expr$14 = (() => {
                                    var $3117 = _func$2;
                                    var $3118 = $3106;
                                    let _f$15 = $3117;
                                    let _x$14;
                                    while ($3118._ === 'List.cons') {
                                        _x$14 = $3118.head;
                                        var $3117 = Kind$Term$app$(_f$15, _x$14);
                                        _f$15 = $3117;
                                        $3118 = $3118.tail;
                                    }
                                    return _f$15;
                                })();
                                var $3115 = Parser$Reply$value$($3112, $3113, Kind$Term$ori$($3114, _expr$14));
                                var $3107 = $3115;
                                break;
                        };
                        var $3099 = $3107;
                        break;
                };
                var $3092 = $3099;
                break;
        };
        return $3092;
    };
    const Kind$Parser$application = x0 => x1 => x2 => x3 => Kind$Parser$application$(x0, x1, x2, x3);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1, _idx$2, _code$3) {
        var self = Parser$spaces(_idx$2)(_code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3120 = self.idx;
                var $3121 = self.code;
                var $3122 = self.err;
                var $3123 = Parser$Reply$error$($3120, $3121, $3122);
                var $3119 = $3123;
                break;
            case 'Parser.Reply.value':
                var $3124 = self.idx;
                var $3125 = self.code;
                var $3126 = Parser$text$(_text$1, $3124, $3125);
                var $3119 = $3126;
                break;
        };
        return $3119;
    };
    const Parser$spaces_text = x0 => x1 => x2 => Parser$spaces_text$(x0, x1, x2);

    function Kind$Parser$application$erased$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$get_index$(_idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3128 = self.idx;
                var $3129 = self.code;
                var $3130 = self.err;
                var $3131 = Parser$Reply$error$($3128, $3129, $3130);
                var $3127 = $3131;
                break;
            case 'Parser.Reply.value':
                var $3132 = self.idx;
                var $3133 = self.code;
                var $3134 = self.val;
                var self = Parser$text$("<", $3132, $3133);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3136 = self.idx;
                        var $3137 = self.code;
                        var $3138 = self.err;
                        var $3139 = Parser$Reply$error$($3136, $3137, $3138);
                        var $3135 = $3139;
                        break;
                    case 'Parser.Reply.value':
                        var $3140 = self.idx;
                        var $3141 = self.code;
                        var self = Parser$until1$(Parser$spaces_text(">"), Kind$Parser$item(Kind$Parser$term), $3140, $3141);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3143 = self.idx;
                                var $3144 = self.code;
                                var $3145 = self.err;
                                var $3146 = Parser$Reply$error$($3143, $3144, $3145);
                                var $3142 = $3146;
                                break;
                            case 'Parser.Reply.value':
                                var $3147 = self.idx;
                                var $3148 = self.code;
                                var $3149 = self.val;
                                var self = Kind$Parser$stop$($3134, $3147, $3148);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3151 = self.idx;
                                        var $3152 = self.code;
                                        var $3153 = self.err;
                                        var $3154 = Parser$Reply$error$($3151, $3152, $3153);
                                        var $3150 = $3154;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3155 = self.idx;
                                        var $3156 = self.code;
                                        var $3157 = self.val;
                                        var _expr$17 = (() => {
                                            var $3160 = _func$2;
                                            var $3161 = $3149;
                                            let _f$18 = $3160;
                                            let _x$17;
                                            while ($3161._ === 'List.cons') {
                                                _x$17 = $3161.head;
                                                var $3160 = Kind$Term$app$(_f$18, _x$17);
                                                _f$18 = $3160;
                                                $3161 = $3161.tail;
                                            }
                                            return _f$18;
                                        })();
                                        var $3158 = Parser$Reply$value$($3155, $3156, Kind$Term$ori$($3157, _expr$17));
                                        var $3150 = $3158;
                                        break;
                                };
                                var $3142 = $3150;
                                break;
                        };
                        var $3135 = $3142;
                        break;
                };
                var $3127 = $3135;
                break;
        };
        return $3127;
    };
    const Kind$Parser$application$erased = x0 => x1 => x2 => x3 => Kind$Parser$application$erased$(x0, x1, x2, x3);

    function Kind$Parser$arrow$(_init$1, _xtyp$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("->", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3163 = self.idx;
                var $3164 = self.code;
                var $3165 = self.err;
                var $3166 = Parser$Reply$error$($3163, $3164, $3165);
                var $3162 = $3166;
                break;
            case 'Parser.Reply.value':
                var $3167 = self.idx;
                var $3168 = self.code;
                var self = Kind$Parser$term$($3167, $3168);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3170 = self.idx;
                        var $3171 = self.code;
                        var $3172 = self.err;
                        var $3173 = Parser$Reply$error$($3170, $3171, $3172);
                        var $3169 = $3173;
                        break;
                    case 'Parser.Reply.value':
                        var $3174 = self.idx;
                        var $3175 = self.code;
                        var $3176 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3174, $3175);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3178 = self.idx;
                                var $3179 = self.code;
                                var $3180 = self.err;
                                var $3181 = Parser$Reply$error$($3178, $3179, $3180);
                                var $3177 = $3181;
                                break;
                            case 'Parser.Reply.value':
                                var $3182 = self.idx;
                                var $3183 = self.code;
                                var $3184 = self.val;
                                var $3185 = Parser$Reply$value$($3182, $3183, Kind$Term$ori$($3184, Kind$Term$all$(Bool$false, "", "", _xtyp$2, (_s$14 => _x$15 => {
                                    var $3186 = $3176;
                                    return $3186;
                                }))));
                                var $3177 = $3185;
                                break;
                        };
                        var $3169 = $3177;
                        break;
                };
                var $3162 = $3169;
                break;
        };
        return $3162;
    };
    const Kind$Parser$arrow = x0 => x1 => x2 => x3 => Kind$Parser$arrow$(x0, x1, x2, x3);

    function Kind$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4, _idx$5, _code$6) {
        var self = Kind$Parser$text$(_sym$1, _idx$5, _code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3188 = self.idx;
                var $3189 = self.code;
                var $3190 = self.err;
                var $3191 = Parser$Reply$error$($3188, $3189, $3190);
                var $3187 = $3191;
                break;
            case 'Parser.Reply.value':
                var $3192 = self.idx;
                var $3193 = self.code;
                var self = Kind$Parser$term$($3192, $3193);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3195 = self.idx;
                        var $3196 = self.code;
                        var $3197 = self.err;
                        var $3198 = Parser$Reply$error$($3195, $3196, $3197);
                        var $3194 = $3198;
                        break;
                    case 'Parser.Reply.value':
                        var $3199 = self.idx;
                        var $3200 = self.code;
                        var $3201 = self.val;
                        var self = Kind$Parser$stop$(_init$3, $3199, $3200);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3203 = self.idx;
                                var $3204 = self.code;
                                var $3205 = self.err;
                                var $3206 = Parser$Reply$error$($3203, $3204, $3205);
                                var $3202 = $3206;
                                break;
                            case 'Parser.Reply.value':
                                var $3207 = self.idx;
                                var $3208 = self.code;
                                var $3209 = self.val;
                                var _term$16 = Kind$Term$ref$(_ref$2);
                                var _term$17 = Kind$Term$app$(_term$16, _val0$4);
                                var _term$18 = Kind$Term$app$(_term$17, $3201);
                                var $3210 = Parser$Reply$value$($3207, $3208, Kind$Term$ori$($3209, _term$18));
                                var $3202 = $3210;
                                break;
                        };
                        var $3194 = $3202;
                        break;
                };
                var $3187 = $3194;
                break;
        };
        return $3187;
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
                var $3212 = self.idx;
                var $3213 = self.code;
                var $3214 = self.err;
                var $3215 = Parser$Reply$error$($3212, $3213, $3214);
                var $3211 = $3215;
                break;
            case 'Parser.Reply.value':
                var $3216 = self.idx;
                var $3217 = self.code;
                var self = Kind$Parser$term$($3216, $3217);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3219 = self.idx;
                        var $3220 = self.code;
                        var $3221 = self.err;
                        var $3222 = Parser$Reply$error$($3219, $3220, $3221);
                        var $3218 = $3222;
                        break;
                    case 'Parser.Reply.value':
                        var $3223 = self.idx;
                        var $3224 = self.code;
                        var $3225 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3223, $3224);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3227 = self.idx;
                                var $3228 = self.code;
                                var $3229 = self.err;
                                var $3230 = Parser$Reply$error$($3227, $3228, $3229);
                                var $3226 = $3230;
                                break;
                            case 'Parser.Reply.value':
                                var $3231 = self.idx;
                                var $3232 = self.code;
                                var _term$14 = Kind$Term$ref$("List.cons");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _head$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3225);
                                var self = Kind$Parser$stop$(_init$1, $3231, $3232);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3234 = self.idx;
                                        var $3235 = self.code;
                                        var $3236 = self.err;
                                        var $3237 = Parser$Reply$error$($3234, $3235, $3236);
                                        var $3233 = $3237;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3238 = self.idx;
                                        var $3239 = self.code;
                                        var $3240 = self.val;
                                        var $3241 = Parser$Reply$value$($3238, $3239, Kind$Term$ori$($3240, _term$17));
                                        var $3233 = $3241;
                                        break;
                                };
                                var $3226 = $3233;
                                break;
                        };
                        var $3218 = $3226;
                        break;
                };
                var $3211 = $3218;
                break;
        };
        return $3211;
    };
    const Kind$Parser$cons = x0 => x1 => x2 => x3 => Kind$Parser$cons$(x0, x1, x2, x3);

    function Kind$Parser$concat$(_init$1, _lst0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("++", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3243 = self.idx;
                var $3244 = self.code;
                var $3245 = self.err;
                var $3246 = Parser$Reply$error$($3243, $3244, $3245);
                var $3242 = $3246;
                break;
            case 'Parser.Reply.value':
                var $3247 = self.idx;
                var $3248 = self.code;
                var self = Kind$Parser$term$($3247, $3248);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3250 = self.idx;
                        var $3251 = self.code;
                        var $3252 = self.err;
                        var $3253 = Parser$Reply$error$($3250, $3251, $3252);
                        var $3249 = $3253;
                        break;
                    case 'Parser.Reply.value':
                        var $3254 = self.idx;
                        var $3255 = self.code;
                        var $3256 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3254, $3255);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3258 = self.idx;
                                var $3259 = self.code;
                                var $3260 = self.err;
                                var $3261 = Parser$Reply$error$($3258, $3259, $3260);
                                var $3257 = $3261;
                                break;
                            case 'Parser.Reply.value':
                                var $3262 = self.idx;
                                var $3263 = self.code;
                                var _term$14 = Kind$Term$ref$("List.concat");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _lst0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3256);
                                var self = Kind$Parser$stop$(_init$1, $3262, $3263);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3265 = self.idx;
                                        var $3266 = self.code;
                                        var $3267 = self.err;
                                        var $3268 = Parser$Reply$error$($3265, $3266, $3267);
                                        var $3264 = $3268;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3269 = self.idx;
                                        var $3270 = self.code;
                                        var $3271 = self.val;
                                        var $3272 = Parser$Reply$value$($3269, $3270, Kind$Term$ori$($3271, _term$17));
                                        var $3264 = $3272;
                                        break;
                                };
                                var $3257 = $3264;
                                break;
                        };
                        var $3249 = $3257;
                        break;
                };
                var $3242 = $3249;
                break;
        };
        return $3242;
    };
    const Kind$Parser$concat = x0 => x1 => x2 => x3 => Kind$Parser$concat$(x0, x1, x2, x3);

    function Kind$Parser$string_concat$(_init$1, _str0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("|", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3274 = self.idx;
                var $3275 = self.code;
                var $3276 = self.err;
                var $3277 = Parser$Reply$error$($3274, $3275, $3276);
                var $3273 = $3277;
                break;
            case 'Parser.Reply.value':
                var $3278 = self.idx;
                var $3279 = self.code;
                var self = Kind$Parser$term$($3278, $3279);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3281 = self.idx;
                        var $3282 = self.code;
                        var $3283 = self.err;
                        var $3284 = Parser$Reply$error$($3281, $3282, $3283);
                        var $3280 = $3284;
                        break;
                    case 'Parser.Reply.value':
                        var $3285 = self.idx;
                        var $3286 = self.code;
                        var $3287 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3285, $3286);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3289 = self.idx;
                                var $3290 = self.code;
                                var $3291 = self.err;
                                var $3292 = Parser$Reply$error$($3289, $3290, $3291);
                                var $3288 = $3292;
                                break;
                            case 'Parser.Reply.value':
                                var $3293 = self.idx;
                                var $3294 = self.code;
                                var _term$14 = Kind$Term$ref$("String.concat");
                                var _term$15 = Kind$Term$app$(_term$14, _str0$2);
                                var _term$16 = Kind$Term$app$(_term$15, $3287);
                                var self = Kind$Parser$stop$(_init$1, $3293, $3294);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3296 = self.idx;
                                        var $3297 = self.code;
                                        var $3298 = self.err;
                                        var $3299 = Parser$Reply$error$($3296, $3297, $3298);
                                        var $3295 = $3299;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3300 = self.idx;
                                        var $3301 = self.code;
                                        var $3302 = self.val;
                                        var $3303 = Parser$Reply$value$($3300, $3301, Kind$Term$ori$($3302, _term$16));
                                        var $3295 = $3303;
                                        break;
                                };
                                var $3288 = $3295;
                                break;
                        };
                        var $3280 = $3288;
                        break;
                };
                var $3273 = $3280;
                break;
        };
        return $3273;
    };
    const Kind$Parser$string_concat = x0 => x1 => x2 => x3 => Kind$Parser$string_concat$(x0, x1, x2, x3);

    function Kind$Parser$sigma$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("~", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3305 = self.idx;
                var $3306 = self.code;
                var $3307 = self.err;
                var $3308 = Parser$Reply$error$($3305, $3306, $3307);
                var $3304 = $3308;
                break;
            case 'Parser.Reply.value':
                var $3309 = self.idx;
                var $3310 = self.code;
                var self = Kind$Parser$term$($3309, $3310);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3312 = self.idx;
                        var $3313 = self.code;
                        var $3314 = self.err;
                        var $3315 = Parser$Reply$error$($3312, $3313, $3314);
                        var $3311 = $3315;
                        break;
                    case 'Parser.Reply.value':
                        var $3316 = self.idx;
                        var $3317 = self.code;
                        var $3318 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3316, $3317);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3320 = self.idx;
                                var $3321 = self.code;
                                var $3322 = self.err;
                                var $3323 = Parser$Reply$error$($3320, $3321, $3322);
                                var $3319 = $3323;
                                break;
                            case 'Parser.Reply.value':
                                var $3324 = self.idx;
                                var $3325 = self.code;
                                var $3326 = self.val;
                                var _term$14 = Kind$Term$ref$("Sigma.new");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                var _term$17 = Kind$Term$app$(_term$16, _val0$2);
                                var _term$18 = Kind$Term$app$(_term$17, $3318);
                                var $3327 = Parser$Reply$value$($3324, $3325, Kind$Term$ori$($3326, _term$18));
                                var $3319 = $3327;
                                break;
                        };
                        var $3311 = $3319;
                        break;
                };
                var $3304 = $3311;
                break;
        };
        return $3304;
    };
    const Kind$Parser$sigma = x0 => x1 => x2 => x3 => Kind$Parser$sigma$(x0, x1, x2, x3);

    function Kind$Parser$equality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("==", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3329 = self.idx;
                var $3330 = self.code;
                var $3331 = self.err;
                var $3332 = Parser$Reply$error$($3329, $3330, $3331);
                var $3328 = $3332;
                break;
            case 'Parser.Reply.value':
                var $3333 = self.idx;
                var $3334 = self.code;
                var self = Kind$Parser$term$($3333, $3334);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3336 = self.idx;
                        var $3337 = self.code;
                        var $3338 = self.err;
                        var $3339 = Parser$Reply$error$($3336, $3337, $3338);
                        var $3335 = $3339;
                        break;
                    case 'Parser.Reply.value':
                        var $3340 = self.idx;
                        var $3341 = self.code;
                        var $3342 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3340, $3341);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3344 = self.idx;
                                var $3345 = self.code;
                                var $3346 = self.err;
                                var $3347 = Parser$Reply$error$($3344, $3345, $3346);
                                var $3343 = $3347;
                                break;
                            case 'Parser.Reply.value':
                                var $3348 = self.idx;
                                var $3349 = self.code;
                                var $3350 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3342);
                                var $3351 = Parser$Reply$value$($3348, $3349, Kind$Term$ori$($3350, _term$17));
                                var $3343 = $3351;
                                break;
                        };
                        var $3335 = $3343;
                        break;
                };
                var $3328 = $3335;
                break;
        };
        return $3328;
    };
    const Kind$Parser$equality = x0 => x1 => x2 => x3 => Kind$Parser$equality$(x0, x1, x2, x3);

    function Kind$Parser$inequality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!=", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3353 = self.idx;
                var $3354 = self.code;
                var $3355 = self.err;
                var $3356 = Parser$Reply$error$($3353, $3354, $3355);
                var $3352 = $3356;
                break;
            case 'Parser.Reply.value':
                var $3357 = self.idx;
                var $3358 = self.code;
                var self = Kind$Parser$term$($3357, $3358);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3360 = self.idx;
                        var $3361 = self.code;
                        var $3362 = self.err;
                        var $3363 = Parser$Reply$error$($3360, $3361, $3362);
                        var $3359 = $3363;
                        break;
                    case 'Parser.Reply.value':
                        var $3364 = self.idx;
                        var $3365 = self.code;
                        var $3366 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3364, $3365);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3368 = self.idx;
                                var $3369 = self.code;
                                var $3370 = self.err;
                                var $3371 = Parser$Reply$error$($3368, $3369, $3370);
                                var $3367 = $3371;
                                break;
                            case 'Parser.Reply.value':
                                var $3372 = self.idx;
                                var $3373 = self.code;
                                var $3374 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3366);
                                var _term$18 = Kind$Term$app$(Kind$Term$ref$("Not"), _term$17);
                                var $3375 = Parser$Reply$value$($3372, $3373, Kind$Term$ori$($3374, _term$18));
                                var $3367 = $3375;
                                break;
                        };
                        var $3359 = $3367;
                        break;
                };
                var $3352 = $3359;
                break;
        };
        return $3352;
    };
    const Kind$Parser$inequality = x0 => x1 => x2 => x3 => Kind$Parser$inequality$(x0, x1, x2, x3);

    function Kind$Parser$rewrite$(_init$1, _subt$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3377 = self.idx;
                var $3378 = self.code;
                var $3379 = self.err;
                var $3380 = Parser$Reply$error$($3377, $3378, $3379);
                var $3376 = $3380;
                break;
            case 'Parser.Reply.value':
                var $3381 = self.idx;
                var $3382 = self.code;
                var self = Kind$Parser$text$("rewrite", $3381, $3382);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3384 = self.idx;
                        var $3385 = self.code;
                        var $3386 = self.err;
                        var $3387 = Parser$Reply$error$($3384, $3385, $3386);
                        var $3383 = $3387;
                        break;
                    case 'Parser.Reply.value':
                        var $3388 = self.idx;
                        var $3389 = self.code;
                        var self = Kind$Parser$name1$($3388, $3389);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3391 = self.idx;
                                var $3392 = self.code;
                                var $3393 = self.err;
                                var $3394 = Parser$Reply$error$($3391, $3392, $3393);
                                var $3390 = $3394;
                                break;
                            case 'Parser.Reply.value':
                                var $3395 = self.idx;
                                var $3396 = self.code;
                                var $3397 = self.val;
                                var self = Kind$Parser$text$("in", $3395, $3396);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3399 = self.idx;
                                        var $3400 = self.code;
                                        var $3401 = self.err;
                                        var $3402 = Parser$Reply$error$($3399, $3400, $3401);
                                        var $3398 = $3402;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3403 = self.idx;
                                        var $3404 = self.code;
                                        var self = Kind$Parser$term$($3403, $3404);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3406 = self.idx;
                                                var $3407 = self.code;
                                                var $3408 = self.err;
                                                var $3409 = Parser$Reply$error$($3406, $3407, $3408);
                                                var $3405 = $3409;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3410 = self.idx;
                                                var $3411 = self.code;
                                                var $3412 = self.val;
                                                var self = Kind$Parser$text$("with", $3410, $3411);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3414 = self.idx;
                                                        var $3415 = self.code;
                                                        var $3416 = self.err;
                                                        var $3417 = Parser$Reply$error$($3414, $3415, $3416);
                                                        var $3413 = $3417;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3418 = self.idx;
                                                        var $3419 = self.code;
                                                        var self = Kind$Parser$term$($3418, $3419);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3421 = self.idx;
                                                                var $3422 = self.code;
                                                                var $3423 = self.err;
                                                                var $3424 = Parser$Reply$error$($3421, $3422, $3423);
                                                                var $3420 = $3424;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3425 = self.idx;
                                                                var $3426 = self.code;
                                                                var $3427 = self.val;
                                                                var self = Kind$Parser$stop$(_init$1, $3425, $3426);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $3429 = self.idx;
                                                                        var $3430 = self.code;
                                                                        var $3431 = self.err;
                                                                        var $3432 = Parser$Reply$error$($3429, $3430, $3431);
                                                                        var $3428 = $3432;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $3433 = self.idx;
                                                                        var $3434 = self.code;
                                                                        var $3435 = self.val;
                                                                        var _term$29 = Kind$Term$ref$("Equal.rewrite");
                                                                        var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                        var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                        var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                        var _term$33 = Kind$Term$app$(_term$32, $3427);
                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$lam$($3397, (_x$34 => {
                                                                            var $3437 = $3412;
                                                                            return $3437;
                                                                        })));
                                                                        var _term$35 = Kind$Term$app$(_term$34, _subt$2);
                                                                        var $3436 = Parser$Reply$value$($3433, $3434, Kind$Term$ori$($3435, _term$35));
                                                                        var $3428 = $3436;
                                                                        break;
                                                                };
                                                                var $3420 = $3428;
                                                                break;
                                                        };
                                                        var $3413 = $3420;
                                                        break;
                                                };
                                                var $3405 = $3413;
                                                break;
                                        };
                                        var $3398 = $3405;
                                        break;
                                };
                                var $3390 = $3398;
                                break;
                        };
                        var $3383 = $3390;
                        break;
                };
                var $3376 = $3383;
                break;
        };
        return $3376;
    };
    const Kind$Parser$rewrite = x0 => x1 => x2 => x3 => Kind$Parser$rewrite$(x0, x1, x2, x3);

    function Kind$Term$ann$(_done$1, _term$2, _type$3) {
        var $3438 = ({
            _: 'Kind.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $3438;
    };
    const Kind$Term$ann = x0 => x1 => x2 => Kind$Term$ann$(x0, x1, x2);

    function Kind$Parser$annotation$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3440 = self.idx;
                var $3441 = self.code;
                var $3442 = self.err;
                var $3443 = Parser$Reply$error$($3440, $3441, $3442);
                var $3439 = $3443;
                break;
            case 'Parser.Reply.value':
                var $3444 = self.idx;
                var $3445 = self.code;
                var self = Kind$Parser$term$($3444, $3445);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3447 = self.idx;
                        var $3448 = self.code;
                        var $3449 = self.err;
                        var $3450 = Parser$Reply$error$($3447, $3448, $3449);
                        var $3446 = $3450;
                        break;
                    case 'Parser.Reply.value':
                        var $3451 = self.idx;
                        var $3452 = self.code;
                        var $3453 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3451, $3452);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3455 = self.idx;
                                var $3456 = self.code;
                                var $3457 = self.err;
                                var $3458 = Parser$Reply$error$($3455, $3456, $3457);
                                var $3454 = $3458;
                                break;
                            case 'Parser.Reply.value':
                                var $3459 = self.idx;
                                var $3460 = self.code;
                                var $3461 = self.val;
                                var $3462 = Parser$Reply$value$($3459, $3460, Kind$Term$ori$($3461, Kind$Term$ann$(Bool$false, _term$2, $3453)));
                                var $3454 = $3462;
                                break;
                        };
                        var $3446 = $3454;
                        break;
                };
                var $3439 = $3446;
                break;
        };
        return $3439;
    };
    const Kind$Parser$annotation = x0 => x1 => x2 => x3 => Kind$Parser$annotation$(x0, x1, x2, x3);

    function Kind$Parser$application$hole$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3464 = self.idx;
                var $3465 = self.code;
                var $3466 = self.err;
                var $3467 = Parser$Reply$error$($3464, $3465, $3466);
                var $3463 = $3467;
                break;
            case 'Parser.Reply.value':
                var $3468 = self.idx;
                var $3469 = self.code;
                var self = Kind$Parser$stop$(_init$1, $3468, $3469);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3471 = self.idx;
                        var $3472 = self.code;
                        var $3473 = self.err;
                        var $3474 = Parser$Reply$error$($3471, $3472, $3473);
                        var $3470 = $3474;
                        break;
                    case 'Parser.Reply.value':
                        var $3475 = self.idx;
                        var $3476 = self.code;
                        var $3477 = self.val;
                        var $3478 = Parser$Reply$value$($3475, $3476, Kind$Term$ori$($3477, Kind$Term$app$(_term$2, Kind$Term$hol$(Bits$e))));
                        var $3470 = $3478;
                        break;
                };
                var $3463 = $3470;
                break;
        };
        return $3463;
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
                        var $3480 = self.idx;
                        var $3481 = self.code;
                        var $3482 = self.val;
                        var $3483 = Kind$Parser$suffix$(_init$1, $3482, $3480, $3481);
                        var $3479 = $3483;
                        break;
                    case 'Parser.Reply.error':
                        var $3484 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $3479 = $3484;
                        break;
                };
                return $3479;
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
                var $3486 = self.idx;
                var $3487 = self.code;
                var $3488 = self.err;
                var $3489 = Parser$Reply$error$($3486, $3487, $3488);
                var $3485 = $3489;
                break;
            case 'Parser.Reply.value':
                var $3490 = self.idx;
                var $3491 = self.code;
                var $3492 = self.val;
                var self = Parser$first_of$(List$cons$(Kind$Parser$type, List$cons$(Kind$Parser$forall, List$cons$(Kind$Parser$lambda, List$cons$(Kind$Parser$lambda$erased, List$cons$(Kind$Parser$lambda$nameless, List$cons$(Kind$Parser$parenthesis, List$cons$(Kind$Parser$letforrange$u32, List$cons$(Kind$Parser$letforrange$nat, List$cons$(Kind$Parser$letforin, List$cons$(Kind$Parser$let, List$cons$(Kind$Parser$get, List$cons$(Kind$Parser$def, List$cons$(Kind$Parser$goal_rewrite, List$cons$(Kind$Parser$if, List$cons$(Kind$Parser$char, List$cons$(Kind$Parser$string, List$cons$(Kind$Parser$pair, List$cons$(Kind$Parser$sigma$type, List$cons$(Kind$Parser$some, List$cons$(Kind$Parser$apply, List$cons$(Kind$Parser$mirror, List$cons$(Kind$Parser$list, List$cons$(Kind$Parser$map, List$cons$(Kind$Parser$log, List$cons$(Kind$Parser$do, List$cons$(Kind$Parser$case, List$cons$(Kind$Parser$open, List$cons$(Kind$Parser$without, List$cons$(Kind$Parser$switch, List$cons$(Kind$Parser$goal, List$cons$(Kind$Parser$hole, List$cons$(Kind$Parser$u8, List$cons$(Kind$Parser$u16, List$cons$(Kind$Parser$u32, List$cons$(Kind$Parser$u64, List$cons$(Kind$Parser$nat, List$cons$(Kind$Parser$reference, List$nil))))))))))))))))))))))))))))))))))))))($3490)($3491);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3494 = self.idx;
                        var $3495 = self.code;
                        var $3496 = self.err;
                        var $3497 = Parser$Reply$error$($3494, $3495, $3496);
                        var $3493 = $3497;
                        break;
                    case 'Parser.Reply.value':
                        var $3498 = self.idx;
                        var $3499 = self.code;
                        var $3500 = self.val;
                        var $3501 = Kind$Parser$suffix$($3492, $3500, $3498, $3499);
                        var $3493 = $3501;
                        break;
                };
                var $3485 = $3493;
                break;
        };
        return $3485;
    };
    const Kind$Parser$term = x0 => x1 => Kind$Parser$term$(x0, x1);

    function Kind$Parser$name_term$(_sep$1, _idx$2, _code$3) {
        var self = Kind$Parser$name$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3503 = self.idx;
                var $3504 = self.code;
                var $3505 = self.err;
                var $3506 = Parser$Reply$error$($3503, $3504, $3505);
                var $3502 = $3506;
                break;
            case 'Parser.Reply.value':
                var $3507 = self.idx;
                var $3508 = self.code;
                var $3509 = self.val;
                var self = Kind$Parser$text$(_sep$1, $3507, $3508);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3511 = self.idx;
                        var $3512 = self.code;
                        var $3513 = self.err;
                        var $3514 = Parser$Reply$error$($3511, $3512, $3513);
                        var $3510 = $3514;
                        break;
                    case 'Parser.Reply.value':
                        var $3515 = self.idx;
                        var $3516 = self.code;
                        var self = Kind$Parser$term$($3515, $3516);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3518 = self.idx;
                                var $3519 = self.code;
                                var $3520 = self.err;
                                var $3521 = Parser$Reply$error$($3518, $3519, $3520);
                                var $3517 = $3521;
                                break;
                            case 'Parser.Reply.value':
                                var $3522 = self.idx;
                                var $3523 = self.code;
                                var $3524 = self.val;
                                var $3525 = Parser$Reply$value$($3522, $3523, Pair$new$($3509, $3524));
                                var $3517 = $3525;
                                break;
                        };
                        var $3510 = $3517;
                        break;
                };
                var $3502 = $3510;
                break;
        };
        return $3502;
    };
    const Kind$Parser$name_term = x0 => x1 => x2 => Kind$Parser$name_term$(x0, x1, x2);

    function Kind$Binder$new$(_eras$1, _name$2, _term$3) {
        var $3526 = ({
            _: 'Kind.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $3526;
    };
    const Kind$Binder$new = x0 => x1 => x2 => Kind$Binder$new$(x0, x1, x2);

    function Kind$Parser$binder$homo$(_sep$1, _eras$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$((() => {
            var self = _eras$2;
            if (self) {
                var $3528 = "<";
                return $3528;
            } else {
                var $3529 = "(";
                return $3529;
            };
        })(), _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3530 = self.idx;
                var $3531 = self.code;
                var $3532 = self.err;
                var $3533 = Parser$Reply$error$($3530, $3531, $3532);
                var $3527 = $3533;
                break;
            case 'Parser.Reply.value':
                var $3534 = self.idx;
                var $3535 = self.code;
                var self = Parser$until1$(Kind$Parser$text((() => {
                    var self = _eras$2;
                    if (self) {
                        var $3537 = ">";
                        return $3537;
                    } else {
                        var $3538 = ")";
                        return $3538;
                    };
                })()), Kind$Parser$item(Kind$Parser$name_term(_sep$1)), $3534, $3535);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3539 = self.idx;
                        var $3540 = self.code;
                        var $3541 = self.err;
                        var $3542 = Parser$Reply$error$($3539, $3540, $3541);
                        var $3536 = $3542;
                        break;
                    case 'Parser.Reply.value':
                        var $3543 = self.idx;
                        var $3544 = self.code;
                        var $3545 = self.val;
                        var $3546 = Parser$Reply$value$($3543, $3544, List$mapped$($3545, (_pair$11 => {
                            var self = _pair$11;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3548 = self.fst;
                                    var $3549 = self.snd;
                                    var $3550 = Kind$Binder$new$(_eras$2, $3548, $3549);
                                    var $3547 = $3550;
                                    break;
                            };
                            return $3547;
                        })));
                        var $3536 = $3546;
                        break;
                };
                var $3527 = $3536;
                break;
        };
        return $3527;
    };
    const Kind$Parser$binder$homo = x0 => x1 => x2 => x3 => Kind$Parser$binder$homo$(x0, x1, x2, x3);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3552 = self.head;
                var $3553 = self.tail;
                var $3554 = List$cons$($3552, List$concat$($3553, _bs$3));
                var $3551 = $3554;
                break;
            case 'List.nil':
                var $3555 = _bs$3;
                var $3551 = $3555;
                break;
        };
        return $3551;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $3557 = self.head;
                var $3558 = self.tail;
                var $3559 = List$concat$($3557, List$flatten$($3558));
                var $3556 = $3559;
                break;
            case 'List.nil':
                var $3560 = List$nil;
                var $3556 = $3560;
                break;
        };
        return $3556;
    };
    const List$flatten = x0 => List$flatten$(x0);

    function Kind$Parser$binder$(_sep$1, _idx$2, _code$3) {
        var self = Parser$many1$(Parser$first_of$(List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$true), List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$false), List$nil))), _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3562 = self.idx;
                var $3563 = self.code;
                var $3564 = self.err;
                var $3565 = Parser$Reply$error$($3562, $3563, $3564);
                var $3561 = $3565;
                break;
            case 'Parser.Reply.value':
                var $3566 = self.idx;
                var $3567 = self.code;
                var $3568 = self.val;
                var $3569 = Parser$Reply$value$($3566, $3567, List$flatten$($3568));
                var $3561 = $3569;
                break;
        };
        return $3561;
    };
    const Kind$Parser$binder = x0 => x1 => x2 => Kind$Parser$binder$(x0, x1, x2);
    const List$length = a0 => (list_length(a0));

    function Kind$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.cons':
                var $3571 = self.head;
                var $3572 = self.tail;
                var self = $3571;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3574 = self.eras;
                        var $3575 = self.name;
                        var $3576 = self.term;
                        var $3577 = Kind$Term$all$($3574, "", $3575, $3576, (_s$8 => _x$9 => {
                            var $3578 = Kind$Parser$make_forall$($3572, _body$2);
                            return $3578;
                        }));
                        var $3573 = $3577;
                        break;
                };
                var $3570 = $3573;
                break;
            case 'List.nil':
                var $3579 = _body$2;
                var $3570 = $3579;
                break;
        };
        return $3570;
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
                        var $3580 = self.head;
                        var $3581 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $3583 = Maybe$some$($3580);
                            var $3582 = $3583;
                        } else {
                            var $3584 = (self - 1n);
                            var $3585 = List$at$($3584, $3581);
                            var $3582 = $3585;
                        };
                        return $3582;
                    case 'List.nil':
                        var $3586 = Maybe$none;
                        return $3586;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $3587 = List$at$(_index$2, List$reverse$(_list$3));
        return $3587;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Kind$Term$var$(_name$1, _indx$2) {
        var $3588 = ({
            _: 'Kind.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $3588;
    };
    const Kind$Term$var = x0 => x1 => Kind$Term$var$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $3590 = self.snd;
                var $3591 = $3590;
                var $3589 = $3591;
                break;
        };
        return $3589;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Kind$Context$get_name_skips$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3593 = Pair$new$("", 0n);
            var $3592 = $3593;
        } else {
            var $3594 = self.charCodeAt(0);
            var $3595 = self.slice(1);
            var _name_skips$4 = Kind$Context$get_name_skips$($3595);
            var self = _name_skips$4;
            switch (self._) {
                case 'Pair.new':
                    var $3597 = self.fst;
                    var $3598 = self.snd;
                    var self = ($3594 === 94);
                    if (self) {
                        var $3600 = Pair$new$($3597, Nat$succ$($3598));
                        var $3599 = $3600;
                    } else {
                        var $3601 = Pair$new$(String$cons$($3594, $3597), $3598);
                        var $3599 = $3601;
                    };
                    var $3596 = $3599;
                    break;
            };
            var $3592 = $3596;
        };
        return $3592;
    };
    const Kind$Context$get_name_skips = x0 => Kind$Context$get_name_skips$(x0);

    function Kind$Name$eql$(_a$1, _b$2) {
        var $3602 = (_a$1 === _b$2);
        return $3602;
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
                        var $3603 = self.head;
                        var $3604 = self.tail;
                        var self = $3603;
                        switch (self._) {
                            case 'Pair.new':
                                var $3606 = self.fst;
                                var $3607 = self.snd;
                                var self = Kind$Name$eql$(_name$1, $3606);
                                if (self) {
                                    var self = _skip$2;
                                    if (self === 0n) {
                                        var $3610 = Maybe$some$($3607);
                                        var $3609 = $3610;
                                    } else {
                                        var $3611 = (self - 1n);
                                        var $3612 = Kind$Context$find$go$(_name$1, $3611, $3604);
                                        var $3609 = $3612;
                                    };
                                    var $3608 = $3609;
                                } else {
                                    var $3613 = Kind$Context$find$go$(_name$1, _skip$2, $3604);
                                    var $3608 = $3613;
                                };
                                var $3605 = $3608;
                                break;
                        };
                        return $3605;
                    case 'List.nil':
                        var $3614 = Maybe$none;
                        return $3614;
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
                var $3616 = self.fst;
                var $3617 = self.snd;
                var $3618 = Kind$Context$find$go$($3616, $3617, _ctx$2);
                var $3615 = $3618;
                break;
        };
        return $3615;
    };
    const Kind$Context$find = x0 => x1 => Kind$Context$find$(x0, x1);

    function Kind$Path$o$(_path$1, _x$2) {
        var $3619 = _path$1((_x$2 + '0'));
        return $3619;
    };
    const Kind$Path$o = x0 => x1 => Kind$Path$o$(x0, x1);

    function Kind$Path$i$(_path$1, _x$2) {
        var $3620 = _path$1((_x$2 + '1'));
        return $3620;
    };
    const Kind$Path$i = x0 => x1 => Kind$Path$i$(x0, x1);

    function Kind$Path$to_bits$(_path$1) {
        var $3621 = _path$1(Bits$e);
        return $3621;
    };
    const Kind$Path$to_bits = x0 => Kind$Path$to_bits$(x0);

    function Kind$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kind.Term.var':
                var $3623 = self.name;
                var $3624 = self.indx;
                var self = List$at_last$($3624, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3626 = self.value;
                        var $3627 = Pair$snd$($3626);
                        var $3625 = $3627;
                        break;
                    case 'Maybe.none':
                        var $3628 = Kind$Term$var$($3623, $3624);
                        var $3625 = $3628;
                        break;
                };
                var $3622 = $3625;
                break;
            case 'Kind.Term.ref':
                var $3629 = self.name;
                var self = Kind$Context$find$($3629, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3631 = self.value;
                        var $3632 = $3631;
                        var $3630 = $3632;
                        break;
                    case 'Maybe.none':
                        var $3633 = Kind$Term$ref$($3629);
                        var $3630 = $3633;
                        break;
                };
                var $3622 = $3630;
                break;
            case 'Kind.Term.all':
                var $3634 = self.eras;
                var $3635 = self.self;
                var $3636 = self.name;
                var $3637 = self.xtyp;
                var $3638 = self.body;
                var _vlen$9 = (list_length(_vars$1));
                var $3639 = Kind$Term$all$($3634, $3635, $3636, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3637), (_s$10 => _x$11 => {
                    var $3640 = Kind$Term$bind$(List$cons$(Pair$new$($3636, _x$11), List$cons$(Pair$new$($3635, _s$10), _vars$1)), Kind$Path$i(_path$2), $3638(Kind$Term$var$($3635, _vlen$9))(Kind$Term$var$($3636, Nat$succ$(_vlen$9))));
                    return $3640;
                }));
                var $3622 = $3639;
                break;
            case 'Kind.Term.lam':
                var $3641 = self.name;
                var $3642 = self.body;
                var _vlen$6 = (list_length(_vars$1));
                var $3643 = Kind$Term$lam$($3641, (_x$7 => {
                    var $3644 = Kind$Term$bind$(List$cons$(Pair$new$($3641, _x$7), _vars$1), Kind$Path$o(_path$2), $3642(Kind$Term$var$($3641, _vlen$6)));
                    return $3644;
                }));
                var $3622 = $3643;
                break;
            case 'Kind.Term.app':
                var $3645 = self.func;
                var $3646 = self.argm;
                var $3647 = Kind$Term$app$(Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3645), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3646));
                var $3622 = $3647;
                break;
            case 'Kind.Term.let':
                var $3648 = self.name;
                var $3649 = self.expr;
                var $3650 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3651 = Kind$Term$let$($3648, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3649), (_x$8 => {
                    var $3652 = Kind$Term$bind$(List$cons$(Pair$new$($3648, _x$8), _vars$1), Kind$Path$i(_path$2), $3650(Kind$Term$var$($3648, _vlen$7)));
                    return $3652;
                }));
                var $3622 = $3651;
                break;
            case 'Kind.Term.def':
                var $3653 = self.name;
                var $3654 = self.expr;
                var $3655 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3656 = Kind$Term$def$($3653, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3654), (_x$8 => {
                    var $3657 = Kind$Term$bind$(List$cons$(Pair$new$($3653, _x$8), _vars$1), Kind$Path$i(_path$2), $3655(Kind$Term$var$($3653, _vlen$7)));
                    return $3657;
                }));
                var $3622 = $3656;
                break;
            case 'Kind.Term.ann':
                var $3658 = self.done;
                var $3659 = self.term;
                var $3660 = self.type;
                var $3661 = Kind$Term$ann$($3658, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3659), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3660));
                var $3622 = $3661;
                break;
            case 'Kind.Term.gol':
                var $3662 = self.name;
                var $3663 = self.dref;
                var $3664 = self.verb;
                var $3665 = Kind$Term$gol$($3662, $3663, $3664);
                var $3622 = $3665;
                break;
            case 'Kind.Term.nat':
                var $3666 = self.natx;
                var $3667 = Kind$Term$nat$($3666);
                var $3622 = $3667;
                break;
            case 'Kind.Term.chr':
                var $3668 = self.chrx;
                var $3669 = Kind$Term$chr$($3668);
                var $3622 = $3669;
                break;
            case 'Kind.Term.str':
                var $3670 = self.strx;
                var $3671 = Kind$Term$str$($3670);
                var $3622 = $3671;
                break;
            case 'Kind.Term.cse':
                var $3672 = self.expr;
                var $3673 = self.name;
                var $3674 = self.with;
                var $3675 = self.cses;
                var $3676 = self.moti;
                var _expr$10 = Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3672);
                var _name$11 = $3673;
                var _wyth$12 = $3674;
                var _cses$13 = $3675;
                var _moti$14 = $3676;
                var $3677 = Kind$Term$cse$(Kind$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $3622 = $3677;
                break;
            case 'Kind.Term.ori':
                var $3678 = self.orig;
                var $3679 = self.expr;
                var $3680 = Kind$Term$ori$($3678, Kind$Term$bind$(_vars$1, _path$2, $3679));
                var $3622 = $3680;
                break;
            case 'Kind.Term.typ':
                var $3681 = Kind$Term$typ;
                var $3622 = $3681;
                break;
            case 'Kind.Term.hol':
                var $3682 = Kind$Term$hol$(Kind$Path$to_bits$(_path$2));
                var $3622 = $3682;
                break;
        };
        return $3622;
    };
    const Kind$Term$bind = x0 => x1 => x2 => Kind$Term$bind$(x0, x1, x2);
    const Kind$Status$done = ({
        _: 'Kind.Status.done'
    });

    function Kind$define$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _done$9, _defs$10) {
        var self = _done$9;
        if (self) {
            var $3684 = Kind$Status$done;
            var _stat$11 = $3684;
        } else {
            var $3685 = Kind$Status$init;
            var _stat$11 = $3685;
        };
        var $3683 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$11), _defs$10);
        return $3683;
    };
    const Kind$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Kind$define$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Kind$Parser$file$def$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3687 = self.idx;
                var $3688 = self.code;
                var $3689 = self.err;
                var $3690 = Parser$Reply$error$($3687, $3688, $3689);
                var $3686 = $3690;
                break;
            case 'Parser.Reply.value':
                var $3691 = self.idx;
                var $3692 = self.code;
                var $3693 = self.val;
                var self = Kind$Parser$name1$($3691, $3692);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3695 = self.idx;
                        var $3696 = self.code;
                        var $3697 = self.err;
                        var $3698 = Parser$Reply$error$($3695, $3696, $3697);
                        var $3694 = $3698;
                        break;
                    case 'Parser.Reply.value':
                        var $3699 = self.idx;
                        var $3700 = self.code;
                        var $3701 = self.val;
                        var self = Parser$many$(Kind$Parser$binder(":"))($3699)($3700);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3703 = self.idx;
                                var $3704 = self.code;
                                var $3705 = self.err;
                                var $3706 = Parser$Reply$error$($3703, $3704, $3705);
                                var $3702 = $3706;
                                break;
                            case 'Parser.Reply.value':
                                var $3707 = self.idx;
                                var $3708 = self.code;
                                var $3709 = self.val;
                                var _args$15 = List$flatten$($3709);
                                var self = Kind$Parser$text$(":", $3707, $3708);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3711 = self.idx;
                                        var $3712 = self.code;
                                        var $3713 = self.err;
                                        var $3714 = Parser$Reply$error$($3711, $3712, $3713);
                                        var $3710 = $3714;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3715 = self.idx;
                                        var $3716 = self.code;
                                        var self = Kind$Parser$term$($3715, $3716);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3718 = self.idx;
                                                var $3719 = self.code;
                                                var $3720 = self.err;
                                                var $3721 = Parser$Reply$error$($3718, $3719, $3720);
                                                var $3717 = $3721;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3722 = self.idx;
                                                var $3723 = self.code;
                                                var $3724 = self.val;
                                                var self = Kind$Parser$term$($3722, $3723);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3726 = self.idx;
                                                        var $3727 = self.code;
                                                        var $3728 = self.err;
                                                        var $3729 = Parser$Reply$error$($3726, $3727, $3728);
                                                        var $3725 = $3729;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3730 = self.idx;
                                                        var $3731 = self.code;
                                                        var $3732 = self.val;
                                                        var self = Kind$Parser$stop$($3693, $3730, $3731);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3734 = self.idx;
                                                                var $3735 = self.code;
                                                                var $3736 = self.err;
                                                                var $3737 = Parser$Reply$error$($3734, $3735, $3736);
                                                                var $3733 = $3737;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3738 = self.idx;
                                                                var $3739 = self.code;
                                                                var $3740 = self.val;
                                                                var _arit$28 = (list_length(_args$15));
                                                                var _type$29 = Kind$Parser$make_forall$(_args$15, $3724);
                                                                var _term$30 = Kind$Parser$make_lambda$(List$mapped$(_args$15, (_x$30 => {
                                                                    var self = _x$30;
                                                                    switch (self._) {
                                                                        case 'Kind.Binder.new':
                                                                            var $3743 = self.name;
                                                                            var $3744 = $3743;
                                                                            var $3742 = $3744;
                                                                            break;
                                                                    };
                                                                    return $3742;
                                                                })), $3732);
                                                                var _type$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                                    var $3745 = (_x$31 + '1');
                                                                    return $3745;
                                                                }), _type$29);
                                                                var _term$32 = Kind$Term$bind$(List$nil, (_x$32 => {
                                                                    var $3746 = (_x$32 + '0');
                                                                    return $3746;
                                                                }), _term$30);
                                                                var _defs$33 = Kind$define$(_file$1, _code$2, $3740, $3701, _term$32, _type$31, Bool$false, _arit$28, Bool$false, _defs$3);
                                                                var $3741 = Parser$Reply$value$($3738, $3739, _defs$33);
                                                                var $3733 = $3741;
                                                                break;
                                                        };
                                                        var $3725 = $3733;
                                                        break;
                                                };
                                                var $3717 = $3725;
                                                break;
                                        };
                                        var $3710 = $3717;
                                        break;
                                };
                                var $3702 = $3710;
                                break;
                        };
                        var $3694 = $3702;
                        break;
                };
                var $3686 = $3694;
                break;
        };
        return $3686;
    };
    const Kind$Parser$file$def = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$def$(x0, x1, x2, x3, x4);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $3748 = self.value;
                var $3749 = $3748;
                var $3747 = $3749;
                break;
            case 'Maybe.none':
                var $3750 = _a$2;
                var $3747 = $3750;
                break;
        };
        return $3747;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Kind$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $3751 = ({
            _: 'Kind.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $3751;
    };
    const Kind$Constructor$new = x0 => x1 => x2 => Kind$Constructor$new$(x0, x1, x2);

    function Kind$Parser$constructor$(_namespace$1, _idx$2, _code$3) {
        var self = Kind$Parser$name1$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3753 = self.idx;
                var $3754 = self.code;
                var $3755 = self.err;
                var $3756 = Parser$Reply$error$($3753, $3754, $3755);
                var $3752 = $3756;
                break;
            case 'Parser.Reply.value':
                var $3757 = self.idx;
                var $3758 = self.code;
                var $3759 = self.val;
                var self = Parser$maybe$(Kind$Parser$binder(":"), $3757, $3758);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3761 = self.idx;
                        var $3762 = self.code;
                        var $3763 = self.err;
                        var $3764 = Parser$Reply$error$($3761, $3762, $3763);
                        var $3760 = $3764;
                        break;
                    case 'Parser.Reply.value':
                        var $3765 = self.idx;
                        var $3766 = self.code;
                        var $3767 = self.val;
                        var self = Parser$maybe$((_idx$10 => _code$11 => {
                            var self = Kind$Parser$text$("~", _idx$10, _code$11);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $3770 = self.idx;
                                    var $3771 = self.code;
                                    var $3772 = self.err;
                                    var $3773 = Parser$Reply$error$($3770, $3771, $3772);
                                    var $3769 = $3773;
                                    break;
                                case 'Parser.Reply.value':
                                    var $3774 = self.idx;
                                    var $3775 = self.code;
                                    var $3776 = Kind$Parser$binder$("=", $3774, $3775);
                                    var $3769 = $3776;
                                    break;
                            };
                            return $3769;
                        }), $3765, $3766);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3777 = self.idx;
                                var $3778 = self.code;
                                var $3779 = self.err;
                                var $3780 = Parser$Reply$error$($3777, $3778, $3779);
                                var $3768 = $3780;
                                break;
                            case 'Parser.Reply.value':
                                var $3781 = self.idx;
                                var $3782 = self.code;
                                var $3783 = self.val;
                                var _args$13 = Maybe$default$(List$nil, $3767);
                                var _inds$14 = Maybe$default$(List$nil, $3783);
                                var $3784 = Parser$Reply$value$($3781, $3782, Kind$Constructor$new$($3759, _args$13, _inds$14));
                                var $3768 = $3784;
                                break;
                        };
                        var $3760 = $3768;
                        break;
                };
                var $3752 = $3760;
                break;
        };
        return $3752;
    };
    const Kind$Parser$constructor = x0 => x1 => x2 => Kind$Parser$constructor$(x0, x1, x2);

    function Kind$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $3785 = ({
            _: 'Kind.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $3785;
    };
    const Kind$Datatype$new = x0 => x1 => x2 => x3 => Kind$Datatype$new$(x0, x1, x2, x3);

    function Kind$Parser$datatype$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("type ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3787 = self.idx;
                var $3788 = self.code;
                var $3789 = self.err;
                var $3790 = Parser$Reply$error$($3787, $3788, $3789);
                var $3786 = $3790;
                break;
            case 'Parser.Reply.value':
                var $3791 = self.idx;
                var $3792 = self.code;
                var self = Kind$Parser$name1$($3791, $3792);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3794 = self.idx;
                        var $3795 = self.code;
                        var $3796 = self.err;
                        var $3797 = Parser$Reply$error$($3794, $3795, $3796);
                        var $3793 = $3797;
                        break;
                    case 'Parser.Reply.value':
                        var $3798 = self.idx;
                        var $3799 = self.code;
                        var $3800 = self.val;
                        var self = Parser$maybe$(Kind$Parser$binder(":"), $3798, $3799);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3802 = self.idx;
                                var $3803 = self.code;
                                var $3804 = self.err;
                                var $3805 = Parser$Reply$error$($3802, $3803, $3804);
                                var $3801 = $3805;
                                break;
                            case 'Parser.Reply.value':
                                var $3806 = self.idx;
                                var $3807 = self.code;
                                var $3808 = self.val;
                                var self = Parser$maybe$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("~", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $3811 = self.idx;
                                            var $3812 = self.code;
                                            var $3813 = self.err;
                                            var $3814 = Parser$Reply$error$($3811, $3812, $3813);
                                            var $3810 = $3814;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $3815 = self.idx;
                                            var $3816 = self.code;
                                            var $3817 = Kind$Parser$binder$(":", $3815, $3816);
                                            var $3810 = $3817;
                                            break;
                                    };
                                    return $3810;
                                }), $3806, $3807);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3818 = self.idx;
                                        var $3819 = self.code;
                                        var $3820 = self.err;
                                        var $3821 = Parser$Reply$error$($3818, $3819, $3820);
                                        var $3809 = $3821;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3822 = self.idx;
                                        var $3823 = self.code;
                                        var $3824 = self.val;
                                        var _pars$15 = Maybe$default$(List$nil, $3808);
                                        var _inds$16 = Maybe$default$(List$nil, $3824);
                                        var self = Kind$Parser$text$("{", $3822, $3823);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3826 = self.idx;
                                                var $3827 = self.code;
                                                var $3828 = self.err;
                                                var $3829 = Parser$Reply$error$($3826, $3827, $3828);
                                                var $3825 = $3829;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3830 = self.idx;
                                                var $3831 = self.code;
                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item(Kind$Parser$constructor($3800)))($3830)($3831);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3833 = self.idx;
                                                        var $3834 = self.code;
                                                        var $3835 = self.err;
                                                        var $3836 = Parser$Reply$error$($3833, $3834, $3835);
                                                        var $3832 = $3836;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3837 = self.idx;
                                                        var $3838 = self.code;
                                                        var $3839 = self.val;
                                                        var $3840 = Parser$Reply$value$($3837, $3838, Kind$Datatype$new$($3800, _pars$15, _inds$16, $3839));
                                                        var $3832 = $3840;
                                                        break;
                                                };
                                                var $3825 = $3832;
                                                break;
                                        };
                                        var $3809 = $3825;
                                        break;
                                };
                                var $3801 = $3809;
                                break;
                        };
                        var $3793 = $3801;
                        break;
                };
                var $3786 = $3793;
                break;
        };
        return $3786;
    };
    const Kind$Parser$datatype = x0 => x1 => Kind$Parser$datatype$(x0, x1);

    function Kind$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.cons':
                var $3842 = self.head;
                var $3843 = self.tail;
                var self = $3842;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3845 = self.eras;
                        var $3846 = self.name;
                        var $3847 = self.term;
                        var $3848 = Kind$Term$all$($3845, "", $3846, $3847, (_s$9 => _x$10 => {
                            var $3849 = Kind$Datatype$build_term$motive$go$(_type$1, _name$2, $3843);
                            return $3849;
                        }));
                        var $3844 = $3848;
                        break;
                };
                var $3841 = $3844;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3851 = self.pars;
                        var $3852 = self.inds;
                        var _slf$8 = Kind$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $3855 = _slf$8;
                            var $3856 = $3851;
                            let _slf$10 = $3855;
                            let _var$9;
                            while ($3856._ === 'List.cons') {
                                _var$9 = $3856.head;
                                var $3855 = Kind$Term$app$(_slf$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3857 = self.name;
                                            var $3858 = $3857;
                                            return $3858;
                                    };
                                })()));
                                _slf$10 = $3855;
                                $3856 = $3856.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $3860 = _slf$9;
                            var $3861 = $3852;
                            let _slf$11 = $3860;
                            let _var$10;
                            while ($3861._ === 'List.cons') {
                                _var$10 = $3861.head;
                                var $3860 = Kind$Term$app$(_slf$11, Kind$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3862 = self.name;
                                            var $3863 = $3862;
                                            return $3863;
                                    };
                                })()));
                                _slf$11 = $3860;
                                $3861 = $3861.tail;
                            }
                            return _slf$11;
                        })();
                        var $3853 = Kind$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $3864 = Kind$Term$typ;
                            return $3864;
                        }));
                        var $3850 = $3853;
                        break;
                };
                var $3841 = $3850;
                break;
        };
        return $3841;
    };
    const Kind$Datatype$build_term$motive$go = x0 => x1 => x2 => Kind$Datatype$build_term$motive$go$(x0, x1, x2);

    function Kind$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3866 = self.name;
                var $3867 = self.inds;
                var $3868 = Kind$Datatype$build_term$motive$go$(_type$1, $3866, $3867);
                var $3865 = $3868;
                break;
        };
        return $3865;
    };
    const Kind$Datatype$build_term$motive = x0 => Kind$Datatype$build_term$motive$(x0);

    function Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.cons':
                var $3870 = self.head;
                var $3871 = self.tail;
                var self = $3870;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3873 = self.eras;
                        var $3874 = self.name;
                        var $3875 = self.term;
                        var _eras$9 = $3873;
                        var _name$10 = $3874;
                        var _xtyp$11 = $3875;
                        var _body$12 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3871);
                        var $3876 = Kind$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $3877 = _body$12;
                            return $3877;
                        }));
                        var $3872 = $3876;
                        break;
                };
                var $3869 = $3872;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3879 = self.name;
                        var $3880 = self.pars;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Kind.Constructor.new':
                                var $3882 = self.name;
                                var $3883 = self.args;
                                var $3884 = self.inds;
                                var _ret$11 = Kind$Term$ref$(Kind$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $3887 = _ret$11;
                                    var $3888 = $3884;
                                    let _ret$13 = $3887;
                                    let _var$12;
                                    while ($3888._ === 'List.cons') {
                                        _var$12 = $3888.head;
                                        var $3887 = Kind$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3889 = self.term;
                                                    var $3890 = $3889;
                                                    return $3890;
                                            };
                                        })());
                                        _ret$13 = $3887;
                                        $3888 = $3888.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($3879, List$cons$(Kind$Name$read$("."), List$cons$($3882, List$nil))));
                                var _slf$14 = Kind$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $3892 = _slf$14;
                                    var $3893 = $3880;
                                    let _slf$16 = $3892;
                                    let _var$15;
                                    while ($3893._ === 'List.cons') {
                                        _var$15 = $3893.head;
                                        var $3892 = Kind$Term$app$(_slf$16, Kind$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3894 = self.name;
                                                    var $3895 = $3894;
                                                    return $3895;
                                            };
                                        })()));
                                        _slf$16 = $3892;
                                        $3893 = $3893.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $3897 = _slf$15;
                                    var $3898 = $3883;
                                    let _slf$17 = $3897;
                                    let _var$16;
                                    while ($3898._ === 'List.cons') {
                                        _var$16 = $3898.head;
                                        var $3897 = Kind$Term$app$(_slf$17, Kind$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3899 = self.name;
                                                    var $3900 = $3899;
                                                    return $3900;
                                            };
                                        })()));
                                        _slf$17 = $3897;
                                        $3898 = $3898.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $3885 = Kind$Term$app$(_ret$12, _slf$16);
                                var $3881 = $3885;
                                break;
                        };
                        var $3878 = $3881;
                        break;
                };
                var $3869 = $3878;
                break;
        };
        return $3869;
    };
    const Kind$Datatype$build_term$constructor$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kind.Constructor.new':
                var $3902 = self.args;
                var $3903 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3902);
                var $3901 = $3903;
                break;
        };
        return $3901;
    };
    const Kind$Datatype$build_term$constructor = x0 => x1 => Kind$Datatype$build_term$constructor$(x0, x1);

    function Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3905 = self.head;
                var $3906 = self.tail;
                var self = $3905;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3908 = self.name;
                        var $3909 = Kind$Term$all$(Bool$false, "", $3908, Kind$Datatype$build_term$constructor$(_type$1, $3905), (_s$9 => _x$10 => {
                            var $3910 = Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, $3906);
                            return $3910;
                        }));
                        var $3907 = $3909;
                        break;
                };
                var $3904 = $3907;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3912 = self.inds;
                        var _ret$8 = Kind$Term$ref$(Kind$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $3915 = _ret$8;
                            var $3916 = $3912;
                            let _ret$10 = $3915;
                            let _var$9;
                            while ($3916._ === 'List.cons') {
                                _var$9 = $3916.head;
                                var $3915 = Kind$Term$app$(_ret$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3917 = self.name;
                                            var $3918 = $3917;
                                            return $3918;
                                    };
                                })()));
                                _ret$10 = $3915;
                                $3916 = $3916.tail;
                            }
                            return _ret$10;
                        })();
                        var $3913 = Kind$Term$app$(_ret$9, Kind$Term$ref$((_name$2 + ".Self")));
                        var $3911 = $3913;
                        break;
                };
                var $3904 = $3911;
                break;
        };
        return $3904;
    };
    const Kind$Datatype$build_term$constructors$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3920 = self.name;
                var $3921 = self.ctrs;
                var $3922 = Kind$Datatype$build_term$constructors$go$(_type$1, $3920, $3921);
                var $3919 = $3922;
                break;
        };
        return $3919;
    };
    const Kind$Datatype$build_term$constructors = x0 => Kind$Datatype$build_term$constructors$(x0);

    function Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3924 = self.head;
                var $3925 = self.tail;
                var self = $3924;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3927 = self.name;
                        var $3928 = Kind$Term$lam$($3927, (_x$10 => {
                            var $3929 = Kind$Datatype$build_term$go$(_type$1, _name$2, $3925, _inds$4);
                            return $3929;
                        }));
                        var $3926 = $3928;
                        break;
                };
                var $3923 = $3926;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3931 = self.head;
                        var $3932 = self.tail;
                        var self = $3931;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3934 = self.name;
                                var $3935 = Kind$Term$lam$($3934, (_x$10 => {
                                    var $3936 = Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $3932);
                                    return $3936;
                                }));
                                var $3933 = $3935;
                                break;
                        };
                        var $3930 = $3933;
                        break;
                    case 'List.nil':
                        var $3937 = Kind$Term$all$(Bool$true, (_name$2 + ".Self"), Kind$Name$read$("P"), Kind$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $3938 = Kind$Datatype$build_term$constructors$(_type$1);
                            return $3938;
                        }));
                        var $3930 = $3937;
                        break;
                };
                var $3923 = $3930;
                break;
        };
        return $3923;
    };
    const Kind$Datatype$build_term$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_term$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3940 = self.name;
                var $3941 = self.pars;
                var $3942 = self.inds;
                var $3943 = Kind$Datatype$build_term$go$(_type$1, $3940, $3941, $3942);
                var $3939 = $3943;
                break;
        };
        return $3939;
    };
    const Kind$Datatype$build_term = x0 => Kind$Datatype$build_term$(x0);

    function Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3945 = self.head;
                var $3946 = self.tail;
                var self = $3945;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3948 = self.name;
                        var $3949 = self.term;
                        var $3950 = Kind$Term$all$(Bool$false, "", $3948, $3949, (_s$10 => _x$11 => {
                            var $3951 = Kind$Datatype$build_type$go$(_type$1, _name$2, $3946, _inds$4);
                            return $3951;
                        }));
                        var $3947 = $3950;
                        break;
                };
                var $3944 = $3947;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3953 = self.head;
                        var $3954 = self.tail;
                        var self = $3953;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3956 = self.name;
                                var $3957 = self.term;
                                var $3958 = Kind$Term$all$(Bool$false, "", $3956, $3957, (_s$10 => _x$11 => {
                                    var $3959 = Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $3954);
                                    return $3959;
                                }));
                                var $3955 = $3958;
                                break;
                        };
                        var $3952 = $3955;
                        break;
                    case 'List.nil':
                        var $3960 = Kind$Term$typ;
                        var $3952 = $3960;
                        break;
                };
                var $3944 = $3952;
                break;
        };
        return $3944;
    };
    const Kind$Datatype$build_type$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_type$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3962 = self.name;
                var $3963 = self.pars;
                var $3964 = self.inds;
                var $3965 = Kind$Datatype$build_type$go$(_type$1, $3962, $3963, $3964);
                var $3961 = $3965;
                break;
        };
        return $3961;
    };
    const Kind$Datatype$build_type = x0 => Kind$Datatype$build_type$(x0);

    function Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3967 = self.head;
                var $3968 = self.tail;
                var self = $3967;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3970 = self.name;
                        var $3971 = Kind$Term$lam$($3970, (_x$9 => {
                            var $3972 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3968);
                            return $3972;
                        }));
                        var $3969 = $3971;
                        break;
                };
                var $3966 = $3969;
                break;
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3974 = self.name;
                        var $3975 = self.args;
                        var _ret$7 = Kind$Term$ref$($3974);
                        var _ret$8 = (() => {
                            var $3978 = _ret$7;
                            var $3979 = $3975;
                            let _ret$9 = $3978;
                            let _arg$8;
                            while ($3979._ === 'List.cons') {
                                _arg$8 = $3979.head;
                                var $3978 = Kind$Term$app$(_ret$9, Kind$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3980 = self.name;
                                            var $3981 = $3980;
                                            return $3981;
                                    };
                                })()));
                                _ret$9 = $3978;
                                $3979 = $3979.tail;
                            }
                            return _ret$9;
                        })();
                        var $3976 = _ret$8;
                        var $3973 = $3976;
                        break;
                };
                var $3966 = $3973;
                break;
        };
        return $3966;
    };
    const Kind$Constructor$build_term$opt$go = x0 => x1 => x2 => Kind$Constructor$build_term$opt$go$(x0, x1, x2);

    function Kind$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3983 = self.ctrs;
                var $3984 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3983);
                var $3982 = $3984;
                break;
        };
        return $3982;
    };
    const Kind$Constructor$build_term$opt = x0 => x1 => Kind$Constructor$build_term$opt$(x0, x1);

    function Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3986 = self.head;
                var $3987 = self.tail;
                var self = $3986;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3989 = self.name;
                        var $3990 = Kind$Term$lam$($3989, (_x$11 => {
                            var $3991 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $3987, _args$5);
                            return $3991;
                        }));
                        var $3988 = $3990;
                        break;
                };
                var $3985 = $3988;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3993 = self.head;
                        var $3994 = self.tail;
                        var self = $3993;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3996 = self.name;
                                var $3997 = Kind$Term$lam$($3996, (_x$11 => {
                                    var $3998 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $3994);
                                    return $3998;
                                }));
                                var $3995 = $3997;
                                break;
                        };
                        var $3992 = $3995;
                        break;
                    case 'List.nil':
                        var $3999 = Kind$Term$lam$(Kind$Name$read$("P"), (_x$6 => {
                            var $4000 = Kind$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $4000;
                        }));
                        var $3992 = $3999;
                        break;
                };
                var $3985 = $3992;
                break;
        };
        return $3985;
    };
    const Kind$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4002 = self.name;
                var $4003 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4005 = self.args;
                        var $4006 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, $4002, $4003, $4005);
                        var $4004 = $4006;
                        break;
                };
                var $4001 = $4004;
                break;
        };
        return $4001;
    };
    const Kind$Constructor$build_term = x0 => x1 => Kind$Constructor$build_term$(x0, x1);

    function Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $4008 = self.head;
                var $4009 = self.tail;
                var self = $4008;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $4011 = self.eras;
                        var $4012 = self.name;
                        var $4013 = self.term;
                        var $4014 = Kind$Term$all$($4011, "", $4012, $4013, (_s$11 => _x$12 => {
                            var $4015 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $4009, _args$5);
                            return $4015;
                        }));
                        var $4010 = $4014;
                        break;
                };
                var $4007 = $4010;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $4017 = self.head;
                        var $4018 = self.tail;
                        var self = $4017;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $4020 = self.eras;
                                var $4021 = self.name;
                                var $4022 = self.term;
                                var $4023 = Kind$Term$all$($4020, "", $4021, $4022, (_s$11 => _x$12 => {
                                    var $4024 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $4018);
                                    return $4024;
                                }));
                                var $4019 = $4023;
                                break;
                        };
                        var $4016 = $4019;
                        break;
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Kind.Datatype.new':
                                var $4026 = self.pars;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Kind.Constructor.new':
                                        var $4028 = self.inds;
                                        var _type$13 = Kind$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $4031 = _type$13;
                                            var $4032 = $4026;
                                            let _type$15 = $4031;
                                            let _var$14;
                                            while ($4032._ === 'List.cons') {
                                                _var$14 = $4032.head;
                                                var $4031 = Kind$Term$app$(_type$15, Kind$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4033 = self.name;
                                                            var $4034 = $4033;
                                                            return $4034;
                                                    };
                                                })()));
                                                _type$15 = $4031;
                                                $4032 = $4032.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $4036 = _type$14;
                                            var $4037 = $4028;
                                            let _type$16 = $4036;
                                            let _var$15;
                                            while ($4037._ === 'List.cons') {
                                                _var$15 = $4037.head;
                                                var $4036 = Kind$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4038 = self.term;
                                                            var $4039 = $4038;
                                                            return $4039;
                                                    };
                                                })());
                                                _type$16 = $4036;
                                                $4037 = $4037.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $4029 = _type$15;
                                        var $4027 = $4029;
                                        break;
                                };
                                var $4025 = $4027;
                                break;
                        };
                        var $4016 = $4025;
                        break;
                };
                var $4007 = $4016;
                break;
        };
        return $4007;
    };
    const Kind$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4041 = self.name;
                var $4042 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4044 = self.args;
                        var $4045 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, $4041, $4042, $4044);
                        var $4043 = $4045;
                        break;
                };
                var $4040 = $4043;
                break;
        };
        return $4040;
    };
    const Kind$Constructor$build_type = x0 => x1 => Kind$Constructor$build_type$(x0, x1);

    function Kind$Parser$file$adt$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4047 = self.idx;
                var $4048 = self.code;
                var $4049 = self.err;
                var $4050 = Parser$Reply$error$($4047, $4048, $4049);
                var $4046 = $4050;
                break;
            case 'Parser.Reply.value':
                var $4051 = self.idx;
                var $4052 = self.code;
                var $4053 = self.val;
                var self = Kind$Parser$datatype$($4051, $4052);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4055 = self.idx;
                        var $4056 = self.code;
                        var $4057 = self.err;
                        var $4058 = Parser$Reply$error$($4055, $4056, $4057);
                        var $4054 = $4058;
                        break;
                    case 'Parser.Reply.value':
                        var $4059 = self.idx;
                        var $4060 = self.code;
                        var $4061 = self.val;
                        var self = Kind$Parser$stop$($4053, $4059, $4060);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $4063 = self.idx;
                                var $4064 = self.code;
                                var $4065 = self.err;
                                var $4066 = Parser$Reply$error$($4063, $4064, $4065);
                                var $4062 = $4066;
                                break;
                            case 'Parser.Reply.value':
                                var $4067 = self.idx;
                                var $4068 = self.code;
                                var $4069 = self.val;
                                var self = $4061;
                                switch (self._) {
                                    case 'Kind.Datatype.new':
                                        var $4071 = self.name;
                                        var $4072 = self.pars;
                                        var $4073 = self.inds;
                                        var $4074 = self.ctrs;
                                        var _term$19 = Kind$Datatype$build_term$($4061);
                                        var _term$20 = Kind$Term$bind$(List$nil, (_x$20 => {
                                            var $4076 = (_x$20 + '1');
                                            return $4076;
                                        }), _term$19);
                                        var _type$21 = Kind$Datatype$build_type$($4061);
                                        var _type$22 = Kind$Term$bind$(List$nil, (_x$22 => {
                                            var $4077 = (_x$22 + '0');
                                            return $4077;
                                        }), _type$21);
                                        var _arit$23 = ((list_length($4072)) + (list_length($4073)));
                                        var _defs$24 = Kind$define$(_file$1, _code$2, $4069, $4071, _term$20, _type$22, Bool$false, _arit$23, Bool$false, _defs$3);
                                        var _defs$25 = List$fold$($4074, _defs$24, (_ctr$25 => _defs$26 => {
                                            var _typ_name$27 = $4071;
                                            var _ctr_arit$28 = (_arit$23 + (list_length((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4079 = self.args;
                                                        var $4080 = $4079;
                                                        return $4080;
                                                };
                                            })())));
                                            var _ctr_name$29 = String$flatten$(List$cons$(_typ_name$27, List$cons$(Kind$Name$read$("."), List$cons$((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4081 = self.name;
                                                        var $4082 = $4081;
                                                        return $4082;
                                                };
                                            })(), List$nil))));
                                            var _ctr_term$30 = Kind$Constructor$build_term$($4061, _ctr$25);
                                            var _ctr_term$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                var $4083 = (_x$31 + '1');
                                                return $4083;
                                            }), _ctr_term$30);
                                            var _ctr_type$32 = Kind$Constructor$build_type$($4061, _ctr$25);
                                            var _ctr_type$33 = Kind$Term$bind$(List$nil, (_x$33 => {
                                                var $4084 = (_x$33 + '0');
                                                return $4084;
                                            }), _ctr_type$32);
                                            var $4078 = Kind$define$(_file$1, _code$2, $4069, _ctr_name$29, _ctr_term$31, _ctr_type$33, Bool$true, _ctr_arit$28, Bool$false, _defs$26);
                                            return $4078;
                                        }));
                                        var $4075 = (_idx$26 => _code$27 => {
                                            var $4085 = Parser$Reply$value$(_idx$26, _code$27, _defs$25);
                                            return $4085;
                                        });
                                        var $4070 = $4075;
                                        break;
                                };
                                var $4070 = $4070($4067)($4068);
                                var $4062 = $4070;
                                break;
                        };
                        var $4054 = $4062;
                        break;
                };
                var $4046 = $4054;
                break;
        };
        return $4046;
    };
    const Kind$Parser$file$adt = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$adt$(x0, x1, x2, x3, x4);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $4087 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $4086 = $4087;
        } else {
            var $4088 = self.charCodeAt(0);
            var $4089 = self.slice(1);
            var $4090 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $4086 = $4090;
        };
        return $4086;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Kind$Parser$file$end$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$spaces(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4092 = self.idx;
                var $4093 = self.code;
                var $4094 = self.err;
                var $4095 = Parser$Reply$error$($4092, $4093, $4094);
                var $4091 = $4095;
                break;
            case 'Parser.Reply.value':
                var $4096 = self.idx;
                var $4097 = self.code;
                var self = Parser$eof$($4096, $4097);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4099 = self.idx;
                        var $4100 = self.code;
                        var $4101 = self.err;
                        var $4102 = Parser$Reply$error$($4099, $4100, $4101);
                        var $4098 = $4102;
                        break;
                    case 'Parser.Reply.value':
                        var $4103 = self.idx;
                        var $4104 = self.code;
                        var $4105 = Parser$Reply$value$($4103, $4104, _defs$3);
                        var $4098 = $4105;
                        break;
                };
                var $4091 = $4098;
                break;
        };
        return $4091;
    };
    const Kind$Parser$file$end = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$end$(x0, x1, x2, x3, x4);

    function Kind$Parser$file$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Parser$is_eof$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4107 = self.idx;
                var $4108 = self.code;
                var $4109 = self.err;
                var $4110 = Parser$Reply$error$($4107, $4108, $4109);
                var $4106 = $4110;
                break;
            case 'Parser.Reply.value':
                var $4111 = self.idx;
                var $4112 = self.code;
                var $4113 = self.val;
                var self = $4113;
                if (self) {
                    var $4115 = (_idx$9 => _code$10 => {
                        var $4116 = Parser$Reply$value$(_idx$9, _code$10, _defs$3);
                        return $4116;
                    });
                    var $4114 = $4115;
                } else {
                    var $4117 = (_idx$9 => _code$10 => {
                        var self = Parser$first_of$(List$cons$(Kind$Parser$file$def(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$adt(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$end(_file$1)(_code$2)(_defs$3), List$nil))))(_idx$9)(_code$10);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $4119 = self.idx;
                                var $4120 = self.code;
                                var $4121 = self.err;
                                var $4122 = Parser$Reply$error$($4119, $4120, $4121);
                                var $4118 = $4122;
                                break;
                            case 'Parser.Reply.value':
                                var $4123 = self.idx;
                                var $4124 = self.code;
                                var $4125 = self.val;
                                var $4126 = Kind$Parser$file$(_file$1, _code$2, $4125, $4123, $4124);
                                var $4118 = $4126;
                                break;
                        };
                        return $4118;
                    });
                    var $4114 = $4117;
                };
                var $4114 = $4114($4111)($4112);
                var $4106 = $4114;
                break;
        };
        return $4106;
    };
    const Kind$Parser$file = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$(x0, x1, x2, x3, x4);

    function Either$(_A$1, _B$2) {
        var $4127 = null;
        return $4127;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $4129 = self.head;
                var $4130 = self.tail;
                var $4131 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $4132 = "";
                        return $4132;
                    } else {
                        var $4133 = _sep$1;
                        return $4133;
                    };
                })(), List$cons$($4129, List$cons$(String$join$go$(_sep$1, $4130, Bool$false), List$nil))));
                var $4128 = $4131;
                break;
            case 'List.nil':
                var $4134 = "";
                var $4128 = $4134;
                break;
        };
        return $4128;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $4135 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $4135;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$highlight$end$(_col$1, _row$2, _res$3) {
        var $4136 = String$join$("\u{a}", _res$3);
        return $4136;
    };
    const Kind$highlight$end = x0 => x1 => x2 => Kind$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4138 = self.value;
                var $4139 = _f$5($4138);
                var $4137 = $4139;
                break;
            case 'Maybe.none':
                var $4140 = _a$4;
                var $4137 = $4140;
                break;
        };
        return $4137;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4142 = Bool$true;
            var $4141 = $4142;
        } else {
            var $4143 = (self - 1n);
            var $4144 = Bool$false;
            var $4141 = $4144;
        };
        return $4141;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4146 = Nat$zero;
            var $4145 = $4146;
        } else {
            var $4147 = (self - 1n);
            var $4148 = Nat$succ$(Nat$succ$(Nat$double$($4147)));
            var $4145 = $4148;
        };
        return $4145;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4150 = Nat$zero;
            var $4149 = $4150;
        } else {
            var $4151 = (self - 1n);
            var $4152 = $4151;
            var $4149 = $4152;
        };
        return $4149;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $4154 = _str$3;
            var $4153 = $4154;
        } else {
            var $4155 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $4157 = String$cons$(_chr$2, String$pad_right$($4155, _chr$2, ""));
                var $4156 = $4157;
            } else {
                var $4158 = self.charCodeAt(0);
                var $4159 = self.slice(1);
                var $4160 = String$cons$($4158, String$pad_right$($4155, _chr$2, $4159));
                var $4156 = $4160;
            };
            var $4153 = $4156;
        };
        return $4153;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $4161 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $4161;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $4162 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $4162;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $4163 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $4163;
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
                    var $4164 = Either$left$(_n$1);
                    return $4164;
                } else {
                    var $4165 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4167 = Either$right$(Nat$succ$($4165));
                        var $4166 = $4167;
                    } else {
                        var $4168 = (self - 1n);
                        var $4169 = Nat$sub_rem$($4168, $4165);
                        var $4166 = $4169;
                    };
                    return $4166;
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
                        var $4170 = self.value;
                        var $4171 = Nat$div_mod$go$($4170, _m$2, Nat$succ$(_d$3));
                        return $4171;
                    case 'Either.right':
                        var $4172 = Pair$new$(_d$3, _n$1);
                        return $4172;
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
                        var $4173 = self.fst;
                        var $4174 = self.snd;
                        var self = $4173;
                        if (self === 0n) {
                            var $4176 = List$cons$($4174, _res$3);
                            var $4175 = $4176;
                        } else {
                            var $4177 = (self - 1n);
                            var $4178 = Nat$to_base$go$(_base$1, $4173, List$cons$($4174, _res$3));
                            var $4175 = $4178;
                        };
                        return $4175;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $4179 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $4179;
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
                    var $4180 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $4180;
                } else {
                    var $4181 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4183 = _r$3;
                        var $4182 = $4183;
                    } else {
                        var $4184 = (self - 1n);
                        var $4185 = Nat$mod$go$($4184, $4181, Nat$succ$(_r$3));
                        var $4182 = $4185;
                    };
                    return $4182;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $4186 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $4186;
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
                    var $4189 = self.value;
                    var $4190 = $4189;
                    var $4188 = $4190;
                    break;
                case 'Maybe.none':
                    var $4191 = 35;
                    var $4188 = $4191;
                    break;
            };
            var $4187 = $4188;
        } else {
            var $4192 = 35;
            var $4187 = $4192;
        };
        return $4187;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $4193 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $4194 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $4194;
        }));
        return $4193;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $4195 = Nat$to_string_base$(10n, _n$1);
        return $4195;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Kind$color$(_col$1, _str$2) {
        var $4196 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $4196;
    };
    const Kind$color = x0 => x1 => Kind$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $4198 = self.head;
                var $4199 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $4201 = List$nil;
                    var $4200 = $4201;
                } else {
                    var $4202 = (self - 1n);
                    var $4203 = List$cons$($4198, List$take$($4202, $4199));
                    var $4200 = $4203;
                };
                var $4197 = $4200;
                break;
            case 'List.nil':
                var $4204 = List$nil;
                var $4197 = $4204;
                break;
        };
        return $4197;
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
                    var $4206 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    var $4205 = $4206;
                } else {
                    var $4207 = self.charCodeAt(0);
                    var $4208 = self.slice(1);
                    var self = ($4207 === 10);
                    if (self) {
                        var _stp$12 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$12;
                        if (self) {
                            var $4211 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $4210 = $4211;
                        } else {
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$9));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4214 = self.value;
                                        var $4215 = Maybe$some$(Nat$pred$($4214));
                                        var $4213 = $4215;
                                        break;
                                    case 'Maybe.none':
                                        var $4216 = Maybe$some$(_spa$9);
                                        var $4213 = $4216;
                                        break;
                                };
                                var _lft$14 = $4213;
                            } else {
                                var $4217 = (self - 1n);
                                var $4218 = _lft$6;
                                var _lft$14 = $4218;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$cons$(String$reverse$(_lin$7), _res$8);
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $4212 = Kind$highlight$tc$($4208, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $4210 = $4212;
                        };
                        var $4209 = $4210;
                    } else {
                        var _chr$12 = String$cons$($4207, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $4220 = String$reverse$(Kind$color$("31", Kind$color$("4", _chr$12)));
                            var _chr$13 = $4220;
                        } else {
                            var $4221 = _chr$12;
                            var _chr$13 = $4221;
                        };
                        var self = (_ix0$2 === 1n);
                        if (self) {
                            var $4222 = List$take$(_spa$9, _res$8);
                            var _res$14 = $4222;
                        } else {
                            var $4223 = _res$8;
                            var _res$14 = $4223;
                        };
                        var _ix0$15 = Nat$pred$(_ix0$2);
                        var _ix1$16 = Nat$pred$(_ix1$3);
                        var _col$17 = Nat$succ$(_col$4);
                        var _lin$18 = String$flatten$(List$cons$(_chr$13, List$cons$(_lin$7, List$nil)));
                        var $4219 = Kind$highlight$tc$($4208, _ix0$15, _ix1$16, _col$17, _row$5, _lft$6, _lin$18, _res$14);
                        var $4209 = $4219;
                    };
                    var $4205 = $4209;
                };
                return $4205;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $4224 = Kind$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $4224;
    };
    const Kind$highlight = x0 => x1 => x2 => Kind$highlight$(x0, x1, x2);

    function Kind$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Kind$Parser$file$(_file$1, _code$2, _defs$3, 0n, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4226 = self.idx;
                var $4227 = self.err;
                var _err$7 = $4227;
                var _hig$8 = Kind$highlight$(_code$2, $4226, Nat$succ$($4226));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $4228 = Either$left$(_str$9);
                var $4225 = $4228;
                break;
            case 'Parser.Reply.value':
                var $4229 = self.val;
                var $4230 = Either$right$($4229);
                var $4225 = $4230;
                break;
        };
        return $4225;
    };
    const Kind$Defs$read = x0 => x1 => x2 => Kind$Defs$read$(x0, x1, x2);

    function Kind$Synth$load$go$(_name$1, _files$2, _defs$3) {
        var self = _files$2;
        switch (self._) {
            case 'List.cons':
                var $4232 = self.head;
                var $4233 = self.tail;
                var $4234 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $4235 = _m$bind$6;
                    return $4235;
                }))(IO$get_file$($4232))((_code$6 => {
                    var _read$7 = Kind$Defs$read$($4232, _code$6, _defs$3);
                    var self = _read$7;
                    switch (self._) {
                        case 'Either.right':
                            var $4237 = self.value;
                            var _defs$9 = $4237;
                            var self = Kind$get$(_name$1, _defs$9);
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4239 = Kind$Synth$load$go$(_name$1, $4233, _defs$9);
                                    var $4238 = $4239;
                                    break;
                                case 'Maybe.some':
                                    var $4240 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                        var $4241 = _m$pure$12;
                                        return $4241;
                                    }))(Maybe$some$(_defs$9));
                                    var $4238 = $4240;
                                    break;
                            };
                            var $4236 = $4238;
                            break;
                        case 'Either.left':
                            var $4242 = Kind$Synth$load$go$(_name$1, $4233, _defs$3);
                            var $4236 = $4242;
                            break;
                    };
                    return $4236;
                }));
                var $4231 = $4234;
                break;
            case 'List.nil':
                var $4243 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4244 = _m$pure$5;
                    return $4244;
                }))(Maybe$none);
                var $4231 = $4243;
                break;
        };
        return $4231;
    };
    const Kind$Synth$load$go = x0 => x1 => x2 => Kind$Synth$load$go$(x0, x1, x2);

    function Kind$Synth$files_of$make$(_names$1, _last$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $4246 = self.head;
                var $4247 = self.tail;
                var _head$5 = (_last$2 + ($4246 + ".kind"));
                var _tail$6 = Kind$Synth$files_of$make$($4247, (_last$2 + ($4246 + "/")));
                var $4248 = List$cons$(_head$5, _tail$6);
                var $4245 = $4248;
                break;
            case 'List.nil':
                var $4249 = List$nil;
                var $4245 = $4249;
                break;
        };
        return $4245;
    };
    const Kind$Synth$files_of$make = x0 => x1 => Kind$Synth$files_of$make$(x0, x1);

    function Char$eql$(_a$1, _b$2) {
        var $4250 = (_a$1 === _b$2);
        return $4250;
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
                    var $4251 = Bool$true;
                    return $4251;
                } else {
                    var $4252 = self.charCodeAt(0);
                    var $4253 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $4255 = Bool$false;
                        var $4254 = $4255;
                    } else {
                        var $4256 = self.charCodeAt(0);
                        var $4257 = self.slice(1);
                        var self = Char$eql$($4252, $4256);
                        if (self) {
                            var $4259 = String$starts_with$($4257, $4253);
                            var $4258 = $4259;
                        } else {
                            var $4260 = Bool$false;
                            var $4258 = $4260;
                        };
                        var $4254 = $4258;
                    };
                    return $4254;
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
                    var $4261 = _xs$2;
                    return $4261;
                } else {
                    var $4262 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $4264 = String$nil;
                        var $4263 = $4264;
                    } else {
                        var $4265 = self.charCodeAt(0);
                        var $4266 = self.slice(1);
                        var $4267 = String$drop$($4262, $4266);
                        var $4263 = $4267;
                    };
                    return $4263;
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
                    var $4268 = _n$2;
                    return $4268;
                } else {
                    var $4269 = self.charCodeAt(0);
                    var $4270 = self.slice(1);
                    var $4271 = String$length$go$($4270, Nat$succ$(_n$2));
                    return $4271;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $4272 = String$length$go$(_xs$1, 0n);
        return $4272;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $4274 = List$cons$(_last$3, List$nil);
            var $4273 = $4274;
        } else {
            var $4275 = self.charCodeAt(0);
            var $4276 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $4278 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $4277 = $4278;
            } else {
                var _next$6 = String$cons$($4275, String$nil);
                var $4279 = String$split$go$($4276, _match$2, (_last$3 + _next$6));
                var $4277 = $4279;
            };
            var $4273 = $4277;
        };
        return $4273;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $4280 = String$split$go$(_xs$1, _match$2, "");
        return $4280;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Kind$Synth$files_of$(_name$1) {
        var $4281 = List$reverse$(Kind$Synth$files_of$make$(String$split$(_name$1, "."), ""));
        return $4281;
    };
    const Kind$Synth$files_of = x0 => Kind$Synth$files_of$(x0);

    function Kind$Synth$load$(_name$1, _defs$2) {
        var $4282 = Kind$Synth$load$go$(_name$1, Kind$Synth$files_of$(_name$1), _defs$2);
        return $4282;
    };
    const Kind$Synth$load = x0 => x1 => Kind$Synth$load$(x0, x1);
    const Kind$Status$wait = ({
        _: 'Kind.Status.wait'
    });

    function Kind$Check$(_V$1) {
        var $4283 = null;
        return $4283;
    };
    const Kind$Check = x0 => Kind$Check$(x0);

    function Kind$Check$result$(_value$2, _errors$3) {
        var $4284 = ({
            _: 'Kind.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $4284;
    };
    const Kind$Check$result = x0 => x1 => Kind$Check$result$(x0, x1);

    function Kind$Error$undefined_reference$(_origin$1, _name$2) {
        var $4285 = ({
            _: 'Kind.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $4285;
    };
    const Kind$Error$undefined_reference = x0 => x1 => Kind$Error$undefined_reference$(x0, x1);

    function Kind$Error$waiting$(_name$1) {
        var $4286 = ({
            _: 'Kind.Error.waiting',
            'name': _name$1
        });
        return $4286;
    };
    const Kind$Error$waiting = x0 => Kind$Error$waiting$(x0);

    function Kind$Error$indirect$(_name$1) {
        var $4287 = ({
            _: 'Kind.Error.indirect',
            'name': _name$1
        });
        return $4287;
    };
    const Kind$Error$indirect = x0 => Kind$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4289 = self.value;
                var $4290 = Maybe$some$(_f$4($4289));
                var $4288 = $4290;
                break;
            case 'Maybe.none':
                var $4291 = Maybe$none;
                var $4288 = $4291;
                break;
        };
        return $4288;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Kind$MPath$o$(_path$1) {
        var $4292 = Maybe$mapped$(_path$1, Kind$Path$o);
        return $4292;
    };
    const Kind$MPath$o = x0 => Kind$MPath$o$(x0);

    function Kind$MPath$i$(_path$1) {
        var $4293 = Maybe$mapped$(_path$1, Kind$Path$i);
        return $4293;
    };
    const Kind$MPath$i = x0 => Kind$MPath$i$(x0);

    function Kind$Error$patch$(_path$1, _term$2) {
        var $4294 = ({
            _: 'Kind.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $4294;
    };
    const Kind$Error$patch = x0 => x1 => Kind$Error$patch$(x0, x1);

    function Kind$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.some':
                var $4296 = self.value;
                var $4297 = $4296(Bits$e);
                var $4295 = $4297;
                break;
            case 'Maybe.none':
                var $4298 = Bits$e;
                var $4295 = $4298;
                break;
        };
        return $4295;
    };
    const Kind$MPath$to_bits = x0 => Kind$MPath$to_bits$(x0);

    function Kind$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $4299 = ({
            _: 'Kind.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $4299;
    };
    const Kind$Error$type_mismatch = x0 => x1 => x2 => x3 => Kind$Error$type_mismatch$(x0, x1, x2, x3);

    function Kind$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $4300 = ({
            _: 'Kind.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $4300;
    };
    const Kind$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Kind$Error$show_goal$(x0, x1, x2, x3, x4);

    function Kind$Term$normalize$(_term$1, _defs$2) {
        var self = Kind$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $4302 = self.name;
                var $4303 = self.indx;
                var $4304 = Kind$Term$var$($4302, $4303);
                var $4301 = $4304;
                break;
            case 'Kind.Term.ref':
                var $4305 = self.name;
                var $4306 = Kind$Term$ref$($4305);
                var $4301 = $4306;
                break;
            case 'Kind.Term.all':
                var $4307 = self.eras;
                var $4308 = self.self;
                var $4309 = self.name;
                var $4310 = self.xtyp;
                var $4311 = self.body;
                var $4312 = Kind$Term$all$($4307, $4308, $4309, Kind$Term$normalize$($4310, _defs$2), (_s$8 => _x$9 => {
                    var $4313 = Kind$Term$normalize$($4311(_s$8)(_x$9), _defs$2);
                    return $4313;
                }));
                var $4301 = $4312;
                break;
            case 'Kind.Term.lam':
                var $4314 = self.name;
                var $4315 = self.body;
                var $4316 = Kind$Term$lam$($4314, (_x$5 => {
                    var $4317 = Kind$Term$normalize$($4315(_x$5), _defs$2);
                    return $4317;
                }));
                var $4301 = $4316;
                break;
            case 'Kind.Term.app':
                var $4318 = self.func;
                var $4319 = self.argm;
                var $4320 = Kind$Term$app$(Kind$Term$normalize$($4318, _defs$2), Kind$Term$normalize$($4319, _defs$2));
                var $4301 = $4320;
                break;
            case 'Kind.Term.let':
                var $4321 = self.name;
                var $4322 = self.expr;
                var $4323 = self.body;
                var $4324 = Kind$Term$let$($4321, Kind$Term$normalize$($4322, _defs$2), (_x$6 => {
                    var $4325 = Kind$Term$normalize$($4323(_x$6), _defs$2);
                    return $4325;
                }));
                var $4301 = $4324;
                break;
            case 'Kind.Term.def':
                var $4326 = self.name;
                var $4327 = self.expr;
                var $4328 = self.body;
                var $4329 = Kind$Term$def$($4326, Kind$Term$normalize$($4327, _defs$2), (_x$6 => {
                    var $4330 = Kind$Term$normalize$($4328(_x$6), _defs$2);
                    return $4330;
                }));
                var $4301 = $4329;
                break;
            case 'Kind.Term.ann':
                var $4331 = self.done;
                var $4332 = self.term;
                var $4333 = self.type;
                var $4334 = Kind$Term$ann$($4331, Kind$Term$normalize$($4332, _defs$2), Kind$Term$normalize$($4333, _defs$2));
                var $4301 = $4334;
                break;
            case 'Kind.Term.gol':
                var $4335 = self.name;
                var $4336 = self.dref;
                var $4337 = self.verb;
                var $4338 = Kind$Term$gol$($4335, $4336, $4337);
                var $4301 = $4338;
                break;
            case 'Kind.Term.hol':
                var $4339 = self.path;
                var $4340 = Kind$Term$hol$($4339);
                var $4301 = $4340;
                break;
            case 'Kind.Term.nat':
                var $4341 = self.natx;
                var $4342 = Kind$Term$nat$($4341);
                var $4301 = $4342;
                break;
            case 'Kind.Term.chr':
                var $4343 = self.chrx;
                var $4344 = Kind$Term$chr$($4343);
                var $4301 = $4344;
                break;
            case 'Kind.Term.str':
                var $4345 = self.strx;
                var $4346 = Kind$Term$str$($4345);
                var $4301 = $4346;
                break;
            case 'Kind.Term.ori':
                var $4347 = self.expr;
                var $4348 = Kind$Term$normalize$($4347, _defs$2);
                var $4301 = $4348;
                break;
            case 'Kind.Term.typ':
                var $4349 = Kind$Term$typ;
                var $4301 = $4349;
                break;
            case 'Kind.Term.cse':
                var $4350 = _term$1;
                var $4301 = $4350;
                break;
        };
        return $4301;
    };
    const Kind$Term$normalize = x0 => x1 => Kind$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $4352 = self.tail;
                var $4353 = $4352;
                var $4351 = $4353;
                break;
            case 'List.nil':
                var $4354 = List$nil;
                var $4351 = $4354;
                break;
        };
        return $4351;
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
                        var $4355 = self.func;
                        var $4356 = self.argm;
                        var $4357 = Kind$SmartMotive$vals$cont$(_expr$1, $4355, List$cons$($4356, _args$3), _defs$4);
                        return $4357;
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
                        var $4358 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $4358;
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
                        var $4359 = self.body;
                        var $4360 = Kind$SmartMotive$vals$(_expr$1, $4359(Kind$Term$typ)(Kind$Term$typ), _defs$3);
                        return $4360;
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
                        var $4361 = Kind$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $4361;
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
                        var $4362 = self.self;
                        var $4363 = self.name;
                        var $4364 = self.body;
                        var $4365 = Kind$SmartMotive$nams$cont$(_name$1, $4364(Kind$Term$ref$($4362))(Kind$Term$ref$($4363)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4363, List$nil)))), _binds$3), _defs$4);
                        return $4365;
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
                        var $4366 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $4366;
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
                var $4368 = self.xtyp;
                var $4369 = Kind$SmartMotive$nams$cont$(_name$1, $4368, List$nil, _defs$3);
                var $4367 = $4369;
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
                var $4370 = List$nil;
                var $4367 = $4370;
                break;
        };
        return $4367;
    };
    const Kind$SmartMotive$nams = x0 => x1 => x2 => Kind$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $4372 = self.head;
                var $4373 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $4375 = self.head;
                        var $4376 = self.tail;
                        var $4377 = List$cons$(Pair$new$($4372, $4375), List$zip$($4373, $4376));
                        var $4374 = $4377;
                        break;
                    case 'List.nil':
                        var $4378 = List$nil;
                        var $4374 = $4378;
                        break;
                };
                var $4371 = $4374;
                break;
            case 'List.nil':
                var $4379 = List$nil;
                var $4371 = $4379;
                break;
        };
        return $4371;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Kind$Term$serialize$name$(_name$1) {
        var $4380 = (kind_name_to_bits(_name$1));
        return $4380;
    };
    const Kind$Term$serialize$name = x0 => Kind$Term$serialize$name$(x0);

    function Kind$Term$serialize$(_term$1, _depth$2, _init$3, _diff$4, _x$5) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4382 = self.indx;
                var self = ($4382 >= _init$3);
                if (self) {
                    var _name$8 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $4382 <= 0n ? 0n : _depth$2 - $4382)))));
                    var $4384 = (((_name$8(_x$5) + '1') + '0') + '0');
                    var $4383 = $4384;
                } else {
                    var _name$8 = a1 => (a1 + (nat_to_bits($4382)));
                    var $4385 = (((_name$8(_x$5) + '0') + '1') + '0');
                    var $4383 = $4385;
                };
                var $4381 = $4383;
                break;
            case 'Kind.Term.ref':
                var $4386 = self.name;
                var _name$7 = a1 => (a1 + Kind$Term$serialize$name$($4386));
                var $4387 = (((_name$7(_x$5) + '0') + '0') + '0');
                var $4381 = $4387;
                break;
            case 'Kind.Term.all':
                var $4388 = self.eras;
                var $4389 = self.self;
                var $4390 = self.name;
                var $4391 = self.xtyp;
                var $4392 = self.body;
                var self = $4388;
                if (self) {
                    var $4394 = Bits$i;
                    var _eras$11 = $4394;
                } else {
                    var $4395 = Bits$o;
                    var _eras$11 = $4395;
                };
                var _self$12 = a1 => (a1 + (kind_name_to_bits($4389)));
                var _xtyp$13 = Kind$Term$serialize($4391)(_depth$2)(_init$3)(_diff$4);
                var _body$14 = Kind$Term$serialize($4392(Kind$Term$var$($4389, _depth$2))(Kind$Term$var$($4390, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3)(_diff$4);
                var $4393 = (((_eras$11(_self$12(_xtyp$13(_body$14(_x$5)))) + '0') + '0') + '1');
                var $4381 = $4393;
                break;
            case 'Kind.Term.lam':
                var $4396 = self.name;
                var $4397 = self.body;
                var _body$8 = Kind$Term$serialize($4397(Kind$Term$var$($4396, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4398 = (((_body$8(_x$5) + '1') + '0') + '1');
                var $4381 = $4398;
                break;
            case 'Kind.Term.app':
                var $4399 = self.func;
                var $4400 = self.argm;
                var _func$8 = Kind$Term$serialize($4399)(_depth$2)(_init$3)(_diff$4);
                var _argm$9 = Kind$Term$serialize($4400)(_depth$2)(_init$3)(_diff$4);
                var $4401 = (((_func$8(_argm$9(_x$5)) + '0') + '1') + '1');
                var $4381 = $4401;
                break;
            case 'Kind.Term.let':
                var $4402 = self.name;
                var $4403 = self.expr;
                var $4404 = self.body;
                var _expr$9 = Kind$Term$serialize($4403)(_depth$2)(_init$3)(_diff$4);
                var _body$10 = Kind$Term$serialize($4404(Kind$Term$var$($4402, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4405 = (((_expr$9(_body$10(_x$5)) + '1') + '1') + '1');
                var $4381 = $4405;
                break;
            case 'Kind.Term.def':
                var $4406 = self.expr;
                var $4407 = self.body;
                var $4408 = Kind$Term$serialize$($4407($4406), _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4408;
                break;
            case 'Kind.Term.ann':
                var $4409 = self.term;
                var $4410 = Kind$Term$serialize$($4409, _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4410;
                break;
            case 'Kind.Term.gol':
                var $4411 = self.name;
                var _name$9 = a1 => (a1 + (kind_name_to_bits($4411)));
                var $4412 = (((_name$9(_x$5) + '0') + '0') + '0');
                var $4381 = $4412;
                break;
            case 'Kind.Term.nat':
                var $4413 = self.natx;
                var $4414 = Kind$Term$serialize$(Kind$Term$unroll_nat$($4413), _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4414;
                break;
            case 'Kind.Term.chr':
                var $4415 = self.chrx;
                var $4416 = Kind$Term$serialize$(Kind$Term$unroll_chr$($4415), _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4416;
                break;
            case 'Kind.Term.str':
                var $4417 = self.strx;
                var $4418 = Kind$Term$serialize$(Kind$Term$unroll_str$($4417), _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4418;
                break;
            case 'Kind.Term.ori':
                var $4419 = self.expr;
                var $4420 = Kind$Term$serialize$($4419, _depth$2, _init$3, _diff$4, _x$5);
                var $4381 = $4420;
                break;
            case 'Kind.Term.typ':
                var $4421 = (((_x$5 + '1') + '1') + '0');
                var $4381 = $4421;
                break;
            case 'Kind.Term.hol':
                var $4422 = _x$5;
                var $4381 = $4422;
                break;
            case 'Kind.Term.cse':
                var $4423 = _diff$4(_x$5);
                var $4381 = $4423;
                break;
        };
        return $4381;
    };
    const Kind$Term$serialize = x0 => x1 => x2 => x3 => x4 => Kind$Term$serialize$(x0, x1, x2, x3, x4);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kind$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Kind$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$o, Bits$e);
        var _bh$5 = Kind$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$i, Bits$e);
        var $4424 = (_bh$5 === _ah$4);
        return $4424;
    };
    const Kind$Term$identical = x0 => x1 => x2 => Kind$Term$identical$(x0, x1, x2);

    function Kind$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Kind$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $4426 = _to$3;
            var $4425 = $4426;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Kind.Term.var':
                    var $4428 = self.name;
                    var $4429 = self.indx;
                    var $4430 = Kind$Term$var$($4428, $4429);
                    var $4427 = $4430;
                    break;
                case 'Kind.Term.ref':
                    var $4431 = self.name;
                    var $4432 = Kind$Term$ref$($4431);
                    var $4427 = $4432;
                    break;
                case 'Kind.Term.all':
                    var $4433 = self.eras;
                    var $4434 = self.self;
                    var $4435 = self.name;
                    var $4436 = self.xtyp;
                    var $4437 = self.body;
                    var _xtyp$10 = Kind$SmartMotive$replace$($4436, _from$2, _to$3, _lv$4);
                    var _body$11 = $4437(Kind$Term$ref$($4434))(Kind$Term$ref$($4435));
                    var _body$12 = Kind$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $4438 = Kind$Term$all$($4433, $4434, $4435, _xtyp$10, (_s$13 => _x$14 => {
                        var $4439 = _body$12;
                        return $4439;
                    }));
                    var $4427 = $4438;
                    break;
                case 'Kind.Term.lam':
                    var $4440 = self.name;
                    var $4441 = self.body;
                    var _body$7 = $4441(Kind$Term$ref$($4440));
                    var _body$8 = Kind$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4442 = Kind$Term$lam$($4440, (_x$9 => {
                        var $4443 = _body$8;
                        return $4443;
                    }));
                    var $4427 = $4442;
                    break;
                case 'Kind.Term.app':
                    var $4444 = self.func;
                    var $4445 = self.argm;
                    var _func$7 = Kind$SmartMotive$replace$($4444, _from$2, _to$3, _lv$4);
                    var _argm$8 = Kind$SmartMotive$replace$($4445, _from$2, _to$3, _lv$4);
                    var $4446 = Kind$Term$app$(_func$7, _argm$8);
                    var $4427 = $4446;
                    break;
                case 'Kind.Term.let':
                    var $4447 = self.name;
                    var $4448 = self.expr;
                    var $4449 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4448, _from$2, _to$3, _lv$4);
                    var _body$9 = $4449(Kind$Term$ref$($4447));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4450 = Kind$Term$let$($4447, _expr$8, (_x$11 => {
                        var $4451 = _body$10;
                        return $4451;
                    }));
                    var $4427 = $4450;
                    break;
                case 'Kind.Term.def':
                    var $4452 = self.name;
                    var $4453 = self.expr;
                    var $4454 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4453, _from$2, _to$3, _lv$4);
                    var _body$9 = $4454(Kind$Term$ref$($4452));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4455 = Kind$Term$def$($4452, _expr$8, (_x$11 => {
                        var $4456 = _body$10;
                        return $4456;
                    }));
                    var $4427 = $4455;
                    break;
                case 'Kind.Term.ann':
                    var $4457 = self.done;
                    var $4458 = self.term;
                    var $4459 = self.type;
                    var _term$8 = Kind$SmartMotive$replace$($4458, _from$2, _to$3, _lv$4);
                    var _type$9 = Kind$SmartMotive$replace$($4459, _from$2, _to$3, _lv$4);
                    var $4460 = Kind$Term$ann$($4457, _term$8, _type$9);
                    var $4427 = $4460;
                    break;
                case 'Kind.Term.ori':
                    var $4461 = self.expr;
                    var $4462 = Kind$SmartMotive$replace$($4461, _from$2, _to$3, _lv$4);
                    var $4427 = $4462;
                    break;
                case 'Kind.Term.typ':
                    var $4463 = Kind$Term$typ;
                    var $4427 = $4463;
                    break;
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                    var $4464 = _term$1;
                    var $4427 = $4464;
                    break;
            };
            var $4425 = $4427;
        };
        return $4425;
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
                    var $4467 = self.fst;
                    var $4468 = self.snd;
                    var $4469 = Kind$SmartMotive$replace$(_moti$11, $4468, Kind$Term$ref$($4467), _lv$5);
                    var $4466 = $4469;
                    break;
            };
            return $4466;
        }));
        var $4465 = _moti$10;
        return $4465;
    };
    const Kind$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Kind$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Kind$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.cons':
                var $4471 = self.head;
                var $4472 = self.tail;
                var self = $4471;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $4474 = self.name;
                        var $4475 = self.type;
                        var $4476 = Kind$Term$all$(Bool$false, "", $4474, $4475, (_s$14 => _x$15 => {
                            var $4477 = Kind$Term$desugar_cse$motive$($4472, _moti$2);
                            return $4477;
                        }));
                        var $4473 = $4476;
                        break;
                };
                var $4470 = $4473;
                break;
            case 'List.nil':
                var $4478 = _moti$2;
                var $4470 = $4478;
                break;
        };
        return $4470;
    };
    const Kind$Term$desugar_cse$motive = x0 => x1 => Kind$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4480 = Bool$true;
            var $4479 = $4480;
        } else {
            var $4481 = self.charCodeAt(0);
            var $4482 = self.slice(1);
            var $4483 = Bool$false;
            var $4479 = $4483;
        };
        return $4479;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Kind$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Kind.Term.all':
                var $4485 = self.self;
                var $4486 = self.name;
                var $4487 = self.body;
                var $4488 = Kind$Term$lam$((() => {
                    var self = String$is_empty$($4486);
                    if (self) {
                        var $4489 = _name$1;
                        return $4489;
                    } else {
                        var $4490 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4486, List$nil))));
                        return $4490;
                    };
                })(), (_x$11 => {
                    var $4491 = Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, $4487(Kind$Term$var$($4485, 0n))(Kind$Term$var$($4486, 0n)), _body$4, _defs$5);
                    return $4491;
                }));
                var $4484 = $4488;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.ori':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4493 = self.head;
                        var $4494 = self.tail;
                        var self = $4493;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4496 = self.name;
                                var $4497 = Kind$Term$lam$($4496, (_x$19 => {
                                    var $4498 = Kind$Term$desugar_cse$argument$(_name$1, $4494, _type$3, _body$4, _defs$5);
                                    return $4498;
                                }));
                                var $4495 = $4497;
                                break;
                        };
                        var $4492 = $4495;
                        break;
                    case 'List.nil':
                        var $4499 = _body$4;
                        var $4492 = $4499;
                        break;
                };
                var $4484 = $4492;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4501 = self.head;
                        var $4502 = self.tail;
                        var self = $4501;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4504 = self.name;
                                var $4505 = Kind$Term$lam$($4504, (_x$18 => {
                                    var $4506 = Kind$Term$desugar_cse$argument$(_name$1, $4502, _type$3, _body$4, _defs$5);
                                    return $4506;
                                }));
                                var $4503 = $4505;
                                break;
                        };
                        var $4500 = $4503;
                        break;
                    case 'List.nil':
                        var $4507 = _body$4;
                        var $4500 = $4507;
                        break;
                };
                var $4484 = $4500;
                break;
            case 'Kind.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4509 = self.head;
                        var $4510 = self.tail;
                        var self = $4509;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4512 = self.name;
                                var $4513 = Kind$Term$lam$($4512, (_x$17 => {
                                    var $4514 = Kind$Term$desugar_cse$argument$(_name$1, $4510, _type$3, _body$4, _defs$5);
                                    return $4514;
                                }));
                                var $4511 = $4513;
                                break;
                        };
                        var $4508 = $4511;
                        break;
                    case 'List.nil':
                        var $4515 = _body$4;
                        var $4508 = $4515;
                        break;
                };
                var $4484 = $4508;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4517 = self.head;
                        var $4518 = self.tail;
                        var self = $4517;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4520 = self.name;
                                var $4521 = Kind$Term$lam$($4520, (_x$20 => {
                                    var $4522 = Kind$Term$desugar_cse$argument$(_name$1, $4518, _type$3, _body$4, _defs$5);
                                    return $4522;
                                }));
                                var $4519 = $4521;
                                break;
                        };
                        var $4516 = $4519;
                        break;
                    case 'List.nil':
                        var $4523 = _body$4;
                        var $4516 = $4523;
                        break;
                };
                var $4484 = $4516;
                break;
            case 'Kind.Term.cse':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4525 = self.head;
                        var $4526 = self.tail;
                        var self = $4525;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4528 = self.name;
                                var $4529 = Kind$Term$lam$($4528, (_x$23 => {
                                    var $4530 = Kind$Term$desugar_cse$argument$(_name$1, $4526, _type$3, _body$4, _defs$5);
                                    return $4530;
                                }));
                                var $4527 = $4529;
                                break;
                        };
                        var $4524 = $4527;
                        break;
                    case 'List.nil':
                        var $4531 = _body$4;
                        var $4524 = $4531;
                        break;
                };
                var $4484 = $4524;
                break;
        };
        return $4484;
    };
    const Kind$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Kind$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $4533 = self.value;
                var $4534 = Maybe$some$($4533);
                var $4532 = $4534;
                break;
            case 'Maybe.none':
                var $4535 = _b$3;
                var $4532 = $4535;
                break;
        };
        return $4532;
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
                        var $4536 = self.self;
                        var $4537 = self.name;
                        var $4538 = self.xtyp;
                        var $4539 = self.body;
                        var _got$13 = Maybe$or$(Kind$get$($4537, _cses$4), Kind$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4541 = self.value;
                                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, _wyth$3, $4538, $4541, _defs$6);
                                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $4539(Kind$Term$var$($4536, 0n))(Kind$Term$var$($4537, 0n));
                                var $4542 = Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $4540 = $4542;
                                break;
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $4545 = _expr$1;
                                    var $4546 = _wyth$3;
                                    let _expr$15 = $4545;
                                    let _defn$14;
                                    while ($4546._ === 'List.cons') {
                                        _defn$14 = $4546.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Kind.Def.new':
                                                var $4547 = self.term;
                                                var $4548 = Kind$Term$app$(_expr$15, $4547);
                                                var $4545 = $4548;
                                                break;
                                        };
                                        _expr$15 = $4545;
                                        $4546 = $4546.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $4543 = _expr$14;
                                var $4540 = $4543;
                                break;
                        };
                        return $4540;
                    case 'Kind.Term.var':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.ori':
                        var _expr$10 = (() => {
                            var $4551 = _expr$1;
                            var $4552 = _wyth$3;
                            let _expr$11 = $4551;
                            let _defn$10;
                            while ($4552._ === 'List.cons') {
                                _defn$10 = $4552.head;
                                var $4551 = Kind$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4553 = self.term;
                                            var $4554 = $4553;
                                            return $4554;
                                    };
                                })());
                                _expr$11 = $4551;
                                $4552 = $4552.tail;
                            }
                            return _expr$11;
                        })();
                        var $4549 = _expr$10;
                        return $4549;
                    case 'Kind.Term.ref':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                        var _expr$9 = (() => {
                            var $4557 = _expr$1;
                            var $4558 = _wyth$3;
                            let _expr$10 = $4557;
                            let _defn$9;
                            while ($4558._ === 'List.cons') {
                                _defn$9 = $4558.head;
                                var $4557 = Kind$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4559 = self.term;
                                            var $4560 = $4559;
                                            return $4560;
                                    };
                                })());
                                _expr$10 = $4557;
                                $4558 = $4558.tail;
                            }
                            return _expr$10;
                        })();
                        var $4555 = _expr$9;
                        return $4555;
                    case 'Kind.Term.typ':
                        var _expr$8 = (() => {
                            var $4563 = _expr$1;
                            var $4564 = _wyth$3;
                            let _expr$9 = $4563;
                            let _defn$8;
                            while ($4564._ === 'List.cons') {
                                _defn$8 = $4564.head;
                                var $4563 = Kind$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4565 = self.term;
                                            var $4566 = $4565;
                                            return $4566;
                                    };
                                })());
                                _expr$9 = $4563;
                                $4564 = $4564.tail;
                            }
                            return _expr$9;
                        })();
                        var $4561 = _expr$8;
                        return $4561;
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                        var _expr$11 = (() => {
                            var $4569 = _expr$1;
                            var $4570 = _wyth$3;
                            let _expr$12 = $4569;
                            let _defn$11;
                            while ($4570._ === 'List.cons') {
                                _defn$11 = $4570.head;
                                var $4569 = Kind$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4571 = self.term;
                                            var $4572 = $4571;
                                            return $4572;
                                    };
                                })());
                                _expr$12 = $4569;
                                $4570 = $4570.tail;
                            }
                            return _expr$12;
                        })();
                        var $4567 = _expr$11;
                        return $4567;
                    case 'Kind.Term.cse':
                        var _expr$14 = (() => {
                            var $4575 = _expr$1;
                            var $4576 = _wyth$3;
                            let _expr$15 = $4575;
                            let _defn$14;
                            while ($4576._ === 'List.cons') {
                                _defn$14 = $4576.head;
                                var $4575 = Kind$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4577 = self.term;
                                            var $4578 = $4577;
                                            return $4578;
                                    };
                                })());
                                _expr$15 = $4575;
                                $4576 = $4576.tail;
                            }
                            return _expr$15;
                        })();
                        var $4573 = _expr$14;
                        return $4573;
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
                var $4580 = self.self;
                var $4581 = self.name;
                var $4582 = self.xtyp;
                var $4583 = self.body;
                var _moti$14 = Kind$Term$desugar_cse$motive$(_wyth$3, _moti$5);
                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, List$nil, $4582, _moti$14, _defs$7);
                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                var _type$17 = $4583(Kind$Term$var$($4580, 0n))(Kind$Term$var$($4581, 0n));
                var $4584 = Maybe$some$(Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $4579 = $4584;
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
                var $4585 = Maybe$none;
                var $4579 = $4585;
                break;
        };
        return $4579;
    };
    const Kind$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $4586 = ({
            _: 'Kind.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $4586;
    };
    const Kind$Error$cant_infer = x0 => x1 => x2 => Kind$Error$cant_infer$(x0, x1, x2);

    function BitsSet$has$(_bits$1, _set$2) {
        var self = BitsMap$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $4588 = Bool$false;
                var $4587 = $4588;
                break;
            case 'Maybe.some':
                var $4589 = Bool$true;
                var $4587 = $4589;
                break;
        };
        return $4587;
    };
    const BitsSet$has = x0 => x1 => BitsSet$has$(x0, x1);

    function BitsSet$mut$has$(_bits$1, _set$2) {
        var $4590 = BitsSet$has$(_bits$1, _set$2);
        return $4590;
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
                        var $4591 = self.name;
                        var $4592 = Maybe$some$(Pair$new$($4591, _arity$2));
                        return $4592;
                    case 'Kind.Term.ref':
                        var $4593 = self.name;
                        var $4594 = Maybe$some$(Pair$new$($4593, _arity$2));
                        return $4594;
                    case 'Kind.Term.app':
                        var $4595 = self.func;
                        var $4596 = Kind$Term$equal$extra_holes$funari$($4595, Nat$succ$(_arity$2));
                        return $4596;
                    case 'Kind.Term.ori':
                        var $4597 = self.expr;
                        var $4598 = Kind$Term$equal$extra_holes$funari$($4597, _arity$2);
                        return $4598;
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
                        var $4599 = Maybe$none;
                        return $4599;
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
                var $4601 = self.xtyp;
                var $4602 = self.body;
                var $4603 = (Kind$Term$has_holes$($4601) || Kind$Term$has_holes$($4602(Kind$Term$typ)(Kind$Term$typ)));
                var $4600 = $4603;
                break;
            case 'Kind.Term.lam':
                var $4604 = self.body;
                var $4605 = Kind$Term$has_holes$($4604(Kind$Term$typ));
                var $4600 = $4605;
                break;
            case 'Kind.Term.app':
                var $4606 = self.func;
                var $4607 = self.argm;
                var $4608 = (Kind$Term$has_holes$($4606) || Kind$Term$has_holes$($4607));
                var $4600 = $4608;
                break;
            case 'Kind.Term.let':
                var $4609 = self.expr;
                var $4610 = self.body;
                var $4611 = (Kind$Term$has_holes$($4609) || Kind$Term$has_holes$($4610(Kind$Term$typ)));
                var $4600 = $4611;
                break;
            case 'Kind.Term.def':
                var $4612 = self.expr;
                var $4613 = self.body;
                var $4614 = (Kind$Term$has_holes$($4612) || Kind$Term$has_holes$($4613(Kind$Term$typ)));
                var $4600 = $4614;
                break;
            case 'Kind.Term.ann':
                var $4615 = self.term;
                var $4616 = self.type;
                var $4617 = (Kind$Term$has_holes$($4615) || Kind$Term$has_holes$($4616));
                var $4600 = $4617;
                break;
            case 'Kind.Term.ori':
                var $4618 = self.expr;
                var $4619 = Kind$Term$has_holes$($4618);
                var $4600 = $4619;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $4620 = Bool$false;
                var $4600 = $4620;
                break;
            case 'Kind.Term.hol':
                var $4621 = Bool$true;
                var $4600 = $4621;
                break;
        };
        return $4600;
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
                    var $4624 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                    var $4623 = $4624;
                } else {
                    var $4625 = Kind$Check$result$(Maybe$some$(Bool$true), List$cons$(Kind$Error$patch$(_path$1, Kind$Term$normalize$(_term$2, BitsMap$new)), List$nil));
                    var $4623 = $4625;
                };
                var $4622 = $4623;
                break;
            case 'Kind.Term.hol':
                var $4626 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4622 = $4626;
                break;
        };
        return $4622;
    };
    const Kind$Term$equal$hole = x0 => x1 => Kind$Term$equal$hole$(x0, x1);

    function Kind$Term$equal$extra_holes$filler$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kind.Term.app':
                var $4628 = self.func;
                var $4629 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4631 = self.func;
                        var $4632 = self.argm;
                        var self = Kind$Term$equal$extra_holes$filler$($4628, $4631);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4634 = self.value;
                                var $4635 = self.errors;
                                var self = $4634;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4637 = Kind$Check$result$(Maybe$none, $4635);
                                        var $4636 = $4637;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Term$equal$extra_holes$filler$($4629, $4632);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4639 = self.value;
                                                var $4640 = self.errors;
                                                var $4641 = Kind$Check$result$($4639, List$concat$($4635, $4640));
                                                var $4638 = $4641;
                                                break;
                                        };
                                        var $4636 = $4638;
                                        break;
                                };
                                var $4633 = $4636;
                                break;
                        };
                        var $4630 = $4633;
                        break;
                    case 'Kind.Term.hol':
                        var $4642 = self.path;
                        var self = Kind$Term$equal$hole$($4642, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4644 = self.value;
                                var $4645 = self.errors;
                                var self = $4644;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4647 = Kind$Check$result$(Maybe$none, $4645);
                                        var $4646 = $4647;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4649 = self.value;
                                                var $4650 = self.errors;
                                                var $4651 = Kind$Check$result$($4649, List$concat$($4645, $4650));
                                                var $4648 = $4651;
                                                break;
                                        };
                                        var $4646 = $4648;
                                        break;
                                };
                                var $4643 = $4646;
                                break;
                        };
                        var $4630 = $4643;
                        break;
                    case 'Kind.Term.ori':
                        var $4652 = self.expr;
                        var $4653 = Kind$Term$equal$extra_holes$filler$(_a$1, $4652);
                        var $4630 = $4653;
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
                        var $4654 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4630 = $4654;
                        break;
                };
                var $4627 = $4630;
                break;
            case 'Kind.Term.hol':
                var $4655 = self.path;
                var self = Kind$Term$equal$hole$($4655, _b$2);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4657 = self.value;
                        var $4658 = self.errors;
                        var self = $4657;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4660 = Kind$Check$result$(Maybe$none, $4658);
                                var $4659 = $4660;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4662 = self.value;
                                        var $4663 = self.errors;
                                        var $4664 = Kind$Check$result$($4662, List$concat$($4658, $4663));
                                        var $4661 = $4664;
                                        break;
                                };
                                var $4659 = $4661;
                                break;
                        };
                        var $4656 = $4659;
                        break;
                };
                var $4627 = $4656;
                break;
            case 'Kind.Term.ori':
                var $4665 = self.expr;
                var $4666 = Kind$Term$equal$extra_holes$filler$($4665, _b$2);
                var $4627 = $4666;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4668 = self.path;
                        var self = Kind$Term$equal$hole$($4668, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4670 = self.value;
                                var $4671 = self.errors;
                                var self = $4670;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4673 = Kind$Check$result$(Maybe$none, $4671);
                                        var $4672 = $4673;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4675 = self.value;
                                                var $4676 = self.errors;
                                                var $4677 = Kind$Check$result$($4675, List$concat$($4671, $4676));
                                                var $4674 = $4677;
                                                break;
                                        };
                                        var $4672 = $4674;
                                        break;
                                };
                                var $4669 = $4672;
                                break;
                        };
                        var $4667 = $4669;
                        break;
                    case 'Kind.Term.ori':
                        var $4678 = self.expr;
                        var $4679 = Kind$Term$equal$extra_holes$filler$(_a$1, $4678);
                        var $4667 = $4679;
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
                        var $4680 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4667 = $4680;
                        break;
                };
                var $4627 = $4667;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4682 = self.path;
                        var self = Kind$Term$equal$hole$($4682, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4684 = self.value;
                                var $4685 = self.errors;
                                var self = $4684;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4687 = Kind$Check$result$(Maybe$none, $4685);
                                        var $4686 = $4687;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4689 = self.value;
                                                var $4690 = self.errors;
                                                var $4691 = Kind$Check$result$($4689, List$concat$($4685, $4690));
                                                var $4688 = $4691;
                                                break;
                                        };
                                        var $4686 = $4688;
                                        break;
                                };
                                var $4683 = $4686;
                                break;
                        };
                        var $4681 = $4683;
                        break;
                    case 'Kind.Term.ori':
                        var $4692 = self.expr;
                        var $4693 = Kind$Term$equal$extra_holes$filler$(_a$1, $4692);
                        var $4681 = $4693;
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
                        var $4694 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4681 = $4694;
                        break;
                };
                var $4627 = $4681;
                break;
            case 'Kind.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4696 = self.path;
                        var self = Kind$Term$equal$hole$($4696, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4698 = self.value;
                                var $4699 = self.errors;
                                var self = $4698;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4701 = Kind$Check$result$(Maybe$none, $4699);
                                        var $4700 = $4701;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4703 = self.value;
                                                var $4704 = self.errors;
                                                var $4705 = Kind$Check$result$($4703, List$concat$($4699, $4704));
                                                var $4702 = $4705;
                                                break;
                                        };
                                        var $4700 = $4702;
                                        break;
                                };
                                var $4697 = $4700;
                                break;
                        };
                        var $4695 = $4697;
                        break;
                    case 'Kind.Term.ori':
                        var $4706 = self.expr;
                        var $4707 = Kind$Term$equal$extra_holes$filler$(_a$1, $4706);
                        var $4695 = $4707;
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
                        var $4708 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4695 = $4708;
                        break;
                };
                var $4627 = $4695;
                break;
            case 'Kind.Term.all':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4710 = self.path;
                        var self = Kind$Term$equal$hole$($4710, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4712 = self.value;
                                var $4713 = self.errors;
                                var self = $4712;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4715 = Kind$Check$result$(Maybe$none, $4713);
                                        var $4714 = $4715;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4717 = self.value;
                                                var $4718 = self.errors;
                                                var $4719 = Kind$Check$result$($4717, List$concat$($4713, $4718));
                                                var $4716 = $4719;
                                                break;
                                        };
                                        var $4714 = $4716;
                                        break;
                                };
                                var $4711 = $4714;
                                break;
                        };
                        var $4709 = $4711;
                        break;
                    case 'Kind.Term.ori':
                        var $4720 = self.expr;
                        var $4721 = Kind$Term$equal$extra_holes$filler$(_a$1, $4720);
                        var $4709 = $4721;
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
                        var $4722 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4709 = $4722;
                        break;
                };
                var $4627 = $4709;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4724 = self.path;
                        var self = Kind$Term$equal$hole$($4724, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4726 = self.value;
                                var $4727 = self.errors;
                                var self = $4726;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4729 = Kind$Check$result$(Maybe$none, $4727);
                                        var $4728 = $4729;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4731 = self.value;
                                                var $4732 = self.errors;
                                                var $4733 = Kind$Check$result$($4731, List$concat$($4727, $4732));
                                                var $4730 = $4733;
                                                break;
                                        };
                                        var $4728 = $4730;
                                        break;
                                };
                                var $4725 = $4728;
                                break;
                        };
                        var $4723 = $4725;
                        break;
                    case 'Kind.Term.ori':
                        var $4734 = self.expr;
                        var $4735 = Kind$Term$equal$extra_holes$filler$(_a$1, $4734);
                        var $4723 = $4735;
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
                        var $4736 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4723 = $4736;
                        break;
                };
                var $4627 = $4723;
                break;
            case 'Kind.Term.cse':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4738 = self.path;
                        var self = Kind$Term$equal$hole$($4738, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4740 = self.value;
                                var $4741 = self.errors;
                                var self = $4740;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4743 = Kind$Check$result$(Maybe$none, $4741);
                                        var $4742 = $4743;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4745 = self.value;
                                                var $4746 = self.errors;
                                                var $4747 = Kind$Check$result$($4745, List$concat$($4741, $4746));
                                                var $4744 = $4747;
                                                break;
                                        };
                                        var $4742 = $4744;
                                        break;
                                };
                                var $4739 = $4742;
                                break;
                        };
                        var $4737 = $4739;
                        break;
                    case 'Kind.Term.ori':
                        var $4748 = self.expr;
                        var $4749 = Kind$Term$equal$extra_holes$filler$(_a$1, $4748);
                        var $4737 = $4749;
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
                        var $4750 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4737 = $4750;
                        break;
                };
                var $4627 = $4737;
                break;
        };
        return $4627;
    };
    const Kind$Term$equal$extra_holes$filler = x0 => x1 => Kind$Term$equal$extra_holes$filler$(x0, x1);

    function Kind$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = Kind$Term$equal$extra_holes$funari$(_a$1, 0n);
        switch (self._) {
            case 'Maybe.some':
                var $4752 = self.value;
                var self = Kind$Term$equal$extra_holes$funari$(_b$2, 0n);
                switch (self._) {
                    case 'Maybe.some':
                        var $4754 = self.value;
                        var self = $4752;
                        switch (self._) {
                            case 'Pair.new':
                                var $4756 = self.fst;
                                var $4757 = self.snd;
                                var self = $4754;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4759 = self.fst;
                                        var $4760 = self.snd;
                                        var _same_fun$9 = ($4756 === $4759);
                                        var _same_ari$10 = ($4757 === $4760);
                                        var self = (_same_fun$9 && _same_ari$10);
                                        if (self) {
                                            var $4762 = Kind$Term$equal$extra_holes$filler$(_a$1, _b$2);
                                            var $4761 = $4762;
                                        } else {
                                            var $4763 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                            var $4761 = $4763;
                                        };
                                        var $4758 = $4761;
                                        break;
                                };
                                var $4755 = $4758;
                                break;
                        };
                        var $4753 = $4755;
                        break;
                    case 'Maybe.none':
                        var $4764 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4753 = $4764;
                        break;
                };
                var $4751 = $4753;
                break;
            case 'Maybe.none':
                var $4765 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                var $4751 = $4765;
                break;
        };
        return $4751;
    };
    const Kind$Term$equal$extra_holes = x0 => x1 => Kind$Term$equal$extra_holes$(x0, x1);

    function BitsSet$set$(_bits$1, _set$2) {
        var $4766 = BitsMap$set$(_bits$1, Unit$new, _set$2);
        return $4766;
    };
    const BitsSet$set = x0 => x1 => BitsSet$set$(x0, x1);

    function BitsSet$mut$set$(_bits$1, _set$2) {
        var $4767 = BitsSet$set$(_bits$1, _set$2);
        return $4767;
    };
    const BitsSet$mut$set = x0 => x1 => BitsSet$mut$set$(x0, x1);

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $4769 = _b$2;
            var $4768 = $4769;
        } else {
            var $4770 = (!_b$2);
            var $4768 = $4770;
        };
        return $4768;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Kind$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Kind$Term$serialize$(Kind$Term$reduce$(_a$1, BitsMap$new), _lv$4, _lv$4, Bits$o, Bits$e);
        var _bh$7 = Kind$Term$serialize$(Kind$Term$reduce$(_b$2, BitsMap$new), _lv$4, _lv$4, Bits$i, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $4772 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
            var $4771 = $4772;
        } else {
            var _a1$8 = Kind$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Kind$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Kind$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$o, Bits$e);
            var _bh$11 = Kind$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$i, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $4774 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4773 = $4774;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = BitsSet$mut$has$(_id$12, _seen$5);
                if (self) {
                    var self = Kind$Term$equal$extra_holes$(_a$1, _b$2);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4777 = self.value;
                            var $4778 = self.errors;
                            var self = $4777;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4780 = Kind$Check$result$(Maybe$none, $4778);
                                    var $4779 = $4780;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4782 = self.value;
                                            var $4783 = self.errors;
                                            var $4784 = Kind$Check$result$($4782, List$concat$($4778, $4783));
                                            var $4781 = $4784;
                                            break;
                                    };
                                    var $4779 = $4781;
                                    break;
                            };
                            var $4776 = $4779;
                            break;
                    };
                    var $4775 = $4776;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Kind.Term.all':
                            var $4786 = self.eras;
                            var $4787 = self.self;
                            var $4788 = self.name;
                            var $4789 = self.xtyp;
                            var $4790 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.all':
                                    var $4792 = self.eras;
                                    var $4793 = self.self;
                                    var $4794 = self.name;
                                    var $4795 = self.xtyp;
                                    var $4796 = self.body;
                                    var _seen$23 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$24 = $4790(Kind$Term$var$($4787, _lv$4))(Kind$Term$var$($4788, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $4796(Kind$Term$var$($4793, _lv$4))(Kind$Term$var$($4794, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($4787 === $4793);
                                    var _eq_eras$27 = Bool$eql$($4786, $4792);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var self = Kind$Term$equal$($4789, $4795, _defs$3, _lv$4, _seen$23);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4799 = self.value;
                                                var $4800 = self.errors;
                                                var self = $4799;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $4802 = self.value;
                                                        var self = Kind$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4804 = self.value;
                                                                var $4805 = self.errors;
                                                                var self = $4804;
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $4807 = self.value;
                                                                        var self = Kind$Check$result$(Maybe$some$(($4802 && $4807)), List$nil);
                                                                        switch (self._) {
                                                                            case 'Kind.Check.result':
                                                                                var $4809 = self.value;
                                                                                var $4810 = self.errors;
                                                                                var $4811 = Kind$Check$result$($4809, List$concat$($4805, $4810));
                                                                                var $4808 = $4811;
                                                                                break;
                                                                        };
                                                                        var $4806 = $4808;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $4812 = Kind$Check$result$(Maybe$none, $4805);
                                                                        var $4806 = $4812;
                                                                        break;
                                                                };
                                                                var self = $4806;
                                                                break;
                                                        };
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4813 = self.value;
                                                                var $4814 = self.errors;
                                                                var $4815 = Kind$Check$result$($4813, List$concat$($4800, $4814));
                                                                var $4803 = $4815;
                                                                break;
                                                        };
                                                        var $4801 = $4803;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $4816 = Kind$Check$result$(Maybe$none, $4800);
                                                        var $4801 = $4816;
                                                        break;
                                                };
                                                var $4798 = $4801;
                                                break;
                                        };
                                        var $4797 = $4798;
                                    } else {
                                        var $4817 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                        var $4797 = $4817;
                                    };
                                    var $4791 = $4797;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4818 = self.path;
                                    var $4819 = Kind$Term$equal$hole$($4818, _a$1);
                                    var $4791 = $4819;
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
                                    var $4820 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4791 = $4820;
                                    break;
                            };
                            var $4785 = $4791;
                            break;
                        case 'Kind.Term.lam':
                            var $4821 = self.name;
                            var $4822 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.lam':
                                    var $4824 = self.name;
                                    var $4825 = self.body;
                                    var _seen$17 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$18 = $4822(Kind$Term$var$($4821, _lv$4));
                                    var _b1_body$19 = $4825(Kind$Term$var$($4824, _lv$4));
                                    var self = Kind$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4827 = self.value;
                                            var $4828 = self.errors;
                                            var self = $4827;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4830 = self.value;
                                                    var self = Kind$Check$result$(Maybe$some$($4830), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4832 = self.value;
                                                            var $4833 = self.errors;
                                                            var $4834 = Kind$Check$result$($4832, List$concat$($4828, $4833));
                                                            var $4831 = $4834;
                                                            break;
                                                    };
                                                    var $4829 = $4831;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4835 = Kind$Check$result$(Maybe$none, $4828);
                                                    var $4829 = $4835;
                                                    break;
                                            };
                                            var $4826 = $4829;
                                            break;
                                    };
                                    var $4823 = $4826;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4836 = self.path;
                                    var $4837 = Kind$Term$equal$hole$($4836, _a$1);
                                    var $4823 = $4837;
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
                                    var $4838 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4823 = $4838;
                                    break;
                            };
                            var $4785 = $4823;
                            break;
                        case 'Kind.Term.app':
                            var $4839 = self.func;
                            var $4840 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.app':
                                    var $4842 = self.func;
                                    var $4843 = self.argm;
                                    var _seen$17 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var self = Kind$Term$equal$($4839, $4842, _defs$3, _lv$4, _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4845 = self.value;
                                            var $4846 = self.errors;
                                            var self = $4845;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4848 = self.value;
                                                    var self = Kind$Term$equal$($4840, $4843, _defs$3, _lv$4, _seen$17);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4850 = self.value;
                                                            var $4851 = self.errors;
                                                            var self = $4850;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4853 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4848 && $4853)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4855 = self.value;
                                                                            var $4856 = self.errors;
                                                                            var $4857 = Kind$Check$result$($4855, List$concat$($4851, $4856));
                                                                            var $4854 = $4857;
                                                                            break;
                                                                    };
                                                                    var $4852 = $4854;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4858 = Kind$Check$result$(Maybe$none, $4851);
                                                                    var $4852 = $4858;
                                                                    break;
                                                            };
                                                            var self = $4852;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4859 = self.value;
                                                            var $4860 = self.errors;
                                                            var $4861 = Kind$Check$result$($4859, List$concat$($4846, $4860));
                                                            var $4849 = $4861;
                                                            break;
                                                    };
                                                    var $4847 = $4849;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4862 = Kind$Check$result$(Maybe$none, $4846);
                                                    var $4847 = $4862;
                                                    break;
                                            };
                                            var $4844 = $4847;
                                            break;
                                    };
                                    var $4841 = $4844;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4863 = self.path;
                                    var $4864 = Kind$Term$equal$hole$($4863, _a$1);
                                    var $4841 = $4864;
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
                                    var $4865 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4841 = $4865;
                                    break;
                            };
                            var $4785 = $4841;
                            break;
                        case 'Kind.Term.let':
                            var $4866 = self.name;
                            var $4867 = self.expr;
                            var $4868 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.let':
                                    var $4870 = self.name;
                                    var $4871 = self.expr;
                                    var $4872 = self.body;
                                    var _seen$19 = BitsSet$mut$set$(_id$12, _seen$5);
                                    var _a1_body$20 = $4868(Kind$Term$var$($4866, _lv$4));
                                    var _b1_body$21 = $4872(Kind$Term$var$($4870, _lv$4));
                                    var self = Kind$Term$equal$($4867, $4871, _defs$3, _lv$4, _seen$19);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4874 = self.value;
                                            var $4875 = self.errors;
                                            var self = $4874;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4877 = self.value;
                                                    var self = Kind$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4879 = self.value;
                                                            var $4880 = self.errors;
                                                            var self = $4879;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4882 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4877 && $4882)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4884 = self.value;
                                                                            var $4885 = self.errors;
                                                                            var $4886 = Kind$Check$result$($4884, List$concat$($4880, $4885));
                                                                            var $4883 = $4886;
                                                                            break;
                                                                    };
                                                                    var $4881 = $4883;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4887 = Kind$Check$result$(Maybe$none, $4880);
                                                                    var $4881 = $4887;
                                                                    break;
                                                            };
                                                            var self = $4881;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4888 = self.value;
                                                            var $4889 = self.errors;
                                                            var $4890 = Kind$Check$result$($4888, List$concat$($4875, $4889));
                                                            var $4878 = $4890;
                                                            break;
                                                    };
                                                    var $4876 = $4878;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4891 = Kind$Check$result$(Maybe$none, $4875);
                                                    var $4876 = $4891;
                                                    break;
                                            };
                                            var $4873 = $4876;
                                            break;
                                    };
                                    var $4869 = $4873;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4892 = self.path;
                                    var $4893 = Kind$Term$equal$hole$($4892, _a$1);
                                    var $4869 = $4893;
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
                                    var $4894 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4869 = $4894;
                                    break;
                            };
                            var $4785 = $4869;
                            break;
                        case 'Kind.Term.hol':
                            var $4895 = self.path;
                            var $4896 = Kind$Term$equal$hole$($4895, _b$2);
                            var $4785 = $4896;
                            break;
                        case 'Kind.Term.var':
                        case 'Kind.Term.ori':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4898 = self.path;
                                    var $4899 = Kind$Term$equal$hole$($4898, _a$1);
                                    var $4897 = $4899;
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
                                    var $4900 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4897 = $4900;
                                    break;
                            };
                            var $4785 = $4897;
                            break;
                        case 'Kind.Term.ref':
                        case 'Kind.Term.nat':
                        case 'Kind.Term.chr':
                        case 'Kind.Term.str':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4902 = self.path;
                                    var $4903 = Kind$Term$equal$hole$($4902, _a$1);
                                    var $4901 = $4903;
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
                                    var $4904 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4901 = $4904;
                                    break;
                            };
                            var $4785 = $4901;
                            break;
                        case 'Kind.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4906 = self.path;
                                    var $4907 = Kind$Term$equal$hole$($4906, _a$1);
                                    var $4905 = $4907;
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
                                    var $4908 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4905 = $4908;
                                    break;
                            };
                            var $4785 = $4905;
                            break;
                        case 'Kind.Term.def':
                        case 'Kind.Term.ann':
                        case 'Kind.Term.gol':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4910 = self.path;
                                    var $4911 = Kind$Term$equal$hole$($4910, _a$1);
                                    var $4909 = $4911;
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
                                    var $4912 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4909 = $4912;
                                    break;
                            };
                            var $4785 = $4909;
                            break;
                        case 'Kind.Term.cse':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4914 = self.path;
                                    var $4915 = Kind$Term$equal$hole$($4914, _a$1);
                                    var $4913 = $4915;
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
                                    var $4916 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4913 = $4916;
                                    break;
                            };
                            var $4785 = $4913;
                            break;
                    };
                    var $4775 = $4785;
                };
                var $4773 = $4775;
            };
            var $4771 = $4773;
        };
        return $4771;
    };
    const Kind$Term$equal = x0 => x1 => x2 => x3 => x4 => Kind$Term$equal$(x0, x1, x2, x3, x4);
    const BitsSet$new = BitsMap$new;

    function BitsSet$mut$new$(_a$1) {
        var $4917 = BitsSet$new;
        return $4917;
    };
    const BitsSet$mut$new = x0 => BitsSet$mut$new$(x0);

    function Kind$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4919 = self.name;
                var $4920 = self.indx;
                var self = List$at_last$($4920, _ctx$4);
                switch (self._) {
                    case 'Maybe.some':
                        var $4922 = self.value;
                        var $4923 = Kind$Check$result$(Maybe$some$((() => {
                            var self = $4922;
                            switch (self._) {
                                case 'Pair.new':
                                    var $4924 = self.snd;
                                    var $4925 = $4924;
                                    return $4925;
                            };
                        })()), List$nil);
                        var $4921 = $4923;
                        break;
                    case 'Maybe.none':
                        var $4926 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4919), List$nil));
                        var $4921 = $4926;
                        break;
                };
                var self = $4921;
                break;
            case 'Kind.Term.ref':
                var $4927 = self.name;
                var self = Kind$get$($4927, _defs$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $4929 = self.value;
                        var self = $4929;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4931 = self.name;
                                var $4932 = self.term;
                                var $4933 = self.type;
                                var $4934 = self.stat;
                                var _ref_name$18 = $4931;
                                var _ref_type$19 = $4933;
                                var _ref_term$20 = $4932;
                                var _ref_stat$21 = $4934;
                                var self = _ref_stat$21;
                                switch (self._) {
                                    case 'Kind.Status.init':
                                        var $4936 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$waiting$(_ref_name$18), List$nil));
                                        var $4935 = $4936;
                                        break;
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $4937 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$nil);
                                        var $4935 = $4937;
                                        break;
                                    case 'Kind.Status.fail':
                                        var $4938 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$indirect$(_ref_name$18), List$nil));
                                        var $4935 = $4938;
                                        break;
                                };
                                var $4930 = $4935;
                                break;
                        };
                        var $4928 = $4930;
                        break;
                    case 'Maybe.none':
                        var $4939 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4927), List$nil));
                        var $4928 = $4939;
                        break;
                };
                var self = $4928;
                break;
            case 'Kind.Term.all':
                var $4940 = self.self;
                var $4941 = self.name;
                var $4942 = self.xtyp;
                var $4943 = self.body;
                var _ctx_size$12 = (list_length(_ctx$4));
                var _self_var$13 = Kind$Term$var$($4940, _ctx_size$12);
                var _body_var$14 = Kind$Term$var$($4941, Nat$succ$(_ctx_size$12));
                var _body_ctx$15 = List$cons$(Pair$new$($4941, $4942), List$cons$(Pair$new$($4940, _term$1), _ctx$4));
                var self = Kind$Term$check$($4942, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4945 = self.value;
                        var $4946 = self.errors;
                        var self = $4945;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4948 = Kind$Check$result$(Maybe$none, $4946);
                                var $4947 = $4948;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Term$check$($4943(_self_var$13)(_body_var$14), Maybe$some$(Kind$Term$typ), _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4950 = self.value;
                                        var $4951 = self.errors;
                                        var self = $4950;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4953 = Kind$Check$result$(Maybe$none, $4951);
                                                var $4952 = $4953;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4955 = self.value;
                                                        var $4956 = self.errors;
                                                        var $4957 = Kind$Check$result$($4955, List$concat$($4951, $4956));
                                                        var $4954 = $4957;
                                                        break;
                                                };
                                                var $4952 = $4954;
                                                break;
                                        };
                                        var self = $4952;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4958 = self.value;
                                        var $4959 = self.errors;
                                        var $4960 = Kind$Check$result$($4958, List$concat$($4946, $4959));
                                        var $4949 = $4960;
                                        break;
                                };
                                var $4947 = $4949;
                                break;
                        };
                        var $4944 = $4947;
                        break;
                };
                var self = $4944;
                break;
            case 'Kind.Term.lam':
                var $4961 = self.name;
                var $4962 = self.body;
                var self = _type$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $4964 = self.value;
                        var _typv$10 = Kind$Term$reduce$($4964, _defs$3);
                        var self = _typv$10;
                        switch (self._) {
                            case 'Kind.Term.all':
                                var $4966 = self.xtyp;
                                var $4967 = self.body;
                                var _ctx_size$16 = (list_length(_ctx$4));
                                var _self_var$17 = _term$1;
                                var _body_var$18 = Kind$Term$var$($4961, _ctx_size$16);
                                var _body_typ$19 = $4967(_self_var$17)(_body_var$18);
                                var _body_ctx$20 = List$cons$(Pair$new$($4961, $4966), _ctx$4);
                                var self = Kind$Term$check$($4962(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Kind$MPath$o$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4969 = self.value;
                                        var $4970 = self.errors;
                                        var self = $4969;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4972 = Kind$Check$result$(Maybe$none, $4970);
                                                var $4971 = $4972;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$($4964), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4974 = self.value;
                                                        var $4975 = self.errors;
                                                        var $4976 = Kind$Check$result$($4974, List$concat$($4970, $4975));
                                                        var $4973 = $4976;
                                                        break;
                                                };
                                                var $4971 = $4973;
                                                break;
                                        };
                                        var $4968 = $4971;
                                        break;
                                };
                                var $4965 = $4968;
                                break;
                            case 'Kind.Term.var':
                            case 'Kind.Term.lam':
                            case 'Kind.Term.app':
                            case 'Kind.Term.ori':
                                var _expected$13 = Either$left$("(function type)");
                                var _detected$14 = Either$right$($4964);
                                var $4977 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4965 = $4977;
                                break;
                            case 'Kind.Term.ref':
                            case 'Kind.Term.hol':
                            case 'Kind.Term.nat':
                            case 'Kind.Term.chr':
                            case 'Kind.Term.str':
                                var _expected$12 = Either$left$("(function type)");
                                var _detected$13 = Either$right$($4964);
                                var $4978 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4965 = $4978;
                                break;
                            case 'Kind.Term.typ':
                                var _expected$11 = Either$left$("(function type)");
                                var _detected$12 = Either$right$($4964);
                                var $4979 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4965 = $4979;
                                break;
                            case 'Kind.Term.let':
                            case 'Kind.Term.def':
                            case 'Kind.Term.ann':
                            case 'Kind.Term.gol':
                                var _expected$14 = Either$left$("(function type)");
                                var _detected$15 = Either$right$($4964);
                                var $4980 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4965 = $4980;
                                break;
                            case 'Kind.Term.cse':
                                var _expected$17 = Either$left$("(function type)");
                                var _detected$18 = Either$right$($4964);
                                var $4981 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4965 = $4981;
                                break;
                        };
                        var $4963 = $4965;
                        break;
                    case 'Maybe.none':
                        var _lam_type$9 = Kind$Term$hol$(Bits$e);
                        var _lam_term$10 = Kind$Term$ann$(Bool$false, _term$1, _lam_type$9);
                        var $4982 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), _lam_term$10), List$nil));
                        var $4963 = $4982;
                        break;
                };
                var self = $4963;
                break;
            case 'Kind.Term.app':
                var $4983 = self.func;
                var $4984 = self.argm;
                var self = Kind$Term$check$($4983, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4986 = self.value;
                        var $4987 = self.errors;
                        var self = $4986;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4989 = self.value;
                                var _func_typ$12 = Kind$Term$reduce$($4989, _defs$3);
                                var self = _func_typ$12;
                                switch (self._) {
                                    case 'Kind.Term.all':
                                        var $4991 = self.xtyp;
                                        var $4992 = self.body;
                                        var self = Kind$Term$check$($4984, Maybe$some$($4991), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4994 = self.value;
                                                var $4995 = self.errors;
                                                var self = $4994;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $4997 = Kind$Check$result$(Maybe$none, $4995);
                                                        var $4996 = $4997;
                                                        break;
                                                    case 'Maybe.some':
                                                        var self = Kind$Check$result$(Maybe$some$($4992($4983)($4984)), List$nil);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4999 = self.value;
                                                                var $5000 = self.errors;
                                                                var $5001 = Kind$Check$result$($4999, List$concat$($4995, $5000));
                                                                var $4998 = $5001;
                                                                break;
                                                        };
                                                        var $4996 = $4998;
                                                        break;
                                                };
                                                var $4993 = $4996;
                                                break;
                                        };
                                        var self = $4993;
                                        break;
                                    case 'Kind.Term.var':
                                    case 'Kind.Term.lam':
                                    case 'Kind.Term.app':
                                    case 'Kind.Term.ori':
                                        var _expected$15 = Either$left$("(function type)");
                                        var _detected$16 = Either$right$(_func_typ$12);
                                        var $5002 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$15, _detected$16, _ctx$4), List$nil));
                                        var self = $5002;
                                        break;
                                    case 'Kind.Term.ref':
                                    case 'Kind.Term.hol':
                                    case 'Kind.Term.nat':
                                    case 'Kind.Term.chr':
                                    case 'Kind.Term.str':
                                        var _expected$14 = Either$left$("(function type)");
                                        var _detected$15 = Either$right$(_func_typ$12);
                                        var $5003 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                        var self = $5003;
                                        break;
                                    case 'Kind.Term.typ':
                                        var _expected$13 = Either$left$("(function type)");
                                        var _detected$14 = Either$right$(_func_typ$12);
                                        var $5004 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                        var self = $5004;
                                        break;
                                    case 'Kind.Term.let':
                                    case 'Kind.Term.def':
                                    case 'Kind.Term.ann':
                                    case 'Kind.Term.gol':
                                        var _expected$16 = Either$left$("(function type)");
                                        var _detected$17 = Either$right$(_func_typ$12);
                                        var $5005 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$16, _detected$17, _ctx$4), List$nil));
                                        var self = $5005;
                                        break;
                                    case 'Kind.Term.cse':
                                        var _expected$19 = Either$left$("(function type)");
                                        var _detected$20 = Either$right$(_func_typ$12);
                                        var $5006 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$19, _detected$20, _ctx$4), List$nil));
                                        var self = $5006;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5007 = self.value;
                                        var $5008 = self.errors;
                                        var $5009 = Kind$Check$result$($5007, List$concat$($4987, $5008));
                                        var $4990 = $5009;
                                        break;
                                };
                                var $4988 = $4990;
                                break;
                            case 'Maybe.none':
                                var $5010 = Kind$Check$result$(Maybe$none, $4987);
                                var $4988 = $5010;
                                break;
                        };
                        var $4985 = $4988;
                        break;
                };
                var self = $4985;
                break;
            case 'Kind.Term.let':
                var $5011 = self.name;
                var $5012 = self.expr;
                var $5013 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5012, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5015 = self.value;
                        var $5016 = self.errors;
                        var self = $5015;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5018 = self.value;
                                var _body_val$14 = $5013(Kind$Term$var$($5011, _ctx_size$10));
                                var _body_ctx$15 = List$cons$(Pair$new$($5011, $5018), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5020 = self.value;
                                        var $5021 = self.errors;
                                        var self = $5020;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5023 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5023), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5025 = self.value;
                                                        var $5026 = self.errors;
                                                        var $5027 = Kind$Check$result$($5025, List$concat$($5021, $5026));
                                                        var $5024 = $5027;
                                                        break;
                                                };
                                                var $5022 = $5024;
                                                break;
                                            case 'Maybe.none':
                                                var $5028 = Kind$Check$result$(Maybe$none, $5021);
                                                var $5022 = $5028;
                                                break;
                                        };
                                        var self = $5022;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5029 = self.value;
                                        var $5030 = self.errors;
                                        var $5031 = Kind$Check$result$($5029, List$concat$($5016, $5030));
                                        var $5019 = $5031;
                                        break;
                                };
                                var $5017 = $5019;
                                break;
                            case 'Maybe.none':
                                var $5032 = Kind$Check$result$(Maybe$none, $5016);
                                var $5017 = $5032;
                                break;
                        };
                        var $5014 = $5017;
                        break;
                };
                var self = $5014;
                break;
            case 'Kind.Term.def':
                var $5033 = self.name;
                var $5034 = self.expr;
                var $5035 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5034, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5037 = self.value;
                        var $5038 = self.errors;
                        var self = $5037;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5040 = self.value;
                                var _body_val$14 = $5035(Kind$Term$ann$(Bool$true, $5034, $5040));
                                var _body_ctx$15 = List$cons$(Pair$new$($5033, $5040), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5042 = self.value;
                                        var $5043 = self.errors;
                                        var self = $5042;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5045 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5045), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5047 = self.value;
                                                        var $5048 = self.errors;
                                                        var $5049 = Kind$Check$result$($5047, List$concat$($5043, $5048));
                                                        var $5046 = $5049;
                                                        break;
                                                };
                                                var $5044 = $5046;
                                                break;
                                            case 'Maybe.none':
                                                var $5050 = Kind$Check$result$(Maybe$none, $5043);
                                                var $5044 = $5050;
                                                break;
                                        };
                                        var self = $5044;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5051 = self.value;
                                        var $5052 = self.errors;
                                        var $5053 = Kind$Check$result$($5051, List$concat$($5038, $5052));
                                        var $5041 = $5053;
                                        break;
                                };
                                var $5039 = $5041;
                                break;
                            case 'Maybe.none':
                                var $5054 = Kind$Check$result$(Maybe$none, $5038);
                                var $5039 = $5054;
                                break;
                        };
                        var $5036 = $5039;
                        break;
                };
                var self = $5036;
                break;
            case 'Kind.Term.ann':
                var $5055 = self.done;
                var $5056 = self.term;
                var $5057 = self.type;
                var self = $5055;
                if (self) {
                    var $5059 = Kind$Check$result$(Maybe$some$($5057), List$nil);
                    var $5058 = $5059;
                } else {
                    var self = Kind$Term$check$($5056, Maybe$some$($5057), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $5061 = self.value;
                            var $5062 = self.errors;
                            var self = $5061;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $5064 = Kind$Check$result$(Maybe$none, $5062);
                                    var $5063 = $5064;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Term$check$($5057, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5066 = self.value;
                                            var $5067 = self.errors;
                                            var self = $5066;
                                            switch (self._) {
                                                case 'Maybe.none':
                                                    var $5069 = Kind$Check$result$(Maybe$none, $5067);
                                                    var $5068 = $5069;
                                                    break;
                                                case 'Maybe.some':
                                                    var self = Kind$Check$result$(Maybe$some$($5057), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $5071 = self.value;
                                                            var $5072 = self.errors;
                                                            var $5073 = Kind$Check$result$($5071, List$concat$($5067, $5072));
                                                            var $5070 = $5073;
                                                            break;
                                                    };
                                                    var $5068 = $5070;
                                                    break;
                                            };
                                            var self = $5068;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5074 = self.value;
                                            var $5075 = self.errors;
                                            var $5076 = Kind$Check$result$($5074, List$concat$($5062, $5075));
                                            var $5065 = $5076;
                                            break;
                                    };
                                    var $5063 = $5065;
                                    break;
                            };
                            var $5060 = $5063;
                            break;
                    };
                    var $5058 = $5060;
                };
                var self = $5058;
                break;
            case 'Kind.Term.gol':
                var $5077 = self.name;
                var $5078 = self.dref;
                var $5079 = self.verb;
                var $5080 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$show_goal$($5077, $5078, $5079, _type$2, _ctx$4), List$nil));
                var self = $5080;
                break;
            case 'Kind.Term.cse':
                var $5081 = self.path;
                var $5082 = self.expr;
                var $5083 = self.name;
                var $5084 = self.with;
                var $5085 = self.cses;
                var $5086 = self.moti;
                var _expr$13 = $5082;
                var self = Kind$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5088 = self.value;
                        var $5089 = self.errors;
                        var self = $5088;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5091 = self.value;
                                var self = $5086;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5093 = self.value;
                                        var $5094 = Kind$Term$desugar_cse$($5082, $5083, $5084, $5085, $5093, $5091, _defs$3, _ctx$4);
                                        var _dsug$17 = $5094;
                                        break;
                                    case 'Maybe.none':
                                        var self = _type$2;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5096 = self.value;
                                                var _size$18 = (list_length(_ctx$4));
                                                var _typv$19 = Kind$Term$normalize$($5096, BitsMap$new);
                                                var _moti$20 = Kind$SmartMotive$make$($5083, $5082, $5091, _typv$19, _size$18, _defs$3);
                                                var $5097 = _moti$20;
                                                var _moti$17 = $5097;
                                                break;
                                            case 'Maybe.none':
                                                var $5098 = Kind$Term$hol$(Bits$e);
                                                var _moti$17 = $5098;
                                                break;
                                        };
                                        var $5095 = Maybe$some$(Kind$Term$cse$($5081, $5082, $5083, $5084, $5085, Maybe$some$(_moti$17)));
                                        var _dsug$17 = $5095;
                                        break;
                                };
                                var self = _dsug$17;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5099 = self.value;
                                        var $5100 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), $5099), List$nil));
                                        var self = $5100;
                                        break;
                                    case 'Maybe.none':
                                        var $5101 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                        var self = $5101;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5102 = self.value;
                                        var $5103 = self.errors;
                                        var $5104 = Kind$Check$result$($5102, List$concat$($5089, $5103));
                                        var $5092 = $5104;
                                        break;
                                };
                                var $5090 = $5092;
                                break;
                            case 'Maybe.none':
                                var $5105 = Kind$Check$result$(Maybe$none, $5089);
                                var $5090 = $5105;
                                break;
                        };
                        var $5087 = $5090;
                        break;
                };
                var self = $5087;
                break;
            case 'Kind.Term.ori':
                var $5106 = self.orig;
                var $5107 = self.expr;
                var $5108 = Kind$Term$check$($5107, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($5106));
                var self = $5108;
                break;
            case 'Kind.Term.typ':
                var $5109 = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                var self = $5109;
                break;
            case 'Kind.Term.hol':
                var $5110 = Kind$Check$result$(_type$2, List$nil);
                var self = $5110;
                break;
            case 'Kind.Term.nat':
                var $5111 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Nat")), List$nil);
                var self = $5111;
                break;
            case 'Kind.Term.chr':
                var $5112 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Char")), List$nil);
                var self = $5112;
                break;
            case 'Kind.Term.str':
                var $5113 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("String")), List$nil);
                var self = $5113;
                break;
        };
        switch (self._) {
            case 'Kind.Check.result':
                var $5114 = self.value;
                var $5115 = self.errors;
                var self = $5114;
                switch (self._) {
                    case 'Maybe.some':
                        var $5117 = self.value;
                        var self = _type$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5119 = self.value;
                                var self = Kind$Term$equal$($5119, $5117, _defs$3, (list_length(_ctx$4)), BitsSet$mut$new$(Unit$new));
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5121 = self.value;
                                        var $5122 = self.errors;
                                        var self = $5121;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5124 = self.value;
                                                var self = $5124;
                                                if (self) {
                                                    var $5126 = Kind$Check$result$(Maybe$some$($5119), List$nil);
                                                    var self = $5126;
                                                } else {
                                                    var $5127 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, Either$right$($5119), Either$right$($5117), _ctx$4), List$nil));
                                                    var self = $5127;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5128 = self.value;
                                                        var $5129 = self.errors;
                                                        var $5130 = Kind$Check$result$($5128, List$concat$($5122, $5129));
                                                        var $5125 = $5130;
                                                        break;
                                                };
                                                var $5123 = $5125;
                                                break;
                                            case 'Maybe.none':
                                                var $5131 = Kind$Check$result$(Maybe$none, $5122);
                                                var $5123 = $5131;
                                                break;
                                        };
                                        var $5120 = $5123;
                                        break;
                                };
                                var self = $5120;
                                break;
                            case 'Maybe.none':
                                var $5132 = Kind$Check$result$(Maybe$some$($5117), List$nil);
                                var self = $5132;
                                break;
                        };
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $5133 = self.value;
                                var $5134 = self.errors;
                                var $5135 = Kind$Check$result$($5133, List$concat$($5115, $5134));
                                var $5118 = $5135;
                                break;
                        };
                        var $5116 = $5118;
                        break;
                    case 'Maybe.none':
                        var $5136 = Kind$Check$result$(Maybe$none, $5115);
                        var $5116 = $5136;
                        break;
                };
                var $4918 = $5116;
                break;
        };
        return $4918;
    };
    const Kind$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$check$(x0, x1, x2, x3, x4, x5);

    function Kind$Path$nil$(_x$1) {
        var $5137 = _x$1;
        return $5137;
    };
    const Kind$Path$nil = x0 => Kind$Path$nil$(x0);
    const Kind$MPath$nil = Maybe$some$(Kind$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $5139 = Bool$true;
                var $5138 = $5139;
                break;
            case 'List.cons':
                var $5140 = Bool$false;
                var $5138 = $5140;
                break;
        };
        return $5138;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kind$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.all':
                var $5142 = self.eras;
                var $5143 = self.self;
                var $5144 = self.name;
                var $5145 = self.xtyp;
                var $5146 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5148 = self.slice(0, -1);
                        var $5149 = Kind$Term$all$($5142, $5143, $5144, Kind$Term$patch_at$($5148, $5145, _fn$3), $5146);
                        var $5147 = $5149;
                        break;
                    case 'i':
                        var $5150 = self.slice(0, -1);
                        var $5151 = Kind$Term$all$($5142, $5143, $5144, $5145, (_s$10 => _x$11 => {
                            var $5152 = Kind$Term$patch_at$($5150, $5146(_s$10)(_x$11), _fn$3);
                            return $5152;
                        }));
                        var $5147 = $5151;
                        break;
                    case 'e':
                        var $5153 = _fn$3(_term$2);
                        var $5147 = $5153;
                        break;
                };
                var $5141 = $5147;
                break;
            case 'Kind.Term.lam':
                var $5154 = self.name;
                var $5155 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5157 = _fn$3(_term$2);
                        var $5156 = $5157;
                        break;
                    case 'o':
                    case 'i':
                        var $5158 = Kind$Term$lam$($5154, (_x$7 => {
                            var $5159 = Kind$Term$patch_at$(Bits$tail$(_path$1), $5155(_x$7), _fn$3);
                            return $5159;
                        }));
                        var $5156 = $5158;
                        break;
                };
                var $5141 = $5156;
                break;
            case 'Kind.Term.app':
                var $5160 = self.func;
                var $5161 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5163 = self.slice(0, -1);
                        var $5164 = Kind$Term$app$(Kind$Term$patch_at$($5163, $5160, _fn$3), $5161);
                        var $5162 = $5164;
                        break;
                    case 'i':
                        var $5165 = self.slice(0, -1);
                        var $5166 = Kind$Term$app$($5160, Kind$Term$patch_at$($5165, $5161, _fn$3));
                        var $5162 = $5166;
                        break;
                    case 'e':
                        var $5167 = _fn$3(_term$2);
                        var $5162 = $5167;
                        break;
                };
                var $5141 = $5162;
                break;
            case 'Kind.Term.let':
                var $5168 = self.name;
                var $5169 = self.expr;
                var $5170 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5172 = self.slice(0, -1);
                        var $5173 = Kind$Term$let$($5168, Kind$Term$patch_at$($5172, $5169, _fn$3), $5170);
                        var $5171 = $5173;
                        break;
                    case 'i':
                        var $5174 = self.slice(0, -1);
                        var $5175 = Kind$Term$let$($5168, $5169, (_x$8 => {
                            var $5176 = Kind$Term$patch_at$($5174, $5170(_x$8), _fn$3);
                            return $5176;
                        }));
                        var $5171 = $5175;
                        break;
                    case 'e':
                        var $5177 = _fn$3(_term$2);
                        var $5171 = $5177;
                        break;
                };
                var $5141 = $5171;
                break;
            case 'Kind.Term.def':
                var $5178 = self.name;
                var $5179 = self.expr;
                var $5180 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5182 = self.slice(0, -1);
                        var $5183 = Kind$Term$def$($5178, Kind$Term$patch_at$($5182, $5179, _fn$3), $5180);
                        var $5181 = $5183;
                        break;
                    case 'i':
                        var $5184 = self.slice(0, -1);
                        var $5185 = Kind$Term$def$($5178, $5179, (_x$8 => {
                            var $5186 = Kind$Term$patch_at$($5184, $5180(_x$8), _fn$3);
                            return $5186;
                        }));
                        var $5181 = $5185;
                        break;
                    case 'e':
                        var $5187 = _fn$3(_term$2);
                        var $5181 = $5187;
                        break;
                };
                var $5141 = $5181;
                break;
            case 'Kind.Term.ann':
                var $5188 = self.done;
                var $5189 = self.term;
                var $5190 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5192 = self.slice(0, -1);
                        var $5193 = Kind$Term$ann$($5188, Kind$Term$patch_at$($5192, $5189, _fn$3), $5190);
                        var $5191 = $5193;
                        break;
                    case 'i':
                        var $5194 = self.slice(0, -1);
                        var $5195 = Kind$Term$ann$($5188, $5189, Kind$Term$patch_at$($5194, $5190, _fn$3));
                        var $5191 = $5195;
                        break;
                    case 'e':
                        var $5196 = _fn$3(_term$2);
                        var $5191 = $5196;
                        break;
                };
                var $5141 = $5191;
                break;
            case 'Kind.Term.ori':
                var $5197 = self.orig;
                var $5198 = self.expr;
                var $5199 = Kind$Term$ori$($5197, Kind$Term$patch_at$(_path$1, $5198, _fn$3));
                var $5141 = $5199;
                break;
            case 'Kind.Term.var':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5201 = _fn$3(_term$2);
                        var $5200 = $5201;
                        break;
                    case 'o':
                    case 'i':
                        var $5202 = _term$2;
                        var $5200 = $5202;
                        break;
                };
                var $5141 = $5200;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5204 = _fn$3(_term$2);
                        var $5203 = $5204;
                        break;
                    case 'o':
                    case 'i':
                        var $5205 = _term$2;
                        var $5203 = $5205;
                        break;
                };
                var $5141 = $5203;
                break;
            case 'Kind.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5207 = _fn$3(_term$2);
                        var $5206 = $5207;
                        break;
                    case 'o':
                    case 'i':
                        var $5208 = _term$2;
                        var $5206 = $5208;
                        break;
                };
                var $5141 = $5206;
                break;
            case 'Kind.Term.gol':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5210 = _fn$3(_term$2);
                        var $5209 = $5210;
                        break;
                    case 'o':
                    case 'i':
                        var $5211 = _term$2;
                        var $5209 = $5211;
                        break;
                };
                var $5141 = $5209;
                break;
            case 'Kind.Term.cse':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5213 = _fn$3(_term$2);
                        var $5212 = $5213;
                        break;
                    case 'o':
                    case 'i':
                        var $5214 = _term$2;
                        var $5212 = $5214;
                        break;
                };
                var $5141 = $5212;
                break;
        };
        return $5141;
    };
    const Kind$Term$patch_at = x0 => x1 => x2 => Kind$Term$patch_at$(x0, x1, x2);

    function Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, _errs$10, _fixd$11) {
        var self = _errs$10;
        switch (self._) {
            case 'List.cons':
                var $5216 = self.head;
                var $5217 = self.tail;
                var self = $5216;
                switch (self._) {
                    case 'Kind.Error.waiting':
                        var $5219 = self.name;
                        var $5220 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                            var $5221 = _m$bind$15;
                            return $5221;
                        }))(Kind$Synth$one$($5219, _defs$9))((_new_defs$15 => {
                            var self = _new_defs$15;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5223 = self.value;
                                    var $5224 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5223, $5217, Bool$true);
                                    var $5222 = $5224;
                                    break;
                                case 'Maybe.none':
                                    var $5225 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5217, _fixd$11);
                                    var $5222 = $5225;
                                    break;
                            };
                            return $5222;
                        }));
                        var $5218 = $5220;
                        break;
                    case 'Kind.Error.patch':
                        var $5226 = self.path;
                        var $5227 = self.term;
                        var self = $5226;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $5229 = self.slice(0, -1);
                                var _term$17 = Kind$Term$patch_at$($5229, _term$5, (_x$17 => {
                                    var $5231 = $5227;
                                    return $5231;
                                }));
                                var $5230 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$17, _type$6, _isct$7, _arit$8, _defs$9, $5217, Bool$true);
                                var $5228 = $5230;
                                break;
                            case 'i':
                                var $5232 = self.slice(0, -1);
                                var _type$17 = Kind$Term$patch_at$($5232, _type$6, (_x$17 => {
                                    var $5234 = $5227;
                                    return $5234;
                                }));
                                var $5233 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$17, _isct$7, _arit$8, _defs$9, $5217, Bool$true);
                                var $5228 = $5233;
                                break;
                            case 'e':
                                var $5235 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $5236 = _m$pure$17;
                                    return $5236;
                                }))(Maybe$none);
                                var $5228 = $5235;
                                break;
                        };
                        var $5218 = $5228;
                        break;
                    case 'Kind.Error.undefined_reference':
                        var $5237 = self.name;
                        var $5238 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                            var $5239 = _m$bind$16;
                            return $5239;
                        }))(Kind$Synth$one$($5237, _defs$9))((_new_defs$16 => {
                            var self = _new_defs$16;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5241 = self.value;
                                    var $5242 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5241, $5217, Bool$true);
                                    var $5240 = $5242;
                                    break;
                                case 'Maybe.none':
                                    var $5243 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5217, _fixd$11);
                                    var $5240 = $5243;
                                    break;
                            };
                            return $5240;
                        }));
                        var $5218 = $5238;
                        break;
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.cant_infer':
                        var $5244 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5217, _fixd$11);
                        var $5218 = $5244;
                        break;
                };
                var $5215 = $5218;
                break;
            case 'List.nil':
                var self = _fixd$11;
                if (self) {
                    var _type$12 = Kind$Term$bind$(List$nil, (_x$12 => {
                        var $5247 = (_x$12 + '1');
                        return $5247;
                    }), _type$6);
                    var _term$13 = Kind$Term$bind$(List$nil, (_x$13 => {
                        var $5248 = (_x$13 + '0');
                        return $5248;
                    }), _term$5);
                    var _defs$14 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$13, _type$12, _isct$7, _arit$8, Kind$Status$init), _defs$9);
                    var $5246 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                        var $5249 = _m$pure$16;
                        return $5249;
                    }))(Maybe$some$(_defs$14));
                    var $5245 = $5246;
                } else {
                    var $5250 = IO$monad$((_m$bind$12 => _m$pure$13 => {
                        var $5251 = _m$pure$13;
                        return $5251;
                    }))(Maybe$none);
                    var $5245 = $5250;
                };
                var $5215 = $5245;
                break;
        };
        return $5215;
    };
    const Kind$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Kind$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);

    function Kind$Status$fail$(_errors$1) {
        var $5252 = ({
            _: 'Kind.Status.fail',
            'errors': _errors$1
        });
        return $5252;
    };
    const Kind$Status$fail = x0 => Kind$Status$fail$(x0);

    function Kind$Synth$one$(_name$1, _defs$2) {
        var self = Kind$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.some':
                var $5254 = self.value;
                var self = $5254;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5256 = self.file;
                        var $5257 = self.code;
                        var $5258 = self.orig;
                        var $5259 = self.name;
                        var $5260 = self.term;
                        var $5261 = self.type;
                        var $5262 = self.isct;
                        var $5263 = self.arit;
                        var $5264 = self.stat;
                        var _file$13 = $5256;
                        var _code$14 = $5257;
                        var _orig$15 = $5258;
                        var _name$16 = $5259;
                        var _term$17 = $5260;
                        var _type$18 = $5261;
                        var _isct$19 = $5262;
                        var _arit$20 = $5263;
                        var _stat$21 = $5264;
                        var self = _stat$21;
                        switch (self._) {
                            case 'Kind.Status.init':
                                var _defs$22 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Kind$Status$wait), _defs$2);
                                var self = Kind$Term$check$(_type$18, Maybe$some$(Kind$Term$typ), _defs$22, List$nil, Kind$MPath$i$(Kind$MPath$nil), Maybe$none);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5267 = self.value;
                                        var $5268 = self.errors;
                                        var self = $5267;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5270 = Kind$Check$result$(Maybe$none, $5268);
                                                var $5269 = $5270;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Term$check$(_term$17, Maybe$some$(_type$18), _defs$22, List$nil, Kind$MPath$o$(Kind$MPath$nil), Maybe$none);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5272 = self.value;
                                                        var $5273 = self.errors;
                                                        var self = $5272;
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $5275 = Kind$Check$result$(Maybe$none, $5273);
                                                                var $5274 = $5275;
                                                                break;
                                                            case 'Maybe.some':
                                                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                                                switch (self._) {
                                                                    case 'Kind.Check.result':
                                                                        var $5277 = self.value;
                                                                        var $5278 = self.errors;
                                                                        var $5279 = Kind$Check$result$($5277, List$concat$($5273, $5278));
                                                                        var $5276 = $5279;
                                                                        break;
                                                                };
                                                                var $5274 = $5276;
                                                                break;
                                                        };
                                                        var self = $5274;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5280 = self.value;
                                                        var $5281 = self.errors;
                                                        var $5282 = Kind$Check$result$($5280, List$concat$($5268, $5281));
                                                        var $5271 = $5282;
                                                        break;
                                                };
                                                var $5269 = $5271;
                                                break;
                                        };
                                        var _checked$23 = $5269;
                                        break;
                                };
                                var self = _checked$23;
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5283 = self.errors;
                                        var self = List$is_empty$($5283);
                                        if (self) {
                                            var _defs$26 = Kind$define$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Bool$true, _defs$22);
                                            var $5285 = IO$monad$((_m$bind$27 => _m$pure$28 => {
                                                var $5286 = _m$pure$28;
                                                return $5286;
                                            }))(Maybe$some$(_defs$26));
                                            var $5284 = $5285;
                                        } else {
                                            var $5287 = IO$monad$((_m$bind$26 => _m$pure$27 => {
                                                var $5288 = _m$bind$26;
                                                return $5288;
                                            }))(Kind$Synth$fix$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _defs$22, $5283, Bool$false))((_fixed$26 => {
                                                var self = _fixed$26;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $5290 = self.value;
                                                        var $5291 = Kind$Synth$one$(_name$16, $5290);
                                                        var $5289 = $5291;
                                                        break;
                                                    case 'Maybe.none':
                                                        var _stat$27 = Kind$Status$fail$($5283);
                                                        var _defs$28 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _stat$27), _defs$22);
                                                        var $5292 = IO$monad$((_m$bind$29 => _m$pure$30 => {
                                                            var $5293 = _m$pure$30;
                                                            return $5293;
                                                        }))(Maybe$some$(_defs$28));
                                                        var $5289 = $5292;
                                                        break;
                                                };
                                                return $5289;
                                            }));
                                            var $5284 = $5287;
                                        };
                                        var $5266 = $5284;
                                        break;
                                };
                                var $5265 = $5266;
                                break;
                            case 'Kind.Status.wait':
                            case 'Kind.Status.done':
                                var $5294 = IO$monad$((_m$bind$22 => _m$pure$23 => {
                                    var $5295 = _m$pure$23;
                                    return $5295;
                                }))(Maybe$some$(_defs$2));
                                var $5265 = $5294;
                                break;
                            case 'Kind.Status.fail':
                                var $5296 = IO$monad$((_m$bind$23 => _m$pure$24 => {
                                    var $5297 = _m$pure$24;
                                    return $5297;
                                }))(Maybe$some$(_defs$2));
                                var $5265 = $5296;
                                break;
                        };
                        var $5255 = $5265;
                        break;
                };
                var $5253 = $5255;
                break;
            case 'Maybe.none':
                var $5298 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5299 = _m$bind$3;
                    return $5299;
                }))(Kind$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5301 = self.value;
                            var $5302 = Kind$Synth$one$(_name$1, $5301);
                            var $5300 = $5302;
                            break;
                        case 'Maybe.none':
                            var $5303 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                                var $5304 = _m$pure$5;
                                return $5304;
                            }))(Maybe$none);
                            var $5300 = $5303;
                            break;
                    };
                    return $5300;
                }));
                var $5253 = $5298;
                break;
        };
        return $5253;
    };
    const Kind$Synth$one = x0 => x1 => Kind$Synth$one$(x0, x1);

    function BitsMap$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'BitsMap.tie':
                var $5306 = self.val;
                var $5307 = self.lft;
                var $5308 = self.rgt;
                var self = $5306;
                switch (self._) {
                    case 'Maybe.some':
                        var $5310 = self.value;
                        var $5311 = Maybe$some$(_fn$3($5310));
                        var _val$8 = $5311;
                        break;
                    case 'Maybe.none':
                        var $5312 = Maybe$none;
                        var _val$8 = $5312;
                        break;
                };
                var _lft$9 = BitsMap$map$(_fn$3, $5307);
                var _rgt$10 = BitsMap$map$(_fn$3, $5308);
                var $5309 = BitsMap$tie$(_val$8, _lft$9, _rgt$10);
                var $5305 = $5309;
                break;
            case 'BitsMap.new':
                var $5313 = BitsMap$new;
                var $5305 = $5313;
                break;
        };
        return $5305;
    };
    const BitsMap$map = x0 => x1 => BitsMap$map$(x0, x1);
    const Kind$Term$inline$names = (() => {
        var _inl$1 = List$cons$("Monad.pure", List$cons$("Monad.bind", List$cons$("Monad.new", List$cons$("Parser.monad", List$cons$("Parser.bind", List$cons$("Parser.pure", List$cons$("Kind.Check.pure", List$cons$("Kind.Check.bind", List$cons$("Kind.Check.monad", List$cons$("Kind.Check.value", List$cons$("Kind.Check.none", List$nil)))))))))));
        var _kvs$2 = List$mapped$(_inl$1, (_x$2 => {
            var $5315 = Pair$new$((kind_name_to_bits(_x$2)), Unit$new);
            return $5315;
        }));
        var $5314 = BitsMap$from_list$(_kvs$2);
        return $5314;
    })();

    function Kind$Term$inline$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5317 = self.name;
                var _inli$4 = BitsSet$has$((kind_name_to_bits($5317)), Kind$Term$inline$names);
                var self = _inli$4;
                if (self) {
                    var self = Kind$get$($5317, _defs$2);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5320 = self.value;
                            var self = $5320;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5322 = self.term;
                                    var $5323 = Kind$Term$inline$reduce$($5322, _defs$2);
                                    var $5321 = $5323;
                                    break;
                            };
                            var $5319 = $5321;
                            break;
                        case 'Maybe.none':
                            var $5324 = Kind$Term$ref$($5317);
                            var $5319 = $5324;
                            break;
                    };
                    var $5318 = $5319;
                } else {
                    var $5325 = _term$1;
                    var $5318 = $5325;
                };
                var $5316 = $5318;
                break;
            case 'Kind.Term.app':
                var $5326 = self.func;
                var $5327 = self.argm;
                var _func$5 = Kind$Term$inline$reduce$($5326, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $5329 = self.body;
                        var $5330 = Kind$Term$inline$reduce$($5329($5327), _defs$2);
                        var $5328 = $5330;
                        break;
                    case 'Kind.Term.let':
                        var $5331 = self.name;
                        var $5332 = self.expr;
                        var $5333 = self.body;
                        var $5334 = Kind$Term$let$($5331, $5332, (_x$9 => {
                            var $5335 = Kind$Term$inline$reduce$(Kind$Term$app$($5333(_x$9), $5327), _defs$2);
                            return $5335;
                        }));
                        var $5328 = $5334;
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
                        var $5336 = _term$1;
                        var $5328 = $5336;
                        break;
                };
                var $5316 = $5328;
                break;
            case 'Kind.Term.ori':
                var $5337 = self.expr;
                var $5338 = Kind$Term$inline$reduce$($5337, _defs$2);
                var $5316 = $5338;
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
                var $5339 = _term$1;
                var $5316 = $5339;
                break;
        };
        return $5316;
    };
    const Kind$Term$inline$reduce = x0 => x1 => Kind$Term$inline$reduce$(x0, x1);

    function Kind$Term$inline$(_term$1, _defs$2) {
        var self = Kind$Term$inline$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $5341 = self.name;
                var $5342 = self.indx;
                var $5343 = Kind$Term$var$($5341, $5342);
                var $5340 = $5343;
                break;
            case 'Kind.Term.ref':
                var $5344 = self.name;
                var $5345 = Kind$Term$ref$($5344);
                var $5340 = $5345;
                break;
            case 'Kind.Term.all':
                var $5346 = self.eras;
                var $5347 = self.self;
                var $5348 = self.name;
                var $5349 = self.xtyp;
                var $5350 = self.body;
                var $5351 = Kind$Term$all$($5346, $5347, $5348, Kind$Term$inline$($5349, _defs$2), (_s$8 => _x$9 => {
                    var $5352 = Kind$Term$inline$($5350(_s$8)(_x$9), _defs$2);
                    return $5352;
                }));
                var $5340 = $5351;
                break;
            case 'Kind.Term.lam':
                var $5353 = self.name;
                var $5354 = self.body;
                var $5355 = Kind$Term$lam$($5353, (_x$5 => {
                    var $5356 = Kind$Term$inline$($5354(_x$5), _defs$2);
                    return $5356;
                }));
                var $5340 = $5355;
                break;
            case 'Kind.Term.app':
                var $5357 = self.func;
                var $5358 = self.argm;
                var $5359 = Kind$Term$app$(Kind$Term$inline$($5357, _defs$2), Kind$Term$inline$($5358, _defs$2));
                var $5340 = $5359;
                break;
            case 'Kind.Term.let':
                var $5360 = self.name;
                var $5361 = self.expr;
                var $5362 = self.body;
                var $5363 = Kind$Term$let$($5360, Kind$Term$inline$($5361, _defs$2), (_x$6 => {
                    var $5364 = Kind$Term$inline$($5362(_x$6), _defs$2);
                    return $5364;
                }));
                var $5340 = $5363;
                break;
            case 'Kind.Term.def':
                var $5365 = self.name;
                var $5366 = self.expr;
                var $5367 = self.body;
                var $5368 = Kind$Term$def$($5365, Kind$Term$inline$($5366, _defs$2), (_x$6 => {
                    var $5369 = Kind$Term$inline$($5367(_x$6), _defs$2);
                    return $5369;
                }));
                var $5340 = $5368;
                break;
            case 'Kind.Term.ann':
                var $5370 = self.done;
                var $5371 = self.term;
                var $5372 = self.type;
                var $5373 = Kind$Term$ann$($5370, Kind$Term$inline$($5371, _defs$2), Kind$Term$inline$($5372, _defs$2));
                var $5340 = $5373;
                break;
            case 'Kind.Term.gol':
                var $5374 = self.name;
                var $5375 = self.dref;
                var $5376 = self.verb;
                var $5377 = Kind$Term$gol$($5374, $5375, $5376);
                var $5340 = $5377;
                break;
            case 'Kind.Term.hol':
                var $5378 = self.path;
                var $5379 = Kind$Term$hol$($5378);
                var $5340 = $5379;
                break;
            case 'Kind.Term.nat':
                var $5380 = self.natx;
                var $5381 = Kind$Term$nat$($5380);
                var $5340 = $5381;
                break;
            case 'Kind.Term.chr':
                var $5382 = self.chrx;
                var $5383 = Kind$Term$chr$($5382);
                var $5340 = $5383;
                break;
            case 'Kind.Term.str':
                var $5384 = self.strx;
                var $5385 = Kind$Term$str$($5384);
                var $5340 = $5385;
                break;
            case 'Kind.Term.ori':
                var $5386 = self.expr;
                var $5387 = Kind$Term$inline$($5386, _defs$2);
                var $5340 = $5387;
                break;
            case 'Kind.Term.typ':
                var $5388 = Kind$Term$typ;
                var $5340 = $5388;
                break;
            case 'Kind.Term.cse':
                var $5389 = _term$1;
                var $5340 = $5389;
                break;
        };
        return $5340;
    };
    const Kind$Term$inline = x0 => x1 => Kind$Term$inline$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $5391 = self.val;
                var $5392 = self.lft;
                var $5393 = self.rgt;
                var self = $5391;
                switch (self._) {
                    case 'Maybe.some':
                        var $5395 = self.value;
                        var $5396 = List$cons$($5395, _list$3);
                        var _list0$7 = $5396;
                        break;
                    case 'Maybe.none':
                        var $5397 = _list$3;
                        var _list0$7 = $5397;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($5392, _list0$7);
                var _list2$9 = BitsMap$values$go$($5393, _list1$8);
                var $5394 = _list2$9;
                var $5390 = $5394;
                break;
            case 'BitsMap.new':
                var $5398 = _list$3;
                var $5390 = $5398;
                break;
        };
        return $5390;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function BitsMap$values$(_xs$2) {
        var $5399 = BitsMap$values$go$(_xs$2, List$nil);
        return $5399;
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
                        var $5401 = _name$2;
                        var $5400 = $5401;
                    } else {
                        var $5402 = (self - 1n);
                        var $5403 = (_name$2 + ("^" + Nat$show$(_brui$3)));
                        var $5400 = $5403;
                    };
                    return $5400;
                } else {
                    var $5404 = (self - 1n);
                    var self = _vars$4;
                    switch (self._) {
                        case 'List.cons':
                            var $5406 = self.head;
                            var $5407 = self.tail;
                            var self = (_name$2 === $5406);
                            if (self) {
                                var $5409 = Nat$succ$(_brui$3);
                                var _brui$8 = $5409;
                            } else {
                                var $5410 = _brui$3;
                                var _brui$8 = $5410;
                            };
                            var $5408 = Kind$Core$var_name$($5404, _name$2, _brui$8, $5407);
                            var $5405 = $5408;
                            break;
                        case 'List.nil':
                            var $5411 = "unbound";
                            var $5405 = $5411;
                            break;
                    };
                    return $5405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Core$var_name = x0 => x1 => x2 => x3 => Kind$Core$var_name$(x0, x1, x2, x3);

    function Kind$Name$show$(_name$1) {
        var $5412 = _name$1;
        return $5412;
    };
    const Kind$Name$show = x0 => Kind$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5414 = self.slice(0, -1);
                var $5415 = (2n * Bits$to_nat$($5414));
                var $5413 = $5415;
                break;
            case 'i':
                var $5416 = self.slice(0, -1);
                var $5417 = Nat$succ$((2n * Bits$to_nat$($5416)));
                var $5413 = $5417;
                break;
            case 'e':
                var $5418 = 0n;
                var $5413 = $5418;
                break;
        };
        return $5413;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $5420 = u16_to_word(self);
                var $5421 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($5420)));
                var $5419 = $5421;
                break;
        };
        return $5419;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Kind$escape$char$(_chr$1) {
        var self = (_chr$1 === Kind$backslash);
        if (self) {
            var $5423 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
            var $5422 = $5423;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $5425 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                var $5424 = $5425;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $5427 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                    var $5426 = $5427;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $5429 = String$cons$(_chr$1, String$nil);
                        var $5428 = $5429;
                    } else {
                        var $5430 = String$flatten$(List$cons$(String$cons$(Kind$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $5428 = $5430;
                    };
                    var $5426 = $5428;
                };
                var $5424 = $5426;
            };
            var $5422 = $5424;
        };
        return $5422;
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
                    var $5431 = String$reverse$(_result$2);
                    return $5431;
                } else {
                    var $5432 = self.charCodeAt(0);
                    var $5433 = self.slice(1);
                    var $5434 = Kind$escape$go$($5433, (String$reverse$(Kind$escape$char$($5432)) + _result$2));
                    return $5434;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$escape$go = x0 => x1 => Kind$escape$go$(x0, x1);

    function Kind$escape$(_str$1) {
        var $5435 = Kind$escape$go$(_str$1, "");
        return $5435;
    };
    const Kind$escape = x0 => Kind$escape$(x0);

    function Kind$Core$show$(_term$1, _indx$2, _vars$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5437 = self.name;
                var $5438 = self.indx;
                var $5439 = Kind$Core$var_name$(Nat$pred$((_indx$2 - $5438 <= 0n ? 0n : _indx$2 - $5438)), $5437, 0n, _vars$3);
                var $5436 = $5439;
                break;
            case 'Kind.Term.ref':
                var $5440 = self.name;
                var $5441 = Kind$Name$show$($5440);
                var $5436 = $5441;
                break;
            case 'Kind.Term.all':
                var $5442 = self.eras;
                var $5443 = self.self;
                var $5444 = self.name;
                var $5445 = self.xtyp;
                var $5446 = self.body;
                var _eras$9 = $5442;
                var self = _eras$9;
                if (self) {
                    var $5448 = "%";
                    var _init$10 = $5448;
                } else {
                    var $5449 = "@";
                    var _init$10 = $5449;
                };
                var _self$11 = Kind$Name$show$($5443);
                var _name$12 = Kind$Name$show$($5444);
                var _xtyp$13 = Kind$Core$show$($5445, _indx$2, _vars$3);
                var _body$14 = Kind$Core$show$($5446(Kind$Term$var$($5443, _indx$2))(Kind$Term$var$($5444, Nat$succ$(_indx$2))), Nat$succ$(Nat$succ$(_indx$2)), List$cons$($5444, List$cons$($5443, _vars$3)));
                var $5447 = String$flatten$(List$cons$(_init$10, List$cons$(_self$11, List$cons$("(", List$cons$(_name$12, List$cons$(":", List$cons$(_xtyp$13, List$cons$(") ", List$cons$(_body$14, List$nil)))))))));
                var $5436 = $5447;
                break;
            case 'Kind.Term.lam':
                var $5450 = self.name;
                var $5451 = self.body;
                var _name$6 = Kind$Name$show$($5450);
                var _body$7 = Kind$Core$show$($5451(Kind$Term$var$($5450, _indx$2)), Nat$succ$(_indx$2), List$cons$($5450, _vars$3));
                var $5452 = String$flatten$(List$cons$("#", List$cons$(_name$6, List$cons$(" ", List$cons$(_body$7, List$nil)))));
                var $5436 = $5452;
                break;
            case 'Kind.Term.app':
                var $5453 = self.func;
                var $5454 = self.argm;
                var _func$6 = Kind$Core$show$($5453, _indx$2, _vars$3);
                var _argm$7 = Kind$Core$show$($5454, _indx$2, _vars$3);
                var $5455 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(" ", List$cons$(_argm$7, List$cons$(")", List$nil))))));
                var $5436 = $5455;
                break;
            case 'Kind.Term.let':
                var $5456 = self.name;
                var $5457 = self.expr;
                var $5458 = self.body;
                var _name$7 = Kind$Name$show$($5456);
                var _expr$8 = Kind$Core$show$($5457, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5458(Kind$Term$var$($5456, _indx$2)), Nat$succ$(_indx$2), List$cons$($5456, _vars$3));
                var $5459 = String$flatten$(List$cons$("!", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5436 = $5459;
                break;
            case 'Kind.Term.def':
                var $5460 = self.name;
                var $5461 = self.expr;
                var $5462 = self.body;
                var _name$7 = Kind$Name$show$($5460);
                var _expr$8 = Kind$Core$show$($5461, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5462(Kind$Term$var$($5460, _indx$2)), Nat$succ$(_indx$2), List$cons$($5460, _vars$3));
                var $5463 = String$flatten$(List$cons$("$", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5436 = $5463;
                break;
            case 'Kind.Term.ann':
                var $5464 = self.term;
                var $5465 = self.type;
                var _term$7 = Kind$Core$show$($5464, _indx$2, _vars$3);
                var _type$8 = Kind$Core$show$($5465, _indx$2, _vars$3);
                var $5466 = String$flatten$(List$cons$("{", List$cons$(_term$7, List$cons$(":", List$cons$(_type$8, List$cons$("}", List$nil))))));
                var $5436 = $5466;
                break;
            case 'Kind.Term.nat':
                var $5467 = self.natx;
                var $5468 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($5467), List$nil)));
                var $5436 = $5468;
                break;
            case 'Kind.Term.chr':
                var $5469 = self.chrx;
                var $5470 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5469), List$cons$("\'", List$nil))));
                var $5436 = $5470;
                break;
            case 'Kind.Term.str':
                var $5471 = self.strx;
                var $5472 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5471), List$cons$("\"", List$nil))));
                var $5436 = $5472;
                break;
            case 'Kind.Term.ori':
                var $5473 = self.expr;
                var $5474 = Kind$Core$show$($5473, _indx$2, _vars$3);
                var $5436 = $5474;
                break;
            case 'Kind.Term.typ':
                var $5475 = "*";
                var $5436 = $5475;
                break;
            case 'Kind.Term.gol':
                var $5476 = "<GOL>";
                var $5436 = $5476;
                break;
            case 'Kind.Term.hol':
                var $5477 = "<HOL>";
                var $5436 = $5477;
                break;
            case 'Kind.Term.cse':
                var $5478 = "<CSE>";
                var $5436 = $5478;
                break;
        };
        return $5436;
    };
    const Kind$Core$show = x0 => x1 => x2 => Kind$Core$show$(x0, x1, x2);

    function Kind$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $5481 = _result$2;
            var $5482 = BitsMap$values$(_defs$1);
            let _result$4 = $5481;
            let _defn$3;
            while ($5482._ === 'List.cons') {
                _defn$3 = $5482.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5483 = self.name;
                        var $5484 = self.term;
                        var $5485 = self.type;
                        var $5486 = self.stat;
                        var self = $5486;
                        switch (self._) {
                            case 'Kind.Status.init':
                            case 'Kind.Status.wait':
                            case 'Kind.Status.fail':
                                var $5488 = _result$4;
                                var $5487 = $5488;
                                break;
                            case 'Kind.Status.done':
                                var _name$14 = $5483;
                                var _term$15 = Kind$Core$show$($5484, 0n, List$nil);
                                var _type$16 = Kind$Core$show$($5485, 0n, List$nil);
                                var $5489 = String$flatten$(List$cons$(_result$4, List$cons$(_name$14, List$cons$(" : ", List$cons$(_type$16, List$cons$(" = ", List$cons$(_term$15, List$cons$(";\u{a}", List$nil))))))));
                                var $5487 = $5489;
                                break;
                        };
                        var $5481 = $5487;
                        break;
                };
                _result$4 = $5481;
                $5482 = $5482.tail;
            }
            return _result$4;
        })();
        var $5479 = _result$3;
        return $5479;
    };
    const Kind$Defs$core = x0 => Kind$Defs$core$(x0);

    function Kind$to_core$io$one$(_name$1) {
        var $5490 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5491 = _m$bind$2;
            return $5491;
        }))(Kind$Synth$one$(_name$1, BitsMap$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5493 = self.value;
                    var $5494 = $5493;
                    var _defs$3 = $5494;
                    break;
                case 'Maybe.none':
                    var $5495 = BitsMap$new;
                    var _defs$3 = $5495;
                    break;
            };
            var _defs$4 = BitsMap$map$((_defn$4 => {
                var self = _defn$4;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5497 = self.file;
                        var $5498 = self.code;
                        var $5499 = self.orig;
                        var $5500 = self.name;
                        var $5501 = self.term;
                        var $5502 = self.type;
                        var $5503 = self.isct;
                        var $5504 = self.arit;
                        var $5505 = self.stat;
                        var _term$14 = Kind$Term$inline$($5501, _defs$3);
                        var _type$15 = Kind$Term$inline$($5502, _defs$3);
                        var $5506 = Kind$Def$new$($5497, $5498, $5499, $5500, _term$14, _type$15, $5503, $5504, $5505);
                        var $5496 = $5506;
                        break;
                };
                return $5496;
            }), _defs$3);
            var $5492 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                var $5507 = _m$pure$6;
                return $5507;
            }))(Kind$Defs$core$(_defs$4));
            return $5492;
        }));
        return $5490;
    };
    const Kind$to_core$io$one = x0 => Kind$to_core$io$one$(x0);

    function IO$put_string$(_text$1) {
        var $5508 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $5509 = IO$end$(Unit$new);
            return $5509;
        }));
        return $5508;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $5510 = IO$put_string$((_text$1 + "\u{a}"));
        return $5510;
    };
    const IO$print = x0 => IO$print$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $5512 = self.value;
                var $5513 = _f$4($5512);
                var $5511 = $5513;
                break;
            case 'Maybe.none':
                var $5514 = Maybe$none;
                var $5511 = $5514;
                break;
        };
        return $5511;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $5515 = _new$2(Maybe$bind)(Maybe$some);
        return $5515;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Kind$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5517 = self.name;
                var self = ($5517 === "Nat.zero");
                if (self) {
                    var $5519 = Maybe$some$(0n);
                    var $5518 = $5519;
                } else {
                    var $5520 = Maybe$none;
                    var $5518 = $5520;
                };
                var $5516 = $5518;
                break;
            case 'Kind.Term.app':
                var $5521 = self.func;
                var $5522 = self.argm;
                var self = $5521;
                switch (self._) {
                    case 'Kind.Term.ref':
                        var $5524 = self.name;
                        var self = ($5524 === "Nat.succ");
                        if (self) {
                            var $5526 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $5527 = _m$bind$5;
                                return $5527;
                            }))(Kind$Term$show$as_nat$go$($5522))((_pred$5 => {
                                var $5528 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $5529 = _m$pure$7;
                                    return $5529;
                                }))(Nat$succ$(_pred$5));
                                return $5528;
                            }));
                            var $5525 = $5526;
                        } else {
                            var $5530 = Maybe$none;
                            var $5525 = $5530;
                        };
                        var $5523 = $5525;
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
                        var $5531 = Maybe$none;
                        var $5523 = $5531;
                        break;
                };
                var $5516 = $5523;
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
                var $5532 = Maybe$none;
                var $5516 = $5532;
                break;
        };
        return $5516;
    };
    const Kind$Term$show$as_nat$go = x0 => Kind$Term$show$as_nat$go$(x0);

    function Kind$Term$show$as_nat$(_term$1) {
        var $5533 = Maybe$mapped$(Kind$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5533;
    };
    const Kind$Term$show$as_nat = x0 => Kind$Term$show$as_nat$(x0);

    function Kind$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5535 = self.name;
                var $5536 = (_name$2 === $5535);
                var $5534 = $5536;
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
                var $5537 = Bool$false;
                var $5534 = $5537;
                break;
        };
        return $5534;
    };
    const Kind$Term$show$is_ref = x0 => x1 => Kind$Term$show$is_ref$(x0, x1);

    function Kind$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Kind$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $5539 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $5538 = $5539;
        } else {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $5541 = Bool$false;
                var _wrap$6 = $5541;
            } else {
                var $5542 = self.charCodeAt(0);
                var $5543 = self.slice(1);
                var $5544 = ($5542 === 40);
                var _wrap$6 = $5544;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $5545 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $5545;
            } else {
                var $5546 = _func$5;
                var _func$8 = $5546;
            };
            var $5540 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $5538 = $5540;
        };
        return $5538;
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
                        var $5547 = self.func;
                        var $5548 = self.argm;
                        var $5549 = Kind$Term$show$app$($5547, Kind$MPath$o$(_path$2), List$cons$(Kind$Term$show$go$($5548, Kind$MPath$i$(_path$2)), _args$3));
                        return $5549;
                    case 'Kind.Term.ori':
                        var $5550 = self.expr;
                        var $5551 = Kind$Term$show$app$($5550, _path$2, _args$3);
                        return $5551;
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
                        var $5552 = Kind$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $5552;
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
                var $5554 = self.val;
                var $5555 = self.lft;
                var $5556 = self.rgt;
                var self = $5554;
                switch (self._) {
                    case 'Maybe.some':
                        var $5558 = self.value;
                        var $5559 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5558), _list$4);
                        var _list0$8 = $5559;
                        break;
                    case 'Maybe.none':
                        var $5560 = _list$4;
                        var _list0$8 = $5560;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($5555, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($5556, (_key$3 + '1'), _list1$9);
                var $5557 = _list2$10;
                var $5553 = $5557;
                break;
            case 'BitsMap.new':
                var $5561 = _list$4;
                var $5553 = $5561;
                break;
        };
        return $5553;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function BitsMap$to_list$(_xs$2) {
        var $5562 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5562;
    };
    const BitsMap$to_list = x0 => BitsMap$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5564 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5566 = List$cons$(_head$6, _tail$7);
                    var $5565 = $5566;
                } else {
                    var $5567 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5568 = Bits$chunks_of$go$(_len$1, $5564, $5567, _chunk$7);
                    var $5565 = $5568;
                };
                var $5563 = $5565;
                break;
            case 'i':
                var $5569 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5571 = List$cons$(_head$6, _tail$7);
                    var $5570 = $5571;
                } else {
                    var $5572 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5573 = Bits$chunks_of$go$(_len$1, $5569, $5572, _chunk$7);
                    var $5570 = $5573;
                };
                var $5563 = $5570;
                break;
            case 'e':
                var $5574 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5563 = $5574;
                break;
        };
        return $5563;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5575 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5575;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5577 = Word$e;
            var $5576 = $5577;
        } else {
            var $5578 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $5580 = self.slice(0, -1);
                    var $5581 = Word$o$(Word$from_bits$($5578, $5580));
                    var $5579 = $5581;
                    break;
                case 'i':
                    var $5582 = self.slice(0, -1);
                    var $5583 = Word$i$(Word$from_bits$($5578, $5582));
                    var $5579 = $5583;
                    break;
                case 'e':
                    var $5584 = Word$o$(Word$from_bits$($5578, Bits$e));
                    var $5579 = $5584;
                    break;
            };
            var $5576 = $5579;
        };
        return $5576;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Kind$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5587 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5587;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5589 = ((_u16$5 + 71) & 0xFFFF);
                    var $5588 = $5589;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5591 = (Math.max(_u16$5 - 4, 0));
                        var $5590 = $5591;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5593 = 46;
                            var $5592 = $5593;
                        } else {
                            var $5594 = 95;
                            var $5592 = $5594;
                        };
                        var $5590 = $5592;
                    };
                    var $5588 = $5590;
                };
                var _chr$6 = $5588;
            };
            var $5586 = String$cons$(_chr$6, _name$4);
            return $5586;
        }));
        var $5585 = _name$3;
        return $5585;
    };
    const Kind$Name$from_bits = x0 => Kind$Name$from_bits$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $5596 = self.fst;
                var $5597 = $5596;
                var $5595 = $5597;
                break;
        };
        return $5595;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Kind$Term$show$go$(_term$1, _path$2) {
        var self = Kind$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.some':
                var $5599 = self.value;
                var $5600 = $5599;
                var $5598 = $5600;
                break;
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $5602 = self.name;
                        var $5603 = Kind$Name$show$($5602);
                        var $5601 = $5603;
                        break;
                    case 'Kind.Term.ref':
                        var $5604 = self.name;
                        var _name$4 = Kind$Name$show$($5604);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5606 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Kind$Path$to_bits$($5606));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5607 = String$flatten$(List$cons$(_name$4, List$cons$(Kind$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5605 = $5607;
                                break;
                            case 'Maybe.none':
                                var $5608 = _name$4;
                                var $5605 = $5608;
                                break;
                        };
                        var $5601 = $5605;
                        break;
                    case 'Kind.Term.all':
                        var $5609 = self.eras;
                        var $5610 = self.self;
                        var $5611 = self.name;
                        var $5612 = self.xtyp;
                        var $5613 = self.body;
                        var _eras$8 = $5609;
                        var _self$9 = Kind$Name$show$($5610);
                        var _name$10 = Kind$Name$show$($5611);
                        var _type$11 = Kind$Term$show$go$($5612, Kind$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5615 = "<";
                            var _open$12 = $5615;
                        } else {
                            var $5616 = "(";
                            var _open$12 = $5616;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5617 = ">";
                            var _clos$13 = $5617;
                        } else {
                            var $5618 = ")";
                            var _clos$13 = $5618;
                        };
                        var _body$14 = Kind$Term$show$go$($5613(Kind$Term$var$($5610, 0n))(Kind$Term$var$($5611, 0n)), Kind$MPath$i$(_path$2));
                        var $5614 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5601 = $5614;
                        break;
                    case 'Kind.Term.lam':
                        var $5619 = self.name;
                        var $5620 = self.body;
                        var _name$5 = Kind$Name$show$($5619);
                        var _body$6 = Kind$Term$show$go$($5620(Kind$Term$var$($5619, 0n)), Kind$MPath$o$(_path$2));
                        var $5621 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5601 = $5621;
                        break;
                    case 'Kind.Term.let':
                        var $5622 = self.name;
                        var $5623 = self.expr;
                        var $5624 = self.body;
                        var _name$6 = Kind$Name$show$($5622);
                        var _expr$7 = Kind$Term$show$go$($5623, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5624(Kind$Term$var$($5622, 0n)), Kind$MPath$i$(_path$2));
                        var $5625 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5601 = $5625;
                        break;
                    case 'Kind.Term.def':
                        var $5626 = self.name;
                        var $5627 = self.expr;
                        var $5628 = self.body;
                        var _name$6 = Kind$Name$show$($5626);
                        var _expr$7 = Kind$Term$show$go$($5627, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5628(Kind$Term$var$($5626, 0n)), Kind$MPath$i$(_path$2));
                        var $5629 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5601 = $5629;
                        break;
                    case 'Kind.Term.ann':
                        var $5630 = self.term;
                        var $5631 = self.type;
                        var _term$6 = Kind$Term$show$go$($5630, Kind$MPath$o$(_path$2));
                        var _type$7 = Kind$Term$show$go$($5631, Kind$MPath$i$(_path$2));
                        var $5632 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5601 = $5632;
                        break;
                    case 'Kind.Term.gol':
                        var $5633 = self.name;
                        var _name$6 = Kind$Name$show$($5633);
                        var $5634 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5601 = $5634;
                        break;
                    case 'Kind.Term.nat':
                        var $5635 = self.natx;
                        var $5636 = String$flatten$(List$cons$(Nat$show$($5635), List$nil));
                        var $5601 = $5636;
                        break;
                    case 'Kind.Term.chr':
                        var $5637 = self.chrx;
                        var $5638 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5637), List$cons$("\'", List$nil))));
                        var $5601 = $5638;
                        break;
                    case 'Kind.Term.str':
                        var $5639 = self.strx;
                        var $5640 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5639), List$cons$("\"", List$nil))));
                        var $5601 = $5640;
                        break;
                    case 'Kind.Term.cse':
                        var $5641 = self.expr;
                        var $5642 = self.name;
                        var $5643 = self.with;
                        var $5644 = self.cses;
                        var $5645 = self.moti;
                        var _expr$9 = Kind$Term$show$go$($5641, Kind$MPath$o$(_path$2));
                        var _name$10 = Kind$Name$show$($5642);
                        var _wyth$11 = String$join$("", List$mapped$($5643, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5648 = self.name;
                                    var $5649 = self.term;
                                    var $5650 = self.type;
                                    var _name$21 = Kind$Name$show$($5648);
                                    var _type$22 = Kind$Term$show$go$($5650, Maybe$none);
                                    var _term$23 = Kind$Term$show$go$($5649, Maybe$none);
                                    var $5651 = String$flatten$(List$cons$(_name$21, List$cons$(": ", List$cons$(_type$22, List$cons$(" = ", List$cons$(_term$23, List$cons$(";", List$nil)))))));
                                    var $5647 = $5651;
                                    break;
                            };
                            return $5647;
                        })));
                        var _cses$12 = BitsMap$to_list$($5644);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Kind$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Kind$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5652 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5652;
                        })));
                        var self = $5645;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5653 = self.value;
                                var $5654 = String$flatten$(List$cons$(": ", List$cons$(Kind$Term$show$go$($5653, Maybe$none), List$nil)));
                                var _moti$14 = $5654;
                                break;
                            case 'Maybe.none':
                                var $5655 = "";
                                var _moti$14 = $5655;
                                break;
                        };
                        var $5646 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5601 = $5646;
                        break;
                    case 'Kind.Term.ori':
                        var $5656 = self.expr;
                        var $5657 = Kind$Term$show$go$($5656, _path$2);
                        var $5601 = $5657;
                        break;
                    case 'Kind.Term.typ':
                        var $5658 = "Type";
                        var $5601 = $5658;
                        break;
                    case 'Kind.Term.app':
                        var $5659 = Kind$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5601 = $5659;
                        break;
                    case 'Kind.Term.hol':
                        var $5660 = "_";
                        var $5601 = $5660;
                        break;
                };
                var $5598 = $5601;
                break;
        };
        return $5598;
    };
    const Kind$Term$show$go = x0 => x1 => Kind$Term$show$go$(x0, x1);

    function Kind$Term$show$(_term$1) {
        var $5661 = Kind$Term$show$go$(_term$1, Maybe$none);
        return $5661;
    };
    const Kind$Term$show = x0 => Kind$Term$show$(x0);

    function Kind$Defs$report$types$(_defs$1, _names$2) {
        var _types$3 = "";
        var _types$4 = (() => {
            var $5664 = _types$3;
            var $5665 = _names$2;
            let _types$5 = $5664;
            let _name$4;
            while ($5665._ === 'List.cons') {
                _name$4 = $5665.head;
                var self = Kind$get$(_name$4, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5666 = self.value;
                        var self = $5666;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5668 = self.type;
                                var $5669 = (_types$5 + (_name$4 + (": " + (Kind$Term$show$($5668) + "\u{a}"))));
                                var $5667 = $5669;
                                break;
                        };
                        var $5664 = $5667;
                        break;
                    case 'Maybe.none':
                        var $5670 = _types$5;
                        var $5664 = $5670;
                        break;
                };
                _types$5 = $5664;
                $5665 = $5665.tail;
            }
            return _types$5;
        })();
        var $5662 = _types$4;
        return $5662;
    };
    const Kind$Defs$report$types = x0 => x1 => Kind$Defs$report$types$(x0, x1);

    function BitsMap$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $5672 = self.val;
                var $5673 = self.lft;
                var $5674 = self.rgt;
                var self = $5672;
                switch (self._) {
                    case 'Maybe.none':
                        var $5676 = _list$4;
                        var _list0$8 = $5676;
                        break;
                    case 'Maybe.some':
                        var $5677 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5677;
                        break;
                };
                var _list1$9 = BitsMap$keys$go$($5673, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$keys$go$($5674, (_key$3 + '1'), _list1$9);
                var $5675 = _list2$10;
                var $5671 = $5675;
                break;
            case 'BitsMap.new':
                var $5678 = _list$4;
                var $5671 = $5678;
                break;
        };
        return $5671;
    };
    const BitsMap$keys$go = x0 => x1 => x2 => BitsMap$keys$go$(x0, x1, x2);

    function BitsMap$keys$(_xs$2) {
        var $5679 = List$reverse$(BitsMap$keys$go$(_xs$2, Bits$e, List$nil));
        return $5679;
    };
    const BitsMap$keys = x0 => BitsMap$keys$(x0);

    function Kind$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.cons':
                var $5681 = self.head;
                var $5682 = self.tail;
                var self = $5681;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                    case 'Kind.Error.cant_infer':
                        var $5684 = (!_got$2);
                        var _keep$5 = $5684;
                        break;
                    case 'Kind.Error.show_goal':
                        var $5685 = Bool$true;
                        var _keep$5 = $5685;
                        break;
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                        var $5686 = Bool$false;
                        var _keep$5 = $5686;
                        break;
                };
                var self = $5681;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                        var $5687 = Bool$true;
                        var _got$6 = $5687;
                        break;
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                    case 'Kind.Error.cant_infer':
                        var $5688 = _got$2;
                        var _got$6 = $5688;
                        break;
                };
                var _tail$7 = Kind$Error$relevant$($5682, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5689 = List$cons$($5681, _tail$7);
                    var $5683 = $5689;
                } else {
                    var $5690 = _tail$7;
                    var $5683 = $5690;
                };
                var $5680 = $5683;
                break;
            case 'List.nil':
                var $5691 = List$nil;
                var $5680 = $5691;
                break;
        };
        return $5680;
    };
    const Kind$Error$relevant = x0 => x1 => Kind$Error$relevant$(x0, x1);

    function Kind$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.cons':
                var $5693 = self.head;
                var $5694 = self.tail;
                var self = $5693;
                switch (self._) {
                    case 'Pair.new':
                        var $5696 = self.fst;
                        var $5697 = self.snd;
                        var _name$6 = Kind$Name$show$($5696);
                        var _type$7 = Kind$Term$show$(Kind$Term$normalize$($5697, BitsMap$new));
                        var _rest$8 = Kind$Context$show$($5694);
                        var $5698 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5695 = $5698;
                        break;
                };
                var $5692 = $5695;
                break;
            case 'List.nil':
                var $5699 = "";
                var $5692 = $5699;
                break;
        };
        return $5692;
    };
    const Kind$Context$show = x0 => Kind$Context$show$(x0);

    function Kind$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5700 = Kind$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Kind.Term.ref':
                    var $5702 = self.name;
                    var self = Kind$get$($5702, _defs$3);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5704 = self.value;
                            var self = $5704;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5706 = self.term;
                                    var $5707 = $5706;
                                    var $5705 = $5707;
                                    break;
                            };
                            var $5703 = $5705;
                            break;
                        case 'Maybe.none':
                            var $5708 = Kind$Term$ref$($5702);
                            var $5703 = $5708;
                            break;
                    };
                    var $5701 = $5703;
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
                    var $5709 = _term$4;
                    var $5701 = $5709;
                    break;
            };
            return $5701;
        }));
        return $5700;
    };
    const Kind$Term$expand_at = x0 => x1 => x2 => Kind$Term$expand_at$(x0, x1, x2);

    function Kind$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5711 = self.name;
                var $5712 = self.indx;
                var $5713 = Kind$Term$var$($5711, $5712);
                var $5710 = $5713;
                break;
            case 'Kind.Term.ref':
                var $5714 = self.name;
                var self = Kind$get$($5714, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $5716 = self.value;
                        var self = $5716;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5718 = self.term;
                                var $5719 = self.isct;
                                var $5720 = self.arit;
                                var self = ($5719 && (_arity$3 > $5720));
                                if (self) {
                                    var $5722 = $5718;
                                    var $5721 = $5722;
                                } else {
                                    var $5723 = Kind$Term$ref$($5714);
                                    var $5721 = $5723;
                                };
                                var $5717 = $5721;
                                break;
                        };
                        var $5715 = $5717;
                        break;
                    case 'Maybe.none':
                        var $5724 = Kind$Term$ref$($5714);
                        var $5715 = $5724;
                        break;
                };
                var $5710 = $5715;
                break;
            case 'Kind.Term.all':
                var $5725 = self.eras;
                var $5726 = self.self;
                var $5727 = self.name;
                var $5728 = self.xtyp;
                var $5729 = self.body;
                var $5730 = Kind$Term$all$($5725, $5726, $5727, Kind$Term$expand_ct$($5728, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5731 = Kind$Term$expand_ct$($5729(_s$9)(_x$10), _defs$2, 0n);
                    return $5731;
                }));
                var $5710 = $5730;
                break;
            case 'Kind.Term.lam':
                var $5732 = self.name;
                var $5733 = self.body;
                var $5734 = Kind$Term$lam$($5732, (_x$6 => {
                    var $5735 = Kind$Term$expand_ct$($5733(_x$6), _defs$2, 0n);
                    return $5735;
                }));
                var $5710 = $5734;
                break;
            case 'Kind.Term.app':
                var $5736 = self.func;
                var $5737 = self.argm;
                var $5738 = Kind$Term$app$(Kind$Term$expand_ct$($5736, _defs$2, Nat$succ$(_arity$3)), Kind$Term$expand_ct$($5737, _defs$2, 0n));
                var $5710 = $5738;
                break;
            case 'Kind.Term.let':
                var $5739 = self.name;
                var $5740 = self.expr;
                var $5741 = self.body;
                var $5742 = Kind$Term$let$($5739, Kind$Term$expand_ct$($5740, _defs$2, 0n), (_x$7 => {
                    var $5743 = Kind$Term$expand_ct$($5741(_x$7), _defs$2, 0n);
                    return $5743;
                }));
                var $5710 = $5742;
                break;
            case 'Kind.Term.def':
                var $5744 = self.name;
                var $5745 = self.expr;
                var $5746 = self.body;
                var $5747 = Kind$Term$def$($5744, Kind$Term$expand_ct$($5745, _defs$2, 0n), (_x$7 => {
                    var $5748 = Kind$Term$expand_ct$($5746(_x$7), _defs$2, 0n);
                    return $5748;
                }));
                var $5710 = $5747;
                break;
            case 'Kind.Term.ann':
                var $5749 = self.done;
                var $5750 = self.term;
                var $5751 = self.type;
                var $5752 = Kind$Term$ann$($5749, Kind$Term$expand_ct$($5750, _defs$2, 0n), Kind$Term$expand_ct$($5751, _defs$2, 0n));
                var $5710 = $5752;
                break;
            case 'Kind.Term.gol':
                var $5753 = self.name;
                var $5754 = self.dref;
                var $5755 = self.verb;
                var $5756 = Kind$Term$gol$($5753, $5754, $5755);
                var $5710 = $5756;
                break;
            case 'Kind.Term.hol':
                var $5757 = self.path;
                var $5758 = Kind$Term$hol$($5757);
                var $5710 = $5758;
                break;
            case 'Kind.Term.nat':
                var $5759 = self.natx;
                var $5760 = Kind$Term$nat$($5759);
                var $5710 = $5760;
                break;
            case 'Kind.Term.chr':
                var $5761 = self.chrx;
                var $5762 = Kind$Term$chr$($5761);
                var $5710 = $5762;
                break;
            case 'Kind.Term.str':
                var $5763 = self.strx;
                var $5764 = Kind$Term$str$($5763);
                var $5710 = $5764;
                break;
            case 'Kind.Term.ori':
                var $5765 = self.orig;
                var $5766 = self.expr;
                var $5767 = Kind$Term$ori$($5765, $5766);
                var $5710 = $5767;
                break;
            case 'Kind.Term.typ':
                var $5768 = Kind$Term$typ;
                var $5710 = $5768;
                break;
            case 'Kind.Term.cse':
                var $5769 = _term$1;
                var $5710 = $5769;
                break;
        };
        return $5710;
    };
    const Kind$Term$expand_ct = x0 => x1 => x2 => Kind$Term$expand_ct$(x0, x1, x2);

    function Kind$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Kind$Term$normalize$(_term$2, BitsMap$new);
        var _term$5 = (() => {
            var $5772 = _term$4;
            var $5773 = _dref$1;
            let _term$6 = $5772;
            let _path$5;
            while ($5773._ === 'List.cons') {
                _path$5 = $5773.head;
                var _term$7 = Kind$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Kind$Term$normalize$(_term$7, BitsMap$new);
                var _term$9 = Kind$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Kind$Term$normalize$(_term$9, BitsMap$new);
                var $5772 = _term$10;
                _term$6 = $5772;
                $5773 = $5773.tail;
            }
            return _term$6;
        })();
        var $5770 = _term$5;
        return $5770;
    };
    const Kind$Term$expand = x0 => x1 => x2 => Kind$Term$expand$(x0, x1, x2);

    function Kind$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5775 = self.expected;
                var $5776 = self.detected;
                var $5777 = self.context;
                var self = $5775;
                switch (self._) {
                    case 'Either.left':
                        var $5779 = self.value;
                        var $5780 = $5779;
                        var _expected$7 = $5780;
                        break;
                    case 'Either.right':
                        var $5781 = self.value;
                        var $5782 = Kind$Term$show$(Kind$Term$normalize$($5781, BitsMap$new));
                        var _expected$7 = $5782;
                        break;
                };
                var self = $5776;
                switch (self._) {
                    case 'Either.left':
                        var $5783 = self.value;
                        var $5784 = $5783;
                        var _detected$8 = $5784;
                        break;
                    case 'Either.right':
                        var $5785 = self.value;
                        var $5786 = Kind$Term$show$(Kind$Term$normalize$($5785, BitsMap$new));
                        var _detected$8 = $5786;
                        break;
                };
                var $5778 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5777;
                    switch (self._) {
                        case 'List.nil':
                            var $5787 = "";
                            return $5787;
                        case 'List.cons':
                            var $5788 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Kind$Context$show$($5777), List$nil)));
                            return $5788;
                    };
                })(), List$nil)))))))));
                var $5774 = $5778;
                break;
            case 'Kind.Error.show_goal':
                var $5789 = self.name;
                var $5790 = self.dref;
                var $5791 = self.verb;
                var $5792 = self.goal;
                var $5793 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Kind$Name$show$($5789), List$cons$(":\u{a}", List$nil))));
                var self = $5792;
                switch (self._) {
                    case 'Maybe.some':
                        var $5795 = self.value;
                        var _goal$10 = Kind$Term$expand$($5790, $5795, _defs$2);
                        var $5796 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5791;
                            if (self) {
                                var $5797 = Kind$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5798 = _x$11;
                                    return $5798;
                                })));
                                return $5797;
                            } else {
                                var $5799 = Kind$Term$show$(_goal$10);
                                return $5799;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5796;
                        break;
                    case 'Maybe.none':
                        var $5800 = "";
                        var _with_type$9 = $5800;
                        break;
                };
                var self = $5793;
                switch (self._) {
                    case 'List.nil':
                        var $5801 = "";
                        var _with_ctxt$10 = $5801;
                        break;
                    case 'List.cons':
                        var $5802 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Kind$Context$show$($5793), List$nil)));
                        var _with_ctxt$10 = $5802;
                        break;
                };
                var $5794 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5774 = $5794;
                break;
            case 'Kind.Error.waiting':
                var $5803 = self.name;
                var $5804 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5803, List$cons$("\'.", List$nil))));
                var $5774 = $5804;
                break;
            case 'Kind.Error.indirect':
                var $5805 = self.name;
                var $5806 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5805, List$cons$("\'.", List$nil))));
                var $5774 = $5806;
                break;
            case 'Kind.Error.patch':
                var $5807 = self.term;
                var $5808 = String$flatten$(List$cons$("Patching: ", List$cons$(Kind$Term$show$($5807), List$nil)));
                var $5774 = $5808;
                break;
            case 'Kind.Error.undefined_reference':
                var $5809 = self.name;
                var $5810 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Kind$Name$show$($5809), List$cons$("\u{a}", List$nil))));
                var $5774 = $5810;
                break;
            case 'Kind.Error.cant_infer':
                var $5811 = self.term;
                var $5812 = self.context;
                var _term$6 = Kind$Term$show$($5811);
                var _context$7 = Kind$Context$show$($5812);
                var $5813 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5774 = $5813;
                break;
        };
        return $5774;
    };
    const Kind$Error$show = x0 => x1 => Kind$Error$show$(x0, x1);

    function Kind$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5815 = self.origin;
                var $5816 = $5815;
                var $5814 = $5816;
                break;
            case 'Kind.Error.undefined_reference':
                var $5817 = self.origin;
                var $5818 = $5817;
                var $5814 = $5818;
                break;
            case 'Kind.Error.cant_infer':
                var $5819 = self.origin;
                var $5820 = $5819;
                var $5814 = $5820;
                break;
            case 'Kind.Error.show_goal':
            case 'Kind.Error.waiting':
            case 'Kind.Error.indirect':
            case 'Kind.Error.patch':
                var $5821 = Maybe$none;
                var $5814 = $5821;
                break;
        };
        return $5814;
    };
    const Kind$Error$origin = x0 => Kind$Error$origin$(x0);

    function Kind$Defs$report$errors$(_defs$1) {
        var _errors$2 = "";
        var _errors$3 = (() => {
            var $5824 = _errors$2;
            var $5825 = BitsMap$keys$(_defs$1);
            let _errors$4 = $5824;
            let _key$3;
            while ($5825._ === 'List.cons') {
                _key$3 = $5825.head;
                var _name$5 = Kind$Name$from_bits$(_key$3);
                var self = Kind$get$(_name$5, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5826 = self.value;
                        var self = $5826;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5828 = self.file;
                                var $5829 = self.code;
                                var $5830 = self.name;
                                var $5831 = self.stat;
                                var self = $5831;
                                switch (self._) {
                                    case 'Kind.Status.fail':
                                        var $5833 = self.errors;
                                        var self = $5833;
                                        switch (self._) {
                                            case 'List.nil':
                                                var $5835 = _errors$4;
                                                var $5834 = $5835;
                                                break;
                                            case 'List.cons':
                                                var _name_str$19 = $5830;
                                                var _rel_errs$20 = Kind$Error$relevant$($5833, Bool$false);
                                                var _errors$21 = (() => {
                                                    var $5838 = _errors$4;
                                                    var $5839 = _rel_errs$20;
                                                    let _errors$22 = $5838;
                                                    let _err$21;
                                                    while ($5839._ === 'List.cons') {
                                                        _err$21 = $5839.head;
                                                        var _err_msg$23 = Kind$Error$show$(_err$21, _defs$1);
                                                        var self = Kind$Error$origin$(_err$21);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $5840 = self.value;
                                                                var self = $5840;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $5842 = self.fst;
                                                                        var $5843 = self.snd;
                                                                        var _inside$27 = ("Inside \'" + ($5828 + "\':\u{a}"));
                                                                        var _source$28 = Kind$highlight$($5829, $5842, $5843);
                                                                        var $5844 = (_inside$27 + (_source$28 + "\u{a}"));
                                                                        var $5841 = $5844;
                                                                        break;
                                                                };
                                                                var _ori_msg$24 = $5841;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $5845 = "";
                                                                var _ori_msg$24 = $5845;
                                                                break;
                                                        };
                                                        var $5838 = (_errors$22 + (_err_msg$23 + (_ori_msg$24 + "\u{a}")));
                                                        _errors$22 = $5838;
                                                        $5839 = $5839.tail;
                                                    }
                                                    return _errors$22;
                                                })();
                                                var $5836 = _errors$21;
                                                var $5834 = $5836;
                                                break;
                                        };
                                        var $5832 = $5834;
                                        break;
                                    case 'Kind.Status.init':
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $5846 = _errors$4;
                                        var $5832 = $5846;
                                        break;
                                };
                                var $5827 = $5832;
                                break;
                        };
                        var $5824 = $5827;
                        break;
                    case 'Maybe.none':
                        var $5847 = _errors$4;
                        var $5824 = $5847;
                        break;
                };
                _errors$4 = $5824;
                $5825 = $5825.tail;
            }
            return _errors$4;
        })();
        var $5822 = _errors$3;
        return $5822;
    };
    const Kind$Defs$report$errors = x0 => Kind$Defs$report$errors$(x0);

    function Kind$Defs$report$(_defs$1, _names$2) {
        var _types$3 = Kind$Defs$report$types$(_defs$1, _names$2);
        var _errors$4 = Kind$Defs$report$errors$(_defs$1);
        var self = _errors$4;
        if (self.length === 0) {
            var $5849 = "All terms check.";
            var _errors$5 = $5849;
        } else {
            var $5850 = self.charCodeAt(0);
            var $5851 = self.slice(1);
            var $5852 = _errors$4;
            var _errors$5 = $5852;
        };
        var $5848 = (_types$3 + ("\u{a}" + _errors$5));
        return $5848;
    };
    const Kind$Defs$report = x0 => x1 => Kind$Defs$report$(x0, x1);

    function Kind$checker$io$one$(_name$1) {
        var $5853 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5854 = _m$bind$2;
            return $5854;
        }))(Kind$Synth$one$(_name$1, BitsMap$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5856 = self.value;
                    var $5857 = IO$print$(Kind$Defs$report$($5856, List$cons$(_name$1, List$nil)));
                    var $5855 = $5857;
                    break;
                case 'Maybe.none':
                    var _notfound$3 = ("Term not found: \'" + (_name$1 + "\'."));
                    var _filelist$4 = List$mapped$(Kind$Synth$files_of$(_name$1), (_x$4 => {
                        var $5859 = ("\'" + (_x$4 + "\'"));
                        return $5859;
                    }));
                    var _searched$5 = ("Searched on: " + (String$join$(", ", _filelist$4) + "."));
                    var $5858 = IO$print$((_notfound$3 + ("\u{a}" + _searched$5)));
                    var $5855 = $5858;
                    break;
            };
            return $5855;
        }));
        return $5853;
    };
    const Kind$checker$io$one = x0 => Kind$checker$io$one$(x0);

    function Kind$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $5861 = self.head;
                var $5862 = self.tail;
                var $5863 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $5864 = _m$bind$5;
                    return $5864;
                }))(Kind$Synth$one$($5861, _defs$2))((_new_defs$5 => {
                    var self = _new_defs$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5866 = self.value;
                            var $5867 = Kind$Synth$many$($5862, $5866);
                            var $5865 = $5867;
                            break;
                        case 'Maybe.none':
                            var $5868 = Kind$Synth$many$($5862, _defs$2);
                            var $5865 = $5868;
                            break;
                    };
                    return $5865;
                }));
                var $5860 = $5863;
                break;
            case 'List.nil':
                var $5869 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5870 = _m$pure$4;
                    return $5870;
                }))(_defs$2);
                var $5860 = $5869;
                break;
        };
        return $5860;
    };
    const Kind$Synth$many = x0 => x1 => Kind$Synth$many$(x0, x1);

    function Kind$Synth$file$(_file$1, _defs$2) {
        var $5871 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $5872 = _m$bind$3;
            return $5872;
        }))(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Kind$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5874 = self.value;
                    var $5875 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $5876 = _m$pure$7;
                        return $5876;
                    }))(Either$left$($5874));
                    var $5873 = $5875;
                    break;
                case 'Either.right':
                    var $5877 = self.value;
                    var _file_defs$6 = $5877;
                    var _file_keys$7 = BitsMap$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Kind$Name$from_bits);
                    var $5878 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $5879 = _m$bind$9;
                        return $5879;
                    }))(Kind$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5880 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $5881 = _m$pure$11;
                            return $5881;
                        }))(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5880;
                    }));
                    var $5873 = $5878;
                    break;
            };
            return $5873;
        }));
        return $5871;
    };
    const Kind$Synth$file = x0 => x1 => Kind$Synth$file$(x0, x1);

    function Kind$checker$io$file$(_file$1) {
        var $5882 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5883 = _m$bind$2;
            return $5883;
        }))(Kind$Synth$file$(_file$1, BitsMap$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5885 = self.value;
                    var $5886 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                        var $5887 = _m$bind$4;
                        return $5887;
                    }))(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5888 = IO$print$($5885);
                        return $5888;
                    }));
                    var $5884 = $5886;
                    break;
                case 'Either.right':
                    var $5889 = self.value;
                    var self = $5889;
                    switch (self._) {
                        case 'Pair.new':
                            var $5891 = self.fst;
                            var $5892 = self.snd;
                            var _nams$6 = $5891;
                            var _defs$7 = $5892;
                            var self = _nams$6;
                            switch (self._) {
                                case 'List.nil':
                                    var $5894 = IO$print$(("File not found or empty: \'" + (_file$1 + "\'.")));
                                    var $5893 = $5894;
                                    break;
                                case 'List.cons':
                                    var $5895 = IO$print$(Kind$Defs$report$(_defs$7, _nams$6));
                                    var $5893 = $5895;
                                    break;
                            };
                            var $5890 = $5893;
                            break;
                    };
                    var $5884 = $5890;
                    break;
            };
            return $5884;
        }));
        return $5882;
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
                        var $5896 = self.value;
                        var $5897 = $5896;
                        return $5897;
                    case 'IO.ask':
                        var $5898 = self.then;
                        var $5899 = IO$purify$($5898(""));
                        return $5899;
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
                var $5901 = self.value;
                var $5902 = $5901;
                var $5900 = $5902;
                break;
            case 'Either.right':
                var $5903 = self.value;
                var $5904 = IO$purify$((() => {
                    var _defs$3 = $5903;
                    var _nams$4 = List$mapped$(BitsMap$keys$(_defs$3), Kind$Name$from_bits);
                    var $5905 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $5906 = _m$bind$5;
                        return $5906;
                    }))(Kind$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5907 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $5908 = _m$pure$7;
                            return $5908;
                        }))(Kind$Defs$report$(_defs$5, _nams$4));
                        return $5907;
                    }));
                    return $5905;
                })());
                var $5900 = $5904;
                break;
        };
        return $5900;
    };
    const Kind$checker$code = x0 => Kind$checker$code$(x0);

    function Kind$Term$read$(_code$1) {
        var self = Kind$Parser$term$(0n, _code$1);
        switch (self._) {
            case 'Parser.Reply.value':
                var $5910 = self.val;
                var $5911 = Maybe$some$($5910);
                var $5909 = $5911;
                break;
            case 'Parser.Reply.error':
                var $5912 = Maybe$none;
                var $5909 = $5912;
                break;
        };
        return $5909;
    };
    const Kind$Term$read = x0 => Kind$Term$read$(x0);
    const Kind = (() => {
        var __$1 = Kind$to_core$io$one;
        var __$2 = Kind$checker$io$one;
        var __$3 = Kind$checker$io$file;
        var __$4 = Kind$checker$code;
        var __$5 = Kind$Term$read;
        var $5913 = IO$monad$((_m$bind$6 => _m$pure$7 => {
            var $5914 = _m$pure$7;
            return $5914;
        }))(Unit$new);
        return $5913;
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
        'Pair.new': Pair$new,
        'Kind.Parser.stop': Kind$Parser$stop,
        'Kind.Term.ori': Kind$Term$ori,
        'Kind.Term.typ': Kind$Term$typ,
        'Kind.Parser.type': Kind$Parser$type,
        'Kind.Term.all': Kind$Term$all,
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