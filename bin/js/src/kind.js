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
                                                                        var self = Kind$Parser$text$("=", $762, $763);
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
                                                                                        var self = Kind$Parser$text$("..", $776, $777);
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

    function Kind$Parser$letforin$(_idx$1, _code$2) {
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
                                                        var self = Kind$Parser$text$("in", $878, $879);
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
                                                                        var self = Kind$Parser$text$(":", $893, $894);
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
                                                                                        var self = Parser$maybe$(Kind$Parser$text(";"), $908, $909);
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
                                                                                                        var self = Kind$Parser$stop$($843, $923, $924);
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
                                                                                                                var $933 = self.val;
                                                                                                                var _term$42 = Kind$Term$ref$("List.for");
                                                                                                                var _term$43 = Kind$Term$app$(_term$42, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$44 = Kind$Term$app$(_term$43, $895);
                                                                                                                var _term$45 = Kind$Term$app$(_term$44, Kind$Term$hol$(Bits$e));
                                                                                                                var _term$46 = Kind$Term$app$(_term$45, Kind$Term$ref$($858));
                                                                                                                var _lamb$47 = Kind$Term$lam$($880, (_i$47 => {
                                                                                                                    var $935 = Kind$Term$lam$($858, (_x$48 => {
                                                                                                                        var $936 = $910;
                                                                                                                        return $936;
                                                                                                                    }));
                                                                                                                    return $935;
                                                                                                                }));
                                                                                                                var _term$48 = Kind$Term$app$(_term$46, _lamb$47);
                                                                                                                var _term$49 = Kind$Term$let$($858, _term$48, (_x$49 => {
                                                                                                                    var $937 = $925;
                                                                                                                    return $937;
                                                                                                                }));
                                                                                                                var $934 = Parser$Reply$value$($931, $932, Kind$Term$ori$($933, _term$49));
                                                                                                                var $926 = $934;
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
    const Kind$Parser$letforin = x0 => x1 => Kind$Parser$letforin$(x0, x1);

    function Kind$Parser$let$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $939 = self.idx;
                var $940 = self.code;
                var $941 = self.err;
                var $942 = Parser$Reply$error$($939, $940, $941);
                var $938 = $942;
                break;
            case 'Parser.Reply.value':
                var $943 = self.idx;
                var $944 = self.code;
                var $945 = self.val;
                var self = Kind$Parser$text$("let ", $943, $944);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $947 = self.idx;
                        var $948 = self.code;
                        var $949 = self.err;
                        var $950 = Parser$Reply$error$($947, $948, $949);
                        var $946 = $950;
                        break;
                    case 'Parser.Reply.value':
                        var $951 = self.idx;
                        var $952 = self.code;
                        var self = Kind$Parser$name$($951, $952);
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
                                var self = Kind$Parser$text$("=", $958, $959);
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
                                        var self = Kind$Parser$term$($966, $967);
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
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $973, $974);
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
                                                        var self = Kind$Parser$term$($981, $982);
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
                                                                var $990 = self.val;
                                                                var self = Kind$Parser$stop$($945, $988, $989);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $992 = self.idx;
                                                                        var $993 = self.code;
                                                                        var $994 = self.err;
                                                                        var $995 = Parser$Reply$error$($992, $993, $994);
                                                                        var $991 = $995;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $996 = self.idx;
                                                                        var $997 = self.code;
                                                                        var $998 = self.val;
                                                                        var $999 = Parser$Reply$value$($996, $997, Kind$Term$ori$($998, Kind$Term$let$($960, $975, (_x$27 => {
                                                                            var $1000 = $990;
                                                                            return $1000;
                                                                        }))));
                                                                        var $991 = $999;
                                                                        break;
                                                                };
                                                                var $983 = $991;
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
                        var $946 = $953;
                        break;
                };
                var $938 = $946;
                break;
        };
        return $938;
    };
    const Kind$Parser$let = x0 => x1 => Kind$Parser$let$(x0, x1);

    function Kind$Parser$get$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1002 = self.idx;
                var $1003 = self.code;
                var $1004 = self.err;
                var $1005 = Parser$Reply$error$($1002, $1003, $1004);
                var $1001 = $1005;
                break;
            case 'Parser.Reply.value':
                var $1006 = self.idx;
                var $1007 = self.code;
                var $1008 = self.val;
                var self = Kind$Parser$text$("let ", $1006, $1007);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1010 = self.idx;
                        var $1011 = self.code;
                        var $1012 = self.err;
                        var $1013 = Parser$Reply$error$($1010, $1011, $1012);
                        var $1009 = $1013;
                        break;
                    case 'Parser.Reply.value':
                        var $1014 = self.idx;
                        var $1015 = self.code;
                        var self = Kind$Parser$text$("{", $1014, $1015);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1017 = self.idx;
                                var $1018 = self.code;
                                var $1019 = self.err;
                                var $1020 = Parser$Reply$error$($1017, $1018, $1019);
                                var $1016 = $1020;
                                break;
                            case 'Parser.Reply.value':
                                var $1021 = self.idx;
                                var $1022 = self.code;
                                var self = Kind$Parser$name$($1021, $1022);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1024 = self.idx;
                                        var $1025 = self.code;
                                        var $1026 = self.err;
                                        var $1027 = Parser$Reply$error$($1024, $1025, $1026);
                                        var $1023 = $1027;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1028 = self.idx;
                                        var $1029 = self.code;
                                        var $1030 = self.val;
                                        var self = Kind$Parser$text$(",", $1028, $1029);
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
                                                var self = Kind$Parser$name$($1036, $1037);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1039 = self.idx;
                                                        var $1040 = self.code;
                                                        var $1041 = self.err;
                                                        var $1042 = Parser$Reply$error$($1039, $1040, $1041);
                                                        var $1038 = $1042;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1043 = self.idx;
                                                        var $1044 = self.code;
                                                        var $1045 = self.val;
                                                        var self = Kind$Parser$text$("}", $1043, $1044);
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
                                                                var self = Kind$Parser$text$("=", $1051, $1052);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1054 = self.idx;
                                                                        var $1055 = self.code;
                                                                        var $1056 = self.err;
                                                                        var $1057 = Parser$Reply$error$($1054, $1055, $1056);
                                                                        var $1053 = $1057;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1058 = self.idx;
                                                                        var $1059 = self.code;
                                                                        var self = Kind$Parser$term$($1058, $1059);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1061 = self.idx;
                                                                                var $1062 = self.code;
                                                                                var $1063 = self.err;
                                                                                var $1064 = Parser$Reply$error$($1061, $1062, $1063);
                                                                                var $1060 = $1064;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1065 = self.idx;
                                                                                var $1066 = self.code;
                                                                                var $1067 = self.val;
                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1065, $1066);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1069 = self.idx;
                                                                                        var $1070 = self.code;
                                                                                        var $1071 = self.err;
                                                                                        var $1072 = Parser$Reply$error$($1069, $1070, $1071);
                                                                                        var $1068 = $1072;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1073 = self.idx;
                                                                                        var $1074 = self.code;
                                                                                        var self = Kind$Parser$term$($1073, $1074);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1076 = self.idx;
                                                                                                var $1077 = self.code;
                                                                                                var $1078 = self.err;
                                                                                                var $1079 = Parser$Reply$error$($1076, $1077, $1078);
                                                                                                var $1075 = $1079;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1080 = self.idx;
                                                                                                var $1081 = self.code;
                                                                                                var $1082 = self.val;
                                                                                                var self = Kind$Parser$stop$($1008, $1080, $1081);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1084 = self.idx;
                                                                                                        var $1085 = self.code;
                                                                                                        var $1086 = self.err;
                                                                                                        var $1087 = Parser$Reply$error$($1084, $1085, $1086);
                                                                                                        var $1083 = $1087;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1088 = self.idx;
                                                                                                        var $1089 = self.code;
                                                                                                        var $1090 = self.val;
                                                                                                        var _term$39 = $1067;
                                                                                                        var _term$40 = Kind$Term$app$(_term$39, Kind$Term$lam$("x", (_x$40 => {
                                                                                                            var $1092 = Kind$Term$hol$(Bits$e);
                                                                                                            return $1092;
                                                                                                        })));
                                                                                                        var _term$41 = Kind$Term$app$(_term$40, Kind$Term$lam$($1030, (_x$41 => {
                                                                                                            var $1093 = Kind$Term$lam$($1045, (_y$42 => {
                                                                                                                var $1094 = $1082;
                                                                                                                return $1094;
                                                                                                            }));
                                                                                                            return $1093;
                                                                                                        })));
                                                                                                        var $1091 = Parser$Reply$value$($1088, $1089, Kind$Term$ori$($1090, _term$41));
                                                                                                        var $1083 = $1091;
                                                                                                        break;
                                                                                                };
                                                                                                var $1075 = $1083;
                                                                                                break;
                                                                                        };
                                                                                        var $1068 = $1075;
                                                                                        break;
                                                                                };
                                                                                var $1060 = $1068;
                                                                                break;
                                                                        };
                                                                        var $1053 = $1060;
                                                                        break;
                                                                };
                                                                var $1046 = $1053;
                                                                break;
                                                        };
                                                        var $1038 = $1046;
                                                        break;
                                                };
                                                var $1031 = $1038;
                                                break;
                                        };
                                        var $1023 = $1031;
                                        break;
                                };
                                var $1016 = $1023;
                                break;
                        };
                        var $1009 = $1016;
                        break;
                };
                var $1001 = $1009;
                break;
        };
        return $1001;
    };
    const Kind$Parser$get = x0 => x1 => Kind$Parser$get$(x0, x1);

    function Kind$Term$def$(_name$1, _expr$2, _body$3) {
        var $1095 = ({
            _: 'Kind.Term.def',
            'name': _name$1,
            'expr': _expr$2,
            'body': _body$3
        });
        return $1095;
    };
    const Kind$Term$def = x0 => x1 => x2 => Kind$Term$def$(x0, x1, x2);

    function Kind$Parser$def$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1097 = self.idx;
                var $1098 = self.code;
                var $1099 = self.err;
                var $1100 = Parser$Reply$error$($1097, $1098, $1099);
                var $1096 = $1100;
                break;
            case 'Parser.Reply.value':
                var $1101 = self.idx;
                var $1102 = self.code;
                var $1103 = self.val;
                var self = Kind$Parser$text$("def ", $1101, $1102);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1105 = self.idx;
                        var $1106 = self.code;
                        var $1107 = self.err;
                        var $1108 = Parser$Reply$error$($1105, $1106, $1107);
                        var $1104 = $1108;
                        break;
                    case 'Parser.Reply.value':
                        var $1109 = self.idx;
                        var $1110 = self.code;
                        var self = Kind$Parser$name$($1109, $1110);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1112 = self.idx;
                                var $1113 = self.code;
                                var $1114 = self.err;
                                var $1115 = Parser$Reply$error$($1112, $1113, $1114);
                                var $1111 = $1115;
                                break;
                            case 'Parser.Reply.value':
                                var $1116 = self.idx;
                                var $1117 = self.code;
                                var $1118 = self.val;
                                var self = Kind$Parser$text$("=", $1116, $1117);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1120 = self.idx;
                                        var $1121 = self.code;
                                        var $1122 = self.err;
                                        var $1123 = Parser$Reply$error$($1120, $1121, $1122);
                                        var $1119 = $1123;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1124 = self.idx;
                                        var $1125 = self.code;
                                        var self = Kind$Parser$term$($1124, $1125);
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
                                                var $1133 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1131, $1132);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1135 = self.idx;
                                                        var $1136 = self.code;
                                                        var $1137 = self.err;
                                                        var $1138 = Parser$Reply$error$($1135, $1136, $1137);
                                                        var $1134 = $1138;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1139 = self.idx;
                                                        var $1140 = self.code;
                                                        var self = Kind$Parser$term$($1139, $1140);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1142 = self.idx;
                                                                var $1143 = self.code;
                                                                var $1144 = self.err;
                                                                var $1145 = Parser$Reply$error$($1142, $1143, $1144);
                                                                var $1141 = $1145;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1146 = self.idx;
                                                                var $1147 = self.code;
                                                                var $1148 = self.val;
                                                                var self = Kind$Parser$stop$($1103, $1146, $1147);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1150 = self.idx;
                                                                        var $1151 = self.code;
                                                                        var $1152 = self.err;
                                                                        var $1153 = Parser$Reply$error$($1150, $1151, $1152);
                                                                        var $1149 = $1153;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1154 = self.idx;
                                                                        var $1155 = self.code;
                                                                        var $1156 = self.val;
                                                                        var $1157 = Parser$Reply$value$($1154, $1155, Kind$Term$ori$($1156, Kind$Term$def$($1118, $1133, (_x$27 => {
                                                                            var $1158 = $1148;
                                                                            return $1158;
                                                                        }))));
                                                                        var $1149 = $1157;
                                                                        break;
                                                                };
                                                                var $1141 = $1149;
                                                                break;
                                                        };
                                                        var $1134 = $1141;
                                                        break;
                                                };
                                                var $1126 = $1134;
                                                break;
                                        };
                                        var $1119 = $1126;
                                        break;
                                };
                                var $1111 = $1119;
                                break;
                        };
                        var $1104 = $1111;
                        break;
                };
                var $1096 = $1104;
                break;
        };
        return $1096;
    };
    const Kind$Parser$def = x0 => x1 => Kind$Parser$def$(x0, x1);

    function Kind$Parser$goal_rewrite$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1160 = self.idx;
                var $1161 = self.code;
                var $1162 = self.err;
                var $1163 = Parser$Reply$error$($1160, $1161, $1162);
                var $1159 = $1163;
                break;
            case 'Parser.Reply.value':
                var $1164 = self.idx;
                var $1165 = self.code;
                var $1166 = self.val;
                var self = Kind$Parser$text$("rewrite ", $1164, $1165);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1168 = self.idx;
                        var $1169 = self.code;
                        var $1170 = self.err;
                        var $1171 = Parser$Reply$error$($1168, $1169, $1170);
                        var $1167 = $1171;
                        break;
                    case 'Parser.Reply.value':
                        var $1172 = self.idx;
                        var $1173 = self.code;
                        var self = Kind$Parser$name1$($1172, $1173);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1175 = self.idx;
                                var $1176 = self.code;
                                var $1177 = self.err;
                                var $1178 = Parser$Reply$error$($1175, $1176, $1177);
                                var $1174 = $1178;
                                break;
                            case 'Parser.Reply.value':
                                var $1179 = self.idx;
                                var $1180 = self.code;
                                var $1181 = self.val;
                                var self = Kind$Parser$text$("in", $1179, $1180);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1183 = self.idx;
                                        var $1184 = self.code;
                                        var $1185 = self.err;
                                        var $1186 = Parser$Reply$error$($1183, $1184, $1185);
                                        var $1182 = $1186;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1187 = self.idx;
                                        var $1188 = self.code;
                                        var self = Kind$Parser$term$($1187, $1188);
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
                                                var self = Kind$Parser$text$("with", $1194, $1195);
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
                                                        var self = Kind$Parser$term$($1202, $1203);
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
                                                                var self = Kind$Parser$term$($1209, $1210);
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
                                                                        var $1219 = self.val;
                                                                        var self = Kind$Parser$stop$($1166, $1217, $1218);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1221 = self.idx;
                                                                                var $1222 = self.code;
                                                                                var $1223 = self.err;
                                                                                var $1224 = Parser$Reply$error$($1221, $1222, $1223);
                                                                                var $1220 = $1224;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1225 = self.idx;
                                                                                var $1226 = self.code;
                                                                                var $1227 = self.val;
                                                                                var _moti$30 = Kind$Term$lam$($1181, (_s$30 => {
                                                                                    var $1229 = Kind$Term$lam$("", (_x$31 => {
                                                                                        var $1230 = $1196;
                                                                                        return $1230;
                                                                                    }));
                                                                                    return $1229;
                                                                                }));
                                                                                var _term$31 = Kind$Term$ref$("Equal.mirror");
                                                                                var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                                var _term$33 = Kind$Term$app$(_term$32, Kind$Term$hol$(Bits$e));
                                                                                var _term$34 = Kind$Term$app$(_term$33, Kind$Term$hol$(Bits$e));
                                                                                var _term$35 = Kind$Term$app$(_term$34, $1211);
                                                                                var _term$36 = Kind$Term$app$(_term$35, _moti$30);
                                                                                var _term$37 = Kind$Term$app$(_term$36, $1219);
                                                                                var $1228 = Parser$Reply$value$($1225, $1226, Kind$Term$ori$($1227, _term$37));
                                                                                var $1220 = $1228;
                                                                                break;
                                                                        };
                                                                        var $1212 = $1220;
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
                                        var $1182 = $1189;
                                        break;
                                };
                                var $1174 = $1182;
                                break;
                        };
                        var $1167 = $1174;
                        break;
                };
                var $1159 = $1167;
                break;
        };
        return $1159;
    };
    const Kind$Parser$goal_rewrite = x0 => x1 => Kind$Parser$goal_rewrite$(x0, x1);

    function Kind$Parser$if$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1232 = self.idx;
                var $1233 = self.code;
                var $1234 = self.err;
                var $1235 = Parser$Reply$error$($1232, $1233, $1234);
                var $1231 = $1235;
                break;
            case 'Parser.Reply.value':
                var $1236 = self.idx;
                var $1237 = self.code;
                var $1238 = self.val;
                var self = Kind$Parser$text$("if ", $1236, $1237);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1240 = self.idx;
                        var $1241 = self.code;
                        var $1242 = self.err;
                        var $1243 = Parser$Reply$error$($1240, $1241, $1242);
                        var $1239 = $1243;
                        break;
                    case 'Parser.Reply.value':
                        var $1244 = self.idx;
                        var $1245 = self.code;
                        var self = Kind$Parser$term$($1244, $1245);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1247 = self.idx;
                                var $1248 = self.code;
                                var $1249 = self.err;
                                var $1250 = Parser$Reply$error$($1247, $1248, $1249);
                                var $1246 = $1250;
                                break;
                            case 'Parser.Reply.value':
                                var $1251 = self.idx;
                                var $1252 = self.code;
                                var $1253 = self.val;
                                var self = Kind$Parser$text$("then", $1251, $1252);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1255 = self.idx;
                                        var $1256 = self.code;
                                        var $1257 = self.err;
                                        var $1258 = Parser$Reply$error$($1255, $1256, $1257);
                                        var $1254 = $1258;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1259 = self.idx;
                                        var $1260 = self.code;
                                        var self = Kind$Parser$term$($1259, $1260);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1262 = self.idx;
                                                var $1263 = self.code;
                                                var $1264 = self.err;
                                                var $1265 = Parser$Reply$error$($1262, $1263, $1264);
                                                var $1261 = $1265;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1266 = self.idx;
                                                var $1267 = self.code;
                                                var $1268 = self.val;
                                                var self = Kind$Parser$text$("else", $1266, $1267);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1270 = self.idx;
                                                        var $1271 = self.code;
                                                        var $1272 = self.err;
                                                        var $1273 = Parser$Reply$error$($1270, $1271, $1272);
                                                        var $1269 = $1273;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1274 = self.idx;
                                                        var $1275 = self.code;
                                                        var self = Kind$Parser$term$($1274, $1275);
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
                                                                var self = Kind$Parser$stop$($1238, $1281, $1282);
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
                                                                        var $1291 = self.val;
                                                                        var _term$27 = $1253;
                                                                        var _term$28 = Kind$Term$app$(_term$27, Kind$Term$lam$("", (_x$28 => {
                                                                            var $1293 = Kind$Term$hol$(Bits$e);
                                                                            return $1293;
                                                                        })));
                                                                        var _term$29 = Kind$Term$app$(_term$28, $1268);
                                                                        var _term$30 = Kind$Term$app$(_term$29, $1283);
                                                                        var $1292 = Parser$Reply$value$($1289, $1290, Kind$Term$ori$($1291, _term$30));
                                                                        var $1284 = $1292;
                                                                        break;
                                                                };
                                                                var $1276 = $1284;
                                                                break;
                                                        };
                                                        var $1269 = $1276;
                                                        break;
                                                };
                                                var $1261 = $1269;
                                                break;
                                        };
                                        var $1254 = $1261;
                                        break;
                                };
                                var $1246 = $1254;
                                break;
                        };
                        var $1239 = $1246;
                        break;
                };
                var $1231 = $1239;
                break;
        };
        return $1231;
    };
    const Kind$Parser$if = x0 => x1 => Kind$Parser$if$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1295 = self.head;
                var $1296 = self.tail;
                var $1297 = List$cons$(_f$4($1295), List$mapped$($1296, _f$4));
                var $1294 = $1297;
                break;
            case 'List.nil':
                var $1298 = List$nil;
                var $1294 = $1298;
                break;
        };
        return $1294;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);
    const Kind$backslash = 92;
    const Kind$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Kind$backslash, String$cons$(Kind$backslash, String$nil)), Kind$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Kind$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Kind$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $1300 = self.fst;
                var $1301 = self.snd;
                var $1302 = (_idx$4 => _code$5 => {
                    var self = Parser$text$($1300, _idx$4, _code$5);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1304 = self.idx;
                            var $1305 = self.code;
                            var $1306 = self.err;
                            var $1307 = Parser$Reply$error$($1304, $1305, $1306);
                            var $1303 = $1307;
                            break;
                        case 'Parser.Reply.value':
                            var $1308 = self.idx;
                            var $1309 = self.code;
                            var $1310 = Parser$Reply$value$($1308, $1309, $1301);
                            var $1303 = $1310;
                            break;
                    };
                    return $1303;
                });
                var $1299 = $1302;
                break;
        };
        return $1299;
    }))), List$cons$(Parser$one, List$nil)));

    function Kind$Term$chr$(_chrx$1) {
        var $1311 = ({
            _: 'Kind.Term.chr',
            'chrx': _chrx$1
        });
        return $1311;
    };
    const Kind$Term$chr = x0 => Kind$Term$chr$(x0);

    function Kind$Parser$char$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1313 = self.idx;
                var $1314 = self.code;
                var $1315 = self.err;
                var $1316 = Parser$Reply$error$($1313, $1314, $1315);
                var $1312 = $1316;
                break;
            case 'Parser.Reply.value':
                var $1317 = self.idx;
                var $1318 = self.code;
                var $1319 = self.val;
                var self = Kind$Parser$text$("\'", $1317, $1318);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1321 = self.idx;
                        var $1322 = self.code;
                        var $1323 = self.err;
                        var $1324 = Parser$Reply$error$($1321, $1322, $1323);
                        var $1320 = $1324;
                        break;
                    case 'Parser.Reply.value':
                        var $1325 = self.idx;
                        var $1326 = self.code;
                        var self = Kind$Parser$char$single($1325)($1326);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1328 = self.idx;
                                var $1329 = self.code;
                                var $1330 = self.err;
                                var $1331 = Parser$Reply$error$($1328, $1329, $1330);
                                var $1327 = $1331;
                                break;
                            case 'Parser.Reply.value':
                                var $1332 = self.idx;
                                var $1333 = self.code;
                                var $1334 = self.val;
                                var self = Parser$text$("\'", $1332, $1333);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1336 = self.idx;
                                        var $1337 = self.code;
                                        var $1338 = self.err;
                                        var $1339 = Parser$Reply$error$($1336, $1337, $1338);
                                        var $1335 = $1339;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1340 = self.idx;
                                        var $1341 = self.code;
                                        var self = Kind$Parser$stop$($1319, $1340, $1341);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1343 = self.idx;
                                                var $1344 = self.code;
                                                var $1345 = self.err;
                                                var $1346 = Parser$Reply$error$($1343, $1344, $1345);
                                                var $1342 = $1346;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1347 = self.idx;
                                                var $1348 = self.code;
                                                var $1349 = self.val;
                                                var $1350 = Parser$Reply$value$($1347, $1348, Kind$Term$ori$($1349, Kind$Term$chr$($1334)));
                                                var $1342 = $1350;
                                                break;
                                        };
                                        var $1335 = $1342;
                                        break;
                                };
                                var $1327 = $1335;
                                break;
                        };
                        var $1320 = $1327;
                        break;
                };
                var $1312 = $1320;
                break;
        };
        return $1312;
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
                    var $1351 = _res$2;
                    return $1351;
                } else {
                    var $1352 = self.charCodeAt(0);
                    var $1353 = self.slice(1);
                    var $1354 = String$reverse$go$($1353, String$cons$($1352, _res$2));
                    return $1354;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1355 = String$reverse$go$(_xs$1, String$nil);
        return $1355;
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
                    var $1356 = Parser$Reply$error$(_idx$2, _code$3, "Non-terminating string.");
                    return $1356;
                } else {
                    var $1357 = self.charCodeAt(0);
                    var $1358 = self.slice(1);
                    var self = ($1357 === 34);
                    if (self) {
                        var $1360 = Parser$Reply$value$(Nat$succ$(_idx$2), $1358, String$reverse$(_str$1));
                        var $1359 = $1360;
                    } else {
                        var self = Kind$Parser$char$single(_idx$2)(_code$3);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1362 = self.idx;
                                var $1363 = self.code;
                                var $1364 = self.err;
                                var $1365 = Parser$Reply$error$($1362, $1363, $1364);
                                var $1361 = $1365;
                                break;
                            case 'Parser.Reply.value':
                                var $1366 = self.idx;
                                var $1367 = self.code;
                                var $1368 = self.val;
                                var $1369 = Kind$Parser$string$go$(String$cons$($1368, _str$1), $1366, $1367);
                                var $1361 = $1369;
                                break;
                        };
                        var $1359 = $1361;
                    };
                    return $1359;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Parser$string$go = x0 => x1 => x2 => Kind$Parser$string$go$(x0, x1, x2);

    function Kind$Term$str$(_strx$1) {
        var $1370 = ({
            _: 'Kind.Term.str',
            'strx': _strx$1
        });
        return $1370;
    };
    const Kind$Term$str = x0 => Kind$Term$str$(x0);

    function Kind$Parser$string$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $1378 = self.val;
                var self = Kind$Parser$text$(String$cons$(34, String$nil), $1376, $1377);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1380 = self.idx;
                        var $1381 = self.code;
                        var $1382 = self.err;
                        var $1383 = Parser$Reply$error$($1380, $1381, $1382);
                        var $1379 = $1383;
                        break;
                    case 'Parser.Reply.value':
                        var $1384 = self.idx;
                        var $1385 = self.code;
                        var self = Kind$Parser$string$go$("", $1384, $1385);
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
                                var $1393 = self.val;
                                var self = Kind$Parser$stop$($1378, $1391, $1392);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1395 = self.idx;
                                        var $1396 = self.code;
                                        var $1397 = self.err;
                                        var $1398 = Parser$Reply$error$($1395, $1396, $1397);
                                        var $1394 = $1398;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1399 = self.idx;
                                        var $1400 = self.code;
                                        var $1401 = self.val;
                                        var $1402 = Parser$Reply$value$($1399, $1400, Kind$Term$ori$($1401, Kind$Term$str$($1393)));
                                        var $1394 = $1402;
                                        break;
                                };
                                var $1386 = $1394;
                                break;
                        };
                        var $1379 = $1386;
                        break;
                };
                var $1371 = $1379;
                break;
        };
        return $1371;
    };
    const Kind$Parser$string = x0 => x1 => Kind$Parser$string$(x0, x1);

    function Kind$Parser$pair$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1404 = self.idx;
                var $1405 = self.code;
                var $1406 = self.err;
                var $1407 = Parser$Reply$error$($1404, $1405, $1406);
                var $1403 = $1407;
                break;
            case 'Parser.Reply.value':
                var $1408 = self.idx;
                var $1409 = self.code;
                var $1410 = self.val;
                var self = Kind$Parser$text$("{", $1408, $1409);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1412 = self.idx;
                        var $1413 = self.code;
                        var $1414 = self.err;
                        var $1415 = Parser$Reply$error$($1412, $1413, $1414);
                        var $1411 = $1415;
                        break;
                    case 'Parser.Reply.value':
                        var $1416 = self.idx;
                        var $1417 = self.code;
                        var self = Kind$Parser$term$($1416, $1417);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1419 = self.idx;
                                var $1420 = self.code;
                                var $1421 = self.err;
                                var $1422 = Parser$Reply$error$($1419, $1420, $1421);
                                var $1418 = $1422;
                                break;
                            case 'Parser.Reply.value':
                                var $1423 = self.idx;
                                var $1424 = self.code;
                                var $1425 = self.val;
                                var self = Kind$Parser$text$(",", $1423, $1424);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1427 = self.idx;
                                        var $1428 = self.code;
                                        var $1429 = self.err;
                                        var $1430 = Parser$Reply$error$($1427, $1428, $1429);
                                        var $1426 = $1430;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1431 = self.idx;
                                        var $1432 = self.code;
                                        var self = Kind$Parser$term$($1431, $1432);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1434 = self.idx;
                                                var $1435 = self.code;
                                                var $1436 = self.err;
                                                var $1437 = Parser$Reply$error$($1434, $1435, $1436);
                                                var $1433 = $1437;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1438 = self.idx;
                                                var $1439 = self.code;
                                                var $1440 = self.val;
                                                var self = Kind$Parser$text$("}", $1438, $1439);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1442 = self.idx;
                                                        var $1443 = self.code;
                                                        var $1444 = self.err;
                                                        var $1445 = Parser$Reply$error$($1442, $1443, $1444);
                                                        var $1441 = $1445;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1446 = self.idx;
                                                        var $1447 = self.code;
                                                        var self = Kind$Parser$stop$($1410, $1446, $1447);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1449 = self.idx;
                                                                var $1450 = self.code;
                                                                var $1451 = self.err;
                                                                var $1452 = Parser$Reply$error$($1449, $1450, $1451);
                                                                var $1448 = $1452;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1453 = self.idx;
                                                                var $1454 = self.code;
                                                                var $1455 = self.val;
                                                                var _term$24 = Kind$Term$ref$("Pair.new");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, $1425);
                                                                var _term$28 = Kind$Term$app$(_term$27, $1440);
                                                                var $1456 = Parser$Reply$value$($1453, $1454, Kind$Term$ori$($1455, _term$28));
                                                                var $1448 = $1456;
                                                                break;
                                                        };
                                                        var $1441 = $1448;
                                                        break;
                                                };
                                                var $1433 = $1441;
                                                break;
                                        };
                                        var $1426 = $1433;
                                        break;
                                };
                                var $1418 = $1426;
                                break;
                        };
                        var $1411 = $1418;
                        break;
                };
                var $1403 = $1411;
                break;
        };
        return $1403;
    };
    const Kind$Parser$pair = x0 => x1 => Kind$Parser$pair$(x0, x1);

    function Kind$Parser$sigma$type$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1458 = self.idx;
                var $1459 = self.code;
                var $1460 = self.err;
                var $1461 = Parser$Reply$error$($1458, $1459, $1460);
                var $1457 = $1461;
                break;
            case 'Parser.Reply.value':
                var $1462 = self.idx;
                var $1463 = self.code;
                var $1464 = self.val;
                var self = Kind$Parser$text$("{", $1462, $1463);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1466 = self.idx;
                        var $1467 = self.code;
                        var $1468 = self.err;
                        var $1469 = Parser$Reply$error$($1466, $1467, $1468);
                        var $1465 = $1469;
                        break;
                    case 'Parser.Reply.value':
                        var $1470 = self.idx;
                        var $1471 = self.code;
                        var self = Kind$Parser$name1$($1470, $1471);
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
                                var $1479 = self.val;
                                var self = Kind$Parser$text$(":", $1477, $1478);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1481 = self.idx;
                                        var $1482 = self.code;
                                        var $1483 = self.err;
                                        var $1484 = Parser$Reply$error$($1481, $1482, $1483);
                                        var $1480 = $1484;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1485 = self.idx;
                                        var $1486 = self.code;
                                        var self = Kind$Parser$term$($1485, $1486);
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
                                                var self = Kind$Parser$text$("}", $1492, $1493);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1496 = self.idx;
                                                        var $1497 = self.code;
                                                        var $1498 = self.err;
                                                        var $1499 = Parser$Reply$error$($1496, $1497, $1498);
                                                        var $1495 = $1499;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1500 = self.idx;
                                                        var $1501 = self.code;
                                                        var self = Kind$Parser$term$($1500, $1501);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1503 = self.idx;
                                                                var $1504 = self.code;
                                                                var $1505 = self.err;
                                                                var $1506 = Parser$Reply$error$($1503, $1504, $1505);
                                                                var $1502 = $1506;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1507 = self.idx;
                                                                var $1508 = self.code;
                                                                var $1509 = self.val;
                                                                var self = Kind$Parser$stop$($1464, $1507, $1508);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1511 = self.idx;
                                                                        var $1512 = self.code;
                                                                        var $1513 = self.err;
                                                                        var $1514 = Parser$Reply$error$($1511, $1512, $1513);
                                                                        var $1510 = $1514;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1515 = self.idx;
                                                                        var $1516 = self.code;
                                                                        var $1517 = self.val;
                                                                        var _term$27 = Kind$Term$ref$("Sigma");
                                                                        var _term$28 = Kind$Term$app$(_term$27, $1494);
                                                                        var _term$29 = Kind$Term$app$(_term$28, Kind$Term$lam$($1479, (_x$29 => {
                                                                            var $1519 = $1509;
                                                                            return $1519;
                                                                        })));
                                                                        var $1518 = Parser$Reply$value$($1515, $1516, Kind$Term$ori$($1517, _term$29));
                                                                        var $1510 = $1518;
                                                                        break;
                                                                };
                                                                var $1502 = $1510;
                                                                break;
                                                        };
                                                        var $1495 = $1502;
                                                        break;
                                                };
                                                var $1487 = $1495;
                                                break;
                                        };
                                        var $1480 = $1487;
                                        break;
                                };
                                var $1472 = $1480;
                                break;
                        };
                        var $1465 = $1472;
                        break;
                };
                var $1457 = $1465;
                break;
        };
        return $1457;
    };
    const Kind$Parser$sigma$type = x0 => x1 => Kind$Parser$sigma$type$(x0, x1);

    function Kind$Parser$some$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("some(", $1525, $1526);
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
                                var self = Kind$Parser$text$(")", $1540, $1541);
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
                                        var self = Kind$Parser$stop$($1527, $1548, $1549);
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
                                                var _term$18 = Kind$Term$ref$("Maybe.some");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, $1542);
                                                var $1558 = Parser$Reply$value$($1555, $1556, Kind$Term$ori$($1557, _term$20));
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
    const Kind$Parser$some = x0 => x1 => Kind$Parser$some$(x0, x1);

    function Kind$Parser$apply$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1560 = self.idx;
                var $1561 = self.code;
                var $1562 = self.err;
                var $1563 = Parser$Reply$error$($1560, $1561, $1562);
                var $1559 = $1563;
                break;
            case 'Parser.Reply.value':
                var $1564 = self.idx;
                var $1565 = self.code;
                var $1566 = self.val;
                var self = Kind$Parser$text$("apply(", $1564, $1565);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1568 = self.idx;
                        var $1569 = self.code;
                        var $1570 = self.err;
                        var $1571 = Parser$Reply$error$($1568, $1569, $1570);
                        var $1567 = $1571;
                        break;
                    case 'Parser.Reply.value':
                        var $1572 = self.idx;
                        var $1573 = self.code;
                        var self = Kind$Parser$term$($1572, $1573);
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
                                var self = Kind$Parser$text$(",", $1579, $1580);
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
                                        var self = Kind$Parser$term$($1587, $1588);
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
                                                var self = Kind$Parser$text$(")", $1594, $1595);
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
                                                        var self = Kind$Parser$stop$($1566, $1602, $1603);
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
                                                                var _term$24 = Kind$Term$ref$("Equal.apply");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$hol$(Bits$e));
                                                                var _term$28 = Kind$Term$app$(_term$27, Kind$Term$hol$(Bits$e));
                                                                var _term$29 = Kind$Term$app$(_term$28, $1581);
                                                                var _term$30 = Kind$Term$app$(_term$29, $1596);
                                                                var $1612 = Parser$Reply$value$($1609, $1610, Kind$Term$ori$($1611, _term$30));
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
                        var $1567 = $1574;
                        break;
                };
                var $1559 = $1567;
                break;
        };
        return $1559;
    };
    const Kind$Parser$apply = x0 => x1 => Kind$Parser$apply$(x0, x1);

    function Kind$Parser$mirror$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("mirror(", $1618, $1619);
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
                                                var _term$18 = Kind$Term$ref$("Equal.mirror");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, Kind$Term$hol$(Bits$e));
                                                var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                var _term$22 = Kind$Term$app$(_term$21, $1635);
                                                var $1651 = Parser$Reply$value$($1648, $1649, Kind$Term$ori$($1650, _term$22));
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
    const Kind$Parser$mirror = x0 => x1 => Kind$Parser$mirror$(x0, x1);

    function Kind$Name$read$(_str$1) {
        var $1652 = _str$1;
        return $1652;
    };
    const Kind$Name$read = x0 => Kind$Name$read$(x0);

    function Kind$Parser$list$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1654 = self.idx;
                var $1655 = self.code;
                var $1656 = self.err;
                var $1657 = Parser$Reply$error$($1654, $1655, $1656);
                var $1653 = $1657;
                break;
            case 'Parser.Reply.value':
                var $1658 = self.idx;
                var $1659 = self.code;
                var $1660 = self.val;
                var self = Kind$Parser$text$("[", $1658, $1659);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1662 = self.idx;
                        var $1663 = self.code;
                        var $1664 = self.err;
                        var $1665 = Parser$Reply$error$($1662, $1663, $1664);
                        var $1661 = $1665;
                        break;
                    case 'Parser.Reply.value':
                        var $1666 = self.idx;
                        var $1667 = self.code;
                        var self = Parser$until$(Kind$Parser$text("]"), Kind$Parser$item(Kind$Parser$term))($1666)($1667);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1669 = self.idx;
                                var $1670 = self.code;
                                var $1671 = self.err;
                                var $1672 = Parser$Reply$error$($1669, $1670, $1671);
                                var $1668 = $1672;
                                break;
                            case 'Parser.Reply.value':
                                var $1673 = self.idx;
                                var $1674 = self.code;
                                var $1675 = self.val;
                                var self = Kind$Parser$stop$($1660, $1673, $1674);
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
                                        var $1684 = Parser$Reply$value$($1681, $1682, List$fold$($1675, Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("List.nil")), Kind$Term$hol$(Bits$e)), (_x$15 => _xs$16 => {
                                            var _term$17 = Kind$Term$ref$(Kind$Name$read$("List.cons"));
                                            var _term$18 = Kind$Term$app$(_term$17, Kind$Term$hol$(Bits$e));
                                            var _term$19 = Kind$Term$app$(_term$18, _x$15);
                                            var _term$20 = Kind$Term$app$(_term$19, _xs$16);
                                            var $1685 = Kind$Term$ori$($1683, _term$20);
                                            return $1685;
                                        })));
                                        var $1676 = $1684;
                                        break;
                                };
                                var $1668 = $1676;
                                break;
                        };
                        var $1661 = $1668;
                        break;
                };
                var $1653 = $1661;
                break;
        };
        return $1653;
    };
    const Kind$Parser$list = x0 => x1 => Kind$Parser$list$(x0, x1);

    function Kind$Parser$log$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1687 = self.idx;
                var $1688 = self.code;
                var $1689 = self.err;
                var $1690 = Parser$Reply$error$($1687, $1688, $1689);
                var $1686 = $1690;
                break;
            case 'Parser.Reply.value':
                var $1691 = self.idx;
                var $1692 = self.code;
                var $1693 = self.val;
                var self = Kind$Parser$text$("log(", $1691, $1692);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1695 = self.idx;
                        var $1696 = self.code;
                        var $1697 = self.err;
                        var $1698 = Parser$Reply$error$($1695, $1696, $1697);
                        var $1694 = $1698;
                        break;
                    case 'Parser.Reply.value':
                        var $1699 = self.idx;
                        var $1700 = self.code;
                        var self = Parser$until$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term))($1699)($1700);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1702 = self.idx;
                                var $1703 = self.code;
                                var $1704 = self.err;
                                var $1705 = Parser$Reply$error$($1702, $1703, $1704);
                                var $1701 = $1705;
                                break;
                            case 'Parser.Reply.value':
                                var $1706 = self.idx;
                                var $1707 = self.code;
                                var $1708 = self.val;
                                var self = Kind$Parser$term$($1706, $1707);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1710 = self.idx;
                                        var $1711 = self.code;
                                        var $1712 = self.err;
                                        var $1713 = Parser$Reply$error$($1710, $1711, $1712);
                                        var $1709 = $1713;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1714 = self.idx;
                                        var $1715 = self.code;
                                        var $1716 = self.val;
                                        var _term$15 = Kind$Term$ref$("Debug.log");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                        var _args$17 = List$fold$($1708, Kind$Term$ref$("String.nil"), (_x$17 => _xs$18 => {
                                            var _arg$19 = Kind$Term$ref$("String.concat");
                                            var _arg$20 = Kind$Term$app$(_arg$19, _x$17);
                                            var _arg$21 = Kind$Term$app$(_arg$20, _xs$18);
                                            var $1718 = _arg$21;
                                            return $1718;
                                        }));
                                        var _term$18 = Kind$Term$app$(_term$16, _args$17);
                                        var _term$19 = Kind$Term$app$(_term$18, Kind$Term$lam$("x", (_x$19 => {
                                            var $1719 = $1716;
                                            return $1719;
                                        })));
                                        var self = Kind$Parser$stop$($1693, $1714, $1715);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1720 = self.idx;
                                                var $1721 = self.code;
                                                var $1722 = self.err;
                                                var $1723 = Parser$Reply$error$($1720, $1721, $1722);
                                                var $1717 = $1723;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1724 = self.idx;
                                                var $1725 = self.code;
                                                var $1726 = self.val;
                                                var $1727 = Parser$Reply$value$($1724, $1725, Kind$Term$ori$($1726, _term$19));
                                                var $1717 = $1727;
                                                break;
                                        };
                                        var $1709 = $1717;
                                        break;
                                };
                                var $1701 = $1709;
                                break;
                        };
                        var $1694 = $1701;
                        break;
                };
                var $1686 = $1694;
                break;
        };
        return $1686;
    };
    const Kind$Parser$log = x0 => x1 => Kind$Parser$log$(x0, x1);

    function Kind$Parser$forrange$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1729 = self.idx;
                var $1730 = self.code;
                var $1731 = self.err;
                var $1732 = Parser$Reply$error$($1729, $1730, $1731);
                var $1728 = $1732;
                break;
            case 'Parser.Reply.value':
                var $1733 = self.idx;
                var $1734 = self.code;
                var $1735 = self.val;
                var self = Kind$Parser$text$("for ", $1733, $1734);
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
                        var self = Kind$Parser$name1$($1741, $1742);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1744 = self.idx;
                                var $1745 = self.code;
                                var $1746 = self.err;
                                var $1747 = Parser$Reply$error$($1744, $1745, $1746);
                                var $1743 = $1747;
                                break;
                            case 'Parser.Reply.value':
                                var $1748 = self.idx;
                                var $1749 = self.code;
                                var $1750 = self.val;
                                var self = Kind$Parser$text$(":", $1748, $1749);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1752 = self.idx;
                                        var $1753 = self.code;
                                        var $1754 = self.err;
                                        var $1755 = Parser$Reply$error$($1752, $1753, $1754);
                                        var $1751 = $1755;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1756 = self.idx;
                                        var $1757 = self.code;
                                        var self = Kind$Parser$text$("U32", $1756, $1757);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1759 = self.idx;
                                                var $1760 = self.code;
                                                var $1761 = self.err;
                                                var $1762 = Parser$Reply$error$($1759, $1760, $1761);
                                                var $1758 = $1762;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1763 = self.idx;
                                                var $1764 = self.code;
                                                var self = Kind$Parser$text$("=", $1763, $1764);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1766 = self.idx;
                                                        var $1767 = self.code;
                                                        var $1768 = self.err;
                                                        var $1769 = Parser$Reply$error$($1766, $1767, $1768);
                                                        var $1765 = $1769;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1770 = self.idx;
                                                        var $1771 = self.code;
                                                        var self = Kind$Parser$term$($1770, $1771);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1773 = self.idx;
                                                                var $1774 = self.code;
                                                                var $1775 = self.err;
                                                                var $1776 = Parser$Reply$error$($1773, $1774, $1775);
                                                                var $1772 = $1776;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1777 = self.idx;
                                                                var $1778 = self.code;
                                                                var $1779 = self.val;
                                                                var self = Kind$Parser$text$("..", $1777, $1778);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1781 = self.idx;
                                                                        var $1782 = self.code;
                                                                        var $1783 = self.err;
                                                                        var $1784 = Parser$Reply$error$($1781, $1782, $1783);
                                                                        var $1780 = $1784;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1785 = self.idx;
                                                                        var $1786 = self.code;
                                                                        var self = Kind$Parser$term$($1785, $1786);
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
                                                                                var $1794 = self.val;
                                                                                var self = Kind$Parser$text$("with", $1792, $1793);
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
                                                                                        var self = Kind$Parser$name1$($1800, $1801);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1803 = self.idx;
                                                                                                var $1804 = self.code;
                                                                                                var $1805 = self.err;
                                                                                                var $1806 = Parser$Reply$error$($1803, $1804, $1805);
                                                                                                var $1802 = $1806;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1807 = self.idx;
                                                                                                var $1808 = self.code;
                                                                                                var $1809 = self.val;
                                                                                                var self = Kind$Parser$text$(":", $1807, $1808);
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
                                                                                                        var self = Kind$Parser$term$($1815, $1816);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $1818 = self.idx;
                                                                                                                var $1819 = self.code;
                                                                                                                var $1820 = self.err;
                                                                                                                var $1821 = Parser$Reply$error$($1818, $1819, $1820);
                                                                                                                var $1817 = $1821;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $1822 = self.idx;
                                                                                                                var $1823 = self.code;
                                                                                                                var $1824 = self.val;
                                                                                                                var self = Kind$Parser$stop$($1735, $1822, $1823);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1826 = self.idx;
                                                                                                                        var $1827 = self.code;
                                                                                                                        var $1828 = self.err;
                                                                                                                        var $1829 = Parser$Reply$error$($1826, $1827, $1828);
                                                                                                                        var $1825 = $1829;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1830 = self.idx;
                                                                                                                        var $1831 = self.code;
                                                                                                                        var $1832 = self.val;
                                                                                                                        var _term$45 = Kind$Term$ref$("U32.for");
                                                                                                                        var _term$46 = Kind$Term$app$(_term$45, Kind$Term$hol$(Bits$e));
                                                                                                                        var _term$47 = Kind$Term$app$(_term$46, Kind$Term$ref$($1809));
                                                                                                                        var _term$48 = Kind$Term$app$(_term$47, $1779);
                                                                                                                        var _term$49 = Kind$Term$app$(_term$48, $1794);
                                                                                                                        var _lamb$50 = Kind$Term$lam$($1750, (_e$50 => {
                                                                                                                            var $1834 = Kind$Term$lam$($1809, (_s$51 => {
                                                                                                                                var $1835 = $1824;
                                                                                                                                return $1835;
                                                                                                                            }));
                                                                                                                            return $1834;
                                                                                                                        }));
                                                                                                                        var _term$51 = Kind$Term$app$(_term$49, _lamb$50);
                                                                                                                        var _term$52 = Kind$Term$let$($1809, _term$51, (_x$52 => {
                                                                                                                            var $1836 = Kind$Term$ref$($1809);
                                                                                                                            return $1836;
                                                                                                                        }));
                                                                                                                        var $1833 = Parser$Reply$value$($1830, $1831, Kind$Term$ori$($1832, _term$52));
                                                                                                                        var $1825 = $1833;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1817 = $1825;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1810 = $1817;
                                                                                                        break;
                                                                                                };
                                                                                                var $1802 = $1810;
                                                                                                break;
                                                                                        };
                                                                                        var $1795 = $1802;
                                                                                        break;
                                                                                };
                                                                                var $1787 = $1795;
                                                                                break;
                                                                        };
                                                                        var $1780 = $1787;
                                                                        break;
                                                                };
                                                                var $1772 = $1780;
                                                                break;
                                                        };
                                                        var $1765 = $1772;
                                                        break;
                                                };
                                                var $1758 = $1765;
                                                break;
                                        };
                                        var $1751 = $1758;
                                        break;
                                };
                                var $1743 = $1751;
                                break;
                        };
                        var $1736 = $1743;
                        break;
                };
                var $1728 = $1736;
                break;
        };
        return $1728;
    };
    const Kind$Parser$forrange$u32 = x0 => x1 => Kind$Parser$forrange$u32$(x0, x1);

    function Kind$Parser$forrange$u32$2$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1838 = self.idx;
                var $1839 = self.code;
                var $1840 = self.err;
                var $1841 = Parser$Reply$error$($1838, $1839, $1840);
                var $1837 = $1841;
                break;
            case 'Parser.Reply.value':
                var $1842 = self.idx;
                var $1843 = self.code;
                var $1844 = self.val;
                var self = Kind$Parser$text$("for ", $1842, $1843);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1846 = self.idx;
                        var $1847 = self.code;
                        var $1848 = self.err;
                        var $1849 = Parser$Reply$error$($1846, $1847, $1848);
                        var $1845 = $1849;
                        break;
                    case 'Parser.Reply.value':
                        var $1850 = self.idx;
                        var $1851 = self.code;
                        var self = Kind$Parser$name1$($1850, $1851);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1853 = self.idx;
                                var $1854 = self.code;
                                var $1855 = self.err;
                                var $1856 = Parser$Reply$error$($1853, $1854, $1855);
                                var $1852 = $1856;
                                break;
                            case 'Parser.Reply.value':
                                var $1857 = self.idx;
                                var $1858 = self.code;
                                var $1859 = self.val;
                                var self = Kind$Parser$text$(":", $1857, $1858);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1861 = self.idx;
                                        var $1862 = self.code;
                                        var $1863 = self.err;
                                        var $1864 = Parser$Reply$error$($1861, $1862, $1863);
                                        var $1860 = $1864;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1865 = self.idx;
                                        var $1866 = self.code;
                                        var self = Kind$Parser$text$("U32", $1865, $1866);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1868 = self.idx;
                                                var $1869 = self.code;
                                                var $1870 = self.err;
                                                var $1871 = Parser$Reply$error$($1868, $1869, $1870);
                                                var $1867 = $1871;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1872 = self.idx;
                                                var $1873 = self.code;
                                                var self = Kind$Parser$text$("=", $1872, $1873);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1875 = self.idx;
                                                        var $1876 = self.code;
                                                        var $1877 = self.err;
                                                        var $1878 = Parser$Reply$error$($1875, $1876, $1877);
                                                        var $1874 = $1878;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1879 = self.idx;
                                                        var $1880 = self.code;
                                                        var self = Kind$Parser$term$($1879, $1880);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1882 = self.idx;
                                                                var $1883 = self.code;
                                                                var $1884 = self.err;
                                                                var $1885 = Parser$Reply$error$($1882, $1883, $1884);
                                                                var $1881 = $1885;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1886 = self.idx;
                                                                var $1887 = self.code;
                                                                var $1888 = self.val;
                                                                var self = Kind$Parser$text$("..", $1886, $1887);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1890 = self.idx;
                                                                        var $1891 = self.code;
                                                                        var $1892 = self.err;
                                                                        var $1893 = Parser$Reply$error$($1890, $1891, $1892);
                                                                        var $1889 = $1893;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1894 = self.idx;
                                                                        var $1895 = self.code;
                                                                        var self = Kind$Parser$term$($1894, $1895);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1897 = self.idx;
                                                                                var $1898 = self.code;
                                                                                var $1899 = self.err;
                                                                                var $1900 = Parser$Reply$error$($1897, $1898, $1899);
                                                                                var $1896 = $1900;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1901 = self.idx;
                                                                                var $1902 = self.code;
                                                                                var $1903 = self.val;
                                                                                var self = Kind$Parser$text$(":", $1901, $1902);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1905 = self.idx;
                                                                                        var $1906 = self.code;
                                                                                        var $1907 = self.err;
                                                                                        var $1908 = Parser$Reply$error$($1905, $1906, $1907);
                                                                                        var $1904 = $1908;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1909 = self.idx;
                                                                                        var $1910 = self.code;
                                                                                        var self = Kind$Parser$name1$($1909, $1910);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1912 = self.idx;
                                                                                                var $1913 = self.code;
                                                                                                var $1914 = self.err;
                                                                                                var $1915 = Parser$Reply$error$($1912, $1913, $1914);
                                                                                                var $1911 = $1915;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1916 = self.idx;
                                                                                                var $1917 = self.code;
                                                                                                var $1918 = self.val;
                                                                                                var self = Kind$Parser$text$("=", $1916, $1917);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1920 = self.idx;
                                                                                                        var $1921 = self.code;
                                                                                                        var $1922 = self.err;
                                                                                                        var $1923 = Parser$Reply$error$($1920, $1921, $1922);
                                                                                                        var $1919 = $1923;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1924 = self.idx;
                                                                                                        var $1925 = self.code;
                                                                                                        var self = Kind$Parser$term$($1924, $1925);
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.Reply.error':
                                                                                                                var $1927 = self.idx;
                                                                                                                var $1928 = self.code;
                                                                                                                var $1929 = self.err;
                                                                                                                var $1930 = Parser$Reply$error$($1927, $1928, $1929);
                                                                                                                var $1926 = $1930;
                                                                                                                break;
                                                                                                            case 'Parser.Reply.value':
                                                                                                                var $1931 = self.idx;
                                                                                                                var $1932 = self.code;
                                                                                                                var $1933 = self.val;
                                                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1931, $1932);
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1935 = self.idx;
                                                                                                                        var $1936 = self.code;
                                                                                                                        var $1937 = self.err;
                                                                                                                        var $1938 = Parser$Reply$error$($1935, $1936, $1937);
                                                                                                                        var $1934 = $1938;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1939 = self.idx;
                                                                                                                        var $1940 = self.code;
                                                                                                                        var self = Kind$Parser$term$($1939, $1940);
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                var $1942 = self.idx;
                                                                                                                                var $1943 = self.code;
                                                                                                                                var $1944 = self.err;
                                                                                                                                var $1945 = Parser$Reply$error$($1942, $1943, $1944);
                                                                                                                                var $1941 = $1945;
                                                                                                                                break;
                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                var $1946 = self.idx;
                                                                                                                                var $1947 = self.code;
                                                                                                                                var $1948 = self.val;
                                                                                                                                var self = Kind$Parser$stop$($1844, $1946, $1947);
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                        var $1950 = self.idx;
                                                                                                                                        var $1951 = self.code;
                                                                                                                                        var $1952 = self.err;
                                                                                                                                        var $1953 = Parser$Reply$error$($1950, $1951, $1952);
                                                                                                                                        var $1949 = $1953;
                                                                                                                                        break;
                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                        var $1954 = self.idx;
                                                                                                                                        var $1955 = self.code;
                                                                                                                                        var $1956 = self.val;
                                                                                                                                        var _term$51 = Kind$Term$ref$("U32.for");
                                                                                                                                        var _term$52 = Kind$Term$app$(_term$51, Kind$Term$hol$(Bits$e));
                                                                                                                                        var _term$53 = Kind$Term$app$(_term$52, Kind$Term$ref$($1918));
                                                                                                                                        var _term$54 = Kind$Term$app$(_term$53, $1888);
                                                                                                                                        var _term$55 = Kind$Term$app$(_term$54, $1903);
                                                                                                                                        var _lamb$56 = Kind$Term$lam$($1859, (_e$56 => {
                                                                                                                                            var $1958 = Kind$Term$lam$($1918, (_s$57 => {
                                                                                                                                                var $1959 = $1933;
                                                                                                                                                return $1959;
                                                                                                                                            }));
                                                                                                                                            return $1958;
                                                                                                                                        }));
                                                                                                                                        var _term$57 = Kind$Term$app$(_term$55, _lamb$56);
                                                                                                                                        var _term$58 = Kind$Term$let$($1918, _term$57, (_x$58 => {
                                                                                                                                            var $1960 = $1948;
                                                                                                                                            return $1960;
                                                                                                                                        }));
                                                                                                                                        var $1957 = Parser$Reply$value$($1954, $1955, Kind$Term$ori$($1956, _term$58));
                                                                                                                                        var $1949 = $1957;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1941 = $1949;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1934 = $1941;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1926 = $1934;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1919 = $1926;
                                                                                                        break;
                                                                                                };
                                                                                                var $1911 = $1919;
                                                                                                break;
                                                                                        };
                                                                                        var $1904 = $1911;
                                                                                        break;
                                                                                };
                                                                                var $1896 = $1904;
                                                                                break;
                                                                        };
                                                                        var $1889 = $1896;
                                                                        break;
                                                                };
                                                                var $1881 = $1889;
                                                                break;
                                                        };
                                                        var $1874 = $1881;
                                                        break;
                                                };
                                                var $1867 = $1874;
                                                break;
                                        };
                                        var $1860 = $1867;
                                        break;
                                };
                                var $1852 = $1860;
                                break;
                        };
                        var $1845 = $1852;
                        break;
                };
                var $1837 = $1845;
                break;
        };
        return $1837;
    };
    const Kind$Parser$forrange$u32$2 = x0 => x1 => Kind$Parser$forrange$u32$2$(x0, x1);

    function Kind$Parser$forin$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1962 = self.idx;
                var $1963 = self.code;
                var $1964 = self.err;
                var $1965 = Parser$Reply$error$($1962, $1963, $1964);
                var $1961 = $1965;
                break;
            case 'Parser.Reply.value':
                var $1966 = self.idx;
                var $1967 = self.code;
                var $1968 = self.val;
                var self = Kind$Parser$text$("for ", $1966, $1967);
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
                        var self = Kind$Parser$name1$($1974, $1975);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1977 = self.idx;
                                var $1978 = self.code;
                                var $1979 = self.err;
                                var $1980 = Parser$Reply$error$($1977, $1978, $1979);
                                var $1976 = $1980;
                                break;
                            case 'Parser.Reply.value':
                                var $1981 = self.idx;
                                var $1982 = self.code;
                                var $1983 = self.val;
                                var self = Kind$Parser$text$("in", $1981, $1982);
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
                                        var self = Kind$Parser$term$($1989, $1990);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1992 = self.idx;
                                                var $1993 = self.code;
                                                var $1994 = self.err;
                                                var $1995 = Parser$Reply$error$($1992, $1993, $1994);
                                                var $1991 = $1995;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1996 = self.idx;
                                                var $1997 = self.code;
                                                var $1998 = self.val;
                                                var self = Kind$Parser$text$("with", $1996, $1997);
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
                                                        var self = Kind$Parser$name1$($2004, $2005);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2007 = self.idx;
                                                                var $2008 = self.code;
                                                                var $2009 = self.err;
                                                                var $2010 = Parser$Reply$error$($2007, $2008, $2009);
                                                                var $2006 = $2010;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2011 = self.idx;
                                                                var $2012 = self.code;
                                                                var $2013 = self.val;
                                                                var self = Kind$Parser$text$(":", $2011, $2012);
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
                                                                        var self = Kind$Parser$term$($2019, $2020);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2022 = self.idx;
                                                                                var $2023 = self.code;
                                                                                var $2024 = self.err;
                                                                                var $2025 = Parser$Reply$error$($2022, $2023, $2024);
                                                                                var $2021 = $2025;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2026 = self.idx;
                                                                                var $2027 = self.code;
                                                                                var $2028 = self.val;
                                                                                var self = Kind$Parser$stop$($1968, $2026, $2027);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2030 = self.idx;
                                                                                        var $2031 = self.code;
                                                                                        var $2032 = self.err;
                                                                                        var $2033 = Parser$Reply$error$($2030, $2031, $2032);
                                                                                        var $2029 = $2033;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2034 = self.idx;
                                                                                        var $2035 = self.code;
                                                                                        var $2036 = self.val;
                                                                                        var _term$33 = Kind$Term$ref$("List.for");
                                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$hol$(Bits$e));
                                                                                        var _term$35 = Kind$Term$app$(_term$34, $1998);
                                                                                        var _term$36 = Kind$Term$app$(_term$35, Kind$Term$hol$(Bits$e));
                                                                                        var _term$37 = Kind$Term$app$(_term$36, Kind$Term$ref$($2013));
                                                                                        var _lamb$38 = Kind$Term$lam$($1983, (_i$38 => {
                                                                                            var $2038 = Kind$Term$lam$($2013, (_x$39 => {
                                                                                                var $2039 = $2028;
                                                                                                return $2039;
                                                                                            }));
                                                                                            return $2038;
                                                                                        }));
                                                                                        var _term$39 = Kind$Term$app$(_term$37, _lamb$38);
                                                                                        var _term$40 = Kind$Term$let$($2013, _term$39, (_x$40 => {
                                                                                            var $2040 = Kind$Term$ref$($2013);
                                                                                            return $2040;
                                                                                        }));
                                                                                        var $2037 = Parser$Reply$value$($2034, $2035, Kind$Term$ori$($2036, _term$40));
                                                                                        var $2029 = $2037;
                                                                                        break;
                                                                                };
                                                                                var $2021 = $2029;
                                                                                break;
                                                                        };
                                                                        var $2014 = $2021;
                                                                        break;
                                                                };
                                                                var $2006 = $2014;
                                                                break;
                                                        };
                                                        var $1999 = $2006;
                                                        break;
                                                };
                                                var $1991 = $1999;
                                                break;
                                        };
                                        var $1984 = $1991;
                                        break;
                                };
                                var $1976 = $1984;
                                break;
                        };
                        var $1969 = $1976;
                        break;
                };
                var $1961 = $1969;
                break;
        };
        return $1961;
    };
    const Kind$Parser$forin = x0 => x1 => Kind$Parser$forin$(x0, x1);

    function Kind$Parser$forin$2$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2042 = self.idx;
                var $2043 = self.code;
                var $2044 = self.err;
                var $2045 = Parser$Reply$error$($2042, $2043, $2044);
                var $2041 = $2045;
                break;
            case 'Parser.Reply.value':
                var $2046 = self.idx;
                var $2047 = self.code;
                var $2048 = self.val;
                var self = Kind$Parser$text$("for ", $2046, $2047);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2050 = self.idx;
                        var $2051 = self.code;
                        var $2052 = self.err;
                        var $2053 = Parser$Reply$error$($2050, $2051, $2052);
                        var $2049 = $2053;
                        break;
                    case 'Parser.Reply.value':
                        var $2054 = self.idx;
                        var $2055 = self.code;
                        var self = Kind$Parser$name1$($2054, $2055);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2057 = self.idx;
                                var $2058 = self.code;
                                var $2059 = self.err;
                                var $2060 = Parser$Reply$error$($2057, $2058, $2059);
                                var $2056 = $2060;
                                break;
                            case 'Parser.Reply.value':
                                var $2061 = self.idx;
                                var $2062 = self.code;
                                var $2063 = self.val;
                                var self = Kind$Parser$text$("in", $2061, $2062);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2065 = self.idx;
                                        var $2066 = self.code;
                                        var $2067 = self.err;
                                        var $2068 = Parser$Reply$error$($2065, $2066, $2067);
                                        var $2064 = $2068;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2069 = self.idx;
                                        var $2070 = self.code;
                                        var self = Kind$Parser$term$($2069, $2070);
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
                                                var self = Kind$Parser$text$(":", $2076, $2077);
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
                                                        var self = Kind$Parser$name1$($2084, $2085);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2087 = self.idx;
                                                                var $2088 = self.code;
                                                                var $2089 = self.err;
                                                                var $2090 = Parser$Reply$error$($2087, $2088, $2089);
                                                                var $2086 = $2090;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2091 = self.idx;
                                                                var $2092 = self.code;
                                                                var $2093 = self.val;
                                                                var self = Kind$Parser$text$("=", $2091, $2092);
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
                                                                        var self = Kind$Parser$term$($2099, $2100);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2102 = self.idx;
                                                                                var $2103 = self.code;
                                                                                var $2104 = self.err;
                                                                                var $2105 = Parser$Reply$error$($2102, $2103, $2104);
                                                                                var $2101 = $2105;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2106 = self.idx;
                                                                                var $2107 = self.code;
                                                                                var $2108 = self.val;
                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2106, $2107);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2110 = self.idx;
                                                                                        var $2111 = self.code;
                                                                                        var $2112 = self.err;
                                                                                        var $2113 = Parser$Reply$error$($2110, $2111, $2112);
                                                                                        var $2109 = $2113;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2114 = self.idx;
                                                                                        var $2115 = self.code;
                                                                                        var self = Kind$Parser$term$($2114, $2115);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2117 = self.idx;
                                                                                                var $2118 = self.code;
                                                                                                var $2119 = self.err;
                                                                                                var $2120 = Parser$Reply$error$($2117, $2118, $2119);
                                                                                                var $2116 = $2120;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2121 = self.idx;
                                                                                                var $2122 = self.code;
                                                                                                var $2123 = self.val;
                                                                                                var self = Kind$Parser$stop$($2048, $2121, $2122);
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $2125 = self.idx;
                                                                                                        var $2126 = self.code;
                                                                                                        var $2127 = self.err;
                                                                                                        var $2128 = Parser$Reply$error$($2125, $2126, $2127);
                                                                                                        var $2124 = $2128;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $2129 = self.idx;
                                                                                                        var $2130 = self.code;
                                                                                                        var $2131 = self.val;
                                                                                                        var _term$39 = Kind$Term$ref$("List.for");
                                                                                                        var _term$40 = Kind$Term$app$(_term$39, Kind$Term$hol$(Bits$e));
                                                                                                        var _term$41 = Kind$Term$app$(_term$40, $2078);
                                                                                                        var _term$42 = Kind$Term$app$(_term$41, Kind$Term$hol$(Bits$e));
                                                                                                        var _term$43 = Kind$Term$app$(_term$42, Kind$Term$ref$($2093));
                                                                                                        var _lamb$44 = Kind$Term$lam$($2063, (_i$44 => {
                                                                                                            var $2133 = Kind$Term$lam$($2093, (_x$45 => {
                                                                                                                var $2134 = $2108;
                                                                                                                return $2134;
                                                                                                            }));
                                                                                                            return $2133;
                                                                                                        }));
                                                                                                        var _term$45 = Kind$Term$app$(_term$43, _lamb$44);
                                                                                                        var _term$46 = Kind$Term$let$($2093, _term$45, (_x$46 => {
                                                                                                            var $2135 = $2123;
                                                                                                            return $2135;
                                                                                                        }));
                                                                                                        var $2132 = Parser$Reply$value$($2129, $2130, Kind$Term$ori$($2131, _term$46));
                                                                                                        var $2124 = $2132;
                                                                                                        break;
                                                                                                };
                                                                                                var $2116 = $2124;
                                                                                                break;
                                                                                        };
                                                                                        var $2109 = $2116;
                                                                                        break;
                                                                                };
                                                                                var $2101 = $2109;
                                                                                break;
                                                                        };
                                                                        var $2094 = $2101;
                                                                        break;
                                                                };
                                                                var $2086 = $2094;
                                                                break;
                                                        };
                                                        var $2079 = $2086;
                                                        break;
                                                };
                                                var $2071 = $2079;
                                                break;
                                        };
                                        var $2064 = $2071;
                                        break;
                                };
                                var $2056 = $2064;
                                break;
                        };
                        var $2049 = $2056;
                        break;
                };
                var $2041 = $2049;
                break;
        };
        return $2041;
    };
    const Kind$Parser$forin$2 = x0 => x1 => Kind$Parser$forin$2$(x0, x1);

    function Kind$Parser$do$statements$(_monad_name$1) {
        var $2136 = Parser$first_of$(List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2138 = self.idx;
                    var $2139 = self.code;
                    var $2140 = self.err;
                    var $2141 = Parser$Reply$error$($2138, $2139, $2140);
                    var $2137 = $2141;
                    break;
                case 'Parser.Reply.value':
                    var $2142 = self.idx;
                    var $2143 = self.code;
                    var $2144 = self.val;
                    var self = Kind$Parser$text$("var ", $2142, $2143);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2146 = self.idx;
                            var $2147 = self.code;
                            var $2148 = self.err;
                            var $2149 = Parser$Reply$error$($2146, $2147, $2148);
                            var $2145 = $2149;
                            break;
                        case 'Parser.Reply.value':
                            var $2150 = self.idx;
                            var $2151 = self.code;
                            var self = Kind$Parser$name1$($2150, $2151);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2153 = self.idx;
                                    var $2154 = self.code;
                                    var $2155 = self.err;
                                    var $2156 = Parser$Reply$error$($2153, $2154, $2155);
                                    var $2152 = $2156;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2157 = self.idx;
                                    var $2158 = self.code;
                                    var $2159 = self.val;
                                    var self = Kind$Parser$text$("=", $2157, $2158);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2161 = self.idx;
                                            var $2162 = self.code;
                                            var $2163 = self.err;
                                            var $2164 = Parser$Reply$error$($2161, $2162, $2163);
                                            var $2160 = $2164;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2165 = self.idx;
                                            var $2166 = self.code;
                                            var self = Kind$Parser$term$($2165, $2166);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2168 = self.idx;
                                                    var $2169 = self.code;
                                                    var $2170 = self.err;
                                                    var $2171 = Parser$Reply$error$($2168, $2169, $2170);
                                                    var $2167 = $2171;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2172 = self.idx;
                                                    var $2173 = self.code;
                                                    var $2174 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2172, $2173);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2176 = self.idx;
                                                            var $2177 = self.code;
                                                            var $2178 = self.err;
                                                            var $2179 = Parser$Reply$error$($2176, $2177, $2178);
                                                            var $2175 = $2179;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2180 = self.idx;
                                                            var $2181 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($2180)($2181);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $2183 = self.idx;
                                                                    var $2184 = self.code;
                                                                    var $2185 = self.err;
                                                                    var $2186 = Parser$Reply$error$($2183, $2184, $2185);
                                                                    var $2182 = $2186;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $2187 = self.idx;
                                                                    var $2188 = self.code;
                                                                    var $2189 = self.val;
                                                                    var self = Kind$Parser$stop$($2144, $2187, $2188);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $2191 = self.idx;
                                                                            var $2192 = self.code;
                                                                            var $2193 = self.err;
                                                                            var $2194 = Parser$Reply$error$($2191, $2192, $2193);
                                                                            var $2190 = $2194;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2195 = self.idx;
                                                                            var $2196 = self.code;
                                                                            var $2197 = self.val;
                                                                            var _term$28 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                                            var _term$29 = Kind$Term$app$(_term$28, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                                            var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                            var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                            var _term$32 = Kind$Term$app$(_term$31, $2174);
                                                                            var _term$33 = Kind$Term$app$(_term$32, Kind$Term$lam$($2159, (_x$33 => {
                                                                                var $2199 = $2189;
                                                                                return $2199;
                                                                            })));
                                                                            var $2198 = Parser$Reply$value$($2195, $2196, Kind$Term$ori$($2197, _term$33));
                                                                            var $2190 = $2198;
                                                                            break;
                                                                    };
                                                                    var $2182 = $2190;
                                                                    break;
                                                            };
                                                            var $2175 = $2182;
                                                            break;
                                                    };
                                                    var $2167 = $2175;
                                                    break;
                                            };
                                            var $2160 = $2167;
                                            break;
                                    };
                                    var $2152 = $2160;
                                    break;
                            };
                            var $2145 = $2152;
                            break;
                    };
                    var $2137 = $2145;
                    break;
            };
            return $2137;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2201 = self.idx;
                    var $2202 = self.code;
                    var $2203 = self.err;
                    var $2204 = Parser$Reply$error$($2201, $2202, $2203);
                    var $2200 = $2204;
                    break;
                case 'Parser.Reply.value':
                    var $2205 = self.idx;
                    var $2206 = self.code;
                    var $2207 = self.val;
                    var self = Kind$Parser$text$("let ", $2205, $2206);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2209 = self.idx;
                            var $2210 = self.code;
                            var $2211 = self.err;
                            var $2212 = Parser$Reply$error$($2209, $2210, $2211);
                            var $2208 = $2212;
                            break;
                        case 'Parser.Reply.value':
                            var $2213 = self.idx;
                            var $2214 = self.code;
                            var self = Kind$Parser$name1$($2213, $2214);
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
                                    var $2222 = self.val;
                                    var self = Kind$Parser$text$("=", $2220, $2221);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2224 = self.idx;
                                            var $2225 = self.code;
                                            var $2226 = self.err;
                                            var $2227 = Parser$Reply$error$($2224, $2225, $2226);
                                            var $2223 = $2227;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2228 = self.idx;
                                            var $2229 = self.code;
                                            var self = Kind$Parser$term$($2228, $2229);
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
                                                    var $2237 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2235, $2236);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2239 = self.idx;
                                                            var $2240 = self.code;
                                                            var $2241 = self.err;
                                                            var $2242 = Parser$Reply$error$($2239, $2240, $2241);
                                                            var $2238 = $2242;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2243 = self.idx;
                                                            var $2244 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($2243)($2244);
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
                                                                    var $2252 = self.val;
                                                                    var self = Kind$Parser$stop$($2207, $2250, $2251);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $2254 = self.idx;
                                                                            var $2255 = self.code;
                                                                            var $2256 = self.err;
                                                                            var $2257 = Parser$Reply$error$($2254, $2255, $2256);
                                                                            var $2253 = $2257;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2258 = self.idx;
                                                                            var $2259 = self.code;
                                                                            var $2260 = self.val;
                                                                            var $2261 = Parser$Reply$value$($2258, $2259, Kind$Term$ori$($2260, Kind$Term$let$($2222, $2237, (_x$28 => {
                                                                                var $2262 = $2252;
                                                                                return $2262;
                                                                            }))));
                                                                            var $2253 = $2261;
                                                                            break;
                                                                    };
                                                                    var $2245 = $2253;
                                                                    break;
                                                            };
                                                            var $2238 = $2245;
                                                            break;
                                                    };
                                                    var $2230 = $2238;
                                                    break;
                                            };
                                            var $2223 = $2230;
                                            break;
                                    };
                                    var $2215 = $2223;
                                    break;
                            };
                            var $2208 = $2215;
                            break;
                    };
                    var $2200 = $2208;
                    break;
            };
            return $2200;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2264 = self.idx;
                    var $2265 = self.code;
                    var $2266 = self.err;
                    var $2267 = Parser$Reply$error$($2264, $2265, $2266);
                    var $2263 = $2267;
                    break;
                case 'Parser.Reply.value':
                    var $2268 = self.idx;
                    var $2269 = self.code;
                    var $2270 = self.val;
                    var self = Kind$Parser$text$("return ", $2268, $2269);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2272 = self.idx;
                            var $2273 = self.code;
                            var $2274 = self.err;
                            var $2275 = Parser$Reply$error$($2272, $2273, $2274);
                            var $2271 = $2275;
                            break;
                        case 'Parser.Reply.value':
                            var $2276 = self.idx;
                            var $2277 = self.code;
                            var self = Kind$Parser$term$($2276, $2277);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2279 = self.idx;
                                    var $2280 = self.code;
                                    var $2281 = self.err;
                                    var $2282 = Parser$Reply$error$($2279, $2280, $2281);
                                    var $2278 = $2282;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2283 = self.idx;
                                    var $2284 = self.code;
                                    var $2285 = self.val;
                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2283, $2284);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2287 = self.idx;
                                            var $2288 = self.code;
                                            var $2289 = self.err;
                                            var $2290 = Parser$Reply$error$($2287, $2288, $2289);
                                            var $2286 = $2290;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2291 = self.idx;
                                            var $2292 = self.code;
                                            var self = Kind$Parser$stop$($2270, $2291, $2292);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2294 = self.idx;
                                                    var $2295 = self.code;
                                                    var $2296 = self.err;
                                                    var $2297 = Parser$Reply$error$($2294, $2295, $2296);
                                                    var $2293 = $2297;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2298 = self.idx;
                                                    var $2299 = self.code;
                                                    var $2300 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.pure"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, $2285);
                                                    var $2301 = Parser$Reply$value$($2298, $2299, Kind$Term$ori$($2300, _term$22));
                                                    var $2293 = $2301;
                                                    break;
                                            };
                                            var $2286 = $2293;
                                            break;
                                    };
                                    var $2278 = $2286;
                                    break;
                            };
                            var $2271 = $2278;
                            break;
                    };
                    var $2263 = $2271;
                    break;
            };
            return $2263;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2303 = self.idx;
                    var $2304 = self.code;
                    var $2305 = self.err;
                    var $2306 = Parser$Reply$error$($2303, $2304, $2305);
                    var $2302 = $2306;
                    break;
                case 'Parser.Reply.value':
                    var $2307 = self.idx;
                    var $2308 = self.code;
                    var $2309 = self.val;
                    var self = Kind$Parser$term$($2307, $2308);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2311 = self.idx;
                            var $2312 = self.code;
                            var $2313 = self.err;
                            var $2314 = Parser$Reply$error$($2311, $2312, $2313);
                            var $2310 = $2314;
                            break;
                        case 'Parser.Reply.value':
                            var $2315 = self.idx;
                            var $2316 = self.code;
                            var $2317 = self.val;
                            var self = Parser$maybe$(Kind$Parser$text(";"), $2315, $2316);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2319 = self.idx;
                                    var $2320 = self.code;
                                    var $2321 = self.err;
                                    var $2322 = Parser$Reply$error$($2319, $2320, $2321);
                                    var $2318 = $2322;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2323 = self.idx;
                                    var $2324 = self.code;
                                    var self = Kind$Parser$do$statements$(_monad_name$1)($2323)($2324);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2326 = self.idx;
                                            var $2327 = self.code;
                                            var $2328 = self.err;
                                            var $2329 = Parser$Reply$error$($2326, $2327, $2328);
                                            var $2325 = $2329;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2330 = self.idx;
                                            var $2331 = self.code;
                                            var $2332 = self.val;
                                            var self = Kind$Parser$stop$($2309, $2330, $2331);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2334 = self.idx;
                                                    var $2335 = self.code;
                                                    var $2336 = self.err;
                                                    var $2337 = Parser$Reply$error$($2334, $2335, $2336);
                                                    var $2333 = $2337;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2338 = self.idx;
                                                    var $2339 = self.code;
                                                    var $2340 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, Kind$Term$hol$(Bits$e));
                                                    var _term$23 = Kind$Term$app$(_term$22, $2317);
                                                    var _term$24 = Kind$Term$app$(_term$23, Kind$Term$lam$("", (_x$24 => {
                                                        var $2342 = $2332;
                                                        return $2342;
                                                    })));
                                                    var $2341 = Parser$Reply$value$($2338, $2339, Kind$Term$ori$($2340, _term$24));
                                                    var $2333 = $2341;
                                                    break;
                                            };
                                            var $2325 = $2333;
                                            break;
                                    };
                                    var $2318 = $2325;
                                    break;
                            };
                            var $2310 = $2318;
                            break;
                    };
                    var $2302 = $2310;
                    break;
            };
            return $2302;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$term$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2344 = self.idx;
                    var $2345 = self.code;
                    var $2346 = self.err;
                    var $2347 = Parser$Reply$error$($2344, $2345, $2346);
                    var $2343 = $2347;
                    break;
                case 'Parser.Reply.value':
                    var $2348 = self.idx;
                    var $2349 = self.code;
                    var $2350 = self.val;
                    var self = Parser$maybe$(Kind$Parser$text(";"), $2348, $2349);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2352 = self.idx;
                            var $2353 = self.code;
                            var $2354 = self.err;
                            var $2355 = Parser$Reply$error$($2352, $2353, $2354);
                            var $2351 = $2355;
                            break;
                        case 'Parser.Reply.value':
                            var $2356 = self.idx;
                            var $2357 = self.code;
                            var $2358 = Parser$Reply$value$($2356, $2357, $2350);
                            var $2351 = $2358;
                            break;
                    };
                    var $2343 = $2351;
                    break;
            };
            return $2343;
        }), List$nil))))));
        return $2136;
    };
    const Kind$Parser$do$statements = x0 => Kind$Parser$do$statements$(x0);

    function Kind$Parser$do$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("do ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2360 = self.idx;
                var $2361 = self.code;
                var $2362 = self.err;
                var $2363 = Parser$Reply$error$($2360, $2361, $2362);
                var $2359 = $2363;
                break;
            case 'Parser.Reply.value':
                var $2364 = self.idx;
                var $2365 = self.code;
                var self = Kind$Parser$name1$($2364, $2365);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2367 = self.idx;
                        var $2368 = self.code;
                        var $2369 = self.err;
                        var $2370 = Parser$Reply$error$($2367, $2368, $2369);
                        var $2366 = $2370;
                        break;
                    case 'Parser.Reply.value':
                        var $2371 = self.idx;
                        var $2372 = self.code;
                        var $2373 = self.val;
                        var self = Kind$Parser$text$("{", $2371, $2372);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2375 = self.idx;
                                var $2376 = self.code;
                                var $2377 = self.err;
                                var $2378 = Parser$Reply$error$($2375, $2376, $2377);
                                var $2374 = $2378;
                                break;
                            case 'Parser.Reply.value':
                                var $2379 = self.idx;
                                var $2380 = self.code;
                                var self = Kind$Parser$do$statements$($2373)($2379)($2380);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2382 = self.idx;
                                        var $2383 = self.code;
                                        var $2384 = self.err;
                                        var $2385 = Parser$Reply$error$($2382, $2383, $2384);
                                        var $2381 = $2385;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2386 = self.idx;
                                        var $2387 = self.code;
                                        var $2388 = self.val;
                                        var self = Kind$Parser$text$("}", $2386, $2387);
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
                                                var $2396 = Parser$Reply$value$($2394, $2395, $2388);
                                                var $2389 = $2396;
                                                break;
                                        };
                                        var $2381 = $2389;
                                        break;
                                };
                                var $2374 = $2381;
                                break;
                        };
                        var $2366 = $2374;
                        break;
                };
                var $2359 = $2366;
                break;
        };
        return $2359;
    };
    const Kind$Parser$do = x0 => x1 => Kind$Parser$do$(x0, x1);

    function Kind$Term$nat$(_natx$1) {
        var $2397 = ({
            _: 'Kind.Term.nat',
            'natx': _natx$1
        });
        return $2397;
    };
    const Kind$Term$nat = x0 => Kind$Term$nat$(x0);

    function Kind$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $2399 = Kind$Term$ref$(Kind$Name$read$("Nat.zero"));
            var $2398 = $2399;
        } else {
            var $2400 = (self - 1n);
            var _func$3 = Kind$Term$ref$(Kind$Name$read$("Nat.succ"));
            var _argm$4 = Kind$Term$nat$($2400);
            var $2401 = Kind$Term$app$(_func$3, _argm$4);
            var $2398 = $2401;
        };
        return $2398;
    };
    const Kind$Term$unroll_nat = x0 => Kind$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Kind$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2403 = self.slice(0, -1);
                var $2404 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.o")), Kind$Term$unroll_chr$bits$($2403));
                var $2402 = $2404;
                break;
            case 'i':
                var $2405 = self.slice(0, -1);
                var $2406 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.i")), Kind$Term$unroll_chr$bits$($2405));
                var $2402 = $2406;
                break;
            case 'e':
                var $2407 = Kind$Term$ref$(Kind$Name$read$("Bits.e"));
                var $2402 = $2407;
                break;
        };
        return $2402;
    };
    const Kind$Term$unroll_chr$bits = x0 => Kind$Term$unroll_chr$bits$(x0);

    function Kind$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Kind$Term$ref$(Kind$Name$read$("Word.from_bits"));
        var _term$4 = Kind$Term$app$(_term$3, Kind$Term$nat$(16n));
        var _term$5 = Kind$Term$app$(_term$4, Kind$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("U16.new")), _term$5);
        var $2408 = _term$6;
        return $2408;
    };
    const Kind$Term$unroll_chr = x0 => Kind$Term$unroll_chr$(x0);

    function Kind$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $2410 = Kind$Term$ref$(Kind$Name$read$("String.nil"));
            var $2409 = $2410;
        } else {
            var $2411 = self.charCodeAt(0);
            var $2412 = self.slice(1);
            var _char$4 = Kind$Term$chr$($2411);
            var _term$5 = Kind$Term$ref$(Kind$Name$read$("String.cons"));
            var _term$6 = Kind$Term$app$(_term$5, _char$4);
            var _term$7 = Kind$Term$app$(_term$6, Kind$Term$str$($2412));
            var $2413 = _term$7;
            var $2409 = $2413;
        };
        return $2409;
    };
    const Kind$Term$unroll_str = x0 => Kind$Term$unroll_str$(x0);

    function Kind$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $2415 = self.name;
                var self = Kind$get$($2415, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $2417 = self.value;
                        var self = $2417;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $2419 = self.term;
                                var $2420 = Kind$Term$reduce$($2419, _defs$2);
                                var $2418 = $2420;
                                break;
                        };
                        var $2416 = $2418;
                        break;
                    case 'Maybe.none':
                        var $2421 = Kind$Term$ref$($2415);
                        var $2416 = $2421;
                        break;
                };
                var $2414 = $2416;
                break;
            case 'Kind.Term.app':
                var $2422 = self.func;
                var $2423 = self.argm;
                var _func$5 = Kind$Term$reduce$($2422, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $2425 = self.body;
                        var $2426 = Kind$Term$reduce$($2425($2423), _defs$2);
                        var $2424 = $2426;
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
                        var $2427 = _term$1;
                        var $2424 = $2427;
                        break;
                };
                var $2414 = $2424;
                break;
            case 'Kind.Term.let':
                var $2428 = self.expr;
                var $2429 = self.body;
                var $2430 = Kind$Term$reduce$($2429($2428), _defs$2);
                var $2414 = $2430;
                break;
            case 'Kind.Term.def':
                var $2431 = self.expr;
                var $2432 = self.body;
                var $2433 = Kind$Term$reduce$($2432($2431), _defs$2);
                var $2414 = $2433;
                break;
            case 'Kind.Term.ann':
                var $2434 = self.term;
                var $2435 = Kind$Term$reduce$($2434, _defs$2);
                var $2414 = $2435;
                break;
            case 'Kind.Term.nat':
                var $2436 = self.natx;
                var $2437 = Kind$Term$reduce$(Kind$Term$unroll_nat$($2436), _defs$2);
                var $2414 = $2437;
                break;
            case 'Kind.Term.chr':
                var $2438 = self.chrx;
                var $2439 = Kind$Term$reduce$(Kind$Term$unroll_chr$($2438), _defs$2);
                var $2414 = $2439;
                break;
            case 'Kind.Term.str':
                var $2440 = self.strx;
                var $2441 = Kind$Term$reduce$(Kind$Term$unroll_str$($2440), _defs$2);
                var $2414 = $2441;
                break;
            case 'Kind.Term.ori':
                var $2442 = self.expr;
                var $2443 = Kind$Term$reduce$($2442, _defs$2);
                var $2414 = $2443;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.cse':
                var $2444 = _term$1;
                var $2414 = $2444;
                break;
        };
        return $2414;
    };
    const Kind$Term$reduce = x0 => x1 => Kind$Term$reduce$(x0, x1);
    const Map$new = ({
        _: 'Map.new'
    });

    function Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$9) {
        var $2445 = ({
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
        return $2445;
    };
    const Kind$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Def$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const Kind$Status$init = ({
        _: 'Kind.Status.init'
    });

    function Kind$Parser$case$with$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("with", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2447 = self.idx;
                var $2448 = self.code;
                var $2449 = self.err;
                var $2450 = Parser$Reply$error$($2447, $2448, $2449);
                var $2446 = $2450;
                break;
            case 'Parser.Reply.value':
                var $2451 = self.idx;
                var $2452 = self.code;
                var self = Kind$Parser$name1$($2451, $2452);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2454 = self.idx;
                        var $2455 = self.code;
                        var $2456 = self.err;
                        var $2457 = Parser$Reply$error$($2454, $2455, $2456);
                        var $2453 = $2457;
                        break;
                    case 'Parser.Reply.value':
                        var $2458 = self.idx;
                        var $2459 = self.code;
                        var $2460 = self.val;
                        var self = Kind$Parser$text$(":", $2458, $2459);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2462 = self.idx;
                                var $2463 = self.code;
                                var $2464 = self.err;
                                var $2465 = Parser$Reply$error$($2462, $2463, $2464);
                                var $2461 = $2465;
                                break;
                            case 'Parser.Reply.value':
                                var $2466 = self.idx;
                                var $2467 = self.code;
                                var self = Kind$Parser$term$($2466, $2467);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2469 = self.idx;
                                        var $2470 = self.code;
                                        var $2471 = self.err;
                                        var $2472 = Parser$Reply$error$($2469, $2470, $2471);
                                        var $2468 = $2472;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2473 = self.idx;
                                        var $2474 = self.code;
                                        var $2475 = self.val;
                                        var self = Kind$Parser$text$("=", $2473, $2474);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2477 = self.idx;
                                                var $2478 = self.code;
                                                var $2479 = self.err;
                                                var $2480 = Parser$Reply$error$($2477, $2478, $2479);
                                                var $2476 = $2480;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2481 = self.idx;
                                                var $2482 = self.code;
                                                var self = Kind$Parser$term$($2481, $2482);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2484 = self.idx;
                                                        var $2485 = self.code;
                                                        var $2486 = self.err;
                                                        var $2487 = Parser$Reply$error$($2484, $2485, $2486);
                                                        var $2483 = $2487;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2488 = self.idx;
                                                        var $2489 = self.code;
                                                        var $2490 = self.val;
                                                        var $2491 = Parser$Reply$value$($2488, $2489, Kind$Def$new$("", "", Pair$new$(0n, 0n), $2460, $2490, $2475, Bool$false, 0n, Kind$Status$init));
                                                        var $2483 = $2491;
                                                        break;
                                                };
                                                var $2476 = $2483;
                                                break;
                                        };
                                        var $2468 = $2476;
                                        break;
                                };
                                var $2461 = $2468;
                                break;
                        };
                        var $2453 = $2461;
                        break;
                };
                var $2446 = $2453;
                break;
        };
        return $2446;
    };
    const Kind$Parser$case$with = x0 => x1 => Kind$Parser$case$with$(x0, x1);

    function Kind$Parser$case$case$(_idx$1, _code$2) {
        var self = Kind$Parser$name1$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2493 = self.idx;
                var $2494 = self.code;
                var $2495 = self.err;
                var $2496 = Parser$Reply$error$($2493, $2494, $2495);
                var $2492 = $2496;
                break;
            case 'Parser.Reply.value':
                var $2497 = self.idx;
                var $2498 = self.code;
                var $2499 = self.val;
                var self = Kind$Parser$text$(":", $2497, $2498);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2501 = self.idx;
                        var $2502 = self.code;
                        var $2503 = self.err;
                        var $2504 = Parser$Reply$error$($2501, $2502, $2503);
                        var $2500 = $2504;
                        break;
                    case 'Parser.Reply.value':
                        var $2505 = self.idx;
                        var $2506 = self.code;
                        var self = Kind$Parser$term$($2505, $2506);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2508 = self.idx;
                                var $2509 = self.code;
                                var $2510 = self.err;
                                var $2511 = Parser$Reply$error$($2508, $2509, $2510);
                                var $2507 = $2511;
                                break;
                            case 'Parser.Reply.value':
                                var $2512 = self.idx;
                                var $2513 = self.code;
                                var $2514 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text(","), $2512, $2513);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2516 = self.idx;
                                        var $2517 = self.code;
                                        var $2518 = self.err;
                                        var $2519 = Parser$Reply$error$($2516, $2517, $2518);
                                        var $2515 = $2519;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2520 = self.idx;
                                        var $2521 = self.code;
                                        var $2522 = Parser$Reply$value$($2520, $2521, Pair$new$($2499, $2514));
                                        var $2515 = $2522;
                                        break;
                                };
                                var $2507 = $2515;
                                break;
                        };
                        var $2500 = $2507;
                        break;
                };
                var $2492 = $2500;
                break;
        };
        return $2492;
    };
    const Kind$Parser$case$case = x0 => x1 => Kind$Parser$case$case$(x0, x1);

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $2523 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $2523;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2525 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2527 = self.val;
                        var $2528 = self.lft;
                        var $2529 = self.rgt;
                        var $2530 = Map$tie$($2527, Map$set$($2525, _val$3, $2528), $2529);
                        var $2526 = $2530;
                        break;
                    case 'Map.new':
                        var $2531 = Map$tie$(Maybe$none, Map$set$($2525, _val$3, Map$new), Map$new);
                        var $2526 = $2531;
                        break;
                };
                var $2524 = $2526;
                break;
            case 'i':
                var $2532 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2534 = self.val;
                        var $2535 = self.lft;
                        var $2536 = self.rgt;
                        var $2537 = Map$tie$($2534, $2535, Map$set$($2532, _val$3, $2536));
                        var $2533 = $2537;
                        break;
                    case 'Map.new':
                        var $2538 = Map$tie$(Maybe$none, Map$new, Map$set$($2532, _val$3, Map$new));
                        var $2533 = $2538;
                        break;
                };
                var $2524 = $2533;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2540 = self.lft;
                        var $2541 = self.rgt;
                        var $2542 = Map$tie$(Maybe$some$(_val$3), $2540, $2541);
                        var $2539 = $2542;
                        break;
                    case 'Map.new':
                        var $2543 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $2539 = $2543;
                        break;
                };
                var $2524 = $2539;
                break;
        };
        return $2524;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $2545 = self.head;
                var $2546 = self.tail;
                var self = $2545;
                switch (self._) {
                    case 'Pair.new':
                        var $2548 = self.fst;
                        var $2549 = self.snd;
                        var $2550 = Map$set$($2548, $2549, Map$from_list$($2546));
                        var $2547 = $2550;
                        break;
                };
                var $2544 = $2547;
                break;
            case 'List.nil':
                var $2551 = Map$new;
                var $2544 = $2551;
                break;
        };
        return $2544;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2553 = self.fst;
                var $2554 = $2553;
                var $2552 = $2554;
                break;
        };
        return $2552;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2556 = self.snd;
                var $2557 = $2556;
                var $2555 = $2557;
                break;
        };
        return $2555;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Kind$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $2558 = ({
            _: 'Kind.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $2558;
    };
    const Kind$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$cse$(x0, x1, x2, x3, x4, x5);

    function Kind$Parser$case$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $2566 = self.val;
                var self = Kind$Parser$text$("case ", $2564, $2565);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2568 = self.idx;
                        var $2569 = self.code;
                        var $2570 = self.err;
                        var $2571 = Parser$Reply$error$($2568, $2569, $2570);
                        var $2567 = $2571;
                        break;
                    case 'Parser.Reply.value':
                        var $2572 = self.idx;
                        var $2573 = self.code;
                        var self = Kind$Parser$spaces($2572)($2573);
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
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2591 = self.idx;
                                                    var $2592 = self.code;
                                                    var $2593 = self.err;
                                                    var $2594 = Parser$Reply$error$($2591, $2592, $2593);
                                                    var $2590 = $2594;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2595 = self.idx;
                                                    var $2596 = self.code;
                                                    var $2597 = Kind$Parser$name1$($2595, $2596);
                                                    var $2590 = $2597;
                                                    break;
                                            };
                                            return $2590;
                                        }), $2586, $2587);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2598 = self.idx;
                                                var $2599 = self.code;
                                                var $2600 = self.err;
                                                var $2601 = Parser$Reply$error$($2598, $2599, $2600);
                                                var $2589 = $2601;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2602 = self.idx;
                                                var $2603 = self.code;
                                                var $2604 = self.val;
                                                var self = $2604;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2606 = self.value;
                                                        var $2607 = $2606;
                                                        var _name$18 = $2607;
                                                        break;
                                                    case 'Maybe.none':
                                                        var self = Kind$Term$reduce$($2588, Map$new);
                                                        switch (self._) {
                                                            case 'Kind.Term.var':
                                                                var $2609 = self.name;
                                                                var $2610 = $2609;
                                                                var $2608 = $2610;
                                                                break;
                                                            case 'Kind.Term.ref':
                                                                var $2611 = self.name;
                                                                var $2612 = $2611;
                                                                var $2608 = $2612;
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
                                                                var $2613 = Kind$Name$read$("self");
                                                                var $2608 = $2613;
                                                                break;
                                                        };
                                                        var _name$18 = $2608;
                                                        break;
                                                };
                                                var self = Parser$many$(Kind$Parser$case$with)($2602)($2603);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2614 = self.idx;
                                                        var $2615 = self.code;
                                                        var $2616 = self.err;
                                                        var $2617 = Parser$Reply$error$($2614, $2615, $2616);
                                                        var $2605 = $2617;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2618 = self.idx;
                                                        var $2619 = self.code;
                                                        var $2620 = self.val;
                                                        var self = Kind$Parser$text$("{", $2618, $2619);
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
                                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$case$case)($2626)($2627);
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
                                                                        var _cses$28 = Map$from_list$(List$mapped$($2635, (_x$28 => {
                                                                            var $2637 = Pair$new$((kind_name_to_bits(Pair$fst$(_x$28))), Pair$snd$(_x$28));
                                                                            return $2637;
                                                                        })));
                                                                        var self = Parser$first_of$(List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$(":", _idx$29, _code$30);
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
                                                                                    var self = Kind$Parser$term$($2643, $2644);
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $2646 = self.idx;
                                                                                            var $2647 = self.code;
                                                                                            var $2648 = self.err;
                                                                                            var $2649 = Parser$Reply$error$($2646, $2647, $2648);
                                                                                            var $2645 = $2649;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $2650 = self.idx;
                                                                                            var $2651 = self.code;
                                                                                            var $2652 = self.val;
                                                                                            var $2653 = Parser$Reply$value$($2650, $2651, Maybe$some$($2652));
                                                                                            var $2645 = $2653;
                                                                                            break;
                                                                                    };
                                                                                    var $2638 = $2645;
                                                                                    break;
                                                                            };
                                                                            return $2638;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$("!", _idx$29, _code$30);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2655 = self.idx;
                                                                                    var $2656 = self.code;
                                                                                    var $2657 = self.err;
                                                                                    var $2658 = Parser$Reply$error$($2655, $2656, $2657);
                                                                                    var $2654 = $2658;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2659 = self.idx;
                                                                                    var $2660 = self.code;
                                                                                    var $2661 = Parser$Reply$value$($2659, $2660, Maybe$none);
                                                                                    var $2654 = $2661;
                                                                                    break;
                                                                            };
                                                                            return $2654;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var $2662 = Parser$Reply$value$(_idx$29, _code$30, Maybe$some$(Kind$Term$hol$(Bits$e)));
                                                                            return $2662;
                                                                        }), List$nil))))($2633)($2634);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2663 = self.idx;
                                                                                var $2664 = self.code;
                                                                                var $2665 = self.err;
                                                                                var $2666 = Parser$Reply$error$($2663, $2664, $2665);
                                                                                var $2636 = $2666;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2667 = self.idx;
                                                                                var $2668 = self.code;
                                                                                var $2669 = self.val;
                                                                                var self = Kind$Parser$stop$($2566, $2667, $2668);
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
                                                                                        var $2677 = self.val;
                                                                                        var $2678 = Parser$Reply$value$($2675, $2676, Kind$Term$ori$($2677, Kind$Term$cse$(Bits$e, $2588, _name$18, $2620, _cses$28, $2669)));
                                                                                        var $2670 = $2678;
                                                                                        break;
                                                                                };
                                                                                var $2636 = $2670;
                                                                                break;
                                                                        };
                                                                        var $2628 = $2636;
                                                                        break;
                                                                };
                                                                var $2621 = $2628;
                                                                break;
                                                        };
                                                        var $2605 = $2621;
                                                        break;
                                                };
                                                var $2589 = $2605;
                                                break;
                                        };
                                        var $2581 = $2589;
                                        break;
                                };
                                var $2574 = $2581;
                                break;
                        };
                        var $2567 = $2574;
                        break;
                };
                var $2559 = $2567;
                break;
        };
        return $2559;
    };
    const Kind$Parser$case = x0 => x1 => Kind$Parser$case$(x0, x1);

    function Kind$set$(_name$2, _val$3, _map$4) {
        var $2679 = Map$set$((kind_name_to_bits(_name$2)), _val$3, _map$4);
        return $2679;
    };
    const Kind$set = x0 => x1 => x2 => Kind$set$(x0, x1, x2);

    function Kind$Parser$open$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2681 = self.idx;
                var $2682 = self.code;
                var $2683 = self.err;
                var $2684 = Parser$Reply$error$($2681, $2682, $2683);
                var $2680 = $2684;
                break;
            case 'Parser.Reply.value':
                var $2685 = self.idx;
                var $2686 = self.code;
                var $2687 = self.val;
                var self = Kind$Parser$text$("open ", $2685, $2686);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2689 = self.idx;
                        var $2690 = self.code;
                        var $2691 = self.err;
                        var $2692 = Parser$Reply$error$($2689, $2690, $2691);
                        var $2688 = $2692;
                        break;
                    case 'Parser.Reply.value':
                        var $2693 = self.idx;
                        var $2694 = self.code;
                        var self = Kind$Parser$spaces($2693)($2694);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2696 = self.idx;
                                var $2697 = self.code;
                                var $2698 = self.err;
                                var $2699 = Parser$Reply$error$($2696, $2697, $2698);
                                var $2695 = $2699;
                                break;
                            case 'Parser.Reply.value':
                                var $2700 = self.idx;
                                var $2701 = self.code;
                                var self = Kind$Parser$term$($2700, $2701);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2703 = self.idx;
                                        var $2704 = self.code;
                                        var $2705 = self.err;
                                        var $2706 = Parser$Reply$error$($2703, $2704, $2705);
                                        var $2702 = $2706;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2707 = self.idx;
                                        var $2708 = self.code;
                                        var $2709 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2712 = self.idx;
                                                    var $2713 = self.code;
                                                    var $2714 = self.err;
                                                    var $2715 = Parser$Reply$error$($2712, $2713, $2714);
                                                    var $2711 = $2715;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2716 = self.idx;
                                                    var $2717 = self.code;
                                                    var $2718 = Kind$Parser$name1$($2716, $2717);
                                                    var $2711 = $2718;
                                                    break;
                                            };
                                            return $2711;
                                        }), $2707, $2708);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2719 = self.idx;
                                                var $2720 = self.code;
                                                var $2721 = self.err;
                                                var $2722 = Parser$Reply$error$($2719, $2720, $2721);
                                                var $2710 = $2722;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2723 = self.idx;
                                                var $2724 = self.code;
                                                var $2725 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2723, $2724);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2727 = self.idx;
                                                        var $2728 = self.code;
                                                        var $2729 = self.err;
                                                        var $2730 = Parser$Reply$error$($2727, $2728, $2729);
                                                        var $2726 = $2730;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2731 = self.idx;
                                                        var $2732 = self.code;
                                                        var self = $2725;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2734 = self.value;
                                                                var $2735 = $2734;
                                                                var _name$21 = $2735;
                                                                break;
                                                            case 'Maybe.none':
                                                                var self = Kind$Term$reduce$($2709, Map$new);
                                                                switch (self._) {
                                                                    case 'Kind.Term.var':
                                                                        var $2737 = self.name;
                                                                        var $2738 = $2737;
                                                                        var $2736 = $2738;
                                                                        break;
                                                                    case 'Kind.Term.ref':
                                                                        var $2739 = self.name;
                                                                        var $2740 = $2739;
                                                                        var $2736 = $2740;
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
                                                                        var $2741 = Kind$Name$read$("self");
                                                                        var $2736 = $2741;
                                                                        break;
                                                                };
                                                                var _name$21 = $2736;
                                                                break;
                                                        };
                                                        var _wyth$22 = List$nil;
                                                        var self = Kind$Parser$term$($2731, $2732);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2742 = self.idx;
                                                                var $2743 = self.code;
                                                                var $2744 = self.err;
                                                                var $2745 = Parser$Reply$error$($2742, $2743, $2744);
                                                                var $2733 = $2745;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2746 = self.idx;
                                                                var $2747 = self.code;
                                                                var $2748 = self.val;
                                                                var _cses$26 = Kind$set$("_", $2748, Map$new);
                                                                var _moti$27 = Maybe$some$(Kind$Term$hol$(Bits$e));
                                                                var self = Kind$Parser$stop$($2687, $2746, $2747);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2750 = self.idx;
                                                                        var $2751 = self.code;
                                                                        var $2752 = self.err;
                                                                        var $2753 = Parser$Reply$error$($2750, $2751, $2752);
                                                                        var $2749 = $2753;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2754 = self.idx;
                                                                        var $2755 = self.code;
                                                                        var $2756 = self.val;
                                                                        var $2757 = Parser$Reply$value$($2754, $2755, Kind$Term$ori$($2756, Kind$Term$cse$(Bits$e, $2709, _name$21, _wyth$22, _cses$26, _moti$27)));
                                                                        var $2749 = $2757;
                                                                        break;
                                                                };
                                                                var $2733 = $2749;
                                                                break;
                                                        };
                                                        var $2726 = $2733;
                                                        break;
                                                };
                                                var $2710 = $2726;
                                                break;
                                        };
                                        var $2702 = $2710;
                                        break;
                                };
                                var $2695 = $2702;
                                break;
                        };
                        var $2688 = $2695;
                        break;
                };
                var $2680 = $2688;
                break;
        };
        return $2680;
    };
    const Kind$Parser$open = x0 => x1 => Kind$Parser$open$(x0, x1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $2759 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $2758 = $2759;
        } else {
            var $2760 = self.charCodeAt(0);
            var $2761 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($2760 === 48);
            if (self) {
                var $2763 = Parser$Reply$value$(_sidx$5, $2761, 0n);
                var $2762 = $2763;
            } else {
                var self = ($2760 === 49);
                if (self) {
                    var $2765 = Parser$Reply$value$(_sidx$5, $2761, 1n);
                    var $2764 = $2765;
                } else {
                    var self = ($2760 === 50);
                    if (self) {
                        var $2767 = Parser$Reply$value$(_sidx$5, $2761, 2n);
                        var $2766 = $2767;
                    } else {
                        var self = ($2760 === 51);
                        if (self) {
                            var $2769 = Parser$Reply$value$(_sidx$5, $2761, 3n);
                            var $2768 = $2769;
                        } else {
                            var self = ($2760 === 52);
                            if (self) {
                                var $2771 = Parser$Reply$value$(_sidx$5, $2761, 4n);
                                var $2770 = $2771;
                            } else {
                                var self = ($2760 === 53);
                                if (self) {
                                    var $2773 = Parser$Reply$value$(_sidx$5, $2761, 5n);
                                    var $2772 = $2773;
                                } else {
                                    var self = ($2760 === 54);
                                    if (self) {
                                        var $2775 = Parser$Reply$value$(_sidx$5, $2761, 6n);
                                        var $2774 = $2775;
                                    } else {
                                        var self = ($2760 === 55);
                                        if (self) {
                                            var $2777 = Parser$Reply$value$(_sidx$5, $2761, 7n);
                                            var $2776 = $2777;
                                        } else {
                                            var self = ($2760 === 56);
                                            if (self) {
                                                var $2779 = Parser$Reply$value$(_sidx$5, $2761, 8n);
                                                var $2778 = $2779;
                                            } else {
                                                var self = ($2760 === 57);
                                                if (self) {
                                                    var $2781 = Parser$Reply$value$(_sidx$5, $2761, 9n);
                                                    var $2780 = $2781;
                                                } else {
                                                    var $2782 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $2780 = $2782;
                                                };
                                                var $2778 = $2780;
                                            };
                                            var $2776 = $2778;
                                        };
                                        var $2774 = $2776;
                                    };
                                    var $2772 = $2774;
                                };
                                var $2770 = $2772;
                            };
                            var $2768 = $2770;
                        };
                        var $2766 = $2768;
                    };
                    var $2764 = $2766;
                };
                var $2762 = $2764;
            };
            var $2758 = $2762;
        };
        return $2758;
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
                        var $2783 = self.head;
                        var $2784 = self.tail;
                        var $2785 = Nat$from_base$go$(_b$1, $2784, (_b$1 * _p$3), (($2783 * _p$3) + _res$4));
                        return $2785;
                    case 'List.nil':
                        var $2786 = _res$4;
                        return $2786;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $2787 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $2787;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2789 = self.idx;
                var $2790 = self.code;
                var $2791 = self.err;
                var $2792 = Parser$Reply$error$($2789, $2790, $2791);
                var $2788 = $2792;
                break;
            case 'Parser.Reply.value':
                var $2793 = self.idx;
                var $2794 = self.code;
                var $2795 = self.val;
                var $2796 = Parser$Reply$value$($2793, $2794, Nat$from_base$(10n, $2795));
                var $2788 = $2796;
                break;
        };
        return $2788;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2798 = self.slice(0, -1);
                var $2799 = $2798;
                var $2797 = $2799;
                break;
            case 'i':
                var $2800 = self.slice(0, -1);
                var $2801 = $2800;
                var $2797 = $2801;
                break;
            case 'e':
                var $2802 = Bits$e;
                var $2797 = $2802;
                break;
        };
        return $2797;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2804 = self.slice(0, -1);
                var $2805 = ($2804 + '1');
                var $2803 = $2805;
                break;
            case 'i':
                var $2806 = self.slice(0, -1);
                var $2807 = (Bits$inc$($2806) + '0');
                var $2803 = $2807;
                break;
            case 'e':
                var $2808 = (Bits$e + '1');
                var $2803 = $2808;
                break;
        };
        return $2803;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2810 = Bool$false;
                var $2809 = $2810;
                break;
            case 'Maybe.some':
                var $2811 = Bool$true;
                var $2809 = $2811;
                break;
        };
        return $2809;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Kind$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $2812 = ({
            _: 'Kind.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $2812;
    };
    const Kind$Term$gol = x0 => x1 => x2 => Kind$Term$gol$(x0, x1, x2);

    function Kind$Parser$goal$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2814 = self.idx;
                var $2815 = self.code;
                var $2816 = self.err;
                var $2817 = Parser$Reply$error$($2814, $2815, $2816);
                var $2813 = $2817;
                break;
            case 'Parser.Reply.value':
                var $2818 = self.idx;
                var $2819 = self.code;
                var $2820 = self.val;
                var self = Kind$Parser$text$("?", $2818, $2819);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2822 = self.idx;
                        var $2823 = self.code;
                        var $2824 = self.err;
                        var $2825 = Parser$Reply$error$($2822, $2823, $2824);
                        var $2821 = $2825;
                        break;
                    case 'Parser.Reply.value':
                        var $2826 = self.idx;
                        var $2827 = self.code;
                        var self = Kind$Parser$name$($2826, $2827);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2829 = self.idx;
                                var $2830 = self.code;
                                var $2831 = self.err;
                                var $2832 = Parser$Reply$error$($2829, $2830, $2831);
                                var $2828 = $2832;
                                break;
                            case 'Parser.Reply.value':
                                var $2833 = self.idx;
                                var $2834 = self.code;
                                var $2835 = self.val;
                                var self = Parser$many$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("-", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2838 = self.idx;
                                            var $2839 = self.code;
                                            var $2840 = self.err;
                                            var $2841 = Parser$Reply$error$($2838, $2839, $2840);
                                            var $2837 = $2841;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2842 = self.idx;
                                            var $2843 = self.code;
                                            var self = Parser$nat$($2842, $2843);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2845 = self.idx;
                                                    var $2846 = self.code;
                                                    var $2847 = self.err;
                                                    var $2848 = Parser$Reply$error$($2845, $2846, $2847);
                                                    var $2844 = $2848;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2849 = self.idx;
                                                    var $2850 = self.code;
                                                    var $2851 = self.val;
                                                    var _bits$20 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits($2851)))));
                                                    var $2852 = Parser$Reply$value$($2849, $2850, _bits$20);
                                                    var $2844 = $2852;
                                                    break;
                                            };
                                            var $2837 = $2844;
                                            break;
                                    };
                                    return $2837;
                                }))($2833)($2834);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2853 = self.idx;
                                        var $2854 = self.code;
                                        var $2855 = self.err;
                                        var $2856 = Parser$Reply$error$($2853, $2854, $2855);
                                        var $2836 = $2856;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2857 = self.idx;
                                        var $2858 = self.code;
                                        var $2859 = self.val;
                                        var self = Parser$maybe$(Parser$text("-"), $2857, $2858);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2861 = self.idx;
                                                var $2862 = self.code;
                                                var $2863 = self.err;
                                                var $2864 = Parser$Reply$error$($2861, $2862, $2863);
                                                var self = $2864;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2865 = self.idx;
                                                var $2866 = self.code;
                                                var $2867 = self.val;
                                                var $2868 = Parser$Reply$value$($2865, $2866, Maybe$to_bool$($2867));
                                                var self = $2868;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2869 = self.idx;
                                                var $2870 = self.code;
                                                var $2871 = self.err;
                                                var $2872 = Parser$Reply$error$($2869, $2870, $2871);
                                                var $2860 = $2872;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2873 = self.idx;
                                                var $2874 = self.code;
                                                var $2875 = self.val;
                                                var self = Kind$Parser$stop$($2820, $2873, $2874);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2877 = self.idx;
                                                        var $2878 = self.code;
                                                        var $2879 = self.err;
                                                        var $2880 = Parser$Reply$error$($2877, $2878, $2879);
                                                        var $2876 = $2880;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2881 = self.idx;
                                                        var $2882 = self.code;
                                                        var $2883 = self.val;
                                                        var $2884 = Parser$Reply$value$($2881, $2882, Kind$Term$ori$($2883, Kind$Term$gol$($2835, $2859, $2875)));
                                                        var $2876 = $2884;
                                                        break;
                                                };
                                                var $2860 = $2876;
                                                break;
                                        };
                                        var $2836 = $2860;
                                        break;
                                };
                                var $2828 = $2836;
                                break;
                        };
                        var $2821 = $2828;
                        break;
                };
                var $2813 = $2821;
                break;
        };
        return $2813;
    };
    const Kind$Parser$goal = x0 => x1 => Kind$Parser$goal$(x0, x1);

    function Kind$Parser$hole$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2886 = self.idx;
                var $2887 = self.code;
                var $2888 = self.err;
                var $2889 = Parser$Reply$error$($2886, $2887, $2888);
                var $2885 = $2889;
                break;
            case 'Parser.Reply.value':
                var $2890 = self.idx;
                var $2891 = self.code;
                var $2892 = self.val;
                var self = Kind$Parser$text$("_", $2890, $2891);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2894 = self.idx;
                        var $2895 = self.code;
                        var $2896 = self.err;
                        var $2897 = Parser$Reply$error$($2894, $2895, $2896);
                        var $2893 = $2897;
                        break;
                    case 'Parser.Reply.value':
                        var $2898 = self.idx;
                        var $2899 = self.code;
                        var self = Kind$Parser$stop$($2892, $2898, $2899);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2901 = self.idx;
                                var $2902 = self.code;
                                var $2903 = self.err;
                                var $2904 = Parser$Reply$error$($2901, $2902, $2903);
                                var $2900 = $2904;
                                break;
                            case 'Parser.Reply.value':
                                var $2905 = self.idx;
                                var $2906 = self.code;
                                var $2907 = self.val;
                                var $2908 = Parser$Reply$value$($2905, $2906, Kind$Term$ori$($2907, Kind$Term$hol$(Bits$e)));
                                var $2900 = $2908;
                                break;
                        };
                        var $2893 = $2900;
                        break;
                };
                var $2885 = $2893;
                break;
        };
        return $2885;
    };
    const Kind$Parser$hole = x0 => x1 => Kind$Parser$hole$(x0, x1);

    function Kind$Parser$u8$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2910 = self.idx;
                var $2911 = self.code;
                var $2912 = self.err;
                var $2913 = Parser$Reply$error$($2910, $2911, $2912);
                var $2909 = $2913;
                break;
            case 'Parser.Reply.value':
                var $2914 = self.idx;
                var $2915 = self.code;
                var $2916 = self.val;
                var self = Kind$Parser$spaces($2914)($2915);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2918 = self.idx;
                        var $2919 = self.code;
                        var $2920 = self.err;
                        var $2921 = Parser$Reply$error$($2918, $2919, $2920);
                        var $2917 = $2921;
                        break;
                    case 'Parser.Reply.value':
                        var $2922 = self.idx;
                        var $2923 = self.code;
                        var self = Parser$nat$($2922, $2923);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2925 = self.idx;
                                var $2926 = self.code;
                                var $2927 = self.err;
                                var $2928 = Parser$Reply$error$($2925, $2926, $2927);
                                var $2924 = $2928;
                                break;
                            case 'Parser.Reply.value':
                                var $2929 = self.idx;
                                var $2930 = self.code;
                                var $2931 = self.val;
                                var self = Parser$text$("b", $2929, $2930);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2933 = self.idx;
                                        var $2934 = self.code;
                                        var $2935 = self.err;
                                        var $2936 = Parser$Reply$error$($2933, $2934, $2935);
                                        var $2932 = $2936;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2937 = self.idx;
                                        var $2938 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u8");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2931));
                                        var self = Kind$Parser$stop$($2916, $2937, $2938);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2940 = self.idx;
                                                var $2941 = self.code;
                                                var $2942 = self.err;
                                                var $2943 = Parser$Reply$error$($2940, $2941, $2942);
                                                var $2939 = $2943;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2944 = self.idx;
                                                var $2945 = self.code;
                                                var $2946 = self.val;
                                                var $2947 = Parser$Reply$value$($2944, $2945, Kind$Term$ori$($2946, _term$16));
                                                var $2939 = $2947;
                                                break;
                                        };
                                        var $2932 = $2939;
                                        break;
                                };
                                var $2924 = $2932;
                                break;
                        };
                        var $2917 = $2924;
                        break;
                };
                var $2909 = $2917;
                break;
        };
        return $2909;
    };
    const Kind$Parser$u8 = x0 => x1 => Kind$Parser$u8$(x0, x1);

    function Kind$Parser$u16$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2949 = self.idx;
                var $2950 = self.code;
                var $2951 = self.err;
                var $2952 = Parser$Reply$error$($2949, $2950, $2951);
                var $2948 = $2952;
                break;
            case 'Parser.Reply.value':
                var $2953 = self.idx;
                var $2954 = self.code;
                var $2955 = self.val;
                var self = Kind$Parser$spaces($2953)($2954);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2957 = self.idx;
                        var $2958 = self.code;
                        var $2959 = self.err;
                        var $2960 = Parser$Reply$error$($2957, $2958, $2959);
                        var $2956 = $2960;
                        break;
                    case 'Parser.Reply.value':
                        var $2961 = self.idx;
                        var $2962 = self.code;
                        var self = Parser$nat$($2961, $2962);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2964 = self.idx;
                                var $2965 = self.code;
                                var $2966 = self.err;
                                var $2967 = Parser$Reply$error$($2964, $2965, $2966);
                                var $2963 = $2967;
                                break;
                            case 'Parser.Reply.value':
                                var $2968 = self.idx;
                                var $2969 = self.code;
                                var $2970 = self.val;
                                var self = Parser$text$("s", $2968, $2969);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2972 = self.idx;
                                        var $2973 = self.code;
                                        var $2974 = self.err;
                                        var $2975 = Parser$Reply$error$($2972, $2973, $2974);
                                        var $2971 = $2975;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2976 = self.idx;
                                        var $2977 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u16");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2970));
                                        var self = Kind$Parser$stop$($2955, $2976, $2977);
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
                                                var $2985 = self.val;
                                                var $2986 = Parser$Reply$value$($2983, $2984, Kind$Term$ori$($2985, _term$16));
                                                var $2978 = $2986;
                                                break;
                                        };
                                        var $2971 = $2978;
                                        break;
                                };
                                var $2963 = $2971;
                                break;
                        };
                        var $2956 = $2963;
                        break;
                };
                var $2948 = $2956;
                break;
        };
        return $2948;
    };
    const Kind$Parser$u16 = x0 => x1 => Kind$Parser$u16$(x0, x1);

    function Kind$Parser$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2988 = self.idx;
                var $2989 = self.code;
                var $2990 = self.err;
                var $2991 = Parser$Reply$error$($2988, $2989, $2990);
                var $2987 = $2991;
                break;
            case 'Parser.Reply.value':
                var $2992 = self.idx;
                var $2993 = self.code;
                var $2994 = self.val;
                var self = Kind$Parser$spaces($2992)($2993);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2996 = self.idx;
                        var $2997 = self.code;
                        var $2998 = self.err;
                        var $2999 = Parser$Reply$error$($2996, $2997, $2998);
                        var $2995 = $2999;
                        break;
                    case 'Parser.Reply.value':
                        var $3000 = self.idx;
                        var $3001 = self.code;
                        var self = Parser$nat$($3000, $3001);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3003 = self.idx;
                                var $3004 = self.code;
                                var $3005 = self.err;
                                var $3006 = Parser$Reply$error$($3003, $3004, $3005);
                                var $3002 = $3006;
                                break;
                            case 'Parser.Reply.value':
                                var $3007 = self.idx;
                                var $3008 = self.code;
                                var $3009 = self.val;
                                var self = Parser$text$("u", $3007, $3008);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3011 = self.idx;
                                        var $3012 = self.code;
                                        var $3013 = self.err;
                                        var $3014 = Parser$Reply$error$($3011, $3012, $3013);
                                        var $3010 = $3014;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3015 = self.idx;
                                        var $3016 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u32");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($3009));
                                        var self = Kind$Parser$stop$($2994, $3015, $3016);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3018 = self.idx;
                                                var $3019 = self.code;
                                                var $3020 = self.err;
                                                var $3021 = Parser$Reply$error$($3018, $3019, $3020);
                                                var $3017 = $3021;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3022 = self.idx;
                                                var $3023 = self.code;
                                                var $3024 = self.val;
                                                var $3025 = Parser$Reply$value$($3022, $3023, Kind$Term$ori$($3024, _term$16));
                                                var $3017 = $3025;
                                                break;
                                        };
                                        var $3010 = $3017;
                                        break;
                                };
                                var $3002 = $3010;
                                break;
                        };
                        var $2995 = $3002;
                        break;
                };
                var $2987 = $2995;
                break;
        };
        return $2987;
    };
    const Kind$Parser$u32 = x0 => x1 => Kind$Parser$u32$(x0, x1);

    function Kind$Parser$u64$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3027 = self.idx;
                var $3028 = self.code;
                var $3029 = self.err;
                var $3030 = Parser$Reply$error$($3027, $3028, $3029);
                var $3026 = $3030;
                break;
            case 'Parser.Reply.value':
                var $3031 = self.idx;
                var $3032 = self.code;
                var $3033 = self.val;
                var self = Kind$Parser$spaces($3031)($3032);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3035 = self.idx;
                        var $3036 = self.code;
                        var $3037 = self.err;
                        var $3038 = Parser$Reply$error$($3035, $3036, $3037);
                        var $3034 = $3038;
                        break;
                    case 'Parser.Reply.value':
                        var $3039 = self.idx;
                        var $3040 = self.code;
                        var self = Parser$nat$($3039, $3040);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3042 = self.idx;
                                var $3043 = self.code;
                                var $3044 = self.err;
                                var $3045 = Parser$Reply$error$($3042, $3043, $3044);
                                var $3041 = $3045;
                                break;
                            case 'Parser.Reply.value':
                                var $3046 = self.idx;
                                var $3047 = self.code;
                                var $3048 = self.val;
                                var self = Parser$text$("l", $3046, $3047);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3050 = self.idx;
                                        var $3051 = self.code;
                                        var $3052 = self.err;
                                        var $3053 = Parser$Reply$error$($3050, $3051, $3052);
                                        var $3049 = $3053;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3054 = self.idx;
                                        var $3055 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u64");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($3048));
                                        var self = Kind$Parser$stop$($3033, $3054, $3055);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3057 = self.idx;
                                                var $3058 = self.code;
                                                var $3059 = self.err;
                                                var $3060 = Parser$Reply$error$($3057, $3058, $3059);
                                                var $3056 = $3060;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3061 = self.idx;
                                                var $3062 = self.code;
                                                var $3063 = self.val;
                                                var $3064 = Parser$Reply$value$($3061, $3062, Kind$Term$ori$($3063, _term$16));
                                                var $3056 = $3064;
                                                break;
                                        };
                                        var $3049 = $3056;
                                        break;
                                };
                                var $3041 = $3049;
                                break;
                        };
                        var $3034 = $3041;
                        break;
                };
                var $3026 = $3034;
                break;
        };
        return $3026;
    };
    const Kind$Parser$u64 = x0 => x1 => Kind$Parser$u64$(x0, x1);

    function Kind$Parser$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3066 = self.idx;
                var $3067 = self.code;
                var $3068 = self.err;
                var $3069 = Parser$Reply$error$($3066, $3067, $3068);
                var $3065 = $3069;
                break;
            case 'Parser.Reply.value':
                var $3070 = self.idx;
                var $3071 = self.code;
                var $3072 = self.val;
                var self = Kind$Parser$spaces($3070)($3071);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3074 = self.idx;
                        var $3075 = self.code;
                        var $3076 = self.err;
                        var $3077 = Parser$Reply$error$($3074, $3075, $3076);
                        var $3073 = $3077;
                        break;
                    case 'Parser.Reply.value':
                        var $3078 = self.idx;
                        var $3079 = self.code;
                        var self = Parser$nat$($3078, $3079);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3081 = self.idx;
                                var $3082 = self.code;
                                var $3083 = self.err;
                                var $3084 = Parser$Reply$error$($3081, $3082, $3083);
                                var $3080 = $3084;
                                break;
                            case 'Parser.Reply.value':
                                var $3085 = self.idx;
                                var $3086 = self.code;
                                var $3087 = self.val;
                                var self = Kind$Parser$stop$($3072, $3085, $3086);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3089 = self.idx;
                                        var $3090 = self.code;
                                        var $3091 = self.err;
                                        var $3092 = Parser$Reply$error$($3089, $3090, $3091);
                                        var $3088 = $3092;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3093 = self.idx;
                                        var $3094 = self.code;
                                        var $3095 = self.val;
                                        var $3096 = Parser$Reply$value$($3093, $3094, Kind$Term$ori$($3095, Kind$Term$nat$($3087)));
                                        var $3088 = $3096;
                                        break;
                                };
                                var $3080 = $3088;
                                break;
                        };
                        var $3073 = $3080;
                        break;
                };
                var $3065 = $3073;
                break;
        };
        return $3065;
    };
    const Kind$Parser$nat = x0 => x1 => Kind$Parser$nat$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $3097 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $3097;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);

    function Kind$Parser$reference$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $3105 = self.val;
                var self = Kind$Parser$name1$($3103, $3104);
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
                        var self = ($3113 === "case");
                        if (self) {
                            var $3115 = Parser$fail("Reserved keyword.");
                            var $3114 = $3115;
                        } else {
                            var self = ($3113 === "do");
                            if (self) {
                                var $3117 = Parser$fail("Reserved keyword.");
                                var $3116 = $3117;
                            } else {
                                var self = ($3113 === "if");
                                if (self) {
                                    var $3119 = Parser$fail("Reserved keyword.");
                                    var $3118 = $3119;
                                } else {
                                    var self = ($3113 === "with");
                                    if (self) {
                                        var $3121 = Parser$fail("Reserved keyword.");
                                        var $3120 = $3121;
                                    } else {
                                        var self = ($3113 === "let");
                                        if (self) {
                                            var $3123 = Parser$fail("Reserved keyword.");
                                            var $3122 = $3123;
                                        } else {
                                            var self = ($3113 === "def");
                                            if (self) {
                                                var $3125 = Parser$fail("Reserved keyword.");
                                                var $3124 = $3125;
                                            } else {
                                                var self = ($3113 === "true");
                                                if (self) {
                                                    var $3127 = (_idx$9 => _code$10 => {
                                                        var $3128 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.true"));
                                                        return $3128;
                                                    });
                                                    var $3126 = $3127;
                                                } else {
                                                    var self = ($3113 === "false");
                                                    if (self) {
                                                        var $3130 = (_idx$9 => _code$10 => {
                                                            var $3131 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.false"));
                                                            return $3131;
                                                        });
                                                        var $3129 = $3130;
                                                    } else {
                                                        var self = ($3113 === "unit");
                                                        if (self) {
                                                            var $3133 = (_idx$9 => _code$10 => {
                                                                var $3134 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Unit.new"));
                                                                return $3134;
                                                            });
                                                            var $3132 = $3133;
                                                        } else {
                                                            var self = ($3113 === "none");
                                                            if (self) {
                                                                var _term$9 = Kind$Term$ref$("Maybe.none");
                                                                var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                var $3136 = (_idx$11 => _code$12 => {
                                                                    var $3137 = Parser$Reply$value$(_idx$11, _code$12, _term$10);
                                                                    return $3137;
                                                                });
                                                                var $3135 = $3136;
                                                            } else {
                                                                var self = ($3113 === "refl");
                                                                if (self) {
                                                                    var _term$9 = Kind$Term$ref$("Equal.refl");
                                                                    var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                    var _term$11 = Kind$Term$app$(_term$10, Kind$Term$hol$(Bits$e));
                                                                    var $3139 = (_idx$12 => _code$13 => {
                                                                        var $3140 = Parser$Reply$value$(_idx$12, _code$13, _term$11);
                                                                        return $3140;
                                                                    });
                                                                    var $3138 = $3139;
                                                                } else {
                                                                    var $3141 = (_idx$9 => _code$10 => {
                                                                        var self = Kind$Parser$stop$($3105, _idx$9, _code$10);
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
                                                                                var $3150 = Parser$Reply$value$($3147, $3148, Kind$Term$ori$($3149, Kind$Term$ref$($3113)));
                                                                                var $3142 = $3150;
                                                                                break;
                                                                        };
                                                                        return $3142;
                                                                    });
                                                                    var $3138 = $3141;
                                                                };
                                                                var $3135 = $3138;
                                                            };
                                                            var $3132 = $3135;
                                                        };
                                                        var $3129 = $3132;
                                                    };
                                                    var $3126 = $3129;
                                                };
                                                var $3124 = $3126;
                                            };
                                            var $3122 = $3124;
                                        };
                                        var $3120 = $3122;
                                    };
                                    var $3118 = $3120;
                                };
                                var $3116 = $3118;
                            };
                            var $3114 = $3116;
                        };
                        var $3114 = $3114($3111)($3112);
                        var $3106 = $3114;
                        break;
                };
                var $3098 = $3106;
                break;
        };
        return $3098;
    };
    const Kind$Parser$reference = x0 => x1 => Kind$Parser$reference$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kind$Parser$application$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$text$("(", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3152 = self.idx;
                var $3153 = self.code;
                var $3154 = self.err;
                var $3155 = Parser$Reply$error$($3152, $3153, $3154);
                var $3151 = $3155;
                break;
            case 'Parser.Reply.value':
                var $3156 = self.idx;
                var $3157 = self.code;
                var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term), $3156, $3157);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3159 = self.idx;
                        var $3160 = self.code;
                        var $3161 = self.err;
                        var $3162 = Parser$Reply$error$($3159, $3160, $3161);
                        var $3158 = $3162;
                        break;
                    case 'Parser.Reply.value':
                        var $3163 = self.idx;
                        var $3164 = self.code;
                        var $3165 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3163, $3164);
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
                                var $3173 = self.val;
                                var _expr$14 = (() => {
                                    var $3176 = _func$2;
                                    var $3177 = $3165;
                                    let _f$15 = $3176;
                                    let _x$14;
                                    while ($3177._ === 'List.cons') {
                                        _x$14 = $3177.head;
                                        var $3176 = Kind$Term$app$(_f$15, _x$14);
                                        _f$15 = $3176;
                                        $3177 = $3177.tail;
                                    }
                                    return _f$15;
                                })();
                                var $3174 = Parser$Reply$value$($3171, $3172, Kind$Term$ori$($3173, _expr$14));
                                var $3166 = $3174;
                                break;
                        };
                        var $3158 = $3166;
                        break;
                };
                var $3151 = $3158;
                break;
        };
        return $3151;
    };
    const Kind$Parser$application = x0 => x1 => x2 => x3 => Kind$Parser$application$(x0, x1, x2, x3);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1, _idx$2, _code$3) {
        var self = Parser$spaces(_idx$2)(_code$3);
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
                var $3185 = Parser$text$(_text$1, $3183, $3184);
                var $3178 = $3185;
                break;
        };
        return $3178;
    };
    const Parser$spaces_text = x0 => x1 => x2 => Parser$spaces_text$(x0, x1, x2);

    function Kind$Parser$application$erased$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$get_index$(_idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3187 = self.idx;
                var $3188 = self.code;
                var $3189 = self.err;
                var $3190 = Parser$Reply$error$($3187, $3188, $3189);
                var $3186 = $3190;
                break;
            case 'Parser.Reply.value':
                var $3191 = self.idx;
                var $3192 = self.code;
                var $3193 = self.val;
                var self = Parser$text$("<", $3191, $3192);
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
                        var self = Parser$until1$(Parser$spaces_text(">"), Kind$Parser$item(Kind$Parser$term), $3199, $3200);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3202 = self.idx;
                                var $3203 = self.code;
                                var $3204 = self.err;
                                var $3205 = Parser$Reply$error$($3202, $3203, $3204);
                                var $3201 = $3205;
                                break;
                            case 'Parser.Reply.value':
                                var $3206 = self.idx;
                                var $3207 = self.code;
                                var $3208 = self.val;
                                var self = Kind$Parser$stop$($3193, $3206, $3207);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3210 = self.idx;
                                        var $3211 = self.code;
                                        var $3212 = self.err;
                                        var $3213 = Parser$Reply$error$($3210, $3211, $3212);
                                        var $3209 = $3213;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3214 = self.idx;
                                        var $3215 = self.code;
                                        var $3216 = self.val;
                                        var _expr$17 = (() => {
                                            var $3219 = _func$2;
                                            var $3220 = $3208;
                                            let _f$18 = $3219;
                                            let _x$17;
                                            while ($3220._ === 'List.cons') {
                                                _x$17 = $3220.head;
                                                var $3219 = Kind$Term$app$(_f$18, _x$17);
                                                _f$18 = $3219;
                                                $3220 = $3220.tail;
                                            }
                                            return _f$18;
                                        })();
                                        var $3217 = Parser$Reply$value$($3214, $3215, Kind$Term$ori$($3216, _expr$17));
                                        var $3209 = $3217;
                                        break;
                                };
                                var $3201 = $3209;
                                break;
                        };
                        var $3194 = $3201;
                        break;
                };
                var $3186 = $3194;
                break;
        };
        return $3186;
    };
    const Kind$Parser$application$erased = x0 => x1 => x2 => x3 => Kind$Parser$application$erased$(x0, x1, x2, x3);

    function Kind$Parser$arrow$(_init$1, _xtyp$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("->", _idx$3, _code$4);
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
                                var $3243 = self.val;
                                var $3244 = Parser$Reply$value$($3241, $3242, Kind$Term$ori$($3243, Kind$Term$all$(Bool$false, "", "", _xtyp$2, (_s$14 => _x$15 => {
                                    var $3245 = $3235;
                                    return $3245;
                                }))));
                                var $3236 = $3244;
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
    const Kind$Parser$arrow = x0 => x1 => x2 => x3 => Kind$Parser$arrow$(x0, x1, x2, x3);

    function Kind$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4, _idx$5, _code$6) {
        var self = Kind$Parser$text$(_sym$1, _idx$5, _code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3247 = self.idx;
                var $3248 = self.code;
                var $3249 = self.err;
                var $3250 = Parser$Reply$error$($3247, $3248, $3249);
                var $3246 = $3250;
                break;
            case 'Parser.Reply.value':
                var $3251 = self.idx;
                var $3252 = self.code;
                var self = Kind$Parser$term$($3251, $3252);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3254 = self.idx;
                        var $3255 = self.code;
                        var $3256 = self.err;
                        var $3257 = Parser$Reply$error$($3254, $3255, $3256);
                        var $3253 = $3257;
                        break;
                    case 'Parser.Reply.value':
                        var $3258 = self.idx;
                        var $3259 = self.code;
                        var $3260 = self.val;
                        var self = Kind$Parser$stop$(_init$3, $3258, $3259);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3262 = self.idx;
                                var $3263 = self.code;
                                var $3264 = self.err;
                                var $3265 = Parser$Reply$error$($3262, $3263, $3264);
                                var $3261 = $3265;
                                break;
                            case 'Parser.Reply.value':
                                var $3266 = self.idx;
                                var $3267 = self.code;
                                var $3268 = self.val;
                                var _term$16 = Kind$Term$ref$(_ref$2);
                                var _term$17 = Kind$Term$app$(_term$16, _val0$4);
                                var _term$18 = Kind$Term$app$(_term$17, $3260);
                                var $3269 = Parser$Reply$value$($3266, $3267, Kind$Term$ori$($3268, _term$18));
                                var $3261 = $3269;
                                break;
                        };
                        var $3253 = $3261;
                        break;
                };
                var $3246 = $3253;
                break;
        };
        return $3246;
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
                var $3271 = self.idx;
                var $3272 = self.code;
                var $3273 = self.err;
                var $3274 = Parser$Reply$error$($3271, $3272, $3273);
                var $3270 = $3274;
                break;
            case 'Parser.Reply.value':
                var $3275 = self.idx;
                var $3276 = self.code;
                var self = Kind$Parser$term$($3275, $3276);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3278 = self.idx;
                        var $3279 = self.code;
                        var $3280 = self.err;
                        var $3281 = Parser$Reply$error$($3278, $3279, $3280);
                        var $3277 = $3281;
                        break;
                    case 'Parser.Reply.value':
                        var $3282 = self.idx;
                        var $3283 = self.code;
                        var $3284 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3282, $3283);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3286 = self.idx;
                                var $3287 = self.code;
                                var $3288 = self.err;
                                var $3289 = Parser$Reply$error$($3286, $3287, $3288);
                                var $3285 = $3289;
                                break;
                            case 'Parser.Reply.value':
                                var $3290 = self.idx;
                                var $3291 = self.code;
                                var _term$14 = Kind$Term$ref$("List.cons");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _head$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3284);
                                var self = Kind$Parser$stop$(_init$1, $3290, $3291);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3293 = self.idx;
                                        var $3294 = self.code;
                                        var $3295 = self.err;
                                        var $3296 = Parser$Reply$error$($3293, $3294, $3295);
                                        var $3292 = $3296;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3297 = self.idx;
                                        var $3298 = self.code;
                                        var $3299 = self.val;
                                        var $3300 = Parser$Reply$value$($3297, $3298, Kind$Term$ori$($3299, _term$17));
                                        var $3292 = $3300;
                                        break;
                                };
                                var $3285 = $3292;
                                break;
                        };
                        var $3277 = $3285;
                        break;
                };
                var $3270 = $3277;
                break;
        };
        return $3270;
    };
    const Kind$Parser$cons = x0 => x1 => x2 => x3 => Kind$Parser$cons$(x0, x1, x2, x3);

    function Kind$Parser$concat$(_init$1, _lst0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("++", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3302 = self.idx;
                var $3303 = self.code;
                var $3304 = self.err;
                var $3305 = Parser$Reply$error$($3302, $3303, $3304);
                var $3301 = $3305;
                break;
            case 'Parser.Reply.value':
                var $3306 = self.idx;
                var $3307 = self.code;
                var self = Kind$Parser$term$($3306, $3307);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3309 = self.idx;
                        var $3310 = self.code;
                        var $3311 = self.err;
                        var $3312 = Parser$Reply$error$($3309, $3310, $3311);
                        var $3308 = $3312;
                        break;
                    case 'Parser.Reply.value':
                        var $3313 = self.idx;
                        var $3314 = self.code;
                        var $3315 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3313, $3314);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3317 = self.idx;
                                var $3318 = self.code;
                                var $3319 = self.err;
                                var $3320 = Parser$Reply$error$($3317, $3318, $3319);
                                var $3316 = $3320;
                                break;
                            case 'Parser.Reply.value':
                                var $3321 = self.idx;
                                var $3322 = self.code;
                                var _term$14 = Kind$Term$ref$("List.concat");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _lst0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3315);
                                var self = Kind$Parser$stop$(_init$1, $3321, $3322);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3324 = self.idx;
                                        var $3325 = self.code;
                                        var $3326 = self.err;
                                        var $3327 = Parser$Reply$error$($3324, $3325, $3326);
                                        var $3323 = $3327;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3328 = self.idx;
                                        var $3329 = self.code;
                                        var $3330 = self.val;
                                        var $3331 = Parser$Reply$value$($3328, $3329, Kind$Term$ori$($3330, _term$17));
                                        var $3323 = $3331;
                                        break;
                                };
                                var $3316 = $3323;
                                break;
                        };
                        var $3308 = $3316;
                        break;
                };
                var $3301 = $3308;
                break;
        };
        return $3301;
    };
    const Kind$Parser$concat = x0 => x1 => x2 => x3 => Kind$Parser$concat$(x0, x1, x2, x3);

    function Kind$Parser$string_concat$(_init$1, _str0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("|", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3333 = self.idx;
                var $3334 = self.code;
                var $3335 = self.err;
                var $3336 = Parser$Reply$error$($3333, $3334, $3335);
                var $3332 = $3336;
                break;
            case 'Parser.Reply.value':
                var $3337 = self.idx;
                var $3338 = self.code;
                var self = Kind$Parser$term$($3337, $3338);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3340 = self.idx;
                        var $3341 = self.code;
                        var $3342 = self.err;
                        var $3343 = Parser$Reply$error$($3340, $3341, $3342);
                        var $3339 = $3343;
                        break;
                    case 'Parser.Reply.value':
                        var $3344 = self.idx;
                        var $3345 = self.code;
                        var $3346 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3344, $3345);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3348 = self.idx;
                                var $3349 = self.code;
                                var $3350 = self.err;
                                var $3351 = Parser$Reply$error$($3348, $3349, $3350);
                                var $3347 = $3351;
                                break;
                            case 'Parser.Reply.value':
                                var $3352 = self.idx;
                                var $3353 = self.code;
                                var _term$14 = Kind$Term$ref$("String.concat");
                                var _term$15 = Kind$Term$app$(_term$14, _str0$2);
                                var _term$16 = Kind$Term$app$(_term$15, $3346);
                                var self = Kind$Parser$stop$(_init$1, $3352, $3353);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3355 = self.idx;
                                        var $3356 = self.code;
                                        var $3357 = self.err;
                                        var $3358 = Parser$Reply$error$($3355, $3356, $3357);
                                        var $3354 = $3358;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3359 = self.idx;
                                        var $3360 = self.code;
                                        var $3361 = self.val;
                                        var $3362 = Parser$Reply$value$($3359, $3360, Kind$Term$ori$($3361, _term$16));
                                        var $3354 = $3362;
                                        break;
                                };
                                var $3347 = $3354;
                                break;
                        };
                        var $3339 = $3347;
                        break;
                };
                var $3332 = $3339;
                break;
        };
        return $3332;
    };
    const Kind$Parser$string_concat = x0 => x1 => x2 => x3 => Kind$Parser$string_concat$(x0, x1, x2, x3);

    function Kind$Parser$sigma$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("~", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3364 = self.idx;
                var $3365 = self.code;
                var $3366 = self.err;
                var $3367 = Parser$Reply$error$($3364, $3365, $3366);
                var $3363 = $3367;
                break;
            case 'Parser.Reply.value':
                var $3368 = self.idx;
                var $3369 = self.code;
                var self = Kind$Parser$term$($3368, $3369);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3371 = self.idx;
                        var $3372 = self.code;
                        var $3373 = self.err;
                        var $3374 = Parser$Reply$error$($3371, $3372, $3373);
                        var $3370 = $3374;
                        break;
                    case 'Parser.Reply.value':
                        var $3375 = self.idx;
                        var $3376 = self.code;
                        var $3377 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3375, $3376);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3379 = self.idx;
                                var $3380 = self.code;
                                var $3381 = self.err;
                                var $3382 = Parser$Reply$error$($3379, $3380, $3381);
                                var $3378 = $3382;
                                break;
                            case 'Parser.Reply.value':
                                var $3383 = self.idx;
                                var $3384 = self.code;
                                var $3385 = self.val;
                                var _term$14 = Kind$Term$ref$("Sigma.new");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                var _term$17 = Kind$Term$app$(_term$16, _val0$2);
                                var _term$18 = Kind$Term$app$(_term$17, $3377);
                                var $3386 = Parser$Reply$value$($3383, $3384, Kind$Term$ori$($3385, _term$18));
                                var $3378 = $3386;
                                break;
                        };
                        var $3370 = $3378;
                        break;
                };
                var $3363 = $3370;
                break;
        };
        return $3363;
    };
    const Kind$Parser$sigma = x0 => x1 => x2 => x3 => Kind$Parser$sigma$(x0, x1, x2, x3);

    function Kind$Parser$equality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("==", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3388 = self.idx;
                var $3389 = self.code;
                var $3390 = self.err;
                var $3391 = Parser$Reply$error$($3388, $3389, $3390);
                var $3387 = $3391;
                break;
            case 'Parser.Reply.value':
                var $3392 = self.idx;
                var $3393 = self.code;
                var self = Kind$Parser$term$($3392, $3393);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3395 = self.idx;
                        var $3396 = self.code;
                        var $3397 = self.err;
                        var $3398 = Parser$Reply$error$($3395, $3396, $3397);
                        var $3394 = $3398;
                        break;
                    case 'Parser.Reply.value':
                        var $3399 = self.idx;
                        var $3400 = self.code;
                        var $3401 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3399, $3400);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3403 = self.idx;
                                var $3404 = self.code;
                                var $3405 = self.err;
                                var $3406 = Parser$Reply$error$($3403, $3404, $3405);
                                var $3402 = $3406;
                                break;
                            case 'Parser.Reply.value':
                                var $3407 = self.idx;
                                var $3408 = self.code;
                                var $3409 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3401);
                                var $3410 = Parser$Reply$value$($3407, $3408, Kind$Term$ori$($3409, _term$17));
                                var $3402 = $3410;
                                break;
                        };
                        var $3394 = $3402;
                        break;
                };
                var $3387 = $3394;
                break;
        };
        return $3387;
    };
    const Kind$Parser$equality = x0 => x1 => x2 => x3 => Kind$Parser$equality$(x0, x1, x2, x3);

    function Kind$Parser$inequality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!=", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3412 = self.idx;
                var $3413 = self.code;
                var $3414 = self.err;
                var $3415 = Parser$Reply$error$($3412, $3413, $3414);
                var $3411 = $3415;
                break;
            case 'Parser.Reply.value':
                var $3416 = self.idx;
                var $3417 = self.code;
                var self = Kind$Parser$term$($3416, $3417);
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
                        var $3425 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3423, $3424);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3427 = self.idx;
                                var $3428 = self.code;
                                var $3429 = self.err;
                                var $3430 = Parser$Reply$error$($3427, $3428, $3429);
                                var $3426 = $3430;
                                break;
                            case 'Parser.Reply.value':
                                var $3431 = self.idx;
                                var $3432 = self.code;
                                var $3433 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3425);
                                var _term$18 = Kind$Term$app$(Kind$Term$ref$("Not"), _term$17);
                                var $3434 = Parser$Reply$value$($3431, $3432, Kind$Term$ori$($3433, _term$18));
                                var $3426 = $3434;
                                break;
                        };
                        var $3418 = $3426;
                        break;
                };
                var $3411 = $3418;
                break;
        };
        return $3411;
    };
    const Kind$Parser$inequality = x0 => x1 => x2 => x3 => Kind$Parser$inequality$(x0, x1, x2, x3);

    function Kind$Parser$rewrite$(_init$1, _subt$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3436 = self.idx;
                var $3437 = self.code;
                var $3438 = self.err;
                var $3439 = Parser$Reply$error$($3436, $3437, $3438);
                var $3435 = $3439;
                break;
            case 'Parser.Reply.value':
                var $3440 = self.idx;
                var $3441 = self.code;
                var self = Kind$Parser$text$("rewrite", $3440, $3441);
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
                        var self = Kind$Parser$name1$($3447, $3448);
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
                                var self = Kind$Parser$text$("in", $3454, $3455);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3458 = self.idx;
                                        var $3459 = self.code;
                                        var $3460 = self.err;
                                        var $3461 = Parser$Reply$error$($3458, $3459, $3460);
                                        var $3457 = $3461;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3462 = self.idx;
                                        var $3463 = self.code;
                                        var self = Kind$Parser$term$($3462, $3463);
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
                                                var self = Kind$Parser$text$("with", $3469, $3470);
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
                                                        var self = Kind$Parser$term$($3477, $3478);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $3480 = self.idx;
                                                                var $3481 = self.code;
                                                                var $3482 = self.err;
                                                                var $3483 = Parser$Reply$error$($3480, $3481, $3482);
                                                                var $3479 = $3483;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $3484 = self.idx;
                                                                var $3485 = self.code;
                                                                var $3486 = self.val;
                                                                var self = Kind$Parser$stop$(_init$1, $3484, $3485);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $3488 = self.idx;
                                                                        var $3489 = self.code;
                                                                        var $3490 = self.err;
                                                                        var $3491 = Parser$Reply$error$($3488, $3489, $3490);
                                                                        var $3487 = $3491;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $3492 = self.idx;
                                                                        var $3493 = self.code;
                                                                        var $3494 = self.val;
                                                                        var _term$29 = Kind$Term$ref$("Equal.rewrite");
                                                                        var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                        var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                        var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                        var _term$33 = Kind$Term$app$(_term$32, $3486);
                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$lam$($3456, (_x$34 => {
                                                                            var $3496 = $3471;
                                                                            return $3496;
                                                                        })));
                                                                        var _term$35 = Kind$Term$app$(_term$34, _subt$2);
                                                                        var $3495 = Parser$Reply$value$($3492, $3493, Kind$Term$ori$($3494, _term$35));
                                                                        var $3487 = $3495;
                                                                        break;
                                                                };
                                                                var $3479 = $3487;
                                                                break;
                                                        };
                                                        var $3472 = $3479;
                                                        break;
                                                };
                                                var $3464 = $3472;
                                                break;
                                        };
                                        var $3457 = $3464;
                                        break;
                                };
                                var $3449 = $3457;
                                break;
                        };
                        var $3442 = $3449;
                        break;
                };
                var $3435 = $3442;
                break;
        };
        return $3435;
    };
    const Kind$Parser$rewrite = x0 => x1 => x2 => x3 => Kind$Parser$rewrite$(x0, x1, x2, x3);

    function Kind$Term$ann$(_done$1, _term$2, _type$3) {
        var $3497 = ({
            _: 'Kind.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $3497;
    };
    const Kind$Term$ann = x0 => x1 => x2 => Kind$Term$ann$(x0, x1, x2);

    function Kind$Parser$annotation$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3499 = self.idx;
                var $3500 = self.code;
                var $3501 = self.err;
                var $3502 = Parser$Reply$error$($3499, $3500, $3501);
                var $3498 = $3502;
                break;
            case 'Parser.Reply.value':
                var $3503 = self.idx;
                var $3504 = self.code;
                var self = Kind$Parser$term$($3503, $3504);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3506 = self.idx;
                        var $3507 = self.code;
                        var $3508 = self.err;
                        var $3509 = Parser$Reply$error$($3506, $3507, $3508);
                        var $3505 = $3509;
                        break;
                    case 'Parser.Reply.value':
                        var $3510 = self.idx;
                        var $3511 = self.code;
                        var $3512 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3510, $3511);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3514 = self.idx;
                                var $3515 = self.code;
                                var $3516 = self.err;
                                var $3517 = Parser$Reply$error$($3514, $3515, $3516);
                                var $3513 = $3517;
                                break;
                            case 'Parser.Reply.value':
                                var $3518 = self.idx;
                                var $3519 = self.code;
                                var $3520 = self.val;
                                var $3521 = Parser$Reply$value$($3518, $3519, Kind$Term$ori$($3520, Kind$Term$ann$(Bool$false, _term$2, $3512)));
                                var $3513 = $3521;
                                break;
                        };
                        var $3505 = $3513;
                        break;
                };
                var $3498 = $3505;
                break;
        };
        return $3498;
    };
    const Kind$Parser$annotation = x0 => x1 => x2 => x3 => Kind$Parser$annotation$(x0, x1, x2, x3);

    function Kind$Parser$application$hole$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3523 = self.idx;
                var $3524 = self.code;
                var $3525 = self.err;
                var $3526 = Parser$Reply$error$($3523, $3524, $3525);
                var $3522 = $3526;
                break;
            case 'Parser.Reply.value':
                var $3527 = self.idx;
                var $3528 = self.code;
                var self = Kind$Parser$stop$(_init$1, $3527, $3528);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3530 = self.idx;
                        var $3531 = self.code;
                        var $3532 = self.err;
                        var $3533 = Parser$Reply$error$($3530, $3531, $3532);
                        var $3529 = $3533;
                        break;
                    case 'Parser.Reply.value':
                        var $3534 = self.idx;
                        var $3535 = self.code;
                        var $3536 = self.val;
                        var $3537 = Parser$Reply$value$($3534, $3535, Kind$Term$ori$($3536, Kind$Term$app$(_term$2, Kind$Term$hol$(Bits$e))));
                        var $3529 = $3537;
                        break;
                };
                var $3522 = $3529;
                break;
        };
        return $3522;
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
                        var $3539 = self.idx;
                        var $3540 = self.code;
                        var $3541 = self.val;
                        var $3542 = Kind$Parser$suffix$(_init$1, $3541, $3539, $3540);
                        var $3538 = $3542;
                        break;
                    case 'Parser.Reply.error':
                        var $3543 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $3538 = $3543;
                        break;
                };
                return $3538;
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
                var $3545 = self.idx;
                var $3546 = self.code;
                var $3547 = self.err;
                var $3548 = Parser$Reply$error$($3545, $3546, $3547);
                var $3544 = $3548;
                break;
            case 'Parser.Reply.value':
                var $3549 = self.idx;
                var $3550 = self.code;
                var $3551 = self.val;
                var self = Parser$first_of$(List$cons$(Kind$Parser$type, List$cons$(Kind$Parser$forall, List$cons$(Kind$Parser$lambda, List$cons$(Kind$Parser$lambda$erased, List$cons$(Kind$Parser$lambda$nameless, List$cons$(Kind$Parser$parenthesis, List$cons$(Kind$Parser$letforrange$u32, List$cons$(Kind$Parser$letforin, List$cons$(Kind$Parser$let, List$cons$(Kind$Parser$get, List$cons$(Kind$Parser$def, List$cons$(Kind$Parser$goal_rewrite, List$cons$(Kind$Parser$if, List$cons$(Kind$Parser$char, List$cons$(Kind$Parser$string, List$cons$(Kind$Parser$pair, List$cons$(Kind$Parser$sigma$type, List$cons$(Kind$Parser$some, List$cons$(Kind$Parser$apply, List$cons$(Kind$Parser$mirror, List$cons$(Kind$Parser$list, List$cons$(Kind$Parser$log, List$cons$(Kind$Parser$forrange$u32, List$cons$(Kind$Parser$forrange$u32$2, List$cons$(Kind$Parser$forin, List$cons$(Kind$Parser$forin$2, List$cons$(Kind$Parser$do, List$cons$(Kind$Parser$case, List$cons$(Kind$Parser$open, List$cons$(Kind$Parser$goal, List$cons$(Kind$Parser$hole, List$cons$(Kind$Parser$u8, List$cons$(Kind$Parser$u16, List$cons$(Kind$Parser$u32, List$cons$(Kind$Parser$u64, List$cons$(Kind$Parser$nat, List$cons$(Kind$Parser$reference, List$nil))))))))))))))))))))))))))))))))))))))($3549)($3550);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3553 = self.idx;
                        var $3554 = self.code;
                        var $3555 = self.err;
                        var $3556 = Parser$Reply$error$($3553, $3554, $3555);
                        var $3552 = $3556;
                        break;
                    case 'Parser.Reply.value':
                        var $3557 = self.idx;
                        var $3558 = self.code;
                        var $3559 = self.val;
                        var $3560 = Kind$Parser$suffix$($3551, $3559, $3557, $3558);
                        var $3552 = $3560;
                        break;
                };
                var $3544 = $3552;
                break;
        };
        return $3544;
    };
    const Kind$Parser$term = x0 => x1 => Kind$Parser$term$(x0, x1);

    function Kind$Parser$name_term$(_sep$1, _idx$2, _code$3) {
        var self = Kind$Parser$name$(_idx$2, _code$3);
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
                var self = Kind$Parser$text$(_sep$1, $3566, $3567);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3570 = self.idx;
                        var $3571 = self.code;
                        var $3572 = self.err;
                        var $3573 = Parser$Reply$error$($3570, $3571, $3572);
                        var $3569 = $3573;
                        break;
                    case 'Parser.Reply.value':
                        var $3574 = self.idx;
                        var $3575 = self.code;
                        var self = Kind$Parser$term$($3574, $3575);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3577 = self.idx;
                                var $3578 = self.code;
                                var $3579 = self.err;
                                var $3580 = Parser$Reply$error$($3577, $3578, $3579);
                                var $3576 = $3580;
                                break;
                            case 'Parser.Reply.value':
                                var $3581 = self.idx;
                                var $3582 = self.code;
                                var $3583 = self.val;
                                var $3584 = Parser$Reply$value$($3581, $3582, Pair$new$($3568, $3583));
                                var $3576 = $3584;
                                break;
                        };
                        var $3569 = $3576;
                        break;
                };
                var $3561 = $3569;
                break;
        };
        return $3561;
    };
    const Kind$Parser$name_term = x0 => x1 => x2 => Kind$Parser$name_term$(x0, x1, x2);

    function Kind$Binder$new$(_eras$1, _name$2, _term$3) {
        var $3585 = ({
            _: 'Kind.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $3585;
    };
    const Kind$Binder$new = x0 => x1 => x2 => Kind$Binder$new$(x0, x1, x2);

    function Kind$Parser$binder$homo$(_sep$1, _eras$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$((() => {
            var self = _eras$2;
            if (self) {
                var $3587 = "<";
                return $3587;
            } else {
                var $3588 = "(";
                return $3588;
            };
        })(), _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3589 = self.idx;
                var $3590 = self.code;
                var $3591 = self.err;
                var $3592 = Parser$Reply$error$($3589, $3590, $3591);
                var $3586 = $3592;
                break;
            case 'Parser.Reply.value':
                var $3593 = self.idx;
                var $3594 = self.code;
                var self = Parser$until1$(Kind$Parser$text((() => {
                    var self = _eras$2;
                    if (self) {
                        var $3596 = ">";
                        return $3596;
                    } else {
                        var $3597 = ")";
                        return $3597;
                    };
                })()), Kind$Parser$item(Kind$Parser$name_term(_sep$1)), $3593, $3594);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3598 = self.idx;
                        var $3599 = self.code;
                        var $3600 = self.err;
                        var $3601 = Parser$Reply$error$($3598, $3599, $3600);
                        var $3595 = $3601;
                        break;
                    case 'Parser.Reply.value':
                        var $3602 = self.idx;
                        var $3603 = self.code;
                        var $3604 = self.val;
                        var $3605 = Parser$Reply$value$($3602, $3603, List$mapped$($3604, (_pair$11 => {
                            var self = _pair$11;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3607 = self.fst;
                                    var $3608 = self.snd;
                                    var $3609 = Kind$Binder$new$(_eras$2, $3607, $3608);
                                    var $3606 = $3609;
                                    break;
                            };
                            return $3606;
                        })));
                        var $3595 = $3605;
                        break;
                };
                var $3586 = $3595;
                break;
        };
        return $3586;
    };
    const Kind$Parser$binder$homo = x0 => x1 => x2 => x3 => Kind$Parser$binder$homo$(x0, x1, x2, x3);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3611 = self.head;
                var $3612 = self.tail;
                var $3613 = List$cons$($3611, List$concat$($3612, _bs$3));
                var $3610 = $3613;
                break;
            case 'List.nil':
                var $3614 = _bs$3;
                var $3610 = $3614;
                break;
        };
        return $3610;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $3616 = self.head;
                var $3617 = self.tail;
                var $3618 = List$concat$($3616, List$flatten$($3617));
                var $3615 = $3618;
                break;
            case 'List.nil':
                var $3619 = List$nil;
                var $3615 = $3619;
                break;
        };
        return $3615;
    };
    const List$flatten = x0 => List$flatten$(x0);

    function Kind$Parser$binder$(_sep$1, _idx$2, _code$3) {
        var self = Parser$many1$(Parser$first_of$(List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$true), List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$false), List$nil))), _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3621 = self.idx;
                var $3622 = self.code;
                var $3623 = self.err;
                var $3624 = Parser$Reply$error$($3621, $3622, $3623);
                var $3620 = $3624;
                break;
            case 'Parser.Reply.value':
                var $3625 = self.idx;
                var $3626 = self.code;
                var $3627 = self.val;
                var $3628 = Parser$Reply$value$($3625, $3626, List$flatten$($3627));
                var $3620 = $3628;
                break;
        };
        return $3620;
    };
    const Kind$Parser$binder = x0 => x1 => x2 => Kind$Parser$binder$(x0, x1, x2);
    const List$length = a0 => (list_length(a0));

    function Kind$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.cons':
                var $3630 = self.head;
                var $3631 = self.tail;
                var self = $3630;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3633 = self.eras;
                        var $3634 = self.name;
                        var $3635 = self.term;
                        var $3636 = Kind$Term$all$($3633, "", $3634, $3635, (_s$8 => _x$9 => {
                            var $3637 = Kind$Parser$make_forall$($3631, _body$2);
                            return $3637;
                        }));
                        var $3632 = $3636;
                        break;
                };
                var $3629 = $3632;
                break;
            case 'List.nil':
                var $3638 = _body$2;
                var $3629 = $3638;
                break;
        };
        return $3629;
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
                        var $3639 = self.head;
                        var $3640 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $3642 = Maybe$some$($3639);
                            var $3641 = $3642;
                        } else {
                            var $3643 = (self - 1n);
                            var $3644 = List$at$($3643, $3640);
                            var $3641 = $3644;
                        };
                        return $3641;
                    case 'List.nil':
                        var $3645 = Maybe$none;
                        return $3645;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $3646 = List$at$(_index$2, List$reverse$(_list$3));
        return $3646;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Kind$Term$var$(_name$1, _indx$2) {
        var $3647 = ({
            _: 'Kind.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $3647;
    };
    const Kind$Term$var = x0 => x1 => Kind$Term$var$(x0, x1);

    function Kind$Context$get_name_skips$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3649 = Pair$new$("", 0n);
            var $3648 = $3649;
        } else {
            var $3650 = self.charCodeAt(0);
            var $3651 = self.slice(1);
            var _name_skips$4 = Kind$Context$get_name_skips$($3651);
            var self = _name_skips$4;
            switch (self._) {
                case 'Pair.new':
                    var $3653 = self.fst;
                    var $3654 = self.snd;
                    var self = ($3650 === 94);
                    if (self) {
                        var $3656 = Pair$new$($3653, Nat$succ$($3654));
                        var $3655 = $3656;
                    } else {
                        var $3657 = Pair$new$(String$cons$($3650, $3653), $3654);
                        var $3655 = $3657;
                    };
                    var $3652 = $3655;
                    break;
            };
            var $3648 = $3652;
        };
        return $3648;
    };
    const Kind$Context$get_name_skips = x0 => Kind$Context$get_name_skips$(x0);

    function Kind$Name$eql$(_a$1, _b$2) {
        var $3658 = (_a$1 === _b$2);
        return $3658;
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
                        var $3659 = self.head;
                        var $3660 = self.tail;
                        var self = $3659;
                        switch (self._) {
                            case 'Pair.new':
                                var $3662 = self.fst;
                                var $3663 = self.snd;
                                var self = Kind$Name$eql$(_name$1, $3662);
                                if (self) {
                                    var self = _skip$2;
                                    if (self === 0n) {
                                        var $3666 = Maybe$some$($3663);
                                        var $3665 = $3666;
                                    } else {
                                        var $3667 = (self - 1n);
                                        var $3668 = Kind$Context$find$go$(_name$1, $3667, $3660);
                                        var $3665 = $3668;
                                    };
                                    var $3664 = $3665;
                                } else {
                                    var $3669 = Kind$Context$find$go$(_name$1, _skip$2, $3660);
                                    var $3664 = $3669;
                                };
                                var $3661 = $3664;
                                break;
                        };
                        return $3661;
                    case 'List.nil':
                        var $3670 = Maybe$none;
                        return $3670;
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
                var $3672 = self.fst;
                var $3673 = self.snd;
                var $3674 = Kind$Context$find$go$($3672, $3673, _ctx$2);
                var $3671 = $3674;
                break;
        };
        return $3671;
    };
    const Kind$Context$find = x0 => x1 => Kind$Context$find$(x0, x1);

    function Kind$Path$o$(_path$1, _x$2) {
        var $3675 = _path$1((_x$2 + '0'));
        return $3675;
    };
    const Kind$Path$o = x0 => x1 => Kind$Path$o$(x0, x1);

    function Kind$Path$i$(_path$1, _x$2) {
        var $3676 = _path$1((_x$2 + '1'));
        return $3676;
    };
    const Kind$Path$i = x0 => x1 => Kind$Path$i$(x0, x1);

    function Kind$Path$to_bits$(_path$1) {
        var $3677 = _path$1(Bits$e);
        return $3677;
    };
    const Kind$Path$to_bits = x0 => Kind$Path$to_bits$(x0);

    function Kind$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kind.Term.var':
                var $3679 = self.name;
                var $3680 = self.indx;
                var self = List$at_last$($3680, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3682 = self.value;
                        var $3683 = Pair$snd$($3682);
                        var $3681 = $3683;
                        break;
                    case 'Maybe.none':
                        var $3684 = Kind$Term$var$($3679, $3680);
                        var $3681 = $3684;
                        break;
                };
                var $3678 = $3681;
                break;
            case 'Kind.Term.ref':
                var $3685 = self.name;
                var self = Kind$Context$find$($3685, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3687 = self.value;
                        var $3688 = $3687;
                        var $3686 = $3688;
                        break;
                    case 'Maybe.none':
                        var $3689 = Kind$Term$ref$($3685);
                        var $3686 = $3689;
                        break;
                };
                var $3678 = $3686;
                break;
            case 'Kind.Term.all':
                var $3690 = self.eras;
                var $3691 = self.self;
                var $3692 = self.name;
                var $3693 = self.xtyp;
                var $3694 = self.body;
                var _vlen$9 = (list_length(_vars$1));
                var $3695 = Kind$Term$all$($3690, $3691, $3692, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3693), (_s$10 => _x$11 => {
                    var $3696 = Kind$Term$bind$(List$cons$(Pair$new$($3692, _x$11), List$cons$(Pair$new$($3691, _s$10), _vars$1)), Kind$Path$i(_path$2), $3694(Kind$Term$var$($3691, _vlen$9))(Kind$Term$var$($3692, Nat$succ$(_vlen$9))));
                    return $3696;
                }));
                var $3678 = $3695;
                break;
            case 'Kind.Term.lam':
                var $3697 = self.name;
                var $3698 = self.body;
                var _vlen$6 = (list_length(_vars$1));
                var $3699 = Kind$Term$lam$($3697, (_x$7 => {
                    var $3700 = Kind$Term$bind$(List$cons$(Pair$new$($3697, _x$7), _vars$1), Kind$Path$o(_path$2), $3698(Kind$Term$var$($3697, _vlen$6)));
                    return $3700;
                }));
                var $3678 = $3699;
                break;
            case 'Kind.Term.app':
                var $3701 = self.func;
                var $3702 = self.argm;
                var $3703 = Kind$Term$app$(Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3701), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3702));
                var $3678 = $3703;
                break;
            case 'Kind.Term.let':
                var $3704 = self.name;
                var $3705 = self.expr;
                var $3706 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3707 = Kind$Term$let$($3704, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3705), (_x$8 => {
                    var $3708 = Kind$Term$bind$(List$cons$(Pair$new$($3704, _x$8), _vars$1), Kind$Path$i(_path$2), $3706(Kind$Term$var$($3704, _vlen$7)));
                    return $3708;
                }));
                var $3678 = $3707;
                break;
            case 'Kind.Term.def':
                var $3709 = self.name;
                var $3710 = self.expr;
                var $3711 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3712 = Kind$Term$def$($3709, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3710), (_x$8 => {
                    var $3713 = Kind$Term$bind$(List$cons$(Pair$new$($3709, _x$8), _vars$1), Kind$Path$i(_path$2), $3711(Kind$Term$var$($3709, _vlen$7)));
                    return $3713;
                }));
                var $3678 = $3712;
                break;
            case 'Kind.Term.ann':
                var $3714 = self.done;
                var $3715 = self.term;
                var $3716 = self.type;
                var $3717 = Kind$Term$ann$($3714, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3715), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3716));
                var $3678 = $3717;
                break;
            case 'Kind.Term.gol':
                var $3718 = self.name;
                var $3719 = self.dref;
                var $3720 = self.verb;
                var $3721 = Kind$Term$gol$($3718, $3719, $3720);
                var $3678 = $3721;
                break;
            case 'Kind.Term.nat':
                var $3722 = self.natx;
                var $3723 = Kind$Term$nat$($3722);
                var $3678 = $3723;
                break;
            case 'Kind.Term.chr':
                var $3724 = self.chrx;
                var $3725 = Kind$Term$chr$($3724);
                var $3678 = $3725;
                break;
            case 'Kind.Term.str':
                var $3726 = self.strx;
                var $3727 = Kind$Term$str$($3726);
                var $3678 = $3727;
                break;
            case 'Kind.Term.cse':
                var $3728 = self.expr;
                var $3729 = self.name;
                var $3730 = self.with;
                var $3731 = self.cses;
                var $3732 = self.moti;
                var _expr$10 = Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3728);
                var _name$11 = $3729;
                var _wyth$12 = $3730;
                var _cses$13 = $3731;
                var _moti$14 = $3732;
                var $3733 = Kind$Term$cse$(Kind$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $3678 = $3733;
                break;
            case 'Kind.Term.ori':
                var $3734 = self.orig;
                var $3735 = self.expr;
                var $3736 = Kind$Term$ori$($3734, Kind$Term$bind$(_vars$1, _path$2, $3735));
                var $3678 = $3736;
                break;
            case 'Kind.Term.typ':
                var $3737 = Kind$Term$typ;
                var $3678 = $3737;
                break;
            case 'Kind.Term.hol':
                var $3738 = Kind$Term$hol$(Kind$Path$to_bits$(_path$2));
                var $3678 = $3738;
                break;
        };
        return $3678;
    };
    const Kind$Term$bind = x0 => x1 => x2 => Kind$Term$bind$(x0, x1, x2);
    const Kind$Status$done = ({
        _: 'Kind.Status.done'
    });

    function Kind$define$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _done$9, _defs$10) {
        var self = _done$9;
        if (self) {
            var $3740 = Kind$Status$done;
            var _stat$11 = $3740;
        } else {
            var $3741 = Kind$Status$init;
            var _stat$11 = $3741;
        };
        var $3739 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$11), _defs$10);
        return $3739;
    };
    const Kind$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Kind$define$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Kind$Parser$file$def$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3743 = self.idx;
                var $3744 = self.code;
                var $3745 = self.err;
                var $3746 = Parser$Reply$error$($3743, $3744, $3745);
                var $3742 = $3746;
                break;
            case 'Parser.Reply.value':
                var $3747 = self.idx;
                var $3748 = self.code;
                var $3749 = self.val;
                var self = Kind$Parser$name1$($3747, $3748);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3751 = self.idx;
                        var $3752 = self.code;
                        var $3753 = self.err;
                        var $3754 = Parser$Reply$error$($3751, $3752, $3753);
                        var $3750 = $3754;
                        break;
                    case 'Parser.Reply.value':
                        var $3755 = self.idx;
                        var $3756 = self.code;
                        var $3757 = self.val;
                        var self = Parser$many$(Kind$Parser$binder(":"))($3755)($3756);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3759 = self.idx;
                                var $3760 = self.code;
                                var $3761 = self.err;
                                var $3762 = Parser$Reply$error$($3759, $3760, $3761);
                                var $3758 = $3762;
                                break;
                            case 'Parser.Reply.value':
                                var $3763 = self.idx;
                                var $3764 = self.code;
                                var $3765 = self.val;
                                var _args$15 = List$flatten$($3765);
                                var self = Kind$Parser$text$(":", $3763, $3764);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3767 = self.idx;
                                        var $3768 = self.code;
                                        var $3769 = self.err;
                                        var $3770 = Parser$Reply$error$($3767, $3768, $3769);
                                        var $3766 = $3770;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3771 = self.idx;
                                        var $3772 = self.code;
                                        var self = Kind$Parser$term$($3771, $3772);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3774 = self.idx;
                                                var $3775 = self.code;
                                                var $3776 = self.err;
                                                var $3777 = Parser$Reply$error$($3774, $3775, $3776);
                                                var $3773 = $3777;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3778 = self.idx;
                                                var $3779 = self.code;
                                                var $3780 = self.val;
                                                var self = Kind$Parser$term$($3778, $3779);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3782 = self.idx;
                                                        var $3783 = self.code;
                                                        var $3784 = self.err;
                                                        var $3785 = Parser$Reply$error$($3782, $3783, $3784);
                                                        var $3781 = $3785;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3786 = self.idx;
                                                        var $3787 = self.code;
                                                        var $3788 = self.val;
                                                        var self = Kind$Parser$stop$($3749, $3786, $3787);
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
                                                                var $3796 = self.val;
                                                                var _arit$28 = (list_length(_args$15));
                                                                var _type$29 = Kind$Parser$make_forall$(_args$15, $3780);
                                                                var _term$30 = Kind$Parser$make_lambda$(List$mapped$(_args$15, (_x$30 => {
                                                                    var self = _x$30;
                                                                    switch (self._) {
                                                                        case 'Kind.Binder.new':
                                                                            var $3799 = self.name;
                                                                            var $3800 = $3799;
                                                                            var $3798 = $3800;
                                                                            break;
                                                                    };
                                                                    return $3798;
                                                                })), $3788);
                                                                var _type$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                                    var $3801 = (_x$31 + '1');
                                                                    return $3801;
                                                                }), _type$29);
                                                                var _term$32 = Kind$Term$bind$(List$nil, (_x$32 => {
                                                                    var $3802 = (_x$32 + '0');
                                                                    return $3802;
                                                                }), _term$30);
                                                                var _defs$33 = Kind$define$(_file$1, _code$2, $3796, $3757, _term$32, _type$31, Bool$false, _arit$28, Bool$false, _defs$3);
                                                                var $3797 = Parser$Reply$value$($3794, $3795, _defs$33);
                                                                var $3789 = $3797;
                                                                break;
                                                        };
                                                        var $3781 = $3789;
                                                        break;
                                                };
                                                var $3773 = $3781;
                                                break;
                                        };
                                        var $3766 = $3773;
                                        break;
                                };
                                var $3758 = $3766;
                                break;
                        };
                        var $3750 = $3758;
                        break;
                };
                var $3742 = $3750;
                break;
        };
        return $3742;
    };
    const Kind$Parser$file$def = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$def$(x0, x1, x2, x3, x4);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $3804 = self.value;
                var $3805 = $3804;
                var $3803 = $3805;
                break;
            case 'Maybe.none':
                var $3806 = _a$2;
                var $3803 = $3806;
                break;
        };
        return $3803;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Kind$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $3807 = ({
            _: 'Kind.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $3807;
    };
    const Kind$Constructor$new = x0 => x1 => x2 => Kind$Constructor$new$(x0, x1, x2);

    function Kind$Parser$constructor$(_namespace$1, _idx$2, _code$3) {
        var self = Kind$Parser$name1$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3809 = self.idx;
                var $3810 = self.code;
                var $3811 = self.err;
                var $3812 = Parser$Reply$error$($3809, $3810, $3811);
                var $3808 = $3812;
                break;
            case 'Parser.Reply.value':
                var $3813 = self.idx;
                var $3814 = self.code;
                var $3815 = self.val;
                var self = Parser$maybe$(Kind$Parser$binder(":"), $3813, $3814);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3817 = self.idx;
                        var $3818 = self.code;
                        var $3819 = self.err;
                        var $3820 = Parser$Reply$error$($3817, $3818, $3819);
                        var $3816 = $3820;
                        break;
                    case 'Parser.Reply.value':
                        var $3821 = self.idx;
                        var $3822 = self.code;
                        var $3823 = self.val;
                        var self = Parser$maybe$((_idx$10 => _code$11 => {
                            var self = Kind$Parser$text$("~", _idx$10, _code$11);
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
                                    var $3832 = Kind$Parser$binder$("=", $3830, $3831);
                                    var $3825 = $3832;
                                    break;
                            };
                            return $3825;
                        }), $3821, $3822);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3833 = self.idx;
                                var $3834 = self.code;
                                var $3835 = self.err;
                                var $3836 = Parser$Reply$error$($3833, $3834, $3835);
                                var $3824 = $3836;
                                break;
                            case 'Parser.Reply.value':
                                var $3837 = self.idx;
                                var $3838 = self.code;
                                var $3839 = self.val;
                                var _args$13 = Maybe$default$(List$nil, $3823);
                                var _inds$14 = Maybe$default$(List$nil, $3839);
                                var $3840 = Parser$Reply$value$($3837, $3838, Kind$Constructor$new$($3815, _args$13, _inds$14));
                                var $3824 = $3840;
                                break;
                        };
                        var $3816 = $3824;
                        break;
                };
                var $3808 = $3816;
                break;
        };
        return $3808;
    };
    const Kind$Parser$constructor = x0 => x1 => x2 => Kind$Parser$constructor$(x0, x1, x2);

    function Kind$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $3841 = ({
            _: 'Kind.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $3841;
    };
    const Kind$Datatype$new = x0 => x1 => x2 => x3 => Kind$Datatype$new$(x0, x1, x2, x3);

    function Kind$Parser$datatype$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("type ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3843 = self.idx;
                var $3844 = self.code;
                var $3845 = self.err;
                var $3846 = Parser$Reply$error$($3843, $3844, $3845);
                var $3842 = $3846;
                break;
            case 'Parser.Reply.value':
                var $3847 = self.idx;
                var $3848 = self.code;
                var self = Kind$Parser$name1$($3847, $3848);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3850 = self.idx;
                        var $3851 = self.code;
                        var $3852 = self.err;
                        var $3853 = Parser$Reply$error$($3850, $3851, $3852);
                        var $3849 = $3853;
                        break;
                    case 'Parser.Reply.value':
                        var $3854 = self.idx;
                        var $3855 = self.code;
                        var $3856 = self.val;
                        var self = Parser$maybe$(Kind$Parser$binder(":"), $3854, $3855);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3858 = self.idx;
                                var $3859 = self.code;
                                var $3860 = self.err;
                                var $3861 = Parser$Reply$error$($3858, $3859, $3860);
                                var $3857 = $3861;
                                break;
                            case 'Parser.Reply.value':
                                var $3862 = self.idx;
                                var $3863 = self.code;
                                var $3864 = self.val;
                                var self = Parser$maybe$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("~", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $3867 = self.idx;
                                            var $3868 = self.code;
                                            var $3869 = self.err;
                                            var $3870 = Parser$Reply$error$($3867, $3868, $3869);
                                            var $3866 = $3870;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $3871 = self.idx;
                                            var $3872 = self.code;
                                            var $3873 = Kind$Parser$binder$(":", $3871, $3872);
                                            var $3866 = $3873;
                                            break;
                                    };
                                    return $3866;
                                }), $3862, $3863);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3874 = self.idx;
                                        var $3875 = self.code;
                                        var $3876 = self.err;
                                        var $3877 = Parser$Reply$error$($3874, $3875, $3876);
                                        var $3865 = $3877;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3878 = self.idx;
                                        var $3879 = self.code;
                                        var $3880 = self.val;
                                        var _pars$15 = Maybe$default$(List$nil, $3864);
                                        var _inds$16 = Maybe$default$(List$nil, $3880);
                                        var self = Kind$Parser$text$("{", $3878, $3879);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3882 = self.idx;
                                                var $3883 = self.code;
                                                var $3884 = self.err;
                                                var $3885 = Parser$Reply$error$($3882, $3883, $3884);
                                                var $3881 = $3885;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3886 = self.idx;
                                                var $3887 = self.code;
                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item(Kind$Parser$constructor($3856)))($3886)($3887);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3889 = self.idx;
                                                        var $3890 = self.code;
                                                        var $3891 = self.err;
                                                        var $3892 = Parser$Reply$error$($3889, $3890, $3891);
                                                        var $3888 = $3892;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3893 = self.idx;
                                                        var $3894 = self.code;
                                                        var $3895 = self.val;
                                                        var $3896 = Parser$Reply$value$($3893, $3894, Kind$Datatype$new$($3856, _pars$15, _inds$16, $3895));
                                                        var $3888 = $3896;
                                                        break;
                                                };
                                                var $3881 = $3888;
                                                break;
                                        };
                                        var $3865 = $3881;
                                        break;
                                };
                                var $3857 = $3865;
                                break;
                        };
                        var $3849 = $3857;
                        break;
                };
                var $3842 = $3849;
                break;
        };
        return $3842;
    };
    const Kind$Parser$datatype = x0 => x1 => Kind$Parser$datatype$(x0, x1);

    function Kind$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.cons':
                var $3898 = self.head;
                var $3899 = self.tail;
                var self = $3898;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3901 = self.eras;
                        var $3902 = self.name;
                        var $3903 = self.term;
                        var $3904 = Kind$Term$all$($3901, "", $3902, $3903, (_s$9 => _x$10 => {
                            var $3905 = Kind$Datatype$build_term$motive$go$(_type$1, _name$2, $3899);
                            return $3905;
                        }));
                        var $3900 = $3904;
                        break;
                };
                var $3897 = $3900;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3907 = self.pars;
                        var $3908 = self.inds;
                        var _slf$8 = Kind$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $3911 = _slf$8;
                            var $3912 = $3907;
                            let _slf$10 = $3911;
                            let _var$9;
                            while ($3912._ === 'List.cons') {
                                _var$9 = $3912.head;
                                var $3911 = Kind$Term$app$(_slf$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3913 = self.name;
                                            var $3914 = $3913;
                                            return $3914;
                                    };
                                })()));
                                _slf$10 = $3911;
                                $3912 = $3912.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $3916 = _slf$9;
                            var $3917 = $3908;
                            let _slf$11 = $3916;
                            let _var$10;
                            while ($3917._ === 'List.cons') {
                                _var$10 = $3917.head;
                                var $3916 = Kind$Term$app$(_slf$11, Kind$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3918 = self.name;
                                            var $3919 = $3918;
                                            return $3919;
                                    };
                                })()));
                                _slf$11 = $3916;
                                $3917 = $3917.tail;
                            }
                            return _slf$11;
                        })();
                        var $3909 = Kind$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $3920 = Kind$Term$typ;
                            return $3920;
                        }));
                        var $3906 = $3909;
                        break;
                };
                var $3897 = $3906;
                break;
        };
        return $3897;
    };
    const Kind$Datatype$build_term$motive$go = x0 => x1 => x2 => Kind$Datatype$build_term$motive$go$(x0, x1, x2);

    function Kind$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3922 = self.name;
                var $3923 = self.inds;
                var $3924 = Kind$Datatype$build_term$motive$go$(_type$1, $3922, $3923);
                var $3921 = $3924;
                break;
        };
        return $3921;
    };
    const Kind$Datatype$build_term$motive = x0 => Kind$Datatype$build_term$motive$(x0);

    function Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.cons':
                var $3926 = self.head;
                var $3927 = self.tail;
                var self = $3926;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3929 = self.eras;
                        var $3930 = self.name;
                        var $3931 = self.term;
                        var _eras$9 = $3929;
                        var _name$10 = $3930;
                        var _xtyp$11 = $3931;
                        var _body$12 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3927);
                        var $3932 = Kind$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $3933 = _body$12;
                            return $3933;
                        }));
                        var $3928 = $3932;
                        break;
                };
                var $3925 = $3928;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3935 = self.name;
                        var $3936 = self.pars;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Kind.Constructor.new':
                                var $3938 = self.name;
                                var $3939 = self.args;
                                var $3940 = self.inds;
                                var _ret$11 = Kind$Term$ref$(Kind$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $3943 = _ret$11;
                                    var $3944 = $3940;
                                    let _ret$13 = $3943;
                                    let _var$12;
                                    while ($3944._ === 'List.cons') {
                                        _var$12 = $3944.head;
                                        var $3943 = Kind$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3945 = self.term;
                                                    var $3946 = $3945;
                                                    return $3946;
                                            };
                                        })());
                                        _ret$13 = $3943;
                                        $3944 = $3944.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($3935, List$cons$(Kind$Name$read$("."), List$cons$($3938, List$nil))));
                                var _slf$14 = Kind$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $3948 = _slf$14;
                                    var $3949 = $3936;
                                    let _slf$16 = $3948;
                                    let _var$15;
                                    while ($3949._ === 'List.cons') {
                                        _var$15 = $3949.head;
                                        var $3948 = Kind$Term$app$(_slf$16, Kind$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3950 = self.name;
                                                    var $3951 = $3950;
                                                    return $3951;
                                            };
                                        })()));
                                        _slf$16 = $3948;
                                        $3949 = $3949.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $3953 = _slf$15;
                                    var $3954 = $3939;
                                    let _slf$17 = $3953;
                                    let _var$16;
                                    while ($3954._ === 'List.cons') {
                                        _var$16 = $3954.head;
                                        var $3953 = Kind$Term$app$(_slf$17, Kind$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3955 = self.name;
                                                    var $3956 = $3955;
                                                    return $3956;
                                            };
                                        })()));
                                        _slf$17 = $3953;
                                        $3954 = $3954.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $3941 = Kind$Term$app$(_ret$12, _slf$16);
                                var $3937 = $3941;
                                break;
                        };
                        var $3934 = $3937;
                        break;
                };
                var $3925 = $3934;
                break;
        };
        return $3925;
    };
    const Kind$Datatype$build_term$constructor$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kind.Constructor.new':
                var $3958 = self.args;
                var $3959 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3958);
                var $3957 = $3959;
                break;
        };
        return $3957;
    };
    const Kind$Datatype$build_term$constructor = x0 => x1 => Kind$Datatype$build_term$constructor$(x0, x1);

    function Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3961 = self.head;
                var $3962 = self.tail;
                var self = $3961;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3964 = self.name;
                        var $3965 = Kind$Term$all$(Bool$false, "", $3964, Kind$Datatype$build_term$constructor$(_type$1, $3961), (_s$9 => _x$10 => {
                            var $3966 = Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, $3962);
                            return $3966;
                        }));
                        var $3963 = $3965;
                        break;
                };
                var $3960 = $3963;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3968 = self.inds;
                        var _ret$8 = Kind$Term$ref$(Kind$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $3971 = _ret$8;
                            var $3972 = $3968;
                            let _ret$10 = $3971;
                            let _var$9;
                            while ($3972._ === 'List.cons') {
                                _var$9 = $3972.head;
                                var $3971 = Kind$Term$app$(_ret$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3973 = self.name;
                                            var $3974 = $3973;
                                            return $3974;
                                    };
                                })()));
                                _ret$10 = $3971;
                                $3972 = $3972.tail;
                            }
                            return _ret$10;
                        })();
                        var $3969 = Kind$Term$app$(_ret$9, Kind$Term$ref$((_name$2 + ".Self")));
                        var $3967 = $3969;
                        break;
                };
                var $3960 = $3967;
                break;
        };
        return $3960;
    };
    const Kind$Datatype$build_term$constructors$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3976 = self.name;
                var $3977 = self.ctrs;
                var $3978 = Kind$Datatype$build_term$constructors$go$(_type$1, $3976, $3977);
                var $3975 = $3978;
                break;
        };
        return $3975;
    };
    const Kind$Datatype$build_term$constructors = x0 => Kind$Datatype$build_term$constructors$(x0);

    function Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3980 = self.head;
                var $3981 = self.tail;
                var self = $3980;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3983 = self.name;
                        var $3984 = Kind$Term$lam$($3983, (_x$10 => {
                            var $3985 = Kind$Datatype$build_term$go$(_type$1, _name$2, $3981, _inds$4);
                            return $3985;
                        }));
                        var $3982 = $3984;
                        break;
                };
                var $3979 = $3982;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3987 = self.head;
                        var $3988 = self.tail;
                        var self = $3987;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3990 = self.name;
                                var $3991 = Kind$Term$lam$($3990, (_x$10 => {
                                    var $3992 = Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $3988);
                                    return $3992;
                                }));
                                var $3989 = $3991;
                                break;
                        };
                        var $3986 = $3989;
                        break;
                    case 'List.nil':
                        var $3993 = Kind$Term$all$(Bool$true, (_name$2 + ".Self"), Kind$Name$read$("P"), Kind$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $3994 = Kind$Datatype$build_term$constructors$(_type$1);
                            return $3994;
                        }));
                        var $3986 = $3993;
                        break;
                };
                var $3979 = $3986;
                break;
        };
        return $3979;
    };
    const Kind$Datatype$build_term$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_term$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3996 = self.name;
                var $3997 = self.pars;
                var $3998 = self.inds;
                var $3999 = Kind$Datatype$build_term$go$(_type$1, $3996, $3997, $3998);
                var $3995 = $3999;
                break;
        };
        return $3995;
    };
    const Kind$Datatype$build_term = x0 => Kind$Datatype$build_term$(x0);

    function Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $4001 = self.head;
                var $4002 = self.tail;
                var self = $4001;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $4004 = self.name;
                        var $4005 = self.term;
                        var $4006 = Kind$Term$all$(Bool$false, "", $4004, $4005, (_s$10 => _x$11 => {
                            var $4007 = Kind$Datatype$build_type$go$(_type$1, _name$2, $4002, _inds$4);
                            return $4007;
                        }));
                        var $4003 = $4006;
                        break;
                };
                var $4000 = $4003;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $4009 = self.head;
                        var $4010 = self.tail;
                        var self = $4009;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $4012 = self.name;
                                var $4013 = self.term;
                                var $4014 = Kind$Term$all$(Bool$false, "", $4012, $4013, (_s$10 => _x$11 => {
                                    var $4015 = Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $4010);
                                    return $4015;
                                }));
                                var $4011 = $4014;
                                break;
                        };
                        var $4008 = $4011;
                        break;
                    case 'List.nil':
                        var $4016 = Kind$Term$typ;
                        var $4008 = $4016;
                        break;
                };
                var $4000 = $4008;
                break;
        };
        return $4000;
    };
    const Kind$Datatype$build_type$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_type$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4018 = self.name;
                var $4019 = self.pars;
                var $4020 = self.inds;
                var $4021 = Kind$Datatype$build_type$go$(_type$1, $4018, $4019, $4020);
                var $4017 = $4021;
                break;
        };
        return $4017;
    };
    const Kind$Datatype$build_type = x0 => Kind$Datatype$build_type$(x0);

    function Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $4023 = self.head;
                var $4024 = self.tail;
                var self = $4023;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4026 = self.name;
                        var $4027 = Kind$Term$lam$($4026, (_x$9 => {
                            var $4028 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $4024);
                            return $4028;
                        }));
                        var $4025 = $4027;
                        break;
                };
                var $4022 = $4025;
                break;
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4030 = self.name;
                        var $4031 = self.args;
                        var _ret$7 = Kind$Term$ref$($4030);
                        var _ret$8 = (() => {
                            var $4034 = _ret$7;
                            var $4035 = $4031;
                            let _ret$9 = $4034;
                            let _arg$8;
                            while ($4035._ === 'List.cons') {
                                _arg$8 = $4035.head;
                                var $4034 = Kind$Term$app$(_ret$9, Kind$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $4036 = self.name;
                                            var $4037 = $4036;
                                            return $4037;
                                    };
                                })()));
                                _ret$9 = $4034;
                                $4035 = $4035.tail;
                            }
                            return _ret$9;
                        })();
                        var $4032 = _ret$8;
                        var $4029 = $4032;
                        break;
                };
                var $4022 = $4029;
                break;
        };
        return $4022;
    };
    const Kind$Constructor$build_term$opt$go = x0 => x1 => x2 => Kind$Constructor$build_term$opt$go$(x0, x1, x2);

    function Kind$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4039 = self.ctrs;
                var $4040 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $4039);
                var $4038 = $4040;
                break;
        };
        return $4038;
    };
    const Kind$Constructor$build_term$opt = x0 => x1 => Kind$Constructor$build_term$opt$(x0, x1);

    function Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $4042 = self.head;
                var $4043 = self.tail;
                var self = $4042;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $4045 = self.name;
                        var $4046 = Kind$Term$lam$($4045, (_x$11 => {
                            var $4047 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $4043, _args$5);
                            return $4047;
                        }));
                        var $4044 = $4046;
                        break;
                };
                var $4041 = $4044;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $4049 = self.head;
                        var $4050 = self.tail;
                        var self = $4049;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $4052 = self.name;
                                var $4053 = Kind$Term$lam$($4052, (_x$11 => {
                                    var $4054 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $4050);
                                    return $4054;
                                }));
                                var $4051 = $4053;
                                break;
                        };
                        var $4048 = $4051;
                        break;
                    case 'List.nil':
                        var $4055 = Kind$Term$lam$(Kind$Name$read$("P"), (_x$6 => {
                            var $4056 = Kind$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $4056;
                        }));
                        var $4048 = $4055;
                        break;
                };
                var $4041 = $4048;
                break;
        };
        return $4041;
    };
    const Kind$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4058 = self.name;
                var $4059 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4061 = self.args;
                        var $4062 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, $4058, $4059, $4061);
                        var $4060 = $4062;
                        break;
                };
                var $4057 = $4060;
                break;
        };
        return $4057;
    };
    const Kind$Constructor$build_term = x0 => x1 => Kind$Constructor$build_term$(x0, x1);

    function Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $4064 = self.head;
                var $4065 = self.tail;
                var self = $4064;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $4067 = self.eras;
                        var $4068 = self.name;
                        var $4069 = self.term;
                        var $4070 = Kind$Term$all$($4067, "", $4068, $4069, (_s$11 => _x$12 => {
                            var $4071 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $4065, _args$5);
                            return $4071;
                        }));
                        var $4066 = $4070;
                        break;
                };
                var $4063 = $4066;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $4073 = self.head;
                        var $4074 = self.tail;
                        var self = $4073;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $4076 = self.eras;
                                var $4077 = self.name;
                                var $4078 = self.term;
                                var $4079 = Kind$Term$all$($4076, "", $4077, $4078, (_s$11 => _x$12 => {
                                    var $4080 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $4074);
                                    return $4080;
                                }));
                                var $4075 = $4079;
                                break;
                        };
                        var $4072 = $4075;
                        break;
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Kind.Datatype.new':
                                var $4082 = self.pars;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Kind.Constructor.new':
                                        var $4084 = self.inds;
                                        var _type$13 = Kind$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $4087 = _type$13;
                                            var $4088 = $4082;
                                            let _type$15 = $4087;
                                            let _var$14;
                                            while ($4088._ === 'List.cons') {
                                                _var$14 = $4088.head;
                                                var $4087 = Kind$Term$app$(_type$15, Kind$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4089 = self.name;
                                                            var $4090 = $4089;
                                                            return $4090;
                                                    };
                                                })()));
                                                _type$15 = $4087;
                                                $4088 = $4088.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $4092 = _type$14;
                                            var $4093 = $4084;
                                            let _type$16 = $4092;
                                            let _var$15;
                                            while ($4093._ === 'List.cons') {
                                                _var$15 = $4093.head;
                                                var $4092 = Kind$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4094 = self.term;
                                                            var $4095 = $4094;
                                                            return $4095;
                                                    };
                                                })());
                                                _type$16 = $4092;
                                                $4093 = $4093.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $4085 = _type$15;
                                        var $4083 = $4085;
                                        break;
                                };
                                var $4081 = $4083;
                                break;
                        };
                        var $4072 = $4081;
                        break;
                };
                var $4063 = $4072;
                break;
        };
        return $4063;
    };
    const Kind$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4097 = self.name;
                var $4098 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4100 = self.args;
                        var $4101 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, $4097, $4098, $4100);
                        var $4099 = $4101;
                        break;
                };
                var $4096 = $4099;
                break;
        };
        return $4096;
    };
    const Kind$Constructor$build_type = x0 => x1 => Kind$Constructor$build_type$(x0, x1);

    function Kind$Parser$file$adt$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4103 = self.idx;
                var $4104 = self.code;
                var $4105 = self.err;
                var $4106 = Parser$Reply$error$($4103, $4104, $4105);
                var $4102 = $4106;
                break;
            case 'Parser.Reply.value':
                var $4107 = self.idx;
                var $4108 = self.code;
                var $4109 = self.val;
                var self = Kind$Parser$datatype$($4107, $4108);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4111 = self.idx;
                        var $4112 = self.code;
                        var $4113 = self.err;
                        var $4114 = Parser$Reply$error$($4111, $4112, $4113);
                        var $4110 = $4114;
                        break;
                    case 'Parser.Reply.value':
                        var $4115 = self.idx;
                        var $4116 = self.code;
                        var $4117 = self.val;
                        var self = Kind$Parser$stop$($4109, $4115, $4116);
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
                                var self = $4117;
                                switch (self._) {
                                    case 'Kind.Datatype.new':
                                        var $4127 = self.name;
                                        var $4128 = self.pars;
                                        var $4129 = self.inds;
                                        var $4130 = self.ctrs;
                                        var _term$19 = Kind$Datatype$build_term$($4117);
                                        var _term$20 = Kind$Term$bind$(List$nil, (_x$20 => {
                                            var $4132 = (_x$20 + '1');
                                            return $4132;
                                        }), _term$19);
                                        var _type$21 = Kind$Datatype$build_type$($4117);
                                        var _type$22 = Kind$Term$bind$(List$nil, (_x$22 => {
                                            var $4133 = (_x$22 + '0');
                                            return $4133;
                                        }), _type$21);
                                        var _arit$23 = ((list_length($4128)) + (list_length($4129)));
                                        var _defs$24 = Kind$define$(_file$1, _code$2, $4125, $4127, _term$20, _type$22, Bool$false, _arit$23, Bool$false, _defs$3);
                                        var _defs$25 = List$fold$($4130, _defs$24, (_ctr$25 => _defs$26 => {
                                            var _typ_name$27 = $4127;
                                            var _ctr_arit$28 = (_arit$23 + (list_length((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4135 = self.args;
                                                        var $4136 = $4135;
                                                        return $4136;
                                                };
                                            })())));
                                            var _ctr_name$29 = String$flatten$(List$cons$(_typ_name$27, List$cons$(Kind$Name$read$("."), List$cons$((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4137 = self.name;
                                                        var $4138 = $4137;
                                                        return $4138;
                                                };
                                            })(), List$nil))));
                                            var _ctr_term$30 = Kind$Constructor$build_term$($4117, _ctr$25);
                                            var _ctr_term$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                var $4139 = (_x$31 + '1');
                                                return $4139;
                                            }), _ctr_term$30);
                                            var _ctr_type$32 = Kind$Constructor$build_type$($4117, _ctr$25);
                                            var _ctr_type$33 = Kind$Term$bind$(List$nil, (_x$33 => {
                                                var $4140 = (_x$33 + '0');
                                                return $4140;
                                            }), _ctr_type$32);
                                            var $4134 = Kind$define$(_file$1, _code$2, $4125, _ctr_name$29, _ctr_term$31, _ctr_type$33, Bool$true, _ctr_arit$28, Bool$false, _defs$26);
                                            return $4134;
                                        }));
                                        var $4131 = (_idx$26 => _code$27 => {
                                            var $4141 = Parser$Reply$value$(_idx$26, _code$27, _defs$25);
                                            return $4141;
                                        });
                                        var $4126 = $4131;
                                        break;
                                };
                                var $4126 = $4126($4123)($4124);
                                var $4118 = $4126;
                                break;
                        };
                        var $4110 = $4118;
                        break;
                };
                var $4102 = $4110;
                break;
        };
        return $4102;
    };
    const Kind$Parser$file$adt = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$adt$(x0, x1, x2, x3, x4);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $4143 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $4142 = $4143;
        } else {
            var $4144 = self.charCodeAt(0);
            var $4145 = self.slice(1);
            var $4146 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $4142 = $4146;
        };
        return $4142;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Kind$Parser$file$end$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$spaces(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4148 = self.idx;
                var $4149 = self.code;
                var $4150 = self.err;
                var $4151 = Parser$Reply$error$($4148, $4149, $4150);
                var $4147 = $4151;
                break;
            case 'Parser.Reply.value':
                var $4152 = self.idx;
                var $4153 = self.code;
                var self = Parser$eof$($4152, $4153);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4155 = self.idx;
                        var $4156 = self.code;
                        var $4157 = self.err;
                        var $4158 = Parser$Reply$error$($4155, $4156, $4157);
                        var $4154 = $4158;
                        break;
                    case 'Parser.Reply.value':
                        var $4159 = self.idx;
                        var $4160 = self.code;
                        var $4161 = Parser$Reply$value$($4159, $4160, _defs$3);
                        var $4154 = $4161;
                        break;
                };
                var $4147 = $4154;
                break;
        };
        return $4147;
    };
    const Kind$Parser$file$end = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$end$(x0, x1, x2, x3, x4);

    function Kind$Parser$file$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Parser$is_eof$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4163 = self.idx;
                var $4164 = self.code;
                var $4165 = self.err;
                var $4166 = Parser$Reply$error$($4163, $4164, $4165);
                var $4162 = $4166;
                break;
            case 'Parser.Reply.value':
                var $4167 = self.idx;
                var $4168 = self.code;
                var $4169 = self.val;
                var self = $4169;
                if (self) {
                    var $4171 = (_idx$9 => _code$10 => {
                        var $4172 = Parser$Reply$value$(_idx$9, _code$10, _defs$3);
                        return $4172;
                    });
                    var $4170 = $4171;
                } else {
                    var $4173 = (_idx$9 => _code$10 => {
                        var self = Parser$first_of$(List$cons$(Kind$Parser$file$def(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$adt(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$end(_file$1)(_code$2)(_defs$3), List$nil))))(_idx$9)(_code$10);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $4175 = self.idx;
                                var $4176 = self.code;
                                var $4177 = self.err;
                                var $4178 = Parser$Reply$error$($4175, $4176, $4177);
                                var $4174 = $4178;
                                break;
                            case 'Parser.Reply.value':
                                var $4179 = self.idx;
                                var $4180 = self.code;
                                var $4181 = self.val;
                                var $4182 = Kind$Parser$file$(_file$1, _code$2, $4181, $4179, $4180);
                                var $4174 = $4182;
                                break;
                        };
                        return $4174;
                    });
                    var $4170 = $4173;
                };
                var $4170 = $4170($4167)($4168);
                var $4162 = $4170;
                break;
        };
        return $4162;
    };
    const Kind$Parser$file = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$(x0, x1, x2, x3, x4);

    function Either$(_A$1, _B$2) {
        var $4183 = null;
        return $4183;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $4185 = self.head;
                var $4186 = self.tail;
                var $4187 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $4188 = "";
                        return $4188;
                    } else {
                        var $4189 = _sep$1;
                        return $4189;
                    };
                })(), List$cons$($4185, List$cons$(String$join$go$(_sep$1, $4186, Bool$false), List$nil))));
                var $4184 = $4187;
                break;
            case 'List.nil':
                var $4190 = "";
                var $4184 = $4190;
                break;
        };
        return $4184;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $4191 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $4191;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$highlight$end$(_col$1, _row$2, _res$3) {
        var $4192 = String$join$("\u{a}", _res$3);
        return $4192;
    };
    const Kind$highlight$end = x0 => x1 => x2 => Kind$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4194 = self.value;
                var $4195 = _f$5($4194);
                var $4193 = $4195;
                break;
            case 'Maybe.none':
                var $4196 = _a$4;
                var $4193 = $4196;
                break;
        };
        return $4193;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4198 = Bool$true;
            var $4197 = $4198;
        } else {
            var $4199 = (self - 1n);
            var $4200 = Bool$false;
            var $4197 = $4200;
        };
        return $4197;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4202 = Nat$zero;
            var $4201 = $4202;
        } else {
            var $4203 = (self - 1n);
            var $4204 = Nat$succ$(Nat$succ$(Nat$double$($4203)));
            var $4201 = $4204;
        };
        return $4201;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4206 = Nat$zero;
            var $4205 = $4206;
        } else {
            var $4207 = (self - 1n);
            var $4208 = $4207;
            var $4205 = $4208;
        };
        return $4205;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $4210 = _str$3;
            var $4209 = $4210;
        } else {
            var $4211 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $4213 = String$cons$(_chr$2, String$pad_right$($4211, _chr$2, ""));
                var $4212 = $4213;
            } else {
                var $4214 = self.charCodeAt(0);
                var $4215 = self.slice(1);
                var $4216 = String$cons$($4214, String$pad_right$($4211, _chr$2, $4215));
                var $4212 = $4216;
            };
            var $4209 = $4212;
        };
        return $4209;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $4217 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $4217;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $4218 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $4218;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $4219 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $4219;
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
                    var $4220 = Either$left$(_n$1);
                    return $4220;
                } else {
                    var $4221 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4223 = Either$right$(Nat$succ$($4221));
                        var $4222 = $4223;
                    } else {
                        var $4224 = (self - 1n);
                        var $4225 = Nat$sub_rem$($4224, $4221);
                        var $4222 = $4225;
                    };
                    return $4222;
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
                        var $4226 = self.value;
                        var $4227 = Nat$div_mod$go$($4226, _m$2, Nat$succ$(_d$3));
                        return $4227;
                    case 'Either.right':
                        var $4228 = Pair$new$(_d$3, _n$1);
                        return $4228;
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
                        var $4229 = self.fst;
                        var $4230 = self.snd;
                        var self = $4229;
                        if (self === 0n) {
                            var $4232 = List$cons$($4230, _res$3);
                            var $4231 = $4232;
                        } else {
                            var $4233 = (self - 1n);
                            var $4234 = Nat$to_base$go$(_base$1, $4229, List$cons$($4230, _res$3));
                            var $4231 = $4234;
                        };
                        return $4231;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $4235 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $4235;
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
                    var $4236 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $4236;
                } else {
                    var $4237 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4239 = _r$3;
                        var $4238 = $4239;
                    } else {
                        var $4240 = (self - 1n);
                        var $4241 = Nat$mod$go$($4240, $4237, Nat$succ$(_r$3));
                        var $4238 = $4241;
                    };
                    return $4238;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $4242 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $4242;
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
                    var $4245 = self.value;
                    var $4246 = $4245;
                    var $4244 = $4246;
                    break;
                case 'Maybe.none':
                    var $4247 = 35;
                    var $4244 = $4247;
                    break;
            };
            var $4243 = $4244;
        } else {
            var $4248 = 35;
            var $4243 = $4248;
        };
        return $4243;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $4249 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $4250 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $4250;
        }));
        return $4249;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $4251 = Nat$to_string_base$(10n, _n$1);
        return $4251;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Kind$color$(_col$1, _str$2) {
        var $4252 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $4252;
    };
    const Kind$color = x0 => x1 => Kind$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $4254 = self.head;
                var $4255 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $4257 = List$nil;
                    var $4256 = $4257;
                } else {
                    var $4258 = (self - 1n);
                    var $4259 = List$cons$($4254, List$take$($4258, $4255));
                    var $4256 = $4259;
                };
                var $4253 = $4256;
                break;
            case 'List.nil':
                var $4260 = List$nil;
                var $4253 = $4260;
                break;
        };
        return $4253;
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
                    var $4262 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    var $4261 = $4262;
                } else {
                    var $4263 = self.charCodeAt(0);
                    var $4264 = self.slice(1);
                    var self = ($4263 === 10);
                    if (self) {
                        var _stp$12 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$12;
                        if (self) {
                            var $4267 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $4266 = $4267;
                        } else {
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$9));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4270 = self.value;
                                        var $4271 = Maybe$some$(Nat$pred$($4270));
                                        var $4269 = $4271;
                                        break;
                                    case 'Maybe.none':
                                        var $4272 = Maybe$some$(_spa$9);
                                        var $4269 = $4272;
                                        break;
                                };
                                var _lft$14 = $4269;
                            } else {
                                var $4273 = (self - 1n);
                                var $4274 = _lft$6;
                                var _lft$14 = $4274;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$cons$(String$reverse$(_lin$7), _res$8);
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $4268 = Kind$highlight$tc$($4264, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $4266 = $4268;
                        };
                        var $4265 = $4266;
                    } else {
                        var _chr$12 = String$cons$($4263, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $4276 = String$reverse$(Kind$color$("31", Kind$color$("4", _chr$12)));
                            var _chr$13 = $4276;
                        } else {
                            var $4277 = _chr$12;
                            var _chr$13 = $4277;
                        };
                        var self = (_ix0$2 === 1n);
                        if (self) {
                            var $4278 = List$take$(_spa$9, _res$8);
                            var _res$14 = $4278;
                        } else {
                            var $4279 = _res$8;
                            var _res$14 = $4279;
                        };
                        var _ix0$15 = Nat$pred$(_ix0$2);
                        var _ix1$16 = Nat$pred$(_ix1$3);
                        var _col$17 = Nat$succ$(_col$4);
                        var _lin$18 = String$flatten$(List$cons$(_chr$13, List$cons$(_lin$7, List$nil)));
                        var $4275 = Kind$highlight$tc$($4264, _ix0$15, _ix1$16, _col$17, _row$5, _lft$6, _lin$18, _res$14);
                        var $4265 = $4275;
                    };
                    var $4261 = $4265;
                };
                return $4261;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $4280 = Kind$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $4280;
    };
    const Kind$highlight = x0 => x1 => x2 => Kind$highlight$(x0, x1, x2);

    function Kind$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Kind$Parser$file$(_file$1, _code$2, _defs$3, 0n, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4282 = self.idx;
                var $4283 = self.err;
                var _err$7 = $4283;
                var _hig$8 = Kind$highlight$(_code$2, $4282, Nat$succ$($4282));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $4284 = Either$left$(_str$9);
                var $4281 = $4284;
                break;
            case 'Parser.Reply.value':
                var $4285 = self.val;
                var $4286 = Either$right$($4285);
                var $4281 = $4286;
                break;
        };
        return $4281;
    };
    const Kind$Defs$read = x0 => x1 => x2 => Kind$Defs$read$(x0, x1, x2);

    function Kind$Synth$load$go$(_name$1, _files$2, _defs$3) {
        var self = _files$2;
        switch (self._) {
            case 'List.cons':
                var $4288 = self.head;
                var $4289 = self.tail;
                var $4290 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $4291 = _m$bind$6;
                    return $4291;
                }))(IO$get_file$($4288))((_code$6 => {
                    var _read$7 = Kind$Defs$read$($4288, _code$6, _defs$3);
                    var self = _read$7;
                    switch (self._) {
                        case 'Either.right':
                            var $4293 = self.value;
                            var _defs$9 = $4293;
                            var self = Kind$get$(_name$1, _defs$9);
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4295 = Kind$Synth$load$go$(_name$1, $4289, _defs$9);
                                    var $4294 = $4295;
                                    break;
                                case 'Maybe.some':
                                    var $4296 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                        var $4297 = _m$pure$12;
                                        return $4297;
                                    }))(Maybe$some$(_defs$9));
                                    var $4294 = $4296;
                                    break;
                            };
                            var $4292 = $4294;
                            break;
                        case 'Either.left':
                            var $4298 = Kind$Synth$load$go$(_name$1, $4289, _defs$3);
                            var $4292 = $4298;
                            break;
                    };
                    return $4292;
                }));
                var $4287 = $4290;
                break;
            case 'List.nil':
                var $4299 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4300 = _m$pure$5;
                    return $4300;
                }))(Maybe$none);
                var $4287 = $4299;
                break;
        };
        return $4287;
    };
    const Kind$Synth$load$go = x0 => x1 => x2 => Kind$Synth$load$go$(x0, x1, x2);

    function Kind$Synth$files_of$make$(_names$1, _last$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $4302 = self.head;
                var $4303 = self.tail;
                var _head$5 = (_last$2 + ($4302 + ".kind"));
                var _tail$6 = Kind$Synth$files_of$make$($4303, (_last$2 + ($4302 + "/")));
                var $4304 = List$cons$(_head$5, _tail$6);
                var $4301 = $4304;
                break;
            case 'List.nil':
                var $4305 = List$nil;
                var $4301 = $4305;
                break;
        };
        return $4301;
    };
    const Kind$Synth$files_of$make = x0 => x1 => Kind$Synth$files_of$make$(x0, x1);

    function Char$eql$(_a$1, _b$2) {
        var $4306 = (_a$1 === _b$2);
        return $4306;
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
                    var $4307 = Bool$true;
                    return $4307;
                } else {
                    var $4308 = self.charCodeAt(0);
                    var $4309 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $4311 = Bool$false;
                        var $4310 = $4311;
                    } else {
                        var $4312 = self.charCodeAt(0);
                        var $4313 = self.slice(1);
                        var self = Char$eql$($4308, $4312);
                        if (self) {
                            var $4315 = String$starts_with$($4313, $4309);
                            var $4314 = $4315;
                        } else {
                            var $4316 = Bool$false;
                            var $4314 = $4316;
                        };
                        var $4310 = $4314;
                    };
                    return $4310;
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
                    var $4317 = _xs$2;
                    return $4317;
                } else {
                    var $4318 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $4320 = String$nil;
                        var $4319 = $4320;
                    } else {
                        var $4321 = self.charCodeAt(0);
                        var $4322 = self.slice(1);
                        var $4323 = String$drop$($4318, $4322);
                        var $4319 = $4323;
                    };
                    return $4319;
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
                    var $4324 = _n$2;
                    return $4324;
                } else {
                    var $4325 = self.charCodeAt(0);
                    var $4326 = self.slice(1);
                    var $4327 = String$length$go$($4326, Nat$succ$(_n$2));
                    return $4327;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $4328 = String$length$go$(_xs$1, 0n);
        return $4328;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $4330 = List$cons$(_last$3, List$nil);
            var $4329 = $4330;
        } else {
            var $4331 = self.charCodeAt(0);
            var $4332 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $4334 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $4333 = $4334;
            } else {
                var _next$6 = String$cons$($4331, String$nil);
                var $4335 = String$split$go$($4332, _match$2, (_last$3 + _next$6));
                var $4333 = $4335;
            };
            var $4329 = $4333;
        };
        return $4329;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $4336 = String$split$go$(_xs$1, _match$2, "");
        return $4336;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Kind$Synth$files_of$(_name$1) {
        var $4337 = List$reverse$(Kind$Synth$files_of$make$(String$split$(_name$1, "."), ""));
        return $4337;
    };
    const Kind$Synth$files_of = x0 => Kind$Synth$files_of$(x0);

    function Kind$Synth$load$(_name$1, _defs$2) {
        var $4338 = Kind$Synth$load$go$(_name$1, Kind$Synth$files_of$(_name$1), _defs$2);
        return $4338;
    };
    const Kind$Synth$load = x0 => x1 => Kind$Synth$load$(x0, x1);
    const Kind$Status$wait = ({
        _: 'Kind.Status.wait'
    });

    function Kind$Check$(_V$1) {
        var $4339 = null;
        return $4339;
    };
    const Kind$Check = x0 => Kind$Check$(x0);

    function Kind$Check$result$(_value$2, _errors$3) {
        var $4340 = ({
            _: 'Kind.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $4340;
    };
    const Kind$Check$result = x0 => x1 => Kind$Check$result$(x0, x1);

    function Kind$Error$undefined_reference$(_origin$1, _name$2) {
        var $4341 = ({
            _: 'Kind.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $4341;
    };
    const Kind$Error$undefined_reference = x0 => x1 => Kind$Error$undefined_reference$(x0, x1);

    function Kind$Error$waiting$(_name$1) {
        var $4342 = ({
            _: 'Kind.Error.waiting',
            'name': _name$1
        });
        return $4342;
    };
    const Kind$Error$waiting = x0 => Kind$Error$waiting$(x0);

    function Kind$Error$indirect$(_name$1) {
        var $4343 = ({
            _: 'Kind.Error.indirect',
            'name': _name$1
        });
        return $4343;
    };
    const Kind$Error$indirect = x0 => Kind$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4345 = self.value;
                var $4346 = Maybe$some$(_f$4($4345));
                var $4344 = $4346;
                break;
            case 'Maybe.none':
                var $4347 = Maybe$none;
                var $4344 = $4347;
                break;
        };
        return $4344;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Kind$MPath$o$(_path$1) {
        var $4348 = Maybe$mapped$(_path$1, Kind$Path$o);
        return $4348;
    };
    const Kind$MPath$o = x0 => Kind$MPath$o$(x0);

    function Kind$MPath$i$(_path$1) {
        var $4349 = Maybe$mapped$(_path$1, Kind$Path$i);
        return $4349;
    };
    const Kind$MPath$i = x0 => Kind$MPath$i$(x0);

    function Kind$Error$patch$(_path$1, _term$2) {
        var $4350 = ({
            _: 'Kind.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $4350;
    };
    const Kind$Error$patch = x0 => x1 => Kind$Error$patch$(x0, x1);

    function Kind$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.some':
                var $4352 = self.value;
                var $4353 = $4352(Bits$e);
                var $4351 = $4353;
                break;
            case 'Maybe.none':
                var $4354 = Bits$e;
                var $4351 = $4354;
                break;
        };
        return $4351;
    };
    const Kind$MPath$to_bits = x0 => Kind$MPath$to_bits$(x0);

    function Kind$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $4355 = ({
            _: 'Kind.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $4355;
    };
    const Kind$Error$type_mismatch = x0 => x1 => x2 => x3 => Kind$Error$type_mismatch$(x0, x1, x2, x3);

    function Kind$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $4356 = ({
            _: 'Kind.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $4356;
    };
    const Kind$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Kind$Error$show_goal$(x0, x1, x2, x3, x4);

    function Kind$Term$normalize$(_term$1, _defs$2) {
        var self = Kind$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $4358 = self.name;
                var $4359 = self.indx;
                var $4360 = Kind$Term$var$($4358, $4359);
                var $4357 = $4360;
                break;
            case 'Kind.Term.ref':
                var $4361 = self.name;
                var $4362 = Kind$Term$ref$($4361);
                var $4357 = $4362;
                break;
            case 'Kind.Term.all':
                var $4363 = self.eras;
                var $4364 = self.self;
                var $4365 = self.name;
                var $4366 = self.xtyp;
                var $4367 = self.body;
                var $4368 = Kind$Term$all$($4363, $4364, $4365, Kind$Term$normalize$($4366, _defs$2), (_s$8 => _x$9 => {
                    var $4369 = Kind$Term$normalize$($4367(_s$8)(_x$9), _defs$2);
                    return $4369;
                }));
                var $4357 = $4368;
                break;
            case 'Kind.Term.lam':
                var $4370 = self.name;
                var $4371 = self.body;
                var $4372 = Kind$Term$lam$($4370, (_x$5 => {
                    var $4373 = Kind$Term$normalize$($4371(_x$5), _defs$2);
                    return $4373;
                }));
                var $4357 = $4372;
                break;
            case 'Kind.Term.app':
                var $4374 = self.func;
                var $4375 = self.argm;
                var $4376 = Kind$Term$app$(Kind$Term$normalize$($4374, _defs$2), Kind$Term$normalize$($4375, _defs$2));
                var $4357 = $4376;
                break;
            case 'Kind.Term.let':
                var $4377 = self.name;
                var $4378 = self.expr;
                var $4379 = self.body;
                var $4380 = Kind$Term$let$($4377, Kind$Term$normalize$($4378, _defs$2), (_x$6 => {
                    var $4381 = Kind$Term$normalize$($4379(_x$6), _defs$2);
                    return $4381;
                }));
                var $4357 = $4380;
                break;
            case 'Kind.Term.def':
                var $4382 = self.name;
                var $4383 = self.expr;
                var $4384 = self.body;
                var $4385 = Kind$Term$def$($4382, Kind$Term$normalize$($4383, _defs$2), (_x$6 => {
                    var $4386 = Kind$Term$normalize$($4384(_x$6), _defs$2);
                    return $4386;
                }));
                var $4357 = $4385;
                break;
            case 'Kind.Term.ann':
                var $4387 = self.done;
                var $4388 = self.term;
                var $4389 = self.type;
                var $4390 = Kind$Term$ann$($4387, Kind$Term$normalize$($4388, _defs$2), Kind$Term$normalize$($4389, _defs$2));
                var $4357 = $4390;
                break;
            case 'Kind.Term.gol':
                var $4391 = self.name;
                var $4392 = self.dref;
                var $4393 = self.verb;
                var $4394 = Kind$Term$gol$($4391, $4392, $4393);
                var $4357 = $4394;
                break;
            case 'Kind.Term.hol':
                var $4395 = self.path;
                var $4396 = Kind$Term$hol$($4395);
                var $4357 = $4396;
                break;
            case 'Kind.Term.nat':
                var $4397 = self.natx;
                var $4398 = Kind$Term$nat$($4397);
                var $4357 = $4398;
                break;
            case 'Kind.Term.chr':
                var $4399 = self.chrx;
                var $4400 = Kind$Term$chr$($4399);
                var $4357 = $4400;
                break;
            case 'Kind.Term.str':
                var $4401 = self.strx;
                var $4402 = Kind$Term$str$($4401);
                var $4357 = $4402;
                break;
            case 'Kind.Term.ori':
                var $4403 = self.expr;
                var $4404 = Kind$Term$normalize$($4403, _defs$2);
                var $4357 = $4404;
                break;
            case 'Kind.Term.typ':
                var $4405 = Kind$Term$typ;
                var $4357 = $4405;
                break;
            case 'Kind.Term.cse':
                var $4406 = _term$1;
                var $4357 = $4406;
                break;
        };
        return $4357;
    };
    const Kind$Term$normalize = x0 => x1 => Kind$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $4408 = self.tail;
                var $4409 = $4408;
                var $4407 = $4409;
                break;
            case 'List.nil':
                var $4410 = List$nil;
                var $4407 = $4410;
                break;
        };
        return $4407;
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
                        var $4411 = self.func;
                        var $4412 = self.argm;
                        var $4413 = Kind$SmartMotive$vals$cont$(_expr$1, $4411, List$cons$($4412, _args$3), _defs$4);
                        return $4413;
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
                        var $4414 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $4414;
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
                        var $4415 = self.body;
                        var $4416 = Kind$SmartMotive$vals$(_expr$1, $4415(Kind$Term$typ)(Kind$Term$typ), _defs$3);
                        return $4416;
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
                        var $4417 = Kind$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $4417;
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
                        var $4418 = self.self;
                        var $4419 = self.name;
                        var $4420 = self.body;
                        var $4421 = Kind$SmartMotive$nams$cont$(_name$1, $4420(Kind$Term$ref$($4418))(Kind$Term$ref$($4419)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4419, List$nil)))), _binds$3), _defs$4);
                        return $4421;
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
                        var $4422 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $4422;
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
                var $4424 = self.xtyp;
                var $4425 = Kind$SmartMotive$nams$cont$(_name$1, $4424, List$nil, _defs$3);
                var $4423 = $4425;
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
                var $4426 = List$nil;
                var $4423 = $4426;
                break;
        };
        return $4423;
    };
    const Kind$SmartMotive$nams = x0 => x1 => x2 => Kind$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $4428 = self.head;
                var $4429 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $4431 = self.head;
                        var $4432 = self.tail;
                        var $4433 = List$cons$(Pair$new$($4428, $4431), List$zip$($4429, $4432));
                        var $4430 = $4433;
                        break;
                    case 'List.nil':
                        var $4434 = List$nil;
                        var $4430 = $4434;
                        break;
                };
                var $4427 = $4430;
                break;
            case 'List.nil':
                var $4435 = List$nil;
                var $4427 = $4435;
                break;
        };
        return $4427;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Kind$Term$serialize$name$(_name$1) {
        var $4436 = (kind_name_to_bits(_name$1));
        return $4436;
    };
    const Kind$Term$serialize$name = x0 => Kind$Term$serialize$name$(x0);

    function Kind$Term$serialize$(_term$1, _depth$2, _init$3, _diff$4, _x$5) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4438 = self.indx;
                var self = ($4438 >= _init$3);
                if (self) {
                    var _name$8 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $4438 <= 0n ? 0n : _depth$2 - $4438)))));
                    var $4440 = (((_name$8(_x$5) + '1') + '0') + '0');
                    var $4439 = $4440;
                } else {
                    var _name$8 = a1 => (a1 + (nat_to_bits($4438)));
                    var $4441 = (((_name$8(_x$5) + '0') + '1') + '0');
                    var $4439 = $4441;
                };
                var $4437 = $4439;
                break;
            case 'Kind.Term.ref':
                var $4442 = self.name;
                var _name$7 = a1 => (a1 + Kind$Term$serialize$name$($4442));
                var $4443 = (((_name$7(_x$5) + '0') + '0') + '0');
                var $4437 = $4443;
                break;
            case 'Kind.Term.all':
                var $4444 = self.eras;
                var $4445 = self.self;
                var $4446 = self.name;
                var $4447 = self.xtyp;
                var $4448 = self.body;
                var self = $4444;
                if (self) {
                    var $4450 = Bits$i;
                    var _eras$11 = $4450;
                } else {
                    var $4451 = Bits$o;
                    var _eras$11 = $4451;
                };
                var _self$12 = a1 => (a1 + (kind_name_to_bits($4445)));
                var _xtyp$13 = Kind$Term$serialize($4447)(_depth$2)(_init$3)(_diff$4);
                var _body$14 = Kind$Term$serialize($4448(Kind$Term$var$($4445, _depth$2))(Kind$Term$var$($4446, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3)(_diff$4);
                var $4449 = (((_eras$11(_self$12(_xtyp$13(_body$14(_x$5)))) + '0') + '0') + '1');
                var $4437 = $4449;
                break;
            case 'Kind.Term.lam':
                var $4452 = self.name;
                var $4453 = self.body;
                var _body$8 = Kind$Term$serialize($4453(Kind$Term$var$($4452, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4454 = (((_body$8(_x$5) + '1') + '0') + '1');
                var $4437 = $4454;
                break;
            case 'Kind.Term.app':
                var $4455 = self.func;
                var $4456 = self.argm;
                var _func$8 = Kind$Term$serialize($4455)(_depth$2)(_init$3)(_diff$4);
                var _argm$9 = Kind$Term$serialize($4456)(_depth$2)(_init$3)(_diff$4);
                var $4457 = (((_func$8(_argm$9(_x$5)) + '0') + '1') + '1');
                var $4437 = $4457;
                break;
            case 'Kind.Term.let':
                var $4458 = self.name;
                var $4459 = self.expr;
                var $4460 = self.body;
                var _expr$9 = Kind$Term$serialize($4459)(_depth$2)(_init$3)(_diff$4);
                var _body$10 = Kind$Term$serialize($4460(Kind$Term$var$($4458, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4461 = (((_expr$9(_body$10(_x$5)) + '1') + '1') + '1');
                var $4437 = $4461;
                break;
            case 'Kind.Term.def':
                var $4462 = self.expr;
                var $4463 = self.body;
                var $4464 = Kind$Term$serialize$($4463($4462), _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4464;
                break;
            case 'Kind.Term.ann':
                var $4465 = self.term;
                var $4466 = Kind$Term$serialize$($4465, _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4466;
                break;
            case 'Kind.Term.gol':
                var $4467 = self.name;
                var _name$9 = a1 => (a1 + (kind_name_to_bits($4467)));
                var $4468 = (((_name$9(_x$5) + '0') + '0') + '0');
                var $4437 = $4468;
                break;
            case 'Kind.Term.nat':
                var $4469 = self.natx;
                var $4470 = Kind$Term$serialize$(Kind$Term$unroll_nat$($4469), _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4470;
                break;
            case 'Kind.Term.chr':
                var $4471 = self.chrx;
                var $4472 = Kind$Term$serialize$(Kind$Term$unroll_chr$($4471), _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4472;
                break;
            case 'Kind.Term.str':
                var $4473 = self.strx;
                var $4474 = Kind$Term$serialize$(Kind$Term$unroll_str$($4473), _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4474;
                break;
            case 'Kind.Term.ori':
                var $4475 = self.expr;
                var $4476 = Kind$Term$serialize$($4475, _depth$2, _init$3, _diff$4, _x$5);
                var $4437 = $4476;
                break;
            case 'Kind.Term.typ':
                var $4477 = (((_x$5 + '1') + '1') + '0');
                var $4437 = $4477;
                break;
            case 'Kind.Term.hol':
                var $4478 = _x$5;
                var $4437 = $4478;
                break;
            case 'Kind.Term.cse':
                var $4479 = _diff$4(_x$5);
                var $4437 = $4479;
                break;
        };
        return $4437;
    };
    const Kind$Term$serialize = x0 => x1 => x2 => x3 => x4 => Kind$Term$serialize$(x0, x1, x2, x3, x4);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kind$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Kind$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$o, Bits$e);
        var _bh$5 = Kind$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$i, Bits$e);
        var $4480 = (_bh$5 === _ah$4);
        return $4480;
    };
    const Kind$Term$identical = x0 => x1 => x2 => Kind$Term$identical$(x0, x1, x2);

    function Kind$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Kind$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $4482 = _to$3;
            var $4481 = $4482;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Kind.Term.var':
                    var $4484 = self.name;
                    var $4485 = self.indx;
                    var $4486 = Kind$Term$var$($4484, $4485);
                    var $4483 = $4486;
                    break;
                case 'Kind.Term.ref':
                    var $4487 = self.name;
                    var $4488 = Kind$Term$ref$($4487);
                    var $4483 = $4488;
                    break;
                case 'Kind.Term.all':
                    var $4489 = self.eras;
                    var $4490 = self.self;
                    var $4491 = self.name;
                    var $4492 = self.xtyp;
                    var $4493 = self.body;
                    var _xtyp$10 = Kind$SmartMotive$replace$($4492, _from$2, _to$3, _lv$4);
                    var _body$11 = $4493(Kind$Term$ref$($4490))(Kind$Term$ref$($4491));
                    var _body$12 = Kind$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $4494 = Kind$Term$all$($4489, $4490, $4491, _xtyp$10, (_s$13 => _x$14 => {
                        var $4495 = _body$12;
                        return $4495;
                    }));
                    var $4483 = $4494;
                    break;
                case 'Kind.Term.lam':
                    var $4496 = self.name;
                    var $4497 = self.body;
                    var _body$7 = $4497(Kind$Term$ref$($4496));
                    var _body$8 = Kind$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4498 = Kind$Term$lam$($4496, (_x$9 => {
                        var $4499 = _body$8;
                        return $4499;
                    }));
                    var $4483 = $4498;
                    break;
                case 'Kind.Term.app':
                    var $4500 = self.func;
                    var $4501 = self.argm;
                    var _func$7 = Kind$SmartMotive$replace$($4500, _from$2, _to$3, _lv$4);
                    var _argm$8 = Kind$SmartMotive$replace$($4501, _from$2, _to$3, _lv$4);
                    var $4502 = Kind$Term$app$(_func$7, _argm$8);
                    var $4483 = $4502;
                    break;
                case 'Kind.Term.let':
                    var $4503 = self.name;
                    var $4504 = self.expr;
                    var $4505 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4504, _from$2, _to$3, _lv$4);
                    var _body$9 = $4505(Kind$Term$ref$($4503));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4506 = Kind$Term$let$($4503, _expr$8, (_x$11 => {
                        var $4507 = _body$10;
                        return $4507;
                    }));
                    var $4483 = $4506;
                    break;
                case 'Kind.Term.def':
                    var $4508 = self.name;
                    var $4509 = self.expr;
                    var $4510 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4509, _from$2, _to$3, _lv$4);
                    var _body$9 = $4510(Kind$Term$ref$($4508));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4511 = Kind$Term$def$($4508, _expr$8, (_x$11 => {
                        var $4512 = _body$10;
                        return $4512;
                    }));
                    var $4483 = $4511;
                    break;
                case 'Kind.Term.ann':
                    var $4513 = self.done;
                    var $4514 = self.term;
                    var $4515 = self.type;
                    var _term$8 = Kind$SmartMotive$replace$($4514, _from$2, _to$3, _lv$4);
                    var _type$9 = Kind$SmartMotive$replace$($4515, _from$2, _to$3, _lv$4);
                    var $4516 = Kind$Term$ann$($4513, _term$8, _type$9);
                    var $4483 = $4516;
                    break;
                case 'Kind.Term.ori':
                    var $4517 = self.expr;
                    var $4518 = Kind$SmartMotive$replace$($4517, _from$2, _to$3, _lv$4);
                    var $4483 = $4518;
                    break;
                case 'Kind.Term.typ':
                    var $4519 = Kind$Term$typ;
                    var $4483 = $4519;
                    break;
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                    var $4520 = _term$1;
                    var $4483 = $4520;
                    break;
            };
            var $4481 = $4483;
        };
        return $4481;
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
                    var $4523 = self.fst;
                    var $4524 = self.snd;
                    var $4525 = Kind$SmartMotive$replace$(_moti$11, $4524, Kind$Term$ref$($4523), _lv$5);
                    var $4522 = $4525;
                    break;
            };
            return $4522;
        }));
        var $4521 = _moti$10;
        return $4521;
    };
    const Kind$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Kind$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Kind$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.cons':
                var $4527 = self.head;
                var $4528 = self.tail;
                var self = $4527;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $4530 = self.name;
                        var $4531 = self.type;
                        var $4532 = Kind$Term$all$(Bool$false, "", $4530, $4531, (_s$14 => _x$15 => {
                            var $4533 = Kind$Term$desugar_cse$motive$($4528, _moti$2);
                            return $4533;
                        }));
                        var $4529 = $4532;
                        break;
                };
                var $4526 = $4529;
                break;
            case 'List.nil':
                var $4534 = _moti$2;
                var $4526 = $4534;
                break;
        };
        return $4526;
    };
    const Kind$Term$desugar_cse$motive = x0 => x1 => Kind$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4536 = Bool$true;
            var $4535 = $4536;
        } else {
            var $4537 = self.charCodeAt(0);
            var $4538 = self.slice(1);
            var $4539 = Bool$false;
            var $4535 = $4539;
        };
        return $4535;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Kind$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Kind.Term.all':
                var $4541 = self.self;
                var $4542 = self.name;
                var $4543 = self.body;
                var $4544 = Kind$Term$lam$((() => {
                    var self = String$is_empty$($4542);
                    if (self) {
                        var $4545 = _name$1;
                        return $4545;
                    } else {
                        var $4546 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4542, List$nil))));
                        return $4546;
                    };
                })(), (_x$11 => {
                    var $4547 = Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, $4543(Kind$Term$var$($4541, 0n))(Kind$Term$var$($4542, 0n)), _body$4, _defs$5);
                    return $4547;
                }));
                var $4540 = $4544;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.ori':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4549 = self.head;
                        var $4550 = self.tail;
                        var self = $4549;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4552 = self.name;
                                var $4553 = Kind$Term$lam$($4552, (_x$19 => {
                                    var $4554 = Kind$Term$desugar_cse$argument$(_name$1, $4550, _type$3, _body$4, _defs$5);
                                    return $4554;
                                }));
                                var $4551 = $4553;
                                break;
                        };
                        var $4548 = $4551;
                        break;
                    case 'List.nil':
                        var $4555 = _body$4;
                        var $4548 = $4555;
                        break;
                };
                var $4540 = $4548;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4557 = self.head;
                        var $4558 = self.tail;
                        var self = $4557;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4560 = self.name;
                                var $4561 = Kind$Term$lam$($4560, (_x$18 => {
                                    var $4562 = Kind$Term$desugar_cse$argument$(_name$1, $4558, _type$3, _body$4, _defs$5);
                                    return $4562;
                                }));
                                var $4559 = $4561;
                                break;
                        };
                        var $4556 = $4559;
                        break;
                    case 'List.nil':
                        var $4563 = _body$4;
                        var $4556 = $4563;
                        break;
                };
                var $4540 = $4556;
                break;
            case 'Kind.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4565 = self.head;
                        var $4566 = self.tail;
                        var self = $4565;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4568 = self.name;
                                var $4569 = Kind$Term$lam$($4568, (_x$17 => {
                                    var $4570 = Kind$Term$desugar_cse$argument$(_name$1, $4566, _type$3, _body$4, _defs$5);
                                    return $4570;
                                }));
                                var $4567 = $4569;
                                break;
                        };
                        var $4564 = $4567;
                        break;
                    case 'List.nil':
                        var $4571 = _body$4;
                        var $4564 = $4571;
                        break;
                };
                var $4540 = $4564;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4573 = self.head;
                        var $4574 = self.tail;
                        var self = $4573;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4576 = self.name;
                                var $4577 = Kind$Term$lam$($4576, (_x$20 => {
                                    var $4578 = Kind$Term$desugar_cse$argument$(_name$1, $4574, _type$3, _body$4, _defs$5);
                                    return $4578;
                                }));
                                var $4575 = $4577;
                                break;
                        };
                        var $4572 = $4575;
                        break;
                    case 'List.nil':
                        var $4579 = _body$4;
                        var $4572 = $4579;
                        break;
                };
                var $4540 = $4572;
                break;
            case 'Kind.Term.cse':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4581 = self.head;
                        var $4582 = self.tail;
                        var self = $4581;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4584 = self.name;
                                var $4585 = Kind$Term$lam$($4584, (_x$23 => {
                                    var $4586 = Kind$Term$desugar_cse$argument$(_name$1, $4582, _type$3, _body$4, _defs$5);
                                    return $4586;
                                }));
                                var $4583 = $4585;
                                break;
                        };
                        var $4580 = $4583;
                        break;
                    case 'List.nil':
                        var $4587 = _body$4;
                        var $4580 = $4587;
                        break;
                };
                var $4540 = $4580;
                break;
        };
        return $4540;
    };
    const Kind$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Kind$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $4589 = self.value;
                var $4590 = Maybe$some$($4589);
                var $4588 = $4590;
                break;
            case 'Maybe.none':
                var $4591 = _b$3;
                var $4588 = $4591;
                break;
        };
        return $4588;
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
                        var $4592 = self.self;
                        var $4593 = self.name;
                        var $4594 = self.xtyp;
                        var $4595 = self.body;
                        var _got$13 = Maybe$or$(Kind$get$($4593, _cses$4), Kind$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4597 = self.value;
                                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, _wyth$3, $4594, $4597, _defs$6);
                                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $4595(Kind$Term$var$($4592, 0n))(Kind$Term$var$($4593, 0n));
                                var $4598 = Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $4596 = $4598;
                                break;
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $4601 = _expr$1;
                                    var $4602 = _wyth$3;
                                    let _expr$15 = $4601;
                                    let _defn$14;
                                    while ($4602._ === 'List.cons') {
                                        _defn$14 = $4602.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Kind.Def.new':
                                                var $4603 = self.term;
                                                var $4604 = Kind$Term$app$(_expr$15, $4603);
                                                var $4601 = $4604;
                                                break;
                                        };
                                        _expr$15 = $4601;
                                        $4602 = $4602.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $4599 = _expr$14;
                                var $4596 = $4599;
                                break;
                        };
                        return $4596;
                    case 'Kind.Term.var':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.ori':
                        var _expr$10 = (() => {
                            var $4607 = _expr$1;
                            var $4608 = _wyth$3;
                            let _expr$11 = $4607;
                            let _defn$10;
                            while ($4608._ === 'List.cons') {
                                _defn$10 = $4608.head;
                                var $4607 = Kind$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4609 = self.term;
                                            var $4610 = $4609;
                                            return $4610;
                                    };
                                })());
                                _expr$11 = $4607;
                                $4608 = $4608.tail;
                            }
                            return _expr$11;
                        })();
                        var $4605 = _expr$10;
                        return $4605;
                    case 'Kind.Term.ref':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                        var _expr$9 = (() => {
                            var $4613 = _expr$1;
                            var $4614 = _wyth$3;
                            let _expr$10 = $4613;
                            let _defn$9;
                            while ($4614._ === 'List.cons') {
                                _defn$9 = $4614.head;
                                var $4613 = Kind$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4615 = self.term;
                                            var $4616 = $4615;
                                            return $4616;
                                    };
                                })());
                                _expr$10 = $4613;
                                $4614 = $4614.tail;
                            }
                            return _expr$10;
                        })();
                        var $4611 = _expr$9;
                        return $4611;
                    case 'Kind.Term.typ':
                        var _expr$8 = (() => {
                            var $4619 = _expr$1;
                            var $4620 = _wyth$3;
                            let _expr$9 = $4619;
                            let _defn$8;
                            while ($4620._ === 'List.cons') {
                                _defn$8 = $4620.head;
                                var $4619 = Kind$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4621 = self.term;
                                            var $4622 = $4621;
                                            return $4622;
                                    };
                                })());
                                _expr$9 = $4619;
                                $4620 = $4620.tail;
                            }
                            return _expr$9;
                        })();
                        var $4617 = _expr$8;
                        return $4617;
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                        var _expr$11 = (() => {
                            var $4625 = _expr$1;
                            var $4626 = _wyth$3;
                            let _expr$12 = $4625;
                            let _defn$11;
                            while ($4626._ === 'List.cons') {
                                _defn$11 = $4626.head;
                                var $4625 = Kind$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4627 = self.term;
                                            var $4628 = $4627;
                                            return $4628;
                                    };
                                })());
                                _expr$12 = $4625;
                                $4626 = $4626.tail;
                            }
                            return _expr$12;
                        })();
                        var $4623 = _expr$11;
                        return $4623;
                    case 'Kind.Term.cse':
                        var _expr$14 = (() => {
                            var $4631 = _expr$1;
                            var $4632 = _wyth$3;
                            let _expr$15 = $4631;
                            let _defn$14;
                            while ($4632._ === 'List.cons') {
                                _defn$14 = $4632.head;
                                var $4631 = Kind$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4633 = self.term;
                                            var $4634 = $4633;
                                            return $4634;
                                    };
                                })());
                                _expr$15 = $4631;
                                $4632 = $4632.tail;
                            }
                            return _expr$15;
                        })();
                        var $4629 = _expr$14;
                        return $4629;
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
                var $4636 = self.self;
                var $4637 = self.name;
                var $4638 = self.xtyp;
                var $4639 = self.body;
                var _moti$14 = Kind$Term$desugar_cse$motive$(_wyth$3, _moti$5);
                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, List$nil, $4638, _moti$14, _defs$7);
                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                var _type$17 = $4639(Kind$Term$var$($4636, 0n))(Kind$Term$var$($4637, 0n));
                var $4640 = Maybe$some$(Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $4635 = $4640;
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
                var $4641 = Maybe$none;
                var $4635 = $4641;
                break;
        };
        return $4635;
    };
    const Kind$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $4642 = ({
            _: 'Kind.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $4642;
    };
    const Kind$Error$cant_infer = x0 => x1 => x2 => Kind$Error$cant_infer$(x0, x1, x2);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $4644 = Bool$false;
                var $4643 = $4644;
                break;
            case 'Maybe.some':
                var $4645 = Bool$true;
                var $4643 = $4645;
                break;
        };
        return $4643;
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
                        var $4646 = self.name;
                        var $4647 = Maybe$some$(Pair$new$($4646, _arity$2));
                        return $4647;
                    case 'Kind.Term.ref':
                        var $4648 = self.name;
                        var $4649 = Maybe$some$(Pair$new$($4648, _arity$2));
                        return $4649;
                    case 'Kind.Term.app':
                        var $4650 = self.func;
                        var $4651 = Kind$Term$equal$extra_holes$funari$($4650, Nat$succ$(_arity$2));
                        return $4651;
                    case 'Kind.Term.ori':
                        var $4652 = self.expr;
                        var $4653 = Kind$Term$equal$extra_holes$funari$($4652, _arity$2);
                        return $4653;
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
                        var $4654 = Maybe$none;
                        return $4654;
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
                var $4656 = self.xtyp;
                var $4657 = self.body;
                var $4658 = (Kind$Term$has_holes$($4656) || Kind$Term$has_holes$($4657(Kind$Term$typ)(Kind$Term$typ)));
                var $4655 = $4658;
                break;
            case 'Kind.Term.lam':
                var $4659 = self.body;
                var $4660 = Kind$Term$has_holes$($4659(Kind$Term$typ));
                var $4655 = $4660;
                break;
            case 'Kind.Term.app':
                var $4661 = self.func;
                var $4662 = self.argm;
                var $4663 = (Kind$Term$has_holes$($4661) || Kind$Term$has_holes$($4662));
                var $4655 = $4663;
                break;
            case 'Kind.Term.let':
                var $4664 = self.expr;
                var $4665 = self.body;
                var $4666 = (Kind$Term$has_holes$($4664) || Kind$Term$has_holes$($4665(Kind$Term$typ)));
                var $4655 = $4666;
                break;
            case 'Kind.Term.def':
                var $4667 = self.expr;
                var $4668 = self.body;
                var $4669 = (Kind$Term$has_holes$($4667) || Kind$Term$has_holes$($4668(Kind$Term$typ)));
                var $4655 = $4669;
                break;
            case 'Kind.Term.ann':
                var $4670 = self.term;
                var $4671 = self.type;
                var $4672 = (Kind$Term$has_holes$($4670) || Kind$Term$has_holes$($4671));
                var $4655 = $4672;
                break;
            case 'Kind.Term.ori':
                var $4673 = self.expr;
                var $4674 = Kind$Term$has_holes$($4673);
                var $4655 = $4674;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $4675 = Bool$false;
                var $4655 = $4675;
                break;
            case 'Kind.Term.hol':
                var $4676 = Bool$true;
                var $4655 = $4676;
                break;
        };
        return $4655;
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
                    var $4679 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                    var $4678 = $4679;
                } else {
                    var $4680 = Kind$Check$result$(Maybe$some$(Bool$true), List$cons$(Kind$Error$patch$(_path$1, Kind$Term$normalize$(_term$2, Map$new)), List$nil));
                    var $4678 = $4680;
                };
                var $4677 = $4678;
                break;
            case 'Kind.Term.hol':
                var $4681 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4677 = $4681;
                break;
        };
        return $4677;
    };
    const Kind$Term$equal$hole = x0 => x1 => Kind$Term$equal$hole$(x0, x1);

    function Kind$Term$equal$extra_holes$filler$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kind.Term.app':
                var $4683 = self.func;
                var $4684 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4686 = self.func;
                        var $4687 = self.argm;
                        var self = Kind$Term$equal$extra_holes$filler$($4683, $4686);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4689 = self.value;
                                var $4690 = self.errors;
                                var self = $4689;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4692 = Kind$Check$result$(Maybe$none, $4690);
                                        var $4691 = $4692;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Term$equal$extra_holes$filler$($4684, $4687);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4694 = self.value;
                                                var $4695 = self.errors;
                                                var $4696 = Kind$Check$result$($4694, List$concat$($4690, $4695));
                                                var $4693 = $4696;
                                                break;
                                        };
                                        var $4691 = $4693;
                                        break;
                                };
                                var $4688 = $4691;
                                break;
                        };
                        var $4685 = $4688;
                        break;
                    case 'Kind.Term.hol':
                        var $4697 = self.path;
                        var self = Kind$Term$equal$hole$($4697, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4699 = self.value;
                                var $4700 = self.errors;
                                var self = $4699;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4702 = Kind$Check$result$(Maybe$none, $4700);
                                        var $4701 = $4702;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4704 = self.value;
                                                var $4705 = self.errors;
                                                var $4706 = Kind$Check$result$($4704, List$concat$($4700, $4705));
                                                var $4703 = $4706;
                                                break;
                                        };
                                        var $4701 = $4703;
                                        break;
                                };
                                var $4698 = $4701;
                                break;
                        };
                        var $4685 = $4698;
                        break;
                    case 'Kind.Term.ori':
                        var $4707 = self.expr;
                        var $4708 = Kind$Term$equal$extra_holes$filler$(_a$1, $4707);
                        var $4685 = $4708;
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
                        var $4709 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4685 = $4709;
                        break;
                };
                var $4682 = $4685;
                break;
            case 'Kind.Term.hol':
                var $4710 = self.path;
                var self = Kind$Term$equal$hole$($4710, _b$2);
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
                var $4682 = $4711;
                break;
            case 'Kind.Term.ori':
                var $4720 = self.expr;
                var $4721 = Kind$Term$equal$extra_holes$filler$($4720, _b$2);
                var $4682 = $4721;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4723 = self.path;
                        var self = Kind$Term$equal$hole$($4723, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4725 = self.value;
                                var $4726 = self.errors;
                                var self = $4725;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4728 = Kind$Check$result$(Maybe$none, $4726);
                                        var $4727 = $4728;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4730 = self.value;
                                                var $4731 = self.errors;
                                                var $4732 = Kind$Check$result$($4730, List$concat$($4726, $4731));
                                                var $4729 = $4732;
                                                break;
                                        };
                                        var $4727 = $4729;
                                        break;
                                };
                                var $4724 = $4727;
                                break;
                        };
                        var $4722 = $4724;
                        break;
                    case 'Kind.Term.ori':
                        var $4733 = self.expr;
                        var $4734 = Kind$Term$equal$extra_holes$filler$(_a$1, $4733);
                        var $4722 = $4734;
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
                        var $4735 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4722 = $4735;
                        break;
                };
                var $4682 = $4722;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4737 = self.path;
                        var self = Kind$Term$equal$hole$($4737, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4739 = self.value;
                                var $4740 = self.errors;
                                var self = $4739;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4742 = Kind$Check$result$(Maybe$none, $4740);
                                        var $4741 = $4742;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4744 = self.value;
                                                var $4745 = self.errors;
                                                var $4746 = Kind$Check$result$($4744, List$concat$($4740, $4745));
                                                var $4743 = $4746;
                                                break;
                                        };
                                        var $4741 = $4743;
                                        break;
                                };
                                var $4738 = $4741;
                                break;
                        };
                        var $4736 = $4738;
                        break;
                    case 'Kind.Term.ori':
                        var $4747 = self.expr;
                        var $4748 = Kind$Term$equal$extra_holes$filler$(_a$1, $4747);
                        var $4736 = $4748;
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
                        var $4749 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4736 = $4749;
                        break;
                };
                var $4682 = $4736;
                break;
            case 'Kind.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4751 = self.path;
                        var self = Kind$Term$equal$hole$($4751, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4753 = self.value;
                                var $4754 = self.errors;
                                var self = $4753;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4756 = Kind$Check$result$(Maybe$none, $4754);
                                        var $4755 = $4756;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4758 = self.value;
                                                var $4759 = self.errors;
                                                var $4760 = Kind$Check$result$($4758, List$concat$($4754, $4759));
                                                var $4757 = $4760;
                                                break;
                                        };
                                        var $4755 = $4757;
                                        break;
                                };
                                var $4752 = $4755;
                                break;
                        };
                        var $4750 = $4752;
                        break;
                    case 'Kind.Term.ori':
                        var $4761 = self.expr;
                        var $4762 = Kind$Term$equal$extra_holes$filler$(_a$1, $4761);
                        var $4750 = $4762;
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
                        var $4763 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4750 = $4763;
                        break;
                };
                var $4682 = $4750;
                break;
            case 'Kind.Term.all':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4765 = self.path;
                        var self = Kind$Term$equal$hole$($4765, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4767 = self.value;
                                var $4768 = self.errors;
                                var self = $4767;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4770 = Kind$Check$result$(Maybe$none, $4768);
                                        var $4769 = $4770;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4772 = self.value;
                                                var $4773 = self.errors;
                                                var $4774 = Kind$Check$result$($4772, List$concat$($4768, $4773));
                                                var $4771 = $4774;
                                                break;
                                        };
                                        var $4769 = $4771;
                                        break;
                                };
                                var $4766 = $4769;
                                break;
                        };
                        var $4764 = $4766;
                        break;
                    case 'Kind.Term.ori':
                        var $4775 = self.expr;
                        var $4776 = Kind$Term$equal$extra_holes$filler$(_a$1, $4775);
                        var $4764 = $4776;
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
                        var $4777 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4764 = $4777;
                        break;
                };
                var $4682 = $4764;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4779 = self.path;
                        var self = Kind$Term$equal$hole$($4779, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4781 = self.value;
                                var $4782 = self.errors;
                                var self = $4781;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4784 = Kind$Check$result$(Maybe$none, $4782);
                                        var $4783 = $4784;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4786 = self.value;
                                                var $4787 = self.errors;
                                                var $4788 = Kind$Check$result$($4786, List$concat$($4782, $4787));
                                                var $4785 = $4788;
                                                break;
                                        };
                                        var $4783 = $4785;
                                        break;
                                };
                                var $4780 = $4783;
                                break;
                        };
                        var $4778 = $4780;
                        break;
                    case 'Kind.Term.ori':
                        var $4789 = self.expr;
                        var $4790 = Kind$Term$equal$extra_holes$filler$(_a$1, $4789);
                        var $4778 = $4790;
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
                        var $4791 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4778 = $4791;
                        break;
                };
                var $4682 = $4778;
                break;
            case 'Kind.Term.cse':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4793 = self.path;
                        var self = Kind$Term$equal$hole$($4793, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4795 = self.value;
                                var $4796 = self.errors;
                                var self = $4795;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4798 = Kind$Check$result$(Maybe$none, $4796);
                                        var $4797 = $4798;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4800 = self.value;
                                                var $4801 = self.errors;
                                                var $4802 = Kind$Check$result$($4800, List$concat$($4796, $4801));
                                                var $4799 = $4802;
                                                break;
                                        };
                                        var $4797 = $4799;
                                        break;
                                };
                                var $4794 = $4797;
                                break;
                        };
                        var $4792 = $4794;
                        break;
                    case 'Kind.Term.ori':
                        var $4803 = self.expr;
                        var $4804 = Kind$Term$equal$extra_holes$filler$(_a$1, $4803);
                        var $4792 = $4804;
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
                        var $4805 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4792 = $4805;
                        break;
                };
                var $4682 = $4792;
                break;
        };
        return $4682;
    };
    const Kind$Term$equal$extra_holes$filler = x0 => x1 => Kind$Term$equal$extra_holes$filler$(x0, x1);

    function Kind$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = Kind$Term$equal$extra_holes$funari$(_a$1, 0n);
        switch (self._) {
            case 'Maybe.some':
                var $4807 = self.value;
                var self = Kind$Term$equal$extra_holes$funari$(_b$2, 0n);
                switch (self._) {
                    case 'Maybe.some':
                        var $4809 = self.value;
                        var self = $4807;
                        switch (self._) {
                            case 'Pair.new':
                                var $4811 = self.fst;
                                var $4812 = self.snd;
                                var self = $4809;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4814 = self.fst;
                                        var $4815 = self.snd;
                                        var _same_fun$9 = ($4811 === $4814);
                                        var _same_ari$10 = ($4812 === $4815);
                                        var self = (_same_fun$9 && _same_ari$10);
                                        if (self) {
                                            var $4817 = Kind$Term$equal$extra_holes$filler$(_a$1, _b$2);
                                            var $4816 = $4817;
                                        } else {
                                            var $4818 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                            var $4816 = $4818;
                                        };
                                        var $4813 = $4816;
                                        break;
                                };
                                var $4810 = $4813;
                                break;
                        };
                        var $4808 = $4810;
                        break;
                    case 'Maybe.none':
                        var $4819 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4808 = $4819;
                        break;
                };
                var $4806 = $4808;
                break;
            case 'Maybe.none':
                var $4820 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                var $4806 = $4820;
                break;
        };
        return $4806;
    };
    const Kind$Term$equal$extra_holes = x0 => x1 => Kind$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $4821 = Map$set$(_bits$1, Unit$new, _set$2);
        return $4821;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);
    const Set$mut$set = a0 => a1 => (((k, s) => ((s[k] = true), s))(a0, a1));

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $4823 = _b$2;
            var $4822 = $4823;
        } else {
            var $4824 = (!_b$2);
            var $4822 = $4824;
        };
        return $4822;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Kind$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Kind$Term$serialize$(Kind$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$o, Bits$e);
        var _bh$7 = Kind$Term$serialize$(Kind$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$i, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $4826 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
            var $4825 = $4826;
        } else {
            var _a1$8 = Kind$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Kind$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Kind$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$o, Bits$e);
            var _bh$11 = Kind$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$i, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $4828 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4827 = $4828;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = (!!(_seen$5[_id$12]));
                if (self) {
                    var self = Kind$Term$equal$extra_holes$(_a$1, _b$2);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4831 = self.value;
                            var $4832 = self.errors;
                            var self = $4831;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4834 = Kind$Check$result$(Maybe$none, $4832);
                                    var $4833 = $4834;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4836 = self.value;
                                            var $4837 = self.errors;
                                            var $4838 = Kind$Check$result$($4836, List$concat$($4832, $4837));
                                            var $4835 = $4838;
                                            break;
                                    };
                                    var $4833 = $4835;
                                    break;
                            };
                            var $4830 = $4833;
                            break;
                    };
                    var $4829 = $4830;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Kind.Term.all':
                            var $4840 = self.eras;
                            var $4841 = self.self;
                            var $4842 = self.name;
                            var $4843 = self.xtyp;
                            var $4844 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.all':
                                    var $4846 = self.eras;
                                    var $4847 = self.self;
                                    var $4848 = self.name;
                                    var $4849 = self.xtyp;
                                    var $4850 = self.body;
                                    var _seen$23 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$24 = $4844(Kind$Term$var$($4841, _lv$4))(Kind$Term$var$($4842, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $4850(Kind$Term$var$($4847, _lv$4))(Kind$Term$var$($4848, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($4841 === $4847);
                                    var _eq_eras$27 = Bool$eql$($4840, $4846);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var self = Kind$Term$equal$($4843, $4849, _defs$3, _lv$4, _seen$23);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4853 = self.value;
                                                var $4854 = self.errors;
                                                var self = $4853;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $4856 = self.value;
                                                        var self = Kind$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23);
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
                                        var $4851 = $4852;
                                    } else {
                                        var $4871 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                        var $4851 = $4871;
                                    };
                                    var $4845 = $4851;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4872 = self.path;
                                    var $4873 = Kind$Term$equal$hole$($4872, _a$1);
                                    var $4845 = $4873;
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
                                    var $4874 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4845 = $4874;
                                    break;
                            };
                            var $4839 = $4845;
                            break;
                        case 'Kind.Term.lam':
                            var $4875 = self.name;
                            var $4876 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.lam':
                                    var $4878 = self.name;
                                    var $4879 = self.body;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$18 = $4876(Kind$Term$var$($4875, _lv$4));
                                    var _b1_body$19 = $4879(Kind$Term$var$($4878, _lv$4));
                                    var self = Kind$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4881 = self.value;
                                            var $4882 = self.errors;
                                            var self = $4881;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4884 = self.value;
                                                    var self = Kind$Check$result$(Maybe$some$($4884), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4886 = self.value;
                                                            var $4887 = self.errors;
                                                            var $4888 = Kind$Check$result$($4886, List$concat$($4882, $4887));
                                                            var $4885 = $4888;
                                                            break;
                                                    };
                                                    var $4883 = $4885;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4889 = Kind$Check$result$(Maybe$none, $4882);
                                                    var $4883 = $4889;
                                                    break;
                                            };
                                            var $4880 = $4883;
                                            break;
                                    };
                                    var $4877 = $4880;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4890 = self.path;
                                    var $4891 = Kind$Term$equal$hole$($4890, _a$1);
                                    var $4877 = $4891;
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
                                    var $4892 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4877 = $4892;
                                    break;
                            };
                            var $4839 = $4877;
                            break;
                        case 'Kind.Term.app':
                            var $4893 = self.func;
                            var $4894 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.app':
                                    var $4896 = self.func;
                                    var $4897 = self.argm;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var self = Kind$Term$equal$($4893, $4896, _defs$3, _lv$4, _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4899 = self.value;
                                            var $4900 = self.errors;
                                            var self = $4899;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4902 = self.value;
                                                    var self = Kind$Term$equal$($4894, $4897, _defs$3, _lv$4, _seen$17);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4904 = self.value;
                                                            var $4905 = self.errors;
                                                            var self = $4904;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4907 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4902 && $4907)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4909 = self.value;
                                                                            var $4910 = self.errors;
                                                                            var $4911 = Kind$Check$result$($4909, List$concat$($4905, $4910));
                                                                            var $4908 = $4911;
                                                                            break;
                                                                    };
                                                                    var $4906 = $4908;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4912 = Kind$Check$result$(Maybe$none, $4905);
                                                                    var $4906 = $4912;
                                                                    break;
                                                            };
                                                            var self = $4906;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4913 = self.value;
                                                            var $4914 = self.errors;
                                                            var $4915 = Kind$Check$result$($4913, List$concat$($4900, $4914));
                                                            var $4903 = $4915;
                                                            break;
                                                    };
                                                    var $4901 = $4903;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4916 = Kind$Check$result$(Maybe$none, $4900);
                                                    var $4901 = $4916;
                                                    break;
                                            };
                                            var $4898 = $4901;
                                            break;
                                    };
                                    var $4895 = $4898;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4917 = self.path;
                                    var $4918 = Kind$Term$equal$hole$($4917, _a$1);
                                    var $4895 = $4918;
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
                                    var $4919 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4895 = $4919;
                                    break;
                            };
                            var $4839 = $4895;
                            break;
                        case 'Kind.Term.let':
                            var $4920 = self.name;
                            var $4921 = self.expr;
                            var $4922 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.let':
                                    var $4924 = self.name;
                                    var $4925 = self.expr;
                                    var $4926 = self.body;
                                    var _seen$19 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$20 = $4922(Kind$Term$var$($4920, _lv$4));
                                    var _b1_body$21 = $4926(Kind$Term$var$($4924, _lv$4));
                                    var self = Kind$Term$equal$($4921, $4925, _defs$3, _lv$4, _seen$19);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4928 = self.value;
                                            var $4929 = self.errors;
                                            var self = $4928;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4931 = self.value;
                                                    var self = Kind$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4933 = self.value;
                                                            var $4934 = self.errors;
                                                            var self = $4933;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4936 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4931 && $4936)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4938 = self.value;
                                                                            var $4939 = self.errors;
                                                                            var $4940 = Kind$Check$result$($4938, List$concat$($4934, $4939));
                                                                            var $4937 = $4940;
                                                                            break;
                                                                    };
                                                                    var $4935 = $4937;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4941 = Kind$Check$result$(Maybe$none, $4934);
                                                                    var $4935 = $4941;
                                                                    break;
                                                            };
                                                            var self = $4935;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4942 = self.value;
                                                            var $4943 = self.errors;
                                                            var $4944 = Kind$Check$result$($4942, List$concat$($4929, $4943));
                                                            var $4932 = $4944;
                                                            break;
                                                    };
                                                    var $4930 = $4932;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4945 = Kind$Check$result$(Maybe$none, $4929);
                                                    var $4930 = $4945;
                                                    break;
                                            };
                                            var $4927 = $4930;
                                            break;
                                    };
                                    var $4923 = $4927;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4946 = self.path;
                                    var $4947 = Kind$Term$equal$hole$($4946, _a$1);
                                    var $4923 = $4947;
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
                                    var $4948 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4923 = $4948;
                                    break;
                            };
                            var $4839 = $4923;
                            break;
                        case 'Kind.Term.hol':
                            var $4949 = self.path;
                            var $4950 = Kind$Term$equal$hole$($4949, _b$2);
                            var $4839 = $4950;
                            break;
                        case 'Kind.Term.var':
                        case 'Kind.Term.ori':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4952 = self.path;
                                    var $4953 = Kind$Term$equal$hole$($4952, _a$1);
                                    var $4951 = $4953;
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
                                    var $4954 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4951 = $4954;
                                    break;
                            };
                            var $4839 = $4951;
                            break;
                        case 'Kind.Term.ref':
                        case 'Kind.Term.nat':
                        case 'Kind.Term.chr':
                        case 'Kind.Term.str':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4956 = self.path;
                                    var $4957 = Kind$Term$equal$hole$($4956, _a$1);
                                    var $4955 = $4957;
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
                                    var $4958 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4955 = $4958;
                                    break;
                            };
                            var $4839 = $4955;
                            break;
                        case 'Kind.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4960 = self.path;
                                    var $4961 = Kind$Term$equal$hole$($4960, _a$1);
                                    var $4959 = $4961;
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
                                    var $4962 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4959 = $4962;
                                    break;
                            };
                            var $4839 = $4959;
                            break;
                        case 'Kind.Term.def':
                        case 'Kind.Term.ann':
                        case 'Kind.Term.gol':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4964 = self.path;
                                    var $4965 = Kind$Term$equal$hole$($4964, _a$1);
                                    var $4963 = $4965;
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
                                    var $4966 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4963 = $4966;
                                    break;
                            };
                            var $4839 = $4963;
                            break;
                        case 'Kind.Term.cse':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4968 = self.path;
                                    var $4969 = Kind$Term$equal$hole$($4968, _a$1);
                                    var $4967 = $4969;
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
                                    var $4970 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4967 = $4970;
                                    break;
                            };
                            var $4839 = $4967;
                            break;
                    };
                    var $4829 = $4839;
                };
                var $4827 = $4829;
            };
            var $4825 = $4827;
        };
        return $4825;
    };
    const Kind$Term$equal = x0 => x1 => x2 => x3 => x4 => Kind$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;
    const Set$mut$new = a0 => (({}));

    function Kind$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4972 = self.name;
                var $4973 = self.indx;
                var self = List$at_last$($4973, _ctx$4);
                switch (self._) {
                    case 'Maybe.some':
                        var $4975 = self.value;
                        var $4976 = Kind$Check$result$(Maybe$some$((() => {
                            var self = $4975;
                            switch (self._) {
                                case 'Pair.new':
                                    var $4977 = self.snd;
                                    var $4978 = $4977;
                                    return $4978;
                            };
                        })()), List$nil);
                        var $4974 = $4976;
                        break;
                    case 'Maybe.none':
                        var $4979 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4972), List$nil));
                        var $4974 = $4979;
                        break;
                };
                var self = $4974;
                break;
            case 'Kind.Term.ref':
                var $4980 = self.name;
                var self = Kind$get$($4980, _defs$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $4982 = self.value;
                        var self = $4982;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4984 = self.name;
                                var $4985 = self.term;
                                var $4986 = self.type;
                                var $4987 = self.stat;
                                var _ref_name$18 = $4984;
                                var _ref_type$19 = $4986;
                                var _ref_term$20 = $4985;
                                var _ref_stat$21 = $4987;
                                var self = _ref_stat$21;
                                switch (self._) {
                                    case 'Kind.Status.init':
                                        var $4989 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$waiting$(_ref_name$18), List$nil));
                                        var $4988 = $4989;
                                        break;
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $4990 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$nil);
                                        var $4988 = $4990;
                                        break;
                                    case 'Kind.Status.fail':
                                        var $4991 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$indirect$(_ref_name$18), List$nil));
                                        var $4988 = $4991;
                                        break;
                                };
                                var $4983 = $4988;
                                break;
                        };
                        var $4981 = $4983;
                        break;
                    case 'Maybe.none':
                        var $4992 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4980), List$nil));
                        var $4981 = $4992;
                        break;
                };
                var self = $4981;
                break;
            case 'Kind.Term.all':
                var $4993 = self.self;
                var $4994 = self.name;
                var $4995 = self.xtyp;
                var $4996 = self.body;
                var _ctx_size$12 = (list_length(_ctx$4));
                var _self_var$13 = Kind$Term$var$($4993, _ctx_size$12);
                var _body_var$14 = Kind$Term$var$($4994, Nat$succ$(_ctx_size$12));
                var _body_ctx$15 = List$cons$(Pair$new$($4994, $4995), List$cons$(Pair$new$($4993, _term$1), _ctx$4));
                var self = Kind$Term$check$($4995, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4998 = self.value;
                        var $4999 = self.errors;
                        var self = $4998;
                        switch (self._) {
                            case 'Maybe.none':
                                var $5001 = Kind$Check$result$(Maybe$none, $4999);
                                var $5000 = $5001;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Term$check$($4996(_self_var$13)(_body_var$14), Maybe$some$(Kind$Term$typ), _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5003 = self.value;
                                        var $5004 = self.errors;
                                        var self = $5003;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5006 = Kind$Check$result$(Maybe$none, $5004);
                                                var $5005 = $5006;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5008 = self.value;
                                                        var $5009 = self.errors;
                                                        var $5010 = Kind$Check$result$($5008, List$concat$($5004, $5009));
                                                        var $5007 = $5010;
                                                        break;
                                                };
                                                var $5005 = $5007;
                                                break;
                                        };
                                        var self = $5005;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5011 = self.value;
                                        var $5012 = self.errors;
                                        var $5013 = Kind$Check$result$($5011, List$concat$($4999, $5012));
                                        var $5002 = $5013;
                                        break;
                                };
                                var $5000 = $5002;
                                break;
                        };
                        var $4997 = $5000;
                        break;
                };
                var self = $4997;
                break;
            case 'Kind.Term.lam':
                var $5014 = self.name;
                var $5015 = self.body;
                var self = _type$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $5017 = self.value;
                        var _typv$10 = Kind$Term$reduce$($5017, _defs$3);
                        var self = _typv$10;
                        switch (self._) {
                            case 'Kind.Term.all':
                                var $5019 = self.xtyp;
                                var $5020 = self.body;
                                var _ctx_size$16 = (list_length(_ctx$4));
                                var _self_var$17 = _term$1;
                                var _body_var$18 = Kind$Term$var$($5014, _ctx_size$16);
                                var _body_typ$19 = $5020(_self_var$17)(_body_var$18);
                                var _body_ctx$20 = List$cons$(Pair$new$($5014, $5019), _ctx$4);
                                var self = Kind$Term$check$($5015(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Kind$MPath$o$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5022 = self.value;
                                        var $5023 = self.errors;
                                        var self = $5022;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5025 = Kind$Check$result$(Maybe$none, $5023);
                                                var $5024 = $5025;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$($5017), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5027 = self.value;
                                                        var $5028 = self.errors;
                                                        var $5029 = Kind$Check$result$($5027, List$concat$($5023, $5028));
                                                        var $5026 = $5029;
                                                        break;
                                                };
                                                var $5024 = $5026;
                                                break;
                                        };
                                        var $5021 = $5024;
                                        break;
                                };
                                var $5018 = $5021;
                                break;
                            case 'Kind.Term.var':
                            case 'Kind.Term.lam':
                            case 'Kind.Term.app':
                            case 'Kind.Term.ori':
                                var _expected$13 = Either$left$("(function type)");
                                var _detected$14 = Either$right$($5017);
                                var $5030 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $5018 = $5030;
                                break;
                            case 'Kind.Term.ref':
                            case 'Kind.Term.hol':
                            case 'Kind.Term.nat':
                            case 'Kind.Term.chr':
                            case 'Kind.Term.str':
                                var _expected$12 = Either$left$("(function type)");
                                var _detected$13 = Either$right$($5017);
                                var $5031 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $5018 = $5031;
                                break;
                            case 'Kind.Term.typ':
                                var _expected$11 = Either$left$("(function type)");
                                var _detected$12 = Either$right$($5017);
                                var $5032 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $5018 = $5032;
                                break;
                            case 'Kind.Term.let':
                            case 'Kind.Term.def':
                            case 'Kind.Term.ann':
                            case 'Kind.Term.gol':
                                var _expected$14 = Either$left$("(function type)");
                                var _detected$15 = Either$right$($5017);
                                var $5033 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $5018 = $5033;
                                break;
                            case 'Kind.Term.cse':
                                var _expected$17 = Either$left$("(function type)");
                                var _detected$18 = Either$right$($5017);
                                var $5034 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $5018 = $5034;
                                break;
                        };
                        var $5016 = $5018;
                        break;
                    case 'Maybe.none':
                        var _lam_type$9 = Kind$Term$hol$(Bits$e);
                        var _lam_term$10 = Kind$Term$ann$(Bool$false, _term$1, _lam_type$9);
                        var $5035 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), _lam_term$10), List$nil));
                        var $5016 = $5035;
                        break;
                };
                var self = $5016;
                break;
            case 'Kind.Term.app':
                var $5036 = self.func;
                var $5037 = self.argm;
                var self = Kind$Term$check$($5036, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5039 = self.value;
                        var $5040 = self.errors;
                        var self = $5039;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5042 = self.value;
                                var _func_typ$12 = Kind$Term$reduce$($5042, _defs$3);
                                var self = _func_typ$12;
                                switch (self._) {
                                    case 'Kind.Term.all':
                                        var $5044 = self.xtyp;
                                        var $5045 = self.body;
                                        var self = Kind$Term$check$($5037, Maybe$some$($5044), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $5047 = self.value;
                                                var $5048 = self.errors;
                                                var self = $5047;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $5050 = Kind$Check$result$(Maybe$none, $5048);
                                                        var $5049 = $5050;
                                                        break;
                                                    case 'Maybe.some':
                                                        var self = Kind$Check$result$(Maybe$some$($5045($5036)($5037)), List$nil);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $5052 = self.value;
                                                                var $5053 = self.errors;
                                                                var $5054 = Kind$Check$result$($5052, List$concat$($5048, $5053));
                                                                var $5051 = $5054;
                                                                break;
                                                        };
                                                        var $5049 = $5051;
                                                        break;
                                                };
                                                var $5046 = $5049;
                                                break;
                                        };
                                        var self = $5046;
                                        break;
                                    case 'Kind.Term.var':
                                    case 'Kind.Term.lam':
                                    case 'Kind.Term.app':
                                    case 'Kind.Term.ori':
                                        var _expected$15 = Either$left$("(function type)");
                                        var _detected$16 = Either$right$(_func_typ$12);
                                        var $5055 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$15, _detected$16, _ctx$4), List$nil));
                                        var self = $5055;
                                        break;
                                    case 'Kind.Term.ref':
                                    case 'Kind.Term.hol':
                                    case 'Kind.Term.nat':
                                    case 'Kind.Term.chr':
                                    case 'Kind.Term.str':
                                        var _expected$14 = Either$left$("(function type)");
                                        var _detected$15 = Either$right$(_func_typ$12);
                                        var $5056 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                        var self = $5056;
                                        break;
                                    case 'Kind.Term.typ':
                                        var _expected$13 = Either$left$("(function type)");
                                        var _detected$14 = Either$right$(_func_typ$12);
                                        var $5057 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                        var self = $5057;
                                        break;
                                    case 'Kind.Term.let':
                                    case 'Kind.Term.def':
                                    case 'Kind.Term.ann':
                                    case 'Kind.Term.gol':
                                        var _expected$16 = Either$left$("(function type)");
                                        var _detected$17 = Either$right$(_func_typ$12);
                                        var $5058 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$16, _detected$17, _ctx$4), List$nil));
                                        var self = $5058;
                                        break;
                                    case 'Kind.Term.cse':
                                        var _expected$19 = Either$left$("(function type)");
                                        var _detected$20 = Either$right$(_func_typ$12);
                                        var $5059 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$19, _detected$20, _ctx$4), List$nil));
                                        var self = $5059;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5060 = self.value;
                                        var $5061 = self.errors;
                                        var $5062 = Kind$Check$result$($5060, List$concat$($5040, $5061));
                                        var $5043 = $5062;
                                        break;
                                };
                                var $5041 = $5043;
                                break;
                            case 'Maybe.none':
                                var $5063 = Kind$Check$result$(Maybe$none, $5040);
                                var $5041 = $5063;
                                break;
                        };
                        var $5038 = $5041;
                        break;
                };
                var self = $5038;
                break;
            case 'Kind.Term.let':
                var $5064 = self.name;
                var $5065 = self.expr;
                var $5066 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5065, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5068 = self.value;
                        var $5069 = self.errors;
                        var self = $5068;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5071 = self.value;
                                var _body_val$14 = $5066(Kind$Term$var$($5064, _ctx_size$10));
                                var _body_ctx$15 = List$cons$(Pair$new$($5064, $5071), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5073 = self.value;
                                        var $5074 = self.errors;
                                        var self = $5073;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5076 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5076), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5078 = self.value;
                                                        var $5079 = self.errors;
                                                        var $5080 = Kind$Check$result$($5078, List$concat$($5074, $5079));
                                                        var $5077 = $5080;
                                                        break;
                                                };
                                                var $5075 = $5077;
                                                break;
                                            case 'Maybe.none':
                                                var $5081 = Kind$Check$result$(Maybe$none, $5074);
                                                var $5075 = $5081;
                                                break;
                                        };
                                        var self = $5075;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5082 = self.value;
                                        var $5083 = self.errors;
                                        var $5084 = Kind$Check$result$($5082, List$concat$($5069, $5083));
                                        var $5072 = $5084;
                                        break;
                                };
                                var $5070 = $5072;
                                break;
                            case 'Maybe.none':
                                var $5085 = Kind$Check$result$(Maybe$none, $5069);
                                var $5070 = $5085;
                                break;
                        };
                        var $5067 = $5070;
                        break;
                };
                var self = $5067;
                break;
            case 'Kind.Term.def':
                var $5086 = self.name;
                var $5087 = self.expr;
                var $5088 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5087, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5090 = self.value;
                        var $5091 = self.errors;
                        var self = $5090;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5093 = self.value;
                                var _body_val$14 = $5088(Kind$Term$ann$(Bool$true, $5087, $5093));
                                var _body_ctx$15 = List$cons$(Pair$new$($5086, $5093), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5095 = self.value;
                                        var $5096 = self.errors;
                                        var self = $5095;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5098 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5098), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5100 = self.value;
                                                        var $5101 = self.errors;
                                                        var $5102 = Kind$Check$result$($5100, List$concat$($5096, $5101));
                                                        var $5099 = $5102;
                                                        break;
                                                };
                                                var $5097 = $5099;
                                                break;
                                            case 'Maybe.none':
                                                var $5103 = Kind$Check$result$(Maybe$none, $5096);
                                                var $5097 = $5103;
                                                break;
                                        };
                                        var self = $5097;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5104 = self.value;
                                        var $5105 = self.errors;
                                        var $5106 = Kind$Check$result$($5104, List$concat$($5091, $5105));
                                        var $5094 = $5106;
                                        break;
                                };
                                var $5092 = $5094;
                                break;
                            case 'Maybe.none':
                                var $5107 = Kind$Check$result$(Maybe$none, $5091);
                                var $5092 = $5107;
                                break;
                        };
                        var $5089 = $5092;
                        break;
                };
                var self = $5089;
                break;
            case 'Kind.Term.ann':
                var $5108 = self.done;
                var $5109 = self.term;
                var $5110 = self.type;
                var self = $5108;
                if (self) {
                    var $5112 = Kind$Check$result$(Maybe$some$($5110), List$nil);
                    var $5111 = $5112;
                } else {
                    var self = Kind$Term$check$($5109, Maybe$some$($5110), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $5114 = self.value;
                            var $5115 = self.errors;
                            var self = $5114;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $5117 = Kind$Check$result$(Maybe$none, $5115);
                                    var $5116 = $5117;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Term$check$($5110, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5119 = self.value;
                                            var $5120 = self.errors;
                                            var self = $5119;
                                            switch (self._) {
                                                case 'Maybe.none':
                                                    var $5122 = Kind$Check$result$(Maybe$none, $5120);
                                                    var $5121 = $5122;
                                                    break;
                                                case 'Maybe.some':
                                                    var self = Kind$Check$result$(Maybe$some$($5110), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $5124 = self.value;
                                                            var $5125 = self.errors;
                                                            var $5126 = Kind$Check$result$($5124, List$concat$($5120, $5125));
                                                            var $5123 = $5126;
                                                            break;
                                                    };
                                                    var $5121 = $5123;
                                                    break;
                                            };
                                            var self = $5121;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5127 = self.value;
                                            var $5128 = self.errors;
                                            var $5129 = Kind$Check$result$($5127, List$concat$($5115, $5128));
                                            var $5118 = $5129;
                                            break;
                                    };
                                    var $5116 = $5118;
                                    break;
                            };
                            var $5113 = $5116;
                            break;
                    };
                    var $5111 = $5113;
                };
                var self = $5111;
                break;
            case 'Kind.Term.gol':
                var $5130 = self.name;
                var $5131 = self.dref;
                var $5132 = self.verb;
                var $5133 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$show_goal$($5130, $5131, $5132, _type$2, _ctx$4), List$nil));
                var self = $5133;
                break;
            case 'Kind.Term.cse':
                var $5134 = self.path;
                var $5135 = self.expr;
                var $5136 = self.name;
                var $5137 = self.with;
                var $5138 = self.cses;
                var $5139 = self.moti;
                var _expr$13 = $5135;
                var self = Kind$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5141 = self.value;
                        var $5142 = self.errors;
                        var self = $5141;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5144 = self.value;
                                var self = $5139;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5146 = self.value;
                                        var $5147 = Kind$Term$desugar_cse$($5135, $5136, $5137, $5138, $5146, $5144, _defs$3, _ctx$4);
                                        var _dsug$17 = $5147;
                                        break;
                                    case 'Maybe.none':
                                        var self = _type$2;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5149 = self.value;
                                                var _size$18 = (list_length(_ctx$4));
                                                var _typv$19 = Kind$Term$normalize$($5149, Map$new);
                                                var _moti$20 = Kind$SmartMotive$make$($5136, $5135, $5144, _typv$19, _size$18, _defs$3);
                                                var $5150 = _moti$20;
                                                var _moti$17 = $5150;
                                                break;
                                            case 'Maybe.none':
                                                var $5151 = Kind$Term$hol$(Bits$e);
                                                var _moti$17 = $5151;
                                                break;
                                        };
                                        var $5148 = Maybe$some$(Kind$Term$cse$($5134, $5135, $5136, $5137, $5138, Maybe$some$(_moti$17)));
                                        var _dsug$17 = $5148;
                                        break;
                                };
                                var self = _dsug$17;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5152 = self.value;
                                        var $5153 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), $5152), List$nil));
                                        var self = $5153;
                                        break;
                                    case 'Maybe.none':
                                        var $5154 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                        var self = $5154;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5155 = self.value;
                                        var $5156 = self.errors;
                                        var $5157 = Kind$Check$result$($5155, List$concat$($5142, $5156));
                                        var $5145 = $5157;
                                        break;
                                };
                                var $5143 = $5145;
                                break;
                            case 'Maybe.none':
                                var $5158 = Kind$Check$result$(Maybe$none, $5142);
                                var $5143 = $5158;
                                break;
                        };
                        var $5140 = $5143;
                        break;
                };
                var self = $5140;
                break;
            case 'Kind.Term.ori':
                var $5159 = self.orig;
                var $5160 = self.expr;
                var $5161 = Kind$Term$check$($5160, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($5159));
                var self = $5161;
                break;
            case 'Kind.Term.typ':
                var $5162 = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                var self = $5162;
                break;
            case 'Kind.Term.hol':
                var $5163 = Kind$Check$result$(_type$2, List$nil);
                var self = $5163;
                break;
            case 'Kind.Term.nat':
                var $5164 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Nat")), List$nil);
                var self = $5164;
                break;
            case 'Kind.Term.chr':
                var $5165 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Char")), List$nil);
                var self = $5165;
                break;
            case 'Kind.Term.str':
                var $5166 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("String")), List$nil);
                var self = $5166;
                break;
        };
        switch (self._) {
            case 'Kind.Check.result':
                var $5167 = self.value;
                var $5168 = self.errors;
                var self = $5167;
                switch (self._) {
                    case 'Maybe.some':
                        var $5170 = self.value;
                        var self = _type$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5172 = self.value;
                                var self = Kind$Term$equal$($5172, $5170, _defs$3, (list_length(_ctx$4)), (({})));
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5174 = self.value;
                                        var $5175 = self.errors;
                                        var self = $5174;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5177 = self.value;
                                                var self = $5177;
                                                if (self) {
                                                    var $5179 = Kind$Check$result$(Maybe$some$($5172), List$nil);
                                                    var self = $5179;
                                                } else {
                                                    var $5180 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, Either$right$($5172), Either$right$($5170), _ctx$4), List$nil));
                                                    var self = $5180;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5181 = self.value;
                                                        var $5182 = self.errors;
                                                        var $5183 = Kind$Check$result$($5181, List$concat$($5175, $5182));
                                                        var $5178 = $5183;
                                                        break;
                                                };
                                                var $5176 = $5178;
                                                break;
                                            case 'Maybe.none':
                                                var $5184 = Kind$Check$result$(Maybe$none, $5175);
                                                var $5176 = $5184;
                                                break;
                                        };
                                        var $5173 = $5176;
                                        break;
                                };
                                var self = $5173;
                                break;
                            case 'Maybe.none':
                                var $5185 = Kind$Check$result$(Maybe$some$($5170), List$nil);
                                var self = $5185;
                                break;
                        };
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $5186 = self.value;
                                var $5187 = self.errors;
                                var $5188 = Kind$Check$result$($5186, List$concat$($5168, $5187));
                                var $5171 = $5188;
                                break;
                        };
                        var $5169 = $5171;
                        break;
                    case 'Maybe.none':
                        var $5189 = Kind$Check$result$(Maybe$none, $5168);
                        var $5169 = $5189;
                        break;
                };
                var $4971 = $5169;
                break;
        };
        return $4971;
    };
    const Kind$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$check$(x0, x1, x2, x3, x4, x5);

    function Kind$Path$nil$(_x$1) {
        var $5190 = _x$1;
        return $5190;
    };
    const Kind$Path$nil = x0 => Kind$Path$nil$(x0);
    const Kind$MPath$nil = Maybe$some$(Kind$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $5192 = Bool$true;
                var $5191 = $5192;
                break;
            case 'List.cons':
                var $5193 = Bool$false;
                var $5191 = $5193;
                break;
        };
        return $5191;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kind$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.all':
                var $5195 = self.eras;
                var $5196 = self.self;
                var $5197 = self.name;
                var $5198 = self.xtyp;
                var $5199 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5201 = self.slice(0, -1);
                        var $5202 = Kind$Term$all$($5195, $5196, $5197, Kind$Term$patch_at$($5201, $5198, _fn$3), $5199);
                        var $5200 = $5202;
                        break;
                    case 'i':
                        var $5203 = self.slice(0, -1);
                        var $5204 = Kind$Term$all$($5195, $5196, $5197, $5198, (_s$10 => _x$11 => {
                            var $5205 = Kind$Term$patch_at$($5203, $5199(_s$10)(_x$11), _fn$3);
                            return $5205;
                        }));
                        var $5200 = $5204;
                        break;
                    case 'e':
                        var $5206 = _fn$3(_term$2);
                        var $5200 = $5206;
                        break;
                };
                var $5194 = $5200;
                break;
            case 'Kind.Term.lam':
                var $5207 = self.name;
                var $5208 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5210 = _fn$3(_term$2);
                        var $5209 = $5210;
                        break;
                    case 'o':
                    case 'i':
                        var $5211 = Kind$Term$lam$($5207, (_x$7 => {
                            var $5212 = Kind$Term$patch_at$(Bits$tail$(_path$1), $5208(_x$7), _fn$3);
                            return $5212;
                        }));
                        var $5209 = $5211;
                        break;
                };
                var $5194 = $5209;
                break;
            case 'Kind.Term.app':
                var $5213 = self.func;
                var $5214 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5216 = self.slice(0, -1);
                        var $5217 = Kind$Term$app$(Kind$Term$patch_at$($5216, $5213, _fn$3), $5214);
                        var $5215 = $5217;
                        break;
                    case 'i':
                        var $5218 = self.slice(0, -1);
                        var $5219 = Kind$Term$app$($5213, Kind$Term$patch_at$($5218, $5214, _fn$3));
                        var $5215 = $5219;
                        break;
                    case 'e':
                        var $5220 = _fn$3(_term$2);
                        var $5215 = $5220;
                        break;
                };
                var $5194 = $5215;
                break;
            case 'Kind.Term.let':
                var $5221 = self.name;
                var $5222 = self.expr;
                var $5223 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5225 = self.slice(0, -1);
                        var $5226 = Kind$Term$let$($5221, Kind$Term$patch_at$($5225, $5222, _fn$3), $5223);
                        var $5224 = $5226;
                        break;
                    case 'i':
                        var $5227 = self.slice(0, -1);
                        var $5228 = Kind$Term$let$($5221, $5222, (_x$8 => {
                            var $5229 = Kind$Term$patch_at$($5227, $5223(_x$8), _fn$3);
                            return $5229;
                        }));
                        var $5224 = $5228;
                        break;
                    case 'e':
                        var $5230 = _fn$3(_term$2);
                        var $5224 = $5230;
                        break;
                };
                var $5194 = $5224;
                break;
            case 'Kind.Term.def':
                var $5231 = self.name;
                var $5232 = self.expr;
                var $5233 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5235 = self.slice(0, -1);
                        var $5236 = Kind$Term$def$($5231, Kind$Term$patch_at$($5235, $5232, _fn$3), $5233);
                        var $5234 = $5236;
                        break;
                    case 'i':
                        var $5237 = self.slice(0, -1);
                        var $5238 = Kind$Term$def$($5231, $5232, (_x$8 => {
                            var $5239 = Kind$Term$patch_at$($5237, $5233(_x$8), _fn$3);
                            return $5239;
                        }));
                        var $5234 = $5238;
                        break;
                    case 'e':
                        var $5240 = _fn$3(_term$2);
                        var $5234 = $5240;
                        break;
                };
                var $5194 = $5234;
                break;
            case 'Kind.Term.ann':
                var $5241 = self.done;
                var $5242 = self.term;
                var $5243 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5245 = self.slice(0, -1);
                        var $5246 = Kind$Term$ann$($5241, Kind$Term$patch_at$($5245, $5242, _fn$3), $5243);
                        var $5244 = $5246;
                        break;
                    case 'i':
                        var $5247 = self.slice(0, -1);
                        var $5248 = Kind$Term$ann$($5241, $5242, Kind$Term$patch_at$($5247, $5243, _fn$3));
                        var $5244 = $5248;
                        break;
                    case 'e':
                        var $5249 = _fn$3(_term$2);
                        var $5244 = $5249;
                        break;
                };
                var $5194 = $5244;
                break;
            case 'Kind.Term.ori':
                var $5250 = self.orig;
                var $5251 = self.expr;
                var $5252 = Kind$Term$ori$($5250, Kind$Term$patch_at$(_path$1, $5251, _fn$3));
                var $5194 = $5252;
                break;
            case 'Kind.Term.var':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5254 = _fn$3(_term$2);
                        var $5253 = $5254;
                        break;
                    case 'o':
                    case 'i':
                        var $5255 = _term$2;
                        var $5253 = $5255;
                        break;
                };
                var $5194 = $5253;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5257 = _fn$3(_term$2);
                        var $5256 = $5257;
                        break;
                    case 'o':
                    case 'i':
                        var $5258 = _term$2;
                        var $5256 = $5258;
                        break;
                };
                var $5194 = $5256;
                break;
            case 'Kind.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5260 = _fn$3(_term$2);
                        var $5259 = $5260;
                        break;
                    case 'o':
                    case 'i':
                        var $5261 = _term$2;
                        var $5259 = $5261;
                        break;
                };
                var $5194 = $5259;
                break;
            case 'Kind.Term.gol':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5263 = _fn$3(_term$2);
                        var $5262 = $5263;
                        break;
                    case 'o':
                    case 'i':
                        var $5264 = _term$2;
                        var $5262 = $5264;
                        break;
                };
                var $5194 = $5262;
                break;
            case 'Kind.Term.cse':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5266 = _fn$3(_term$2);
                        var $5265 = $5266;
                        break;
                    case 'o':
                    case 'i':
                        var $5267 = _term$2;
                        var $5265 = $5267;
                        break;
                };
                var $5194 = $5265;
                break;
        };
        return $5194;
    };
    const Kind$Term$patch_at = x0 => x1 => x2 => Kind$Term$patch_at$(x0, x1, x2);

    function Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, _errs$10, _fixd$11) {
        var self = _errs$10;
        switch (self._) {
            case 'List.cons':
                var $5269 = self.head;
                var $5270 = self.tail;
                var self = $5269;
                switch (self._) {
                    case 'Kind.Error.waiting':
                        var $5272 = self.name;
                        var $5273 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                            var $5274 = _m$bind$15;
                            return $5274;
                        }))(Kind$Synth$one$($5272, _defs$9))((_new_defs$15 => {
                            var self = _new_defs$15;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5276 = self.value;
                                    var $5277 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5276, $5270, Bool$true);
                                    var $5275 = $5277;
                                    break;
                                case 'Maybe.none':
                                    var $5278 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5270, _fixd$11);
                                    var $5275 = $5278;
                                    break;
                            };
                            return $5275;
                        }));
                        var $5271 = $5273;
                        break;
                    case 'Kind.Error.patch':
                        var $5279 = self.path;
                        var $5280 = self.term;
                        var self = $5279;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $5282 = self.slice(0, -1);
                                var _term$17 = Kind$Term$patch_at$($5282, _term$5, (_x$17 => {
                                    var $5284 = $5280;
                                    return $5284;
                                }));
                                var $5283 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$17, _type$6, _isct$7, _arit$8, _defs$9, $5270, Bool$true);
                                var $5281 = $5283;
                                break;
                            case 'i':
                                var $5285 = self.slice(0, -1);
                                var _type$17 = Kind$Term$patch_at$($5285, _type$6, (_x$17 => {
                                    var $5287 = $5280;
                                    return $5287;
                                }));
                                var $5286 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$17, _isct$7, _arit$8, _defs$9, $5270, Bool$true);
                                var $5281 = $5286;
                                break;
                            case 'e':
                                var $5288 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $5289 = _m$pure$17;
                                    return $5289;
                                }))(Maybe$none);
                                var $5281 = $5288;
                                break;
                        };
                        var $5271 = $5281;
                        break;
                    case 'Kind.Error.undefined_reference':
                        var $5290 = self.name;
                        var $5291 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                            var $5292 = _m$bind$16;
                            return $5292;
                        }))(Kind$Synth$one$($5290, _defs$9))((_new_defs$16 => {
                            var self = _new_defs$16;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5294 = self.value;
                                    var $5295 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5294, $5270, Bool$true);
                                    var $5293 = $5295;
                                    break;
                                case 'Maybe.none':
                                    var $5296 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5270, _fixd$11);
                                    var $5293 = $5296;
                                    break;
                            };
                            return $5293;
                        }));
                        var $5271 = $5291;
                        break;
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.cant_infer':
                        var $5297 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5270, _fixd$11);
                        var $5271 = $5297;
                        break;
                };
                var $5268 = $5271;
                break;
            case 'List.nil':
                var self = _fixd$11;
                if (self) {
                    var _type$12 = Kind$Term$bind$(List$nil, (_x$12 => {
                        var $5300 = (_x$12 + '1');
                        return $5300;
                    }), _type$6);
                    var _term$13 = Kind$Term$bind$(List$nil, (_x$13 => {
                        var $5301 = (_x$13 + '0');
                        return $5301;
                    }), _term$5);
                    var _defs$14 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$13, _type$12, _isct$7, _arit$8, Kind$Status$init), _defs$9);
                    var $5299 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                        var $5302 = _m$pure$16;
                        return $5302;
                    }))(Maybe$some$(_defs$14));
                    var $5298 = $5299;
                } else {
                    var $5303 = IO$monad$((_m$bind$12 => _m$pure$13 => {
                        var $5304 = _m$pure$13;
                        return $5304;
                    }))(Maybe$none);
                    var $5298 = $5303;
                };
                var $5268 = $5298;
                break;
        };
        return $5268;
    };
    const Kind$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Kind$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);

    function Kind$Status$fail$(_errors$1) {
        var $5305 = ({
            _: 'Kind.Status.fail',
            'errors': _errors$1
        });
        return $5305;
    };
    const Kind$Status$fail = x0 => Kind$Status$fail$(x0);

    function Kind$Synth$one$(_name$1, _defs$2) {
        var self = Kind$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.some':
                var $5307 = self.value;
                var self = $5307;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5309 = self.file;
                        var $5310 = self.code;
                        var $5311 = self.orig;
                        var $5312 = self.name;
                        var $5313 = self.term;
                        var $5314 = self.type;
                        var $5315 = self.isct;
                        var $5316 = self.arit;
                        var $5317 = self.stat;
                        var _file$13 = $5309;
                        var _code$14 = $5310;
                        var _orig$15 = $5311;
                        var _name$16 = $5312;
                        var _term$17 = $5313;
                        var _type$18 = $5314;
                        var _isct$19 = $5315;
                        var _arit$20 = $5316;
                        var _stat$21 = $5317;
                        var self = _stat$21;
                        switch (self._) {
                            case 'Kind.Status.init':
                                var _defs$22 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Kind$Status$wait), _defs$2);
                                var self = Kind$Term$check$(_type$18, Maybe$some$(Kind$Term$typ), _defs$22, List$nil, Kind$MPath$i$(Kind$MPath$nil), Maybe$none);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5320 = self.value;
                                        var $5321 = self.errors;
                                        var self = $5320;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5323 = Kind$Check$result$(Maybe$none, $5321);
                                                var $5322 = $5323;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Term$check$(_term$17, Maybe$some$(_type$18), _defs$22, List$nil, Kind$MPath$o$(Kind$MPath$nil), Maybe$none);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5325 = self.value;
                                                        var $5326 = self.errors;
                                                        var self = $5325;
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $5328 = Kind$Check$result$(Maybe$none, $5326);
                                                                var $5327 = $5328;
                                                                break;
                                                            case 'Maybe.some':
                                                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                                                switch (self._) {
                                                                    case 'Kind.Check.result':
                                                                        var $5330 = self.value;
                                                                        var $5331 = self.errors;
                                                                        var $5332 = Kind$Check$result$($5330, List$concat$($5326, $5331));
                                                                        var $5329 = $5332;
                                                                        break;
                                                                };
                                                                var $5327 = $5329;
                                                                break;
                                                        };
                                                        var self = $5327;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5333 = self.value;
                                                        var $5334 = self.errors;
                                                        var $5335 = Kind$Check$result$($5333, List$concat$($5321, $5334));
                                                        var $5324 = $5335;
                                                        break;
                                                };
                                                var $5322 = $5324;
                                                break;
                                        };
                                        var _checked$23 = $5322;
                                        break;
                                };
                                var self = _checked$23;
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5336 = self.errors;
                                        var self = List$is_empty$($5336);
                                        if (self) {
                                            var _defs$26 = Kind$define$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Bool$true, _defs$22);
                                            var $5338 = IO$monad$((_m$bind$27 => _m$pure$28 => {
                                                var $5339 = _m$pure$28;
                                                return $5339;
                                            }))(Maybe$some$(_defs$26));
                                            var $5337 = $5338;
                                        } else {
                                            var $5340 = IO$monad$((_m$bind$26 => _m$pure$27 => {
                                                var $5341 = _m$bind$26;
                                                return $5341;
                                            }))(Kind$Synth$fix$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _defs$22, $5336, Bool$false))((_fixed$26 => {
                                                var self = _fixed$26;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $5343 = self.value;
                                                        var $5344 = Kind$Synth$one$(_name$16, $5343);
                                                        var $5342 = $5344;
                                                        break;
                                                    case 'Maybe.none':
                                                        var _stat$27 = Kind$Status$fail$($5336);
                                                        var _defs$28 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _stat$27), _defs$22);
                                                        var $5345 = IO$monad$((_m$bind$29 => _m$pure$30 => {
                                                            var $5346 = _m$pure$30;
                                                            return $5346;
                                                        }))(Maybe$some$(_defs$28));
                                                        var $5342 = $5345;
                                                        break;
                                                };
                                                return $5342;
                                            }));
                                            var $5337 = $5340;
                                        };
                                        var $5319 = $5337;
                                        break;
                                };
                                var $5318 = $5319;
                                break;
                            case 'Kind.Status.wait':
                            case 'Kind.Status.done':
                                var $5347 = IO$monad$((_m$bind$22 => _m$pure$23 => {
                                    var $5348 = _m$pure$23;
                                    return $5348;
                                }))(Maybe$some$(_defs$2));
                                var $5318 = $5347;
                                break;
                            case 'Kind.Status.fail':
                                var $5349 = IO$monad$((_m$bind$23 => _m$pure$24 => {
                                    var $5350 = _m$pure$24;
                                    return $5350;
                                }))(Maybe$some$(_defs$2));
                                var $5318 = $5349;
                                break;
                        };
                        var $5308 = $5318;
                        break;
                };
                var $5306 = $5308;
                break;
            case 'Maybe.none':
                var $5351 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5352 = _m$bind$3;
                    return $5352;
                }))(Kind$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5354 = self.value;
                            var $5355 = Kind$Synth$one$(_name$1, $5354);
                            var $5353 = $5355;
                            break;
                        case 'Maybe.none':
                            var $5356 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                                var $5357 = _m$pure$5;
                                return $5357;
                            }))(Maybe$none);
                            var $5353 = $5356;
                            break;
                    };
                    return $5353;
                }));
                var $5306 = $5351;
                break;
        };
        return $5306;
    };
    const Kind$Synth$one = x0 => x1 => Kind$Synth$one$(x0, x1);

    function Map$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'Map.tie':
                var $5359 = self.val;
                var $5360 = self.lft;
                var $5361 = self.rgt;
                var self = $5359;
                switch (self._) {
                    case 'Maybe.some':
                        var $5363 = self.value;
                        var $5364 = Maybe$some$(_fn$3($5363));
                        var _val$8 = $5364;
                        break;
                    case 'Maybe.none':
                        var $5365 = Maybe$none;
                        var _val$8 = $5365;
                        break;
                };
                var _lft$9 = Map$map$(_fn$3, $5360);
                var _rgt$10 = Map$map$(_fn$3, $5361);
                var $5362 = Map$tie$(_val$8, _lft$9, _rgt$10);
                var $5358 = $5362;
                break;
            case 'Map.new':
                var $5366 = Map$new;
                var $5358 = $5366;
                break;
        };
        return $5358;
    };
    const Map$map = x0 => x1 => Map$map$(x0, x1);
    const Kind$Term$inline$names = (() => {
        var _inl$1 = List$cons$("Monad.pure", List$cons$("Monad.bind", List$cons$("Monad.new", List$cons$("Parser.monad", List$cons$("Parser.bind", List$cons$("Parser.pure", List$cons$("Kind.Check.pure", List$cons$("Kind.Check.bind", List$cons$("Kind.Check.monad", List$cons$("Kind.Check.value", List$cons$("Kind.Check.none", List$nil)))))))))));
        var _kvs$2 = List$mapped$(_inl$1, (_x$2 => {
            var $5368 = Pair$new$((kind_name_to_bits(_x$2)), Unit$new);
            return $5368;
        }));
        var $5367 = Map$from_list$(_kvs$2);
        return $5367;
    })();

    function Kind$Term$inline$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5370 = self.name;
                var _inli$4 = Set$has$((kind_name_to_bits($5370)), Kind$Term$inline$names);
                var self = _inli$4;
                if (self) {
                    var self = Kind$get$($5370, _defs$2);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5373 = self.value;
                            var self = $5373;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5375 = self.term;
                                    var $5376 = Kind$Term$inline$reduce$($5375, _defs$2);
                                    var $5374 = $5376;
                                    break;
                            };
                            var $5372 = $5374;
                            break;
                        case 'Maybe.none':
                            var $5377 = Kind$Term$ref$($5370);
                            var $5372 = $5377;
                            break;
                    };
                    var $5371 = $5372;
                } else {
                    var $5378 = _term$1;
                    var $5371 = $5378;
                };
                var $5369 = $5371;
                break;
            case 'Kind.Term.app':
                var $5379 = self.func;
                var $5380 = self.argm;
                var _func$5 = Kind$Term$inline$reduce$($5379, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $5382 = self.body;
                        var $5383 = Kind$Term$inline$reduce$($5382($5380), _defs$2);
                        var $5381 = $5383;
                        break;
                    case 'Kind.Term.let':
                        var $5384 = self.name;
                        var $5385 = self.expr;
                        var $5386 = self.body;
                        var $5387 = Kind$Term$let$($5384, $5385, (_x$9 => {
                            var $5388 = Kind$Term$inline$reduce$(Kind$Term$app$($5386(_x$9), $5380), _defs$2);
                            return $5388;
                        }));
                        var $5381 = $5387;
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
                        var $5389 = _term$1;
                        var $5381 = $5389;
                        break;
                };
                var $5369 = $5381;
                break;
            case 'Kind.Term.ori':
                var $5390 = self.expr;
                var $5391 = Kind$Term$inline$reduce$($5390, _defs$2);
                var $5369 = $5391;
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
                var $5392 = _term$1;
                var $5369 = $5392;
                break;
        };
        return $5369;
    };
    const Kind$Term$inline$reduce = x0 => x1 => Kind$Term$inline$reduce$(x0, x1);

    function Kind$Term$inline$(_term$1, _defs$2) {
        var self = Kind$Term$inline$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $5394 = self.name;
                var $5395 = self.indx;
                var $5396 = Kind$Term$var$($5394, $5395);
                var $5393 = $5396;
                break;
            case 'Kind.Term.ref':
                var $5397 = self.name;
                var $5398 = Kind$Term$ref$($5397);
                var $5393 = $5398;
                break;
            case 'Kind.Term.all':
                var $5399 = self.eras;
                var $5400 = self.self;
                var $5401 = self.name;
                var $5402 = self.xtyp;
                var $5403 = self.body;
                var $5404 = Kind$Term$all$($5399, $5400, $5401, Kind$Term$inline$($5402, _defs$2), (_s$8 => _x$9 => {
                    var $5405 = Kind$Term$inline$($5403(_s$8)(_x$9), _defs$2);
                    return $5405;
                }));
                var $5393 = $5404;
                break;
            case 'Kind.Term.lam':
                var $5406 = self.name;
                var $5407 = self.body;
                var $5408 = Kind$Term$lam$($5406, (_x$5 => {
                    var $5409 = Kind$Term$inline$($5407(_x$5), _defs$2);
                    return $5409;
                }));
                var $5393 = $5408;
                break;
            case 'Kind.Term.app':
                var $5410 = self.func;
                var $5411 = self.argm;
                var $5412 = Kind$Term$app$(Kind$Term$inline$($5410, _defs$2), Kind$Term$inline$($5411, _defs$2));
                var $5393 = $5412;
                break;
            case 'Kind.Term.let':
                var $5413 = self.name;
                var $5414 = self.expr;
                var $5415 = self.body;
                var $5416 = Kind$Term$let$($5413, Kind$Term$inline$($5414, _defs$2), (_x$6 => {
                    var $5417 = Kind$Term$inline$($5415(_x$6), _defs$2);
                    return $5417;
                }));
                var $5393 = $5416;
                break;
            case 'Kind.Term.def':
                var $5418 = self.name;
                var $5419 = self.expr;
                var $5420 = self.body;
                var $5421 = Kind$Term$def$($5418, Kind$Term$inline$($5419, _defs$2), (_x$6 => {
                    var $5422 = Kind$Term$inline$($5420(_x$6), _defs$2);
                    return $5422;
                }));
                var $5393 = $5421;
                break;
            case 'Kind.Term.ann':
                var $5423 = self.done;
                var $5424 = self.term;
                var $5425 = self.type;
                var $5426 = Kind$Term$ann$($5423, Kind$Term$inline$($5424, _defs$2), Kind$Term$inline$($5425, _defs$2));
                var $5393 = $5426;
                break;
            case 'Kind.Term.gol':
                var $5427 = self.name;
                var $5428 = self.dref;
                var $5429 = self.verb;
                var $5430 = Kind$Term$gol$($5427, $5428, $5429);
                var $5393 = $5430;
                break;
            case 'Kind.Term.hol':
                var $5431 = self.path;
                var $5432 = Kind$Term$hol$($5431);
                var $5393 = $5432;
                break;
            case 'Kind.Term.nat':
                var $5433 = self.natx;
                var $5434 = Kind$Term$nat$($5433);
                var $5393 = $5434;
                break;
            case 'Kind.Term.chr':
                var $5435 = self.chrx;
                var $5436 = Kind$Term$chr$($5435);
                var $5393 = $5436;
                break;
            case 'Kind.Term.str':
                var $5437 = self.strx;
                var $5438 = Kind$Term$str$($5437);
                var $5393 = $5438;
                break;
            case 'Kind.Term.ori':
                var $5439 = self.expr;
                var $5440 = Kind$Term$inline$($5439, _defs$2);
                var $5393 = $5440;
                break;
            case 'Kind.Term.typ':
                var $5441 = Kind$Term$typ;
                var $5393 = $5441;
                break;
            case 'Kind.Term.cse':
                var $5442 = _term$1;
                var $5393 = $5442;
                break;
        };
        return $5393;
    };
    const Kind$Term$inline = x0 => x1 => Kind$Term$inline$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5444 = self.val;
                var $5445 = self.lft;
                var $5446 = self.rgt;
                var self = $5444;
                switch (self._) {
                    case 'Maybe.some':
                        var $5448 = self.value;
                        var $5449 = List$cons$($5448, _list$3);
                        var _list0$7 = $5449;
                        break;
                    case 'Maybe.none':
                        var $5450 = _list$3;
                        var _list0$7 = $5450;
                        break;
                };
                var _list1$8 = Map$values$go$($5445, _list0$7);
                var _list2$9 = Map$values$go$($5446, _list1$8);
                var $5447 = _list2$9;
                var $5443 = $5447;
                break;
            case 'Map.new':
                var $5451 = _list$3;
                var $5443 = $5451;
                break;
        };
        return $5443;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $5452 = Map$values$go$(_xs$2, List$nil);
        return $5452;
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
                        var $5454 = _name$2;
                        var $5453 = $5454;
                    } else {
                        var $5455 = (self - 1n);
                        var $5456 = (_name$2 + ("^" + Nat$show$(_brui$3)));
                        var $5453 = $5456;
                    };
                    return $5453;
                } else {
                    var $5457 = (self - 1n);
                    var self = _vars$4;
                    switch (self._) {
                        case 'List.cons':
                            var $5459 = self.head;
                            var $5460 = self.tail;
                            var self = (_name$2 === $5459);
                            if (self) {
                                var $5462 = Nat$succ$(_brui$3);
                                var _brui$8 = $5462;
                            } else {
                                var $5463 = _brui$3;
                                var _brui$8 = $5463;
                            };
                            var $5461 = Kind$Core$var_name$($5457, _name$2, _brui$8, $5460);
                            var $5458 = $5461;
                            break;
                        case 'List.nil':
                            var $5464 = "unbound";
                            var $5458 = $5464;
                            break;
                    };
                    return $5458;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Core$var_name = x0 => x1 => x2 => x3 => Kind$Core$var_name$(x0, x1, x2, x3);

    function Kind$Name$show$(_name$1) {
        var $5465 = _name$1;
        return $5465;
    };
    const Kind$Name$show = x0 => Kind$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5467 = self.slice(0, -1);
                var $5468 = (2n * Bits$to_nat$($5467));
                var $5466 = $5468;
                break;
            case 'i':
                var $5469 = self.slice(0, -1);
                var $5470 = Nat$succ$((2n * Bits$to_nat$($5469)));
                var $5466 = $5470;
                break;
            case 'e':
                var $5471 = 0n;
                var $5466 = $5471;
                break;
        };
        return $5466;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $5473 = u16_to_word(self);
                var $5474 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($5473)));
                var $5472 = $5474;
                break;
        };
        return $5472;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Kind$escape$char$(_chr$1) {
        var self = (_chr$1 === Kind$backslash);
        if (self) {
            var $5476 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
            var $5475 = $5476;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $5478 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                var $5477 = $5478;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $5480 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                    var $5479 = $5480;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $5482 = String$cons$(_chr$1, String$nil);
                        var $5481 = $5482;
                    } else {
                        var $5483 = String$flatten$(List$cons$(String$cons$(Kind$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $5481 = $5483;
                    };
                    var $5479 = $5481;
                };
                var $5477 = $5479;
            };
            var $5475 = $5477;
        };
        return $5475;
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
                    var $5484 = String$reverse$(_result$2);
                    return $5484;
                } else {
                    var $5485 = self.charCodeAt(0);
                    var $5486 = self.slice(1);
                    var $5487 = Kind$escape$go$($5486, (String$reverse$(Kind$escape$char$($5485)) + _result$2));
                    return $5487;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$escape$go = x0 => x1 => Kind$escape$go$(x0, x1);

    function Kind$escape$(_str$1) {
        var $5488 = Kind$escape$go$(_str$1, "");
        return $5488;
    };
    const Kind$escape = x0 => Kind$escape$(x0);

    function Kind$Core$show$(_term$1, _indx$2, _vars$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5490 = self.name;
                var $5491 = self.indx;
                var $5492 = Kind$Core$var_name$(Nat$pred$((_indx$2 - $5491 <= 0n ? 0n : _indx$2 - $5491)), $5490, 0n, _vars$3);
                var $5489 = $5492;
                break;
            case 'Kind.Term.ref':
                var $5493 = self.name;
                var $5494 = Kind$Name$show$($5493);
                var $5489 = $5494;
                break;
            case 'Kind.Term.all':
                var $5495 = self.eras;
                var $5496 = self.self;
                var $5497 = self.name;
                var $5498 = self.xtyp;
                var $5499 = self.body;
                var _eras$9 = $5495;
                var self = _eras$9;
                if (self) {
                    var $5501 = "%";
                    var _init$10 = $5501;
                } else {
                    var $5502 = "@";
                    var _init$10 = $5502;
                };
                var _self$11 = Kind$Name$show$($5496);
                var _name$12 = Kind$Name$show$($5497);
                var _xtyp$13 = Kind$Core$show$($5498, _indx$2, _vars$3);
                var _body$14 = Kind$Core$show$($5499(Kind$Term$var$($5496, _indx$2))(Kind$Term$var$($5497, Nat$succ$(_indx$2))), Nat$succ$(Nat$succ$(_indx$2)), List$cons$($5497, List$cons$($5496, _vars$3)));
                var $5500 = String$flatten$(List$cons$(_init$10, List$cons$(_self$11, List$cons$("(", List$cons$(_name$12, List$cons$(":", List$cons$(_xtyp$13, List$cons$(") ", List$cons$(_body$14, List$nil)))))))));
                var $5489 = $5500;
                break;
            case 'Kind.Term.lam':
                var $5503 = self.name;
                var $5504 = self.body;
                var _name$6 = Kind$Name$show$($5503);
                var _body$7 = Kind$Core$show$($5504(Kind$Term$var$($5503, _indx$2)), Nat$succ$(_indx$2), List$cons$($5503, _vars$3));
                var $5505 = String$flatten$(List$cons$("#", List$cons$(_name$6, List$cons$(" ", List$cons$(_body$7, List$nil)))));
                var $5489 = $5505;
                break;
            case 'Kind.Term.app':
                var $5506 = self.func;
                var $5507 = self.argm;
                var _func$6 = Kind$Core$show$($5506, _indx$2, _vars$3);
                var _argm$7 = Kind$Core$show$($5507, _indx$2, _vars$3);
                var $5508 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(" ", List$cons$(_argm$7, List$cons$(")", List$nil))))));
                var $5489 = $5508;
                break;
            case 'Kind.Term.let':
                var $5509 = self.name;
                var $5510 = self.expr;
                var $5511 = self.body;
                var _name$7 = Kind$Name$show$($5509);
                var _expr$8 = Kind$Core$show$($5510, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5511(Kind$Term$var$($5509, _indx$2)), Nat$succ$(_indx$2), List$cons$($5509, _vars$3));
                var $5512 = String$flatten$(List$cons$("!", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5489 = $5512;
                break;
            case 'Kind.Term.def':
                var $5513 = self.name;
                var $5514 = self.expr;
                var $5515 = self.body;
                var _name$7 = Kind$Name$show$($5513);
                var _expr$8 = Kind$Core$show$($5514, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5515(Kind$Term$var$($5513, _indx$2)), Nat$succ$(_indx$2), List$cons$($5513, _vars$3));
                var $5516 = String$flatten$(List$cons$("$", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5489 = $5516;
                break;
            case 'Kind.Term.ann':
                var $5517 = self.term;
                var $5518 = self.type;
                var _term$7 = Kind$Core$show$($5517, _indx$2, _vars$3);
                var _type$8 = Kind$Core$show$($5518, _indx$2, _vars$3);
                var $5519 = String$flatten$(List$cons$("{", List$cons$(_term$7, List$cons$(":", List$cons$(_type$8, List$cons$("}", List$nil))))));
                var $5489 = $5519;
                break;
            case 'Kind.Term.nat':
                var $5520 = self.natx;
                var $5521 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($5520), List$nil)));
                var $5489 = $5521;
                break;
            case 'Kind.Term.chr':
                var $5522 = self.chrx;
                var $5523 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5522), List$cons$("\'", List$nil))));
                var $5489 = $5523;
                break;
            case 'Kind.Term.str':
                var $5524 = self.strx;
                var $5525 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5524), List$cons$("\"", List$nil))));
                var $5489 = $5525;
                break;
            case 'Kind.Term.ori':
                var $5526 = self.expr;
                var $5527 = Kind$Core$show$($5526, _indx$2, _vars$3);
                var $5489 = $5527;
                break;
            case 'Kind.Term.typ':
                var $5528 = "*";
                var $5489 = $5528;
                break;
            case 'Kind.Term.gol':
                var $5529 = "<GOL>";
                var $5489 = $5529;
                break;
            case 'Kind.Term.hol':
                var $5530 = "<HOL>";
                var $5489 = $5530;
                break;
            case 'Kind.Term.cse':
                var $5531 = "<CSE>";
                var $5489 = $5531;
                break;
        };
        return $5489;
    };
    const Kind$Core$show = x0 => x1 => x2 => Kind$Core$show$(x0, x1, x2);

    function Kind$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $5534 = _result$2;
            var $5535 = Map$values$(_defs$1);
            let _result$4 = $5534;
            let _defn$3;
            while ($5535._ === 'List.cons') {
                _defn$3 = $5535.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5536 = self.name;
                        var $5537 = self.term;
                        var $5538 = self.type;
                        var $5539 = self.stat;
                        var self = $5539;
                        switch (self._) {
                            case 'Kind.Status.init':
                            case 'Kind.Status.wait':
                            case 'Kind.Status.fail':
                                var $5541 = _result$4;
                                var $5540 = $5541;
                                break;
                            case 'Kind.Status.done':
                                var _name$14 = $5536;
                                var _term$15 = Kind$Core$show$($5537, 0n, List$nil);
                                var _type$16 = Kind$Core$show$($5538, 0n, List$nil);
                                var $5542 = String$flatten$(List$cons$(_result$4, List$cons$(_name$14, List$cons$(" : ", List$cons$(_type$16, List$cons$(" = ", List$cons$(_term$15, List$cons$(";\u{a}", List$nil))))))));
                                var $5540 = $5542;
                                break;
                        };
                        var $5534 = $5540;
                        break;
                };
                _result$4 = $5534;
                $5535 = $5535.tail;
            }
            return _result$4;
        })();
        var $5532 = _result$3;
        return $5532;
    };
    const Kind$Defs$core = x0 => Kind$Defs$core$(x0);

    function Kind$to_core$io$one$(_name$1) {
        var $5543 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5544 = _m$bind$2;
            return $5544;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5546 = self.value;
                    var $5547 = $5546;
                    var _defs$3 = $5547;
                    break;
                case 'Maybe.none':
                    var $5548 = Map$new;
                    var _defs$3 = $5548;
                    break;
            };
            var _defs$4 = Map$map$((_defn$4 => {
                var self = _defn$4;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5550 = self.file;
                        var $5551 = self.code;
                        var $5552 = self.orig;
                        var $5553 = self.name;
                        var $5554 = self.term;
                        var $5555 = self.type;
                        var $5556 = self.isct;
                        var $5557 = self.arit;
                        var $5558 = self.stat;
                        var _term$14 = Kind$Term$inline$($5554, _defs$3);
                        var _type$15 = Kind$Term$inline$($5555, _defs$3);
                        var $5559 = Kind$Def$new$($5550, $5551, $5552, $5553, _term$14, _type$15, $5556, $5557, $5558);
                        var $5549 = $5559;
                        break;
                };
                return $5549;
            }), _defs$3);
            var $5545 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                var $5560 = _m$pure$6;
                return $5560;
            }))(Kind$Defs$core$(_defs$4));
            return $5545;
        }));
        return $5543;
    };
    const Kind$to_core$io$one = x0 => Kind$to_core$io$one$(x0);

    function IO$put_string$(_text$1) {
        var $5561 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $5562 = IO$end$(Unit$new);
            return $5562;
        }));
        return $5561;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $5563 = IO$put_string$((_text$1 + "\u{a}"));
        return $5563;
    };
    const IO$print = x0 => IO$print$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $5565 = self.value;
                var $5566 = _f$4($5565);
                var $5564 = $5566;
                break;
            case 'Maybe.none':
                var $5567 = Maybe$none;
                var $5564 = $5567;
                break;
        };
        return $5564;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $5568 = _new$2(Maybe$bind)(Maybe$some);
        return $5568;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Kind$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5570 = self.name;
                var self = ($5570 === "Nat.zero");
                if (self) {
                    var $5572 = Maybe$some$(0n);
                    var $5571 = $5572;
                } else {
                    var $5573 = Maybe$none;
                    var $5571 = $5573;
                };
                var $5569 = $5571;
                break;
            case 'Kind.Term.app':
                var $5574 = self.func;
                var $5575 = self.argm;
                var self = $5574;
                switch (self._) {
                    case 'Kind.Term.ref':
                        var $5577 = self.name;
                        var self = ($5577 === "Nat.succ");
                        if (self) {
                            var $5579 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $5580 = _m$bind$5;
                                return $5580;
                            }))(Kind$Term$show$as_nat$go$($5575))((_pred$5 => {
                                var $5581 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $5582 = _m$pure$7;
                                    return $5582;
                                }))(Nat$succ$(_pred$5));
                                return $5581;
                            }));
                            var $5578 = $5579;
                        } else {
                            var $5583 = Maybe$none;
                            var $5578 = $5583;
                        };
                        var $5576 = $5578;
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
                        var $5584 = Maybe$none;
                        var $5576 = $5584;
                        break;
                };
                var $5569 = $5576;
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
                var $5585 = Maybe$none;
                var $5569 = $5585;
                break;
        };
        return $5569;
    };
    const Kind$Term$show$as_nat$go = x0 => Kind$Term$show$as_nat$go$(x0);

    function Kind$Term$show$as_nat$(_term$1) {
        var $5586 = Maybe$mapped$(Kind$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5586;
    };
    const Kind$Term$show$as_nat = x0 => Kind$Term$show$as_nat$(x0);

    function Kind$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5588 = self.name;
                var $5589 = (_name$2 === $5588);
                var $5587 = $5589;
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
                var $5590 = Bool$false;
                var $5587 = $5590;
                break;
        };
        return $5587;
    };
    const Kind$Term$show$is_ref = x0 => x1 => Kind$Term$show$is_ref$(x0, x1);

    function Kind$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Kind$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $5592 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $5591 = $5592;
        } else {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $5594 = Bool$false;
                var _wrap$6 = $5594;
            } else {
                var $5595 = self.charCodeAt(0);
                var $5596 = self.slice(1);
                var $5597 = ($5595 === 40);
                var _wrap$6 = $5597;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $5598 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $5598;
            } else {
                var $5599 = _func$5;
                var _func$8 = $5599;
            };
            var $5593 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $5591 = $5593;
        };
        return $5591;
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
                        var $5600 = self.func;
                        var $5601 = self.argm;
                        var $5602 = Kind$Term$show$app$($5600, Kind$MPath$o$(_path$2), List$cons$(Kind$Term$show$go$($5601, Kind$MPath$i$(_path$2)), _args$3));
                        return $5602;
                    case 'Kind.Term.ori':
                        var $5603 = self.expr;
                        var $5604 = Kind$Term$show$app$($5603, _path$2, _args$3);
                        return $5604;
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
                        var $5605 = Kind$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $5605;
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
                var $5607 = self.val;
                var $5608 = self.lft;
                var $5609 = self.rgt;
                var self = $5607;
                switch (self._) {
                    case 'Maybe.some':
                        var $5611 = self.value;
                        var $5612 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5611), _list$4);
                        var _list0$8 = $5612;
                        break;
                    case 'Maybe.none':
                        var $5613 = _list$4;
                        var _list0$8 = $5613;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5608, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5609, (_key$3 + '1'), _list1$9);
                var $5610 = _list2$10;
                var $5606 = $5610;
                break;
            case 'Map.new':
                var $5614 = _list$4;
                var $5606 = $5614;
                break;
        };
        return $5606;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5615 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5615;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5617 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5619 = List$cons$(_head$6, _tail$7);
                    var $5618 = $5619;
                } else {
                    var $5620 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5621 = Bits$chunks_of$go$(_len$1, $5617, $5620, _chunk$7);
                    var $5618 = $5621;
                };
                var $5616 = $5618;
                break;
            case 'i':
                var $5622 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5624 = List$cons$(_head$6, _tail$7);
                    var $5623 = $5624;
                } else {
                    var $5625 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5626 = Bits$chunks_of$go$(_len$1, $5622, $5625, _chunk$7);
                    var $5623 = $5626;
                };
                var $5616 = $5623;
                break;
            case 'e':
                var $5627 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5616 = $5627;
                break;
        };
        return $5616;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5628 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5628;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5630 = Word$e;
            var $5629 = $5630;
        } else {
            var $5631 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $5633 = self.slice(0, -1);
                    var $5634 = Word$o$(Word$from_bits$($5631, $5633));
                    var $5632 = $5634;
                    break;
                case 'i':
                    var $5635 = self.slice(0, -1);
                    var $5636 = Word$i$(Word$from_bits$($5631, $5635));
                    var $5632 = $5636;
                    break;
                case 'e':
                    var $5637 = Word$o$(Word$from_bits$($5631, Bits$e));
                    var $5632 = $5637;
                    break;
            };
            var $5629 = $5632;
        };
        return $5629;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Kind$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5640 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5640;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5642 = ((_u16$5 + 71) & 0xFFFF);
                    var $5641 = $5642;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5644 = (Math.max(_u16$5 - 4, 0));
                        var $5643 = $5644;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5646 = 46;
                            var $5645 = $5646;
                        } else {
                            var $5647 = 95;
                            var $5645 = $5647;
                        };
                        var $5643 = $5645;
                    };
                    var $5641 = $5643;
                };
                var _chr$6 = $5641;
            };
            var $5639 = String$cons$(_chr$6, _name$4);
            return $5639;
        }));
        var $5638 = _name$3;
        return $5638;
    };
    const Kind$Name$from_bits = x0 => Kind$Name$from_bits$(x0);

    function Kind$Term$show$go$(_term$1, _path$2) {
        var self = Kind$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.some':
                var $5649 = self.value;
                var $5650 = $5649;
                var $5648 = $5650;
                break;
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $5652 = self.name;
                        var $5653 = Kind$Name$show$($5652);
                        var $5651 = $5653;
                        break;
                    case 'Kind.Term.ref':
                        var $5654 = self.name;
                        var _name$4 = Kind$Name$show$($5654);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5656 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Kind$Path$to_bits$($5656));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5657 = String$flatten$(List$cons$(_name$4, List$cons$(Kind$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5655 = $5657;
                                break;
                            case 'Maybe.none':
                                var $5658 = _name$4;
                                var $5655 = $5658;
                                break;
                        };
                        var $5651 = $5655;
                        break;
                    case 'Kind.Term.all':
                        var $5659 = self.eras;
                        var $5660 = self.self;
                        var $5661 = self.name;
                        var $5662 = self.xtyp;
                        var $5663 = self.body;
                        var _eras$8 = $5659;
                        var _self$9 = Kind$Name$show$($5660);
                        var _name$10 = Kind$Name$show$($5661);
                        var _type$11 = Kind$Term$show$go$($5662, Kind$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5665 = "<";
                            var _open$12 = $5665;
                        } else {
                            var $5666 = "(";
                            var _open$12 = $5666;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5667 = ">";
                            var _clos$13 = $5667;
                        } else {
                            var $5668 = ")";
                            var _clos$13 = $5668;
                        };
                        var _body$14 = Kind$Term$show$go$($5663(Kind$Term$var$($5660, 0n))(Kind$Term$var$($5661, 0n)), Kind$MPath$i$(_path$2));
                        var $5664 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5651 = $5664;
                        break;
                    case 'Kind.Term.lam':
                        var $5669 = self.name;
                        var $5670 = self.body;
                        var _name$5 = Kind$Name$show$($5669);
                        var _body$6 = Kind$Term$show$go$($5670(Kind$Term$var$($5669, 0n)), Kind$MPath$o$(_path$2));
                        var $5671 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5651 = $5671;
                        break;
                    case 'Kind.Term.let':
                        var $5672 = self.name;
                        var $5673 = self.expr;
                        var $5674 = self.body;
                        var _name$6 = Kind$Name$show$($5672);
                        var _expr$7 = Kind$Term$show$go$($5673, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5674(Kind$Term$var$($5672, 0n)), Kind$MPath$i$(_path$2));
                        var $5675 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5651 = $5675;
                        break;
                    case 'Kind.Term.def':
                        var $5676 = self.name;
                        var $5677 = self.expr;
                        var $5678 = self.body;
                        var _name$6 = Kind$Name$show$($5676);
                        var _expr$7 = Kind$Term$show$go$($5677, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5678(Kind$Term$var$($5676, 0n)), Kind$MPath$i$(_path$2));
                        var $5679 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5651 = $5679;
                        break;
                    case 'Kind.Term.ann':
                        var $5680 = self.term;
                        var $5681 = self.type;
                        var _term$6 = Kind$Term$show$go$($5680, Kind$MPath$o$(_path$2));
                        var _type$7 = Kind$Term$show$go$($5681, Kind$MPath$i$(_path$2));
                        var $5682 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5651 = $5682;
                        break;
                    case 'Kind.Term.gol':
                        var $5683 = self.name;
                        var _name$6 = Kind$Name$show$($5683);
                        var $5684 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5651 = $5684;
                        break;
                    case 'Kind.Term.nat':
                        var $5685 = self.natx;
                        var $5686 = String$flatten$(List$cons$(Nat$show$($5685), List$nil));
                        var $5651 = $5686;
                        break;
                    case 'Kind.Term.chr':
                        var $5687 = self.chrx;
                        var $5688 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5687), List$cons$("\'", List$nil))));
                        var $5651 = $5688;
                        break;
                    case 'Kind.Term.str':
                        var $5689 = self.strx;
                        var $5690 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5689), List$cons$("\"", List$nil))));
                        var $5651 = $5690;
                        break;
                    case 'Kind.Term.cse':
                        var $5691 = self.expr;
                        var $5692 = self.name;
                        var $5693 = self.with;
                        var $5694 = self.cses;
                        var $5695 = self.moti;
                        var _expr$9 = Kind$Term$show$go$($5691, Kind$MPath$o$(_path$2));
                        var _name$10 = Kind$Name$show$($5692);
                        var _wyth$11 = String$join$("", List$mapped$($5693, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5698 = self.name;
                                    var $5699 = self.term;
                                    var $5700 = self.type;
                                    var _name$21 = Kind$Name$show$($5698);
                                    var _type$22 = Kind$Term$show$go$($5700, Maybe$none);
                                    var _term$23 = Kind$Term$show$go$($5699, Maybe$none);
                                    var $5701 = String$flatten$(List$cons$(_name$21, List$cons$(": ", List$cons$(_type$22, List$cons$(" = ", List$cons$(_term$23, List$cons$(";", List$nil)))))));
                                    var $5697 = $5701;
                                    break;
                            };
                            return $5697;
                        })));
                        var _cses$12 = Map$to_list$($5694);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Kind$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Kind$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5702 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5702;
                        })));
                        var self = $5695;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5703 = self.value;
                                var $5704 = String$flatten$(List$cons$(": ", List$cons$(Kind$Term$show$go$($5703, Maybe$none), List$nil)));
                                var _moti$14 = $5704;
                                break;
                            case 'Maybe.none':
                                var $5705 = "";
                                var _moti$14 = $5705;
                                break;
                        };
                        var $5696 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5651 = $5696;
                        break;
                    case 'Kind.Term.ori':
                        var $5706 = self.expr;
                        var $5707 = Kind$Term$show$go$($5706, _path$2);
                        var $5651 = $5707;
                        break;
                    case 'Kind.Term.typ':
                        var $5708 = "Type";
                        var $5651 = $5708;
                        break;
                    case 'Kind.Term.app':
                        var $5709 = Kind$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5651 = $5709;
                        break;
                    case 'Kind.Term.hol':
                        var $5710 = "_";
                        var $5651 = $5710;
                        break;
                };
                var $5648 = $5651;
                break;
        };
        return $5648;
    };
    const Kind$Term$show$go = x0 => x1 => Kind$Term$show$go$(x0, x1);

    function Kind$Term$show$(_term$1) {
        var $5711 = Kind$Term$show$go$(_term$1, Maybe$none);
        return $5711;
    };
    const Kind$Term$show = x0 => Kind$Term$show$(x0);

    function Kind$Defs$report$types$(_defs$1, _names$2) {
        var _types$3 = "";
        var _types$4 = (() => {
            var $5714 = _types$3;
            var $5715 = _names$2;
            let _types$5 = $5714;
            let _name$4;
            while ($5715._ === 'List.cons') {
                _name$4 = $5715.head;
                var self = Kind$get$(_name$4, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5716 = self.value;
                        var self = $5716;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5718 = self.type;
                                var $5719 = (_types$5 + (_name$4 + (": " + (Kind$Term$show$($5718) + "\u{a}"))));
                                var $5717 = $5719;
                                break;
                        };
                        var $5714 = $5717;
                        break;
                    case 'Maybe.none':
                        var $5720 = _types$5;
                        var $5714 = $5720;
                        break;
                };
                _types$5 = $5714;
                $5715 = $5715.tail;
            }
            return _types$5;
        })();
        var $5712 = _types$4;
        return $5712;
    };
    const Kind$Defs$report$types = x0 => x1 => Kind$Defs$report$types$(x0, x1);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5722 = self.val;
                var $5723 = self.lft;
                var $5724 = self.rgt;
                var self = $5722;
                switch (self._) {
                    case 'Maybe.none':
                        var $5726 = _list$4;
                        var _list0$8 = $5726;
                        break;
                    case 'Maybe.some':
                        var $5727 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5727;
                        break;
                };
                var _list1$9 = Map$keys$go$($5723, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5724, (_key$3 + '1'), _list1$9);
                var $5725 = _list2$10;
                var $5721 = $5725;
                break;
            case 'Map.new':
                var $5728 = _list$4;
                var $5721 = $5728;
                break;
        };
        return $5721;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5729 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5729;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Kind$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.cons':
                var $5731 = self.head;
                var $5732 = self.tail;
                var self = $5731;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                    case 'Kind.Error.cant_infer':
                        var $5734 = (!_got$2);
                        var _keep$5 = $5734;
                        break;
                    case 'Kind.Error.show_goal':
                        var $5735 = Bool$true;
                        var _keep$5 = $5735;
                        break;
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                        var $5736 = Bool$false;
                        var _keep$5 = $5736;
                        break;
                };
                var self = $5731;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                        var $5737 = Bool$true;
                        var _got$6 = $5737;
                        break;
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                    case 'Kind.Error.cant_infer':
                        var $5738 = _got$2;
                        var _got$6 = $5738;
                        break;
                };
                var _tail$7 = Kind$Error$relevant$($5732, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5739 = List$cons$($5731, _tail$7);
                    var $5733 = $5739;
                } else {
                    var $5740 = _tail$7;
                    var $5733 = $5740;
                };
                var $5730 = $5733;
                break;
            case 'List.nil':
                var $5741 = List$nil;
                var $5730 = $5741;
                break;
        };
        return $5730;
    };
    const Kind$Error$relevant = x0 => x1 => Kind$Error$relevant$(x0, x1);

    function Kind$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.cons':
                var $5743 = self.head;
                var $5744 = self.tail;
                var self = $5743;
                switch (self._) {
                    case 'Pair.new':
                        var $5746 = self.fst;
                        var $5747 = self.snd;
                        var _name$6 = Kind$Name$show$($5746);
                        var _type$7 = Kind$Term$show$(Kind$Term$normalize$($5747, Map$new));
                        var _rest$8 = Kind$Context$show$($5744);
                        var $5748 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5745 = $5748;
                        break;
                };
                var $5742 = $5745;
                break;
            case 'List.nil':
                var $5749 = "";
                var $5742 = $5749;
                break;
        };
        return $5742;
    };
    const Kind$Context$show = x0 => Kind$Context$show$(x0);

    function Kind$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5750 = Kind$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Kind.Term.ref':
                    var $5752 = self.name;
                    var self = Kind$get$($5752, _defs$3);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5754 = self.value;
                            var self = $5754;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5756 = self.term;
                                    var $5757 = $5756;
                                    var $5755 = $5757;
                                    break;
                            };
                            var $5753 = $5755;
                            break;
                        case 'Maybe.none':
                            var $5758 = Kind$Term$ref$($5752);
                            var $5753 = $5758;
                            break;
                    };
                    var $5751 = $5753;
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
                    var $5759 = _term$4;
                    var $5751 = $5759;
                    break;
            };
            return $5751;
        }));
        return $5750;
    };
    const Kind$Term$expand_at = x0 => x1 => x2 => Kind$Term$expand_at$(x0, x1, x2);

    function Kind$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5761 = self.name;
                var $5762 = self.indx;
                var $5763 = Kind$Term$var$($5761, $5762);
                var $5760 = $5763;
                break;
            case 'Kind.Term.ref':
                var $5764 = self.name;
                var self = Kind$get$($5764, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $5766 = self.value;
                        var self = $5766;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5768 = self.term;
                                var $5769 = self.isct;
                                var $5770 = self.arit;
                                var self = ($5769 && (_arity$3 > $5770));
                                if (self) {
                                    var $5772 = $5768;
                                    var $5771 = $5772;
                                } else {
                                    var $5773 = Kind$Term$ref$($5764);
                                    var $5771 = $5773;
                                };
                                var $5767 = $5771;
                                break;
                        };
                        var $5765 = $5767;
                        break;
                    case 'Maybe.none':
                        var $5774 = Kind$Term$ref$($5764);
                        var $5765 = $5774;
                        break;
                };
                var $5760 = $5765;
                break;
            case 'Kind.Term.all':
                var $5775 = self.eras;
                var $5776 = self.self;
                var $5777 = self.name;
                var $5778 = self.xtyp;
                var $5779 = self.body;
                var $5780 = Kind$Term$all$($5775, $5776, $5777, Kind$Term$expand_ct$($5778, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5781 = Kind$Term$expand_ct$($5779(_s$9)(_x$10), _defs$2, 0n);
                    return $5781;
                }));
                var $5760 = $5780;
                break;
            case 'Kind.Term.lam':
                var $5782 = self.name;
                var $5783 = self.body;
                var $5784 = Kind$Term$lam$($5782, (_x$6 => {
                    var $5785 = Kind$Term$expand_ct$($5783(_x$6), _defs$2, 0n);
                    return $5785;
                }));
                var $5760 = $5784;
                break;
            case 'Kind.Term.app':
                var $5786 = self.func;
                var $5787 = self.argm;
                var $5788 = Kind$Term$app$(Kind$Term$expand_ct$($5786, _defs$2, Nat$succ$(_arity$3)), Kind$Term$expand_ct$($5787, _defs$2, 0n));
                var $5760 = $5788;
                break;
            case 'Kind.Term.let':
                var $5789 = self.name;
                var $5790 = self.expr;
                var $5791 = self.body;
                var $5792 = Kind$Term$let$($5789, Kind$Term$expand_ct$($5790, _defs$2, 0n), (_x$7 => {
                    var $5793 = Kind$Term$expand_ct$($5791(_x$7), _defs$2, 0n);
                    return $5793;
                }));
                var $5760 = $5792;
                break;
            case 'Kind.Term.def':
                var $5794 = self.name;
                var $5795 = self.expr;
                var $5796 = self.body;
                var $5797 = Kind$Term$def$($5794, Kind$Term$expand_ct$($5795, _defs$2, 0n), (_x$7 => {
                    var $5798 = Kind$Term$expand_ct$($5796(_x$7), _defs$2, 0n);
                    return $5798;
                }));
                var $5760 = $5797;
                break;
            case 'Kind.Term.ann':
                var $5799 = self.done;
                var $5800 = self.term;
                var $5801 = self.type;
                var $5802 = Kind$Term$ann$($5799, Kind$Term$expand_ct$($5800, _defs$2, 0n), Kind$Term$expand_ct$($5801, _defs$2, 0n));
                var $5760 = $5802;
                break;
            case 'Kind.Term.gol':
                var $5803 = self.name;
                var $5804 = self.dref;
                var $5805 = self.verb;
                var $5806 = Kind$Term$gol$($5803, $5804, $5805);
                var $5760 = $5806;
                break;
            case 'Kind.Term.hol':
                var $5807 = self.path;
                var $5808 = Kind$Term$hol$($5807);
                var $5760 = $5808;
                break;
            case 'Kind.Term.nat':
                var $5809 = self.natx;
                var $5810 = Kind$Term$nat$($5809);
                var $5760 = $5810;
                break;
            case 'Kind.Term.chr':
                var $5811 = self.chrx;
                var $5812 = Kind$Term$chr$($5811);
                var $5760 = $5812;
                break;
            case 'Kind.Term.str':
                var $5813 = self.strx;
                var $5814 = Kind$Term$str$($5813);
                var $5760 = $5814;
                break;
            case 'Kind.Term.ori':
                var $5815 = self.orig;
                var $5816 = self.expr;
                var $5817 = Kind$Term$ori$($5815, $5816);
                var $5760 = $5817;
                break;
            case 'Kind.Term.typ':
                var $5818 = Kind$Term$typ;
                var $5760 = $5818;
                break;
            case 'Kind.Term.cse':
                var $5819 = _term$1;
                var $5760 = $5819;
                break;
        };
        return $5760;
    };
    const Kind$Term$expand_ct = x0 => x1 => x2 => Kind$Term$expand_ct$(x0, x1, x2);

    function Kind$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Kind$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5822 = _term$4;
            var $5823 = _dref$1;
            let _term$6 = $5822;
            let _path$5;
            while ($5823._ === 'List.cons') {
                _path$5 = $5823.head;
                var _term$7 = Kind$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Kind$Term$normalize$(_term$7, Map$new);
                var _term$9 = Kind$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Kind$Term$normalize$(_term$9, Map$new);
                var $5822 = _term$10;
                _term$6 = $5822;
                $5823 = $5823.tail;
            }
            return _term$6;
        })();
        var $5820 = _term$5;
        return $5820;
    };
    const Kind$Term$expand = x0 => x1 => x2 => Kind$Term$expand$(x0, x1, x2);

    function Kind$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5825 = self.expected;
                var $5826 = self.detected;
                var $5827 = self.context;
                var self = $5825;
                switch (self._) {
                    case 'Either.left':
                        var $5829 = self.value;
                        var $5830 = $5829;
                        var _expected$7 = $5830;
                        break;
                    case 'Either.right':
                        var $5831 = self.value;
                        var $5832 = Kind$Term$show$(Kind$Term$normalize$($5831, Map$new));
                        var _expected$7 = $5832;
                        break;
                };
                var self = $5826;
                switch (self._) {
                    case 'Either.left':
                        var $5833 = self.value;
                        var $5834 = $5833;
                        var _detected$8 = $5834;
                        break;
                    case 'Either.right':
                        var $5835 = self.value;
                        var $5836 = Kind$Term$show$(Kind$Term$normalize$($5835, Map$new));
                        var _detected$8 = $5836;
                        break;
                };
                var $5828 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5827;
                    switch (self._) {
                        case 'List.nil':
                            var $5837 = "";
                            return $5837;
                        case 'List.cons':
                            var $5838 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Kind$Context$show$($5827), List$nil)));
                            return $5838;
                    };
                })(), List$nil)))))))));
                var $5824 = $5828;
                break;
            case 'Kind.Error.show_goal':
                var $5839 = self.name;
                var $5840 = self.dref;
                var $5841 = self.verb;
                var $5842 = self.goal;
                var $5843 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Kind$Name$show$($5839), List$cons$(":\u{a}", List$nil))));
                var self = $5842;
                switch (self._) {
                    case 'Maybe.some':
                        var $5845 = self.value;
                        var _goal$10 = Kind$Term$expand$($5840, $5845, _defs$2);
                        var $5846 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5841;
                            if (self) {
                                var $5847 = Kind$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5848 = _x$11;
                                    return $5848;
                                })));
                                return $5847;
                            } else {
                                var $5849 = Kind$Term$show$(_goal$10);
                                return $5849;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5846;
                        break;
                    case 'Maybe.none':
                        var $5850 = "";
                        var _with_type$9 = $5850;
                        break;
                };
                var self = $5843;
                switch (self._) {
                    case 'List.nil':
                        var $5851 = "";
                        var _with_ctxt$10 = $5851;
                        break;
                    case 'List.cons':
                        var $5852 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Kind$Context$show$($5843), List$nil)));
                        var _with_ctxt$10 = $5852;
                        break;
                };
                var $5844 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5824 = $5844;
                break;
            case 'Kind.Error.waiting':
                var $5853 = self.name;
                var $5854 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5853, List$cons$("\'.", List$nil))));
                var $5824 = $5854;
                break;
            case 'Kind.Error.indirect':
                var $5855 = self.name;
                var $5856 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5855, List$cons$("\'.", List$nil))));
                var $5824 = $5856;
                break;
            case 'Kind.Error.patch':
                var $5857 = self.term;
                var $5858 = String$flatten$(List$cons$("Patching: ", List$cons$(Kind$Term$show$($5857), List$nil)));
                var $5824 = $5858;
                break;
            case 'Kind.Error.undefined_reference':
                var $5859 = self.name;
                var $5860 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Kind$Name$show$($5859), List$cons$("\u{a}", List$nil))));
                var $5824 = $5860;
                break;
            case 'Kind.Error.cant_infer':
                var $5861 = self.term;
                var $5862 = self.context;
                var _term$6 = Kind$Term$show$($5861);
                var _context$7 = Kind$Context$show$($5862);
                var $5863 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5824 = $5863;
                break;
        };
        return $5824;
    };
    const Kind$Error$show = x0 => x1 => Kind$Error$show$(x0, x1);

    function Kind$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5865 = self.origin;
                var $5866 = $5865;
                var $5864 = $5866;
                break;
            case 'Kind.Error.undefined_reference':
                var $5867 = self.origin;
                var $5868 = $5867;
                var $5864 = $5868;
                break;
            case 'Kind.Error.cant_infer':
                var $5869 = self.origin;
                var $5870 = $5869;
                var $5864 = $5870;
                break;
            case 'Kind.Error.show_goal':
            case 'Kind.Error.waiting':
            case 'Kind.Error.indirect':
            case 'Kind.Error.patch':
                var $5871 = Maybe$none;
                var $5864 = $5871;
                break;
        };
        return $5864;
    };
    const Kind$Error$origin = x0 => Kind$Error$origin$(x0);

    function Kind$Defs$report$errors$(_defs$1) {
        var _errors$2 = "";
        var _errors$3 = (() => {
            var $5874 = _errors$2;
            var $5875 = Map$keys$(_defs$1);
            let _errors$4 = $5874;
            let _key$3;
            while ($5875._ === 'List.cons') {
                _key$3 = $5875.head;
                var _name$5 = Kind$Name$from_bits$(_key$3);
                var self = Kind$get$(_name$5, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5876 = self.value;
                        var self = $5876;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5878 = self.file;
                                var $5879 = self.code;
                                var $5880 = self.name;
                                var $5881 = self.stat;
                                var self = $5881;
                                switch (self._) {
                                    case 'Kind.Status.fail':
                                        var $5883 = self.errors;
                                        var self = $5883;
                                        switch (self._) {
                                            case 'List.nil':
                                                var $5885 = _errors$4;
                                                var $5884 = $5885;
                                                break;
                                            case 'List.cons':
                                                var _name_str$19 = $5880;
                                                var _rel_errs$20 = Kind$Error$relevant$($5883, Bool$false);
                                                var _errors$21 = (() => {
                                                    var $5888 = _errors$4;
                                                    var $5889 = _rel_errs$20;
                                                    let _errors$22 = $5888;
                                                    let _err$21;
                                                    while ($5889._ === 'List.cons') {
                                                        _err$21 = $5889.head;
                                                        var _err_msg$23 = Kind$Error$show$(_err$21, _defs$1);
                                                        var self = Kind$Error$origin$(_err$21);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $5890 = self.value;
                                                                var self = $5890;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $5892 = self.fst;
                                                                        var $5893 = self.snd;
                                                                        var _inside$27 = ("Inside \'" + ($5878 + "\':\u{a}"));
                                                                        var _source$28 = Kind$highlight$($5879, $5892, $5893);
                                                                        var $5894 = (_inside$27 + (_source$28 + "\u{a}"));
                                                                        var $5891 = $5894;
                                                                        break;
                                                                };
                                                                var _ori_msg$24 = $5891;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $5895 = "";
                                                                var _ori_msg$24 = $5895;
                                                                break;
                                                        };
                                                        var $5888 = (_errors$22 + (_err_msg$23 + (_ori_msg$24 + "\u{a}")));
                                                        _errors$22 = $5888;
                                                        $5889 = $5889.tail;
                                                    }
                                                    return _errors$22;
                                                })();
                                                var $5886 = _errors$21;
                                                var $5884 = $5886;
                                                break;
                                        };
                                        var $5882 = $5884;
                                        break;
                                    case 'Kind.Status.init':
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $5896 = _errors$4;
                                        var $5882 = $5896;
                                        break;
                                };
                                var $5877 = $5882;
                                break;
                        };
                        var $5874 = $5877;
                        break;
                    case 'Maybe.none':
                        var $5897 = _errors$4;
                        var $5874 = $5897;
                        break;
                };
                _errors$4 = $5874;
                $5875 = $5875.tail;
            }
            return _errors$4;
        })();
        var $5872 = _errors$3;
        return $5872;
    };
    const Kind$Defs$report$errors = x0 => Kind$Defs$report$errors$(x0);

    function Kind$Defs$report$(_defs$1, _names$2) {
        var _types$3 = Kind$Defs$report$types$(_defs$1, _names$2);
        var _errors$4 = Kind$Defs$report$errors$(_defs$1);
        var self = _errors$4;
        if (self.length === 0) {
            var $5899 = "All terms check.";
            var _errors$5 = $5899;
        } else {
            var $5900 = self.charCodeAt(0);
            var $5901 = self.slice(1);
            var $5902 = _errors$4;
            var _errors$5 = $5902;
        };
        var $5898 = (_types$3 + ("\u{a}" + _errors$5));
        return $5898;
    };
    const Kind$Defs$report = x0 => x1 => Kind$Defs$report$(x0, x1);

    function Kind$checker$io$one$(_name$1) {
        var $5903 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5904 = _m$bind$2;
            return $5904;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5906 = self.value;
                    var $5907 = IO$print$(Kind$Defs$report$($5906, List$cons$(_name$1, List$nil)));
                    var $5905 = $5907;
                    break;
                case 'Maybe.none':
                    var _notfound$3 = ("Term not found: \'" + (_name$1 + "\'."));
                    var _filelist$4 = List$mapped$(Kind$Synth$files_of$(_name$1), (_x$4 => {
                        var $5909 = ("\'" + (_x$4 + "\'"));
                        return $5909;
                    }));
                    var _searched$5 = ("Searched on: " + (String$join$(", ", _filelist$4) + "."));
                    var $5908 = IO$print$((_notfound$3 + ("\u{a}" + _searched$5)));
                    var $5905 = $5908;
                    break;
            };
            return $5905;
        }));
        return $5903;
    };
    const Kind$checker$io$one = x0 => Kind$checker$io$one$(x0);

    function Kind$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $5911 = self.head;
                var $5912 = self.tail;
                var $5913 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $5914 = _m$bind$5;
                    return $5914;
                }))(Kind$Synth$one$($5911, _defs$2))((_new_defs$5 => {
                    var self = _new_defs$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5916 = self.value;
                            var $5917 = Kind$Synth$many$($5912, $5916);
                            var $5915 = $5917;
                            break;
                        case 'Maybe.none':
                            var $5918 = Kind$Synth$many$($5912, _defs$2);
                            var $5915 = $5918;
                            break;
                    };
                    return $5915;
                }));
                var $5910 = $5913;
                break;
            case 'List.nil':
                var $5919 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5920 = _m$pure$4;
                    return $5920;
                }))(_defs$2);
                var $5910 = $5919;
                break;
        };
        return $5910;
    };
    const Kind$Synth$many = x0 => x1 => Kind$Synth$many$(x0, x1);

    function Kind$Synth$file$(_file$1, _defs$2) {
        var $5921 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $5922 = _m$bind$3;
            return $5922;
        }))(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Kind$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5924 = self.value;
                    var $5925 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $5926 = _m$pure$7;
                        return $5926;
                    }))(Either$left$($5924));
                    var $5923 = $5925;
                    break;
                case 'Either.right':
                    var $5927 = self.value;
                    var _file_defs$6 = $5927;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Kind$Name$from_bits);
                    var $5928 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $5929 = _m$bind$9;
                        return $5929;
                    }))(Kind$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5930 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $5931 = _m$pure$11;
                            return $5931;
                        }))(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5930;
                    }));
                    var $5923 = $5928;
                    break;
            };
            return $5923;
        }));
        return $5921;
    };
    const Kind$Synth$file = x0 => x1 => Kind$Synth$file$(x0, x1);

    function Kind$checker$io$file$(_file$1) {
        var $5932 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5933 = _m$bind$2;
            return $5933;
        }))(Kind$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5935 = self.value;
                    var $5936 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                        var $5937 = _m$bind$4;
                        return $5937;
                    }))(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5938 = IO$print$($5935);
                        return $5938;
                    }));
                    var $5934 = $5936;
                    break;
                case 'Either.right':
                    var $5939 = self.value;
                    var self = $5939;
                    switch (self._) {
                        case 'Pair.new':
                            var $5941 = self.fst;
                            var $5942 = self.snd;
                            var _nams$6 = $5941;
                            var _defs$7 = $5942;
                            var self = _nams$6;
                            switch (self._) {
                                case 'List.nil':
                                    var $5944 = IO$print$(("File not found or empty: \'" + (_file$1 + "\'.")));
                                    var $5943 = $5944;
                                    break;
                                case 'List.cons':
                                    var $5945 = IO$print$(Kind$Defs$report$(_defs$7, _nams$6));
                                    var $5943 = $5945;
                                    break;
                            };
                            var $5940 = $5943;
                            break;
                    };
                    var $5934 = $5940;
                    break;
            };
            return $5934;
        }));
        return $5932;
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
                        var $5946 = self.value;
                        var $5947 = $5946;
                        return $5947;
                    case 'IO.ask':
                        var $5948 = self.then;
                        var $5949 = IO$purify$($5948(""));
                        return $5949;
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
                var $5951 = self.value;
                var $5952 = $5951;
                var $5950 = $5952;
                break;
            case 'Either.right':
                var $5953 = self.value;
                var $5954 = IO$purify$((() => {
                    var _defs$3 = $5953;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Kind$Name$from_bits);
                    var $5955 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $5956 = _m$bind$5;
                        return $5956;
                    }))(Kind$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5957 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $5958 = _m$pure$7;
                            return $5958;
                        }))(Kind$Defs$report$(_defs$5, _nams$4));
                        return $5957;
                    }));
                    return $5955;
                })());
                var $5950 = $5954;
                break;
        };
        return $5950;
    };
    const Kind$checker$code = x0 => Kind$checker$code$(x0);

    function Kind$Term$read$(_code$1) {
        var self = Kind$Parser$term$(0n, _code$1);
        switch (self._) {
            case 'Parser.Reply.value':
                var $5960 = self.val;
                var $5961 = Maybe$some$($5960);
                var $5959 = $5961;
                break;
            case 'Parser.Reply.error':
                var $5962 = Maybe$none;
                var $5959 = $5962;
                break;
        };
        return $5959;
    };
    const Kind$Term$read = x0 => Kind$Term$read$(x0);
    const Kind = (() => {
        var __$1 = Kind$to_core$io$one;
        var __$2 = Kind$checker$io$one;
        var __$3 = Kind$checker$io$file;
        var __$4 = Kind$checker$code;
        var __$5 = Kind$Term$read;
        var $5963 = IO$monad$((_m$bind$6 => _m$pure$7 => {
            var $5964 = _m$pure$7;
            return $5964;
        }))(Unit$new);
        return $5963;
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
        'Kind.Parser.forrange.u32': Kind$Parser$forrange$u32,
        'Kind.Parser.forrange.u32.2': Kind$Parser$forrange$u32$2,
        'Kind.Parser.forin': Kind$Parser$forin,
        'Kind.Parser.forin.2': Kind$Parser$forin$2,
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