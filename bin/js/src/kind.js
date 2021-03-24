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

    function Map$(_A$1) {
        var $36 = null;
        return $36;
    };
    const Map = x0 => Map$(x0);
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
                    case 'o':
                        var $37 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $39 = self.lft;
                                var $40 = Map$get$($37, $39);
                                var $38 = $40;
                                break;
                            case 'Map.new':
                                var $41 = Maybe$none;
                                var $38 = $41;
                                break;
                        };
                        return $38;
                    case 'i':
                        var $42 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $44 = self.rgt;
                                var $45 = Map$get$($42, $44);
                                var $43 = $45;
                                break;
                            case 'Map.new':
                                var $46 = Maybe$none;
                                var $43 = $46;
                                break;
                        };
                        return $43;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $48 = self.val;
                                var $49 = $48;
                                var $47 = $49;
                                break;
                            case 'Map.new':
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
    const Map$get = x0 => x1 => Map$get$(x0, x1);
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
        var $196 = Map$get$((kind_name_to_bits(_name$2)), _map$3);
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

    function Kind$Parser$log$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("log(", $1808, $1809);
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
                        var self = Parser$until$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term))($1816)($1817);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1819 = self.idx;
                                var $1820 = self.code;
                                var $1821 = self.err;
                                var $1822 = Parser$Reply$error$($1819, $1820, $1821);
                                var $1818 = $1822;
                                break;
                            case 'Parser.Reply.value':
                                var $1823 = self.idx;
                                var $1824 = self.code;
                                var $1825 = self.val;
                                var self = Kind$Parser$term$($1823, $1824);
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
                                        var _term$15 = Kind$Term$ref$("Debug.log");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                        var _args$17 = List$fold$($1825, Kind$Term$ref$("String.nil"), (_x$17 => _xs$18 => {
                                            var _arg$19 = Kind$Term$ref$("String.concat");
                                            var _arg$20 = Kind$Term$app$(_arg$19, _x$17);
                                            var _arg$21 = Kind$Term$app$(_arg$20, _xs$18);
                                            var $1835 = _arg$21;
                                            return $1835;
                                        }));
                                        var _term$18 = Kind$Term$app$(_term$16, _args$17);
                                        var _term$19 = Kind$Term$app$(_term$18, Kind$Term$lam$("x", (_x$19 => {
                                            var $1836 = $1833;
                                            return $1836;
                                        })));
                                        var self = Kind$Parser$stop$($1810, $1831, $1832);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1837 = self.idx;
                                                var $1838 = self.code;
                                                var $1839 = self.err;
                                                var $1840 = Parser$Reply$error$($1837, $1838, $1839);
                                                var $1834 = $1840;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1841 = self.idx;
                                                var $1842 = self.code;
                                                var $1843 = self.val;
                                                var $1844 = Parser$Reply$value$($1841, $1842, Kind$Term$ori$($1843, _term$19));
                                                var $1834 = $1844;
                                                break;
                                        };
                                        var $1826 = $1834;
                                        break;
                                };
                                var $1818 = $1826;
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
    const Kind$Parser$log = x0 => x1 => Kind$Parser$log$(x0, x1);

    function Kind$Parser$do$statements$(_monad_name$1) {
        var $1845 = Parser$first_of$(List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1847 = self.idx;
                    var $1848 = self.code;
                    var $1849 = self.err;
                    var $1850 = Parser$Reply$error$($1847, $1848, $1849);
                    var $1846 = $1850;
                    break;
                case 'Parser.Reply.value':
                    var $1851 = self.idx;
                    var $1852 = self.code;
                    var $1853 = self.val;
                    var self = Kind$Parser$text$("var ", $1851, $1852);
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
                            var self = Kind$Parser$name1$($1859, $1860);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1862 = self.idx;
                                    var $1863 = self.code;
                                    var $1864 = self.err;
                                    var $1865 = Parser$Reply$error$($1862, $1863, $1864);
                                    var $1861 = $1865;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1866 = self.idx;
                                    var $1867 = self.code;
                                    var $1868 = self.val;
                                    var self = Kind$Parser$text$("=", $1866, $1867);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1870 = self.idx;
                                            var $1871 = self.code;
                                            var $1872 = self.err;
                                            var $1873 = Parser$Reply$error$($1870, $1871, $1872);
                                            var $1869 = $1873;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1874 = self.idx;
                                            var $1875 = self.code;
                                            var self = Kind$Parser$term$($1874, $1875);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1877 = self.idx;
                                                    var $1878 = self.code;
                                                    var $1879 = self.err;
                                                    var $1880 = Parser$Reply$error$($1877, $1878, $1879);
                                                    var $1876 = $1880;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1881 = self.idx;
                                                    var $1882 = self.code;
                                                    var $1883 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1881, $1882);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1885 = self.idx;
                                                            var $1886 = self.code;
                                                            var $1887 = self.err;
                                                            var $1888 = Parser$Reply$error$($1885, $1886, $1887);
                                                            var $1884 = $1888;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1889 = self.idx;
                                                            var $1890 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($1889)($1890);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $1892 = self.idx;
                                                                    var $1893 = self.code;
                                                                    var $1894 = self.err;
                                                                    var $1895 = Parser$Reply$error$($1892, $1893, $1894);
                                                                    var $1891 = $1895;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $1896 = self.idx;
                                                                    var $1897 = self.code;
                                                                    var $1898 = self.val;
                                                                    var self = Kind$Parser$stop$($1853, $1896, $1897);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $1900 = self.idx;
                                                                            var $1901 = self.code;
                                                                            var $1902 = self.err;
                                                                            var $1903 = Parser$Reply$error$($1900, $1901, $1902);
                                                                            var $1899 = $1903;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $1904 = self.idx;
                                                                            var $1905 = self.code;
                                                                            var $1906 = self.val;
                                                                            var _term$28 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                                            var _term$29 = Kind$Term$app$(_term$28, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                                            var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                            var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                            var _term$32 = Kind$Term$app$(_term$31, $1883);
                                                                            var _term$33 = Kind$Term$app$(_term$32, Kind$Term$lam$($1868, (_x$33 => {
                                                                                var $1908 = $1898;
                                                                                return $1908;
                                                                            })));
                                                                            var $1907 = Parser$Reply$value$($1904, $1905, Kind$Term$ori$($1906, _term$33));
                                                                            var $1899 = $1907;
                                                                            break;
                                                                    };
                                                                    var $1891 = $1899;
                                                                    break;
                                                            };
                                                            var $1884 = $1891;
                                                            break;
                                                    };
                                                    var $1876 = $1884;
                                                    break;
                                            };
                                            var $1869 = $1876;
                                            break;
                                    };
                                    var $1861 = $1869;
                                    break;
                            };
                            var $1854 = $1861;
                            break;
                    };
                    var $1846 = $1854;
                    break;
            };
            return $1846;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1910 = self.idx;
                    var $1911 = self.code;
                    var $1912 = self.err;
                    var $1913 = Parser$Reply$error$($1910, $1911, $1912);
                    var $1909 = $1913;
                    break;
                case 'Parser.Reply.value':
                    var $1914 = self.idx;
                    var $1915 = self.code;
                    var $1916 = self.val;
                    var self = Kind$Parser$text$("let ", $1914, $1915);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1918 = self.idx;
                            var $1919 = self.code;
                            var $1920 = self.err;
                            var $1921 = Parser$Reply$error$($1918, $1919, $1920);
                            var $1917 = $1921;
                            break;
                        case 'Parser.Reply.value':
                            var $1922 = self.idx;
                            var $1923 = self.code;
                            var self = Kind$Parser$name1$($1922, $1923);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1925 = self.idx;
                                    var $1926 = self.code;
                                    var $1927 = self.err;
                                    var $1928 = Parser$Reply$error$($1925, $1926, $1927);
                                    var $1924 = $1928;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1929 = self.idx;
                                    var $1930 = self.code;
                                    var $1931 = self.val;
                                    var self = Kind$Parser$text$("=", $1929, $1930);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1933 = self.idx;
                                            var $1934 = self.code;
                                            var $1935 = self.err;
                                            var $1936 = Parser$Reply$error$($1933, $1934, $1935);
                                            var $1932 = $1936;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $1937 = self.idx;
                                            var $1938 = self.code;
                                            var self = Kind$Parser$term$($1937, $1938);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $1940 = self.idx;
                                                    var $1941 = self.code;
                                                    var $1942 = self.err;
                                                    var $1943 = Parser$Reply$error$($1940, $1941, $1942);
                                                    var $1939 = $1943;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $1944 = self.idx;
                                                    var $1945 = self.code;
                                                    var $1946 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1944, $1945);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1948 = self.idx;
                                                            var $1949 = self.code;
                                                            var $1950 = self.err;
                                                            var $1951 = Parser$Reply$error$($1948, $1949, $1950);
                                                            var $1947 = $1951;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1952 = self.idx;
                                                            var $1953 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($1952)($1953);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $1955 = self.idx;
                                                                    var $1956 = self.code;
                                                                    var $1957 = self.err;
                                                                    var $1958 = Parser$Reply$error$($1955, $1956, $1957);
                                                                    var $1954 = $1958;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $1959 = self.idx;
                                                                    var $1960 = self.code;
                                                                    var $1961 = self.val;
                                                                    var self = Kind$Parser$stop$($1916, $1959, $1960);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $1963 = self.idx;
                                                                            var $1964 = self.code;
                                                                            var $1965 = self.err;
                                                                            var $1966 = Parser$Reply$error$($1963, $1964, $1965);
                                                                            var $1962 = $1966;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $1967 = self.idx;
                                                                            var $1968 = self.code;
                                                                            var $1969 = self.val;
                                                                            var $1970 = Parser$Reply$value$($1967, $1968, Kind$Term$ori$($1969, Kind$Term$let$($1931, $1946, (_x$28 => {
                                                                                var $1971 = $1961;
                                                                                return $1971;
                                                                            }))));
                                                                            var $1962 = $1970;
                                                                            break;
                                                                    };
                                                                    var $1954 = $1962;
                                                                    break;
                                                            };
                                                            var $1947 = $1954;
                                                            break;
                                                    };
                                                    var $1939 = $1947;
                                                    break;
                                            };
                                            var $1932 = $1939;
                                            break;
                                    };
                                    var $1924 = $1932;
                                    break;
                            };
                            var $1917 = $1924;
                            break;
                    };
                    var $1909 = $1917;
                    break;
            };
            return $1909;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1973 = self.idx;
                    var $1974 = self.code;
                    var $1975 = self.err;
                    var $1976 = Parser$Reply$error$($1973, $1974, $1975);
                    var $1972 = $1976;
                    break;
                case 'Parser.Reply.value':
                    var $1977 = self.idx;
                    var $1978 = self.code;
                    var $1979 = self.val;
                    var self = Kind$Parser$text$("return ", $1977, $1978);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1981 = self.idx;
                            var $1982 = self.code;
                            var $1983 = self.err;
                            var $1984 = Parser$Reply$error$($1981, $1982, $1983);
                            var $1980 = $1984;
                            break;
                        case 'Parser.Reply.value':
                            var $1985 = self.idx;
                            var $1986 = self.code;
                            var self = Kind$Parser$term$($1985, $1986);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1988 = self.idx;
                                    var $1989 = self.code;
                                    var $1990 = self.err;
                                    var $1991 = Parser$Reply$error$($1988, $1989, $1990);
                                    var $1987 = $1991;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1992 = self.idx;
                                    var $1993 = self.code;
                                    var $1994 = self.val;
                                    var self = Parser$maybe$(Kind$Parser$text(";"), $1992, $1993);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $1996 = self.idx;
                                            var $1997 = self.code;
                                            var $1998 = self.err;
                                            var $1999 = Parser$Reply$error$($1996, $1997, $1998);
                                            var $1995 = $1999;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2000 = self.idx;
                                            var $2001 = self.code;
                                            var self = Kind$Parser$stop$($1979, $2000, $2001);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2003 = self.idx;
                                                    var $2004 = self.code;
                                                    var $2005 = self.err;
                                                    var $2006 = Parser$Reply$error$($2003, $2004, $2005);
                                                    var $2002 = $2006;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2007 = self.idx;
                                                    var $2008 = self.code;
                                                    var $2009 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.pure"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, $1994);
                                                    var $2010 = Parser$Reply$value$($2007, $2008, Kind$Term$ori$($2009, _term$22));
                                                    var $2002 = $2010;
                                                    break;
                                            };
                                            var $1995 = $2002;
                                            break;
                                    };
                                    var $1987 = $1995;
                                    break;
                            };
                            var $1980 = $1987;
                            break;
                    };
                    var $1972 = $1980;
                    break;
            };
            return $1972;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2012 = self.idx;
                    var $2013 = self.code;
                    var $2014 = self.err;
                    var $2015 = Parser$Reply$error$($2012, $2013, $2014);
                    var $2011 = $2015;
                    break;
                case 'Parser.Reply.value':
                    var $2016 = self.idx;
                    var $2017 = self.code;
                    var $2018 = self.val;
                    var self = Kind$Parser$term$($2016, $2017);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2020 = self.idx;
                            var $2021 = self.code;
                            var $2022 = self.err;
                            var $2023 = Parser$Reply$error$($2020, $2021, $2022);
                            var $2019 = $2023;
                            break;
                        case 'Parser.Reply.value':
                            var $2024 = self.idx;
                            var $2025 = self.code;
                            var $2026 = self.val;
                            var self = Parser$maybe$(Kind$Parser$text(";"), $2024, $2025);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2028 = self.idx;
                                    var $2029 = self.code;
                                    var $2030 = self.err;
                                    var $2031 = Parser$Reply$error$($2028, $2029, $2030);
                                    var $2027 = $2031;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2032 = self.idx;
                                    var $2033 = self.code;
                                    var self = Kind$Parser$do$statements$(_monad_name$1)($2032)($2033);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2035 = self.idx;
                                            var $2036 = self.code;
                                            var $2037 = self.err;
                                            var $2038 = Parser$Reply$error$($2035, $2036, $2037);
                                            var $2034 = $2038;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2039 = self.idx;
                                            var $2040 = self.code;
                                            var $2041 = self.val;
                                            var self = Kind$Parser$stop$($2018, $2039, $2040);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2043 = self.idx;
                                                    var $2044 = self.code;
                                                    var $2045 = self.err;
                                                    var $2046 = Parser$Reply$error$($2043, $2044, $2045);
                                                    var $2042 = $2046;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2047 = self.idx;
                                                    var $2048 = self.code;
                                                    var $2049 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, Kind$Term$hol$(Bits$e));
                                                    var _term$23 = Kind$Term$app$(_term$22, $2026);
                                                    var _term$24 = Kind$Term$app$(_term$23, Kind$Term$lam$("", (_x$24 => {
                                                        var $2051 = $2041;
                                                        return $2051;
                                                    })));
                                                    var $2050 = Parser$Reply$value$($2047, $2048, Kind$Term$ori$($2049, _term$24));
                                                    var $2042 = $2050;
                                                    break;
                                            };
                                            var $2034 = $2042;
                                            break;
                                    };
                                    var $2027 = $2034;
                                    break;
                            };
                            var $2019 = $2027;
                            break;
                    };
                    var $2011 = $2019;
                    break;
            };
            return $2011;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$term$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2053 = self.idx;
                    var $2054 = self.code;
                    var $2055 = self.err;
                    var $2056 = Parser$Reply$error$($2053, $2054, $2055);
                    var $2052 = $2056;
                    break;
                case 'Parser.Reply.value':
                    var $2057 = self.idx;
                    var $2058 = self.code;
                    var $2059 = self.val;
                    var self = Parser$maybe$(Kind$Parser$text(";"), $2057, $2058);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2061 = self.idx;
                            var $2062 = self.code;
                            var $2063 = self.err;
                            var $2064 = Parser$Reply$error$($2061, $2062, $2063);
                            var $2060 = $2064;
                            break;
                        case 'Parser.Reply.value':
                            var $2065 = self.idx;
                            var $2066 = self.code;
                            var $2067 = Parser$Reply$value$($2065, $2066, $2059);
                            var $2060 = $2067;
                            break;
                    };
                    var $2052 = $2060;
                    break;
            };
            return $2052;
        }), List$nil))))));
        return $1845;
    };
    const Kind$Parser$do$statements = x0 => Kind$Parser$do$statements$(x0);

    function Kind$Parser$do$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("do ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2069 = self.idx;
                var $2070 = self.code;
                var $2071 = self.err;
                var $2072 = Parser$Reply$error$($2069, $2070, $2071);
                var $2068 = $2072;
                break;
            case 'Parser.Reply.value':
                var $2073 = self.idx;
                var $2074 = self.code;
                var self = Kind$Parser$name1$($2073, $2074);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2076 = self.idx;
                        var $2077 = self.code;
                        var $2078 = self.err;
                        var $2079 = Parser$Reply$error$($2076, $2077, $2078);
                        var $2075 = $2079;
                        break;
                    case 'Parser.Reply.value':
                        var $2080 = self.idx;
                        var $2081 = self.code;
                        var $2082 = self.val;
                        var self = Kind$Parser$text$("{", $2080, $2081);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2084 = self.idx;
                                var $2085 = self.code;
                                var $2086 = self.err;
                                var $2087 = Parser$Reply$error$($2084, $2085, $2086);
                                var $2083 = $2087;
                                break;
                            case 'Parser.Reply.value':
                                var $2088 = self.idx;
                                var $2089 = self.code;
                                var self = Kind$Parser$do$statements$($2082)($2088)($2089);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2091 = self.idx;
                                        var $2092 = self.code;
                                        var $2093 = self.err;
                                        var $2094 = Parser$Reply$error$($2091, $2092, $2093);
                                        var $2090 = $2094;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2095 = self.idx;
                                        var $2096 = self.code;
                                        var $2097 = self.val;
                                        var self = Kind$Parser$text$("}", $2095, $2096);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2099 = self.idx;
                                                var $2100 = self.code;
                                                var $2101 = self.err;
                                                var $2102 = Parser$Reply$error$($2099, $2100, $2101);
                                                var $2098 = $2102;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2103 = self.idx;
                                                var $2104 = self.code;
                                                var $2105 = Parser$Reply$value$($2103, $2104, $2097);
                                                var $2098 = $2105;
                                                break;
                                        };
                                        var $2090 = $2098;
                                        break;
                                };
                                var $2083 = $2090;
                                break;
                        };
                        var $2075 = $2083;
                        break;
                };
                var $2068 = $2075;
                break;
        };
        return $2068;
    };
    const Kind$Parser$do = x0 => x1 => Kind$Parser$do$(x0, x1);

    function Kind$Term$nat$(_natx$1) {
        var $2106 = ({
            _: 'Kind.Term.nat',
            'natx': _natx$1
        });
        return $2106;
    };
    const Kind$Term$nat = x0 => Kind$Term$nat$(x0);

    function Kind$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $2108 = Kind$Term$ref$(Kind$Name$read$("Nat.zero"));
            var $2107 = $2108;
        } else {
            var $2109 = (self - 1n);
            var _func$3 = Kind$Term$ref$(Kind$Name$read$("Nat.succ"));
            var _argm$4 = Kind$Term$nat$($2109);
            var $2110 = Kind$Term$app$(_func$3, _argm$4);
            var $2107 = $2110;
        };
        return $2107;
    };
    const Kind$Term$unroll_nat = x0 => Kind$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Kind$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2112 = self.slice(0, -1);
                var $2113 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.o")), Kind$Term$unroll_chr$bits$($2112));
                var $2111 = $2113;
                break;
            case 'i':
                var $2114 = self.slice(0, -1);
                var $2115 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.i")), Kind$Term$unroll_chr$bits$($2114));
                var $2111 = $2115;
                break;
            case 'e':
                var $2116 = Kind$Term$ref$(Kind$Name$read$("Bits.e"));
                var $2111 = $2116;
                break;
        };
        return $2111;
    };
    const Kind$Term$unroll_chr$bits = x0 => Kind$Term$unroll_chr$bits$(x0);

    function Kind$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Kind$Term$ref$(Kind$Name$read$("Word.from_bits"));
        var _term$4 = Kind$Term$app$(_term$3, Kind$Term$nat$(16n));
        var _term$5 = Kind$Term$app$(_term$4, Kind$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("U16.new")), _term$5);
        var $2117 = _term$6;
        return $2117;
    };
    const Kind$Term$unroll_chr = x0 => Kind$Term$unroll_chr$(x0);

    function Kind$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $2119 = Kind$Term$ref$(Kind$Name$read$("String.nil"));
            var $2118 = $2119;
        } else {
            var $2120 = self.charCodeAt(0);
            var $2121 = self.slice(1);
            var _char$4 = Kind$Term$chr$($2120);
            var _term$5 = Kind$Term$ref$(Kind$Name$read$("String.cons"));
            var _term$6 = Kind$Term$app$(_term$5, _char$4);
            var _term$7 = Kind$Term$app$(_term$6, Kind$Term$str$($2121));
            var $2122 = _term$7;
            var $2118 = $2122;
        };
        return $2118;
    };
    const Kind$Term$unroll_str = x0 => Kind$Term$unroll_str$(x0);

    function Kind$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $2124 = self.name;
                var self = Kind$get$($2124, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $2126 = self.value;
                        var self = $2126;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $2128 = self.term;
                                var $2129 = Kind$Term$reduce$($2128, _defs$2);
                                var $2127 = $2129;
                                break;
                        };
                        var $2125 = $2127;
                        break;
                    case 'Maybe.none':
                        var $2130 = Kind$Term$ref$($2124);
                        var $2125 = $2130;
                        break;
                };
                var $2123 = $2125;
                break;
            case 'Kind.Term.app':
                var $2131 = self.func;
                var $2132 = self.argm;
                var _func$5 = Kind$Term$reduce$($2131, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $2134 = self.body;
                        var $2135 = Kind$Term$reduce$($2134($2132), _defs$2);
                        var $2133 = $2135;
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
                        var $2136 = _term$1;
                        var $2133 = $2136;
                        break;
                };
                var $2123 = $2133;
                break;
            case 'Kind.Term.let':
                var $2137 = self.expr;
                var $2138 = self.body;
                var $2139 = Kind$Term$reduce$($2138($2137), _defs$2);
                var $2123 = $2139;
                break;
            case 'Kind.Term.def':
                var $2140 = self.expr;
                var $2141 = self.body;
                var $2142 = Kind$Term$reduce$($2141($2140), _defs$2);
                var $2123 = $2142;
                break;
            case 'Kind.Term.ann':
                var $2143 = self.term;
                var $2144 = Kind$Term$reduce$($2143, _defs$2);
                var $2123 = $2144;
                break;
            case 'Kind.Term.nat':
                var $2145 = self.natx;
                var $2146 = Kind$Term$reduce$(Kind$Term$unroll_nat$($2145), _defs$2);
                var $2123 = $2146;
                break;
            case 'Kind.Term.chr':
                var $2147 = self.chrx;
                var $2148 = Kind$Term$reduce$(Kind$Term$unroll_chr$($2147), _defs$2);
                var $2123 = $2148;
                break;
            case 'Kind.Term.str':
                var $2149 = self.strx;
                var $2150 = Kind$Term$reduce$(Kind$Term$unroll_str$($2149), _defs$2);
                var $2123 = $2150;
                break;
            case 'Kind.Term.ori':
                var $2151 = self.expr;
                var $2152 = Kind$Term$reduce$($2151, _defs$2);
                var $2123 = $2152;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.cse':
                var $2153 = _term$1;
                var $2123 = $2153;
                break;
        };
        return $2123;
    };
    const Kind$Term$reduce = x0 => x1 => Kind$Term$reduce$(x0, x1);
    const Map$new = ({
        _: 'Map.new'
    });

    function Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$9) {
        var $2154 = ({
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
        return $2154;
    };
    const Kind$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Def$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const Kind$Status$init = ({
        _: 'Kind.Status.init'
    });

    function Kind$Parser$case$with$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("with", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2156 = self.idx;
                var $2157 = self.code;
                var $2158 = self.err;
                var $2159 = Parser$Reply$error$($2156, $2157, $2158);
                var $2155 = $2159;
                break;
            case 'Parser.Reply.value':
                var $2160 = self.idx;
                var $2161 = self.code;
                var self = Kind$Parser$name1$($2160, $2161);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2163 = self.idx;
                        var $2164 = self.code;
                        var $2165 = self.err;
                        var $2166 = Parser$Reply$error$($2163, $2164, $2165);
                        var $2162 = $2166;
                        break;
                    case 'Parser.Reply.value':
                        var $2167 = self.idx;
                        var $2168 = self.code;
                        var $2169 = self.val;
                        var self = Kind$Parser$text$(":", $2167, $2168);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2171 = self.idx;
                                var $2172 = self.code;
                                var $2173 = self.err;
                                var $2174 = Parser$Reply$error$($2171, $2172, $2173);
                                var $2170 = $2174;
                                break;
                            case 'Parser.Reply.value':
                                var $2175 = self.idx;
                                var $2176 = self.code;
                                var self = Kind$Parser$term$($2175, $2176);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2178 = self.idx;
                                        var $2179 = self.code;
                                        var $2180 = self.err;
                                        var $2181 = Parser$Reply$error$($2178, $2179, $2180);
                                        var $2177 = $2181;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2182 = self.idx;
                                        var $2183 = self.code;
                                        var $2184 = self.val;
                                        var self = Kind$Parser$text$("=", $2182, $2183);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2186 = self.idx;
                                                var $2187 = self.code;
                                                var $2188 = self.err;
                                                var $2189 = Parser$Reply$error$($2186, $2187, $2188);
                                                var $2185 = $2189;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2190 = self.idx;
                                                var $2191 = self.code;
                                                var self = Kind$Parser$term$($2190, $2191);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2193 = self.idx;
                                                        var $2194 = self.code;
                                                        var $2195 = self.err;
                                                        var $2196 = Parser$Reply$error$($2193, $2194, $2195);
                                                        var $2192 = $2196;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2197 = self.idx;
                                                        var $2198 = self.code;
                                                        var $2199 = self.val;
                                                        var $2200 = Parser$Reply$value$($2197, $2198, Kind$Def$new$("", "", Pair$new$(0n, 0n), $2169, $2199, $2184, Bool$false, 0n, Kind$Status$init));
                                                        var $2192 = $2200;
                                                        break;
                                                };
                                                var $2185 = $2192;
                                                break;
                                        };
                                        var $2177 = $2185;
                                        break;
                                };
                                var $2170 = $2177;
                                break;
                        };
                        var $2162 = $2170;
                        break;
                };
                var $2155 = $2162;
                break;
        };
        return $2155;
    };
    const Kind$Parser$case$with = x0 => x1 => Kind$Parser$case$with$(x0, x1);

    function Kind$Parser$case$case$(_idx$1, _code$2) {
        var self = Kind$Parser$name1$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2202 = self.idx;
                var $2203 = self.code;
                var $2204 = self.err;
                var $2205 = Parser$Reply$error$($2202, $2203, $2204);
                var $2201 = $2205;
                break;
            case 'Parser.Reply.value':
                var $2206 = self.idx;
                var $2207 = self.code;
                var $2208 = self.val;
                var self = Kind$Parser$text$(":", $2206, $2207);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2210 = self.idx;
                        var $2211 = self.code;
                        var $2212 = self.err;
                        var $2213 = Parser$Reply$error$($2210, $2211, $2212);
                        var $2209 = $2213;
                        break;
                    case 'Parser.Reply.value':
                        var $2214 = self.idx;
                        var $2215 = self.code;
                        var self = Kind$Parser$term$($2214, $2215);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2217 = self.idx;
                                var $2218 = self.code;
                                var $2219 = self.err;
                                var $2220 = Parser$Reply$error$($2217, $2218, $2219);
                                var $2216 = $2220;
                                break;
                            case 'Parser.Reply.value':
                                var $2221 = self.idx;
                                var $2222 = self.code;
                                var $2223 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text(","), $2221, $2222);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2225 = self.idx;
                                        var $2226 = self.code;
                                        var $2227 = self.err;
                                        var $2228 = Parser$Reply$error$($2225, $2226, $2227);
                                        var $2224 = $2228;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2229 = self.idx;
                                        var $2230 = self.code;
                                        var $2231 = Parser$Reply$value$($2229, $2230, Pair$new$($2208, $2223));
                                        var $2224 = $2231;
                                        break;
                                };
                                var $2216 = $2224;
                                break;
                        };
                        var $2209 = $2216;
                        break;
                };
                var $2201 = $2209;
                break;
        };
        return $2201;
    };
    const Kind$Parser$case$case = x0 => x1 => Kind$Parser$case$case$(x0, x1);

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $2232 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $2232;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2234 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2236 = self.val;
                        var $2237 = self.lft;
                        var $2238 = self.rgt;
                        var $2239 = Map$tie$($2236, Map$set$($2234, _val$3, $2237), $2238);
                        var $2235 = $2239;
                        break;
                    case 'Map.new':
                        var $2240 = Map$tie$(Maybe$none, Map$set$($2234, _val$3, Map$new), Map$new);
                        var $2235 = $2240;
                        break;
                };
                var $2233 = $2235;
                break;
            case 'i':
                var $2241 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2243 = self.val;
                        var $2244 = self.lft;
                        var $2245 = self.rgt;
                        var $2246 = Map$tie$($2243, $2244, Map$set$($2241, _val$3, $2245));
                        var $2242 = $2246;
                        break;
                    case 'Map.new':
                        var $2247 = Map$tie$(Maybe$none, Map$new, Map$set$($2241, _val$3, Map$new));
                        var $2242 = $2247;
                        break;
                };
                var $2233 = $2242;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2249 = self.lft;
                        var $2250 = self.rgt;
                        var $2251 = Map$tie$(Maybe$some$(_val$3), $2249, $2250);
                        var $2248 = $2251;
                        break;
                    case 'Map.new':
                        var $2252 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $2248 = $2252;
                        break;
                };
                var $2233 = $2248;
                break;
        };
        return $2233;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $2254 = self.head;
                var $2255 = self.tail;
                var self = $2254;
                switch (self._) {
                    case 'Pair.new':
                        var $2257 = self.fst;
                        var $2258 = self.snd;
                        var $2259 = Map$set$($2257, $2258, Map$from_list$($2255));
                        var $2256 = $2259;
                        break;
                };
                var $2253 = $2256;
                break;
            case 'List.nil':
                var $2260 = Map$new;
                var $2253 = $2260;
                break;
        };
        return $2253;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2262 = self.fst;
                var $2263 = $2262;
                var $2261 = $2263;
                break;
        };
        return $2261;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2265 = self.snd;
                var $2266 = $2265;
                var $2264 = $2266;
                break;
        };
        return $2264;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Kind$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $2267 = ({
            _: 'Kind.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $2267;
    };
    const Kind$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$cse$(x0, x1, x2, x3, x4, x5);

    function Kind$Parser$case$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2269 = self.idx;
                var $2270 = self.code;
                var $2271 = self.err;
                var $2272 = Parser$Reply$error$($2269, $2270, $2271);
                var $2268 = $2272;
                break;
            case 'Parser.Reply.value':
                var $2273 = self.idx;
                var $2274 = self.code;
                var $2275 = self.val;
                var self = Kind$Parser$text$("case ", $2273, $2274);
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
                        var self = Kind$Parser$spaces($2281)($2282);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2284 = self.idx;
                                var $2285 = self.code;
                                var $2286 = self.err;
                                var $2287 = Parser$Reply$error$($2284, $2285, $2286);
                                var $2283 = $2287;
                                break;
                            case 'Parser.Reply.value':
                                var $2288 = self.idx;
                                var $2289 = self.code;
                                var self = Kind$Parser$term$($2288, $2289);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2291 = self.idx;
                                        var $2292 = self.code;
                                        var $2293 = self.err;
                                        var $2294 = Parser$Reply$error$($2291, $2292, $2293);
                                        var $2290 = $2294;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2295 = self.idx;
                                        var $2296 = self.code;
                                        var $2297 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2300 = self.idx;
                                                    var $2301 = self.code;
                                                    var $2302 = self.err;
                                                    var $2303 = Parser$Reply$error$($2300, $2301, $2302);
                                                    var $2299 = $2303;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2304 = self.idx;
                                                    var $2305 = self.code;
                                                    var $2306 = Kind$Parser$name1$($2304, $2305);
                                                    var $2299 = $2306;
                                                    break;
                                            };
                                            return $2299;
                                        }), $2295, $2296);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2307 = self.idx;
                                                var $2308 = self.code;
                                                var $2309 = self.err;
                                                var $2310 = Parser$Reply$error$($2307, $2308, $2309);
                                                var $2298 = $2310;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2311 = self.idx;
                                                var $2312 = self.code;
                                                var $2313 = self.val;
                                                var self = $2313;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2315 = self.value;
                                                        var $2316 = $2315;
                                                        var _name$18 = $2316;
                                                        break;
                                                    case 'Maybe.none':
                                                        var self = Kind$Term$reduce$($2297, Map$new);
                                                        switch (self._) {
                                                            case 'Kind.Term.var':
                                                                var $2318 = self.name;
                                                                var $2319 = $2318;
                                                                var $2317 = $2319;
                                                                break;
                                                            case 'Kind.Term.ref':
                                                                var $2320 = self.name;
                                                                var $2321 = $2320;
                                                                var $2317 = $2321;
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
                                                                var $2322 = Kind$Name$read$("self");
                                                                var $2317 = $2322;
                                                                break;
                                                        };
                                                        var _name$18 = $2317;
                                                        break;
                                                };
                                                var self = Parser$many$(Kind$Parser$case$with)($2311)($2312);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2323 = self.idx;
                                                        var $2324 = self.code;
                                                        var $2325 = self.err;
                                                        var $2326 = Parser$Reply$error$($2323, $2324, $2325);
                                                        var $2314 = $2326;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2327 = self.idx;
                                                        var $2328 = self.code;
                                                        var $2329 = self.val;
                                                        var self = Kind$Parser$text$("{", $2327, $2328);
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
                                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$case$case)($2335)($2336);
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
                                                                        var $2344 = self.val;
                                                                        var _cses$28 = Map$from_list$(List$mapped$($2344, (_x$28 => {
                                                                            var $2346 = Pair$new$((kind_name_to_bits(Pair$fst$(_x$28))), Pair$snd$(_x$28));
                                                                            return $2346;
                                                                        })));
                                                                        var self = Parser$first_of$(List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$(":", _idx$29, _code$30);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2348 = self.idx;
                                                                                    var $2349 = self.code;
                                                                                    var $2350 = self.err;
                                                                                    var $2351 = Parser$Reply$error$($2348, $2349, $2350);
                                                                                    var $2347 = $2351;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2352 = self.idx;
                                                                                    var $2353 = self.code;
                                                                                    var self = Kind$Parser$term$($2352, $2353);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2355 = self.idx;
                                                                                            var $2356 = self.code;
                                                                                            var $2357 = self.err;
                                                                                            var $2358 = Parser$Reply$error$($2355, $2356, $2357);
                                                                                            var $2354 = $2358;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2359 = self.idx;
                                                                                            var $2360 = self.code;
                                                                                            var $2361 = self.val;
                                                                                            var $2362 = Parser$Reply$value$($2359, $2360, Maybe$some$($2361));
                                                                                            var $2354 = $2362;
                                                                                            break;
                                                                                    };
                                                                                    var $2347 = $2354;
                                                                                    break;
                                                                            };
                                                                            return $2347;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$("!", _idx$29, _code$30);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2364 = self.idx;
                                                                                    var $2365 = self.code;
                                                                                    var $2366 = self.err;
                                                                                    var $2367 = Parser$Reply$error$($2364, $2365, $2366);
                                                                                    var $2363 = $2367;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2368 = self.idx;
                                                                                    var $2369 = self.code;
                                                                                    var $2370 = Parser$Reply$value$($2368, $2369, Maybe$none);
                                                                                    var $2363 = $2370;
                                                                                    break;
                                                                            };
                                                                            return $2363;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var $2371 = Parser$Reply$value$(_idx$29, _code$30, Maybe$some$(Kind$Term$hol$(Bits$e)));
                                                                            return $2371;
                                                                        }), List$nil))))($2342)($2343);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2372 = self.idx;
                                                                                var $2373 = self.code;
                                                                                var $2374 = self.err;
                                                                                var $2375 = Parser$Reply$error$($2372, $2373, $2374);
                                                                                var $2345 = $2375;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2376 = self.idx;
                                                                                var $2377 = self.code;
                                                                                var $2378 = self.val;
                                                                                var self = Kind$Parser$stop$($2275, $2376, $2377);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2380 = self.idx;
                                                                                        var $2381 = self.code;
                                                                                        var $2382 = self.err;
                                                                                        var $2383 = Parser$Reply$error$($2380, $2381, $2382);
                                                                                        var $2379 = $2383;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2384 = self.idx;
                                                                                        var $2385 = self.code;
                                                                                        var $2386 = self.val;
                                                                                        var $2387 = Parser$Reply$value$($2384, $2385, Kind$Term$ori$($2386, Kind$Term$cse$(Bits$e, $2297, _name$18, $2329, _cses$28, $2378)));
                                                                                        var $2379 = $2387;
                                                                                        break;
                                                                                };
                                                                                var $2345 = $2379;
                                                                                break;
                                                                        };
                                                                        var $2337 = $2345;
                                                                        break;
                                                                };
                                                                var $2330 = $2337;
                                                                break;
                                                        };
                                                        var $2314 = $2330;
                                                        break;
                                                };
                                                var $2298 = $2314;
                                                break;
                                        };
                                        var $2290 = $2298;
                                        break;
                                };
                                var $2283 = $2290;
                                break;
                        };
                        var $2276 = $2283;
                        break;
                };
                var $2268 = $2276;
                break;
        };
        return $2268;
    };
    const Kind$Parser$case = x0 => x1 => Kind$Parser$case$(x0, x1);

    function Kind$set$(_name$2, _val$3, _map$4) {
        var $2388 = Map$set$((kind_name_to_bits(_name$2)), _val$3, _map$4);
        return $2388;
    };
    const Kind$set = x0 => x1 => x2 => Kind$set$(x0, x1, x2);

    function Kind$Parser$open$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2390 = self.idx;
                var $2391 = self.code;
                var $2392 = self.err;
                var $2393 = Parser$Reply$error$($2390, $2391, $2392);
                var $2389 = $2393;
                break;
            case 'Parser.Reply.value':
                var $2394 = self.idx;
                var $2395 = self.code;
                var $2396 = self.val;
                var self = Kind$Parser$text$("open ", $2394, $2395);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2398 = self.idx;
                        var $2399 = self.code;
                        var $2400 = self.err;
                        var $2401 = Parser$Reply$error$($2398, $2399, $2400);
                        var $2397 = $2401;
                        break;
                    case 'Parser.Reply.value':
                        var $2402 = self.idx;
                        var $2403 = self.code;
                        var self = Kind$Parser$spaces($2402)($2403);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2405 = self.idx;
                                var $2406 = self.code;
                                var $2407 = self.err;
                                var $2408 = Parser$Reply$error$($2405, $2406, $2407);
                                var $2404 = $2408;
                                break;
                            case 'Parser.Reply.value':
                                var $2409 = self.idx;
                                var $2410 = self.code;
                                var self = Kind$Parser$term$($2409, $2410);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2412 = self.idx;
                                        var $2413 = self.code;
                                        var $2414 = self.err;
                                        var $2415 = Parser$Reply$error$($2412, $2413, $2414);
                                        var $2411 = $2415;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2416 = self.idx;
                                        var $2417 = self.code;
                                        var $2418 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2421 = self.idx;
                                                    var $2422 = self.code;
                                                    var $2423 = self.err;
                                                    var $2424 = Parser$Reply$error$($2421, $2422, $2423);
                                                    var $2420 = $2424;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2425 = self.idx;
                                                    var $2426 = self.code;
                                                    var $2427 = Kind$Parser$name1$($2425, $2426);
                                                    var $2420 = $2427;
                                                    break;
                                            };
                                            return $2420;
                                        }), $2416, $2417);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2428 = self.idx;
                                                var $2429 = self.code;
                                                var $2430 = self.err;
                                                var $2431 = Parser$Reply$error$($2428, $2429, $2430);
                                                var $2419 = $2431;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2432 = self.idx;
                                                var $2433 = self.code;
                                                var $2434 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2432, $2433);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2436 = self.idx;
                                                        var $2437 = self.code;
                                                        var $2438 = self.err;
                                                        var $2439 = Parser$Reply$error$($2436, $2437, $2438);
                                                        var $2435 = $2439;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2440 = self.idx;
                                                        var $2441 = self.code;
                                                        var self = $2434;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2443 = self.value;
                                                                var $2444 = $2443;
                                                                var _name$21 = $2444;
                                                                break;
                                                            case 'Maybe.none':
                                                                var self = Kind$Term$reduce$($2418, Map$new);
                                                                switch (self._) {
                                                                    case 'Kind.Term.var':
                                                                        var $2446 = self.name;
                                                                        var $2447 = $2446;
                                                                        var $2445 = $2447;
                                                                        break;
                                                                    case 'Kind.Term.ref':
                                                                        var $2448 = self.name;
                                                                        var $2449 = $2448;
                                                                        var $2445 = $2449;
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
                                                                        var $2450 = Kind$Name$read$("self");
                                                                        var $2445 = $2450;
                                                                        break;
                                                                };
                                                                var _name$21 = $2445;
                                                                break;
                                                        };
                                                        var _wyth$22 = List$nil;
                                                        var self = Kind$Parser$term$($2440, $2441);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2451 = self.idx;
                                                                var $2452 = self.code;
                                                                var $2453 = self.err;
                                                                var $2454 = Parser$Reply$error$($2451, $2452, $2453);
                                                                var $2442 = $2454;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2455 = self.idx;
                                                                var $2456 = self.code;
                                                                var $2457 = self.val;
                                                                var _cses$26 = Kind$set$("_", $2457, Map$new);
                                                                var _moti$27 = Maybe$some$(Kind$Term$hol$(Bits$e));
                                                                var self = Kind$Parser$stop$($2396, $2455, $2456);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2459 = self.idx;
                                                                        var $2460 = self.code;
                                                                        var $2461 = self.err;
                                                                        var $2462 = Parser$Reply$error$($2459, $2460, $2461);
                                                                        var $2458 = $2462;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2463 = self.idx;
                                                                        var $2464 = self.code;
                                                                        var $2465 = self.val;
                                                                        var $2466 = Parser$Reply$value$($2463, $2464, Kind$Term$ori$($2465, Kind$Term$cse$(Bits$e, $2418, _name$21, _wyth$22, _cses$26, _moti$27)));
                                                                        var $2458 = $2466;
                                                                        break;
                                                                };
                                                                var $2442 = $2458;
                                                                break;
                                                        };
                                                        var $2435 = $2442;
                                                        break;
                                                };
                                                var $2419 = $2435;
                                                break;
                                        };
                                        var $2411 = $2419;
                                        break;
                                };
                                var $2404 = $2411;
                                break;
                        };
                        var $2397 = $2404;
                        break;
                };
                var $2389 = $2397;
                break;
        };
        return $2389;
    };
    const Kind$Parser$open = x0 => x1 => Kind$Parser$open$(x0, x1);

    function Kind$Parser$switch$case$(_idx$1, _code$2) {
        var self = Kind$Parser$term$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2468 = self.idx;
                var $2469 = self.code;
                var $2470 = self.err;
                var $2471 = Parser$Reply$error$($2468, $2469, $2470);
                var $2467 = $2471;
                break;
            case 'Parser.Reply.value':
                var $2472 = self.idx;
                var $2473 = self.code;
                var $2474 = self.val;
                var self = Kind$Parser$text$(":", $2472, $2473);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2476 = self.idx;
                        var $2477 = self.code;
                        var $2478 = self.err;
                        var $2479 = Parser$Reply$error$($2476, $2477, $2478);
                        var $2475 = $2479;
                        break;
                    case 'Parser.Reply.value':
                        var $2480 = self.idx;
                        var $2481 = self.code;
                        var self = Kind$Parser$term$($2480, $2481);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2483 = self.idx;
                                var $2484 = self.code;
                                var $2485 = self.err;
                                var $2486 = Parser$Reply$error$($2483, $2484, $2485);
                                var $2482 = $2486;
                                break;
                            case 'Parser.Reply.value':
                                var $2487 = self.idx;
                                var $2488 = self.code;
                                var $2489 = self.val;
                                var $2490 = Parser$Reply$value$($2487, $2488, Pair$new$($2474, $2489));
                                var $2482 = $2490;
                                break;
                        };
                        var $2475 = $2482;
                        break;
                };
                var $2467 = $2475;
                break;
        };
        return $2467;
    };
    const Kind$Parser$switch$case = x0 => x1 => Kind$Parser$switch$case$(x0, x1);

    function Kind$Parser$switch$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2492 = self.idx;
                var $2493 = self.code;
                var $2494 = self.err;
                var $2495 = Parser$Reply$error$($2492, $2493, $2494);
                var $2491 = $2495;
                break;
            case 'Parser.Reply.value':
                var $2496 = self.idx;
                var $2497 = self.code;
                var $2498 = self.val;
                var self = Kind$Parser$text$("switch ", $2496, $2497);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2500 = self.idx;
                        var $2501 = self.code;
                        var $2502 = self.err;
                        var $2503 = Parser$Reply$error$($2500, $2501, $2502);
                        var $2499 = $2503;
                        break;
                    case 'Parser.Reply.value':
                        var $2504 = self.idx;
                        var $2505 = self.code;
                        var self = Kind$Parser$term$($2504, $2505);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2507 = self.idx;
                                var $2508 = self.code;
                                var $2509 = self.err;
                                var $2510 = Parser$Reply$error$($2507, $2508, $2509);
                                var $2506 = $2510;
                                break;
                            case 'Parser.Reply.value':
                                var $2511 = self.idx;
                                var $2512 = self.code;
                                var $2513 = self.val;
                                var self = Kind$Parser$text$("{", $2511, $2512);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2515 = self.idx;
                                        var $2516 = self.code;
                                        var $2517 = self.err;
                                        var $2518 = Parser$Reply$error$($2515, $2516, $2517);
                                        var $2514 = $2518;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2519 = self.idx;
                                        var $2520 = self.code;
                                        var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$switch$case)($2519)($2520);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2522 = self.idx;
                                                var $2523 = self.code;
                                                var $2524 = self.err;
                                                var $2525 = Parser$Reply$error$($2522, $2523, $2524);
                                                var $2521 = $2525;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2526 = self.idx;
                                                var $2527 = self.code;
                                                var $2528 = self.val;
                                                var self = Kind$Parser$text$("else", $2526, $2527);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2530 = self.idx;
                                                        var $2531 = self.code;
                                                        var $2532 = self.err;
                                                        var $2533 = Parser$Reply$error$($2530, $2531, $2532);
                                                        var $2529 = $2533;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2534 = self.idx;
                                                        var $2535 = self.code;
                                                        var self = Kind$Parser$term$($2534, $2535);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2537 = self.idx;
                                                                var $2538 = self.code;
                                                                var $2539 = self.err;
                                                                var $2540 = Parser$Reply$error$($2537, $2538, $2539);
                                                                var $2536 = $2540;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2541 = self.idx;
                                                                var $2542 = self.code;
                                                                var $2543 = self.val;
                                                                var self = Kind$Parser$stop$($2498, $2541, $2542);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2545 = self.idx;
                                                                        var $2546 = self.code;
                                                                        var $2547 = self.err;
                                                                        var $2548 = Parser$Reply$error$($2545, $2546, $2547);
                                                                        var $2544 = $2548;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2549 = self.idx;
                                                                        var $2550 = self.code;
                                                                        var $2551 = self.val;
                                                                        var _term$27 = List$fold$($2528, $2543, (_cse$27 => _rest$28 => {
                                                                            var self = _cse$27;
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $2554 = self.fst;
                                                                                    var $2555 = self.snd;
                                                                                    var _term$31 = Kind$Term$app$($2513, $2554);
                                                                                    var _term$32 = Kind$Term$app$(_term$31, Kind$Term$lam$("", (_x$32 => {
                                                                                        var $2557 = Kind$Term$hol$(Bits$e);
                                                                                        return $2557;
                                                                                    })));
                                                                                    var _term$33 = Kind$Term$app$(_term$32, $2555);
                                                                                    var _term$34 = Kind$Term$app$(_term$33, _rest$28);
                                                                                    var $2556 = _term$34;
                                                                                    var $2553 = $2556;
                                                                                    break;
                                                                            };
                                                                            return $2553;
                                                                        }));
                                                                        var $2552 = Parser$Reply$value$($2549, $2550, Kind$Term$ori$($2551, _term$27));
                                                                        var $2544 = $2552;
                                                                        break;
                                                                };
                                                                var $2536 = $2544;
                                                                break;
                                                        };
                                                        var $2529 = $2536;
                                                        break;
                                                };
                                                var $2521 = $2529;
                                                break;
                                        };
                                        var $2514 = $2521;
                                        break;
                                };
                                var $2506 = $2514;
                                break;
                        };
                        var $2499 = $2506;
                        break;
                };
                var $2491 = $2499;
                break;
        };
        return $2491;
    };
    const Kind$Parser$switch = x0 => x1 => Kind$Parser$switch$(x0, x1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $2559 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $2558 = $2559;
        } else {
            var $2560 = self.charCodeAt(0);
            var $2561 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($2560 === 48);
            if (self) {
                var $2563 = Parser$Reply$value$(_sidx$5, $2561, 0n);
                var $2562 = $2563;
            } else {
                var self = ($2560 === 49);
                if (self) {
                    var $2565 = Parser$Reply$value$(_sidx$5, $2561, 1n);
                    var $2564 = $2565;
                } else {
                    var self = ($2560 === 50);
                    if (self) {
                        var $2567 = Parser$Reply$value$(_sidx$5, $2561, 2n);
                        var $2566 = $2567;
                    } else {
                        var self = ($2560 === 51);
                        if (self) {
                            var $2569 = Parser$Reply$value$(_sidx$5, $2561, 3n);
                            var $2568 = $2569;
                        } else {
                            var self = ($2560 === 52);
                            if (self) {
                                var $2571 = Parser$Reply$value$(_sidx$5, $2561, 4n);
                                var $2570 = $2571;
                            } else {
                                var self = ($2560 === 53);
                                if (self) {
                                    var $2573 = Parser$Reply$value$(_sidx$5, $2561, 5n);
                                    var $2572 = $2573;
                                } else {
                                    var self = ($2560 === 54);
                                    if (self) {
                                        var $2575 = Parser$Reply$value$(_sidx$5, $2561, 6n);
                                        var $2574 = $2575;
                                    } else {
                                        var self = ($2560 === 55);
                                        if (self) {
                                            var $2577 = Parser$Reply$value$(_sidx$5, $2561, 7n);
                                            var $2576 = $2577;
                                        } else {
                                            var self = ($2560 === 56);
                                            if (self) {
                                                var $2579 = Parser$Reply$value$(_sidx$5, $2561, 8n);
                                                var $2578 = $2579;
                                            } else {
                                                var self = ($2560 === 57);
                                                if (self) {
                                                    var $2581 = Parser$Reply$value$(_sidx$5, $2561, 9n);
                                                    var $2580 = $2581;
                                                } else {
                                                    var $2582 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $2580 = $2582;
                                                };
                                                var $2578 = $2580;
                                            };
                                            var $2576 = $2578;
                                        };
                                        var $2574 = $2576;
                                    };
                                    var $2572 = $2574;
                                };
                                var $2570 = $2572;
                            };
                            var $2568 = $2570;
                        };
                        var $2566 = $2568;
                    };
                    var $2564 = $2566;
                };
                var $2562 = $2564;
            };
            var $2558 = $2562;
        };
        return $2558;
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
                        var $2583 = self.head;
                        var $2584 = self.tail;
                        var $2585 = Nat$from_base$go$(_b$1, $2584, (_b$1 * _p$3), (($2583 * _p$3) + _res$4));
                        return $2585;
                    case 'List.nil':
                        var $2586 = _res$4;
                        return $2586;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $2587 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $2587;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2589 = self.idx;
                var $2590 = self.code;
                var $2591 = self.err;
                var $2592 = Parser$Reply$error$($2589, $2590, $2591);
                var $2588 = $2592;
                break;
            case 'Parser.Reply.value':
                var $2593 = self.idx;
                var $2594 = self.code;
                var $2595 = self.val;
                var $2596 = Parser$Reply$value$($2593, $2594, Nat$from_base$(10n, $2595));
                var $2588 = $2596;
                break;
        };
        return $2588;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2598 = self.slice(0, -1);
                var $2599 = $2598;
                var $2597 = $2599;
                break;
            case 'i':
                var $2600 = self.slice(0, -1);
                var $2601 = $2600;
                var $2597 = $2601;
                break;
            case 'e':
                var $2602 = Bits$e;
                var $2597 = $2602;
                break;
        };
        return $2597;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2604 = self.slice(0, -1);
                var $2605 = ($2604 + '1');
                var $2603 = $2605;
                break;
            case 'i':
                var $2606 = self.slice(0, -1);
                var $2607 = (Bits$inc$($2606) + '0');
                var $2603 = $2607;
                break;
            case 'e':
                var $2608 = (Bits$e + '1');
                var $2603 = $2608;
                break;
        };
        return $2603;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2610 = Bool$false;
                var $2609 = $2610;
                break;
            case 'Maybe.some':
                var $2611 = Bool$true;
                var $2609 = $2611;
                break;
        };
        return $2609;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Kind$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $2612 = ({
            _: 'Kind.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $2612;
    };
    const Kind$Term$gol = x0 => x1 => x2 => Kind$Term$gol$(x0, x1, x2);

    function Kind$Parser$goal$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2614 = self.idx;
                var $2615 = self.code;
                var $2616 = self.err;
                var $2617 = Parser$Reply$error$($2614, $2615, $2616);
                var $2613 = $2617;
                break;
            case 'Parser.Reply.value':
                var $2618 = self.idx;
                var $2619 = self.code;
                var $2620 = self.val;
                var self = Kind$Parser$text$("?", $2618, $2619);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2622 = self.idx;
                        var $2623 = self.code;
                        var $2624 = self.err;
                        var $2625 = Parser$Reply$error$($2622, $2623, $2624);
                        var $2621 = $2625;
                        break;
                    case 'Parser.Reply.value':
                        var $2626 = self.idx;
                        var $2627 = self.code;
                        var self = Kind$Parser$name$($2626, $2627);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2629 = self.idx;
                                var $2630 = self.code;
                                var $2631 = self.err;
                                var $2632 = Parser$Reply$error$($2629, $2630, $2631);
                                var $2628 = $2632;
                                break;
                            case 'Parser.Reply.value':
                                var $2633 = self.idx;
                                var $2634 = self.code;
                                var $2635 = self.val;
                                var self = Parser$many$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("-", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2638 = self.idx;
                                            var $2639 = self.code;
                                            var $2640 = self.err;
                                            var $2641 = Parser$Reply$error$($2638, $2639, $2640);
                                            var $2637 = $2641;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2642 = self.idx;
                                            var $2643 = self.code;
                                            var self = Parser$nat$($2642, $2643);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2645 = self.idx;
                                                    var $2646 = self.code;
                                                    var $2647 = self.err;
                                                    var $2648 = Parser$Reply$error$($2645, $2646, $2647);
                                                    var $2644 = $2648;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2649 = self.idx;
                                                    var $2650 = self.code;
                                                    var $2651 = self.val;
                                                    var _bits$20 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits($2651)))));
                                                    var $2652 = Parser$Reply$value$($2649, $2650, _bits$20);
                                                    var $2644 = $2652;
                                                    break;
                                            };
                                            var $2637 = $2644;
                                            break;
                                    };
                                    return $2637;
                                }))($2633)($2634);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2653 = self.idx;
                                        var $2654 = self.code;
                                        var $2655 = self.err;
                                        var $2656 = Parser$Reply$error$($2653, $2654, $2655);
                                        var $2636 = $2656;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2657 = self.idx;
                                        var $2658 = self.code;
                                        var $2659 = self.val;
                                        var self = Parser$maybe$(Parser$text("-"), $2657, $2658);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2661 = self.idx;
                                                var $2662 = self.code;
                                                var $2663 = self.err;
                                                var $2664 = Parser$Reply$error$($2661, $2662, $2663);
                                                var self = $2664;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2665 = self.idx;
                                                var $2666 = self.code;
                                                var $2667 = self.val;
                                                var $2668 = Parser$Reply$value$($2665, $2666, Maybe$to_bool$($2667));
                                                var self = $2668;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2669 = self.idx;
                                                var $2670 = self.code;
                                                var $2671 = self.err;
                                                var $2672 = Parser$Reply$error$($2669, $2670, $2671);
                                                var $2660 = $2672;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2673 = self.idx;
                                                var $2674 = self.code;
                                                var $2675 = self.val;
                                                var self = Kind$Parser$stop$($2620, $2673, $2674);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2677 = self.idx;
                                                        var $2678 = self.code;
                                                        var $2679 = self.err;
                                                        var $2680 = Parser$Reply$error$($2677, $2678, $2679);
                                                        var $2676 = $2680;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2681 = self.idx;
                                                        var $2682 = self.code;
                                                        var $2683 = self.val;
                                                        var $2684 = Parser$Reply$value$($2681, $2682, Kind$Term$ori$($2683, Kind$Term$gol$($2635, $2659, $2675)));
                                                        var $2676 = $2684;
                                                        break;
                                                };
                                                var $2660 = $2676;
                                                break;
                                        };
                                        var $2636 = $2660;
                                        break;
                                };
                                var $2628 = $2636;
                                break;
                        };
                        var $2621 = $2628;
                        break;
                };
                var $2613 = $2621;
                break;
        };
        return $2613;
    };
    const Kind$Parser$goal = x0 => x1 => Kind$Parser$goal$(x0, x1);

    function Kind$Parser$hole$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$("_", $2690, $2691);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2694 = self.idx;
                        var $2695 = self.code;
                        var $2696 = self.err;
                        var $2697 = Parser$Reply$error$($2694, $2695, $2696);
                        var $2693 = $2697;
                        break;
                    case 'Parser.Reply.value':
                        var $2698 = self.idx;
                        var $2699 = self.code;
                        var self = Kind$Parser$stop$($2692, $2698, $2699);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2701 = self.idx;
                                var $2702 = self.code;
                                var $2703 = self.err;
                                var $2704 = Parser$Reply$error$($2701, $2702, $2703);
                                var $2700 = $2704;
                                break;
                            case 'Parser.Reply.value':
                                var $2705 = self.idx;
                                var $2706 = self.code;
                                var $2707 = self.val;
                                var $2708 = Parser$Reply$value$($2705, $2706, Kind$Term$ori$($2707, Kind$Term$hol$(Bits$e)));
                                var $2700 = $2708;
                                break;
                        };
                        var $2693 = $2700;
                        break;
                };
                var $2685 = $2693;
                break;
        };
        return $2685;
    };
    const Kind$Parser$hole = x0 => x1 => Kind$Parser$hole$(x0, x1);

    function Kind$Parser$u8$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2710 = self.idx;
                var $2711 = self.code;
                var $2712 = self.err;
                var $2713 = Parser$Reply$error$($2710, $2711, $2712);
                var $2709 = $2713;
                break;
            case 'Parser.Reply.value':
                var $2714 = self.idx;
                var $2715 = self.code;
                var $2716 = self.val;
                var self = Kind$Parser$spaces($2714)($2715);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2718 = self.idx;
                        var $2719 = self.code;
                        var $2720 = self.err;
                        var $2721 = Parser$Reply$error$($2718, $2719, $2720);
                        var $2717 = $2721;
                        break;
                    case 'Parser.Reply.value':
                        var $2722 = self.idx;
                        var $2723 = self.code;
                        var self = Parser$nat$($2722, $2723);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2725 = self.idx;
                                var $2726 = self.code;
                                var $2727 = self.err;
                                var $2728 = Parser$Reply$error$($2725, $2726, $2727);
                                var $2724 = $2728;
                                break;
                            case 'Parser.Reply.value':
                                var $2729 = self.idx;
                                var $2730 = self.code;
                                var $2731 = self.val;
                                var self = Parser$text$("b", $2729, $2730);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2733 = self.idx;
                                        var $2734 = self.code;
                                        var $2735 = self.err;
                                        var $2736 = Parser$Reply$error$($2733, $2734, $2735);
                                        var $2732 = $2736;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2737 = self.idx;
                                        var $2738 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u8");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2731));
                                        var self = Kind$Parser$stop$($2716, $2737, $2738);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2740 = self.idx;
                                                var $2741 = self.code;
                                                var $2742 = self.err;
                                                var $2743 = Parser$Reply$error$($2740, $2741, $2742);
                                                var $2739 = $2743;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2744 = self.idx;
                                                var $2745 = self.code;
                                                var $2746 = self.val;
                                                var $2747 = Parser$Reply$value$($2744, $2745, Kind$Term$ori$($2746, _term$16));
                                                var $2739 = $2747;
                                                break;
                                        };
                                        var $2732 = $2739;
                                        break;
                                };
                                var $2724 = $2732;
                                break;
                        };
                        var $2717 = $2724;
                        break;
                };
                var $2709 = $2717;
                break;
        };
        return $2709;
    };
    const Kind$Parser$u8 = x0 => x1 => Kind$Parser$u8$(x0, x1);

    function Kind$Parser$u16$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2749 = self.idx;
                var $2750 = self.code;
                var $2751 = self.err;
                var $2752 = Parser$Reply$error$($2749, $2750, $2751);
                var $2748 = $2752;
                break;
            case 'Parser.Reply.value':
                var $2753 = self.idx;
                var $2754 = self.code;
                var $2755 = self.val;
                var self = Kind$Parser$spaces($2753)($2754);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2757 = self.idx;
                        var $2758 = self.code;
                        var $2759 = self.err;
                        var $2760 = Parser$Reply$error$($2757, $2758, $2759);
                        var $2756 = $2760;
                        break;
                    case 'Parser.Reply.value':
                        var $2761 = self.idx;
                        var $2762 = self.code;
                        var self = Parser$nat$($2761, $2762);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2764 = self.idx;
                                var $2765 = self.code;
                                var $2766 = self.err;
                                var $2767 = Parser$Reply$error$($2764, $2765, $2766);
                                var $2763 = $2767;
                                break;
                            case 'Parser.Reply.value':
                                var $2768 = self.idx;
                                var $2769 = self.code;
                                var $2770 = self.val;
                                var self = Parser$text$("s", $2768, $2769);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2772 = self.idx;
                                        var $2773 = self.code;
                                        var $2774 = self.err;
                                        var $2775 = Parser$Reply$error$($2772, $2773, $2774);
                                        var $2771 = $2775;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2776 = self.idx;
                                        var $2777 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u16");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2770));
                                        var self = Kind$Parser$stop$($2755, $2776, $2777);
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
                                                var $2785 = self.val;
                                                var $2786 = Parser$Reply$value$($2783, $2784, Kind$Term$ori$($2785, _term$16));
                                                var $2778 = $2786;
                                                break;
                                        };
                                        var $2771 = $2778;
                                        break;
                                };
                                var $2763 = $2771;
                                break;
                        };
                        var $2756 = $2763;
                        break;
                };
                var $2748 = $2756;
                break;
        };
        return $2748;
    };
    const Kind$Parser$u16 = x0 => x1 => Kind$Parser$u16$(x0, x1);

    function Kind$Parser$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2788 = self.idx;
                var $2789 = self.code;
                var $2790 = self.err;
                var $2791 = Parser$Reply$error$($2788, $2789, $2790);
                var $2787 = $2791;
                break;
            case 'Parser.Reply.value':
                var $2792 = self.idx;
                var $2793 = self.code;
                var $2794 = self.val;
                var self = Kind$Parser$spaces($2792)($2793);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2796 = self.idx;
                        var $2797 = self.code;
                        var $2798 = self.err;
                        var $2799 = Parser$Reply$error$($2796, $2797, $2798);
                        var $2795 = $2799;
                        break;
                    case 'Parser.Reply.value':
                        var $2800 = self.idx;
                        var $2801 = self.code;
                        var self = Parser$nat$($2800, $2801);
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
                                var self = Parser$text$("u", $2807, $2808);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u32");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2809));
                                        var self = Kind$Parser$stop$($2794, $2815, $2816);
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
                                                var $2825 = Parser$Reply$value$($2822, $2823, Kind$Term$ori$($2824, _term$16));
                                                var $2817 = $2825;
                                                break;
                                        };
                                        var $2810 = $2817;
                                        break;
                                };
                                var $2802 = $2810;
                                break;
                        };
                        var $2795 = $2802;
                        break;
                };
                var $2787 = $2795;
                break;
        };
        return $2787;
    };
    const Kind$Parser$u32 = x0 => x1 => Kind$Parser$u32$(x0, x1);

    function Kind$Parser$u64$(_idx$1, _code$2) {
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
                                var self = Parser$text$("l", $2846, $2847);
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
                                        var _term$15 = Kind$Term$ref$("Nat.to_u64");
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
    const Kind$Parser$u64 = x0 => x1 => Kind$Parser$u64$(x0, x1);

    function Kind$Parser$nat$(_idx$1, _code$2) {
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
                                var self = Kind$Parser$stop$($2872, $2885, $2886);
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
                                        var $2895 = self.val;
                                        var $2896 = Parser$Reply$value$($2893, $2894, Kind$Term$ori$($2895, Kind$Term$nat$($2887)));
                                        var $2888 = $2896;
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
    const Kind$Parser$nat = x0 => x1 => Kind$Parser$nat$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $2897 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $2897;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);

    function Kind$Parser$reference$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2899 = self.idx;
                var $2900 = self.code;
                var $2901 = self.err;
                var $2902 = Parser$Reply$error$($2899, $2900, $2901);
                var $2898 = $2902;
                break;
            case 'Parser.Reply.value':
                var $2903 = self.idx;
                var $2904 = self.code;
                var $2905 = self.val;
                var self = Kind$Parser$name1$($2903, $2904);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2907 = self.idx;
                        var $2908 = self.code;
                        var $2909 = self.err;
                        var $2910 = Parser$Reply$error$($2907, $2908, $2909);
                        var $2906 = $2910;
                        break;
                    case 'Parser.Reply.value':
                        var $2911 = self.idx;
                        var $2912 = self.code;
                        var $2913 = self.val;
                        var self = ($2913 === "case");
                        if (self) {
                            var $2915 = Parser$fail("Reserved keyword.");
                            var $2914 = $2915;
                        } else {
                            var self = ($2913 === "do");
                            if (self) {
                                var $2917 = Parser$fail("Reserved keyword.");
                                var $2916 = $2917;
                            } else {
                                var self = ($2913 === "if");
                                if (self) {
                                    var $2919 = Parser$fail("Reserved keyword.");
                                    var $2918 = $2919;
                                } else {
                                    var self = ($2913 === "with");
                                    if (self) {
                                        var $2921 = Parser$fail("Reserved keyword.");
                                        var $2920 = $2921;
                                    } else {
                                        var self = ($2913 === "let");
                                        if (self) {
                                            var $2923 = Parser$fail("Reserved keyword.");
                                            var $2922 = $2923;
                                        } else {
                                            var self = ($2913 === "def");
                                            if (self) {
                                                var $2925 = Parser$fail("Reserved keyword.");
                                                var $2924 = $2925;
                                            } else {
                                                var self = ($2913 === "true");
                                                if (self) {
                                                    var $2927 = (_idx$9 => _code$10 => {
                                                        var $2928 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.true"));
                                                        return $2928;
                                                    });
                                                    var $2926 = $2927;
                                                } else {
                                                    var self = ($2913 === "false");
                                                    if (self) {
                                                        var $2930 = (_idx$9 => _code$10 => {
                                                            var $2931 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.false"));
                                                            return $2931;
                                                        });
                                                        var $2929 = $2930;
                                                    } else {
                                                        var self = ($2913 === "unit");
                                                        if (self) {
                                                            var $2933 = (_idx$9 => _code$10 => {
                                                                var $2934 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Unit.new"));
                                                                return $2934;
                                                            });
                                                            var $2932 = $2933;
                                                        } else {
                                                            var self = ($2913 === "none");
                                                            if (self) {
                                                                var _term$9 = Kind$Term$ref$("Maybe.none");
                                                                var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                var $2936 = (_idx$11 => _code$12 => {
                                                                    var $2937 = Parser$Reply$value$(_idx$11, _code$12, _term$10);
                                                                    return $2937;
                                                                });
                                                                var $2935 = $2936;
                                                            } else {
                                                                var self = ($2913 === "refl");
                                                                if (self) {
                                                                    var _term$9 = Kind$Term$ref$("Equal.refl");
                                                                    var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                    var _term$11 = Kind$Term$app$(_term$10, Kind$Term$hol$(Bits$e));
                                                                    var $2939 = (_idx$12 => _code$13 => {
                                                                        var $2940 = Parser$Reply$value$(_idx$12, _code$13, _term$11);
                                                                        return $2940;
                                                                    });
                                                                    var $2938 = $2939;
                                                                } else {
                                                                    var $2941 = (_idx$9 => _code$10 => {
                                                                        var self = Kind$Parser$stop$($2905, _idx$9, _code$10);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2943 = self.idx;
                                                                                var $2944 = self.code;
                                                                                var $2945 = self.err;
                                                                                var $2946 = Parser$Reply$error$($2943, $2944, $2945);
                                                                                var $2942 = $2946;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2947 = self.idx;
                                                                                var $2948 = self.code;
                                                                                var $2949 = self.val;
                                                                                var $2950 = Parser$Reply$value$($2947, $2948, Kind$Term$ori$($2949, Kind$Term$ref$($2913)));
                                                                                var $2942 = $2950;
                                                                                break;
                                                                        };
                                                                        return $2942;
                                                                    });
                                                                    var $2938 = $2941;
                                                                };
                                                                var $2935 = $2938;
                                                            };
                                                            var $2932 = $2935;
                                                        };
                                                        var $2929 = $2932;
                                                    };
                                                    var $2926 = $2929;
                                                };
                                                var $2924 = $2926;
                                            };
                                            var $2922 = $2924;
                                        };
                                        var $2920 = $2922;
                                    };
                                    var $2918 = $2920;
                                };
                                var $2916 = $2918;
                            };
                            var $2914 = $2916;
                        };
                        var $2914 = $2914($2911)($2912);
                        var $2906 = $2914;
                        break;
                };
                var $2898 = $2906;
                break;
        };
        return $2898;
    };
    const Kind$Parser$reference = x0 => x1 => Kind$Parser$reference$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kind$Parser$application$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$text$("(", _idx$3, _code$4);
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
                var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term), $2956, $2957);
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
                        var self = Kind$Parser$stop$(_init$1, $2963, $2964);
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
                                var $2973 = self.val;
                                var _expr$14 = (() => {
                                    var $2976 = _func$2;
                                    var $2977 = $2965;
                                    let _f$15 = $2976;
                                    let _x$14;
                                    while ($2977._ === 'List.cons') {
                                        _x$14 = $2977.head;
                                        var $2976 = Kind$Term$app$(_f$15, _x$14);
                                        _f$15 = $2976;
                                        $2977 = $2977.tail;
                                    }
                                    return _f$15;
                                })();
                                var $2974 = Parser$Reply$value$($2971, $2972, Kind$Term$ori$($2973, _expr$14));
                                var $2966 = $2974;
                                break;
                        };
                        var $2958 = $2966;
                        break;
                };
                var $2951 = $2958;
                break;
        };
        return $2951;
    };
    const Kind$Parser$application = x0 => x1 => x2 => x3 => Kind$Parser$application$(x0, x1, x2, x3);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1, _idx$2, _code$3) {
        var self = Parser$spaces(_idx$2)(_code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2979 = self.idx;
                var $2980 = self.code;
                var $2981 = self.err;
                var $2982 = Parser$Reply$error$($2979, $2980, $2981);
                var $2978 = $2982;
                break;
            case 'Parser.Reply.value':
                var $2983 = self.idx;
                var $2984 = self.code;
                var $2985 = Parser$text$(_text$1, $2983, $2984);
                var $2978 = $2985;
                break;
        };
        return $2978;
    };
    const Parser$spaces_text = x0 => x1 => x2 => Parser$spaces_text$(x0, x1, x2);

    function Kind$Parser$application$erased$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$get_index$(_idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2987 = self.idx;
                var $2988 = self.code;
                var $2989 = self.err;
                var $2990 = Parser$Reply$error$($2987, $2988, $2989);
                var $2986 = $2990;
                break;
            case 'Parser.Reply.value':
                var $2991 = self.idx;
                var $2992 = self.code;
                var $2993 = self.val;
                var self = Parser$text$("<", $2991, $2992);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2995 = self.idx;
                        var $2996 = self.code;
                        var $2997 = self.err;
                        var $2998 = Parser$Reply$error$($2995, $2996, $2997);
                        var $2994 = $2998;
                        break;
                    case 'Parser.Reply.value':
                        var $2999 = self.idx;
                        var $3000 = self.code;
                        var self = Parser$until1$(Parser$spaces_text(">"), Kind$Parser$item(Kind$Parser$term), $2999, $3000);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3002 = self.idx;
                                var $3003 = self.code;
                                var $3004 = self.err;
                                var $3005 = Parser$Reply$error$($3002, $3003, $3004);
                                var $3001 = $3005;
                                break;
                            case 'Parser.Reply.value':
                                var $3006 = self.idx;
                                var $3007 = self.code;
                                var $3008 = self.val;
                                var self = Kind$Parser$stop$($2993, $3006, $3007);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3010 = self.idx;
                                        var $3011 = self.code;
                                        var $3012 = self.err;
                                        var $3013 = Parser$Reply$error$($3010, $3011, $3012);
                                        var $3009 = $3013;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3014 = self.idx;
                                        var $3015 = self.code;
                                        var $3016 = self.val;
                                        var _expr$17 = (() => {
                                            var $3019 = _func$2;
                                            var $3020 = $3008;
                                            let _f$18 = $3019;
                                            let _x$17;
                                            while ($3020._ === 'List.cons') {
                                                _x$17 = $3020.head;
                                                var $3019 = Kind$Term$app$(_f$18, _x$17);
                                                _f$18 = $3019;
                                                $3020 = $3020.tail;
                                            }
                                            return _f$18;
                                        })();
                                        var $3017 = Parser$Reply$value$($3014, $3015, Kind$Term$ori$($3016, _expr$17));
                                        var $3009 = $3017;
                                        break;
                                };
                                var $3001 = $3009;
                                break;
                        };
                        var $2994 = $3001;
                        break;
                };
                var $2986 = $2994;
                break;
        };
        return $2986;
    };
    const Kind$Parser$application$erased = x0 => x1 => x2 => x3 => Kind$Parser$application$erased$(x0, x1, x2, x3);

    function Kind$Parser$arrow$(_init$1, _xtyp$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("->", _idx$3, _code$4);
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
                var self = Kind$Parser$term$($3026, $3027);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3029 = self.idx;
                        var $3030 = self.code;
                        var $3031 = self.err;
                        var $3032 = Parser$Reply$error$($3029, $3030, $3031);
                        var $3028 = $3032;
                        break;
                    case 'Parser.Reply.value':
                        var $3033 = self.idx;
                        var $3034 = self.code;
                        var $3035 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3033, $3034);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3037 = self.idx;
                                var $3038 = self.code;
                                var $3039 = self.err;
                                var $3040 = Parser$Reply$error$($3037, $3038, $3039);
                                var $3036 = $3040;
                                break;
                            case 'Parser.Reply.value':
                                var $3041 = self.idx;
                                var $3042 = self.code;
                                var $3043 = self.val;
                                var $3044 = Parser$Reply$value$($3041, $3042, Kind$Term$ori$($3043, Kind$Term$all$(Bool$false, "", "", _xtyp$2, (_s$14 => _x$15 => {
                                    var $3045 = $3035;
                                    return $3045;
                                }))));
                                var $3036 = $3044;
                                break;
                        };
                        var $3028 = $3036;
                        break;
                };
                var $3021 = $3028;
                break;
        };
        return $3021;
    };
    const Kind$Parser$arrow = x0 => x1 => x2 => x3 => Kind$Parser$arrow$(x0, x1, x2, x3);

    function Kind$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4, _idx$5, _code$6) {
        var self = Kind$Parser$text$(_sym$1, _idx$5, _code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3047 = self.idx;
                var $3048 = self.code;
                var $3049 = self.err;
                var $3050 = Parser$Reply$error$($3047, $3048, $3049);
                var $3046 = $3050;
                break;
            case 'Parser.Reply.value':
                var $3051 = self.idx;
                var $3052 = self.code;
                var self = Kind$Parser$term$($3051, $3052);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3054 = self.idx;
                        var $3055 = self.code;
                        var $3056 = self.err;
                        var $3057 = Parser$Reply$error$($3054, $3055, $3056);
                        var $3053 = $3057;
                        break;
                    case 'Parser.Reply.value':
                        var $3058 = self.idx;
                        var $3059 = self.code;
                        var $3060 = self.val;
                        var self = Kind$Parser$stop$(_init$3, $3058, $3059);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3062 = self.idx;
                                var $3063 = self.code;
                                var $3064 = self.err;
                                var $3065 = Parser$Reply$error$($3062, $3063, $3064);
                                var $3061 = $3065;
                                break;
                            case 'Parser.Reply.value':
                                var $3066 = self.idx;
                                var $3067 = self.code;
                                var $3068 = self.val;
                                var _term$16 = Kind$Term$ref$(_ref$2);
                                var _term$17 = Kind$Term$app$(_term$16, _val0$4);
                                var _term$18 = Kind$Term$app$(_term$17, $3060);
                                var $3069 = Parser$Reply$value$($3066, $3067, Kind$Term$ori$($3068, _term$18));
                                var $3061 = $3069;
                                break;
                        };
                        var $3053 = $3061;
                        break;
                };
                var $3046 = $3053;
                break;
        };
        return $3046;
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
                var $3071 = self.idx;
                var $3072 = self.code;
                var $3073 = self.err;
                var $3074 = Parser$Reply$error$($3071, $3072, $3073);
                var $3070 = $3074;
                break;
            case 'Parser.Reply.value':
                var $3075 = self.idx;
                var $3076 = self.code;
                var self = Kind$Parser$term$($3075, $3076);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3078 = self.idx;
                        var $3079 = self.code;
                        var $3080 = self.err;
                        var $3081 = Parser$Reply$error$($3078, $3079, $3080);
                        var $3077 = $3081;
                        break;
                    case 'Parser.Reply.value':
                        var $3082 = self.idx;
                        var $3083 = self.code;
                        var $3084 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3082, $3083);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3086 = self.idx;
                                var $3087 = self.code;
                                var $3088 = self.err;
                                var $3089 = Parser$Reply$error$($3086, $3087, $3088);
                                var $3085 = $3089;
                                break;
                            case 'Parser.Reply.value':
                                var $3090 = self.idx;
                                var $3091 = self.code;
                                var _term$14 = Kind$Term$ref$("List.cons");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _head$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3084);
                                var self = Kind$Parser$stop$(_init$1, $3090, $3091);
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
                                        var $3099 = self.val;
                                        var $3100 = Parser$Reply$value$($3097, $3098, Kind$Term$ori$($3099, _term$17));
                                        var $3092 = $3100;
                                        break;
                                };
                                var $3085 = $3092;
                                break;
                        };
                        var $3077 = $3085;
                        break;
                };
                var $3070 = $3077;
                break;
        };
        return $3070;
    };
    const Kind$Parser$cons = x0 => x1 => x2 => x3 => Kind$Parser$cons$(x0, x1, x2, x3);

    function Kind$Parser$concat$(_init$1, _lst0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("++", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3102 = self.idx;
                var $3103 = self.code;
                var $3104 = self.err;
                var $3105 = Parser$Reply$error$($3102, $3103, $3104);
                var $3101 = $3105;
                break;
            case 'Parser.Reply.value':
                var $3106 = self.idx;
                var $3107 = self.code;
                var self = Kind$Parser$term$($3106, $3107);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3109 = self.idx;
                        var $3110 = self.code;
                        var $3111 = self.err;
                        var $3112 = Parser$Reply$error$($3109, $3110, $3111);
                        var $3108 = $3112;
                        break;
                    case 'Parser.Reply.value':
                        var $3113 = self.idx;
                        var $3114 = self.code;
                        var $3115 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3113, $3114);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3117 = self.idx;
                                var $3118 = self.code;
                                var $3119 = self.err;
                                var $3120 = Parser$Reply$error$($3117, $3118, $3119);
                                var $3116 = $3120;
                                break;
                            case 'Parser.Reply.value':
                                var $3121 = self.idx;
                                var $3122 = self.code;
                                var _term$14 = Kind$Term$ref$("List.concat");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _lst0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3115);
                                var self = Kind$Parser$stop$(_init$1, $3121, $3122);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3124 = self.idx;
                                        var $3125 = self.code;
                                        var $3126 = self.err;
                                        var $3127 = Parser$Reply$error$($3124, $3125, $3126);
                                        var $3123 = $3127;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3128 = self.idx;
                                        var $3129 = self.code;
                                        var $3130 = self.val;
                                        var $3131 = Parser$Reply$value$($3128, $3129, Kind$Term$ori$($3130, _term$17));
                                        var $3123 = $3131;
                                        break;
                                };
                                var $3116 = $3123;
                                break;
                        };
                        var $3108 = $3116;
                        break;
                };
                var $3101 = $3108;
                break;
        };
        return $3101;
    };
    const Kind$Parser$concat = x0 => x1 => x2 => x3 => Kind$Parser$concat$(x0, x1, x2, x3);

    function Kind$Parser$string_concat$(_init$1, _str0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("|", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3133 = self.idx;
                var $3134 = self.code;
                var $3135 = self.err;
                var $3136 = Parser$Reply$error$($3133, $3134, $3135);
                var $3132 = $3136;
                break;
            case 'Parser.Reply.value':
                var $3137 = self.idx;
                var $3138 = self.code;
                var self = Kind$Parser$term$($3137, $3138);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3140 = self.idx;
                        var $3141 = self.code;
                        var $3142 = self.err;
                        var $3143 = Parser$Reply$error$($3140, $3141, $3142);
                        var $3139 = $3143;
                        break;
                    case 'Parser.Reply.value':
                        var $3144 = self.idx;
                        var $3145 = self.code;
                        var $3146 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3144, $3145);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3148 = self.idx;
                                var $3149 = self.code;
                                var $3150 = self.err;
                                var $3151 = Parser$Reply$error$($3148, $3149, $3150);
                                var $3147 = $3151;
                                break;
                            case 'Parser.Reply.value':
                                var $3152 = self.idx;
                                var $3153 = self.code;
                                var _term$14 = Kind$Term$ref$("String.concat");
                                var _term$15 = Kind$Term$app$(_term$14, _str0$2);
                                var _term$16 = Kind$Term$app$(_term$15, $3146);
                                var self = Kind$Parser$stop$(_init$1, $3152, $3153);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3155 = self.idx;
                                        var $3156 = self.code;
                                        var $3157 = self.err;
                                        var $3158 = Parser$Reply$error$($3155, $3156, $3157);
                                        var $3154 = $3158;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3159 = self.idx;
                                        var $3160 = self.code;
                                        var $3161 = self.val;
                                        var $3162 = Parser$Reply$value$($3159, $3160, Kind$Term$ori$($3161, _term$16));
                                        var $3154 = $3162;
                                        break;
                                };
                                var $3147 = $3154;
                                break;
                        };
                        var $3139 = $3147;
                        break;
                };
                var $3132 = $3139;
                break;
        };
        return $3132;
    };
    const Kind$Parser$string_concat = x0 => x1 => x2 => x3 => Kind$Parser$string_concat$(x0, x1, x2, x3);

    function Kind$Parser$sigma$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("~", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3164 = self.idx;
                var $3165 = self.code;
                var $3166 = self.err;
                var $3167 = Parser$Reply$error$($3164, $3165, $3166);
                var $3163 = $3167;
                break;
            case 'Parser.Reply.value':
                var $3168 = self.idx;
                var $3169 = self.code;
                var self = Kind$Parser$term$($3168, $3169);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3171 = self.idx;
                        var $3172 = self.code;
                        var $3173 = self.err;
                        var $3174 = Parser$Reply$error$($3171, $3172, $3173);
                        var $3170 = $3174;
                        break;
                    case 'Parser.Reply.value':
                        var $3175 = self.idx;
                        var $3176 = self.code;
                        var $3177 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3175, $3176);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3179 = self.idx;
                                var $3180 = self.code;
                                var $3181 = self.err;
                                var $3182 = Parser$Reply$error$($3179, $3180, $3181);
                                var $3178 = $3182;
                                break;
                            case 'Parser.Reply.value':
                                var $3183 = self.idx;
                                var $3184 = self.code;
                                var $3185 = self.val;
                                var _term$14 = Kind$Term$ref$("Sigma.new");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                var _term$17 = Kind$Term$app$(_term$16, _val0$2);
                                var _term$18 = Kind$Term$app$(_term$17, $3177);
                                var $3186 = Parser$Reply$value$($3183, $3184, Kind$Term$ori$($3185, _term$18));
                                var $3178 = $3186;
                                break;
                        };
                        var $3170 = $3178;
                        break;
                };
                var $3163 = $3170;
                break;
        };
        return $3163;
    };
    const Kind$Parser$sigma = x0 => x1 => x2 => x3 => Kind$Parser$sigma$(x0, x1, x2, x3);

    function Kind$Parser$equality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("==", _idx$3, _code$4);
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
                        var self = Kind$Parser$stop$(_init$1, $3199, $3200);
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
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3201);
                                var $3210 = Parser$Reply$value$($3207, $3208, Kind$Term$ori$($3209, _term$17));
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
    const Kind$Parser$equality = x0 => x1 => x2 => x3 => Kind$Parser$equality$(x0, x1, x2, x3);

    function Kind$Parser$inequality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!=", _idx$3, _code$4);
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
                                var $3233 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3225);
                                var _term$18 = Kind$Term$app$(Kind$Term$ref$("Not"), _term$17);
                                var $3234 = Parser$Reply$value$($3231, $3232, Kind$Term$ori$($3233, _term$18));
                                var $3226 = $3234;
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
    const Kind$Parser$inequality = x0 => x1 => x2 => x3 => Kind$Parser$inequality$(x0, x1, x2, x3);

    function Kind$Parser$rewrite$(_init$1, _subt$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3236 = self.idx;
                var $3237 = self.code;
                var $3238 = self.err;
                var $3239 = Parser$Reply$error$($3236, $3237, $3238);
                var $3235 = $3239;
                break;
            case 'Parser.Reply.value':
                var $3240 = self.idx;
                var $3241 = self.code;
                var self = Kind$Parser$text$("rewrite", $3240, $3241);
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
                        var self = Kind$Parser$name1$($3247, $3248);
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
                                var self = Kind$Parser$text$("in", $3254, $3255);
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
                                        var self = Kind$Parser$term$($3262, $3263);
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
                                                var self = Kind$Parser$text$("with", $3269, $3270);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3273 = self.idx;
                                                        var $3274 = self.code;
                                                        var $3275 = self.err;
                                                        var $3276 = Parser$Reply$error$($3273, $3274, $3275);
                                                        var $3272 = $3276;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3277 = self.idx;
                                                        var $3278 = self.code;
                                                        var self = Kind$Parser$term$($3277, $3278);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3280 = self.idx;
                                                                var $3281 = self.code;
                                                                var $3282 = self.err;
                                                                var $3283 = Parser$Reply$error$($3280, $3281, $3282);
                                                                var $3279 = $3283;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3284 = self.idx;
                                                                var $3285 = self.code;
                                                                var $3286 = self.val;
                                                                var self = Kind$Parser$stop$(_init$1, $3284, $3285);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $3288 = self.idx;
                                                                        var $3289 = self.code;
                                                                        var $3290 = self.err;
                                                                        var $3291 = Parser$Reply$error$($3288, $3289, $3290);
                                                                        var $3287 = $3291;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $3292 = self.idx;
                                                                        var $3293 = self.code;
                                                                        var $3294 = self.val;
                                                                        var _term$29 = Kind$Term$ref$("Equal.rewrite");
                                                                        var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                        var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                        var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                        var _term$33 = Kind$Term$app$(_term$32, $3286);
                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$lam$($3256, (_x$34 => {
                                                                            var $3296 = $3271;
                                                                            return $3296;
                                                                        })));
                                                                        var _term$35 = Kind$Term$app$(_term$34, _subt$2);
                                                                        var $3295 = Parser$Reply$value$($3292, $3293, Kind$Term$ori$($3294, _term$35));
                                                                        var $3287 = $3295;
                                                                        break;
                                                                };
                                                                var $3279 = $3287;
                                                                break;
                                                        };
                                                        var $3272 = $3279;
                                                        break;
                                                };
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
                var $3235 = $3242;
                break;
        };
        return $3235;
    };
    const Kind$Parser$rewrite = x0 => x1 => x2 => x3 => Kind$Parser$rewrite$(x0, x1, x2, x3);

    function Kind$Term$ann$(_done$1, _term$2, _type$3) {
        var $3297 = ({
            _: 'Kind.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $3297;
    };
    const Kind$Term$ann = x0 => x1 => x2 => Kind$Term$ann$(x0, x1, x2);

    function Kind$Parser$annotation$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
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
                var self = Kind$Parser$term$($3303, $3304);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3306 = self.idx;
                        var $3307 = self.code;
                        var $3308 = self.err;
                        var $3309 = Parser$Reply$error$($3306, $3307, $3308);
                        var $3305 = $3309;
                        break;
                    case 'Parser.Reply.value':
                        var $3310 = self.idx;
                        var $3311 = self.code;
                        var $3312 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3310, $3311);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3314 = self.idx;
                                var $3315 = self.code;
                                var $3316 = self.err;
                                var $3317 = Parser$Reply$error$($3314, $3315, $3316);
                                var $3313 = $3317;
                                break;
                            case 'Parser.Reply.value':
                                var $3318 = self.idx;
                                var $3319 = self.code;
                                var $3320 = self.val;
                                var $3321 = Parser$Reply$value$($3318, $3319, Kind$Term$ori$($3320, Kind$Term$ann$(Bool$false, _term$2, $3312)));
                                var $3313 = $3321;
                                break;
                        };
                        var $3305 = $3313;
                        break;
                };
                var $3298 = $3305;
                break;
        };
        return $3298;
    };
    const Kind$Parser$annotation = x0 => x1 => x2 => x3 => Kind$Parser$annotation$(x0, x1, x2, x3);

    function Kind$Parser$application$hole$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!", _idx$3, _code$4);
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
                var self = Kind$Parser$stop$(_init$1, $3327, $3328);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3330 = self.idx;
                        var $3331 = self.code;
                        var $3332 = self.err;
                        var $3333 = Parser$Reply$error$($3330, $3331, $3332);
                        var $3329 = $3333;
                        break;
                    case 'Parser.Reply.value':
                        var $3334 = self.idx;
                        var $3335 = self.code;
                        var $3336 = self.val;
                        var $3337 = Parser$Reply$value$($3334, $3335, Kind$Term$ori$($3336, Kind$Term$app$(_term$2, Kind$Term$hol$(Bits$e))));
                        var $3329 = $3337;
                        break;
                };
                var $3322 = $3329;
                break;
        };
        return $3322;
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
                        var $3339 = self.idx;
                        var $3340 = self.code;
                        var $3341 = self.val;
                        var $3342 = Kind$Parser$suffix$(_init$1, $3341, $3339, $3340);
                        var $3338 = $3342;
                        break;
                    case 'Parser.Reply.error':
                        var $3343 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $3338 = $3343;
                        break;
                };
                return $3338;
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
                var $3345 = self.idx;
                var $3346 = self.code;
                var $3347 = self.err;
                var $3348 = Parser$Reply$error$($3345, $3346, $3347);
                var $3344 = $3348;
                break;
            case 'Parser.Reply.value':
                var $3349 = self.idx;
                var $3350 = self.code;
                var $3351 = self.val;
                var self = Parser$first_of$(List$cons$(Kind$Parser$type, List$cons$(Kind$Parser$forall, List$cons$(Kind$Parser$lambda, List$cons$(Kind$Parser$lambda$erased, List$cons$(Kind$Parser$lambda$nameless, List$cons$(Kind$Parser$parenthesis, List$cons$(Kind$Parser$letforrange$u32, List$cons$(Kind$Parser$letforrange$nat, List$cons$(Kind$Parser$letforin, List$cons$(Kind$Parser$let, List$cons$(Kind$Parser$get, List$cons$(Kind$Parser$def, List$cons$(Kind$Parser$goal_rewrite, List$cons$(Kind$Parser$if, List$cons$(Kind$Parser$char, List$cons$(Kind$Parser$string, List$cons$(Kind$Parser$pair, List$cons$(Kind$Parser$sigma$type, List$cons$(Kind$Parser$some, List$cons$(Kind$Parser$apply, List$cons$(Kind$Parser$mirror, List$cons$(Kind$Parser$list, List$cons$(Kind$Parser$log, List$cons$(Kind$Parser$do, List$cons$(Kind$Parser$case, List$cons$(Kind$Parser$open, List$cons$(Kind$Parser$switch, List$cons$(Kind$Parser$goal, List$cons$(Kind$Parser$hole, List$cons$(Kind$Parser$u8, List$cons$(Kind$Parser$u16, List$cons$(Kind$Parser$u32, List$cons$(Kind$Parser$u64, List$cons$(Kind$Parser$nat, List$cons$(Kind$Parser$reference, List$nil))))))))))))))))))))))))))))))))))))($3349)($3350);
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
                        var $3359 = self.val;
                        var $3360 = Kind$Parser$suffix$($3351, $3359, $3357, $3358);
                        var $3352 = $3360;
                        break;
                };
                var $3344 = $3352;
                break;
        };
        return $3344;
    };
    const Kind$Parser$term = x0 => x1 => Kind$Parser$term$(x0, x1);

    function Kind$Parser$name_term$(_sep$1, _idx$2, _code$3) {
        var self = Kind$Parser$name$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3362 = self.idx;
                var $3363 = self.code;
                var $3364 = self.err;
                var $3365 = Parser$Reply$error$($3362, $3363, $3364);
                var $3361 = $3365;
                break;
            case 'Parser.Reply.value':
                var $3366 = self.idx;
                var $3367 = self.code;
                var $3368 = self.val;
                var self = Kind$Parser$text$(_sep$1, $3366, $3367);
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
                        var self = Kind$Parser$term$($3374, $3375);
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
                                var $3383 = self.val;
                                var $3384 = Parser$Reply$value$($3381, $3382, Pair$new$($3368, $3383));
                                var $3376 = $3384;
                                break;
                        };
                        var $3369 = $3376;
                        break;
                };
                var $3361 = $3369;
                break;
        };
        return $3361;
    };
    const Kind$Parser$name_term = x0 => x1 => x2 => Kind$Parser$name_term$(x0, x1, x2);

    function Kind$Binder$new$(_eras$1, _name$2, _term$3) {
        var $3385 = ({
            _: 'Kind.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $3385;
    };
    const Kind$Binder$new = x0 => x1 => x2 => Kind$Binder$new$(x0, x1, x2);

    function Kind$Parser$binder$homo$(_sep$1, _eras$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$((() => {
            var self = _eras$2;
            if (self) {
                var $3387 = "<";
                return $3387;
            } else {
                var $3388 = "(";
                return $3388;
            };
        })(), _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3389 = self.idx;
                var $3390 = self.code;
                var $3391 = self.err;
                var $3392 = Parser$Reply$error$($3389, $3390, $3391);
                var $3386 = $3392;
                break;
            case 'Parser.Reply.value':
                var $3393 = self.idx;
                var $3394 = self.code;
                var self = Parser$until1$(Kind$Parser$text((() => {
                    var self = _eras$2;
                    if (self) {
                        var $3396 = ">";
                        return $3396;
                    } else {
                        var $3397 = ")";
                        return $3397;
                    };
                })()), Kind$Parser$item(Kind$Parser$name_term(_sep$1)), $3393, $3394);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3398 = self.idx;
                        var $3399 = self.code;
                        var $3400 = self.err;
                        var $3401 = Parser$Reply$error$($3398, $3399, $3400);
                        var $3395 = $3401;
                        break;
                    case 'Parser.Reply.value':
                        var $3402 = self.idx;
                        var $3403 = self.code;
                        var $3404 = self.val;
                        var $3405 = Parser$Reply$value$($3402, $3403, List$mapped$($3404, (_pair$11 => {
                            var self = _pair$11;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3407 = self.fst;
                                    var $3408 = self.snd;
                                    var $3409 = Kind$Binder$new$(_eras$2, $3407, $3408);
                                    var $3406 = $3409;
                                    break;
                            };
                            return $3406;
                        })));
                        var $3395 = $3405;
                        break;
                };
                var $3386 = $3395;
                break;
        };
        return $3386;
    };
    const Kind$Parser$binder$homo = x0 => x1 => x2 => x3 => Kind$Parser$binder$homo$(x0, x1, x2, x3);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3411 = self.head;
                var $3412 = self.tail;
                var $3413 = List$cons$($3411, List$concat$($3412, _bs$3));
                var $3410 = $3413;
                break;
            case 'List.nil':
                var $3414 = _bs$3;
                var $3410 = $3414;
                break;
        };
        return $3410;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $3416 = self.head;
                var $3417 = self.tail;
                var $3418 = List$concat$($3416, List$flatten$($3417));
                var $3415 = $3418;
                break;
            case 'List.nil':
                var $3419 = List$nil;
                var $3415 = $3419;
                break;
        };
        return $3415;
    };
    const List$flatten = x0 => List$flatten$(x0);

    function Kind$Parser$binder$(_sep$1, _idx$2, _code$3) {
        var self = Parser$many1$(Parser$first_of$(List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$true), List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$false), List$nil))), _idx$2, _code$3);
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
                var $3428 = Parser$Reply$value$($3425, $3426, List$flatten$($3427));
                var $3420 = $3428;
                break;
        };
        return $3420;
    };
    const Kind$Parser$binder = x0 => x1 => x2 => Kind$Parser$binder$(x0, x1, x2);
    const List$length = a0 => (list_length(a0));

    function Kind$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.cons':
                var $3430 = self.head;
                var $3431 = self.tail;
                var self = $3430;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3433 = self.eras;
                        var $3434 = self.name;
                        var $3435 = self.term;
                        var $3436 = Kind$Term$all$($3433, "", $3434, $3435, (_s$8 => _x$9 => {
                            var $3437 = Kind$Parser$make_forall$($3431, _body$2);
                            return $3437;
                        }));
                        var $3432 = $3436;
                        break;
                };
                var $3429 = $3432;
                break;
            case 'List.nil':
                var $3438 = _body$2;
                var $3429 = $3438;
                break;
        };
        return $3429;
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
                        var $3439 = self.head;
                        var $3440 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $3442 = Maybe$some$($3439);
                            var $3441 = $3442;
                        } else {
                            var $3443 = (self - 1n);
                            var $3444 = List$at$($3443, $3440);
                            var $3441 = $3444;
                        };
                        return $3441;
                    case 'List.nil':
                        var $3445 = Maybe$none;
                        return $3445;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $3446 = List$at$(_index$2, List$reverse$(_list$3));
        return $3446;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Kind$Term$var$(_name$1, _indx$2) {
        var $3447 = ({
            _: 'Kind.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $3447;
    };
    const Kind$Term$var = x0 => x1 => Kind$Term$var$(x0, x1);

    function Kind$Context$get_name_skips$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3449 = Pair$new$("", 0n);
            var $3448 = $3449;
        } else {
            var $3450 = self.charCodeAt(0);
            var $3451 = self.slice(1);
            var _name_skips$4 = Kind$Context$get_name_skips$($3451);
            var self = _name_skips$4;
            switch (self._) {
                case 'Pair.new':
                    var $3453 = self.fst;
                    var $3454 = self.snd;
                    var self = ($3450 === 94);
                    if (self) {
                        var $3456 = Pair$new$($3453, Nat$succ$($3454));
                        var $3455 = $3456;
                    } else {
                        var $3457 = Pair$new$(String$cons$($3450, $3453), $3454);
                        var $3455 = $3457;
                    };
                    var $3452 = $3455;
                    break;
            };
            var $3448 = $3452;
        };
        return $3448;
    };
    const Kind$Context$get_name_skips = x0 => Kind$Context$get_name_skips$(x0);

    function Kind$Name$eql$(_a$1, _b$2) {
        var $3458 = (_a$1 === _b$2);
        return $3458;
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
                        var $3459 = self.head;
                        var $3460 = self.tail;
                        var self = $3459;
                        switch (self._) {
                            case 'Pair.new':
                                var $3462 = self.fst;
                                var $3463 = self.snd;
                                var self = Kind$Name$eql$(_name$1, $3462);
                                if (self) {
                                    var self = _skip$2;
                                    if (self === 0n) {
                                        var $3466 = Maybe$some$($3463);
                                        var $3465 = $3466;
                                    } else {
                                        var $3467 = (self - 1n);
                                        var $3468 = Kind$Context$find$go$(_name$1, $3467, $3460);
                                        var $3465 = $3468;
                                    };
                                    var $3464 = $3465;
                                } else {
                                    var $3469 = Kind$Context$find$go$(_name$1, _skip$2, $3460);
                                    var $3464 = $3469;
                                };
                                var $3461 = $3464;
                                break;
                        };
                        return $3461;
                    case 'List.nil':
                        var $3470 = Maybe$none;
                        return $3470;
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
                var $3472 = self.fst;
                var $3473 = self.snd;
                var $3474 = Kind$Context$find$go$($3472, $3473, _ctx$2);
                var $3471 = $3474;
                break;
        };
        return $3471;
    };
    const Kind$Context$find = x0 => x1 => Kind$Context$find$(x0, x1);

    function Kind$Path$o$(_path$1, _x$2) {
        var $3475 = _path$1((_x$2 + '0'));
        return $3475;
    };
    const Kind$Path$o = x0 => x1 => Kind$Path$o$(x0, x1);

    function Kind$Path$i$(_path$1, _x$2) {
        var $3476 = _path$1((_x$2 + '1'));
        return $3476;
    };
    const Kind$Path$i = x0 => x1 => Kind$Path$i$(x0, x1);

    function Kind$Path$to_bits$(_path$1) {
        var $3477 = _path$1(Bits$e);
        return $3477;
    };
    const Kind$Path$to_bits = x0 => Kind$Path$to_bits$(x0);

    function Kind$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kind.Term.var':
                var $3479 = self.name;
                var $3480 = self.indx;
                var self = List$at_last$($3480, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3482 = self.value;
                        var $3483 = Pair$snd$($3482);
                        var $3481 = $3483;
                        break;
                    case 'Maybe.none':
                        var $3484 = Kind$Term$var$($3479, $3480);
                        var $3481 = $3484;
                        break;
                };
                var $3478 = $3481;
                break;
            case 'Kind.Term.ref':
                var $3485 = self.name;
                var self = Kind$Context$find$($3485, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3487 = self.value;
                        var $3488 = $3487;
                        var $3486 = $3488;
                        break;
                    case 'Maybe.none':
                        var $3489 = Kind$Term$ref$($3485);
                        var $3486 = $3489;
                        break;
                };
                var $3478 = $3486;
                break;
            case 'Kind.Term.all':
                var $3490 = self.eras;
                var $3491 = self.self;
                var $3492 = self.name;
                var $3493 = self.xtyp;
                var $3494 = self.body;
                var _vlen$9 = (list_length(_vars$1));
                var $3495 = Kind$Term$all$($3490, $3491, $3492, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3493), (_s$10 => _x$11 => {
                    var $3496 = Kind$Term$bind$(List$cons$(Pair$new$($3492, _x$11), List$cons$(Pair$new$($3491, _s$10), _vars$1)), Kind$Path$i(_path$2), $3494(Kind$Term$var$($3491, _vlen$9))(Kind$Term$var$($3492, Nat$succ$(_vlen$9))));
                    return $3496;
                }));
                var $3478 = $3495;
                break;
            case 'Kind.Term.lam':
                var $3497 = self.name;
                var $3498 = self.body;
                var _vlen$6 = (list_length(_vars$1));
                var $3499 = Kind$Term$lam$($3497, (_x$7 => {
                    var $3500 = Kind$Term$bind$(List$cons$(Pair$new$($3497, _x$7), _vars$1), Kind$Path$o(_path$2), $3498(Kind$Term$var$($3497, _vlen$6)));
                    return $3500;
                }));
                var $3478 = $3499;
                break;
            case 'Kind.Term.app':
                var $3501 = self.func;
                var $3502 = self.argm;
                var $3503 = Kind$Term$app$(Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3501), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3502));
                var $3478 = $3503;
                break;
            case 'Kind.Term.let':
                var $3504 = self.name;
                var $3505 = self.expr;
                var $3506 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3507 = Kind$Term$let$($3504, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3505), (_x$8 => {
                    var $3508 = Kind$Term$bind$(List$cons$(Pair$new$($3504, _x$8), _vars$1), Kind$Path$i(_path$2), $3506(Kind$Term$var$($3504, _vlen$7)));
                    return $3508;
                }));
                var $3478 = $3507;
                break;
            case 'Kind.Term.def':
                var $3509 = self.name;
                var $3510 = self.expr;
                var $3511 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3512 = Kind$Term$def$($3509, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3510), (_x$8 => {
                    var $3513 = Kind$Term$bind$(List$cons$(Pair$new$($3509, _x$8), _vars$1), Kind$Path$i(_path$2), $3511(Kind$Term$var$($3509, _vlen$7)));
                    return $3513;
                }));
                var $3478 = $3512;
                break;
            case 'Kind.Term.ann':
                var $3514 = self.done;
                var $3515 = self.term;
                var $3516 = self.type;
                var $3517 = Kind$Term$ann$($3514, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3515), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3516));
                var $3478 = $3517;
                break;
            case 'Kind.Term.gol':
                var $3518 = self.name;
                var $3519 = self.dref;
                var $3520 = self.verb;
                var $3521 = Kind$Term$gol$($3518, $3519, $3520);
                var $3478 = $3521;
                break;
            case 'Kind.Term.nat':
                var $3522 = self.natx;
                var $3523 = Kind$Term$nat$($3522);
                var $3478 = $3523;
                break;
            case 'Kind.Term.chr':
                var $3524 = self.chrx;
                var $3525 = Kind$Term$chr$($3524);
                var $3478 = $3525;
                break;
            case 'Kind.Term.str':
                var $3526 = self.strx;
                var $3527 = Kind$Term$str$($3526);
                var $3478 = $3527;
                break;
            case 'Kind.Term.cse':
                var $3528 = self.expr;
                var $3529 = self.name;
                var $3530 = self.with;
                var $3531 = self.cses;
                var $3532 = self.moti;
                var _expr$10 = Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3528);
                var _name$11 = $3529;
                var _wyth$12 = $3530;
                var _cses$13 = $3531;
                var _moti$14 = $3532;
                var $3533 = Kind$Term$cse$(Kind$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $3478 = $3533;
                break;
            case 'Kind.Term.ori':
                var $3534 = self.orig;
                var $3535 = self.expr;
                var $3536 = Kind$Term$ori$($3534, Kind$Term$bind$(_vars$1, _path$2, $3535));
                var $3478 = $3536;
                break;
            case 'Kind.Term.typ':
                var $3537 = Kind$Term$typ;
                var $3478 = $3537;
                break;
            case 'Kind.Term.hol':
                var $3538 = Kind$Term$hol$(Kind$Path$to_bits$(_path$2));
                var $3478 = $3538;
                break;
        };
        return $3478;
    };
    const Kind$Term$bind = x0 => x1 => x2 => Kind$Term$bind$(x0, x1, x2);
    const Kind$Status$done = ({
        _: 'Kind.Status.done'
    });

    function Kind$define$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _done$9, _defs$10) {
        var self = _done$9;
        if (self) {
            var $3540 = Kind$Status$done;
            var _stat$11 = $3540;
        } else {
            var $3541 = Kind$Status$init;
            var _stat$11 = $3541;
        };
        var $3539 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$11), _defs$10);
        return $3539;
    };
    const Kind$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Kind$define$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Kind$Parser$file$def$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3543 = self.idx;
                var $3544 = self.code;
                var $3545 = self.err;
                var $3546 = Parser$Reply$error$($3543, $3544, $3545);
                var $3542 = $3546;
                break;
            case 'Parser.Reply.value':
                var $3547 = self.idx;
                var $3548 = self.code;
                var $3549 = self.val;
                var self = Kind$Parser$name1$($3547, $3548);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3551 = self.idx;
                        var $3552 = self.code;
                        var $3553 = self.err;
                        var $3554 = Parser$Reply$error$($3551, $3552, $3553);
                        var $3550 = $3554;
                        break;
                    case 'Parser.Reply.value':
                        var $3555 = self.idx;
                        var $3556 = self.code;
                        var $3557 = self.val;
                        var self = Parser$many$(Kind$Parser$binder(":"))($3555)($3556);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3559 = self.idx;
                                var $3560 = self.code;
                                var $3561 = self.err;
                                var $3562 = Parser$Reply$error$($3559, $3560, $3561);
                                var $3558 = $3562;
                                break;
                            case 'Parser.Reply.value':
                                var $3563 = self.idx;
                                var $3564 = self.code;
                                var $3565 = self.val;
                                var _args$15 = List$flatten$($3565);
                                var self = Kind$Parser$text$(":", $3563, $3564);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3567 = self.idx;
                                        var $3568 = self.code;
                                        var $3569 = self.err;
                                        var $3570 = Parser$Reply$error$($3567, $3568, $3569);
                                        var $3566 = $3570;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3571 = self.idx;
                                        var $3572 = self.code;
                                        var self = Kind$Parser$term$($3571, $3572);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3574 = self.idx;
                                                var $3575 = self.code;
                                                var $3576 = self.err;
                                                var $3577 = Parser$Reply$error$($3574, $3575, $3576);
                                                var $3573 = $3577;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3578 = self.idx;
                                                var $3579 = self.code;
                                                var $3580 = self.val;
                                                var self = Kind$Parser$term$($3578, $3579);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3582 = self.idx;
                                                        var $3583 = self.code;
                                                        var $3584 = self.err;
                                                        var $3585 = Parser$Reply$error$($3582, $3583, $3584);
                                                        var $3581 = $3585;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3586 = self.idx;
                                                        var $3587 = self.code;
                                                        var $3588 = self.val;
                                                        var self = Kind$Parser$stop$($3549, $3586, $3587);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3590 = self.idx;
                                                                var $3591 = self.code;
                                                                var $3592 = self.err;
                                                                var $3593 = Parser$Reply$error$($3590, $3591, $3592);
                                                                var $3589 = $3593;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3594 = self.idx;
                                                                var $3595 = self.code;
                                                                var $3596 = self.val;
                                                                var _arit$28 = (list_length(_args$15));
                                                                var _type$29 = Kind$Parser$make_forall$(_args$15, $3580);
                                                                var _term$30 = Kind$Parser$make_lambda$(List$mapped$(_args$15, (_x$30 => {
                                                                    var self = _x$30;
                                                                    switch (self._) {
                                                                        case 'Kind.Binder.new':
                                                                            var $3599 = self.name;
                                                                            var $3600 = $3599;
                                                                            var $3598 = $3600;
                                                                            break;
                                                                    };
                                                                    return $3598;
                                                                })), $3588);
                                                                var _type$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                                    var $3601 = (_x$31 + '1');
                                                                    return $3601;
                                                                }), _type$29);
                                                                var _term$32 = Kind$Term$bind$(List$nil, (_x$32 => {
                                                                    var $3602 = (_x$32 + '0');
                                                                    return $3602;
                                                                }), _term$30);
                                                                var _defs$33 = Kind$define$(_file$1, _code$2, $3596, $3557, _term$32, _type$31, Bool$false, _arit$28, Bool$false, _defs$3);
                                                                var $3597 = Parser$Reply$value$($3594, $3595, _defs$33);
                                                                var $3589 = $3597;
                                                                break;
                                                        };
                                                        var $3581 = $3589;
                                                        break;
                                                };
                                                var $3573 = $3581;
                                                break;
                                        };
                                        var $3566 = $3573;
                                        break;
                                };
                                var $3558 = $3566;
                                break;
                        };
                        var $3550 = $3558;
                        break;
                };
                var $3542 = $3550;
                break;
        };
        return $3542;
    };
    const Kind$Parser$file$def = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$def$(x0, x1, x2, x3, x4);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $3604 = self.value;
                var $3605 = $3604;
                var $3603 = $3605;
                break;
            case 'Maybe.none':
                var $3606 = _a$2;
                var $3603 = $3606;
                break;
        };
        return $3603;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Kind$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $3607 = ({
            _: 'Kind.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $3607;
    };
    const Kind$Constructor$new = x0 => x1 => x2 => Kind$Constructor$new$(x0, x1, x2);

    function Kind$Parser$constructor$(_namespace$1, _idx$2, _code$3) {
        var self = Kind$Parser$name1$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3609 = self.idx;
                var $3610 = self.code;
                var $3611 = self.err;
                var $3612 = Parser$Reply$error$($3609, $3610, $3611);
                var $3608 = $3612;
                break;
            case 'Parser.Reply.value':
                var $3613 = self.idx;
                var $3614 = self.code;
                var $3615 = self.val;
                var self = Parser$maybe$(Kind$Parser$binder(":"), $3613, $3614);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3617 = self.idx;
                        var $3618 = self.code;
                        var $3619 = self.err;
                        var $3620 = Parser$Reply$error$($3617, $3618, $3619);
                        var $3616 = $3620;
                        break;
                    case 'Parser.Reply.value':
                        var $3621 = self.idx;
                        var $3622 = self.code;
                        var $3623 = self.val;
                        var self = Parser$maybe$((_idx$10 => _code$11 => {
                            var self = Kind$Parser$text$("~", _idx$10, _code$11);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $3626 = self.idx;
                                    var $3627 = self.code;
                                    var $3628 = self.err;
                                    var $3629 = Parser$Reply$error$($3626, $3627, $3628);
                                    var $3625 = $3629;
                                    break;
                                case 'Parser.Reply.value':
                                    var $3630 = self.idx;
                                    var $3631 = self.code;
                                    var $3632 = Kind$Parser$binder$("=", $3630, $3631);
                                    var $3625 = $3632;
                                    break;
                            };
                            return $3625;
                        }), $3621, $3622);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3633 = self.idx;
                                var $3634 = self.code;
                                var $3635 = self.err;
                                var $3636 = Parser$Reply$error$($3633, $3634, $3635);
                                var $3624 = $3636;
                                break;
                            case 'Parser.Reply.value':
                                var $3637 = self.idx;
                                var $3638 = self.code;
                                var $3639 = self.val;
                                var _args$13 = Maybe$default$(List$nil, $3623);
                                var _inds$14 = Maybe$default$(List$nil, $3639);
                                var $3640 = Parser$Reply$value$($3637, $3638, Kind$Constructor$new$($3615, _args$13, _inds$14));
                                var $3624 = $3640;
                                break;
                        };
                        var $3616 = $3624;
                        break;
                };
                var $3608 = $3616;
                break;
        };
        return $3608;
    };
    const Kind$Parser$constructor = x0 => x1 => x2 => Kind$Parser$constructor$(x0, x1, x2);

    function Kind$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $3641 = ({
            _: 'Kind.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $3641;
    };
    const Kind$Datatype$new = x0 => x1 => x2 => x3 => Kind$Datatype$new$(x0, x1, x2, x3);

    function Kind$Parser$datatype$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("type ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3643 = self.idx;
                var $3644 = self.code;
                var $3645 = self.err;
                var $3646 = Parser$Reply$error$($3643, $3644, $3645);
                var $3642 = $3646;
                break;
            case 'Parser.Reply.value':
                var $3647 = self.idx;
                var $3648 = self.code;
                var self = Kind$Parser$name1$($3647, $3648);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3650 = self.idx;
                        var $3651 = self.code;
                        var $3652 = self.err;
                        var $3653 = Parser$Reply$error$($3650, $3651, $3652);
                        var $3649 = $3653;
                        break;
                    case 'Parser.Reply.value':
                        var $3654 = self.idx;
                        var $3655 = self.code;
                        var $3656 = self.val;
                        var self = Parser$maybe$(Kind$Parser$binder(":"), $3654, $3655);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3658 = self.idx;
                                var $3659 = self.code;
                                var $3660 = self.err;
                                var $3661 = Parser$Reply$error$($3658, $3659, $3660);
                                var $3657 = $3661;
                                break;
                            case 'Parser.Reply.value':
                                var $3662 = self.idx;
                                var $3663 = self.code;
                                var $3664 = self.val;
                                var self = Parser$maybe$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("~", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $3667 = self.idx;
                                            var $3668 = self.code;
                                            var $3669 = self.err;
                                            var $3670 = Parser$Reply$error$($3667, $3668, $3669);
                                            var $3666 = $3670;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $3671 = self.idx;
                                            var $3672 = self.code;
                                            var $3673 = Kind$Parser$binder$(":", $3671, $3672);
                                            var $3666 = $3673;
                                            break;
                                    };
                                    return $3666;
                                }), $3662, $3663);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3674 = self.idx;
                                        var $3675 = self.code;
                                        var $3676 = self.err;
                                        var $3677 = Parser$Reply$error$($3674, $3675, $3676);
                                        var $3665 = $3677;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3678 = self.idx;
                                        var $3679 = self.code;
                                        var $3680 = self.val;
                                        var _pars$15 = Maybe$default$(List$nil, $3664);
                                        var _inds$16 = Maybe$default$(List$nil, $3680);
                                        var self = Kind$Parser$text$("{", $3678, $3679);
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
                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item(Kind$Parser$constructor($3656)))($3686)($3687);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3689 = self.idx;
                                                        var $3690 = self.code;
                                                        var $3691 = self.err;
                                                        var $3692 = Parser$Reply$error$($3689, $3690, $3691);
                                                        var $3688 = $3692;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3693 = self.idx;
                                                        var $3694 = self.code;
                                                        var $3695 = self.val;
                                                        var $3696 = Parser$Reply$value$($3693, $3694, Kind$Datatype$new$($3656, _pars$15, _inds$16, $3695));
                                                        var $3688 = $3696;
                                                        break;
                                                };
                                                var $3681 = $3688;
                                                break;
                                        };
                                        var $3665 = $3681;
                                        break;
                                };
                                var $3657 = $3665;
                                break;
                        };
                        var $3649 = $3657;
                        break;
                };
                var $3642 = $3649;
                break;
        };
        return $3642;
    };
    const Kind$Parser$datatype = x0 => x1 => Kind$Parser$datatype$(x0, x1);

    function Kind$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.cons':
                var $3698 = self.head;
                var $3699 = self.tail;
                var self = $3698;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3701 = self.eras;
                        var $3702 = self.name;
                        var $3703 = self.term;
                        var $3704 = Kind$Term$all$($3701, "", $3702, $3703, (_s$9 => _x$10 => {
                            var $3705 = Kind$Datatype$build_term$motive$go$(_type$1, _name$2, $3699);
                            return $3705;
                        }));
                        var $3700 = $3704;
                        break;
                };
                var $3697 = $3700;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3707 = self.pars;
                        var $3708 = self.inds;
                        var _slf$8 = Kind$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $3711 = _slf$8;
                            var $3712 = $3707;
                            let _slf$10 = $3711;
                            let _var$9;
                            while ($3712._ === 'List.cons') {
                                _var$9 = $3712.head;
                                var $3711 = Kind$Term$app$(_slf$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3713 = self.name;
                                            var $3714 = $3713;
                                            return $3714;
                                    };
                                })()));
                                _slf$10 = $3711;
                                $3712 = $3712.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $3716 = _slf$9;
                            var $3717 = $3708;
                            let _slf$11 = $3716;
                            let _var$10;
                            while ($3717._ === 'List.cons') {
                                _var$10 = $3717.head;
                                var $3716 = Kind$Term$app$(_slf$11, Kind$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3718 = self.name;
                                            var $3719 = $3718;
                                            return $3719;
                                    };
                                })()));
                                _slf$11 = $3716;
                                $3717 = $3717.tail;
                            }
                            return _slf$11;
                        })();
                        var $3709 = Kind$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $3720 = Kind$Term$typ;
                            return $3720;
                        }));
                        var $3706 = $3709;
                        break;
                };
                var $3697 = $3706;
                break;
        };
        return $3697;
    };
    const Kind$Datatype$build_term$motive$go = x0 => x1 => x2 => Kind$Datatype$build_term$motive$go$(x0, x1, x2);

    function Kind$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3722 = self.name;
                var $3723 = self.inds;
                var $3724 = Kind$Datatype$build_term$motive$go$(_type$1, $3722, $3723);
                var $3721 = $3724;
                break;
        };
        return $3721;
    };
    const Kind$Datatype$build_term$motive = x0 => Kind$Datatype$build_term$motive$(x0);

    function Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.cons':
                var $3726 = self.head;
                var $3727 = self.tail;
                var self = $3726;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3729 = self.eras;
                        var $3730 = self.name;
                        var $3731 = self.term;
                        var _eras$9 = $3729;
                        var _name$10 = $3730;
                        var _xtyp$11 = $3731;
                        var _body$12 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3727);
                        var $3732 = Kind$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $3733 = _body$12;
                            return $3733;
                        }));
                        var $3728 = $3732;
                        break;
                };
                var $3725 = $3728;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3735 = self.name;
                        var $3736 = self.pars;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Kind.Constructor.new':
                                var $3738 = self.name;
                                var $3739 = self.args;
                                var $3740 = self.inds;
                                var _ret$11 = Kind$Term$ref$(Kind$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $3743 = _ret$11;
                                    var $3744 = $3740;
                                    let _ret$13 = $3743;
                                    let _var$12;
                                    while ($3744._ === 'List.cons') {
                                        _var$12 = $3744.head;
                                        var $3743 = Kind$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3745 = self.term;
                                                    var $3746 = $3745;
                                                    return $3746;
                                            };
                                        })());
                                        _ret$13 = $3743;
                                        $3744 = $3744.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($3735, List$cons$(Kind$Name$read$("."), List$cons$($3738, List$nil))));
                                var _slf$14 = Kind$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $3748 = _slf$14;
                                    var $3749 = $3736;
                                    let _slf$16 = $3748;
                                    let _var$15;
                                    while ($3749._ === 'List.cons') {
                                        _var$15 = $3749.head;
                                        var $3748 = Kind$Term$app$(_slf$16, Kind$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3750 = self.name;
                                                    var $3751 = $3750;
                                                    return $3751;
                                            };
                                        })()));
                                        _slf$16 = $3748;
                                        $3749 = $3749.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $3753 = _slf$15;
                                    var $3754 = $3739;
                                    let _slf$17 = $3753;
                                    let _var$16;
                                    while ($3754._ === 'List.cons') {
                                        _var$16 = $3754.head;
                                        var $3753 = Kind$Term$app$(_slf$17, Kind$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3755 = self.name;
                                                    var $3756 = $3755;
                                                    return $3756;
                                            };
                                        })()));
                                        _slf$17 = $3753;
                                        $3754 = $3754.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $3741 = Kind$Term$app$(_ret$12, _slf$16);
                                var $3737 = $3741;
                                break;
                        };
                        var $3734 = $3737;
                        break;
                };
                var $3725 = $3734;
                break;
        };
        return $3725;
    };
    const Kind$Datatype$build_term$constructor$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kind.Constructor.new':
                var $3758 = self.args;
                var $3759 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3758);
                var $3757 = $3759;
                break;
        };
        return $3757;
    };
    const Kind$Datatype$build_term$constructor = x0 => x1 => Kind$Datatype$build_term$constructor$(x0, x1);

    function Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3761 = self.head;
                var $3762 = self.tail;
                var self = $3761;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3764 = self.name;
                        var $3765 = Kind$Term$all$(Bool$false, "", $3764, Kind$Datatype$build_term$constructor$(_type$1, $3761), (_s$9 => _x$10 => {
                            var $3766 = Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, $3762);
                            return $3766;
                        }));
                        var $3763 = $3765;
                        break;
                };
                var $3760 = $3763;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3768 = self.inds;
                        var _ret$8 = Kind$Term$ref$(Kind$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $3771 = _ret$8;
                            var $3772 = $3768;
                            let _ret$10 = $3771;
                            let _var$9;
                            while ($3772._ === 'List.cons') {
                                _var$9 = $3772.head;
                                var $3771 = Kind$Term$app$(_ret$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3773 = self.name;
                                            var $3774 = $3773;
                                            return $3774;
                                    };
                                })()));
                                _ret$10 = $3771;
                                $3772 = $3772.tail;
                            }
                            return _ret$10;
                        })();
                        var $3769 = Kind$Term$app$(_ret$9, Kind$Term$ref$((_name$2 + ".Self")));
                        var $3767 = $3769;
                        break;
                };
                var $3760 = $3767;
                break;
        };
        return $3760;
    };
    const Kind$Datatype$build_term$constructors$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3776 = self.name;
                var $3777 = self.ctrs;
                var $3778 = Kind$Datatype$build_term$constructors$go$(_type$1, $3776, $3777);
                var $3775 = $3778;
                break;
        };
        return $3775;
    };
    const Kind$Datatype$build_term$constructors = x0 => Kind$Datatype$build_term$constructors$(x0);

    function Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3780 = self.head;
                var $3781 = self.tail;
                var self = $3780;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3783 = self.name;
                        var $3784 = Kind$Term$lam$($3783, (_x$10 => {
                            var $3785 = Kind$Datatype$build_term$go$(_type$1, _name$2, $3781, _inds$4);
                            return $3785;
                        }));
                        var $3782 = $3784;
                        break;
                };
                var $3779 = $3782;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3787 = self.head;
                        var $3788 = self.tail;
                        var self = $3787;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3790 = self.name;
                                var $3791 = Kind$Term$lam$($3790, (_x$10 => {
                                    var $3792 = Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $3788);
                                    return $3792;
                                }));
                                var $3789 = $3791;
                                break;
                        };
                        var $3786 = $3789;
                        break;
                    case 'List.nil':
                        var $3793 = Kind$Term$all$(Bool$true, (_name$2 + ".Self"), Kind$Name$read$("P"), Kind$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $3794 = Kind$Datatype$build_term$constructors$(_type$1);
                            return $3794;
                        }));
                        var $3786 = $3793;
                        break;
                };
                var $3779 = $3786;
                break;
        };
        return $3779;
    };
    const Kind$Datatype$build_term$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_term$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3796 = self.name;
                var $3797 = self.pars;
                var $3798 = self.inds;
                var $3799 = Kind$Datatype$build_term$go$(_type$1, $3796, $3797, $3798);
                var $3795 = $3799;
                break;
        };
        return $3795;
    };
    const Kind$Datatype$build_term = x0 => Kind$Datatype$build_term$(x0);

    function Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3801 = self.head;
                var $3802 = self.tail;
                var self = $3801;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3804 = self.name;
                        var $3805 = self.term;
                        var $3806 = Kind$Term$all$(Bool$false, "", $3804, $3805, (_s$10 => _x$11 => {
                            var $3807 = Kind$Datatype$build_type$go$(_type$1, _name$2, $3802, _inds$4);
                            return $3807;
                        }));
                        var $3803 = $3806;
                        break;
                };
                var $3800 = $3803;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3809 = self.head;
                        var $3810 = self.tail;
                        var self = $3809;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3812 = self.name;
                                var $3813 = self.term;
                                var $3814 = Kind$Term$all$(Bool$false, "", $3812, $3813, (_s$10 => _x$11 => {
                                    var $3815 = Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $3810);
                                    return $3815;
                                }));
                                var $3811 = $3814;
                                break;
                        };
                        var $3808 = $3811;
                        break;
                    case 'List.nil':
                        var $3816 = Kind$Term$typ;
                        var $3808 = $3816;
                        break;
                };
                var $3800 = $3808;
                break;
        };
        return $3800;
    };
    const Kind$Datatype$build_type$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_type$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3818 = self.name;
                var $3819 = self.pars;
                var $3820 = self.inds;
                var $3821 = Kind$Datatype$build_type$go$(_type$1, $3818, $3819, $3820);
                var $3817 = $3821;
                break;
        };
        return $3817;
    };
    const Kind$Datatype$build_type = x0 => Kind$Datatype$build_type$(x0);

    function Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3823 = self.head;
                var $3824 = self.tail;
                var self = $3823;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3826 = self.name;
                        var $3827 = Kind$Term$lam$($3826, (_x$9 => {
                            var $3828 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3824);
                            return $3828;
                        }));
                        var $3825 = $3827;
                        break;
                };
                var $3822 = $3825;
                break;
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3830 = self.name;
                        var $3831 = self.args;
                        var _ret$7 = Kind$Term$ref$($3830);
                        var _ret$8 = (() => {
                            var $3834 = _ret$7;
                            var $3835 = $3831;
                            let _ret$9 = $3834;
                            let _arg$8;
                            while ($3835._ === 'List.cons') {
                                _arg$8 = $3835.head;
                                var $3834 = Kind$Term$app$(_ret$9, Kind$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3836 = self.name;
                                            var $3837 = $3836;
                                            return $3837;
                                    };
                                })()));
                                _ret$9 = $3834;
                                $3835 = $3835.tail;
                            }
                            return _ret$9;
                        })();
                        var $3832 = _ret$8;
                        var $3829 = $3832;
                        break;
                };
                var $3822 = $3829;
                break;
        };
        return $3822;
    };
    const Kind$Constructor$build_term$opt$go = x0 => x1 => x2 => Kind$Constructor$build_term$opt$go$(x0, x1, x2);

    function Kind$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3839 = self.ctrs;
                var $3840 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3839);
                var $3838 = $3840;
                break;
        };
        return $3838;
    };
    const Kind$Constructor$build_term$opt = x0 => x1 => Kind$Constructor$build_term$opt$(x0, x1);

    function Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3842 = self.head;
                var $3843 = self.tail;
                var self = $3842;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3845 = self.name;
                        var $3846 = Kind$Term$lam$($3845, (_x$11 => {
                            var $3847 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $3843, _args$5);
                            return $3847;
                        }));
                        var $3844 = $3846;
                        break;
                };
                var $3841 = $3844;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3849 = self.head;
                        var $3850 = self.tail;
                        var self = $3849;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3852 = self.name;
                                var $3853 = Kind$Term$lam$($3852, (_x$11 => {
                                    var $3854 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $3850);
                                    return $3854;
                                }));
                                var $3851 = $3853;
                                break;
                        };
                        var $3848 = $3851;
                        break;
                    case 'List.nil':
                        var $3855 = Kind$Term$lam$(Kind$Name$read$("P"), (_x$6 => {
                            var $3856 = Kind$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $3856;
                        }));
                        var $3848 = $3855;
                        break;
                };
                var $3841 = $3848;
                break;
        };
        return $3841;
    };
    const Kind$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3858 = self.name;
                var $3859 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3861 = self.args;
                        var $3862 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, $3858, $3859, $3861);
                        var $3860 = $3862;
                        break;
                };
                var $3857 = $3860;
                break;
        };
        return $3857;
    };
    const Kind$Constructor$build_term = x0 => x1 => Kind$Constructor$build_term$(x0, x1);

    function Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3864 = self.head;
                var $3865 = self.tail;
                var self = $3864;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3867 = self.eras;
                        var $3868 = self.name;
                        var $3869 = self.term;
                        var $3870 = Kind$Term$all$($3867, "", $3868, $3869, (_s$11 => _x$12 => {
                            var $3871 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $3865, _args$5);
                            return $3871;
                        }));
                        var $3866 = $3870;
                        break;
                };
                var $3863 = $3866;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3873 = self.head;
                        var $3874 = self.tail;
                        var self = $3873;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3876 = self.eras;
                                var $3877 = self.name;
                                var $3878 = self.term;
                                var $3879 = Kind$Term$all$($3876, "", $3877, $3878, (_s$11 => _x$12 => {
                                    var $3880 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $3874);
                                    return $3880;
                                }));
                                var $3875 = $3879;
                                break;
                        };
                        var $3872 = $3875;
                        break;
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Kind.Datatype.new':
                                var $3882 = self.pars;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Kind.Constructor.new':
                                        var $3884 = self.inds;
                                        var _type$13 = Kind$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $3887 = _type$13;
                                            var $3888 = $3882;
                                            let _type$15 = $3887;
                                            let _var$14;
                                            while ($3888._ === 'List.cons') {
                                                _var$14 = $3888.head;
                                                var $3887 = Kind$Term$app$(_type$15, Kind$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $3889 = self.name;
                                                            var $3890 = $3889;
                                                            return $3890;
                                                    };
                                                })()));
                                                _type$15 = $3887;
                                                $3888 = $3888.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $3892 = _type$14;
                                            var $3893 = $3884;
                                            let _type$16 = $3892;
                                            let _var$15;
                                            while ($3893._ === 'List.cons') {
                                                _var$15 = $3893.head;
                                                var $3892 = Kind$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $3894 = self.term;
                                                            var $3895 = $3894;
                                                            return $3895;
                                                    };
                                                })());
                                                _type$16 = $3892;
                                                $3893 = $3893.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $3885 = _type$15;
                                        var $3883 = $3885;
                                        break;
                                };
                                var $3881 = $3883;
                                break;
                        };
                        var $3872 = $3881;
                        break;
                };
                var $3863 = $3872;
                break;
        };
        return $3863;
    };
    const Kind$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3897 = self.name;
                var $3898 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3900 = self.args;
                        var $3901 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, $3897, $3898, $3900);
                        var $3899 = $3901;
                        break;
                };
                var $3896 = $3899;
                break;
        };
        return $3896;
    };
    const Kind$Constructor$build_type = x0 => x1 => Kind$Constructor$build_type$(x0, x1);

    function Kind$Parser$file$adt$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3903 = self.idx;
                var $3904 = self.code;
                var $3905 = self.err;
                var $3906 = Parser$Reply$error$($3903, $3904, $3905);
                var $3902 = $3906;
                break;
            case 'Parser.Reply.value':
                var $3907 = self.idx;
                var $3908 = self.code;
                var $3909 = self.val;
                var self = Kind$Parser$datatype$($3907, $3908);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3911 = self.idx;
                        var $3912 = self.code;
                        var $3913 = self.err;
                        var $3914 = Parser$Reply$error$($3911, $3912, $3913);
                        var $3910 = $3914;
                        break;
                    case 'Parser.Reply.value':
                        var $3915 = self.idx;
                        var $3916 = self.code;
                        var $3917 = self.val;
                        var self = Kind$Parser$stop$($3909, $3915, $3916);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3919 = self.idx;
                                var $3920 = self.code;
                                var $3921 = self.err;
                                var $3922 = Parser$Reply$error$($3919, $3920, $3921);
                                var $3918 = $3922;
                                break;
                            case 'Parser.Reply.value':
                                var $3923 = self.idx;
                                var $3924 = self.code;
                                var $3925 = self.val;
                                var self = $3917;
                                switch (self._) {
                                    case 'Kind.Datatype.new':
                                        var $3927 = self.name;
                                        var $3928 = self.pars;
                                        var $3929 = self.inds;
                                        var $3930 = self.ctrs;
                                        var _term$19 = Kind$Datatype$build_term$($3917);
                                        var _term$20 = Kind$Term$bind$(List$nil, (_x$20 => {
                                            var $3932 = (_x$20 + '1');
                                            return $3932;
                                        }), _term$19);
                                        var _type$21 = Kind$Datatype$build_type$($3917);
                                        var _type$22 = Kind$Term$bind$(List$nil, (_x$22 => {
                                            var $3933 = (_x$22 + '0');
                                            return $3933;
                                        }), _type$21);
                                        var _arit$23 = ((list_length($3928)) + (list_length($3929)));
                                        var _defs$24 = Kind$define$(_file$1, _code$2, $3925, $3927, _term$20, _type$22, Bool$false, _arit$23, Bool$false, _defs$3);
                                        var _defs$25 = List$fold$($3930, _defs$24, (_ctr$25 => _defs$26 => {
                                            var _typ_name$27 = $3927;
                                            var _ctr_arit$28 = (_arit$23 + (list_length((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $3935 = self.args;
                                                        var $3936 = $3935;
                                                        return $3936;
                                                };
                                            })())));
                                            var _ctr_name$29 = String$flatten$(List$cons$(_typ_name$27, List$cons$(Kind$Name$read$("."), List$cons$((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $3937 = self.name;
                                                        var $3938 = $3937;
                                                        return $3938;
                                                };
                                            })(), List$nil))));
                                            var _ctr_term$30 = Kind$Constructor$build_term$($3917, _ctr$25);
                                            var _ctr_term$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                var $3939 = (_x$31 + '1');
                                                return $3939;
                                            }), _ctr_term$30);
                                            var _ctr_type$32 = Kind$Constructor$build_type$($3917, _ctr$25);
                                            var _ctr_type$33 = Kind$Term$bind$(List$nil, (_x$33 => {
                                                var $3940 = (_x$33 + '0');
                                                return $3940;
                                            }), _ctr_type$32);
                                            var $3934 = Kind$define$(_file$1, _code$2, $3925, _ctr_name$29, _ctr_term$31, _ctr_type$33, Bool$true, _ctr_arit$28, Bool$false, _defs$26);
                                            return $3934;
                                        }));
                                        var $3931 = (_idx$26 => _code$27 => {
                                            var $3941 = Parser$Reply$value$(_idx$26, _code$27, _defs$25);
                                            return $3941;
                                        });
                                        var $3926 = $3931;
                                        break;
                                };
                                var $3926 = $3926($3923)($3924);
                                var $3918 = $3926;
                                break;
                        };
                        var $3910 = $3918;
                        break;
                };
                var $3902 = $3910;
                break;
        };
        return $3902;
    };
    const Kind$Parser$file$adt = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$adt$(x0, x1, x2, x3, x4);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $3943 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $3942 = $3943;
        } else {
            var $3944 = self.charCodeAt(0);
            var $3945 = self.slice(1);
            var $3946 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $3942 = $3946;
        };
        return $3942;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Kind$Parser$file$end$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$spaces(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3948 = self.idx;
                var $3949 = self.code;
                var $3950 = self.err;
                var $3951 = Parser$Reply$error$($3948, $3949, $3950);
                var $3947 = $3951;
                break;
            case 'Parser.Reply.value':
                var $3952 = self.idx;
                var $3953 = self.code;
                var self = Parser$eof$($3952, $3953);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3955 = self.idx;
                        var $3956 = self.code;
                        var $3957 = self.err;
                        var $3958 = Parser$Reply$error$($3955, $3956, $3957);
                        var $3954 = $3958;
                        break;
                    case 'Parser.Reply.value':
                        var $3959 = self.idx;
                        var $3960 = self.code;
                        var $3961 = Parser$Reply$value$($3959, $3960, _defs$3);
                        var $3954 = $3961;
                        break;
                };
                var $3947 = $3954;
                break;
        };
        return $3947;
    };
    const Kind$Parser$file$end = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$end$(x0, x1, x2, x3, x4);

    function Kind$Parser$file$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Parser$is_eof$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3963 = self.idx;
                var $3964 = self.code;
                var $3965 = self.err;
                var $3966 = Parser$Reply$error$($3963, $3964, $3965);
                var $3962 = $3966;
                break;
            case 'Parser.Reply.value':
                var $3967 = self.idx;
                var $3968 = self.code;
                var $3969 = self.val;
                var self = $3969;
                if (self) {
                    var $3971 = (_idx$9 => _code$10 => {
                        var $3972 = Parser$Reply$value$(_idx$9, _code$10, _defs$3);
                        return $3972;
                    });
                    var $3970 = $3971;
                } else {
                    var $3973 = (_idx$9 => _code$10 => {
                        var self = Parser$first_of$(List$cons$(Kind$Parser$file$def(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$adt(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$end(_file$1)(_code$2)(_defs$3), List$nil))))(_idx$9)(_code$10);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3975 = self.idx;
                                var $3976 = self.code;
                                var $3977 = self.err;
                                var $3978 = Parser$Reply$error$($3975, $3976, $3977);
                                var $3974 = $3978;
                                break;
                            case 'Parser.Reply.value':
                                var $3979 = self.idx;
                                var $3980 = self.code;
                                var $3981 = self.val;
                                var $3982 = Kind$Parser$file$(_file$1, _code$2, $3981, $3979, $3980);
                                var $3974 = $3982;
                                break;
                        };
                        return $3974;
                    });
                    var $3970 = $3973;
                };
                var $3970 = $3970($3967)($3968);
                var $3962 = $3970;
                break;
        };
        return $3962;
    };
    const Kind$Parser$file = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$(x0, x1, x2, x3, x4);

    function Either$(_A$1, _B$2) {
        var $3983 = null;
        return $3983;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $3985 = self.head;
                var $3986 = self.tail;
                var $3987 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $3988 = "";
                        return $3988;
                    } else {
                        var $3989 = _sep$1;
                        return $3989;
                    };
                })(), List$cons$($3985, List$cons$(String$join$go$(_sep$1, $3986, Bool$false), List$nil))));
                var $3984 = $3987;
                break;
            case 'List.nil':
                var $3990 = "";
                var $3984 = $3990;
                break;
        };
        return $3984;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $3991 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $3991;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$highlight$end$(_col$1, _row$2, _res$3) {
        var $3992 = String$join$("\u{a}", _res$3);
        return $3992;
    };
    const Kind$highlight$end = x0 => x1 => x2 => Kind$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $3994 = self.value;
                var $3995 = _f$5($3994);
                var $3993 = $3995;
                break;
            case 'Maybe.none':
                var $3996 = _a$4;
                var $3993 = $3996;
                break;
        };
        return $3993;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $3998 = Bool$true;
            var $3997 = $3998;
        } else {
            var $3999 = (self - 1n);
            var $4000 = Bool$false;
            var $3997 = $4000;
        };
        return $3997;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4002 = Nat$zero;
            var $4001 = $4002;
        } else {
            var $4003 = (self - 1n);
            var $4004 = Nat$succ$(Nat$succ$(Nat$double$($4003)));
            var $4001 = $4004;
        };
        return $4001;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4006 = Nat$zero;
            var $4005 = $4006;
        } else {
            var $4007 = (self - 1n);
            var $4008 = $4007;
            var $4005 = $4008;
        };
        return $4005;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $4010 = _str$3;
            var $4009 = $4010;
        } else {
            var $4011 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $4013 = String$cons$(_chr$2, String$pad_right$($4011, _chr$2, ""));
                var $4012 = $4013;
            } else {
                var $4014 = self.charCodeAt(0);
                var $4015 = self.slice(1);
                var $4016 = String$cons$($4014, String$pad_right$($4011, _chr$2, $4015));
                var $4012 = $4016;
            };
            var $4009 = $4012;
        };
        return $4009;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $4017 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $4017;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $4018 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $4018;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $4019 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $4019;
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
                    var $4020 = Either$left$(_n$1);
                    return $4020;
                } else {
                    var $4021 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4023 = Either$right$(Nat$succ$($4021));
                        var $4022 = $4023;
                    } else {
                        var $4024 = (self - 1n);
                        var $4025 = Nat$sub_rem$($4024, $4021);
                        var $4022 = $4025;
                    };
                    return $4022;
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
                        var $4026 = self.value;
                        var $4027 = Nat$div_mod$go$($4026, _m$2, Nat$succ$(_d$3));
                        return $4027;
                    case 'Either.right':
                        var $4028 = Pair$new$(_d$3, _n$1);
                        return $4028;
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
                        var $4029 = self.fst;
                        var $4030 = self.snd;
                        var self = $4029;
                        if (self === 0n) {
                            var $4032 = List$cons$($4030, _res$3);
                            var $4031 = $4032;
                        } else {
                            var $4033 = (self - 1n);
                            var $4034 = Nat$to_base$go$(_base$1, $4029, List$cons$($4030, _res$3));
                            var $4031 = $4034;
                        };
                        return $4031;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $4035 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $4035;
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
                    var $4036 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $4036;
                } else {
                    var $4037 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4039 = _r$3;
                        var $4038 = $4039;
                    } else {
                        var $4040 = (self - 1n);
                        var $4041 = Nat$mod$go$($4040, $4037, Nat$succ$(_r$3));
                        var $4038 = $4041;
                    };
                    return $4038;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $4042 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $4042;
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
                    var $4045 = self.value;
                    var $4046 = $4045;
                    var $4044 = $4046;
                    break;
                case 'Maybe.none':
                    var $4047 = 35;
                    var $4044 = $4047;
                    break;
            };
            var $4043 = $4044;
        } else {
            var $4048 = 35;
            var $4043 = $4048;
        };
        return $4043;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $4049 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $4050 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $4050;
        }));
        return $4049;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $4051 = Nat$to_string_base$(10n, _n$1);
        return $4051;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Kind$color$(_col$1, _str$2) {
        var $4052 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $4052;
    };
    const Kind$color = x0 => x1 => Kind$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $4054 = self.head;
                var $4055 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $4057 = List$nil;
                    var $4056 = $4057;
                } else {
                    var $4058 = (self - 1n);
                    var $4059 = List$cons$($4054, List$take$($4058, $4055));
                    var $4056 = $4059;
                };
                var $4053 = $4056;
                break;
            case 'List.nil':
                var $4060 = List$nil;
                var $4053 = $4060;
                break;
        };
        return $4053;
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
                    var $4062 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    var $4061 = $4062;
                } else {
                    var $4063 = self.charCodeAt(0);
                    var $4064 = self.slice(1);
                    var self = ($4063 === 10);
                    if (self) {
                        var _stp$12 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$12;
                        if (self) {
                            var $4067 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $4066 = $4067;
                        } else {
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$9));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4070 = self.value;
                                        var $4071 = Maybe$some$(Nat$pred$($4070));
                                        var $4069 = $4071;
                                        break;
                                    case 'Maybe.none':
                                        var $4072 = Maybe$some$(_spa$9);
                                        var $4069 = $4072;
                                        break;
                                };
                                var _lft$14 = $4069;
                            } else {
                                var $4073 = (self - 1n);
                                var $4074 = _lft$6;
                                var _lft$14 = $4074;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$cons$(String$reverse$(_lin$7), _res$8);
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $4068 = Kind$highlight$tc$($4064, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $4066 = $4068;
                        };
                        var $4065 = $4066;
                    } else {
                        var _chr$12 = String$cons$($4063, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $4076 = String$reverse$(Kind$color$("31", Kind$color$("4", _chr$12)));
                            var _chr$13 = $4076;
                        } else {
                            var $4077 = _chr$12;
                            var _chr$13 = $4077;
                        };
                        var self = (_ix0$2 === 1n);
                        if (self) {
                            var $4078 = List$take$(_spa$9, _res$8);
                            var _res$14 = $4078;
                        } else {
                            var $4079 = _res$8;
                            var _res$14 = $4079;
                        };
                        var _ix0$15 = Nat$pred$(_ix0$2);
                        var _ix1$16 = Nat$pred$(_ix1$3);
                        var _col$17 = Nat$succ$(_col$4);
                        var _lin$18 = String$flatten$(List$cons$(_chr$13, List$cons$(_lin$7, List$nil)));
                        var $4075 = Kind$highlight$tc$($4064, _ix0$15, _ix1$16, _col$17, _row$5, _lft$6, _lin$18, _res$14);
                        var $4065 = $4075;
                    };
                    var $4061 = $4065;
                };
                return $4061;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $4080 = Kind$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $4080;
    };
    const Kind$highlight = x0 => x1 => x2 => Kind$highlight$(x0, x1, x2);

    function Kind$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Kind$Parser$file$(_file$1, _code$2, _defs$3, 0n, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4082 = self.idx;
                var $4083 = self.err;
                var _err$7 = $4083;
                var _hig$8 = Kind$highlight$(_code$2, $4082, Nat$succ$($4082));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $4084 = Either$left$(_str$9);
                var $4081 = $4084;
                break;
            case 'Parser.Reply.value':
                var $4085 = self.val;
                var $4086 = Either$right$($4085);
                var $4081 = $4086;
                break;
        };
        return $4081;
    };
    const Kind$Defs$read = x0 => x1 => x2 => Kind$Defs$read$(x0, x1, x2);

    function Kind$Synth$load$go$(_name$1, _files$2, _defs$3) {
        var self = _files$2;
        switch (self._) {
            case 'List.cons':
                var $4088 = self.head;
                var $4089 = self.tail;
                var $4090 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $4091 = _m$bind$6;
                    return $4091;
                }))(IO$get_file$($4088))((_code$6 => {
                    var _read$7 = Kind$Defs$read$($4088, _code$6, _defs$3);
                    var self = _read$7;
                    switch (self._) {
                        case 'Either.right':
                            var $4093 = self.value;
                            var _defs$9 = $4093;
                            var self = Kind$get$(_name$1, _defs$9);
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4095 = Kind$Synth$load$go$(_name$1, $4089, _defs$9);
                                    var $4094 = $4095;
                                    break;
                                case 'Maybe.some':
                                    var $4096 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                        var $4097 = _m$pure$12;
                                        return $4097;
                                    }))(Maybe$some$(_defs$9));
                                    var $4094 = $4096;
                                    break;
                            };
                            var $4092 = $4094;
                            break;
                        case 'Either.left':
                            var $4098 = Kind$Synth$load$go$(_name$1, $4089, _defs$3);
                            var $4092 = $4098;
                            break;
                    };
                    return $4092;
                }));
                var $4087 = $4090;
                break;
            case 'List.nil':
                var $4099 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4100 = _m$pure$5;
                    return $4100;
                }))(Maybe$none);
                var $4087 = $4099;
                break;
        };
        return $4087;
    };
    const Kind$Synth$load$go = x0 => x1 => x2 => Kind$Synth$load$go$(x0, x1, x2);

    function Kind$Synth$files_of$make$(_names$1, _last$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $4102 = self.head;
                var $4103 = self.tail;
                var _head$5 = (_last$2 + ($4102 + ".kind"));
                var _tail$6 = Kind$Synth$files_of$make$($4103, (_last$2 + ($4102 + "/")));
                var $4104 = List$cons$(_head$5, _tail$6);
                var $4101 = $4104;
                break;
            case 'List.nil':
                var $4105 = List$nil;
                var $4101 = $4105;
                break;
        };
        return $4101;
    };
    const Kind$Synth$files_of$make = x0 => x1 => Kind$Synth$files_of$make$(x0, x1);

    function Char$eql$(_a$1, _b$2) {
        var $4106 = (_a$1 === _b$2);
        return $4106;
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
                    var $4107 = Bool$true;
                    return $4107;
                } else {
                    var $4108 = self.charCodeAt(0);
                    var $4109 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $4111 = Bool$false;
                        var $4110 = $4111;
                    } else {
                        var $4112 = self.charCodeAt(0);
                        var $4113 = self.slice(1);
                        var self = Char$eql$($4108, $4112);
                        if (self) {
                            var $4115 = String$starts_with$($4113, $4109);
                            var $4114 = $4115;
                        } else {
                            var $4116 = Bool$false;
                            var $4114 = $4116;
                        };
                        var $4110 = $4114;
                    };
                    return $4110;
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
                    var $4117 = _xs$2;
                    return $4117;
                } else {
                    var $4118 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $4120 = String$nil;
                        var $4119 = $4120;
                    } else {
                        var $4121 = self.charCodeAt(0);
                        var $4122 = self.slice(1);
                        var $4123 = String$drop$($4118, $4122);
                        var $4119 = $4123;
                    };
                    return $4119;
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
                    var $4124 = _n$2;
                    return $4124;
                } else {
                    var $4125 = self.charCodeAt(0);
                    var $4126 = self.slice(1);
                    var $4127 = String$length$go$($4126, Nat$succ$(_n$2));
                    return $4127;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $4128 = String$length$go$(_xs$1, 0n);
        return $4128;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $4130 = List$cons$(_last$3, List$nil);
            var $4129 = $4130;
        } else {
            var $4131 = self.charCodeAt(0);
            var $4132 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $4134 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $4133 = $4134;
            } else {
                var _next$6 = String$cons$($4131, String$nil);
                var $4135 = String$split$go$($4132, _match$2, (_last$3 + _next$6));
                var $4133 = $4135;
            };
            var $4129 = $4133;
        };
        return $4129;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $4136 = String$split$go$(_xs$1, _match$2, "");
        return $4136;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Kind$Synth$files_of$(_name$1) {
        var $4137 = List$reverse$(Kind$Synth$files_of$make$(String$split$(_name$1, "."), ""));
        return $4137;
    };
    const Kind$Synth$files_of = x0 => Kind$Synth$files_of$(x0);

    function Kind$Synth$load$(_name$1, _defs$2) {
        var $4138 = Kind$Synth$load$go$(_name$1, Kind$Synth$files_of$(_name$1), _defs$2);
        return $4138;
    };
    const Kind$Synth$load = x0 => x1 => Kind$Synth$load$(x0, x1);
    const Kind$Status$wait = ({
        _: 'Kind.Status.wait'
    });

    function Kind$Check$(_V$1) {
        var $4139 = null;
        return $4139;
    };
    const Kind$Check = x0 => Kind$Check$(x0);

    function Kind$Check$result$(_value$2, _errors$3) {
        var $4140 = ({
            _: 'Kind.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $4140;
    };
    const Kind$Check$result = x0 => x1 => Kind$Check$result$(x0, x1);

    function Kind$Error$undefined_reference$(_origin$1, _name$2) {
        var $4141 = ({
            _: 'Kind.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $4141;
    };
    const Kind$Error$undefined_reference = x0 => x1 => Kind$Error$undefined_reference$(x0, x1);

    function Kind$Error$waiting$(_name$1) {
        var $4142 = ({
            _: 'Kind.Error.waiting',
            'name': _name$1
        });
        return $4142;
    };
    const Kind$Error$waiting = x0 => Kind$Error$waiting$(x0);

    function Kind$Error$indirect$(_name$1) {
        var $4143 = ({
            _: 'Kind.Error.indirect',
            'name': _name$1
        });
        return $4143;
    };
    const Kind$Error$indirect = x0 => Kind$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4145 = self.value;
                var $4146 = Maybe$some$(_f$4($4145));
                var $4144 = $4146;
                break;
            case 'Maybe.none':
                var $4147 = Maybe$none;
                var $4144 = $4147;
                break;
        };
        return $4144;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Kind$MPath$o$(_path$1) {
        var $4148 = Maybe$mapped$(_path$1, Kind$Path$o);
        return $4148;
    };
    const Kind$MPath$o = x0 => Kind$MPath$o$(x0);

    function Kind$MPath$i$(_path$1) {
        var $4149 = Maybe$mapped$(_path$1, Kind$Path$i);
        return $4149;
    };
    const Kind$MPath$i = x0 => Kind$MPath$i$(x0);

    function Kind$Error$patch$(_path$1, _term$2) {
        var $4150 = ({
            _: 'Kind.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $4150;
    };
    const Kind$Error$patch = x0 => x1 => Kind$Error$patch$(x0, x1);

    function Kind$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.some':
                var $4152 = self.value;
                var $4153 = $4152(Bits$e);
                var $4151 = $4153;
                break;
            case 'Maybe.none':
                var $4154 = Bits$e;
                var $4151 = $4154;
                break;
        };
        return $4151;
    };
    const Kind$MPath$to_bits = x0 => Kind$MPath$to_bits$(x0);

    function Kind$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $4155 = ({
            _: 'Kind.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $4155;
    };
    const Kind$Error$type_mismatch = x0 => x1 => x2 => x3 => Kind$Error$type_mismatch$(x0, x1, x2, x3);

    function Kind$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $4156 = ({
            _: 'Kind.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $4156;
    };
    const Kind$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Kind$Error$show_goal$(x0, x1, x2, x3, x4);

    function Kind$Term$normalize$(_term$1, _defs$2) {
        var self = Kind$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $4158 = self.name;
                var $4159 = self.indx;
                var $4160 = Kind$Term$var$($4158, $4159);
                var $4157 = $4160;
                break;
            case 'Kind.Term.ref':
                var $4161 = self.name;
                var $4162 = Kind$Term$ref$($4161);
                var $4157 = $4162;
                break;
            case 'Kind.Term.all':
                var $4163 = self.eras;
                var $4164 = self.self;
                var $4165 = self.name;
                var $4166 = self.xtyp;
                var $4167 = self.body;
                var $4168 = Kind$Term$all$($4163, $4164, $4165, Kind$Term$normalize$($4166, _defs$2), (_s$8 => _x$9 => {
                    var $4169 = Kind$Term$normalize$($4167(_s$8)(_x$9), _defs$2);
                    return $4169;
                }));
                var $4157 = $4168;
                break;
            case 'Kind.Term.lam':
                var $4170 = self.name;
                var $4171 = self.body;
                var $4172 = Kind$Term$lam$($4170, (_x$5 => {
                    var $4173 = Kind$Term$normalize$($4171(_x$5), _defs$2);
                    return $4173;
                }));
                var $4157 = $4172;
                break;
            case 'Kind.Term.app':
                var $4174 = self.func;
                var $4175 = self.argm;
                var $4176 = Kind$Term$app$(Kind$Term$normalize$($4174, _defs$2), Kind$Term$normalize$($4175, _defs$2));
                var $4157 = $4176;
                break;
            case 'Kind.Term.let':
                var $4177 = self.name;
                var $4178 = self.expr;
                var $4179 = self.body;
                var $4180 = Kind$Term$let$($4177, Kind$Term$normalize$($4178, _defs$2), (_x$6 => {
                    var $4181 = Kind$Term$normalize$($4179(_x$6), _defs$2);
                    return $4181;
                }));
                var $4157 = $4180;
                break;
            case 'Kind.Term.def':
                var $4182 = self.name;
                var $4183 = self.expr;
                var $4184 = self.body;
                var $4185 = Kind$Term$def$($4182, Kind$Term$normalize$($4183, _defs$2), (_x$6 => {
                    var $4186 = Kind$Term$normalize$($4184(_x$6), _defs$2);
                    return $4186;
                }));
                var $4157 = $4185;
                break;
            case 'Kind.Term.ann':
                var $4187 = self.done;
                var $4188 = self.term;
                var $4189 = self.type;
                var $4190 = Kind$Term$ann$($4187, Kind$Term$normalize$($4188, _defs$2), Kind$Term$normalize$($4189, _defs$2));
                var $4157 = $4190;
                break;
            case 'Kind.Term.gol':
                var $4191 = self.name;
                var $4192 = self.dref;
                var $4193 = self.verb;
                var $4194 = Kind$Term$gol$($4191, $4192, $4193);
                var $4157 = $4194;
                break;
            case 'Kind.Term.hol':
                var $4195 = self.path;
                var $4196 = Kind$Term$hol$($4195);
                var $4157 = $4196;
                break;
            case 'Kind.Term.nat':
                var $4197 = self.natx;
                var $4198 = Kind$Term$nat$($4197);
                var $4157 = $4198;
                break;
            case 'Kind.Term.chr':
                var $4199 = self.chrx;
                var $4200 = Kind$Term$chr$($4199);
                var $4157 = $4200;
                break;
            case 'Kind.Term.str':
                var $4201 = self.strx;
                var $4202 = Kind$Term$str$($4201);
                var $4157 = $4202;
                break;
            case 'Kind.Term.ori':
                var $4203 = self.expr;
                var $4204 = Kind$Term$normalize$($4203, _defs$2);
                var $4157 = $4204;
                break;
            case 'Kind.Term.typ':
                var $4205 = Kind$Term$typ;
                var $4157 = $4205;
                break;
            case 'Kind.Term.cse':
                var $4206 = _term$1;
                var $4157 = $4206;
                break;
        };
        return $4157;
    };
    const Kind$Term$normalize = x0 => x1 => Kind$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $4208 = self.tail;
                var $4209 = $4208;
                var $4207 = $4209;
                break;
            case 'List.nil':
                var $4210 = List$nil;
                var $4207 = $4210;
                break;
        };
        return $4207;
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
                        var $4211 = self.func;
                        var $4212 = self.argm;
                        var $4213 = Kind$SmartMotive$vals$cont$(_expr$1, $4211, List$cons$($4212, _args$3), _defs$4);
                        return $4213;
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
                        var $4214 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $4214;
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
                        var $4215 = self.body;
                        var $4216 = Kind$SmartMotive$vals$(_expr$1, $4215(Kind$Term$typ)(Kind$Term$typ), _defs$3);
                        return $4216;
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
                        var $4217 = Kind$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $4217;
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
                        var $4218 = self.self;
                        var $4219 = self.name;
                        var $4220 = self.body;
                        var $4221 = Kind$SmartMotive$nams$cont$(_name$1, $4220(Kind$Term$ref$($4218))(Kind$Term$ref$($4219)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4219, List$nil)))), _binds$3), _defs$4);
                        return $4221;
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
                        var $4222 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $4222;
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
                var $4224 = self.xtyp;
                var $4225 = Kind$SmartMotive$nams$cont$(_name$1, $4224, List$nil, _defs$3);
                var $4223 = $4225;
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
                var $4226 = List$nil;
                var $4223 = $4226;
                break;
        };
        return $4223;
    };
    const Kind$SmartMotive$nams = x0 => x1 => x2 => Kind$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $4228 = self.head;
                var $4229 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $4231 = self.head;
                        var $4232 = self.tail;
                        var $4233 = List$cons$(Pair$new$($4228, $4231), List$zip$($4229, $4232));
                        var $4230 = $4233;
                        break;
                    case 'List.nil':
                        var $4234 = List$nil;
                        var $4230 = $4234;
                        break;
                };
                var $4227 = $4230;
                break;
            case 'List.nil':
                var $4235 = List$nil;
                var $4227 = $4235;
                break;
        };
        return $4227;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Kind$Term$serialize$name$(_name$1) {
        var $4236 = (kind_name_to_bits(_name$1));
        return $4236;
    };
    const Kind$Term$serialize$name = x0 => Kind$Term$serialize$name$(x0);

    function Kind$Term$serialize$(_term$1, _depth$2, _init$3, _diff$4, _x$5) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4238 = self.indx;
                var self = ($4238 >= _init$3);
                if (self) {
                    var _name$8 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $4238 <= 0n ? 0n : _depth$2 - $4238)))));
                    var $4240 = (((_name$8(_x$5) + '1') + '0') + '0');
                    var $4239 = $4240;
                } else {
                    var _name$8 = a1 => (a1 + (nat_to_bits($4238)));
                    var $4241 = (((_name$8(_x$5) + '0') + '1') + '0');
                    var $4239 = $4241;
                };
                var $4237 = $4239;
                break;
            case 'Kind.Term.ref':
                var $4242 = self.name;
                var _name$7 = a1 => (a1 + Kind$Term$serialize$name$($4242));
                var $4243 = (((_name$7(_x$5) + '0') + '0') + '0');
                var $4237 = $4243;
                break;
            case 'Kind.Term.all':
                var $4244 = self.eras;
                var $4245 = self.self;
                var $4246 = self.name;
                var $4247 = self.xtyp;
                var $4248 = self.body;
                var self = $4244;
                if (self) {
                    var $4250 = Bits$i;
                    var _eras$11 = $4250;
                } else {
                    var $4251 = Bits$o;
                    var _eras$11 = $4251;
                };
                var _self$12 = a1 => (a1 + (kind_name_to_bits($4245)));
                var _xtyp$13 = Kind$Term$serialize($4247)(_depth$2)(_init$3)(_diff$4);
                var _body$14 = Kind$Term$serialize($4248(Kind$Term$var$($4245, _depth$2))(Kind$Term$var$($4246, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3)(_diff$4);
                var $4249 = (((_eras$11(_self$12(_xtyp$13(_body$14(_x$5)))) + '0') + '0') + '1');
                var $4237 = $4249;
                break;
            case 'Kind.Term.lam':
                var $4252 = self.name;
                var $4253 = self.body;
                var _body$8 = Kind$Term$serialize($4253(Kind$Term$var$($4252, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4254 = (((_body$8(_x$5) + '1') + '0') + '1');
                var $4237 = $4254;
                break;
            case 'Kind.Term.app':
                var $4255 = self.func;
                var $4256 = self.argm;
                var _func$8 = Kind$Term$serialize($4255)(_depth$2)(_init$3)(_diff$4);
                var _argm$9 = Kind$Term$serialize($4256)(_depth$2)(_init$3)(_diff$4);
                var $4257 = (((_func$8(_argm$9(_x$5)) + '0') + '1') + '1');
                var $4237 = $4257;
                break;
            case 'Kind.Term.let':
                var $4258 = self.name;
                var $4259 = self.expr;
                var $4260 = self.body;
                var _expr$9 = Kind$Term$serialize($4259)(_depth$2)(_init$3)(_diff$4);
                var _body$10 = Kind$Term$serialize($4260(Kind$Term$var$($4258, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4261 = (((_expr$9(_body$10(_x$5)) + '1') + '1') + '1');
                var $4237 = $4261;
                break;
            case 'Kind.Term.def':
                var $4262 = self.expr;
                var $4263 = self.body;
                var $4264 = Kind$Term$serialize$($4263($4262), _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4264;
                break;
            case 'Kind.Term.ann':
                var $4265 = self.term;
                var $4266 = Kind$Term$serialize$($4265, _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4266;
                break;
            case 'Kind.Term.gol':
                var $4267 = self.name;
                var _name$9 = a1 => (a1 + (kind_name_to_bits($4267)));
                var $4268 = (((_name$9(_x$5) + '0') + '0') + '0');
                var $4237 = $4268;
                break;
            case 'Kind.Term.nat':
                var $4269 = self.natx;
                var $4270 = Kind$Term$serialize$(Kind$Term$unroll_nat$($4269), _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4270;
                break;
            case 'Kind.Term.chr':
                var $4271 = self.chrx;
                var $4272 = Kind$Term$serialize$(Kind$Term$unroll_chr$($4271), _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4272;
                break;
            case 'Kind.Term.str':
                var $4273 = self.strx;
                var $4274 = Kind$Term$serialize$(Kind$Term$unroll_str$($4273), _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4274;
                break;
            case 'Kind.Term.ori':
                var $4275 = self.expr;
                var $4276 = Kind$Term$serialize$($4275, _depth$2, _init$3, _diff$4, _x$5);
                var $4237 = $4276;
                break;
            case 'Kind.Term.typ':
                var $4277 = (((_x$5 + '1') + '1') + '0');
                var $4237 = $4277;
                break;
            case 'Kind.Term.hol':
                var $4278 = _x$5;
                var $4237 = $4278;
                break;
            case 'Kind.Term.cse':
                var $4279 = _diff$4(_x$5);
                var $4237 = $4279;
                break;
        };
        return $4237;
    };
    const Kind$Term$serialize = x0 => x1 => x2 => x3 => x4 => Kind$Term$serialize$(x0, x1, x2, x3, x4);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kind$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Kind$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$o, Bits$e);
        var _bh$5 = Kind$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$i, Bits$e);
        var $4280 = (_bh$5 === _ah$4);
        return $4280;
    };
    const Kind$Term$identical = x0 => x1 => x2 => Kind$Term$identical$(x0, x1, x2);

    function Kind$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Kind$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $4282 = _to$3;
            var $4281 = $4282;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Kind.Term.var':
                    var $4284 = self.name;
                    var $4285 = self.indx;
                    var $4286 = Kind$Term$var$($4284, $4285);
                    var $4283 = $4286;
                    break;
                case 'Kind.Term.ref':
                    var $4287 = self.name;
                    var $4288 = Kind$Term$ref$($4287);
                    var $4283 = $4288;
                    break;
                case 'Kind.Term.all':
                    var $4289 = self.eras;
                    var $4290 = self.self;
                    var $4291 = self.name;
                    var $4292 = self.xtyp;
                    var $4293 = self.body;
                    var _xtyp$10 = Kind$SmartMotive$replace$($4292, _from$2, _to$3, _lv$4);
                    var _body$11 = $4293(Kind$Term$ref$($4290))(Kind$Term$ref$($4291));
                    var _body$12 = Kind$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $4294 = Kind$Term$all$($4289, $4290, $4291, _xtyp$10, (_s$13 => _x$14 => {
                        var $4295 = _body$12;
                        return $4295;
                    }));
                    var $4283 = $4294;
                    break;
                case 'Kind.Term.lam':
                    var $4296 = self.name;
                    var $4297 = self.body;
                    var _body$7 = $4297(Kind$Term$ref$($4296));
                    var _body$8 = Kind$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4298 = Kind$Term$lam$($4296, (_x$9 => {
                        var $4299 = _body$8;
                        return $4299;
                    }));
                    var $4283 = $4298;
                    break;
                case 'Kind.Term.app':
                    var $4300 = self.func;
                    var $4301 = self.argm;
                    var _func$7 = Kind$SmartMotive$replace$($4300, _from$2, _to$3, _lv$4);
                    var _argm$8 = Kind$SmartMotive$replace$($4301, _from$2, _to$3, _lv$4);
                    var $4302 = Kind$Term$app$(_func$7, _argm$8);
                    var $4283 = $4302;
                    break;
                case 'Kind.Term.let':
                    var $4303 = self.name;
                    var $4304 = self.expr;
                    var $4305 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4304, _from$2, _to$3, _lv$4);
                    var _body$9 = $4305(Kind$Term$ref$($4303));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4306 = Kind$Term$let$($4303, _expr$8, (_x$11 => {
                        var $4307 = _body$10;
                        return $4307;
                    }));
                    var $4283 = $4306;
                    break;
                case 'Kind.Term.def':
                    var $4308 = self.name;
                    var $4309 = self.expr;
                    var $4310 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4309, _from$2, _to$3, _lv$4);
                    var _body$9 = $4310(Kind$Term$ref$($4308));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4311 = Kind$Term$def$($4308, _expr$8, (_x$11 => {
                        var $4312 = _body$10;
                        return $4312;
                    }));
                    var $4283 = $4311;
                    break;
                case 'Kind.Term.ann':
                    var $4313 = self.done;
                    var $4314 = self.term;
                    var $4315 = self.type;
                    var _term$8 = Kind$SmartMotive$replace$($4314, _from$2, _to$3, _lv$4);
                    var _type$9 = Kind$SmartMotive$replace$($4315, _from$2, _to$3, _lv$4);
                    var $4316 = Kind$Term$ann$($4313, _term$8, _type$9);
                    var $4283 = $4316;
                    break;
                case 'Kind.Term.ori':
                    var $4317 = self.expr;
                    var $4318 = Kind$SmartMotive$replace$($4317, _from$2, _to$3, _lv$4);
                    var $4283 = $4318;
                    break;
                case 'Kind.Term.typ':
                    var $4319 = Kind$Term$typ;
                    var $4283 = $4319;
                    break;
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                    var $4320 = _term$1;
                    var $4283 = $4320;
                    break;
            };
            var $4281 = $4283;
        };
        return $4281;
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
                    var $4323 = self.fst;
                    var $4324 = self.snd;
                    var $4325 = Kind$SmartMotive$replace$(_moti$11, $4324, Kind$Term$ref$($4323), _lv$5);
                    var $4322 = $4325;
                    break;
            };
            return $4322;
        }));
        var $4321 = _moti$10;
        return $4321;
    };
    const Kind$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Kind$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Kind$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.cons':
                var $4327 = self.head;
                var $4328 = self.tail;
                var self = $4327;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $4330 = self.name;
                        var $4331 = self.type;
                        var $4332 = Kind$Term$all$(Bool$false, "", $4330, $4331, (_s$14 => _x$15 => {
                            var $4333 = Kind$Term$desugar_cse$motive$($4328, _moti$2);
                            return $4333;
                        }));
                        var $4329 = $4332;
                        break;
                };
                var $4326 = $4329;
                break;
            case 'List.nil':
                var $4334 = _moti$2;
                var $4326 = $4334;
                break;
        };
        return $4326;
    };
    const Kind$Term$desugar_cse$motive = x0 => x1 => Kind$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4336 = Bool$true;
            var $4335 = $4336;
        } else {
            var $4337 = self.charCodeAt(0);
            var $4338 = self.slice(1);
            var $4339 = Bool$false;
            var $4335 = $4339;
        };
        return $4335;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Kind$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Kind.Term.all':
                var $4341 = self.self;
                var $4342 = self.name;
                var $4343 = self.body;
                var $4344 = Kind$Term$lam$((() => {
                    var self = String$is_empty$($4342);
                    if (self) {
                        var $4345 = _name$1;
                        return $4345;
                    } else {
                        var $4346 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4342, List$nil))));
                        return $4346;
                    };
                })(), (_x$11 => {
                    var $4347 = Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, $4343(Kind$Term$var$($4341, 0n))(Kind$Term$var$($4342, 0n)), _body$4, _defs$5);
                    return $4347;
                }));
                var $4340 = $4344;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.ori':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4349 = self.head;
                        var $4350 = self.tail;
                        var self = $4349;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4352 = self.name;
                                var $4353 = Kind$Term$lam$($4352, (_x$19 => {
                                    var $4354 = Kind$Term$desugar_cse$argument$(_name$1, $4350, _type$3, _body$4, _defs$5);
                                    return $4354;
                                }));
                                var $4351 = $4353;
                                break;
                        };
                        var $4348 = $4351;
                        break;
                    case 'List.nil':
                        var $4355 = _body$4;
                        var $4348 = $4355;
                        break;
                };
                var $4340 = $4348;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4357 = self.head;
                        var $4358 = self.tail;
                        var self = $4357;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4360 = self.name;
                                var $4361 = Kind$Term$lam$($4360, (_x$18 => {
                                    var $4362 = Kind$Term$desugar_cse$argument$(_name$1, $4358, _type$3, _body$4, _defs$5);
                                    return $4362;
                                }));
                                var $4359 = $4361;
                                break;
                        };
                        var $4356 = $4359;
                        break;
                    case 'List.nil':
                        var $4363 = _body$4;
                        var $4356 = $4363;
                        break;
                };
                var $4340 = $4356;
                break;
            case 'Kind.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4365 = self.head;
                        var $4366 = self.tail;
                        var self = $4365;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4368 = self.name;
                                var $4369 = Kind$Term$lam$($4368, (_x$17 => {
                                    var $4370 = Kind$Term$desugar_cse$argument$(_name$1, $4366, _type$3, _body$4, _defs$5);
                                    return $4370;
                                }));
                                var $4367 = $4369;
                                break;
                        };
                        var $4364 = $4367;
                        break;
                    case 'List.nil':
                        var $4371 = _body$4;
                        var $4364 = $4371;
                        break;
                };
                var $4340 = $4364;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4373 = self.head;
                        var $4374 = self.tail;
                        var self = $4373;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4376 = self.name;
                                var $4377 = Kind$Term$lam$($4376, (_x$20 => {
                                    var $4378 = Kind$Term$desugar_cse$argument$(_name$1, $4374, _type$3, _body$4, _defs$5);
                                    return $4378;
                                }));
                                var $4375 = $4377;
                                break;
                        };
                        var $4372 = $4375;
                        break;
                    case 'List.nil':
                        var $4379 = _body$4;
                        var $4372 = $4379;
                        break;
                };
                var $4340 = $4372;
                break;
            case 'Kind.Term.cse':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4381 = self.head;
                        var $4382 = self.tail;
                        var self = $4381;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4384 = self.name;
                                var $4385 = Kind$Term$lam$($4384, (_x$23 => {
                                    var $4386 = Kind$Term$desugar_cse$argument$(_name$1, $4382, _type$3, _body$4, _defs$5);
                                    return $4386;
                                }));
                                var $4383 = $4385;
                                break;
                        };
                        var $4380 = $4383;
                        break;
                    case 'List.nil':
                        var $4387 = _body$4;
                        var $4380 = $4387;
                        break;
                };
                var $4340 = $4380;
                break;
        };
        return $4340;
    };
    const Kind$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Kind$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $4389 = self.value;
                var $4390 = Maybe$some$($4389);
                var $4388 = $4390;
                break;
            case 'Maybe.none':
                var $4391 = _b$3;
                var $4388 = $4391;
                break;
        };
        return $4388;
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
                        var $4392 = self.self;
                        var $4393 = self.name;
                        var $4394 = self.xtyp;
                        var $4395 = self.body;
                        var _got$13 = Maybe$or$(Kind$get$($4393, _cses$4), Kind$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4397 = self.value;
                                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, _wyth$3, $4394, $4397, _defs$6);
                                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $4395(Kind$Term$var$($4392, 0n))(Kind$Term$var$($4393, 0n));
                                var $4398 = Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $4396 = $4398;
                                break;
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $4401 = _expr$1;
                                    var $4402 = _wyth$3;
                                    let _expr$15 = $4401;
                                    let _defn$14;
                                    while ($4402._ === 'List.cons') {
                                        _defn$14 = $4402.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Kind.Def.new':
                                                var $4403 = self.term;
                                                var $4404 = Kind$Term$app$(_expr$15, $4403);
                                                var $4401 = $4404;
                                                break;
                                        };
                                        _expr$15 = $4401;
                                        $4402 = $4402.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $4399 = _expr$14;
                                var $4396 = $4399;
                                break;
                        };
                        return $4396;
                    case 'Kind.Term.var':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.ori':
                        var _expr$10 = (() => {
                            var $4407 = _expr$1;
                            var $4408 = _wyth$3;
                            let _expr$11 = $4407;
                            let _defn$10;
                            while ($4408._ === 'List.cons') {
                                _defn$10 = $4408.head;
                                var $4407 = Kind$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4409 = self.term;
                                            var $4410 = $4409;
                                            return $4410;
                                    };
                                })());
                                _expr$11 = $4407;
                                $4408 = $4408.tail;
                            }
                            return _expr$11;
                        })();
                        var $4405 = _expr$10;
                        return $4405;
                    case 'Kind.Term.ref':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                        var _expr$9 = (() => {
                            var $4413 = _expr$1;
                            var $4414 = _wyth$3;
                            let _expr$10 = $4413;
                            let _defn$9;
                            while ($4414._ === 'List.cons') {
                                _defn$9 = $4414.head;
                                var $4413 = Kind$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4415 = self.term;
                                            var $4416 = $4415;
                                            return $4416;
                                    };
                                })());
                                _expr$10 = $4413;
                                $4414 = $4414.tail;
                            }
                            return _expr$10;
                        })();
                        var $4411 = _expr$9;
                        return $4411;
                    case 'Kind.Term.typ':
                        var _expr$8 = (() => {
                            var $4419 = _expr$1;
                            var $4420 = _wyth$3;
                            let _expr$9 = $4419;
                            let _defn$8;
                            while ($4420._ === 'List.cons') {
                                _defn$8 = $4420.head;
                                var $4419 = Kind$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4421 = self.term;
                                            var $4422 = $4421;
                                            return $4422;
                                    };
                                })());
                                _expr$9 = $4419;
                                $4420 = $4420.tail;
                            }
                            return _expr$9;
                        })();
                        var $4417 = _expr$8;
                        return $4417;
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                        var _expr$11 = (() => {
                            var $4425 = _expr$1;
                            var $4426 = _wyth$3;
                            let _expr$12 = $4425;
                            let _defn$11;
                            while ($4426._ === 'List.cons') {
                                _defn$11 = $4426.head;
                                var $4425 = Kind$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4427 = self.term;
                                            var $4428 = $4427;
                                            return $4428;
                                    };
                                })());
                                _expr$12 = $4425;
                                $4426 = $4426.tail;
                            }
                            return _expr$12;
                        })();
                        var $4423 = _expr$11;
                        return $4423;
                    case 'Kind.Term.cse':
                        var _expr$14 = (() => {
                            var $4431 = _expr$1;
                            var $4432 = _wyth$3;
                            let _expr$15 = $4431;
                            let _defn$14;
                            while ($4432._ === 'List.cons') {
                                _defn$14 = $4432.head;
                                var $4431 = Kind$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4433 = self.term;
                                            var $4434 = $4433;
                                            return $4434;
                                    };
                                })());
                                _expr$15 = $4431;
                                $4432 = $4432.tail;
                            }
                            return _expr$15;
                        })();
                        var $4429 = _expr$14;
                        return $4429;
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
                var $4436 = self.self;
                var $4437 = self.name;
                var $4438 = self.xtyp;
                var $4439 = self.body;
                var _moti$14 = Kind$Term$desugar_cse$motive$(_wyth$3, _moti$5);
                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, List$nil, $4438, _moti$14, _defs$7);
                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                var _type$17 = $4439(Kind$Term$var$($4436, 0n))(Kind$Term$var$($4437, 0n));
                var $4440 = Maybe$some$(Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $4435 = $4440;
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
                var $4441 = Maybe$none;
                var $4435 = $4441;
                break;
        };
        return $4435;
    };
    const Kind$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $4442 = ({
            _: 'Kind.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $4442;
    };
    const Kind$Error$cant_infer = x0 => x1 => x2 => Kind$Error$cant_infer$(x0, x1, x2);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $4444 = Bool$false;
                var $4443 = $4444;
                break;
            case 'Maybe.some':
                var $4445 = Bool$true;
                var $4443 = $4445;
                break;
        };
        return $4443;
    };
    const Set$has = x0 => x1 => Set$has$(x0, x1);
    const Set$mut$has = a0 => a1 => (!!(a1[a0]));

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
                        var $4446 = self.name;
                        var $4447 = Maybe$some$(Pair$new$($4446, _arity$2));
                        return $4447;
                    case 'Kind.Term.ref':
                        var $4448 = self.name;
                        var $4449 = Maybe$some$(Pair$new$($4448, _arity$2));
                        return $4449;
                    case 'Kind.Term.app':
                        var $4450 = self.func;
                        var $4451 = Kind$Term$equal$extra_holes$funari$($4450, Nat$succ$(_arity$2));
                        return $4451;
                    case 'Kind.Term.ori':
                        var $4452 = self.expr;
                        var $4453 = Kind$Term$equal$extra_holes$funari$($4452, _arity$2);
                        return $4453;
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
                        var $4454 = Maybe$none;
                        return $4454;
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
                var $4456 = self.xtyp;
                var $4457 = self.body;
                var $4458 = (Kind$Term$has_holes$($4456) || Kind$Term$has_holes$($4457(Kind$Term$typ)(Kind$Term$typ)));
                var $4455 = $4458;
                break;
            case 'Kind.Term.lam':
                var $4459 = self.body;
                var $4460 = Kind$Term$has_holes$($4459(Kind$Term$typ));
                var $4455 = $4460;
                break;
            case 'Kind.Term.app':
                var $4461 = self.func;
                var $4462 = self.argm;
                var $4463 = (Kind$Term$has_holes$($4461) || Kind$Term$has_holes$($4462));
                var $4455 = $4463;
                break;
            case 'Kind.Term.let':
                var $4464 = self.expr;
                var $4465 = self.body;
                var $4466 = (Kind$Term$has_holes$($4464) || Kind$Term$has_holes$($4465(Kind$Term$typ)));
                var $4455 = $4466;
                break;
            case 'Kind.Term.def':
                var $4467 = self.expr;
                var $4468 = self.body;
                var $4469 = (Kind$Term$has_holes$($4467) || Kind$Term$has_holes$($4468(Kind$Term$typ)));
                var $4455 = $4469;
                break;
            case 'Kind.Term.ann':
                var $4470 = self.term;
                var $4471 = self.type;
                var $4472 = (Kind$Term$has_holes$($4470) || Kind$Term$has_holes$($4471));
                var $4455 = $4472;
                break;
            case 'Kind.Term.ori':
                var $4473 = self.expr;
                var $4474 = Kind$Term$has_holes$($4473);
                var $4455 = $4474;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $4475 = Bool$false;
                var $4455 = $4475;
                break;
            case 'Kind.Term.hol':
                var $4476 = Bool$true;
                var $4455 = $4476;
                break;
        };
        return $4455;
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
                    var $4479 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                    var $4478 = $4479;
                } else {
                    var $4480 = Kind$Check$result$(Maybe$some$(Bool$true), List$cons$(Kind$Error$patch$(_path$1, Kind$Term$normalize$(_term$2, Map$new)), List$nil));
                    var $4478 = $4480;
                };
                var $4477 = $4478;
                break;
            case 'Kind.Term.hol':
                var $4481 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4477 = $4481;
                break;
        };
        return $4477;
    };
    const Kind$Term$equal$hole = x0 => x1 => Kind$Term$equal$hole$(x0, x1);

    function Kind$Term$equal$extra_holes$filler$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kind.Term.app':
                var $4483 = self.func;
                var $4484 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4486 = self.func;
                        var $4487 = self.argm;
                        var self = Kind$Term$equal$extra_holes$filler$($4483, $4486);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4489 = self.value;
                                var $4490 = self.errors;
                                var self = $4489;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4492 = Kind$Check$result$(Maybe$none, $4490);
                                        var $4491 = $4492;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Term$equal$extra_holes$filler$($4484, $4487);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4494 = self.value;
                                                var $4495 = self.errors;
                                                var $4496 = Kind$Check$result$($4494, List$concat$($4490, $4495));
                                                var $4493 = $4496;
                                                break;
                                        };
                                        var $4491 = $4493;
                                        break;
                                };
                                var $4488 = $4491;
                                break;
                        };
                        var $4485 = $4488;
                        break;
                    case 'Kind.Term.hol':
                        var $4497 = self.path;
                        var self = Kind$Term$equal$hole$($4497, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4499 = self.value;
                                var $4500 = self.errors;
                                var self = $4499;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4502 = Kind$Check$result$(Maybe$none, $4500);
                                        var $4501 = $4502;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4504 = self.value;
                                                var $4505 = self.errors;
                                                var $4506 = Kind$Check$result$($4504, List$concat$($4500, $4505));
                                                var $4503 = $4506;
                                                break;
                                        };
                                        var $4501 = $4503;
                                        break;
                                };
                                var $4498 = $4501;
                                break;
                        };
                        var $4485 = $4498;
                        break;
                    case 'Kind.Term.ori':
                        var $4507 = self.expr;
                        var $4508 = Kind$Term$equal$extra_holes$filler$(_a$1, $4507);
                        var $4485 = $4508;
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
                        var $4509 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4485 = $4509;
                        break;
                };
                var $4482 = $4485;
                break;
            case 'Kind.Term.hol':
                var $4510 = self.path;
                var self = Kind$Term$equal$hole$($4510, _b$2);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4512 = self.value;
                        var $4513 = self.errors;
                        var self = $4512;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4515 = Kind$Check$result$(Maybe$none, $4513);
                                var $4514 = $4515;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4517 = self.value;
                                        var $4518 = self.errors;
                                        var $4519 = Kind$Check$result$($4517, List$concat$($4513, $4518));
                                        var $4516 = $4519;
                                        break;
                                };
                                var $4514 = $4516;
                                break;
                        };
                        var $4511 = $4514;
                        break;
                };
                var $4482 = $4511;
                break;
            case 'Kind.Term.ori':
                var $4520 = self.expr;
                var $4521 = Kind$Term$equal$extra_holes$filler$($4520, _b$2);
                var $4482 = $4521;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4523 = self.path;
                        var self = Kind$Term$equal$hole$($4523, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4525 = self.value;
                                var $4526 = self.errors;
                                var self = $4525;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4528 = Kind$Check$result$(Maybe$none, $4526);
                                        var $4527 = $4528;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4530 = self.value;
                                                var $4531 = self.errors;
                                                var $4532 = Kind$Check$result$($4530, List$concat$($4526, $4531));
                                                var $4529 = $4532;
                                                break;
                                        };
                                        var $4527 = $4529;
                                        break;
                                };
                                var $4524 = $4527;
                                break;
                        };
                        var $4522 = $4524;
                        break;
                    case 'Kind.Term.ori':
                        var $4533 = self.expr;
                        var $4534 = Kind$Term$equal$extra_holes$filler$(_a$1, $4533);
                        var $4522 = $4534;
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
                        var $4535 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4522 = $4535;
                        break;
                };
                var $4482 = $4522;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4537 = self.path;
                        var self = Kind$Term$equal$hole$($4537, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4539 = self.value;
                                var $4540 = self.errors;
                                var self = $4539;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4542 = Kind$Check$result$(Maybe$none, $4540);
                                        var $4541 = $4542;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4544 = self.value;
                                                var $4545 = self.errors;
                                                var $4546 = Kind$Check$result$($4544, List$concat$($4540, $4545));
                                                var $4543 = $4546;
                                                break;
                                        };
                                        var $4541 = $4543;
                                        break;
                                };
                                var $4538 = $4541;
                                break;
                        };
                        var $4536 = $4538;
                        break;
                    case 'Kind.Term.ori':
                        var $4547 = self.expr;
                        var $4548 = Kind$Term$equal$extra_holes$filler$(_a$1, $4547);
                        var $4536 = $4548;
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
                        var $4549 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4536 = $4549;
                        break;
                };
                var $4482 = $4536;
                break;
            case 'Kind.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4551 = self.path;
                        var self = Kind$Term$equal$hole$($4551, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4553 = self.value;
                                var $4554 = self.errors;
                                var self = $4553;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4556 = Kind$Check$result$(Maybe$none, $4554);
                                        var $4555 = $4556;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4558 = self.value;
                                                var $4559 = self.errors;
                                                var $4560 = Kind$Check$result$($4558, List$concat$($4554, $4559));
                                                var $4557 = $4560;
                                                break;
                                        };
                                        var $4555 = $4557;
                                        break;
                                };
                                var $4552 = $4555;
                                break;
                        };
                        var $4550 = $4552;
                        break;
                    case 'Kind.Term.ori':
                        var $4561 = self.expr;
                        var $4562 = Kind$Term$equal$extra_holes$filler$(_a$1, $4561);
                        var $4550 = $4562;
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
                        var $4563 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4550 = $4563;
                        break;
                };
                var $4482 = $4550;
                break;
            case 'Kind.Term.all':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4565 = self.path;
                        var self = Kind$Term$equal$hole$($4565, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4567 = self.value;
                                var $4568 = self.errors;
                                var self = $4567;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4570 = Kind$Check$result$(Maybe$none, $4568);
                                        var $4569 = $4570;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4572 = self.value;
                                                var $4573 = self.errors;
                                                var $4574 = Kind$Check$result$($4572, List$concat$($4568, $4573));
                                                var $4571 = $4574;
                                                break;
                                        };
                                        var $4569 = $4571;
                                        break;
                                };
                                var $4566 = $4569;
                                break;
                        };
                        var $4564 = $4566;
                        break;
                    case 'Kind.Term.ori':
                        var $4575 = self.expr;
                        var $4576 = Kind$Term$equal$extra_holes$filler$(_a$1, $4575);
                        var $4564 = $4576;
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
                        var $4577 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4564 = $4577;
                        break;
                };
                var $4482 = $4564;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4579 = self.path;
                        var self = Kind$Term$equal$hole$($4579, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4581 = self.value;
                                var $4582 = self.errors;
                                var self = $4581;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4584 = Kind$Check$result$(Maybe$none, $4582);
                                        var $4583 = $4584;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4586 = self.value;
                                                var $4587 = self.errors;
                                                var $4588 = Kind$Check$result$($4586, List$concat$($4582, $4587));
                                                var $4585 = $4588;
                                                break;
                                        };
                                        var $4583 = $4585;
                                        break;
                                };
                                var $4580 = $4583;
                                break;
                        };
                        var $4578 = $4580;
                        break;
                    case 'Kind.Term.ori':
                        var $4589 = self.expr;
                        var $4590 = Kind$Term$equal$extra_holes$filler$(_a$1, $4589);
                        var $4578 = $4590;
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
                        var $4591 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4578 = $4591;
                        break;
                };
                var $4482 = $4578;
                break;
            case 'Kind.Term.cse':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4593 = self.path;
                        var self = Kind$Term$equal$hole$($4593, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4595 = self.value;
                                var $4596 = self.errors;
                                var self = $4595;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4598 = Kind$Check$result$(Maybe$none, $4596);
                                        var $4597 = $4598;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4600 = self.value;
                                                var $4601 = self.errors;
                                                var $4602 = Kind$Check$result$($4600, List$concat$($4596, $4601));
                                                var $4599 = $4602;
                                                break;
                                        };
                                        var $4597 = $4599;
                                        break;
                                };
                                var $4594 = $4597;
                                break;
                        };
                        var $4592 = $4594;
                        break;
                    case 'Kind.Term.ori':
                        var $4603 = self.expr;
                        var $4604 = Kind$Term$equal$extra_holes$filler$(_a$1, $4603);
                        var $4592 = $4604;
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
                        var $4605 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4592 = $4605;
                        break;
                };
                var $4482 = $4592;
                break;
        };
        return $4482;
    };
    const Kind$Term$equal$extra_holes$filler = x0 => x1 => Kind$Term$equal$extra_holes$filler$(x0, x1);

    function Kind$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = Kind$Term$equal$extra_holes$funari$(_a$1, 0n);
        switch (self._) {
            case 'Maybe.some':
                var $4607 = self.value;
                var self = Kind$Term$equal$extra_holes$funari$(_b$2, 0n);
                switch (self._) {
                    case 'Maybe.some':
                        var $4609 = self.value;
                        var self = $4607;
                        switch (self._) {
                            case 'Pair.new':
                                var $4611 = self.fst;
                                var $4612 = self.snd;
                                var self = $4609;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4614 = self.fst;
                                        var $4615 = self.snd;
                                        var _same_fun$9 = ($4611 === $4614);
                                        var _same_ari$10 = ($4612 === $4615);
                                        var self = (_same_fun$9 && _same_ari$10);
                                        if (self) {
                                            var $4617 = Kind$Term$equal$extra_holes$filler$(_a$1, _b$2);
                                            var $4616 = $4617;
                                        } else {
                                            var $4618 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                            var $4616 = $4618;
                                        };
                                        var $4613 = $4616;
                                        break;
                                };
                                var $4610 = $4613;
                                break;
                        };
                        var $4608 = $4610;
                        break;
                    case 'Maybe.none':
                        var $4619 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4608 = $4619;
                        break;
                };
                var $4606 = $4608;
                break;
            case 'Maybe.none':
                var $4620 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                var $4606 = $4620;
                break;
        };
        return $4606;
    };
    const Kind$Term$equal$extra_holes = x0 => x1 => Kind$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $4621 = Map$set$(_bits$1, Unit$new, _set$2);
        return $4621;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);
    const Set$mut$set = a0 => a1 => (((k, s) => ((s[k] = true), s))(a0, a1));

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $4623 = _b$2;
            var $4622 = $4623;
        } else {
            var $4624 = (!_b$2);
            var $4622 = $4624;
        };
        return $4622;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Kind$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Kind$Term$serialize$(Kind$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$o, Bits$e);
        var _bh$7 = Kind$Term$serialize$(Kind$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$i, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $4626 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
            var $4625 = $4626;
        } else {
            var _a1$8 = Kind$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Kind$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Kind$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$o, Bits$e);
            var _bh$11 = Kind$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$i, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $4628 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4627 = $4628;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = (!!(_seen$5[_id$12]));
                if (self) {
                    var self = Kind$Term$equal$extra_holes$(_a$1, _b$2);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4631 = self.value;
                            var $4632 = self.errors;
                            var self = $4631;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4634 = Kind$Check$result$(Maybe$none, $4632);
                                    var $4633 = $4634;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4636 = self.value;
                                            var $4637 = self.errors;
                                            var $4638 = Kind$Check$result$($4636, List$concat$($4632, $4637));
                                            var $4635 = $4638;
                                            break;
                                    };
                                    var $4633 = $4635;
                                    break;
                            };
                            var $4630 = $4633;
                            break;
                    };
                    var $4629 = $4630;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Kind.Term.all':
                            var $4640 = self.eras;
                            var $4641 = self.self;
                            var $4642 = self.name;
                            var $4643 = self.xtyp;
                            var $4644 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.all':
                                    var $4646 = self.eras;
                                    var $4647 = self.self;
                                    var $4648 = self.name;
                                    var $4649 = self.xtyp;
                                    var $4650 = self.body;
                                    var _seen$23 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$24 = $4644(Kind$Term$var$($4641, _lv$4))(Kind$Term$var$($4642, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $4650(Kind$Term$var$($4647, _lv$4))(Kind$Term$var$($4648, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($4641 === $4647);
                                    var _eq_eras$27 = Bool$eql$($4640, $4646);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var self = Kind$Term$equal$($4643, $4649, _defs$3, _lv$4, _seen$23);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4653 = self.value;
                                                var $4654 = self.errors;
                                                var self = $4653;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $4656 = self.value;
                                                        var self = Kind$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4658 = self.value;
                                                                var $4659 = self.errors;
                                                                var self = $4658;
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $4661 = self.value;
                                                                        var self = Kind$Check$result$(Maybe$some$(($4656 && $4661)), List$nil);
                                                                        switch (self._) {
                                                                            case 'Kind.Check.result':
                                                                                var $4663 = self.value;
                                                                                var $4664 = self.errors;
                                                                                var $4665 = Kind$Check$result$($4663, List$concat$($4659, $4664));
                                                                                var $4662 = $4665;
                                                                                break;
                                                                        };
                                                                        var $4660 = $4662;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $4666 = Kind$Check$result$(Maybe$none, $4659);
                                                                        var $4660 = $4666;
                                                                        break;
                                                                };
                                                                var self = $4660;
                                                                break;
                                                        };
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4667 = self.value;
                                                                var $4668 = self.errors;
                                                                var $4669 = Kind$Check$result$($4667, List$concat$($4654, $4668));
                                                                var $4657 = $4669;
                                                                break;
                                                        };
                                                        var $4655 = $4657;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $4670 = Kind$Check$result$(Maybe$none, $4654);
                                                        var $4655 = $4670;
                                                        break;
                                                };
                                                var $4652 = $4655;
                                                break;
                                        };
                                        var $4651 = $4652;
                                    } else {
                                        var $4671 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                        var $4651 = $4671;
                                    };
                                    var $4645 = $4651;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4672 = self.path;
                                    var $4673 = Kind$Term$equal$hole$($4672, _a$1);
                                    var $4645 = $4673;
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
                                    var $4674 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4645 = $4674;
                                    break;
                            };
                            var $4639 = $4645;
                            break;
                        case 'Kind.Term.lam':
                            var $4675 = self.name;
                            var $4676 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.lam':
                                    var $4678 = self.name;
                                    var $4679 = self.body;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$18 = $4676(Kind$Term$var$($4675, _lv$4));
                                    var _b1_body$19 = $4679(Kind$Term$var$($4678, _lv$4));
                                    var self = Kind$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4681 = self.value;
                                            var $4682 = self.errors;
                                            var self = $4681;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4684 = self.value;
                                                    var self = Kind$Check$result$(Maybe$some$($4684), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4686 = self.value;
                                                            var $4687 = self.errors;
                                                            var $4688 = Kind$Check$result$($4686, List$concat$($4682, $4687));
                                                            var $4685 = $4688;
                                                            break;
                                                    };
                                                    var $4683 = $4685;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4689 = Kind$Check$result$(Maybe$none, $4682);
                                                    var $4683 = $4689;
                                                    break;
                                            };
                                            var $4680 = $4683;
                                            break;
                                    };
                                    var $4677 = $4680;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4690 = self.path;
                                    var $4691 = Kind$Term$equal$hole$($4690, _a$1);
                                    var $4677 = $4691;
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
                                    var $4692 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4677 = $4692;
                                    break;
                            };
                            var $4639 = $4677;
                            break;
                        case 'Kind.Term.app':
                            var $4693 = self.func;
                            var $4694 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.app':
                                    var $4696 = self.func;
                                    var $4697 = self.argm;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var self = Kind$Term$equal$($4693, $4696, _defs$3, _lv$4, _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4699 = self.value;
                                            var $4700 = self.errors;
                                            var self = $4699;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4702 = self.value;
                                                    var self = Kind$Term$equal$($4694, $4697, _defs$3, _lv$4, _seen$17);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4704 = self.value;
                                                            var $4705 = self.errors;
                                                            var self = $4704;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4707 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4702 && $4707)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4709 = self.value;
                                                                            var $4710 = self.errors;
                                                                            var $4711 = Kind$Check$result$($4709, List$concat$($4705, $4710));
                                                                            var $4708 = $4711;
                                                                            break;
                                                                    };
                                                                    var $4706 = $4708;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4712 = Kind$Check$result$(Maybe$none, $4705);
                                                                    var $4706 = $4712;
                                                                    break;
                                                            };
                                                            var self = $4706;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4713 = self.value;
                                                            var $4714 = self.errors;
                                                            var $4715 = Kind$Check$result$($4713, List$concat$($4700, $4714));
                                                            var $4703 = $4715;
                                                            break;
                                                    };
                                                    var $4701 = $4703;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4716 = Kind$Check$result$(Maybe$none, $4700);
                                                    var $4701 = $4716;
                                                    break;
                                            };
                                            var $4698 = $4701;
                                            break;
                                    };
                                    var $4695 = $4698;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4717 = self.path;
                                    var $4718 = Kind$Term$equal$hole$($4717, _a$1);
                                    var $4695 = $4718;
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
                                    var $4719 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4695 = $4719;
                                    break;
                            };
                            var $4639 = $4695;
                            break;
                        case 'Kind.Term.let':
                            var $4720 = self.name;
                            var $4721 = self.expr;
                            var $4722 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.let':
                                    var $4724 = self.name;
                                    var $4725 = self.expr;
                                    var $4726 = self.body;
                                    var _seen$19 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$20 = $4722(Kind$Term$var$($4720, _lv$4));
                                    var _b1_body$21 = $4726(Kind$Term$var$($4724, _lv$4));
                                    var self = Kind$Term$equal$($4721, $4725, _defs$3, _lv$4, _seen$19);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4728 = self.value;
                                            var $4729 = self.errors;
                                            var self = $4728;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4731 = self.value;
                                                    var self = Kind$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4733 = self.value;
                                                            var $4734 = self.errors;
                                                            var self = $4733;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4736 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4731 && $4736)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4738 = self.value;
                                                                            var $4739 = self.errors;
                                                                            var $4740 = Kind$Check$result$($4738, List$concat$($4734, $4739));
                                                                            var $4737 = $4740;
                                                                            break;
                                                                    };
                                                                    var $4735 = $4737;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4741 = Kind$Check$result$(Maybe$none, $4734);
                                                                    var $4735 = $4741;
                                                                    break;
                                                            };
                                                            var self = $4735;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4742 = self.value;
                                                            var $4743 = self.errors;
                                                            var $4744 = Kind$Check$result$($4742, List$concat$($4729, $4743));
                                                            var $4732 = $4744;
                                                            break;
                                                    };
                                                    var $4730 = $4732;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4745 = Kind$Check$result$(Maybe$none, $4729);
                                                    var $4730 = $4745;
                                                    break;
                                            };
                                            var $4727 = $4730;
                                            break;
                                    };
                                    var $4723 = $4727;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4746 = self.path;
                                    var $4747 = Kind$Term$equal$hole$($4746, _a$1);
                                    var $4723 = $4747;
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
                                    var $4748 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4723 = $4748;
                                    break;
                            };
                            var $4639 = $4723;
                            break;
                        case 'Kind.Term.hol':
                            var $4749 = self.path;
                            var $4750 = Kind$Term$equal$hole$($4749, _b$2);
                            var $4639 = $4750;
                            break;
                        case 'Kind.Term.var':
                        case 'Kind.Term.ori':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4752 = self.path;
                                    var $4753 = Kind$Term$equal$hole$($4752, _a$1);
                                    var $4751 = $4753;
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
                                    var $4754 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4751 = $4754;
                                    break;
                            };
                            var $4639 = $4751;
                            break;
                        case 'Kind.Term.ref':
                        case 'Kind.Term.nat':
                        case 'Kind.Term.chr':
                        case 'Kind.Term.str':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4756 = self.path;
                                    var $4757 = Kind$Term$equal$hole$($4756, _a$1);
                                    var $4755 = $4757;
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
                                    var $4758 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4755 = $4758;
                                    break;
                            };
                            var $4639 = $4755;
                            break;
                        case 'Kind.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4760 = self.path;
                                    var $4761 = Kind$Term$equal$hole$($4760, _a$1);
                                    var $4759 = $4761;
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
                                    var $4762 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4759 = $4762;
                                    break;
                            };
                            var $4639 = $4759;
                            break;
                        case 'Kind.Term.def':
                        case 'Kind.Term.ann':
                        case 'Kind.Term.gol':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4764 = self.path;
                                    var $4765 = Kind$Term$equal$hole$($4764, _a$1);
                                    var $4763 = $4765;
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
                                    var $4766 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4763 = $4766;
                                    break;
                            };
                            var $4639 = $4763;
                            break;
                        case 'Kind.Term.cse':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4768 = self.path;
                                    var $4769 = Kind$Term$equal$hole$($4768, _a$1);
                                    var $4767 = $4769;
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
                                    var $4770 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4767 = $4770;
                                    break;
                            };
                            var $4639 = $4767;
                            break;
                    };
                    var $4629 = $4639;
                };
                var $4627 = $4629;
            };
            var $4625 = $4627;
        };
        return $4625;
    };
    const Kind$Term$equal = x0 => x1 => x2 => x3 => x4 => Kind$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;
    const Set$mut$new = a0 => (({}));

    function Kind$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4772 = self.name;
                var $4773 = self.indx;
                var self = List$at_last$($4773, _ctx$4);
                switch (self._) {
                    case 'Maybe.some':
                        var $4775 = self.value;
                        var $4776 = Kind$Check$result$(Maybe$some$((() => {
                            var self = $4775;
                            switch (self._) {
                                case 'Pair.new':
                                    var $4777 = self.snd;
                                    var $4778 = $4777;
                                    return $4778;
                            };
                        })()), List$nil);
                        var $4774 = $4776;
                        break;
                    case 'Maybe.none':
                        var $4779 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4772), List$nil));
                        var $4774 = $4779;
                        break;
                };
                var self = $4774;
                break;
            case 'Kind.Term.ref':
                var $4780 = self.name;
                var self = Kind$get$($4780, _defs$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $4782 = self.value;
                        var self = $4782;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4784 = self.name;
                                var $4785 = self.term;
                                var $4786 = self.type;
                                var $4787 = self.stat;
                                var _ref_name$18 = $4784;
                                var _ref_type$19 = $4786;
                                var _ref_term$20 = $4785;
                                var _ref_stat$21 = $4787;
                                var self = _ref_stat$21;
                                switch (self._) {
                                    case 'Kind.Status.init':
                                        var $4789 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$waiting$(_ref_name$18), List$nil));
                                        var $4788 = $4789;
                                        break;
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $4790 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$nil);
                                        var $4788 = $4790;
                                        break;
                                    case 'Kind.Status.fail':
                                        var $4791 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$indirect$(_ref_name$18), List$nil));
                                        var $4788 = $4791;
                                        break;
                                };
                                var $4783 = $4788;
                                break;
                        };
                        var $4781 = $4783;
                        break;
                    case 'Maybe.none':
                        var $4792 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4780), List$nil));
                        var $4781 = $4792;
                        break;
                };
                var self = $4781;
                break;
            case 'Kind.Term.all':
                var $4793 = self.self;
                var $4794 = self.name;
                var $4795 = self.xtyp;
                var $4796 = self.body;
                var _ctx_size$12 = (list_length(_ctx$4));
                var _self_var$13 = Kind$Term$var$($4793, _ctx_size$12);
                var _body_var$14 = Kind$Term$var$($4794, Nat$succ$(_ctx_size$12));
                var _body_ctx$15 = List$cons$(Pair$new$($4794, $4795), List$cons$(Pair$new$($4793, _term$1), _ctx$4));
                var self = Kind$Term$check$($4795, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4798 = self.value;
                        var $4799 = self.errors;
                        var self = $4798;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4801 = Kind$Check$result$(Maybe$none, $4799);
                                var $4800 = $4801;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Term$check$($4796(_self_var$13)(_body_var$14), Maybe$some$(Kind$Term$typ), _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4803 = self.value;
                                        var $4804 = self.errors;
                                        var self = $4803;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4806 = Kind$Check$result$(Maybe$none, $4804);
                                                var $4805 = $4806;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4808 = self.value;
                                                        var $4809 = self.errors;
                                                        var $4810 = Kind$Check$result$($4808, List$concat$($4804, $4809));
                                                        var $4807 = $4810;
                                                        break;
                                                };
                                                var $4805 = $4807;
                                                break;
                                        };
                                        var self = $4805;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4811 = self.value;
                                        var $4812 = self.errors;
                                        var $4813 = Kind$Check$result$($4811, List$concat$($4799, $4812));
                                        var $4802 = $4813;
                                        break;
                                };
                                var $4800 = $4802;
                                break;
                        };
                        var $4797 = $4800;
                        break;
                };
                var self = $4797;
                break;
            case 'Kind.Term.lam':
                var $4814 = self.name;
                var $4815 = self.body;
                var self = _type$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $4817 = self.value;
                        var _typv$10 = Kind$Term$reduce$($4817, _defs$3);
                        var self = _typv$10;
                        switch (self._) {
                            case 'Kind.Term.all':
                                var $4819 = self.xtyp;
                                var $4820 = self.body;
                                var _ctx_size$16 = (list_length(_ctx$4));
                                var _self_var$17 = _term$1;
                                var _body_var$18 = Kind$Term$var$($4814, _ctx_size$16);
                                var _body_typ$19 = $4820(_self_var$17)(_body_var$18);
                                var _body_ctx$20 = List$cons$(Pair$new$($4814, $4819), _ctx$4);
                                var self = Kind$Term$check$($4815(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Kind$MPath$o$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4822 = self.value;
                                        var $4823 = self.errors;
                                        var self = $4822;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4825 = Kind$Check$result$(Maybe$none, $4823);
                                                var $4824 = $4825;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$($4817), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4827 = self.value;
                                                        var $4828 = self.errors;
                                                        var $4829 = Kind$Check$result$($4827, List$concat$($4823, $4828));
                                                        var $4826 = $4829;
                                                        break;
                                                };
                                                var $4824 = $4826;
                                                break;
                                        };
                                        var $4821 = $4824;
                                        break;
                                };
                                var $4818 = $4821;
                                break;
                            case 'Kind.Term.var':
                            case 'Kind.Term.lam':
                            case 'Kind.Term.app':
                            case 'Kind.Term.ori':
                                var _expected$13 = Either$left$("(function type)");
                                var _detected$14 = Either$right$($4817);
                                var $4830 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4818 = $4830;
                                break;
                            case 'Kind.Term.ref':
                            case 'Kind.Term.hol':
                            case 'Kind.Term.nat':
                            case 'Kind.Term.chr':
                            case 'Kind.Term.str':
                                var _expected$12 = Either$left$("(function type)");
                                var _detected$13 = Either$right$($4817);
                                var $4831 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4818 = $4831;
                                break;
                            case 'Kind.Term.typ':
                                var _expected$11 = Either$left$("(function type)");
                                var _detected$12 = Either$right$($4817);
                                var $4832 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4818 = $4832;
                                break;
                            case 'Kind.Term.let':
                            case 'Kind.Term.def':
                            case 'Kind.Term.ann':
                            case 'Kind.Term.gol':
                                var _expected$14 = Either$left$("(function type)");
                                var _detected$15 = Either$right$($4817);
                                var $4833 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4818 = $4833;
                                break;
                            case 'Kind.Term.cse':
                                var _expected$17 = Either$left$("(function type)");
                                var _detected$18 = Either$right$($4817);
                                var $4834 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4818 = $4834;
                                break;
                        };
                        var $4816 = $4818;
                        break;
                    case 'Maybe.none':
                        var _lam_type$9 = Kind$Term$hol$(Bits$e);
                        var _lam_term$10 = Kind$Term$ann$(Bool$false, _term$1, _lam_type$9);
                        var $4835 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), _lam_term$10), List$nil));
                        var $4816 = $4835;
                        break;
                };
                var self = $4816;
                break;
            case 'Kind.Term.app':
                var $4836 = self.func;
                var $4837 = self.argm;
                var self = Kind$Term$check$($4836, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4839 = self.value;
                        var $4840 = self.errors;
                        var self = $4839;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4842 = self.value;
                                var _func_typ$12 = Kind$Term$reduce$($4842, _defs$3);
                                var self = _func_typ$12;
                                switch (self._) {
                                    case 'Kind.Term.all':
                                        var $4844 = self.xtyp;
                                        var $4845 = self.body;
                                        var self = Kind$Term$check$($4837, Maybe$some$($4844), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4847 = self.value;
                                                var $4848 = self.errors;
                                                var self = $4847;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $4850 = Kind$Check$result$(Maybe$none, $4848);
                                                        var $4849 = $4850;
                                                        break;
                                                    case 'Maybe.some':
                                                        var self = Kind$Check$result$(Maybe$some$($4845($4836)($4837)), List$nil);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4852 = self.value;
                                                                var $4853 = self.errors;
                                                                var $4854 = Kind$Check$result$($4852, List$concat$($4848, $4853));
                                                                var $4851 = $4854;
                                                                break;
                                                        };
                                                        var $4849 = $4851;
                                                        break;
                                                };
                                                var $4846 = $4849;
                                                break;
                                        };
                                        var self = $4846;
                                        break;
                                    case 'Kind.Term.var':
                                    case 'Kind.Term.lam':
                                    case 'Kind.Term.app':
                                    case 'Kind.Term.ori':
                                        var _expected$15 = Either$left$("(function type)");
                                        var _detected$16 = Either$right$(_func_typ$12);
                                        var $4855 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$15, _detected$16, _ctx$4), List$nil));
                                        var self = $4855;
                                        break;
                                    case 'Kind.Term.ref':
                                    case 'Kind.Term.hol':
                                    case 'Kind.Term.nat':
                                    case 'Kind.Term.chr':
                                    case 'Kind.Term.str':
                                        var _expected$14 = Either$left$("(function type)");
                                        var _detected$15 = Either$right$(_func_typ$12);
                                        var $4856 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                        var self = $4856;
                                        break;
                                    case 'Kind.Term.typ':
                                        var _expected$13 = Either$left$("(function type)");
                                        var _detected$14 = Either$right$(_func_typ$12);
                                        var $4857 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                        var self = $4857;
                                        break;
                                    case 'Kind.Term.let':
                                    case 'Kind.Term.def':
                                    case 'Kind.Term.ann':
                                    case 'Kind.Term.gol':
                                        var _expected$16 = Either$left$("(function type)");
                                        var _detected$17 = Either$right$(_func_typ$12);
                                        var $4858 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$16, _detected$17, _ctx$4), List$nil));
                                        var self = $4858;
                                        break;
                                    case 'Kind.Term.cse':
                                        var _expected$19 = Either$left$("(function type)");
                                        var _detected$20 = Either$right$(_func_typ$12);
                                        var $4859 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$19, _detected$20, _ctx$4), List$nil));
                                        var self = $4859;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4860 = self.value;
                                        var $4861 = self.errors;
                                        var $4862 = Kind$Check$result$($4860, List$concat$($4840, $4861));
                                        var $4843 = $4862;
                                        break;
                                };
                                var $4841 = $4843;
                                break;
                            case 'Maybe.none':
                                var $4863 = Kind$Check$result$(Maybe$none, $4840);
                                var $4841 = $4863;
                                break;
                        };
                        var $4838 = $4841;
                        break;
                };
                var self = $4838;
                break;
            case 'Kind.Term.let':
                var $4864 = self.name;
                var $4865 = self.expr;
                var $4866 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($4865, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4868 = self.value;
                        var $4869 = self.errors;
                        var self = $4868;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4871 = self.value;
                                var _body_val$14 = $4866(Kind$Term$var$($4864, _ctx_size$10));
                                var _body_ctx$15 = List$cons$(Pair$new$($4864, $4871), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4873 = self.value;
                                        var $4874 = self.errors;
                                        var self = $4873;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $4876 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($4876), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4878 = self.value;
                                                        var $4879 = self.errors;
                                                        var $4880 = Kind$Check$result$($4878, List$concat$($4874, $4879));
                                                        var $4877 = $4880;
                                                        break;
                                                };
                                                var $4875 = $4877;
                                                break;
                                            case 'Maybe.none':
                                                var $4881 = Kind$Check$result$(Maybe$none, $4874);
                                                var $4875 = $4881;
                                                break;
                                        };
                                        var self = $4875;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4882 = self.value;
                                        var $4883 = self.errors;
                                        var $4884 = Kind$Check$result$($4882, List$concat$($4869, $4883));
                                        var $4872 = $4884;
                                        break;
                                };
                                var $4870 = $4872;
                                break;
                            case 'Maybe.none':
                                var $4885 = Kind$Check$result$(Maybe$none, $4869);
                                var $4870 = $4885;
                                break;
                        };
                        var $4867 = $4870;
                        break;
                };
                var self = $4867;
                break;
            case 'Kind.Term.def':
                var $4886 = self.name;
                var $4887 = self.expr;
                var $4888 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($4887, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4890 = self.value;
                        var $4891 = self.errors;
                        var self = $4890;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4893 = self.value;
                                var _body_val$14 = $4888(Kind$Term$ann$(Bool$true, $4887, $4893));
                                var _body_ctx$15 = List$cons$(Pair$new$($4886, $4893), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4895 = self.value;
                                        var $4896 = self.errors;
                                        var self = $4895;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $4898 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($4898), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4900 = self.value;
                                                        var $4901 = self.errors;
                                                        var $4902 = Kind$Check$result$($4900, List$concat$($4896, $4901));
                                                        var $4899 = $4902;
                                                        break;
                                                };
                                                var $4897 = $4899;
                                                break;
                                            case 'Maybe.none':
                                                var $4903 = Kind$Check$result$(Maybe$none, $4896);
                                                var $4897 = $4903;
                                                break;
                                        };
                                        var self = $4897;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4904 = self.value;
                                        var $4905 = self.errors;
                                        var $4906 = Kind$Check$result$($4904, List$concat$($4891, $4905));
                                        var $4894 = $4906;
                                        break;
                                };
                                var $4892 = $4894;
                                break;
                            case 'Maybe.none':
                                var $4907 = Kind$Check$result$(Maybe$none, $4891);
                                var $4892 = $4907;
                                break;
                        };
                        var $4889 = $4892;
                        break;
                };
                var self = $4889;
                break;
            case 'Kind.Term.ann':
                var $4908 = self.done;
                var $4909 = self.term;
                var $4910 = self.type;
                var self = $4908;
                if (self) {
                    var $4912 = Kind$Check$result$(Maybe$some$($4910), List$nil);
                    var $4911 = $4912;
                } else {
                    var self = Kind$Term$check$($4909, Maybe$some$($4910), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4914 = self.value;
                            var $4915 = self.errors;
                            var self = $4914;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4917 = Kind$Check$result$(Maybe$none, $4915);
                                    var $4916 = $4917;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Term$check$($4910, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4919 = self.value;
                                            var $4920 = self.errors;
                                            var self = $4919;
                                            switch (self._) {
                                                case 'Maybe.none':
                                                    var $4922 = Kind$Check$result$(Maybe$none, $4920);
                                                    var $4921 = $4922;
                                                    break;
                                                case 'Maybe.some':
                                                    var self = Kind$Check$result$(Maybe$some$($4910), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4924 = self.value;
                                                            var $4925 = self.errors;
                                                            var $4926 = Kind$Check$result$($4924, List$concat$($4920, $4925));
                                                            var $4923 = $4926;
                                                            break;
                                                    };
                                                    var $4921 = $4923;
                                                    break;
                                            };
                                            var self = $4921;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4927 = self.value;
                                            var $4928 = self.errors;
                                            var $4929 = Kind$Check$result$($4927, List$concat$($4915, $4928));
                                            var $4918 = $4929;
                                            break;
                                    };
                                    var $4916 = $4918;
                                    break;
                            };
                            var $4913 = $4916;
                            break;
                    };
                    var $4911 = $4913;
                };
                var self = $4911;
                break;
            case 'Kind.Term.gol':
                var $4930 = self.name;
                var $4931 = self.dref;
                var $4932 = self.verb;
                var $4933 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$show_goal$($4930, $4931, $4932, _type$2, _ctx$4), List$nil));
                var self = $4933;
                break;
            case 'Kind.Term.cse':
                var $4934 = self.path;
                var $4935 = self.expr;
                var $4936 = self.name;
                var $4937 = self.with;
                var $4938 = self.cses;
                var $4939 = self.moti;
                var _expr$13 = $4935;
                var self = Kind$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4941 = self.value;
                        var $4942 = self.errors;
                        var self = $4941;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4944 = self.value;
                                var self = $4939;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4946 = self.value;
                                        var $4947 = Kind$Term$desugar_cse$($4935, $4936, $4937, $4938, $4946, $4944, _defs$3, _ctx$4);
                                        var _dsug$17 = $4947;
                                        break;
                                    case 'Maybe.none':
                                        var self = _type$2;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $4949 = self.value;
                                                var _size$18 = (list_length(_ctx$4));
                                                var _typv$19 = Kind$Term$normalize$($4949, Map$new);
                                                var _moti$20 = Kind$SmartMotive$make$($4936, $4935, $4944, _typv$19, _size$18, _defs$3);
                                                var $4950 = _moti$20;
                                                var _moti$17 = $4950;
                                                break;
                                            case 'Maybe.none':
                                                var $4951 = Kind$Term$hol$(Bits$e);
                                                var _moti$17 = $4951;
                                                break;
                                        };
                                        var $4948 = Maybe$some$(Kind$Term$cse$($4934, $4935, $4936, $4937, $4938, Maybe$some$(_moti$17)));
                                        var _dsug$17 = $4948;
                                        break;
                                };
                                var self = _dsug$17;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4952 = self.value;
                                        var $4953 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), $4952), List$nil));
                                        var self = $4953;
                                        break;
                                    case 'Maybe.none':
                                        var $4954 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                        var self = $4954;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4955 = self.value;
                                        var $4956 = self.errors;
                                        var $4957 = Kind$Check$result$($4955, List$concat$($4942, $4956));
                                        var $4945 = $4957;
                                        break;
                                };
                                var $4943 = $4945;
                                break;
                            case 'Maybe.none':
                                var $4958 = Kind$Check$result$(Maybe$none, $4942);
                                var $4943 = $4958;
                                break;
                        };
                        var $4940 = $4943;
                        break;
                };
                var self = $4940;
                break;
            case 'Kind.Term.ori':
                var $4959 = self.orig;
                var $4960 = self.expr;
                var $4961 = Kind$Term$check$($4960, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($4959));
                var self = $4961;
                break;
            case 'Kind.Term.typ':
                var $4962 = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                var self = $4962;
                break;
            case 'Kind.Term.hol':
                var $4963 = Kind$Check$result$(_type$2, List$nil);
                var self = $4963;
                break;
            case 'Kind.Term.nat':
                var $4964 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Nat")), List$nil);
                var self = $4964;
                break;
            case 'Kind.Term.chr':
                var $4965 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Char")), List$nil);
                var self = $4965;
                break;
            case 'Kind.Term.str':
                var $4966 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("String")), List$nil);
                var self = $4966;
                break;
        };
        switch (self._) {
            case 'Kind.Check.result':
                var $4967 = self.value;
                var $4968 = self.errors;
                var self = $4967;
                switch (self._) {
                    case 'Maybe.some':
                        var $4970 = self.value;
                        var self = _type$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4972 = self.value;
                                var self = Kind$Term$equal$($4972, $4970, _defs$3, (list_length(_ctx$4)), (({})));
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4974 = self.value;
                                        var $4975 = self.errors;
                                        var self = $4974;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $4977 = self.value;
                                                var self = $4977;
                                                if (self) {
                                                    var $4979 = Kind$Check$result$(Maybe$some$($4972), List$nil);
                                                    var self = $4979;
                                                } else {
                                                    var $4980 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, Either$right$($4972), Either$right$($4970), _ctx$4), List$nil));
                                                    var self = $4980;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4981 = self.value;
                                                        var $4982 = self.errors;
                                                        var $4983 = Kind$Check$result$($4981, List$concat$($4975, $4982));
                                                        var $4978 = $4983;
                                                        break;
                                                };
                                                var $4976 = $4978;
                                                break;
                                            case 'Maybe.none':
                                                var $4984 = Kind$Check$result$(Maybe$none, $4975);
                                                var $4976 = $4984;
                                                break;
                                        };
                                        var $4973 = $4976;
                                        break;
                                };
                                var self = $4973;
                                break;
                            case 'Maybe.none':
                                var $4985 = Kind$Check$result$(Maybe$some$($4970), List$nil);
                                var self = $4985;
                                break;
                        };
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4986 = self.value;
                                var $4987 = self.errors;
                                var $4988 = Kind$Check$result$($4986, List$concat$($4968, $4987));
                                var $4971 = $4988;
                                break;
                        };
                        var $4969 = $4971;
                        break;
                    case 'Maybe.none':
                        var $4989 = Kind$Check$result$(Maybe$none, $4968);
                        var $4969 = $4989;
                        break;
                };
                var $4771 = $4969;
                break;
        };
        return $4771;
    };
    const Kind$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$check$(x0, x1, x2, x3, x4, x5);

    function Kind$Path$nil$(_x$1) {
        var $4990 = _x$1;
        return $4990;
    };
    const Kind$Path$nil = x0 => Kind$Path$nil$(x0);
    const Kind$MPath$nil = Maybe$some$(Kind$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $4992 = Bool$true;
                var $4991 = $4992;
                break;
            case 'List.cons':
                var $4993 = Bool$false;
                var $4991 = $4993;
                break;
        };
        return $4991;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kind$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.all':
                var $4995 = self.eras;
                var $4996 = self.self;
                var $4997 = self.name;
                var $4998 = self.xtyp;
                var $4999 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5001 = self.slice(0, -1);
                        var $5002 = Kind$Term$all$($4995, $4996, $4997, Kind$Term$patch_at$($5001, $4998, _fn$3), $4999);
                        var $5000 = $5002;
                        break;
                    case 'i':
                        var $5003 = self.slice(0, -1);
                        var $5004 = Kind$Term$all$($4995, $4996, $4997, $4998, (_s$10 => _x$11 => {
                            var $5005 = Kind$Term$patch_at$($5003, $4999(_s$10)(_x$11), _fn$3);
                            return $5005;
                        }));
                        var $5000 = $5004;
                        break;
                    case 'e':
                        var $5006 = _fn$3(_term$2);
                        var $5000 = $5006;
                        break;
                };
                var $4994 = $5000;
                break;
            case 'Kind.Term.lam':
                var $5007 = self.name;
                var $5008 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5010 = _fn$3(_term$2);
                        var $5009 = $5010;
                        break;
                    case 'o':
                    case 'i':
                        var $5011 = Kind$Term$lam$($5007, (_x$7 => {
                            var $5012 = Kind$Term$patch_at$(Bits$tail$(_path$1), $5008(_x$7), _fn$3);
                            return $5012;
                        }));
                        var $5009 = $5011;
                        break;
                };
                var $4994 = $5009;
                break;
            case 'Kind.Term.app':
                var $5013 = self.func;
                var $5014 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5016 = self.slice(0, -1);
                        var $5017 = Kind$Term$app$(Kind$Term$patch_at$($5016, $5013, _fn$3), $5014);
                        var $5015 = $5017;
                        break;
                    case 'i':
                        var $5018 = self.slice(0, -1);
                        var $5019 = Kind$Term$app$($5013, Kind$Term$patch_at$($5018, $5014, _fn$3));
                        var $5015 = $5019;
                        break;
                    case 'e':
                        var $5020 = _fn$3(_term$2);
                        var $5015 = $5020;
                        break;
                };
                var $4994 = $5015;
                break;
            case 'Kind.Term.let':
                var $5021 = self.name;
                var $5022 = self.expr;
                var $5023 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5025 = self.slice(0, -1);
                        var $5026 = Kind$Term$let$($5021, Kind$Term$patch_at$($5025, $5022, _fn$3), $5023);
                        var $5024 = $5026;
                        break;
                    case 'i':
                        var $5027 = self.slice(0, -1);
                        var $5028 = Kind$Term$let$($5021, $5022, (_x$8 => {
                            var $5029 = Kind$Term$patch_at$($5027, $5023(_x$8), _fn$3);
                            return $5029;
                        }));
                        var $5024 = $5028;
                        break;
                    case 'e':
                        var $5030 = _fn$3(_term$2);
                        var $5024 = $5030;
                        break;
                };
                var $4994 = $5024;
                break;
            case 'Kind.Term.def':
                var $5031 = self.name;
                var $5032 = self.expr;
                var $5033 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5035 = self.slice(0, -1);
                        var $5036 = Kind$Term$def$($5031, Kind$Term$patch_at$($5035, $5032, _fn$3), $5033);
                        var $5034 = $5036;
                        break;
                    case 'i':
                        var $5037 = self.slice(0, -1);
                        var $5038 = Kind$Term$def$($5031, $5032, (_x$8 => {
                            var $5039 = Kind$Term$patch_at$($5037, $5033(_x$8), _fn$3);
                            return $5039;
                        }));
                        var $5034 = $5038;
                        break;
                    case 'e':
                        var $5040 = _fn$3(_term$2);
                        var $5034 = $5040;
                        break;
                };
                var $4994 = $5034;
                break;
            case 'Kind.Term.ann':
                var $5041 = self.done;
                var $5042 = self.term;
                var $5043 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5045 = self.slice(0, -1);
                        var $5046 = Kind$Term$ann$($5041, Kind$Term$patch_at$($5045, $5042, _fn$3), $5043);
                        var $5044 = $5046;
                        break;
                    case 'i':
                        var $5047 = self.slice(0, -1);
                        var $5048 = Kind$Term$ann$($5041, $5042, Kind$Term$patch_at$($5047, $5043, _fn$3));
                        var $5044 = $5048;
                        break;
                    case 'e':
                        var $5049 = _fn$3(_term$2);
                        var $5044 = $5049;
                        break;
                };
                var $4994 = $5044;
                break;
            case 'Kind.Term.ori':
                var $5050 = self.orig;
                var $5051 = self.expr;
                var $5052 = Kind$Term$ori$($5050, Kind$Term$patch_at$(_path$1, $5051, _fn$3));
                var $4994 = $5052;
                break;
            case 'Kind.Term.var':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5054 = _fn$3(_term$2);
                        var $5053 = $5054;
                        break;
                    case 'o':
                    case 'i':
                        var $5055 = _term$2;
                        var $5053 = $5055;
                        break;
                };
                var $4994 = $5053;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5057 = _fn$3(_term$2);
                        var $5056 = $5057;
                        break;
                    case 'o':
                    case 'i':
                        var $5058 = _term$2;
                        var $5056 = $5058;
                        break;
                };
                var $4994 = $5056;
                break;
            case 'Kind.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5060 = _fn$3(_term$2);
                        var $5059 = $5060;
                        break;
                    case 'o':
                    case 'i':
                        var $5061 = _term$2;
                        var $5059 = $5061;
                        break;
                };
                var $4994 = $5059;
                break;
            case 'Kind.Term.gol':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5063 = _fn$3(_term$2);
                        var $5062 = $5063;
                        break;
                    case 'o':
                    case 'i':
                        var $5064 = _term$2;
                        var $5062 = $5064;
                        break;
                };
                var $4994 = $5062;
                break;
            case 'Kind.Term.cse':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5066 = _fn$3(_term$2);
                        var $5065 = $5066;
                        break;
                    case 'o':
                    case 'i':
                        var $5067 = _term$2;
                        var $5065 = $5067;
                        break;
                };
                var $4994 = $5065;
                break;
        };
        return $4994;
    };
    const Kind$Term$patch_at = x0 => x1 => x2 => Kind$Term$patch_at$(x0, x1, x2);

    function Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, _errs$10, _fixd$11) {
        var self = _errs$10;
        switch (self._) {
            case 'List.cons':
                var $5069 = self.head;
                var $5070 = self.tail;
                var self = $5069;
                switch (self._) {
                    case 'Kind.Error.waiting':
                        var $5072 = self.name;
                        var $5073 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                            var $5074 = _m$bind$15;
                            return $5074;
                        }))(Kind$Synth$one$($5072, _defs$9))((_new_defs$15 => {
                            var self = _new_defs$15;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5076 = self.value;
                                    var $5077 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5076, $5070, Bool$true);
                                    var $5075 = $5077;
                                    break;
                                case 'Maybe.none':
                                    var $5078 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5070, _fixd$11);
                                    var $5075 = $5078;
                                    break;
                            };
                            return $5075;
                        }));
                        var $5071 = $5073;
                        break;
                    case 'Kind.Error.patch':
                        var $5079 = self.path;
                        var $5080 = self.term;
                        var self = $5079;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $5082 = self.slice(0, -1);
                                var _term$17 = Kind$Term$patch_at$($5082, _term$5, (_x$17 => {
                                    var $5084 = $5080;
                                    return $5084;
                                }));
                                var $5083 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$17, _type$6, _isct$7, _arit$8, _defs$9, $5070, Bool$true);
                                var $5081 = $5083;
                                break;
                            case 'i':
                                var $5085 = self.slice(0, -1);
                                var _type$17 = Kind$Term$patch_at$($5085, _type$6, (_x$17 => {
                                    var $5087 = $5080;
                                    return $5087;
                                }));
                                var $5086 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$17, _isct$7, _arit$8, _defs$9, $5070, Bool$true);
                                var $5081 = $5086;
                                break;
                            case 'e':
                                var $5088 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $5089 = _m$pure$17;
                                    return $5089;
                                }))(Maybe$none);
                                var $5081 = $5088;
                                break;
                        };
                        var $5071 = $5081;
                        break;
                    case 'Kind.Error.undefined_reference':
                        var $5090 = self.name;
                        var $5091 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                            var $5092 = _m$bind$16;
                            return $5092;
                        }))(Kind$Synth$one$($5090, _defs$9))((_new_defs$16 => {
                            var self = _new_defs$16;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5094 = self.value;
                                    var $5095 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5094, $5070, Bool$true);
                                    var $5093 = $5095;
                                    break;
                                case 'Maybe.none':
                                    var $5096 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5070, _fixd$11);
                                    var $5093 = $5096;
                                    break;
                            };
                            return $5093;
                        }));
                        var $5071 = $5091;
                        break;
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.cant_infer':
                        var $5097 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5070, _fixd$11);
                        var $5071 = $5097;
                        break;
                };
                var $5068 = $5071;
                break;
            case 'List.nil':
                var self = _fixd$11;
                if (self) {
                    var _type$12 = Kind$Term$bind$(List$nil, (_x$12 => {
                        var $5100 = (_x$12 + '1');
                        return $5100;
                    }), _type$6);
                    var _term$13 = Kind$Term$bind$(List$nil, (_x$13 => {
                        var $5101 = (_x$13 + '0');
                        return $5101;
                    }), _term$5);
                    var _defs$14 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$13, _type$12, _isct$7, _arit$8, Kind$Status$init), _defs$9);
                    var $5099 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                        var $5102 = _m$pure$16;
                        return $5102;
                    }))(Maybe$some$(_defs$14));
                    var $5098 = $5099;
                } else {
                    var $5103 = IO$monad$((_m$bind$12 => _m$pure$13 => {
                        var $5104 = _m$pure$13;
                        return $5104;
                    }))(Maybe$none);
                    var $5098 = $5103;
                };
                var $5068 = $5098;
                break;
        };
        return $5068;
    };
    const Kind$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Kind$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);

    function Kind$Status$fail$(_errors$1) {
        var $5105 = ({
            _: 'Kind.Status.fail',
            'errors': _errors$1
        });
        return $5105;
    };
    const Kind$Status$fail = x0 => Kind$Status$fail$(x0);

    function Kind$Synth$one$(_name$1, _defs$2) {
        var self = Kind$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.some':
                var $5107 = self.value;
                var self = $5107;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5109 = self.file;
                        var $5110 = self.code;
                        var $5111 = self.orig;
                        var $5112 = self.name;
                        var $5113 = self.term;
                        var $5114 = self.type;
                        var $5115 = self.isct;
                        var $5116 = self.arit;
                        var $5117 = self.stat;
                        var _file$13 = $5109;
                        var _code$14 = $5110;
                        var _orig$15 = $5111;
                        var _name$16 = $5112;
                        var _term$17 = $5113;
                        var _type$18 = $5114;
                        var _isct$19 = $5115;
                        var _arit$20 = $5116;
                        var _stat$21 = $5117;
                        var self = _stat$21;
                        switch (self._) {
                            case 'Kind.Status.init':
                                var _defs$22 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Kind$Status$wait), _defs$2);
                                var self = Kind$Term$check$(_type$18, Maybe$some$(Kind$Term$typ), _defs$22, List$nil, Kind$MPath$i$(Kind$MPath$nil), Maybe$none);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5120 = self.value;
                                        var $5121 = self.errors;
                                        var self = $5120;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5123 = Kind$Check$result$(Maybe$none, $5121);
                                                var $5122 = $5123;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Term$check$(_term$17, Maybe$some$(_type$18), _defs$22, List$nil, Kind$MPath$o$(Kind$MPath$nil), Maybe$none);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5125 = self.value;
                                                        var $5126 = self.errors;
                                                        var self = $5125;
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $5128 = Kind$Check$result$(Maybe$none, $5126);
                                                                var $5127 = $5128;
                                                                break;
                                                            case 'Maybe.some':
                                                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                                                switch (self._) {
                                                                    case 'Kind.Check.result':
                                                                        var $5130 = self.value;
                                                                        var $5131 = self.errors;
                                                                        var $5132 = Kind$Check$result$($5130, List$concat$($5126, $5131));
                                                                        var $5129 = $5132;
                                                                        break;
                                                                };
                                                                var $5127 = $5129;
                                                                break;
                                                        };
                                                        var self = $5127;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5133 = self.value;
                                                        var $5134 = self.errors;
                                                        var $5135 = Kind$Check$result$($5133, List$concat$($5121, $5134));
                                                        var $5124 = $5135;
                                                        break;
                                                };
                                                var $5122 = $5124;
                                                break;
                                        };
                                        var _checked$23 = $5122;
                                        break;
                                };
                                var self = _checked$23;
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5136 = self.errors;
                                        var self = List$is_empty$($5136);
                                        if (self) {
                                            var _defs$26 = Kind$define$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Bool$true, _defs$22);
                                            var $5138 = IO$monad$((_m$bind$27 => _m$pure$28 => {
                                                var $5139 = _m$pure$28;
                                                return $5139;
                                            }))(Maybe$some$(_defs$26));
                                            var $5137 = $5138;
                                        } else {
                                            var $5140 = IO$monad$((_m$bind$26 => _m$pure$27 => {
                                                var $5141 = _m$bind$26;
                                                return $5141;
                                            }))(Kind$Synth$fix$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _defs$22, $5136, Bool$false))((_fixed$26 => {
                                                var self = _fixed$26;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $5143 = self.value;
                                                        var $5144 = Kind$Synth$one$(_name$16, $5143);
                                                        var $5142 = $5144;
                                                        break;
                                                    case 'Maybe.none':
                                                        var _stat$27 = Kind$Status$fail$($5136);
                                                        var _defs$28 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _stat$27), _defs$22);
                                                        var $5145 = IO$monad$((_m$bind$29 => _m$pure$30 => {
                                                            var $5146 = _m$pure$30;
                                                            return $5146;
                                                        }))(Maybe$some$(_defs$28));
                                                        var $5142 = $5145;
                                                        break;
                                                };
                                                return $5142;
                                            }));
                                            var $5137 = $5140;
                                        };
                                        var $5119 = $5137;
                                        break;
                                };
                                var $5118 = $5119;
                                break;
                            case 'Kind.Status.wait':
                            case 'Kind.Status.done':
                                var $5147 = IO$monad$((_m$bind$22 => _m$pure$23 => {
                                    var $5148 = _m$pure$23;
                                    return $5148;
                                }))(Maybe$some$(_defs$2));
                                var $5118 = $5147;
                                break;
                            case 'Kind.Status.fail':
                                var $5149 = IO$monad$((_m$bind$23 => _m$pure$24 => {
                                    var $5150 = _m$pure$24;
                                    return $5150;
                                }))(Maybe$some$(_defs$2));
                                var $5118 = $5149;
                                break;
                        };
                        var $5108 = $5118;
                        break;
                };
                var $5106 = $5108;
                break;
            case 'Maybe.none':
                var $5151 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5152 = _m$bind$3;
                    return $5152;
                }))(Kind$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5154 = self.value;
                            var $5155 = Kind$Synth$one$(_name$1, $5154);
                            var $5153 = $5155;
                            break;
                        case 'Maybe.none':
                            var $5156 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                                var $5157 = _m$pure$5;
                                return $5157;
                            }))(Maybe$none);
                            var $5153 = $5156;
                            break;
                    };
                    return $5153;
                }));
                var $5106 = $5151;
                break;
        };
        return $5106;
    };
    const Kind$Synth$one = x0 => x1 => Kind$Synth$one$(x0, x1);

    function Map$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'Map.tie':
                var $5159 = self.val;
                var $5160 = self.lft;
                var $5161 = self.rgt;
                var self = $5159;
                switch (self._) {
                    case 'Maybe.some':
                        var $5163 = self.value;
                        var $5164 = Maybe$some$(_fn$3($5163));
                        var _val$8 = $5164;
                        break;
                    case 'Maybe.none':
                        var $5165 = Maybe$none;
                        var _val$8 = $5165;
                        break;
                };
                var _lft$9 = Map$map$(_fn$3, $5160);
                var _rgt$10 = Map$map$(_fn$3, $5161);
                var $5162 = Map$tie$(_val$8, _lft$9, _rgt$10);
                var $5158 = $5162;
                break;
            case 'Map.new':
                var $5166 = Map$new;
                var $5158 = $5166;
                break;
        };
        return $5158;
    };
    const Map$map = x0 => x1 => Map$map$(x0, x1);
    const Kind$Term$inline$names = (() => {
        var _inl$1 = List$cons$("Monad.pure", List$cons$("Monad.bind", List$cons$("Monad.new", List$cons$("Parser.monad", List$cons$("Parser.bind", List$cons$("Parser.pure", List$cons$("Kind.Check.pure", List$cons$("Kind.Check.bind", List$cons$("Kind.Check.monad", List$cons$("Kind.Check.value", List$cons$("Kind.Check.none", List$nil)))))))))));
        var _kvs$2 = List$mapped$(_inl$1, (_x$2 => {
            var $5168 = Pair$new$((kind_name_to_bits(_x$2)), Unit$new);
            return $5168;
        }));
        var $5167 = Map$from_list$(_kvs$2);
        return $5167;
    })();

    function Kind$Term$inline$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5170 = self.name;
                var _inli$4 = Set$has$((kind_name_to_bits($5170)), Kind$Term$inline$names);
                var self = _inli$4;
                if (self) {
                    var self = Kind$get$($5170, _defs$2);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5173 = self.value;
                            var self = $5173;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5175 = self.term;
                                    var $5176 = Kind$Term$inline$reduce$($5175, _defs$2);
                                    var $5174 = $5176;
                                    break;
                            };
                            var $5172 = $5174;
                            break;
                        case 'Maybe.none':
                            var $5177 = Kind$Term$ref$($5170);
                            var $5172 = $5177;
                            break;
                    };
                    var $5171 = $5172;
                } else {
                    var $5178 = _term$1;
                    var $5171 = $5178;
                };
                var $5169 = $5171;
                break;
            case 'Kind.Term.app':
                var $5179 = self.func;
                var $5180 = self.argm;
                var _func$5 = Kind$Term$inline$reduce$($5179, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $5182 = self.body;
                        var $5183 = Kind$Term$inline$reduce$($5182($5180), _defs$2);
                        var $5181 = $5183;
                        break;
                    case 'Kind.Term.let':
                        var $5184 = self.name;
                        var $5185 = self.expr;
                        var $5186 = self.body;
                        var $5187 = Kind$Term$let$($5184, $5185, (_x$9 => {
                            var $5188 = Kind$Term$inline$reduce$(Kind$Term$app$($5186(_x$9), $5180), _defs$2);
                            return $5188;
                        }));
                        var $5181 = $5187;
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
                        var $5189 = _term$1;
                        var $5181 = $5189;
                        break;
                };
                var $5169 = $5181;
                break;
            case 'Kind.Term.ori':
                var $5190 = self.expr;
                var $5191 = Kind$Term$inline$reduce$($5190, _defs$2);
                var $5169 = $5191;
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
                var $5192 = _term$1;
                var $5169 = $5192;
                break;
        };
        return $5169;
    };
    const Kind$Term$inline$reduce = x0 => x1 => Kind$Term$inline$reduce$(x0, x1);

    function Kind$Term$inline$(_term$1, _defs$2) {
        var self = Kind$Term$inline$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $5194 = self.name;
                var $5195 = self.indx;
                var $5196 = Kind$Term$var$($5194, $5195);
                var $5193 = $5196;
                break;
            case 'Kind.Term.ref':
                var $5197 = self.name;
                var $5198 = Kind$Term$ref$($5197);
                var $5193 = $5198;
                break;
            case 'Kind.Term.all':
                var $5199 = self.eras;
                var $5200 = self.self;
                var $5201 = self.name;
                var $5202 = self.xtyp;
                var $5203 = self.body;
                var $5204 = Kind$Term$all$($5199, $5200, $5201, Kind$Term$inline$($5202, _defs$2), (_s$8 => _x$9 => {
                    var $5205 = Kind$Term$inline$($5203(_s$8)(_x$9), _defs$2);
                    return $5205;
                }));
                var $5193 = $5204;
                break;
            case 'Kind.Term.lam':
                var $5206 = self.name;
                var $5207 = self.body;
                var $5208 = Kind$Term$lam$($5206, (_x$5 => {
                    var $5209 = Kind$Term$inline$($5207(_x$5), _defs$2);
                    return $5209;
                }));
                var $5193 = $5208;
                break;
            case 'Kind.Term.app':
                var $5210 = self.func;
                var $5211 = self.argm;
                var $5212 = Kind$Term$app$(Kind$Term$inline$($5210, _defs$2), Kind$Term$inline$($5211, _defs$2));
                var $5193 = $5212;
                break;
            case 'Kind.Term.let':
                var $5213 = self.name;
                var $5214 = self.expr;
                var $5215 = self.body;
                var $5216 = Kind$Term$let$($5213, Kind$Term$inline$($5214, _defs$2), (_x$6 => {
                    var $5217 = Kind$Term$inline$($5215(_x$6), _defs$2);
                    return $5217;
                }));
                var $5193 = $5216;
                break;
            case 'Kind.Term.def':
                var $5218 = self.name;
                var $5219 = self.expr;
                var $5220 = self.body;
                var $5221 = Kind$Term$def$($5218, Kind$Term$inline$($5219, _defs$2), (_x$6 => {
                    var $5222 = Kind$Term$inline$($5220(_x$6), _defs$2);
                    return $5222;
                }));
                var $5193 = $5221;
                break;
            case 'Kind.Term.ann':
                var $5223 = self.done;
                var $5224 = self.term;
                var $5225 = self.type;
                var $5226 = Kind$Term$ann$($5223, Kind$Term$inline$($5224, _defs$2), Kind$Term$inline$($5225, _defs$2));
                var $5193 = $5226;
                break;
            case 'Kind.Term.gol':
                var $5227 = self.name;
                var $5228 = self.dref;
                var $5229 = self.verb;
                var $5230 = Kind$Term$gol$($5227, $5228, $5229);
                var $5193 = $5230;
                break;
            case 'Kind.Term.hol':
                var $5231 = self.path;
                var $5232 = Kind$Term$hol$($5231);
                var $5193 = $5232;
                break;
            case 'Kind.Term.nat':
                var $5233 = self.natx;
                var $5234 = Kind$Term$nat$($5233);
                var $5193 = $5234;
                break;
            case 'Kind.Term.chr':
                var $5235 = self.chrx;
                var $5236 = Kind$Term$chr$($5235);
                var $5193 = $5236;
                break;
            case 'Kind.Term.str':
                var $5237 = self.strx;
                var $5238 = Kind$Term$str$($5237);
                var $5193 = $5238;
                break;
            case 'Kind.Term.ori':
                var $5239 = self.expr;
                var $5240 = Kind$Term$inline$($5239, _defs$2);
                var $5193 = $5240;
                break;
            case 'Kind.Term.typ':
                var $5241 = Kind$Term$typ;
                var $5193 = $5241;
                break;
            case 'Kind.Term.cse':
                var $5242 = _term$1;
                var $5193 = $5242;
                break;
        };
        return $5193;
    };
    const Kind$Term$inline = x0 => x1 => Kind$Term$inline$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5244 = self.val;
                var $5245 = self.lft;
                var $5246 = self.rgt;
                var self = $5244;
                switch (self._) {
                    case 'Maybe.some':
                        var $5248 = self.value;
                        var $5249 = List$cons$($5248, _list$3);
                        var _list0$7 = $5249;
                        break;
                    case 'Maybe.none':
                        var $5250 = _list$3;
                        var _list0$7 = $5250;
                        break;
                };
                var _list1$8 = Map$values$go$($5245, _list0$7);
                var _list2$9 = Map$values$go$($5246, _list1$8);
                var $5247 = _list2$9;
                var $5243 = $5247;
                break;
            case 'Map.new':
                var $5251 = _list$3;
                var $5243 = $5251;
                break;
        };
        return $5243;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $5252 = Map$values$go$(_xs$2, List$nil);
        return $5252;
    };
    const Map$values = x0 => Map$values$(x0);

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
                        var $5254 = _name$2;
                        var $5253 = $5254;
                    } else {
                        var $5255 = (self - 1n);
                        var $5256 = (_name$2 + ("^" + Nat$show$(_brui$3)));
                        var $5253 = $5256;
                    };
                    return $5253;
                } else {
                    var $5257 = (self - 1n);
                    var self = _vars$4;
                    switch (self._) {
                        case 'List.cons':
                            var $5259 = self.head;
                            var $5260 = self.tail;
                            var self = (_name$2 === $5259);
                            if (self) {
                                var $5262 = Nat$succ$(_brui$3);
                                var _brui$8 = $5262;
                            } else {
                                var $5263 = _brui$3;
                                var _brui$8 = $5263;
                            };
                            var $5261 = Kind$Core$var_name$($5257, _name$2, _brui$8, $5260);
                            var $5258 = $5261;
                            break;
                        case 'List.nil':
                            var $5264 = "unbound";
                            var $5258 = $5264;
                            break;
                    };
                    return $5258;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Core$var_name = x0 => x1 => x2 => x3 => Kind$Core$var_name$(x0, x1, x2, x3);

    function Kind$Name$show$(_name$1) {
        var $5265 = _name$1;
        return $5265;
    };
    const Kind$Name$show = x0 => Kind$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5267 = self.slice(0, -1);
                var $5268 = (2n * Bits$to_nat$($5267));
                var $5266 = $5268;
                break;
            case 'i':
                var $5269 = self.slice(0, -1);
                var $5270 = Nat$succ$((2n * Bits$to_nat$($5269)));
                var $5266 = $5270;
                break;
            case 'e':
                var $5271 = 0n;
                var $5266 = $5271;
                break;
        };
        return $5266;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $5273 = u16_to_word(self);
                var $5274 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($5273)));
                var $5272 = $5274;
                break;
        };
        return $5272;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Kind$escape$char$(_chr$1) {
        var self = (_chr$1 === Kind$backslash);
        if (self) {
            var $5276 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
            var $5275 = $5276;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $5278 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                var $5277 = $5278;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $5280 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                    var $5279 = $5280;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $5282 = String$cons$(_chr$1, String$nil);
                        var $5281 = $5282;
                    } else {
                        var $5283 = String$flatten$(List$cons$(String$cons$(Kind$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $5281 = $5283;
                    };
                    var $5279 = $5281;
                };
                var $5277 = $5279;
            };
            var $5275 = $5277;
        };
        return $5275;
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
                    var $5284 = String$reverse$(_result$2);
                    return $5284;
                } else {
                    var $5285 = self.charCodeAt(0);
                    var $5286 = self.slice(1);
                    var $5287 = Kind$escape$go$($5286, (String$reverse$(Kind$escape$char$($5285)) + _result$2));
                    return $5287;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$escape$go = x0 => x1 => Kind$escape$go$(x0, x1);

    function Kind$escape$(_str$1) {
        var $5288 = Kind$escape$go$(_str$1, "");
        return $5288;
    };
    const Kind$escape = x0 => Kind$escape$(x0);

    function Kind$Core$show$(_term$1, _indx$2, _vars$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5290 = self.name;
                var $5291 = self.indx;
                var $5292 = Kind$Core$var_name$(Nat$pred$((_indx$2 - $5291 <= 0n ? 0n : _indx$2 - $5291)), $5290, 0n, _vars$3);
                var $5289 = $5292;
                break;
            case 'Kind.Term.ref':
                var $5293 = self.name;
                var $5294 = Kind$Name$show$($5293);
                var $5289 = $5294;
                break;
            case 'Kind.Term.all':
                var $5295 = self.eras;
                var $5296 = self.self;
                var $5297 = self.name;
                var $5298 = self.xtyp;
                var $5299 = self.body;
                var _eras$9 = $5295;
                var self = _eras$9;
                if (self) {
                    var $5301 = "%";
                    var _init$10 = $5301;
                } else {
                    var $5302 = "@";
                    var _init$10 = $5302;
                };
                var _self$11 = Kind$Name$show$($5296);
                var _name$12 = Kind$Name$show$($5297);
                var _xtyp$13 = Kind$Core$show$($5298, _indx$2, _vars$3);
                var _body$14 = Kind$Core$show$($5299(Kind$Term$var$($5296, _indx$2))(Kind$Term$var$($5297, Nat$succ$(_indx$2))), Nat$succ$(Nat$succ$(_indx$2)), List$cons$($5297, List$cons$($5296, _vars$3)));
                var $5300 = String$flatten$(List$cons$(_init$10, List$cons$(_self$11, List$cons$("(", List$cons$(_name$12, List$cons$(":", List$cons$(_xtyp$13, List$cons$(") ", List$cons$(_body$14, List$nil)))))))));
                var $5289 = $5300;
                break;
            case 'Kind.Term.lam':
                var $5303 = self.name;
                var $5304 = self.body;
                var _name$6 = Kind$Name$show$($5303);
                var _body$7 = Kind$Core$show$($5304(Kind$Term$var$($5303, _indx$2)), Nat$succ$(_indx$2), List$cons$($5303, _vars$3));
                var $5305 = String$flatten$(List$cons$("#", List$cons$(_name$6, List$cons$(" ", List$cons$(_body$7, List$nil)))));
                var $5289 = $5305;
                break;
            case 'Kind.Term.app':
                var $5306 = self.func;
                var $5307 = self.argm;
                var _func$6 = Kind$Core$show$($5306, _indx$2, _vars$3);
                var _argm$7 = Kind$Core$show$($5307, _indx$2, _vars$3);
                var $5308 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(" ", List$cons$(_argm$7, List$cons$(")", List$nil))))));
                var $5289 = $5308;
                break;
            case 'Kind.Term.let':
                var $5309 = self.name;
                var $5310 = self.expr;
                var $5311 = self.body;
                var _name$7 = Kind$Name$show$($5309);
                var _expr$8 = Kind$Core$show$($5310, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5311(Kind$Term$var$($5309, _indx$2)), Nat$succ$(_indx$2), List$cons$($5309, _vars$3));
                var $5312 = String$flatten$(List$cons$("!", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5289 = $5312;
                break;
            case 'Kind.Term.def':
                var $5313 = self.name;
                var $5314 = self.expr;
                var $5315 = self.body;
                var _name$7 = Kind$Name$show$($5313);
                var _expr$8 = Kind$Core$show$($5314, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5315(Kind$Term$var$($5313, _indx$2)), Nat$succ$(_indx$2), List$cons$($5313, _vars$3));
                var $5316 = String$flatten$(List$cons$("$", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5289 = $5316;
                break;
            case 'Kind.Term.ann':
                var $5317 = self.term;
                var $5318 = self.type;
                var _term$7 = Kind$Core$show$($5317, _indx$2, _vars$3);
                var _type$8 = Kind$Core$show$($5318, _indx$2, _vars$3);
                var $5319 = String$flatten$(List$cons$("{", List$cons$(_term$7, List$cons$(":", List$cons$(_type$8, List$cons$("}", List$nil))))));
                var $5289 = $5319;
                break;
            case 'Kind.Term.nat':
                var $5320 = self.natx;
                var $5321 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($5320), List$nil)));
                var $5289 = $5321;
                break;
            case 'Kind.Term.chr':
                var $5322 = self.chrx;
                var $5323 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5322), List$cons$("\'", List$nil))));
                var $5289 = $5323;
                break;
            case 'Kind.Term.str':
                var $5324 = self.strx;
                var $5325 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5324), List$cons$("\"", List$nil))));
                var $5289 = $5325;
                break;
            case 'Kind.Term.ori':
                var $5326 = self.expr;
                var $5327 = Kind$Core$show$($5326, _indx$2, _vars$3);
                var $5289 = $5327;
                break;
            case 'Kind.Term.typ':
                var $5328 = "*";
                var $5289 = $5328;
                break;
            case 'Kind.Term.gol':
                var $5329 = "<GOL>";
                var $5289 = $5329;
                break;
            case 'Kind.Term.hol':
                var $5330 = "<HOL>";
                var $5289 = $5330;
                break;
            case 'Kind.Term.cse':
                var $5331 = "<CSE>";
                var $5289 = $5331;
                break;
        };
        return $5289;
    };
    const Kind$Core$show = x0 => x1 => x2 => Kind$Core$show$(x0, x1, x2);

    function Kind$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $5334 = _result$2;
            var $5335 = Map$values$(_defs$1);
            let _result$4 = $5334;
            let _defn$3;
            while ($5335._ === 'List.cons') {
                _defn$3 = $5335.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5336 = self.name;
                        var $5337 = self.term;
                        var $5338 = self.type;
                        var $5339 = self.stat;
                        var self = $5339;
                        switch (self._) {
                            case 'Kind.Status.init':
                            case 'Kind.Status.wait':
                            case 'Kind.Status.fail':
                                var $5341 = _result$4;
                                var $5340 = $5341;
                                break;
                            case 'Kind.Status.done':
                                var _name$14 = $5336;
                                var _term$15 = Kind$Core$show$($5337, 0n, List$nil);
                                var _type$16 = Kind$Core$show$($5338, 0n, List$nil);
                                var $5342 = String$flatten$(List$cons$(_result$4, List$cons$(_name$14, List$cons$(" : ", List$cons$(_type$16, List$cons$(" = ", List$cons$(_term$15, List$cons$(";\u{a}", List$nil))))))));
                                var $5340 = $5342;
                                break;
                        };
                        var $5334 = $5340;
                        break;
                };
                _result$4 = $5334;
                $5335 = $5335.tail;
            }
            return _result$4;
        })();
        var $5332 = _result$3;
        return $5332;
    };
    const Kind$Defs$core = x0 => Kind$Defs$core$(x0);

    function Kind$to_core$io$one$(_name$1) {
        var $5343 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5344 = _m$bind$2;
            return $5344;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5346 = self.value;
                    var $5347 = $5346;
                    var _defs$3 = $5347;
                    break;
                case 'Maybe.none':
                    var $5348 = Map$new;
                    var _defs$3 = $5348;
                    break;
            };
            var _defs$4 = Map$map$((_defn$4 => {
                var self = _defn$4;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5350 = self.file;
                        var $5351 = self.code;
                        var $5352 = self.orig;
                        var $5353 = self.name;
                        var $5354 = self.term;
                        var $5355 = self.type;
                        var $5356 = self.isct;
                        var $5357 = self.arit;
                        var $5358 = self.stat;
                        var _term$14 = Kind$Term$inline$($5354, _defs$3);
                        var _type$15 = Kind$Term$inline$($5355, _defs$3);
                        var $5359 = Kind$Def$new$($5350, $5351, $5352, $5353, _term$14, _type$15, $5356, $5357, $5358);
                        var $5349 = $5359;
                        break;
                };
                return $5349;
            }), _defs$3);
            var $5345 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                var $5360 = _m$pure$6;
                return $5360;
            }))(Kind$Defs$core$(_defs$4));
            return $5345;
        }));
        return $5343;
    };
    const Kind$to_core$io$one = x0 => Kind$to_core$io$one$(x0);

    function IO$put_string$(_text$1) {
        var $5361 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $5362 = IO$end$(Unit$new);
            return $5362;
        }));
        return $5361;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $5363 = IO$put_string$((_text$1 + "\u{a}"));
        return $5363;
    };
    const IO$print = x0 => IO$print$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $5365 = self.value;
                var $5366 = _f$4($5365);
                var $5364 = $5366;
                break;
            case 'Maybe.none':
                var $5367 = Maybe$none;
                var $5364 = $5367;
                break;
        };
        return $5364;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $5368 = _new$2(Maybe$bind)(Maybe$some);
        return $5368;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Kind$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5370 = self.name;
                var self = ($5370 === "Nat.zero");
                if (self) {
                    var $5372 = Maybe$some$(0n);
                    var $5371 = $5372;
                } else {
                    var $5373 = Maybe$none;
                    var $5371 = $5373;
                };
                var $5369 = $5371;
                break;
            case 'Kind.Term.app':
                var $5374 = self.func;
                var $5375 = self.argm;
                var self = $5374;
                switch (self._) {
                    case 'Kind.Term.ref':
                        var $5377 = self.name;
                        var self = ($5377 === "Nat.succ");
                        if (self) {
                            var $5379 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $5380 = _m$bind$5;
                                return $5380;
                            }))(Kind$Term$show$as_nat$go$($5375))((_pred$5 => {
                                var $5381 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $5382 = _m$pure$7;
                                    return $5382;
                                }))(Nat$succ$(_pred$5));
                                return $5381;
                            }));
                            var $5378 = $5379;
                        } else {
                            var $5383 = Maybe$none;
                            var $5378 = $5383;
                        };
                        var $5376 = $5378;
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
                        var $5384 = Maybe$none;
                        var $5376 = $5384;
                        break;
                };
                var $5369 = $5376;
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
                var $5385 = Maybe$none;
                var $5369 = $5385;
                break;
        };
        return $5369;
    };
    const Kind$Term$show$as_nat$go = x0 => Kind$Term$show$as_nat$go$(x0);

    function Kind$Term$show$as_nat$(_term$1) {
        var $5386 = Maybe$mapped$(Kind$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5386;
    };
    const Kind$Term$show$as_nat = x0 => Kind$Term$show$as_nat$(x0);

    function Kind$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5388 = self.name;
                var $5389 = (_name$2 === $5388);
                var $5387 = $5389;
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
                var $5390 = Bool$false;
                var $5387 = $5390;
                break;
        };
        return $5387;
    };
    const Kind$Term$show$is_ref = x0 => x1 => Kind$Term$show$is_ref$(x0, x1);

    function Kind$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Kind$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $5392 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $5391 = $5392;
        } else {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $5394 = Bool$false;
                var _wrap$6 = $5394;
            } else {
                var $5395 = self.charCodeAt(0);
                var $5396 = self.slice(1);
                var $5397 = ($5395 === 40);
                var _wrap$6 = $5397;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $5398 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $5398;
            } else {
                var $5399 = _func$5;
                var _func$8 = $5399;
            };
            var $5393 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $5391 = $5393;
        };
        return $5391;
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
                        var $5400 = self.func;
                        var $5401 = self.argm;
                        var $5402 = Kind$Term$show$app$($5400, Kind$MPath$o$(_path$2), List$cons$(Kind$Term$show$go$($5401, Kind$MPath$i$(_path$2)), _args$3));
                        return $5402;
                    case 'Kind.Term.ori':
                        var $5403 = self.expr;
                        var $5404 = Kind$Term$show$app$($5403, _path$2, _args$3);
                        return $5404;
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
                        var $5405 = Kind$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $5405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Term$show$app = x0 => x1 => x2 => Kind$Term$show$app$(x0, x1, x2);

    function Map$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5407 = self.val;
                var $5408 = self.lft;
                var $5409 = self.rgt;
                var self = $5407;
                switch (self._) {
                    case 'Maybe.some':
                        var $5411 = self.value;
                        var $5412 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5411), _list$4);
                        var _list0$8 = $5412;
                        break;
                    case 'Maybe.none':
                        var $5413 = _list$4;
                        var _list0$8 = $5413;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5408, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5409, (_key$3 + '1'), _list1$9);
                var $5410 = _list2$10;
                var $5406 = $5410;
                break;
            case 'Map.new':
                var $5414 = _list$4;
                var $5406 = $5414;
                break;
        };
        return $5406;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5415 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5415;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5417 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5419 = List$cons$(_head$6, _tail$7);
                    var $5418 = $5419;
                } else {
                    var $5420 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5421 = Bits$chunks_of$go$(_len$1, $5417, $5420, _chunk$7);
                    var $5418 = $5421;
                };
                var $5416 = $5418;
                break;
            case 'i':
                var $5422 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5424 = List$cons$(_head$6, _tail$7);
                    var $5423 = $5424;
                } else {
                    var $5425 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5426 = Bits$chunks_of$go$(_len$1, $5422, $5425, _chunk$7);
                    var $5423 = $5426;
                };
                var $5416 = $5423;
                break;
            case 'e':
                var $5427 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5416 = $5427;
                break;
        };
        return $5416;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5428 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5428;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5430 = Word$e;
            var $5429 = $5430;
        } else {
            var $5431 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $5433 = self.slice(0, -1);
                    var $5434 = Word$o$(Word$from_bits$($5431, $5433));
                    var $5432 = $5434;
                    break;
                case 'i':
                    var $5435 = self.slice(0, -1);
                    var $5436 = Word$i$(Word$from_bits$($5431, $5435));
                    var $5432 = $5436;
                    break;
                case 'e':
                    var $5437 = Word$o$(Word$from_bits$($5431, Bits$e));
                    var $5432 = $5437;
                    break;
            };
            var $5429 = $5432;
        };
        return $5429;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Kind$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5440 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5440;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5442 = ((_u16$5 + 71) & 0xFFFF);
                    var $5441 = $5442;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5444 = (Math.max(_u16$5 - 4, 0));
                        var $5443 = $5444;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5446 = 46;
                            var $5445 = $5446;
                        } else {
                            var $5447 = 95;
                            var $5445 = $5447;
                        };
                        var $5443 = $5445;
                    };
                    var $5441 = $5443;
                };
                var _chr$6 = $5441;
            };
            var $5439 = String$cons$(_chr$6, _name$4);
            return $5439;
        }));
        var $5438 = _name$3;
        return $5438;
    };
    const Kind$Name$from_bits = x0 => Kind$Name$from_bits$(x0);

    function Kind$Term$show$go$(_term$1, _path$2) {
        var self = Kind$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.some':
                var $5449 = self.value;
                var $5450 = $5449;
                var $5448 = $5450;
                break;
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $5452 = self.name;
                        var $5453 = Kind$Name$show$($5452);
                        var $5451 = $5453;
                        break;
                    case 'Kind.Term.ref':
                        var $5454 = self.name;
                        var _name$4 = Kind$Name$show$($5454);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5456 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Kind$Path$to_bits$($5456));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5457 = String$flatten$(List$cons$(_name$4, List$cons$(Kind$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5455 = $5457;
                                break;
                            case 'Maybe.none':
                                var $5458 = _name$4;
                                var $5455 = $5458;
                                break;
                        };
                        var $5451 = $5455;
                        break;
                    case 'Kind.Term.all':
                        var $5459 = self.eras;
                        var $5460 = self.self;
                        var $5461 = self.name;
                        var $5462 = self.xtyp;
                        var $5463 = self.body;
                        var _eras$8 = $5459;
                        var _self$9 = Kind$Name$show$($5460);
                        var _name$10 = Kind$Name$show$($5461);
                        var _type$11 = Kind$Term$show$go$($5462, Kind$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5465 = "<";
                            var _open$12 = $5465;
                        } else {
                            var $5466 = "(";
                            var _open$12 = $5466;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5467 = ">";
                            var _clos$13 = $5467;
                        } else {
                            var $5468 = ")";
                            var _clos$13 = $5468;
                        };
                        var _body$14 = Kind$Term$show$go$($5463(Kind$Term$var$($5460, 0n))(Kind$Term$var$($5461, 0n)), Kind$MPath$i$(_path$2));
                        var $5464 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5451 = $5464;
                        break;
                    case 'Kind.Term.lam':
                        var $5469 = self.name;
                        var $5470 = self.body;
                        var _name$5 = Kind$Name$show$($5469);
                        var _body$6 = Kind$Term$show$go$($5470(Kind$Term$var$($5469, 0n)), Kind$MPath$o$(_path$2));
                        var $5471 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5451 = $5471;
                        break;
                    case 'Kind.Term.let':
                        var $5472 = self.name;
                        var $5473 = self.expr;
                        var $5474 = self.body;
                        var _name$6 = Kind$Name$show$($5472);
                        var _expr$7 = Kind$Term$show$go$($5473, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5474(Kind$Term$var$($5472, 0n)), Kind$MPath$i$(_path$2));
                        var $5475 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5451 = $5475;
                        break;
                    case 'Kind.Term.def':
                        var $5476 = self.name;
                        var $5477 = self.expr;
                        var $5478 = self.body;
                        var _name$6 = Kind$Name$show$($5476);
                        var _expr$7 = Kind$Term$show$go$($5477, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5478(Kind$Term$var$($5476, 0n)), Kind$MPath$i$(_path$2));
                        var $5479 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5451 = $5479;
                        break;
                    case 'Kind.Term.ann':
                        var $5480 = self.term;
                        var $5481 = self.type;
                        var _term$6 = Kind$Term$show$go$($5480, Kind$MPath$o$(_path$2));
                        var _type$7 = Kind$Term$show$go$($5481, Kind$MPath$i$(_path$2));
                        var $5482 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5451 = $5482;
                        break;
                    case 'Kind.Term.gol':
                        var $5483 = self.name;
                        var _name$6 = Kind$Name$show$($5483);
                        var $5484 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5451 = $5484;
                        break;
                    case 'Kind.Term.nat':
                        var $5485 = self.natx;
                        var $5486 = String$flatten$(List$cons$(Nat$show$($5485), List$nil));
                        var $5451 = $5486;
                        break;
                    case 'Kind.Term.chr':
                        var $5487 = self.chrx;
                        var $5488 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5487), List$cons$("\'", List$nil))));
                        var $5451 = $5488;
                        break;
                    case 'Kind.Term.str':
                        var $5489 = self.strx;
                        var $5490 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5489), List$cons$("\"", List$nil))));
                        var $5451 = $5490;
                        break;
                    case 'Kind.Term.cse':
                        var $5491 = self.expr;
                        var $5492 = self.name;
                        var $5493 = self.with;
                        var $5494 = self.cses;
                        var $5495 = self.moti;
                        var _expr$9 = Kind$Term$show$go$($5491, Kind$MPath$o$(_path$2));
                        var _name$10 = Kind$Name$show$($5492);
                        var _wyth$11 = String$join$("", List$mapped$($5493, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5498 = self.name;
                                    var $5499 = self.term;
                                    var $5500 = self.type;
                                    var _name$21 = Kind$Name$show$($5498);
                                    var _type$22 = Kind$Term$show$go$($5500, Maybe$none);
                                    var _term$23 = Kind$Term$show$go$($5499, Maybe$none);
                                    var $5501 = String$flatten$(List$cons$(_name$21, List$cons$(": ", List$cons$(_type$22, List$cons$(" = ", List$cons$(_term$23, List$cons$(";", List$nil)))))));
                                    var $5497 = $5501;
                                    break;
                            };
                            return $5497;
                        })));
                        var _cses$12 = Map$to_list$($5494);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Kind$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Kind$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5502 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5502;
                        })));
                        var self = $5495;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5503 = self.value;
                                var $5504 = String$flatten$(List$cons$(": ", List$cons$(Kind$Term$show$go$($5503, Maybe$none), List$nil)));
                                var _moti$14 = $5504;
                                break;
                            case 'Maybe.none':
                                var $5505 = "";
                                var _moti$14 = $5505;
                                break;
                        };
                        var $5496 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5451 = $5496;
                        break;
                    case 'Kind.Term.ori':
                        var $5506 = self.expr;
                        var $5507 = Kind$Term$show$go$($5506, _path$2);
                        var $5451 = $5507;
                        break;
                    case 'Kind.Term.typ':
                        var $5508 = "Type";
                        var $5451 = $5508;
                        break;
                    case 'Kind.Term.app':
                        var $5509 = Kind$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5451 = $5509;
                        break;
                    case 'Kind.Term.hol':
                        var $5510 = "_";
                        var $5451 = $5510;
                        break;
                };
                var $5448 = $5451;
                break;
        };
        return $5448;
    };
    const Kind$Term$show$go = x0 => x1 => Kind$Term$show$go$(x0, x1);

    function Kind$Term$show$(_term$1) {
        var $5511 = Kind$Term$show$go$(_term$1, Maybe$none);
        return $5511;
    };
    const Kind$Term$show = x0 => Kind$Term$show$(x0);

    function Kind$Defs$report$types$(_defs$1, _names$2) {
        var _types$3 = "";
        var _types$4 = (() => {
            var $5514 = _types$3;
            var $5515 = _names$2;
            let _types$5 = $5514;
            let _name$4;
            while ($5515._ === 'List.cons') {
                _name$4 = $5515.head;
                var self = Kind$get$(_name$4, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5516 = self.value;
                        var self = $5516;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5518 = self.type;
                                var $5519 = (_types$5 + (_name$4 + (": " + (Kind$Term$show$($5518) + "\u{a}"))));
                                var $5517 = $5519;
                                break;
                        };
                        var $5514 = $5517;
                        break;
                    case 'Maybe.none':
                        var $5520 = _types$5;
                        var $5514 = $5520;
                        break;
                };
                _types$5 = $5514;
                $5515 = $5515.tail;
            }
            return _types$5;
        })();
        var $5512 = _types$4;
        return $5512;
    };
    const Kind$Defs$report$types = x0 => x1 => Kind$Defs$report$types$(x0, x1);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5522 = self.val;
                var $5523 = self.lft;
                var $5524 = self.rgt;
                var self = $5522;
                switch (self._) {
                    case 'Maybe.none':
                        var $5526 = _list$4;
                        var _list0$8 = $5526;
                        break;
                    case 'Maybe.some':
                        var $5527 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5527;
                        break;
                };
                var _list1$9 = Map$keys$go$($5523, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5524, (_key$3 + '1'), _list1$9);
                var $5525 = _list2$10;
                var $5521 = $5525;
                break;
            case 'Map.new':
                var $5528 = _list$4;
                var $5521 = $5528;
                break;
        };
        return $5521;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5529 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5529;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Kind$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.cons':
                var $5531 = self.head;
                var $5532 = self.tail;
                var self = $5531;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                    case 'Kind.Error.cant_infer':
                        var $5534 = (!_got$2);
                        var _keep$5 = $5534;
                        break;
                    case 'Kind.Error.show_goal':
                        var $5535 = Bool$true;
                        var _keep$5 = $5535;
                        break;
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                        var $5536 = Bool$false;
                        var _keep$5 = $5536;
                        break;
                };
                var self = $5531;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                        var $5537 = Bool$true;
                        var _got$6 = $5537;
                        break;
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                    case 'Kind.Error.cant_infer':
                        var $5538 = _got$2;
                        var _got$6 = $5538;
                        break;
                };
                var _tail$7 = Kind$Error$relevant$($5532, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5539 = List$cons$($5531, _tail$7);
                    var $5533 = $5539;
                } else {
                    var $5540 = _tail$7;
                    var $5533 = $5540;
                };
                var $5530 = $5533;
                break;
            case 'List.nil':
                var $5541 = List$nil;
                var $5530 = $5541;
                break;
        };
        return $5530;
    };
    const Kind$Error$relevant = x0 => x1 => Kind$Error$relevant$(x0, x1);

    function Kind$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.cons':
                var $5543 = self.head;
                var $5544 = self.tail;
                var self = $5543;
                switch (self._) {
                    case 'Pair.new':
                        var $5546 = self.fst;
                        var $5547 = self.snd;
                        var _name$6 = Kind$Name$show$($5546);
                        var _type$7 = Kind$Term$show$(Kind$Term$normalize$($5547, Map$new));
                        var _rest$8 = Kind$Context$show$($5544);
                        var $5548 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5545 = $5548;
                        break;
                };
                var $5542 = $5545;
                break;
            case 'List.nil':
                var $5549 = "";
                var $5542 = $5549;
                break;
        };
        return $5542;
    };
    const Kind$Context$show = x0 => Kind$Context$show$(x0);

    function Kind$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5550 = Kind$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Kind.Term.ref':
                    var $5552 = self.name;
                    var self = Kind$get$($5552, _defs$3);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5554 = self.value;
                            var self = $5554;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5556 = self.term;
                                    var $5557 = $5556;
                                    var $5555 = $5557;
                                    break;
                            };
                            var $5553 = $5555;
                            break;
                        case 'Maybe.none':
                            var $5558 = Kind$Term$ref$($5552);
                            var $5553 = $5558;
                            break;
                    };
                    var $5551 = $5553;
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
                    var $5559 = _term$4;
                    var $5551 = $5559;
                    break;
            };
            return $5551;
        }));
        return $5550;
    };
    const Kind$Term$expand_at = x0 => x1 => x2 => Kind$Term$expand_at$(x0, x1, x2);

    function Kind$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5561 = self.name;
                var $5562 = self.indx;
                var $5563 = Kind$Term$var$($5561, $5562);
                var $5560 = $5563;
                break;
            case 'Kind.Term.ref':
                var $5564 = self.name;
                var self = Kind$get$($5564, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $5566 = self.value;
                        var self = $5566;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5568 = self.term;
                                var $5569 = self.isct;
                                var $5570 = self.arit;
                                var self = ($5569 && (_arity$3 > $5570));
                                if (self) {
                                    var $5572 = $5568;
                                    var $5571 = $5572;
                                } else {
                                    var $5573 = Kind$Term$ref$($5564);
                                    var $5571 = $5573;
                                };
                                var $5567 = $5571;
                                break;
                        };
                        var $5565 = $5567;
                        break;
                    case 'Maybe.none':
                        var $5574 = Kind$Term$ref$($5564);
                        var $5565 = $5574;
                        break;
                };
                var $5560 = $5565;
                break;
            case 'Kind.Term.all':
                var $5575 = self.eras;
                var $5576 = self.self;
                var $5577 = self.name;
                var $5578 = self.xtyp;
                var $5579 = self.body;
                var $5580 = Kind$Term$all$($5575, $5576, $5577, Kind$Term$expand_ct$($5578, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5581 = Kind$Term$expand_ct$($5579(_s$9)(_x$10), _defs$2, 0n);
                    return $5581;
                }));
                var $5560 = $5580;
                break;
            case 'Kind.Term.lam':
                var $5582 = self.name;
                var $5583 = self.body;
                var $5584 = Kind$Term$lam$($5582, (_x$6 => {
                    var $5585 = Kind$Term$expand_ct$($5583(_x$6), _defs$2, 0n);
                    return $5585;
                }));
                var $5560 = $5584;
                break;
            case 'Kind.Term.app':
                var $5586 = self.func;
                var $5587 = self.argm;
                var $5588 = Kind$Term$app$(Kind$Term$expand_ct$($5586, _defs$2, Nat$succ$(_arity$3)), Kind$Term$expand_ct$($5587, _defs$2, 0n));
                var $5560 = $5588;
                break;
            case 'Kind.Term.let':
                var $5589 = self.name;
                var $5590 = self.expr;
                var $5591 = self.body;
                var $5592 = Kind$Term$let$($5589, Kind$Term$expand_ct$($5590, _defs$2, 0n), (_x$7 => {
                    var $5593 = Kind$Term$expand_ct$($5591(_x$7), _defs$2, 0n);
                    return $5593;
                }));
                var $5560 = $5592;
                break;
            case 'Kind.Term.def':
                var $5594 = self.name;
                var $5595 = self.expr;
                var $5596 = self.body;
                var $5597 = Kind$Term$def$($5594, Kind$Term$expand_ct$($5595, _defs$2, 0n), (_x$7 => {
                    var $5598 = Kind$Term$expand_ct$($5596(_x$7), _defs$2, 0n);
                    return $5598;
                }));
                var $5560 = $5597;
                break;
            case 'Kind.Term.ann':
                var $5599 = self.done;
                var $5600 = self.term;
                var $5601 = self.type;
                var $5602 = Kind$Term$ann$($5599, Kind$Term$expand_ct$($5600, _defs$2, 0n), Kind$Term$expand_ct$($5601, _defs$2, 0n));
                var $5560 = $5602;
                break;
            case 'Kind.Term.gol':
                var $5603 = self.name;
                var $5604 = self.dref;
                var $5605 = self.verb;
                var $5606 = Kind$Term$gol$($5603, $5604, $5605);
                var $5560 = $5606;
                break;
            case 'Kind.Term.hol':
                var $5607 = self.path;
                var $5608 = Kind$Term$hol$($5607);
                var $5560 = $5608;
                break;
            case 'Kind.Term.nat':
                var $5609 = self.natx;
                var $5610 = Kind$Term$nat$($5609);
                var $5560 = $5610;
                break;
            case 'Kind.Term.chr':
                var $5611 = self.chrx;
                var $5612 = Kind$Term$chr$($5611);
                var $5560 = $5612;
                break;
            case 'Kind.Term.str':
                var $5613 = self.strx;
                var $5614 = Kind$Term$str$($5613);
                var $5560 = $5614;
                break;
            case 'Kind.Term.ori':
                var $5615 = self.orig;
                var $5616 = self.expr;
                var $5617 = Kind$Term$ori$($5615, $5616);
                var $5560 = $5617;
                break;
            case 'Kind.Term.typ':
                var $5618 = Kind$Term$typ;
                var $5560 = $5618;
                break;
            case 'Kind.Term.cse':
                var $5619 = _term$1;
                var $5560 = $5619;
                break;
        };
        return $5560;
    };
    const Kind$Term$expand_ct = x0 => x1 => x2 => Kind$Term$expand_ct$(x0, x1, x2);

    function Kind$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Kind$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5622 = _term$4;
            var $5623 = _dref$1;
            let _term$6 = $5622;
            let _path$5;
            while ($5623._ === 'List.cons') {
                _path$5 = $5623.head;
                var _term$7 = Kind$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Kind$Term$normalize$(_term$7, Map$new);
                var _term$9 = Kind$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Kind$Term$normalize$(_term$9, Map$new);
                var $5622 = _term$10;
                _term$6 = $5622;
                $5623 = $5623.tail;
            }
            return _term$6;
        })();
        var $5620 = _term$5;
        return $5620;
    };
    const Kind$Term$expand = x0 => x1 => x2 => Kind$Term$expand$(x0, x1, x2);

    function Kind$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5625 = self.expected;
                var $5626 = self.detected;
                var $5627 = self.context;
                var self = $5625;
                switch (self._) {
                    case 'Either.left':
                        var $5629 = self.value;
                        var $5630 = $5629;
                        var _expected$7 = $5630;
                        break;
                    case 'Either.right':
                        var $5631 = self.value;
                        var $5632 = Kind$Term$show$(Kind$Term$normalize$($5631, Map$new));
                        var _expected$7 = $5632;
                        break;
                };
                var self = $5626;
                switch (self._) {
                    case 'Either.left':
                        var $5633 = self.value;
                        var $5634 = $5633;
                        var _detected$8 = $5634;
                        break;
                    case 'Either.right':
                        var $5635 = self.value;
                        var $5636 = Kind$Term$show$(Kind$Term$normalize$($5635, Map$new));
                        var _detected$8 = $5636;
                        break;
                };
                var $5628 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5627;
                    switch (self._) {
                        case 'List.nil':
                            var $5637 = "";
                            return $5637;
                        case 'List.cons':
                            var $5638 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Kind$Context$show$($5627), List$nil)));
                            return $5638;
                    };
                })(), List$nil)))))))));
                var $5624 = $5628;
                break;
            case 'Kind.Error.show_goal':
                var $5639 = self.name;
                var $5640 = self.dref;
                var $5641 = self.verb;
                var $5642 = self.goal;
                var $5643 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Kind$Name$show$($5639), List$cons$(":\u{a}", List$nil))));
                var self = $5642;
                switch (self._) {
                    case 'Maybe.some':
                        var $5645 = self.value;
                        var _goal$10 = Kind$Term$expand$($5640, $5645, _defs$2);
                        var $5646 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5641;
                            if (self) {
                                var $5647 = Kind$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5648 = _x$11;
                                    return $5648;
                                })));
                                return $5647;
                            } else {
                                var $5649 = Kind$Term$show$(_goal$10);
                                return $5649;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5646;
                        break;
                    case 'Maybe.none':
                        var $5650 = "";
                        var _with_type$9 = $5650;
                        break;
                };
                var self = $5643;
                switch (self._) {
                    case 'List.nil':
                        var $5651 = "";
                        var _with_ctxt$10 = $5651;
                        break;
                    case 'List.cons':
                        var $5652 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Kind$Context$show$($5643), List$nil)));
                        var _with_ctxt$10 = $5652;
                        break;
                };
                var $5644 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5624 = $5644;
                break;
            case 'Kind.Error.waiting':
                var $5653 = self.name;
                var $5654 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5653, List$cons$("\'.", List$nil))));
                var $5624 = $5654;
                break;
            case 'Kind.Error.indirect':
                var $5655 = self.name;
                var $5656 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5655, List$cons$("\'.", List$nil))));
                var $5624 = $5656;
                break;
            case 'Kind.Error.patch':
                var $5657 = self.term;
                var $5658 = String$flatten$(List$cons$("Patching: ", List$cons$(Kind$Term$show$($5657), List$nil)));
                var $5624 = $5658;
                break;
            case 'Kind.Error.undefined_reference':
                var $5659 = self.name;
                var $5660 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Kind$Name$show$($5659), List$cons$("\u{a}", List$nil))));
                var $5624 = $5660;
                break;
            case 'Kind.Error.cant_infer':
                var $5661 = self.term;
                var $5662 = self.context;
                var _term$6 = Kind$Term$show$($5661);
                var _context$7 = Kind$Context$show$($5662);
                var $5663 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5624 = $5663;
                break;
        };
        return $5624;
    };
    const Kind$Error$show = x0 => x1 => Kind$Error$show$(x0, x1);

    function Kind$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5665 = self.origin;
                var $5666 = $5665;
                var $5664 = $5666;
                break;
            case 'Kind.Error.undefined_reference':
                var $5667 = self.origin;
                var $5668 = $5667;
                var $5664 = $5668;
                break;
            case 'Kind.Error.cant_infer':
                var $5669 = self.origin;
                var $5670 = $5669;
                var $5664 = $5670;
                break;
            case 'Kind.Error.show_goal':
            case 'Kind.Error.waiting':
            case 'Kind.Error.indirect':
            case 'Kind.Error.patch':
                var $5671 = Maybe$none;
                var $5664 = $5671;
                break;
        };
        return $5664;
    };
    const Kind$Error$origin = x0 => Kind$Error$origin$(x0);

    function Kind$Defs$report$errors$(_defs$1) {
        var _errors$2 = "";
        var _errors$3 = (() => {
            var $5674 = _errors$2;
            var $5675 = Map$keys$(_defs$1);
            let _errors$4 = $5674;
            let _key$3;
            while ($5675._ === 'List.cons') {
                _key$3 = $5675.head;
                var _name$5 = Kind$Name$from_bits$(_key$3);
                var self = Kind$get$(_name$5, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5676 = self.value;
                        var self = $5676;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5678 = self.file;
                                var $5679 = self.code;
                                var $5680 = self.name;
                                var $5681 = self.stat;
                                var self = $5681;
                                switch (self._) {
                                    case 'Kind.Status.fail':
                                        var $5683 = self.errors;
                                        var self = $5683;
                                        switch (self._) {
                                            case 'List.nil':
                                                var $5685 = _errors$4;
                                                var $5684 = $5685;
                                                break;
                                            case 'List.cons':
                                                var _name_str$19 = $5680;
                                                var _rel_errs$20 = Kind$Error$relevant$($5683, Bool$false);
                                                var _errors$21 = (() => {
                                                    var $5688 = _errors$4;
                                                    var $5689 = _rel_errs$20;
                                                    let _errors$22 = $5688;
                                                    let _err$21;
                                                    while ($5689._ === 'List.cons') {
                                                        _err$21 = $5689.head;
                                                        var _err_msg$23 = Kind$Error$show$(_err$21, _defs$1);
                                                        var self = Kind$Error$origin$(_err$21);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $5690 = self.value;
                                                                var self = $5690;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $5692 = self.fst;
                                                                        var $5693 = self.snd;
                                                                        var _inside$27 = ("Inside \'" + ($5678 + "\':\u{a}"));
                                                                        var _source$28 = Kind$highlight$($5679, $5692, $5693);
                                                                        var $5694 = (_inside$27 + (_source$28 + "\u{a}"));
                                                                        var $5691 = $5694;
                                                                        break;
                                                                };
                                                                var _ori_msg$24 = $5691;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $5695 = "";
                                                                var _ori_msg$24 = $5695;
                                                                break;
                                                        };
                                                        var $5688 = (_errors$22 + (_err_msg$23 + (_ori_msg$24 + "\u{a}")));
                                                        _errors$22 = $5688;
                                                        $5689 = $5689.tail;
                                                    }
                                                    return _errors$22;
                                                })();
                                                var $5686 = _errors$21;
                                                var $5684 = $5686;
                                                break;
                                        };
                                        var $5682 = $5684;
                                        break;
                                    case 'Kind.Status.init':
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $5696 = _errors$4;
                                        var $5682 = $5696;
                                        break;
                                };
                                var $5677 = $5682;
                                break;
                        };
                        var $5674 = $5677;
                        break;
                    case 'Maybe.none':
                        var $5697 = _errors$4;
                        var $5674 = $5697;
                        break;
                };
                _errors$4 = $5674;
                $5675 = $5675.tail;
            }
            return _errors$4;
        })();
        var $5672 = _errors$3;
        return $5672;
    };
    const Kind$Defs$report$errors = x0 => Kind$Defs$report$errors$(x0);

    function Kind$Defs$report$(_defs$1, _names$2) {
        var _types$3 = Kind$Defs$report$types$(_defs$1, _names$2);
        var _errors$4 = Kind$Defs$report$errors$(_defs$1);
        var self = _errors$4;
        if (self.length === 0) {
            var $5699 = "All terms check.";
            var _errors$5 = $5699;
        } else {
            var $5700 = self.charCodeAt(0);
            var $5701 = self.slice(1);
            var $5702 = _errors$4;
            var _errors$5 = $5702;
        };
        var $5698 = (_types$3 + ("\u{a}" + _errors$5));
        return $5698;
    };
    const Kind$Defs$report = x0 => x1 => Kind$Defs$report$(x0, x1);

    function Kind$checker$io$one$(_name$1) {
        var $5703 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5704 = _m$bind$2;
            return $5704;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5706 = self.value;
                    var $5707 = IO$print$(Kind$Defs$report$($5706, List$cons$(_name$1, List$nil)));
                    var $5705 = $5707;
                    break;
                case 'Maybe.none':
                    var _notfound$3 = ("Term not found: \'" + (_name$1 + "\'."));
                    var _filelist$4 = List$mapped$(Kind$Synth$files_of$(_name$1), (_x$4 => {
                        var $5709 = ("\'" + (_x$4 + "\'"));
                        return $5709;
                    }));
                    var _searched$5 = ("Searched on: " + (String$join$(", ", _filelist$4) + "."));
                    var $5708 = IO$print$((_notfound$3 + ("\u{a}" + _searched$5)));
                    var $5705 = $5708;
                    break;
            };
            return $5705;
        }));
        return $5703;
    };
    const Kind$checker$io$one = x0 => Kind$checker$io$one$(x0);

    function Kind$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $5711 = self.head;
                var $5712 = self.tail;
                var $5713 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $5714 = _m$bind$5;
                    return $5714;
                }))(Kind$Synth$one$($5711, _defs$2))((_new_defs$5 => {
                    var self = _new_defs$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5716 = self.value;
                            var $5717 = Kind$Synth$many$($5712, $5716);
                            var $5715 = $5717;
                            break;
                        case 'Maybe.none':
                            var $5718 = Kind$Synth$many$($5712, _defs$2);
                            var $5715 = $5718;
                            break;
                    };
                    return $5715;
                }));
                var $5710 = $5713;
                break;
            case 'List.nil':
                var $5719 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5720 = _m$pure$4;
                    return $5720;
                }))(_defs$2);
                var $5710 = $5719;
                break;
        };
        return $5710;
    };
    const Kind$Synth$many = x0 => x1 => Kind$Synth$many$(x0, x1);

    function Kind$Synth$file$(_file$1, _defs$2) {
        var $5721 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $5722 = _m$bind$3;
            return $5722;
        }))(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Kind$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5724 = self.value;
                    var $5725 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $5726 = _m$pure$7;
                        return $5726;
                    }))(Either$left$($5724));
                    var $5723 = $5725;
                    break;
                case 'Either.right':
                    var $5727 = self.value;
                    var _file_defs$6 = $5727;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Kind$Name$from_bits);
                    var $5728 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $5729 = _m$bind$9;
                        return $5729;
                    }))(Kind$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5730 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $5731 = _m$pure$11;
                            return $5731;
                        }))(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5730;
                    }));
                    var $5723 = $5728;
                    break;
            };
            return $5723;
        }));
        return $5721;
    };
    const Kind$Synth$file = x0 => x1 => Kind$Synth$file$(x0, x1);

    function Kind$checker$io$file$(_file$1) {
        var $5732 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5733 = _m$bind$2;
            return $5733;
        }))(Kind$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5735 = self.value;
                    var $5736 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                        var $5737 = _m$bind$4;
                        return $5737;
                    }))(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5738 = IO$print$($5735);
                        return $5738;
                    }));
                    var $5734 = $5736;
                    break;
                case 'Either.right':
                    var $5739 = self.value;
                    var self = $5739;
                    switch (self._) {
                        case 'Pair.new':
                            var $5741 = self.fst;
                            var $5742 = self.snd;
                            var _nams$6 = $5741;
                            var _defs$7 = $5742;
                            var self = _nams$6;
                            switch (self._) {
                                case 'List.nil':
                                    var $5744 = IO$print$(("File not found or empty: \'" + (_file$1 + "\'.")));
                                    var $5743 = $5744;
                                    break;
                                case 'List.cons':
                                    var $5745 = IO$print$(Kind$Defs$report$(_defs$7, _nams$6));
                                    var $5743 = $5745;
                                    break;
                            };
                            var $5740 = $5743;
                            break;
                    };
                    var $5734 = $5740;
                    break;
            };
            return $5734;
        }));
        return $5732;
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
                        var $5746 = self.value;
                        var $5747 = $5746;
                        return $5747;
                    case 'IO.ask':
                        var $5748 = self.then;
                        var $5749 = IO$purify$($5748(""));
                        return $5749;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const IO$purify = x0 => IO$purify$(x0);

    function Kind$checker$code$(_code$1) {
        var self = Kind$Defs$read$("Main.kind", _code$1, Map$new);
        switch (self._) {
            case 'Either.left':
                var $5751 = self.value;
                var $5752 = $5751;
                var $5750 = $5752;
                break;
            case 'Either.right':
                var $5753 = self.value;
                var $5754 = IO$purify$((() => {
                    var _defs$3 = $5753;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Kind$Name$from_bits);
                    var $5755 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $5756 = _m$bind$5;
                        return $5756;
                    }))(Kind$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5757 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $5758 = _m$pure$7;
                            return $5758;
                        }))(Kind$Defs$report$(_defs$5, _nams$4));
                        return $5757;
                    }));
                    return $5755;
                })());
                var $5750 = $5754;
                break;
        };
        return $5750;
    };
    const Kind$checker$code = x0 => Kind$checker$code$(x0);

    function Kind$Term$read$(_code$1) {
        var self = Kind$Parser$term$(0n, _code$1);
        switch (self._) {
            case 'Parser.Reply.value':
                var $5760 = self.val;
                var $5761 = Maybe$some$($5760);
                var $5759 = $5761;
                break;
            case 'Parser.Reply.error':
                var $5762 = Maybe$none;
                var $5759 = $5762;
                break;
        };
        return $5759;
    };
    const Kind$Term$read = x0 => Kind$Term$read$(x0);
    const Kind = (() => {
        var __$1 = Kind$to_core$io$one;
        var __$2 = Kind$checker$io$one;
        var __$3 = Kind$checker$io$file;
        var __$4 = Kind$checker$code;
        var __$5 = Kind$Term$read;
        var $5763 = IO$monad$((_m$bind$6 => _m$pure$7 => {
            var $5764 = _m$pure$7;
            return $5764;
        }))(Unit$new);
        return $5763;
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
        'Map': Map,
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
        'Map.new': Map$new,
        'Kind.Def.new': Kind$Def$new,
        'Kind.Status.init': Kind$Status$init,
        'Kind.Parser.case.with': Kind$Parser$case$with,
        'Kind.Parser.case.case': Kind$Parser$case$case,
        'Map.tie': Map$tie,
        'Map.set': Map$set,
        'Map.from_list': Map$from_list,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Kind.Term.cse': Kind$Term$cse,
        'Kind.Parser.case': Kind$Parser$case,
        'Kind.set': Kind$set,
        'Kind.Parser.open': Kind$Parser$open,
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
        'Set.has': Set$has,
        'Set.mut.has': Set$mut$has,
        'Kind.Term.equal.extra_holes.funari': Kind$Term$equal$extra_holes$funari,
        'Bool.or': Bool$or,
        'Kind.Term.has_holes': Kind$Term$has_holes,
        'Kind.Term.equal.hole': Kind$Term$equal$hole,
        'Kind.Term.equal.extra_holes.filler': Kind$Term$equal$extra_holes$filler,
        'Kind.Term.equal.extra_holes': Kind$Term$equal$extra_holes,
        'Set.set': Set$set,
        'Set.mut.set': Set$mut$set,
        'Bool.eql': Bool$eql,
        'Kind.Term.equal': Kind$Term$equal,
        'Set.new': Set$new,
        'Set.mut.new': Set$mut$new,
        'Kind.Term.check': Kind$Term$check,
        'Kind.Path.nil': Kind$Path$nil,
        'Kind.MPath.nil': Kind$MPath$nil,
        'List.is_empty': List$is_empty,
        'Kind.Term.patch_at': Kind$Term$patch_at,
        'Kind.Synth.fix': Kind$Synth$fix,
        'Kind.Status.fail': Kind$Status$fail,
        'Kind.Synth.one': Kind$Synth$one,
        'Map.map': Map$map,
        'Kind.Term.inline.names': Kind$Term$inline$names,
        'Kind.Term.inline.reduce': Kind$Term$inline$reduce,
        'Kind.Term.inline': Kind$Term$inline,
        'Map.values.go': Map$values$go,
        'Map.values': Map$values,
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
        'Map.to_list.go': Map$to_list$go,
        'Map.to_list': Map$to_list,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Word.from_bits': Word$from_bits,
        'Kind.Name.from_bits': Kind$Name$from_bits,
        'Kind.Term.show.go': Kind$Term$show$go,
        'Kind.Term.show': Kind$Term$show,
        'Kind.Defs.report.types': Kind$Defs$report$types,
        'Map.keys.go': Map$keys$go,
        'Map.keys': Map$keys,
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