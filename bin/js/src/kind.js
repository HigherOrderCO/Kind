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

    function Kind$Parser$if$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("if ", $1164, $1165);
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
                        var self = Kind$Parser$term$($1172, $1173);
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
                                var self = Kind$Parser$text$("then", $1179, $1180);
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
                                                var self = Kind$Parser$text$("else", $1194, $1195);
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
                                                                var self = Kind$Parser$stop$($1166, $1209, $1210);
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
                                                                        var _term$27 = $1181;
                                                                        var _term$28 = Kind$Term$app$(_term$27, Kind$Term$lam$("", (_x$28 => {
                                                                            var $1221 = Kind$Term$hol$(Bits$e);
                                                                            return $1221;
                                                                        })));
                                                                        var _term$29 = Kind$Term$app$(_term$28, $1196);
                                                                        var _term$30 = Kind$Term$app$(_term$29, $1211);
                                                                        var $1220 = Parser$Reply$value$($1217, $1218, Kind$Term$ori$($1219, _term$30));
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
    const Kind$Parser$if = x0 => x1 => Kind$Parser$if$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1223 = self.head;
                var $1224 = self.tail;
                var $1225 = List$cons$(_f$4($1223), List$mapped$($1224, _f$4));
                var $1222 = $1225;
                break;
            case 'List.nil':
                var $1226 = List$nil;
                var $1222 = $1226;
                break;
        };
        return $1222;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);
    const Kind$backslash = 92;
    const Kind$escapes = List$cons$(Pair$new$("\\b", 8), List$cons$(Pair$new$("\\f", 12), List$cons$(Pair$new$("\\n", 10), List$cons$(Pair$new$("\\r", 13), List$cons$(Pair$new$("\\t", 9), List$cons$(Pair$new$("\\v", 11), List$cons$(Pair$new$(String$cons$(Kind$backslash, String$cons$(Kind$backslash, String$nil)), Kind$backslash), List$cons$(Pair$new$("\\\"", 34), List$cons$(Pair$new$("\\0", 0), List$cons$(Pair$new$("\\\'", 39), List$nil))))))))));
    const Kind$Parser$char$single = Parser$first_of$(List$cons$(Parser$first_of$(List$mapped$(Kind$escapes, (_esc$1 => {
        var self = _esc$1;
        switch (self._) {
            case 'Pair.new':
                var $1228 = self.fst;
                var $1229 = self.snd;
                var $1230 = (_idx$4 => _code$5 => {
                    var self = Parser$text$($1228, _idx$4, _code$5);
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
                            var $1238 = Parser$Reply$value$($1236, $1237, $1229);
                            var $1231 = $1238;
                            break;
                    };
                    return $1231;
                });
                var $1227 = $1230;
                break;
        };
        return $1227;
    }))), List$cons$(Parser$one, List$nil)));

    function Kind$Term$chr$(_chrx$1) {
        var $1239 = ({
            _: 'Kind.Term.chr',
            'chrx': _chrx$1
        });
        return $1239;
    };
    const Kind$Term$chr = x0 => Kind$Term$chr$(x0);

    function Kind$Parser$char$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1241 = self.idx;
                var $1242 = self.code;
                var $1243 = self.err;
                var $1244 = Parser$Reply$error$($1241, $1242, $1243);
                var $1240 = $1244;
                break;
            case 'Parser.Reply.value':
                var $1245 = self.idx;
                var $1246 = self.code;
                var $1247 = self.val;
                var self = Kind$Parser$text$("\'", $1245, $1246);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1249 = self.idx;
                        var $1250 = self.code;
                        var $1251 = self.err;
                        var $1252 = Parser$Reply$error$($1249, $1250, $1251);
                        var $1248 = $1252;
                        break;
                    case 'Parser.Reply.value':
                        var $1253 = self.idx;
                        var $1254 = self.code;
                        var self = Kind$Parser$char$single($1253)($1254);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1256 = self.idx;
                                var $1257 = self.code;
                                var $1258 = self.err;
                                var $1259 = Parser$Reply$error$($1256, $1257, $1258);
                                var $1255 = $1259;
                                break;
                            case 'Parser.Reply.value':
                                var $1260 = self.idx;
                                var $1261 = self.code;
                                var $1262 = self.val;
                                var self = Parser$text$("\'", $1260, $1261);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1264 = self.idx;
                                        var $1265 = self.code;
                                        var $1266 = self.err;
                                        var $1267 = Parser$Reply$error$($1264, $1265, $1266);
                                        var $1263 = $1267;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1268 = self.idx;
                                        var $1269 = self.code;
                                        var self = Kind$Parser$stop$($1247, $1268, $1269);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1271 = self.idx;
                                                var $1272 = self.code;
                                                var $1273 = self.err;
                                                var $1274 = Parser$Reply$error$($1271, $1272, $1273);
                                                var $1270 = $1274;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1275 = self.idx;
                                                var $1276 = self.code;
                                                var $1277 = self.val;
                                                var $1278 = Parser$Reply$value$($1275, $1276, Kind$Term$ori$($1277, Kind$Term$chr$($1262)));
                                                var $1270 = $1278;
                                                break;
                                        };
                                        var $1263 = $1270;
                                        break;
                                };
                                var $1255 = $1263;
                                break;
                        };
                        var $1248 = $1255;
                        break;
                };
                var $1240 = $1248;
                break;
        };
        return $1240;
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
                    var $1279 = _res$2;
                    return $1279;
                } else {
                    var $1280 = self.charCodeAt(0);
                    var $1281 = self.slice(1);
                    var $1282 = String$reverse$go$($1281, String$cons$($1280, _res$2));
                    return $1282;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $1283 = String$reverse$go$(_xs$1, String$nil);
        return $1283;
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
                    var $1284 = Parser$Reply$error$(_idx$2, _code$3, "Non-terminating string.");
                    return $1284;
                } else {
                    var $1285 = self.charCodeAt(0);
                    var $1286 = self.slice(1);
                    var self = ($1285 === 34);
                    if (self) {
                        var $1288 = Parser$Reply$value$(Nat$succ$(_idx$2), $1286, String$reverse$(_str$1));
                        var $1287 = $1288;
                    } else {
                        var self = Kind$Parser$char$single(_idx$2)(_code$3);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1290 = self.idx;
                                var $1291 = self.code;
                                var $1292 = self.err;
                                var $1293 = Parser$Reply$error$($1290, $1291, $1292);
                                var $1289 = $1293;
                                break;
                            case 'Parser.Reply.value':
                                var $1294 = self.idx;
                                var $1295 = self.code;
                                var $1296 = self.val;
                                var $1297 = Kind$Parser$string$go$(String$cons$($1296, _str$1), $1294, $1295);
                                var $1289 = $1297;
                                break;
                        };
                        var $1287 = $1289;
                    };
                    return $1287;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Parser$string$go = x0 => x1 => x2 => Kind$Parser$string$go$(x0, x1, x2);

    function Kind$Term$str$(_strx$1) {
        var $1298 = ({
            _: 'Kind.Term.str',
            'strx': _strx$1
        });
        return $1298;
    };
    const Kind$Term$str = x0 => Kind$Term$str$(x0);

    function Kind$Parser$string$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $1306 = self.val;
                var self = Kind$Parser$text$(String$cons$(34, String$nil), $1304, $1305);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1308 = self.idx;
                        var $1309 = self.code;
                        var $1310 = self.err;
                        var $1311 = Parser$Reply$error$($1308, $1309, $1310);
                        var $1307 = $1311;
                        break;
                    case 'Parser.Reply.value':
                        var $1312 = self.idx;
                        var $1313 = self.code;
                        var self = Kind$Parser$string$go$("", $1312, $1313);
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
                                var $1321 = self.val;
                                var self = Kind$Parser$stop$($1306, $1319, $1320);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1323 = self.idx;
                                        var $1324 = self.code;
                                        var $1325 = self.err;
                                        var $1326 = Parser$Reply$error$($1323, $1324, $1325);
                                        var $1322 = $1326;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1327 = self.idx;
                                        var $1328 = self.code;
                                        var $1329 = self.val;
                                        var $1330 = Parser$Reply$value$($1327, $1328, Kind$Term$ori$($1329, Kind$Term$str$($1321)));
                                        var $1322 = $1330;
                                        break;
                                };
                                var $1314 = $1322;
                                break;
                        };
                        var $1307 = $1314;
                        break;
                };
                var $1299 = $1307;
                break;
        };
        return $1299;
    };
    const Kind$Parser$string = x0 => x1 => Kind$Parser$string$(x0, x1);

    function Kind$Parser$pair$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1332 = self.idx;
                var $1333 = self.code;
                var $1334 = self.err;
                var $1335 = Parser$Reply$error$($1332, $1333, $1334);
                var $1331 = $1335;
                break;
            case 'Parser.Reply.value':
                var $1336 = self.idx;
                var $1337 = self.code;
                var $1338 = self.val;
                var self = Kind$Parser$text$("{", $1336, $1337);
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
                        var self = Kind$Parser$term$($1344, $1345);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1347 = self.idx;
                                var $1348 = self.code;
                                var $1349 = self.err;
                                var $1350 = Parser$Reply$error$($1347, $1348, $1349);
                                var $1346 = $1350;
                                break;
                            case 'Parser.Reply.value':
                                var $1351 = self.idx;
                                var $1352 = self.code;
                                var $1353 = self.val;
                                var self = Kind$Parser$text$(",", $1351, $1352);
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
                                        var self = Kind$Parser$term$($1359, $1360);
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
                                                var self = Kind$Parser$text$("}", $1366, $1367);
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
                                                        var self = Kind$Parser$stop$($1338, $1374, $1375);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1377 = self.idx;
                                                                var $1378 = self.code;
                                                                var $1379 = self.err;
                                                                var $1380 = Parser$Reply$error$($1377, $1378, $1379);
                                                                var $1376 = $1380;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1381 = self.idx;
                                                                var $1382 = self.code;
                                                                var $1383 = self.val;
                                                                var _term$24 = Kind$Term$ref$("Pair.new");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, $1353);
                                                                var _term$28 = Kind$Term$app$(_term$27, $1368);
                                                                var $1384 = Parser$Reply$value$($1381, $1382, Kind$Term$ori$($1383, _term$28));
                                                                var $1376 = $1384;
                                                                break;
                                                        };
                                                        var $1369 = $1376;
                                                        break;
                                                };
                                                var $1361 = $1369;
                                                break;
                                        };
                                        var $1354 = $1361;
                                        break;
                                };
                                var $1346 = $1354;
                                break;
                        };
                        var $1339 = $1346;
                        break;
                };
                var $1331 = $1339;
                break;
        };
        return $1331;
    };
    const Kind$Parser$pair = x0 => x1 => Kind$Parser$pair$(x0, x1);

    function Kind$Parser$sigma$type$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1386 = self.idx;
                var $1387 = self.code;
                var $1388 = self.err;
                var $1389 = Parser$Reply$error$($1386, $1387, $1388);
                var $1385 = $1389;
                break;
            case 'Parser.Reply.value':
                var $1390 = self.idx;
                var $1391 = self.code;
                var $1392 = self.val;
                var self = Kind$Parser$text$("{", $1390, $1391);
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
                        var self = Kind$Parser$name1$($1398, $1399);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1401 = self.idx;
                                var $1402 = self.code;
                                var $1403 = self.err;
                                var $1404 = Parser$Reply$error$($1401, $1402, $1403);
                                var $1400 = $1404;
                                break;
                            case 'Parser.Reply.value':
                                var $1405 = self.idx;
                                var $1406 = self.code;
                                var $1407 = self.val;
                                var self = Kind$Parser$text$(":", $1405, $1406);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1409 = self.idx;
                                        var $1410 = self.code;
                                        var $1411 = self.err;
                                        var $1412 = Parser$Reply$error$($1409, $1410, $1411);
                                        var $1408 = $1412;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1413 = self.idx;
                                        var $1414 = self.code;
                                        var self = Kind$Parser$term$($1413, $1414);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1416 = self.idx;
                                                var $1417 = self.code;
                                                var $1418 = self.err;
                                                var $1419 = Parser$Reply$error$($1416, $1417, $1418);
                                                var $1415 = $1419;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1420 = self.idx;
                                                var $1421 = self.code;
                                                var $1422 = self.val;
                                                var self = Kind$Parser$text$("}", $1420, $1421);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1424 = self.idx;
                                                        var $1425 = self.code;
                                                        var $1426 = self.err;
                                                        var $1427 = Parser$Reply$error$($1424, $1425, $1426);
                                                        var $1423 = $1427;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1428 = self.idx;
                                                        var $1429 = self.code;
                                                        var self = Kind$Parser$term$($1428, $1429);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1431 = self.idx;
                                                                var $1432 = self.code;
                                                                var $1433 = self.err;
                                                                var $1434 = Parser$Reply$error$($1431, $1432, $1433);
                                                                var $1430 = $1434;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1435 = self.idx;
                                                                var $1436 = self.code;
                                                                var $1437 = self.val;
                                                                var self = Kind$Parser$stop$($1392, $1435, $1436);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1439 = self.idx;
                                                                        var $1440 = self.code;
                                                                        var $1441 = self.err;
                                                                        var $1442 = Parser$Reply$error$($1439, $1440, $1441);
                                                                        var $1438 = $1442;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1443 = self.idx;
                                                                        var $1444 = self.code;
                                                                        var $1445 = self.val;
                                                                        var _term$27 = Kind$Term$ref$("Sigma");
                                                                        var _term$28 = Kind$Term$app$(_term$27, $1422);
                                                                        var _term$29 = Kind$Term$app$(_term$28, Kind$Term$lam$($1407, (_x$29 => {
                                                                            var $1447 = $1437;
                                                                            return $1447;
                                                                        })));
                                                                        var $1446 = Parser$Reply$value$($1443, $1444, Kind$Term$ori$($1445, _term$29));
                                                                        var $1438 = $1446;
                                                                        break;
                                                                };
                                                                var $1430 = $1438;
                                                                break;
                                                        };
                                                        var $1423 = $1430;
                                                        break;
                                                };
                                                var $1415 = $1423;
                                                break;
                                        };
                                        var $1408 = $1415;
                                        break;
                                };
                                var $1400 = $1408;
                                break;
                        };
                        var $1393 = $1400;
                        break;
                };
                var $1385 = $1393;
                break;
        };
        return $1385;
    };
    const Kind$Parser$sigma$type = x0 => x1 => Kind$Parser$sigma$type$(x0, x1);

    function Kind$Parser$some$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$("some(", $1453, $1454);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1457 = self.idx;
                        var $1458 = self.code;
                        var $1459 = self.err;
                        var $1460 = Parser$Reply$error$($1457, $1458, $1459);
                        var $1456 = $1460;
                        break;
                    case 'Parser.Reply.value':
                        var $1461 = self.idx;
                        var $1462 = self.code;
                        var self = Kind$Parser$term$($1461, $1462);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1464 = self.idx;
                                var $1465 = self.code;
                                var $1466 = self.err;
                                var $1467 = Parser$Reply$error$($1464, $1465, $1466);
                                var $1463 = $1467;
                                break;
                            case 'Parser.Reply.value':
                                var $1468 = self.idx;
                                var $1469 = self.code;
                                var $1470 = self.val;
                                var self = Kind$Parser$text$(")", $1468, $1469);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1472 = self.idx;
                                        var $1473 = self.code;
                                        var $1474 = self.err;
                                        var $1475 = Parser$Reply$error$($1472, $1473, $1474);
                                        var $1471 = $1475;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1476 = self.idx;
                                        var $1477 = self.code;
                                        var self = Kind$Parser$stop$($1455, $1476, $1477);
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
                                                var _term$18 = Kind$Term$ref$("Maybe.some");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, $1470);
                                                var $1486 = Parser$Reply$value$($1483, $1484, Kind$Term$ori$($1485, _term$20));
                                                var $1478 = $1486;
                                                break;
                                        };
                                        var $1471 = $1478;
                                        break;
                                };
                                var $1463 = $1471;
                                break;
                        };
                        var $1456 = $1463;
                        break;
                };
                var $1448 = $1456;
                break;
        };
        return $1448;
    };
    const Kind$Parser$some = x0 => x1 => Kind$Parser$some$(x0, x1);

    function Kind$Parser$apply$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$("apply(", $1492, $1493);
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
                                var self = Kind$Parser$text$(",", $1507, $1508);
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
                                        var self = Kind$Parser$term$($1515, $1516);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1518 = self.idx;
                                                var $1519 = self.code;
                                                var $1520 = self.err;
                                                var $1521 = Parser$Reply$error$($1518, $1519, $1520);
                                                var $1517 = $1521;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1522 = self.idx;
                                                var $1523 = self.code;
                                                var $1524 = self.val;
                                                var self = Kind$Parser$text$(")", $1522, $1523);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1526 = self.idx;
                                                        var $1527 = self.code;
                                                        var $1528 = self.err;
                                                        var $1529 = Parser$Reply$error$($1526, $1527, $1528);
                                                        var $1525 = $1529;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1530 = self.idx;
                                                        var $1531 = self.code;
                                                        var self = Kind$Parser$stop$($1494, $1530, $1531);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1533 = self.idx;
                                                                var $1534 = self.code;
                                                                var $1535 = self.err;
                                                                var $1536 = Parser$Reply$error$($1533, $1534, $1535);
                                                                var $1532 = $1536;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1537 = self.idx;
                                                                var $1538 = self.code;
                                                                var $1539 = self.val;
                                                                var _term$24 = Kind$Term$ref$("Equal.apply");
                                                                var _term$25 = Kind$Term$app$(_term$24, Kind$Term$hol$(Bits$e));
                                                                var _term$26 = Kind$Term$app$(_term$25, Kind$Term$hol$(Bits$e));
                                                                var _term$27 = Kind$Term$app$(_term$26, Kind$Term$hol$(Bits$e));
                                                                var _term$28 = Kind$Term$app$(_term$27, Kind$Term$hol$(Bits$e));
                                                                var _term$29 = Kind$Term$app$(_term$28, $1509);
                                                                var _term$30 = Kind$Term$app$(_term$29, $1524);
                                                                var $1540 = Parser$Reply$value$($1537, $1538, Kind$Term$ori$($1539, _term$30));
                                                                var $1532 = $1540;
                                                                break;
                                                        };
                                                        var $1525 = $1532;
                                                        break;
                                                };
                                                var $1517 = $1525;
                                                break;
                                        };
                                        var $1510 = $1517;
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
        return $1487;
    };
    const Kind$Parser$apply = x0 => x1 => Kind$Parser$apply$(x0, x1);

    function Kind$Parser$mirror$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$("mirror(", $1546, $1547);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1550 = self.idx;
                        var $1551 = self.code;
                        var $1552 = self.err;
                        var $1553 = Parser$Reply$error$($1550, $1551, $1552);
                        var $1549 = $1553;
                        break;
                    case 'Parser.Reply.value':
                        var $1554 = self.idx;
                        var $1555 = self.code;
                        var self = Kind$Parser$term$($1554, $1555);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1557 = self.idx;
                                var $1558 = self.code;
                                var $1559 = self.err;
                                var $1560 = Parser$Reply$error$($1557, $1558, $1559);
                                var $1556 = $1560;
                                break;
                            case 'Parser.Reply.value':
                                var $1561 = self.idx;
                                var $1562 = self.code;
                                var $1563 = self.val;
                                var self = Kind$Parser$text$(")", $1561, $1562);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1565 = self.idx;
                                        var $1566 = self.code;
                                        var $1567 = self.err;
                                        var $1568 = Parser$Reply$error$($1565, $1566, $1567);
                                        var $1564 = $1568;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1569 = self.idx;
                                        var $1570 = self.code;
                                        var self = Kind$Parser$stop$($1548, $1569, $1570);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1572 = self.idx;
                                                var $1573 = self.code;
                                                var $1574 = self.err;
                                                var $1575 = Parser$Reply$error$($1572, $1573, $1574);
                                                var $1571 = $1575;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1576 = self.idx;
                                                var $1577 = self.code;
                                                var $1578 = self.val;
                                                var _term$18 = Kind$Term$ref$("Equal.mirror");
                                                var _term$19 = Kind$Term$app$(_term$18, Kind$Term$hol$(Bits$e));
                                                var _term$20 = Kind$Term$app$(_term$19, Kind$Term$hol$(Bits$e));
                                                var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                var _term$22 = Kind$Term$app$(_term$21, $1563);
                                                var $1579 = Parser$Reply$value$($1576, $1577, Kind$Term$ori$($1578, _term$22));
                                                var $1571 = $1579;
                                                break;
                                        };
                                        var $1564 = $1571;
                                        break;
                                };
                                var $1556 = $1564;
                                break;
                        };
                        var $1549 = $1556;
                        break;
                };
                var $1541 = $1549;
                break;
        };
        return $1541;
    };
    const Kind$Parser$mirror = x0 => x1 => Kind$Parser$mirror$(x0, x1);

    function Kind$Name$read$(_str$1) {
        var $1580 = _str$1;
        return $1580;
    };
    const Kind$Name$read = x0 => Kind$Name$read$(x0);

    function Kind$Parser$list$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1582 = self.idx;
                var $1583 = self.code;
                var $1584 = self.err;
                var $1585 = Parser$Reply$error$($1582, $1583, $1584);
                var $1581 = $1585;
                break;
            case 'Parser.Reply.value':
                var $1586 = self.idx;
                var $1587 = self.code;
                var $1588 = self.val;
                var self = Kind$Parser$text$("[", $1586, $1587);
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
                        var self = Parser$until$(Kind$Parser$text("]"), Kind$Parser$item(Kind$Parser$term))($1594)($1595);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1597 = self.idx;
                                var $1598 = self.code;
                                var $1599 = self.err;
                                var $1600 = Parser$Reply$error$($1597, $1598, $1599);
                                var $1596 = $1600;
                                break;
                            case 'Parser.Reply.value':
                                var $1601 = self.idx;
                                var $1602 = self.code;
                                var $1603 = self.val;
                                var self = Kind$Parser$stop$($1588, $1601, $1602);
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
                                        var $1612 = Parser$Reply$value$($1609, $1610, List$fold$($1603, Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("List.nil")), Kind$Term$hol$(Bits$e)), (_x$15 => _xs$16 => {
                                            var _term$17 = Kind$Term$ref$(Kind$Name$read$("List.cons"));
                                            var _term$18 = Kind$Term$app$(_term$17, Kind$Term$hol$(Bits$e));
                                            var _term$19 = Kind$Term$app$(_term$18, _x$15);
                                            var _term$20 = Kind$Term$app$(_term$19, _xs$16);
                                            var $1613 = Kind$Term$ori$($1611, _term$20);
                                            return $1613;
                                        })));
                                        var $1604 = $1612;
                                        break;
                                };
                                var $1596 = $1604;
                                break;
                        };
                        var $1589 = $1596;
                        break;
                };
                var $1581 = $1589;
                break;
        };
        return $1581;
    };
    const Kind$Parser$list = x0 => x1 => Kind$Parser$list$(x0, x1);

    function Kind$Parser$log$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1615 = self.idx;
                var $1616 = self.code;
                var $1617 = self.err;
                var $1618 = Parser$Reply$error$($1615, $1616, $1617);
                var $1614 = $1618;
                break;
            case 'Parser.Reply.value':
                var $1619 = self.idx;
                var $1620 = self.code;
                var $1621 = self.val;
                var self = Kind$Parser$text$("log(", $1619, $1620);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1623 = self.idx;
                        var $1624 = self.code;
                        var $1625 = self.err;
                        var $1626 = Parser$Reply$error$($1623, $1624, $1625);
                        var $1622 = $1626;
                        break;
                    case 'Parser.Reply.value':
                        var $1627 = self.idx;
                        var $1628 = self.code;
                        var self = Parser$until$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term))($1627)($1628);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1630 = self.idx;
                                var $1631 = self.code;
                                var $1632 = self.err;
                                var $1633 = Parser$Reply$error$($1630, $1631, $1632);
                                var $1629 = $1633;
                                break;
                            case 'Parser.Reply.value':
                                var $1634 = self.idx;
                                var $1635 = self.code;
                                var $1636 = self.val;
                                var self = Kind$Parser$term$($1634, $1635);
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
                                        var _term$15 = Kind$Term$ref$("Debug.log");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                        var _args$17 = List$fold$($1636, Kind$Term$ref$("String.nil"), (_x$17 => _xs$18 => {
                                            var _arg$19 = Kind$Term$ref$("String.concat");
                                            var _arg$20 = Kind$Term$app$(_arg$19, _x$17);
                                            var _arg$21 = Kind$Term$app$(_arg$20, _xs$18);
                                            var $1646 = _arg$21;
                                            return $1646;
                                        }));
                                        var _term$18 = Kind$Term$app$(_term$16, _args$17);
                                        var _term$19 = Kind$Term$app$(_term$18, Kind$Term$lam$("x", (_x$19 => {
                                            var $1647 = $1644;
                                            return $1647;
                                        })));
                                        var self = Kind$Parser$stop$($1621, $1642, $1643);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1648 = self.idx;
                                                var $1649 = self.code;
                                                var $1650 = self.err;
                                                var $1651 = Parser$Reply$error$($1648, $1649, $1650);
                                                var $1645 = $1651;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1652 = self.idx;
                                                var $1653 = self.code;
                                                var $1654 = self.val;
                                                var $1655 = Parser$Reply$value$($1652, $1653, Kind$Term$ori$($1654, _term$19));
                                                var $1645 = $1655;
                                                break;
                                        };
                                        var $1637 = $1645;
                                        break;
                                };
                                var $1629 = $1637;
                                break;
                        };
                        var $1622 = $1629;
                        break;
                };
                var $1614 = $1622;
                break;
        };
        return $1614;
    };
    const Kind$Parser$log = x0 => x1 => Kind$Parser$log$(x0, x1);

    function Kind$Parser$forrange$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1657 = self.idx;
                var $1658 = self.code;
                var $1659 = self.err;
                var $1660 = Parser$Reply$error$($1657, $1658, $1659);
                var $1656 = $1660;
                break;
            case 'Parser.Reply.value':
                var $1661 = self.idx;
                var $1662 = self.code;
                var $1663 = self.val;
                var self = Kind$Parser$text$("for ", $1661, $1662);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1665 = self.idx;
                        var $1666 = self.code;
                        var $1667 = self.err;
                        var $1668 = Parser$Reply$error$($1665, $1666, $1667);
                        var $1664 = $1668;
                        break;
                    case 'Parser.Reply.value':
                        var $1669 = self.idx;
                        var $1670 = self.code;
                        var self = Kind$Parser$name1$($1669, $1670);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $1672 = self.idx;
                                var $1673 = self.code;
                                var $1674 = self.err;
                                var $1675 = Parser$Reply$error$($1672, $1673, $1674);
                                var $1671 = $1675;
                                break;
                            case 'Parser.Reply.value':
                                var $1676 = self.idx;
                                var $1677 = self.code;
                                var $1678 = self.val;
                                var self = Kind$Parser$text$(":", $1676, $1677);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1680 = self.idx;
                                        var $1681 = self.code;
                                        var $1682 = self.err;
                                        var $1683 = Parser$Reply$error$($1680, $1681, $1682);
                                        var $1679 = $1683;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1684 = self.idx;
                                        var $1685 = self.code;
                                        var self = Kind$Parser$text$("U32", $1684, $1685);
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
                                                var self = Kind$Parser$text$("=", $1691, $1692);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $1694 = self.idx;
                                                        var $1695 = self.code;
                                                        var $1696 = self.err;
                                                        var $1697 = Parser$Reply$error$($1694, $1695, $1696);
                                                        var $1693 = $1697;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $1698 = self.idx;
                                                        var $1699 = self.code;
                                                        var self = Kind$Parser$term$($1698, $1699);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1701 = self.idx;
                                                                var $1702 = self.code;
                                                                var $1703 = self.err;
                                                                var $1704 = Parser$Reply$error$($1701, $1702, $1703);
                                                                var $1700 = $1704;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1705 = self.idx;
                                                                var $1706 = self.code;
                                                                var $1707 = self.val;
                                                                var self = Kind$Parser$text$("..", $1705, $1706);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1709 = self.idx;
                                                                        var $1710 = self.code;
                                                                        var $1711 = self.err;
                                                                        var $1712 = Parser$Reply$error$($1709, $1710, $1711);
                                                                        var $1708 = $1712;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1713 = self.idx;
                                                                        var $1714 = self.code;
                                                                        var self = Kind$Parser$term$($1713, $1714);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1716 = self.idx;
                                                                                var $1717 = self.code;
                                                                                var $1718 = self.err;
                                                                                var $1719 = Parser$Reply$error$($1716, $1717, $1718);
                                                                                var $1715 = $1719;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1720 = self.idx;
                                                                                var $1721 = self.code;
                                                                                var $1722 = self.val;
                                                                                var self = Kind$Parser$text$("with", $1720, $1721);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1724 = self.idx;
                                                                                        var $1725 = self.code;
                                                                                        var $1726 = self.err;
                                                                                        var $1727 = Parser$Reply$error$($1724, $1725, $1726);
                                                                                        var $1723 = $1727;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1728 = self.idx;
                                                                                        var $1729 = self.code;
                                                                                        var self = Kind$Parser$name1$($1728, $1729);
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
                                                                                                var self = Kind$Parser$text$(":", $1735, $1736);
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
                                                                                                                var self = Kind$Parser$stop$($1663, $1750, $1751);
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
                                                                                                                        var $1760 = self.val;
                                                                                                                        var _term$45 = Kind$Term$ref$("U32.for");
                                                                                                                        var _term$46 = Kind$Term$app$(_term$45, Kind$Term$hol$(Bits$e));
                                                                                                                        var _term$47 = Kind$Term$app$(_term$46, Kind$Term$ref$($1737));
                                                                                                                        var _term$48 = Kind$Term$app$(_term$47, $1707);
                                                                                                                        var _term$49 = Kind$Term$app$(_term$48, $1722);
                                                                                                                        var _lamb$50 = Kind$Term$lam$($1678, (_e$50 => {
                                                                                                                            var $1762 = Kind$Term$lam$($1737, (_s$51 => {
                                                                                                                                var $1763 = $1752;
                                                                                                                                return $1763;
                                                                                                                            }));
                                                                                                                            return $1762;
                                                                                                                        }));
                                                                                                                        var _term$51 = Kind$Term$app$(_term$49, _lamb$50);
                                                                                                                        var _term$52 = Kind$Term$let$($1737, _term$51, (_x$52 => {
                                                                                                                            var $1764 = Kind$Term$ref$($1737);
                                                                                                                            return $1764;
                                                                                                                        }));
                                                                                                                        var $1761 = Parser$Reply$value$($1758, $1759, Kind$Term$ori$($1760, _term$52));
                                                                                                                        var $1753 = $1761;
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
                                                                                        var $1723 = $1730;
                                                                                        break;
                                                                                };
                                                                                var $1715 = $1723;
                                                                                break;
                                                                        };
                                                                        var $1708 = $1715;
                                                                        break;
                                                                };
                                                                var $1700 = $1708;
                                                                break;
                                                        };
                                                        var $1693 = $1700;
                                                        break;
                                                };
                                                var $1686 = $1693;
                                                break;
                                        };
                                        var $1679 = $1686;
                                        break;
                                };
                                var $1671 = $1679;
                                break;
                        };
                        var $1664 = $1671;
                        break;
                };
                var $1656 = $1664;
                break;
        };
        return $1656;
    };
    const Kind$Parser$forrange$u32 = x0 => x1 => Kind$Parser$forrange$u32$(x0, x1);

    function Kind$Parser$forrange$u32$2$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $1772 = self.val;
                var self = Kind$Parser$text$("for ", $1770, $1771);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1774 = self.idx;
                        var $1775 = self.code;
                        var $1776 = self.err;
                        var $1777 = Parser$Reply$error$($1774, $1775, $1776);
                        var $1773 = $1777;
                        break;
                    case 'Parser.Reply.value':
                        var $1778 = self.idx;
                        var $1779 = self.code;
                        var self = Kind$Parser$name1$($1778, $1779);
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
                                var $1787 = self.val;
                                var self = Kind$Parser$text$(":", $1785, $1786);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1789 = self.idx;
                                        var $1790 = self.code;
                                        var $1791 = self.err;
                                        var $1792 = Parser$Reply$error$($1789, $1790, $1791);
                                        var $1788 = $1792;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1793 = self.idx;
                                        var $1794 = self.code;
                                        var self = Kind$Parser$text$("U32", $1793, $1794);
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
                                                var self = Kind$Parser$text$("=", $1800, $1801);
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
                                                        var self = Kind$Parser$term$($1807, $1808);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $1810 = self.idx;
                                                                var $1811 = self.code;
                                                                var $1812 = self.err;
                                                                var $1813 = Parser$Reply$error$($1810, $1811, $1812);
                                                                var $1809 = $1813;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $1814 = self.idx;
                                                                var $1815 = self.code;
                                                                var $1816 = self.val;
                                                                var self = Kind$Parser$text$("..", $1814, $1815);
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
                                                                        var self = Kind$Parser$term$($1822, $1823);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1825 = self.idx;
                                                                                var $1826 = self.code;
                                                                                var $1827 = self.err;
                                                                                var $1828 = Parser$Reply$error$($1825, $1826, $1827);
                                                                                var $1824 = $1828;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1829 = self.idx;
                                                                                var $1830 = self.code;
                                                                                var $1831 = self.val;
                                                                                var self = Kind$Parser$text$(":", $1829, $1830);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1833 = self.idx;
                                                                                        var $1834 = self.code;
                                                                                        var $1835 = self.err;
                                                                                        var $1836 = Parser$Reply$error$($1833, $1834, $1835);
                                                                                        var $1832 = $1836;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1837 = self.idx;
                                                                                        var $1838 = self.code;
                                                                                        var self = Kind$Parser$name1$($1837, $1838);
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
                                                                                                var self = Kind$Parser$text$("=", $1844, $1845);
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
                                                                                                        var self = Kind$Parser$term$($1852, $1853);
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
                                                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $1859, $1860);
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
                                                                                                                        var self = Kind$Parser$term$($1867, $1868);
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
                                                                                                                                var $1876 = self.val;
                                                                                                                                var self = Kind$Parser$stop$($1772, $1874, $1875);
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                        var $1878 = self.idx;
                                                                                                                                        var $1879 = self.code;
                                                                                                                                        var $1880 = self.err;
                                                                                                                                        var $1881 = Parser$Reply$error$($1878, $1879, $1880);
                                                                                                                                        var $1877 = $1881;
                                                                                                                                        break;
                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                        var $1882 = self.idx;
                                                                                                                                        var $1883 = self.code;
                                                                                                                                        var $1884 = self.val;
                                                                                                                                        var _term$51 = Kind$Term$ref$("U32.for");
                                                                                                                                        var _term$52 = Kind$Term$app$(_term$51, Kind$Term$hol$(Bits$e));
                                                                                                                                        var _term$53 = Kind$Term$app$(_term$52, Kind$Term$ref$($1846));
                                                                                                                                        var _term$54 = Kind$Term$app$(_term$53, $1816);
                                                                                                                                        var _term$55 = Kind$Term$app$(_term$54, $1831);
                                                                                                                                        var _lamb$56 = Kind$Term$lam$($1787, (_e$56 => {
                                                                                                                                            var $1886 = Kind$Term$lam$($1846, (_s$57 => {
                                                                                                                                                var $1887 = $1861;
                                                                                                                                                return $1887;
                                                                                                                                            }));
                                                                                                                                            return $1886;
                                                                                                                                        }));
                                                                                                                                        var _term$57 = Kind$Term$app$(_term$55, _lamb$56);
                                                                                                                                        var _term$58 = Kind$Term$let$($1846, _term$57, (_x$58 => {
                                                                                                                                            var $1888 = $1876;
                                                                                                                                            return $1888;
                                                                                                                                        }));
                                                                                                                                        var $1885 = Parser$Reply$value$($1882, $1883, Kind$Term$ori$($1884, _term$58));
                                                                                                                                        var $1877 = $1885;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1869 = $1877;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1862 = $1869;
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
                                                                                        var $1832 = $1839;
                                                                                        break;
                                                                                };
                                                                                var $1824 = $1832;
                                                                                break;
                                                                        };
                                                                        var $1817 = $1824;
                                                                        break;
                                                                };
                                                                var $1809 = $1817;
                                                                break;
                                                        };
                                                        var $1802 = $1809;
                                                        break;
                                                };
                                                var $1795 = $1802;
                                                break;
                                        };
                                        var $1788 = $1795;
                                        break;
                                };
                                var $1780 = $1788;
                                break;
                        };
                        var $1773 = $1780;
                        break;
                };
                var $1765 = $1773;
                break;
        };
        return $1765;
    };
    const Kind$Parser$forrange$u32$2 = x0 => x1 => Kind$Parser$forrange$u32$2$(x0, x1);

    function Kind$Parser$forin$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $1896 = self.val;
                var self = Kind$Parser$text$("for ", $1894, $1895);
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
                        var self = Kind$Parser$name1$($1902, $1903);
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
                                var $1911 = self.val;
                                var self = Kind$Parser$text$("in", $1909, $1910);
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
                                        var self = Kind$Parser$term$($1917, $1918);
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
                                                var $1926 = self.val;
                                                var self = Kind$Parser$text$("with", $1924, $1925);
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
                                                        var self = Kind$Parser$name1$($1932, $1933);
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
                                                                var $1941 = self.val;
                                                                var self = Kind$Parser$text$(":", $1939, $1940);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1943 = self.idx;
                                                                        var $1944 = self.code;
                                                                        var $1945 = self.err;
                                                                        var $1946 = Parser$Reply$error$($1943, $1944, $1945);
                                                                        var $1942 = $1946;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1947 = self.idx;
                                                                        var $1948 = self.code;
                                                                        var self = Kind$Parser$term$($1947, $1948);
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
                                                                                var self = Kind$Parser$stop$($1896, $1954, $1955);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $1958 = self.idx;
                                                                                        var $1959 = self.code;
                                                                                        var $1960 = self.err;
                                                                                        var $1961 = Parser$Reply$error$($1958, $1959, $1960);
                                                                                        var $1957 = $1961;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $1962 = self.idx;
                                                                                        var $1963 = self.code;
                                                                                        var $1964 = self.val;
                                                                                        var _term$33 = Kind$Term$ref$("List.for");
                                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$hol$(Bits$e));
                                                                                        var _term$35 = Kind$Term$app$(_term$34, $1926);
                                                                                        var _term$36 = Kind$Term$app$(_term$35, Kind$Term$hol$(Bits$e));
                                                                                        var _term$37 = Kind$Term$app$(_term$36, Kind$Term$ref$($1941));
                                                                                        var _lamb$38 = Kind$Term$lam$($1911, (_i$38 => {
                                                                                            var $1966 = Kind$Term$lam$($1941, (_x$39 => {
                                                                                                var $1967 = $1956;
                                                                                                return $1967;
                                                                                            }));
                                                                                            return $1966;
                                                                                        }));
                                                                                        var _term$39 = Kind$Term$app$(_term$37, _lamb$38);
                                                                                        var _term$40 = Kind$Term$let$($1941, _term$39, (_x$40 => {
                                                                                            var $1968 = Kind$Term$ref$($1941);
                                                                                            return $1968;
                                                                                        }));
                                                                                        var $1965 = Parser$Reply$value$($1962, $1963, Kind$Term$ori$($1964, _term$40));
                                                                                        var $1957 = $1965;
                                                                                        break;
                                                                                };
                                                                                var $1949 = $1957;
                                                                                break;
                                                                        };
                                                                        var $1942 = $1949;
                                                                        break;
                                                                };
                                                                var $1934 = $1942;
                                                                break;
                                                        };
                                                        var $1927 = $1934;
                                                        break;
                                                };
                                                var $1919 = $1927;
                                                break;
                                        };
                                        var $1912 = $1919;
                                        break;
                                };
                                var $1904 = $1912;
                                break;
                        };
                        var $1897 = $1904;
                        break;
                };
                var $1889 = $1897;
                break;
        };
        return $1889;
    };
    const Kind$Parser$forin = x0 => x1 => Kind$Parser$forin$(x0, x1);

    function Kind$Parser$forin$2$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$text$("for ", $1974, $1975);
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
                                var self = Kind$Parser$text$("in", $1989, $1990);
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
                                                var self = Kind$Parser$text$(":", $2004, $2005);
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
                                                        var self = Kind$Parser$name1$($2012, $2013);
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
                                                                var self = Kind$Parser$text$("=", $2019, $2020);
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
                                                                        var self = Kind$Parser$term$($2027, $2028);
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
                                                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2034, $2035);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2038 = self.idx;
                                                                                        var $2039 = self.code;
                                                                                        var $2040 = self.err;
                                                                                        var $2041 = Parser$Reply$error$($2038, $2039, $2040);
                                                                                        var $2037 = $2041;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2042 = self.idx;
                                                                                        var $2043 = self.code;
                                                                                        var self = Kind$Parser$term$($2042, $2043);
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2045 = self.idx;
                                                                                                var $2046 = self.code;
                                                                                                var $2047 = self.err;
                                                                                                var $2048 = Parser$Reply$error$($2045, $2046, $2047);
                                                                                                var $2044 = $2048;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2049 = self.idx;
                                                                                                var $2050 = self.code;
                                                                                                var $2051 = self.val;
                                                                                                var self = Kind$Parser$stop$($1976, $2049, $2050);
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
                                                                                                        var _term$39 = Kind$Term$ref$("List.for");
                                                                                                        var _term$40 = Kind$Term$app$(_term$39, Kind$Term$hol$(Bits$e));
                                                                                                        var _term$41 = Kind$Term$app$(_term$40, $2006);
                                                                                                        var _term$42 = Kind$Term$app$(_term$41, Kind$Term$hol$(Bits$e));
                                                                                                        var _term$43 = Kind$Term$app$(_term$42, Kind$Term$ref$($2021));
                                                                                                        var _lamb$44 = Kind$Term$lam$($1991, (_i$44 => {
                                                                                                            var $2061 = Kind$Term$lam$($2021, (_x$45 => {
                                                                                                                var $2062 = $2036;
                                                                                                                return $2062;
                                                                                                            }));
                                                                                                            return $2061;
                                                                                                        }));
                                                                                                        var _term$45 = Kind$Term$app$(_term$43, _lamb$44);
                                                                                                        var _term$46 = Kind$Term$let$($2021, _term$45, (_x$46 => {
                                                                                                            var $2063 = $2051;
                                                                                                            return $2063;
                                                                                                        }));
                                                                                                        var $2060 = Parser$Reply$value$($2057, $2058, Kind$Term$ori$($2059, _term$46));
                                                                                                        var $2052 = $2060;
                                                                                                        break;
                                                                                                };
                                                                                                var $2044 = $2052;
                                                                                                break;
                                                                                        };
                                                                                        var $2037 = $2044;
                                                                                        break;
                                                                                };
                                                                                var $2029 = $2037;
                                                                                break;
                                                                        };
                                                                        var $2022 = $2029;
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
    };
    const Kind$Parser$forin$2 = x0 => x1 => Kind$Parser$forin$2$(x0, x1);

    function Kind$Parser$do$statements$(_monad_name$1) {
        var $2064 = Parser$first_of$(List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $2066 = self.idx;
                    var $2067 = self.code;
                    var $2068 = self.err;
                    var $2069 = Parser$Reply$error$($2066, $2067, $2068);
                    var $2065 = $2069;
                    break;
                case 'Parser.Reply.value':
                    var $2070 = self.idx;
                    var $2071 = self.code;
                    var $2072 = self.val;
                    var self = Kind$Parser$text$("var ", $2070, $2071);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2074 = self.idx;
                            var $2075 = self.code;
                            var $2076 = self.err;
                            var $2077 = Parser$Reply$error$($2074, $2075, $2076);
                            var $2073 = $2077;
                            break;
                        case 'Parser.Reply.value':
                            var $2078 = self.idx;
                            var $2079 = self.code;
                            var self = Kind$Parser$name1$($2078, $2079);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2081 = self.idx;
                                    var $2082 = self.code;
                                    var $2083 = self.err;
                                    var $2084 = Parser$Reply$error$($2081, $2082, $2083);
                                    var $2080 = $2084;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2085 = self.idx;
                                    var $2086 = self.code;
                                    var $2087 = self.val;
                                    var self = Kind$Parser$text$("=", $2085, $2086);
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
                                            var self = Kind$Parser$term$($2093, $2094);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2096 = self.idx;
                                                    var $2097 = self.code;
                                                    var $2098 = self.err;
                                                    var $2099 = Parser$Reply$error$($2096, $2097, $2098);
                                                    var $2095 = $2099;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2100 = self.idx;
                                                    var $2101 = self.code;
                                                    var $2102 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2100, $2101);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2104 = self.idx;
                                                            var $2105 = self.code;
                                                            var $2106 = self.err;
                                                            var $2107 = Parser$Reply$error$($2104, $2105, $2106);
                                                            var $2103 = $2107;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2108 = self.idx;
                                                            var $2109 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($2108)($2109);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $2111 = self.idx;
                                                                    var $2112 = self.code;
                                                                    var $2113 = self.err;
                                                                    var $2114 = Parser$Reply$error$($2111, $2112, $2113);
                                                                    var $2110 = $2114;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $2115 = self.idx;
                                                                    var $2116 = self.code;
                                                                    var $2117 = self.val;
                                                                    var self = Kind$Parser$stop$($2072, $2115, $2116);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $2119 = self.idx;
                                                                            var $2120 = self.code;
                                                                            var $2121 = self.err;
                                                                            var $2122 = Parser$Reply$error$($2119, $2120, $2121);
                                                                            var $2118 = $2122;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2123 = self.idx;
                                                                            var $2124 = self.code;
                                                                            var $2125 = self.val;
                                                                            var _term$28 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                                            var _term$29 = Kind$Term$app$(_term$28, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                                            var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                            var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                            var _term$32 = Kind$Term$app$(_term$31, $2102);
                                                                            var _term$33 = Kind$Term$app$(_term$32, Kind$Term$lam$($2087, (_x$33 => {
                                                                                var $2127 = $2117;
                                                                                return $2127;
                                                                            })));
                                                                            var $2126 = Parser$Reply$value$($2123, $2124, Kind$Term$ori$($2125, _term$33));
                                                                            var $2118 = $2126;
                                                                            break;
                                                                    };
                                                                    var $2110 = $2118;
                                                                    break;
                                                            };
                                                            var $2103 = $2110;
                                                            break;
                                                    };
                                                    var $2095 = $2103;
                                                    break;
                                            };
                                            var $2088 = $2095;
                                            break;
                                    };
                                    var $2080 = $2088;
                                    break;
                            };
                            var $2073 = $2080;
                            break;
                    };
                    var $2065 = $2073;
                    break;
            };
            return $2065;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
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
                    var $2135 = self.val;
                    var self = Kind$Parser$text$("let ", $2133, $2134);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2137 = self.idx;
                            var $2138 = self.code;
                            var $2139 = self.err;
                            var $2140 = Parser$Reply$error$($2137, $2138, $2139);
                            var $2136 = $2140;
                            break;
                        case 'Parser.Reply.value':
                            var $2141 = self.idx;
                            var $2142 = self.code;
                            var self = Kind$Parser$name1$($2141, $2142);
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
                                    var $2150 = self.val;
                                    var self = Kind$Parser$text$("=", $2148, $2149);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2152 = self.idx;
                                            var $2153 = self.code;
                                            var $2154 = self.err;
                                            var $2155 = Parser$Reply$error$($2152, $2153, $2154);
                                            var $2151 = $2155;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2156 = self.idx;
                                            var $2157 = self.code;
                                            var self = Kind$Parser$term$($2156, $2157);
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
                                                    var $2165 = self.val;
                                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2163, $2164);
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2167 = self.idx;
                                                            var $2168 = self.code;
                                                            var $2169 = self.err;
                                                            var $2170 = Parser$Reply$error$($2167, $2168, $2169);
                                                            var $2166 = $2170;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2171 = self.idx;
                                                            var $2172 = self.code;
                                                            var self = Kind$Parser$do$statements$(_monad_name$1)($2171)($2172);
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $2174 = self.idx;
                                                                    var $2175 = self.code;
                                                                    var $2176 = self.err;
                                                                    var $2177 = Parser$Reply$error$($2174, $2175, $2176);
                                                                    var $2173 = $2177;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $2178 = self.idx;
                                                                    var $2179 = self.code;
                                                                    var $2180 = self.val;
                                                                    var self = Kind$Parser$stop$($2135, $2178, $2179);
                                                                    switch (self._) {
                                                                        case 'Parser.Reply.error':
                                                                            var $2182 = self.idx;
                                                                            var $2183 = self.code;
                                                                            var $2184 = self.err;
                                                                            var $2185 = Parser$Reply$error$($2182, $2183, $2184);
                                                                            var $2181 = $2185;
                                                                            break;
                                                                        case 'Parser.Reply.value':
                                                                            var $2186 = self.idx;
                                                                            var $2187 = self.code;
                                                                            var $2188 = self.val;
                                                                            var $2189 = Parser$Reply$value$($2186, $2187, Kind$Term$ori$($2188, Kind$Term$let$($2150, $2165, (_x$28 => {
                                                                                var $2190 = $2180;
                                                                                return $2190;
                                                                            }))));
                                                                            var $2181 = $2189;
                                                                            break;
                                                                    };
                                                                    var $2173 = $2181;
                                                                    break;
                                                            };
                                                            var $2166 = $2173;
                                                            break;
                                                    };
                                                    var $2158 = $2166;
                                                    break;
                                            };
                                            var $2151 = $2158;
                                            break;
                                    };
                                    var $2143 = $2151;
                                    break;
                            };
                            var $2136 = $2143;
                            break;
                    };
                    var $2128 = $2136;
                    break;
            };
            return $2128;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
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
                    var $2198 = self.val;
                    var self = Kind$Parser$text$("return ", $2196, $2197);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2200 = self.idx;
                            var $2201 = self.code;
                            var $2202 = self.err;
                            var $2203 = Parser$Reply$error$($2200, $2201, $2202);
                            var $2199 = $2203;
                            break;
                        case 'Parser.Reply.value':
                            var $2204 = self.idx;
                            var $2205 = self.code;
                            var self = Kind$Parser$term$($2204, $2205);
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
                                    var $2213 = self.val;
                                    var self = Parser$maybe$(Kind$Parser$text(";"), $2211, $2212);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2215 = self.idx;
                                            var $2216 = self.code;
                                            var $2217 = self.err;
                                            var $2218 = Parser$Reply$error$($2215, $2216, $2217);
                                            var $2214 = $2218;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2219 = self.idx;
                                            var $2220 = self.code;
                                            var self = Kind$Parser$stop$($2198, $2219, $2220);
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
                                                    var $2228 = self.val;
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.pure"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, $2213);
                                                    var $2229 = Parser$Reply$value$($2226, $2227, Kind$Term$ori$($2228, _term$22));
                                                    var $2221 = $2229;
                                                    break;
                                            };
                                            var $2214 = $2221;
                                            break;
                                    };
                                    var $2206 = $2214;
                                    break;
                            };
                            var $2199 = $2206;
                            break;
                    };
                    var $2191 = $2199;
                    break;
            };
            return $2191;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$init$(_idx$2, _code$3);
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
                    var self = Kind$Parser$term$($2235, $2236);
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
                            var $2245 = self.val;
                            var self = Parser$maybe$(Kind$Parser$text(";"), $2243, $2244);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2247 = self.idx;
                                    var $2248 = self.code;
                                    var $2249 = self.err;
                                    var $2250 = Parser$Reply$error$($2247, $2248, $2249);
                                    var $2246 = $2250;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2251 = self.idx;
                                    var $2252 = self.code;
                                    var self = Kind$Parser$do$statements$(_monad_name$1)($2251)($2252);
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
                                            var self = Kind$Parser$stop$($2237, $2258, $2259);
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
                                                    var _term$19 = Kind$Term$app$(Kind$Term$ref$("Monad.bind"), Kind$Term$ref$(_monad_name$1));
                                                    var _term$20 = Kind$Term$app$(_term$19, Kind$Term$ref$((_monad_name$1 + ".monad")));
                                                    var _term$21 = Kind$Term$app$(_term$20, Kind$Term$hol$(Bits$e));
                                                    var _term$22 = Kind$Term$app$(_term$21, Kind$Term$hol$(Bits$e));
                                                    var _term$23 = Kind$Term$app$(_term$22, $2245);
                                                    var _term$24 = Kind$Term$app$(_term$23, Kind$Term$lam$("", (_x$24 => {
                                                        var $2270 = $2260;
                                                        return $2270;
                                                    })));
                                                    var $2269 = Parser$Reply$value$($2266, $2267, Kind$Term$ori$($2268, _term$24));
                                                    var $2261 = $2269;
                                                    break;
                                            };
                                            var $2253 = $2261;
                                            break;
                                    };
                                    var $2246 = $2253;
                                    break;
                            };
                            var $2238 = $2246;
                            break;
                    };
                    var $2230 = $2238;
                    break;
            };
            return $2230;
        }), List$cons$((_idx$2 => _code$3 => {
            var self = Kind$Parser$term$(_idx$2, _code$3);
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
                    var $2278 = self.val;
                    var self = Parser$maybe$(Kind$Parser$text(";"), $2276, $2277);
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2280 = self.idx;
                            var $2281 = self.code;
                            var $2282 = self.err;
                            var $2283 = Parser$Reply$error$($2280, $2281, $2282);
                            var $2279 = $2283;
                            break;
                        case 'Parser.Reply.value':
                            var $2284 = self.idx;
                            var $2285 = self.code;
                            var $2286 = Parser$Reply$value$($2284, $2285, $2278);
                            var $2279 = $2286;
                            break;
                    };
                    var $2271 = $2279;
                    break;
            };
            return $2271;
        }), List$nil))))));
        return $2064;
    };
    const Kind$Parser$do$statements = x0 => Kind$Parser$do$statements$(x0);

    function Kind$Parser$do$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("do ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2288 = self.idx;
                var $2289 = self.code;
                var $2290 = self.err;
                var $2291 = Parser$Reply$error$($2288, $2289, $2290);
                var $2287 = $2291;
                break;
            case 'Parser.Reply.value':
                var $2292 = self.idx;
                var $2293 = self.code;
                var self = Kind$Parser$name1$($2292, $2293);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2295 = self.idx;
                        var $2296 = self.code;
                        var $2297 = self.err;
                        var $2298 = Parser$Reply$error$($2295, $2296, $2297);
                        var $2294 = $2298;
                        break;
                    case 'Parser.Reply.value':
                        var $2299 = self.idx;
                        var $2300 = self.code;
                        var $2301 = self.val;
                        var self = Kind$Parser$text$("{", $2299, $2300);
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
                                var self = Kind$Parser$do$statements$($2301)($2307)($2308);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2310 = self.idx;
                                        var $2311 = self.code;
                                        var $2312 = self.err;
                                        var $2313 = Parser$Reply$error$($2310, $2311, $2312);
                                        var $2309 = $2313;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2314 = self.idx;
                                        var $2315 = self.code;
                                        var $2316 = self.val;
                                        var self = Kind$Parser$text$("}", $2314, $2315);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2318 = self.idx;
                                                var $2319 = self.code;
                                                var $2320 = self.err;
                                                var $2321 = Parser$Reply$error$($2318, $2319, $2320);
                                                var $2317 = $2321;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2322 = self.idx;
                                                var $2323 = self.code;
                                                var $2324 = Parser$Reply$value$($2322, $2323, $2316);
                                                var $2317 = $2324;
                                                break;
                                        };
                                        var $2309 = $2317;
                                        break;
                                };
                                var $2302 = $2309;
                                break;
                        };
                        var $2294 = $2302;
                        break;
                };
                var $2287 = $2294;
                break;
        };
        return $2287;
    };
    const Kind$Parser$do = x0 => x1 => Kind$Parser$do$(x0, x1);

    function Kind$Term$nat$(_natx$1) {
        var $2325 = ({
            _: 'Kind.Term.nat',
            'natx': _natx$1
        });
        return $2325;
    };
    const Kind$Term$nat = x0 => Kind$Term$nat$(x0);

    function Kind$Term$unroll_nat$(_natx$1) {
        var self = _natx$1;
        if (self === 0n) {
            var $2327 = Kind$Term$ref$(Kind$Name$read$("Nat.zero"));
            var $2326 = $2327;
        } else {
            var $2328 = (self - 1n);
            var _func$3 = Kind$Term$ref$(Kind$Name$read$("Nat.succ"));
            var _argm$4 = Kind$Term$nat$($2328);
            var $2329 = Kind$Term$app$(_func$3, _argm$4);
            var $2326 = $2329;
        };
        return $2326;
    };
    const Kind$Term$unroll_nat = x0 => Kind$Term$unroll_nat$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Kind$Term$unroll_chr$bits$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2331 = self.slice(0, -1);
                var $2332 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.o")), Kind$Term$unroll_chr$bits$($2331));
                var $2330 = $2332;
                break;
            case 'i':
                var $2333 = self.slice(0, -1);
                var $2334 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("Bits.i")), Kind$Term$unroll_chr$bits$($2333));
                var $2330 = $2334;
                break;
            case 'e':
                var $2335 = Kind$Term$ref$(Kind$Name$read$("Bits.e"));
                var $2330 = $2335;
                break;
        };
        return $2330;
    };
    const Kind$Term$unroll_chr$bits = x0 => Kind$Term$unroll_chr$bits$(x0);

    function Kind$Term$unroll_chr$(_chrx$1) {
        var _bits$2 = (u16_to_bits(_chrx$1));
        var _term$3 = Kind$Term$ref$(Kind$Name$read$("Word.from_bits"));
        var _term$4 = Kind$Term$app$(_term$3, Kind$Term$nat$(16n));
        var _term$5 = Kind$Term$app$(_term$4, Kind$Term$unroll_chr$bits$(_bits$2));
        var _term$6 = Kind$Term$app$(Kind$Term$ref$(Kind$Name$read$("U16.new")), _term$5);
        var $2336 = _term$6;
        return $2336;
    };
    const Kind$Term$unroll_chr = x0 => Kind$Term$unroll_chr$(x0);

    function Kind$Term$unroll_str$(_strx$1) {
        var self = _strx$1;
        if (self.length === 0) {
            var $2338 = Kind$Term$ref$(Kind$Name$read$("String.nil"));
            var $2337 = $2338;
        } else {
            var $2339 = self.charCodeAt(0);
            var $2340 = self.slice(1);
            var _char$4 = Kind$Term$chr$($2339);
            var _term$5 = Kind$Term$ref$(Kind$Name$read$("String.cons"));
            var _term$6 = Kind$Term$app$(_term$5, _char$4);
            var _term$7 = Kind$Term$app$(_term$6, Kind$Term$str$($2340));
            var $2341 = _term$7;
            var $2337 = $2341;
        };
        return $2337;
    };
    const Kind$Term$unroll_str = x0 => Kind$Term$unroll_str$(x0);

    function Kind$Term$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $2343 = self.name;
                var self = Kind$get$($2343, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $2345 = self.value;
                        var self = $2345;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $2347 = self.term;
                                var $2348 = Kind$Term$reduce$($2347, _defs$2);
                                var $2346 = $2348;
                                break;
                        };
                        var $2344 = $2346;
                        break;
                    case 'Maybe.none':
                        var $2349 = Kind$Term$ref$($2343);
                        var $2344 = $2349;
                        break;
                };
                var $2342 = $2344;
                break;
            case 'Kind.Term.app':
                var $2350 = self.func;
                var $2351 = self.argm;
                var _func$5 = Kind$Term$reduce$($2350, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $2353 = self.body;
                        var $2354 = Kind$Term$reduce$($2353($2351), _defs$2);
                        var $2352 = $2354;
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
                        var $2355 = _term$1;
                        var $2352 = $2355;
                        break;
                };
                var $2342 = $2352;
                break;
            case 'Kind.Term.let':
                var $2356 = self.expr;
                var $2357 = self.body;
                var $2358 = Kind$Term$reduce$($2357($2356), _defs$2);
                var $2342 = $2358;
                break;
            case 'Kind.Term.def':
                var $2359 = self.expr;
                var $2360 = self.body;
                var $2361 = Kind$Term$reduce$($2360($2359), _defs$2);
                var $2342 = $2361;
                break;
            case 'Kind.Term.ann':
                var $2362 = self.term;
                var $2363 = Kind$Term$reduce$($2362, _defs$2);
                var $2342 = $2363;
                break;
            case 'Kind.Term.nat':
                var $2364 = self.natx;
                var $2365 = Kind$Term$reduce$(Kind$Term$unroll_nat$($2364), _defs$2);
                var $2342 = $2365;
                break;
            case 'Kind.Term.chr':
                var $2366 = self.chrx;
                var $2367 = Kind$Term$reduce$(Kind$Term$unroll_chr$($2366), _defs$2);
                var $2342 = $2367;
                break;
            case 'Kind.Term.str':
                var $2368 = self.strx;
                var $2369 = Kind$Term$reduce$(Kind$Term$unroll_str$($2368), _defs$2);
                var $2342 = $2369;
                break;
            case 'Kind.Term.ori':
                var $2370 = self.expr;
                var $2371 = Kind$Term$reduce$($2370, _defs$2);
                var $2342 = $2371;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.typ':
            case 'Kind.Term.all':
            case 'Kind.Term.lam':
            case 'Kind.Term.gol':
            case 'Kind.Term.hol':
            case 'Kind.Term.cse':
                var $2372 = _term$1;
                var $2342 = $2372;
                break;
        };
        return $2342;
    };
    const Kind$Term$reduce = x0 => x1 => Kind$Term$reduce$(x0, x1);
    const Map$new = ({
        _: 'Map.new'
    });

    function Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$9) {
        var $2373 = ({
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
        return $2373;
    };
    const Kind$Def$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Def$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const Kind$Status$init = ({
        _: 'Kind.Status.init'
    });

    function Kind$Parser$case$with$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("with", _idx$1, _code$2);
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
                var self = Kind$Parser$name1$($2379, $2380);
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
                        var self = Kind$Parser$text$(":", $2386, $2387);
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
                                var self = Kind$Parser$term$($2394, $2395);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2397 = self.idx;
                                        var $2398 = self.code;
                                        var $2399 = self.err;
                                        var $2400 = Parser$Reply$error$($2397, $2398, $2399);
                                        var $2396 = $2400;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2401 = self.idx;
                                        var $2402 = self.code;
                                        var $2403 = self.val;
                                        var self = Kind$Parser$text$("=", $2401, $2402);
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
                                                        var $2419 = Parser$Reply$value$($2416, $2417, Kind$Def$new$("", "", Pair$new$(0n, 0n), $2388, $2418, $2403, Bool$false, 0n, Kind$Status$init));
                                                        var $2411 = $2419;
                                                        break;
                                                };
                                                var $2404 = $2411;
                                                break;
                                        };
                                        var $2396 = $2404;
                                        break;
                                };
                                var $2389 = $2396;
                                break;
                        };
                        var $2381 = $2389;
                        break;
                };
                var $2374 = $2381;
                break;
        };
        return $2374;
    };
    const Kind$Parser$case$with = x0 => x1 => Kind$Parser$case$with$(x0, x1);

    function Kind$Parser$case$case$(_idx$1, _code$2) {
        var self = Kind$Parser$name1$(_idx$1, _code$2);
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
                var $2427 = self.val;
                var self = Kind$Parser$text$(":", $2425, $2426);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2429 = self.idx;
                        var $2430 = self.code;
                        var $2431 = self.err;
                        var $2432 = Parser$Reply$error$($2429, $2430, $2431);
                        var $2428 = $2432;
                        break;
                    case 'Parser.Reply.value':
                        var $2433 = self.idx;
                        var $2434 = self.code;
                        var self = Kind$Parser$term$($2433, $2434);
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
                                var $2442 = self.val;
                                var self = Parser$maybe$(Kind$Parser$text(","), $2440, $2441);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2444 = self.idx;
                                        var $2445 = self.code;
                                        var $2446 = self.err;
                                        var $2447 = Parser$Reply$error$($2444, $2445, $2446);
                                        var $2443 = $2447;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2448 = self.idx;
                                        var $2449 = self.code;
                                        var $2450 = Parser$Reply$value$($2448, $2449, Pair$new$($2427, $2442));
                                        var $2443 = $2450;
                                        break;
                                };
                                var $2435 = $2443;
                                break;
                        };
                        var $2428 = $2435;
                        break;
                };
                var $2420 = $2428;
                break;
        };
        return $2420;
    };
    const Kind$Parser$case$case = x0 => x1 => Kind$Parser$case$case$(x0, x1);

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $2451 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $2451;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2453 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2455 = self.val;
                        var $2456 = self.lft;
                        var $2457 = self.rgt;
                        var $2458 = Map$tie$($2455, Map$set$($2453, _val$3, $2456), $2457);
                        var $2454 = $2458;
                        break;
                    case 'Map.new':
                        var $2459 = Map$tie$(Maybe$none, Map$set$($2453, _val$3, Map$new), Map$new);
                        var $2454 = $2459;
                        break;
                };
                var $2452 = $2454;
                break;
            case 'i':
                var $2460 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2462 = self.val;
                        var $2463 = self.lft;
                        var $2464 = self.rgt;
                        var $2465 = Map$tie$($2462, $2463, Map$set$($2460, _val$3, $2464));
                        var $2461 = $2465;
                        break;
                    case 'Map.new':
                        var $2466 = Map$tie$(Maybe$none, Map$new, Map$set$($2460, _val$3, Map$new));
                        var $2461 = $2466;
                        break;
                };
                var $2452 = $2461;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $2468 = self.lft;
                        var $2469 = self.rgt;
                        var $2470 = Map$tie$(Maybe$some$(_val$3), $2468, $2469);
                        var $2467 = $2470;
                        break;
                    case 'Map.new':
                        var $2471 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $2467 = $2471;
                        break;
                };
                var $2452 = $2467;
                break;
        };
        return $2452;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $2473 = self.head;
                var $2474 = self.tail;
                var self = $2473;
                switch (self._) {
                    case 'Pair.new':
                        var $2476 = self.fst;
                        var $2477 = self.snd;
                        var $2478 = Map$set$($2476, $2477, Map$from_list$($2474));
                        var $2475 = $2478;
                        break;
                };
                var $2472 = $2475;
                break;
            case 'List.nil':
                var $2479 = Map$new;
                var $2472 = $2479;
                break;
        };
        return $2472;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2481 = self.fst;
                var $2482 = $2481;
                var $2480 = $2482;
                break;
        };
        return $2480;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2484 = self.snd;
                var $2485 = $2484;
                var $2483 = $2485;
                break;
        };
        return $2483;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Kind$Term$cse$(_path$1, _expr$2, _name$3, _with$4, _cses$5, _moti$6) {
        var $2486 = ({
            _: 'Kind.Term.cse',
            'path': _path$1,
            'expr': _expr$2,
            'name': _name$3,
            'with': _with$4,
            'cses': _cses$5,
            'moti': _moti$6
        });
        return $2486;
    };
    const Kind$Term$cse = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$cse$(x0, x1, x2, x3, x4, x5);

    function Kind$Parser$case$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2488 = self.idx;
                var $2489 = self.code;
                var $2490 = self.err;
                var $2491 = Parser$Reply$error$($2488, $2489, $2490);
                var $2487 = $2491;
                break;
            case 'Parser.Reply.value':
                var $2492 = self.idx;
                var $2493 = self.code;
                var $2494 = self.val;
                var self = Kind$Parser$text$("case ", $2492, $2493);
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
                        var self = Kind$Parser$spaces($2500)($2501);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2503 = self.idx;
                                var $2504 = self.code;
                                var $2505 = self.err;
                                var $2506 = Parser$Reply$error$($2503, $2504, $2505);
                                var $2502 = $2506;
                                break;
                            case 'Parser.Reply.value':
                                var $2507 = self.idx;
                                var $2508 = self.code;
                                var self = Kind$Parser$term$($2507, $2508);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2510 = self.idx;
                                        var $2511 = self.code;
                                        var $2512 = self.err;
                                        var $2513 = Parser$Reply$error$($2510, $2511, $2512);
                                        var $2509 = $2513;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2514 = self.idx;
                                        var $2515 = self.code;
                                        var $2516 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
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
                                                    var $2525 = Kind$Parser$name1$($2523, $2524);
                                                    var $2518 = $2525;
                                                    break;
                                            };
                                            return $2518;
                                        }), $2514, $2515);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2526 = self.idx;
                                                var $2527 = self.code;
                                                var $2528 = self.err;
                                                var $2529 = Parser$Reply$error$($2526, $2527, $2528);
                                                var $2517 = $2529;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2530 = self.idx;
                                                var $2531 = self.code;
                                                var $2532 = self.val;
                                                var self = $2532;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2534 = self.value;
                                                        var $2535 = $2534;
                                                        var _name$18 = $2535;
                                                        break;
                                                    case 'Maybe.none':
                                                        var self = Kind$Term$reduce$($2516, Map$new);
                                                        switch (self._) {
                                                            case 'Kind.Term.var':
                                                                var $2537 = self.name;
                                                                var $2538 = $2537;
                                                                var $2536 = $2538;
                                                                break;
                                                            case 'Kind.Term.ref':
                                                                var $2539 = self.name;
                                                                var $2540 = $2539;
                                                                var $2536 = $2540;
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
                                                                var $2541 = Kind$Name$read$("self");
                                                                var $2536 = $2541;
                                                                break;
                                                        };
                                                        var _name$18 = $2536;
                                                        break;
                                                };
                                                var self = Parser$many$(Kind$Parser$case$with)($2530)($2531);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2542 = self.idx;
                                                        var $2543 = self.code;
                                                        var $2544 = self.err;
                                                        var $2545 = Parser$Reply$error$($2542, $2543, $2544);
                                                        var $2533 = $2545;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2546 = self.idx;
                                                        var $2547 = self.code;
                                                        var $2548 = self.val;
                                                        var self = Kind$Parser$text$("{", $2546, $2547);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2550 = self.idx;
                                                                var $2551 = self.code;
                                                                var $2552 = self.err;
                                                                var $2553 = Parser$Reply$error$($2550, $2551, $2552);
                                                                var $2549 = $2553;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2554 = self.idx;
                                                                var $2555 = self.code;
                                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$case$case)($2554)($2555);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2557 = self.idx;
                                                                        var $2558 = self.code;
                                                                        var $2559 = self.err;
                                                                        var $2560 = Parser$Reply$error$($2557, $2558, $2559);
                                                                        var $2556 = $2560;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2561 = self.idx;
                                                                        var $2562 = self.code;
                                                                        var $2563 = self.val;
                                                                        var _cses$28 = Map$from_list$(List$mapped$($2563, (_x$28 => {
                                                                            var $2565 = Pair$new$((kind_name_to_bits(Pair$fst$(_x$28))), Pair$snd$(_x$28));
                                                                            return $2565;
                                                                        })));
                                                                        var self = Parser$first_of$(List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$(":", _idx$29, _code$30);
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
                                                                                    var self = Kind$Parser$term$($2571, $2572);
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
                                                                                            var $2581 = Parser$Reply$value$($2578, $2579, Maybe$some$($2580));
                                                                                            var $2573 = $2581;
                                                                                            break;
                                                                                    };
                                                                                    var $2566 = $2573;
                                                                                    break;
                                                                            };
                                                                            return $2566;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var self = Kind$Parser$text$("!", _idx$29, _code$30);
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $2583 = self.idx;
                                                                                    var $2584 = self.code;
                                                                                    var $2585 = self.err;
                                                                                    var $2586 = Parser$Reply$error$($2583, $2584, $2585);
                                                                                    var $2582 = $2586;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $2587 = self.idx;
                                                                                    var $2588 = self.code;
                                                                                    var $2589 = Parser$Reply$value$($2587, $2588, Maybe$none);
                                                                                    var $2582 = $2589;
                                                                                    break;
                                                                            };
                                                                            return $2582;
                                                                        }), List$cons$((_idx$29 => _code$30 => {
                                                                            var $2590 = Parser$Reply$value$(_idx$29, _code$30, Maybe$some$(Kind$Term$hol$(Bits$e)));
                                                                            return $2590;
                                                                        }), List$nil))))($2561)($2562);
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $2591 = self.idx;
                                                                                var $2592 = self.code;
                                                                                var $2593 = self.err;
                                                                                var $2594 = Parser$Reply$error$($2591, $2592, $2593);
                                                                                var $2564 = $2594;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $2595 = self.idx;
                                                                                var $2596 = self.code;
                                                                                var $2597 = self.val;
                                                                                var self = Kind$Parser$stop$($2494, $2595, $2596);
                                                                                switch (self._) {
                                                                                    case 'Parser.Reply.error':
                                                                                        var $2599 = self.idx;
                                                                                        var $2600 = self.code;
                                                                                        var $2601 = self.err;
                                                                                        var $2602 = Parser$Reply$error$($2599, $2600, $2601);
                                                                                        var $2598 = $2602;
                                                                                        break;
                                                                                    case 'Parser.Reply.value':
                                                                                        var $2603 = self.idx;
                                                                                        var $2604 = self.code;
                                                                                        var $2605 = self.val;
                                                                                        var $2606 = Parser$Reply$value$($2603, $2604, Kind$Term$ori$($2605, Kind$Term$cse$(Bits$e, $2516, _name$18, $2548, _cses$28, $2597)));
                                                                                        var $2598 = $2606;
                                                                                        break;
                                                                                };
                                                                                var $2564 = $2598;
                                                                                break;
                                                                        };
                                                                        var $2556 = $2564;
                                                                        break;
                                                                };
                                                                var $2549 = $2556;
                                                                break;
                                                        };
                                                        var $2533 = $2549;
                                                        break;
                                                };
                                                var $2517 = $2533;
                                                break;
                                        };
                                        var $2509 = $2517;
                                        break;
                                };
                                var $2502 = $2509;
                                break;
                        };
                        var $2495 = $2502;
                        break;
                };
                var $2487 = $2495;
                break;
        };
        return $2487;
    };
    const Kind$Parser$case = x0 => x1 => Kind$Parser$case$(x0, x1);

    function Kind$set$(_name$2, _val$3, _map$4) {
        var $2607 = Map$set$((kind_name_to_bits(_name$2)), _val$3, _map$4);
        return $2607;
    };
    const Kind$set = x0 => x1 => x2 => Kind$set$(x0, x1, x2);

    function Kind$Parser$open$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("open ", $2613, $2614);
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
                        var self = Kind$Parser$spaces($2621)($2622);
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
                                var self = Kind$Parser$term$($2628, $2629);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2631 = self.idx;
                                        var $2632 = self.code;
                                        var $2633 = self.err;
                                        var $2634 = Parser$Reply$error$($2631, $2632, $2633);
                                        var $2630 = $2634;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2635 = self.idx;
                                        var $2636 = self.code;
                                        var $2637 = self.val;
                                        var self = Parser$maybe$((_idx$15 => _code$16 => {
                                            var self = Kind$Parser$text$("as", _idx$15, _code$16);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2640 = self.idx;
                                                    var $2641 = self.code;
                                                    var $2642 = self.err;
                                                    var $2643 = Parser$Reply$error$($2640, $2641, $2642);
                                                    var $2639 = $2643;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2644 = self.idx;
                                                    var $2645 = self.code;
                                                    var $2646 = Kind$Parser$name1$($2644, $2645);
                                                    var $2639 = $2646;
                                                    break;
                                            };
                                            return $2639;
                                        }), $2635, $2636);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2647 = self.idx;
                                                var $2648 = self.code;
                                                var $2649 = self.err;
                                                var $2650 = Parser$Reply$error$($2647, $2648, $2649);
                                                var $2638 = $2650;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2651 = self.idx;
                                                var $2652 = self.code;
                                                var $2653 = self.val;
                                                var self = Parser$maybe$(Kind$Parser$text(";"), $2651, $2652);
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
                                                        var self = $2653;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2662 = self.value;
                                                                var $2663 = $2662;
                                                                var _name$21 = $2663;
                                                                break;
                                                            case 'Maybe.none':
                                                                var self = Kind$Term$reduce$($2637, Map$new);
                                                                switch (self._) {
                                                                    case 'Kind.Term.var':
                                                                        var $2665 = self.name;
                                                                        var $2666 = $2665;
                                                                        var $2664 = $2666;
                                                                        break;
                                                                    case 'Kind.Term.ref':
                                                                        var $2667 = self.name;
                                                                        var $2668 = $2667;
                                                                        var $2664 = $2668;
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
                                                                        var $2669 = Kind$Name$read$("self");
                                                                        var $2664 = $2669;
                                                                        break;
                                                                };
                                                                var _name$21 = $2664;
                                                                break;
                                                        };
                                                        var _wyth$22 = List$nil;
                                                        var self = Kind$Parser$term$($2659, $2660);
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2670 = self.idx;
                                                                var $2671 = self.code;
                                                                var $2672 = self.err;
                                                                var $2673 = Parser$Reply$error$($2670, $2671, $2672);
                                                                var $2661 = $2673;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2674 = self.idx;
                                                                var $2675 = self.code;
                                                                var $2676 = self.val;
                                                                var _cses$26 = Kind$set$("_", $2676, Map$new);
                                                                var _moti$27 = Maybe$some$(Kind$Term$hol$(Bits$e));
                                                                var self = Kind$Parser$stop$($2615, $2674, $2675);
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
                                                                        var $2685 = Parser$Reply$value$($2682, $2683, Kind$Term$ori$($2684, Kind$Term$cse$(Bits$e, $2637, _name$21, _wyth$22, _cses$26, _moti$27)));
                                                                        var $2677 = $2685;
                                                                        break;
                                                                };
                                                                var $2661 = $2677;
                                                                break;
                                                        };
                                                        var $2654 = $2661;
                                                        break;
                                                };
                                                var $2638 = $2654;
                                                break;
                                        };
                                        var $2630 = $2638;
                                        break;
                                };
                                var $2623 = $2630;
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
    const Kind$Parser$open = x0 => x1 => Kind$Parser$open$(x0, x1);

    function Parser$digit$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $2687 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
            var $2686 = $2687;
        } else {
            var $2688 = self.charCodeAt(0);
            var $2689 = self.slice(1);
            var _sidx$5 = Nat$succ$(_idx$1);
            var self = ($2688 === 48);
            if (self) {
                var $2691 = Parser$Reply$value$(_sidx$5, $2689, 0n);
                var $2690 = $2691;
            } else {
                var self = ($2688 === 49);
                if (self) {
                    var $2693 = Parser$Reply$value$(_sidx$5, $2689, 1n);
                    var $2692 = $2693;
                } else {
                    var self = ($2688 === 50);
                    if (self) {
                        var $2695 = Parser$Reply$value$(_sidx$5, $2689, 2n);
                        var $2694 = $2695;
                    } else {
                        var self = ($2688 === 51);
                        if (self) {
                            var $2697 = Parser$Reply$value$(_sidx$5, $2689, 3n);
                            var $2696 = $2697;
                        } else {
                            var self = ($2688 === 52);
                            if (self) {
                                var $2699 = Parser$Reply$value$(_sidx$5, $2689, 4n);
                                var $2698 = $2699;
                            } else {
                                var self = ($2688 === 53);
                                if (self) {
                                    var $2701 = Parser$Reply$value$(_sidx$5, $2689, 5n);
                                    var $2700 = $2701;
                                } else {
                                    var self = ($2688 === 54);
                                    if (self) {
                                        var $2703 = Parser$Reply$value$(_sidx$5, $2689, 6n);
                                        var $2702 = $2703;
                                    } else {
                                        var self = ($2688 === 55);
                                        if (self) {
                                            var $2705 = Parser$Reply$value$(_sidx$5, $2689, 7n);
                                            var $2704 = $2705;
                                        } else {
                                            var self = ($2688 === 56);
                                            if (self) {
                                                var $2707 = Parser$Reply$value$(_sidx$5, $2689, 8n);
                                                var $2706 = $2707;
                                            } else {
                                                var self = ($2688 === 57);
                                                if (self) {
                                                    var $2709 = Parser$Reply$value$(_sidx$5, $2689, 9n);
                                                    var $2708 = $2709;
                                                } else {
                                                    var $2710 = Parser$Reply$error$(_idx$1, _code$2, "Not a digit.");
                                                    var $2708 = $2710;
                                                };
                                                var $2706 = $2708;
                                            };
                                            var $2704 = $2706;
                                        };
                                        var $2702 = $2704;
                                    };
                                    var $2700 = $2702;
                                };
                                var $2698 = $2700;
                            };
                            var $2696 = $2698;
                        };
                        var $2694 = $2696;
                    };
                    var $2692 = $2694;
                };
                var $2690 = $2692;
            };
            var $2686 = $2690;
        };
        return $2686;
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
                        var $2711 = self.head;
                        var $2712 = self.tail;
                        var $2713 = Nat$from_base$go$(_b$1, $2712, (_b$1 * _p$3), (($2711 * _p$3) + _res$4));
                        return $2713;
                    case 'List.nil':
                        var $2714 = _res$4;
                        return $2714;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $2715 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $2715;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_idx$1, _code$2) {
        var self = Parser$many1$(Parser$digit, _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2717 = self.idx;
                var $2718 = self.code;
                var $2719 = self.err;
                var $2720 = Parser$Reply$error$($2717, $2718, $2719);
                var $2716 = $2720;
                break;
            case 'Parser.Reply.value':
                var $2721 = self.idx;
                var $2722 = self.code;
                var $2723 = self.val;
                var $2724 = Parser$Reply$value$($2721, $2722, Nat$from_base$(10n, $2723));
                var $2716 = $2724;
                break;
        };
        return $2716;
    };
    const Parser$nat = x0 => x1 => Parser$nat$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2726 = self.slice(0, -1);
                var $2727 = $2726;
                var $2725 = $2727;
                break;
            case 'i':
                var $2728 = self.slice(0, -1);
                var $2729 = $2728;
                var $2725 = $2729;
                break;
            case 'e':
                var $2730 = Bits$e;
                var $2725 = $2730;
                break;
        };
        return $2725;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2732 = self.slice(0, -1);
                var $2733 = ($2732 + '1');
                var $2731 = $2733;
                break;
            case 'i':
                var $2734 = self.slice(0, -1);
                var $2735 = (Bits$inc$($2734) + '0');
                var $2731 = $2735;
                break;
            case 'e':
                var $2736 = (Bits$e + '1');
                var $2731 = $2736;
                break;
        };
        return $2731;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function Maybe$to_bool$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2738 = Bool$false;
                var $2737 = $2738;
                break;
            case 'Maybe.some':
                var $2739 = Bool$true;
                var $2737 = $2739;
                break;
        };
        return $2737;
    };
    const Maybe$to_bool = x0 => Maybe$to_bool$(x0);

    function Kind$Term$gol$(_name$1, _dref$2, _verb$3) {
        var $2740 = ({
            _: 'Kind.Term.gol',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3
        });
        return $2740;
    };
    const Kind$Term$gol = x0 => x1 => x2 => Kind$Term$gol$(x0, x1, x2);

    function Kind$Parser$goal$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2742 = self.idx;
                var $2743 = self.code;
                var $2744 = self.err;
                var $2745 = Parser$Reply$error$($2742, $2743, $2744);
                var $2741 = $2745;
                break;
            case 'Parser.Reply.value':
                var $2746 = self.idx;
                var $2747 = self.code;
                var $2748 = self.val;
                var self = Kind$Parser$text$("?", $2746, $2747);
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
                        var self = Kind$Parser$name$($2754, $2755);
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
                                var $2763 = self.val;
                                var self = Parser$many$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("-", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $2766 = self.idx;
                                            var $2767 = self.code;
                                            var $2768 = self.err;
                                            var $2769 = Parser$Reply$error$($2766, $2767, $2768);
                                            var $2765 = $2769;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $2770 = self.idx;
                                            var $2771 = self.code;
                                            var self = Parser$nat$($2770, $2771);
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2773 = self.idx;
                                                    var $2774 = self.code;
                                                    var $2775 = self.err;
                                                    var $2776 = Parser$Reply$error$($2773, $2774, $2775);
                                                    var $2772 = $2776;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2777 = self.idx;
                                                    var $2778 = self.code;
                                                    var $2779 = self.val;
                                                    var _bits$20 = Bits$reverse$(Bits$tail$(Bits$reverse$((nat_to_bits($2779)))));
                                                    var $2780 = Parser$Reply$value$($2777, $2778, _bits$20);
                                                    var $2772 = $2780;
                                                    break;
                                            };
                                            var $2765 = $2772;
                                            break;
                                    };
                                    return $2765;
                                }))($2761)($2762);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2781 = self.idx;
                                        var $2782 = self.code;
                                        var $2783 = self.err;
                                        var $2784 = Parser$Reply$error$($2781, $2782, $2783);
                                        var $2764 = $2784;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2785 = self.idx;
                                        var $2786 = self.code;
                                        var $2787 = self.val;
                                        var self = Parser$maybe$(Parser$text("-"), $2785, $2786);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2789 = self.idx;
                                                var $2790 = self.code;
                                                var $2791 = self.err;
                                                var $2792 = Parser$Reply$error$($2789, $2790, $2791);
                                                var self = $2792;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2793 = self.idx;
                                                var $2794 = self.code;
                                                var $2795 = self.val;
                                                var $2796 = Parser$Reply$value$($2793, $2794, Maybe$to_bool$($2795));
                                                var self = $2796;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2797 = self.idx;
                                                var $2798 = self.code;
                                                var $2799 = self.err;
                                                var $2800 = Parser$Reply$error$($2797, $2798, $2799);
                                                var $2788 = $2800;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2801 = self.idx;
                                                var $2802 = self.code;
                                                var $2803 = self.val;
                                                var self = Kind$Parser$stop$($2748, $2801, $2802);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $2805 = self.idx;
                                                        var $2806 = self.code;
                                                        var $2807 = self.err;
                                                        var $2808 = Parser$Reply$error$($2805, $2806, $2807);
                                                        var $2804 = $2808;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $2809 = self.idx;
                                                        var $2810 = self.code;
                                                        var $2811 = self.val;
                                                        var $2812 = Parser$Reply$value$($2809, $2810, Kind$Term$ori$($2811, Kind$Term$gol$($2763, $2787, $2803)));
                                                        var $2804 = $2812;
                                                        break;
                                                };
                                                var $2788 = $2804;
                                                break;
                                        };
                                        var $2764 = $2788;
                                        break;
                                };
                                var $2756 = $2764;
                                break;
                        };
                        var $2749 = $2756;
                        break;
                };
                var $2741 = $2749;
                break;
        };
        return $2741;
    };
    const Kind$Parser$goal = x0 => x1 => Kind$Parser$goal$(x0, x1);

    function Kind$Parser$hole$(_idx$1, _code$2) {
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
                var self = Kind$Parser$text$("_", $2818, $2819);
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
                        var self = Kind$Parser$stop$($2820, $2826, $2827);
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
                                var $2836 = Parser$Reply$value$($2833, $2834, Kind$Term$ori$($2835, Kind$Term$hol$(Bits$e)));
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
    const Kind$Parser$hole = x0 => x1 => Kind$Parser$hole$(x0, x1);

    function Kind$Parser$u8$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var $2844 = self.val;
                var self = Kind$Parser$spaces($2842)($2843);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2846 = self.idx;
                        var $2847 = self.code;
                        var $2848 = self.err;
                        var $2849 = Parser$Reply$error$($2846, $2847, $2848);
                        var $2845 = $2849;
                        break;
                    case 'Parser.Reply.value':
                        var $2850 = self.idx;
                        var $2851 = self.code;
                        var self = Parser$nat$($2850, $2851);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2853 = self.idx;
                                var $2854 = self.code;
                                var $2855 = self.err;
                                var $2856 = Parser$Reply$error$($2853, $2854, $2855);
                                var $2852 = $2856;
                                break;
                            case 'Parser.Reply.value':
                                var $2857 = self.idx;
                                var $2858 = self.code;
                                var $2859 = self.val;
                                var self = Parser$text$("b", $2857, $2858);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2861 = self.idx;
                                        var $2862 = self.code;
                                        var $2863 = self.err;
                                        var $2864 = Parser$Reply$error$($2861, $2862, $2863);
                                        var $2860 = $2864;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2865 = self.idx;
                                        var $2866 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u8");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2859));
                                        var self = Kind$Parser$stop$($2844, $2865, $2866);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2868 = self.idx;
                                                var $2869 = self.code;
                                                var $2870 = self.err;
                                                var $2871 = Parser$Reply$error$($2868, $2869, $2870);
                                                var $2867 = $2871;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2872 = self.idx;
                                                var $2873 = self.code;
                                                var $2874 = self.val;
                                                var $2875 = Parser$Reply$value$($2872, $2873, Kind$Term$ori$($2874, _term$16));
                                                var $2867 = $2875;
                                                break;
                                        };
                                        var $2860 = $2867;
                                        break;
                                };
                                var $2852 = $2860;
                                break;
                        };
                        var $2845 = $2852;
                        break;
                };
                var $2837 = $2845;
                break;
        };
        return $2837;
    };
    const Kind$Parser$u8 = x0 => x1 => Kind$Parser$u8$(x0, x1);

    function Kind$Parser$u16$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
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
                var self = Kind$Parser$spaces($2881)($2882);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2885 = self.idx;
                        var $2886 = self.code;
                        var $2887 = self.err;
                        var $2888 = Parser$Reply$error$($2885, $2886, $2887);
                        var $2884 = $2888;
                        break;
                    case 'Parser.Reply.value':
                        var $2889 = self.idx;
                        var $2890 = self.code;
                        var self = Parser$nat$($2889, $2890);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2892 = self.idx;
                                var $2893 = self.code;
                                var $2894 = self.err;
                                var $2895 = Parser$Reply$error$($2892, $2893, $2894);
                                var $2891 = $2895;
                                break;
                            case 'Parser.Reply.value':
                                var $2896 = self.idx;
                                var $2897 = self.code;
                                var $2898 = self.val;
                                var self = Parser$text$("s", $2896, $2897);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2900 = self.idx;
                                        var $2901 = self.code;
                                        var $2902 = self.err;
                                        var $2903 = Parser$Reply$error$($2900, $2901, $2902);
                                        var $2899 = $2903;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2904 = self.idx;
                                        var $2905 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u16");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2898));
                                        var self = Kind$Parser$stop$($2883, $2904, $2905);
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
                                                var $2914 = Parser$Reply$value$($2911, $2912, Kind$Term$ori$($2913, _term$16));
                                                var $2906 = $2914;
                                                break;
                                        };
                                        var $2899 = $2906;
                                        break;
                                };
                                var $2891 = $2899;
                                break;
                        };
                        var $2884 = $2891;
                        break;
                };
                var $2876 = $2884;
                break;
        };
        return $2876;
    };
    const Kind$Parser$u16 = x0 => x1 => Kind$Parser$u16$(x0, x1);

    function Kind$Parser$u32$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2916 = self.idx;
                var $2917 = self.code;
                var $2918 = self.err;
                var $2919 = Parser$Reply$error$($2916, $2917, $2918);
                var $2915 = $2919;
                break;
            case 'Parser.Reply.value':
                var $2920 = self.idx;
                var $2921 = self.code;
                var $2922 = self.val;
                var self = Kind$Parser$spaces($2920)($2921);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2924 = self.idx;
                        var $2925 = self.code;
                        var $2926 = self.err;
                        var $2927 = Parser$Reply$error$($2924, $2925, $2926);
                        var $2923 = $2927;
                        break;
                    case 'Parser.Reply.value':
                        var $2928 = self.idx;
                        var $2929 = self.code;
                        var self = Parser$nat$($2928, $2929);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2931 = self.idx;
                                var $2932 = self.code;
                                var $2933 = self.err;
                                var $2934 = Parser$Reply$error$($2931, $2932, $2933);
                                var $2930 = $2934;
                                break;
                            case 'Parser.Reply.value':
                                var $2935 = self.idx;
                                var $2936 = self.code;
                                var $2937 = self.val;
                                var self = Parser$text$("u", $2935, $2936);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2939 = self.idx;
                                        var $2940 = self.code;
                                        var $2941 = self.err;
                                        var $2942 = Parser$Reply$error$($2939, $2940, $2941);
                                        var $2938 = $2942;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2943 = self.idx;
                                        var $2944 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u32");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2937));
                                        var self = Kind$Parser$stop$($2922, $2943, $2944);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2946 = self.idx;
                                                var $2947 = self.code;
                                                var $2948 = self.err;
                                                var $2949 = Parser$Reply$error$($2946, $2947, $2948);
                                                var $2945 = $2949;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2950 = self.idx;
                                                var $2951 = self.code;
                                                var $2952 = self.val;
                                                var $2953 = Parser$Reply$value$($2950, $2951, Kind$Term$ori$($2952, _term$16));
                                                var $2945 = $2953;
                                                break;
                                        };
                                        var $2938 = $2945;
                                        break;
                                };
                                var $2930 = $2938;
                                break;
                        };
                        var $2923 = $2930;
                        break;
                };
                var $2915 = $2923;
                break;
        };
        return $2915;
    };
    const Kind$Parser$u32 = x0 => x1 => Kind$Parser$u32$(x0, x1);

    function Kind$Parser$u64$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2955 = self.idx;
                var $2956 = self.code;
                var $2957 = self.err;
                var $2958 = Parser$Reply$error$($2955, $2956, $2957);
                var $2954 = $2958;
                break;
            case 'Parser.Reply.value':
                var $2959 = self.idx;
                var $2960 = self.code;
                var $2961 = self.val;
                var self = Kind$Parser$spaces($2959)($2960);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2963 = self.idx;
                        var $2964 = self.code;
                        var $2965 = self.err;
                        var $2966 = Parser$Reply$error$($2963, $2964, $2965);
                        var $2962 = $2966;
                        break;
                    case 'Parser.Reply.value':
                        var $2967 = self.idx;
                        var $2968 = self.code;
                        var self = Parser$nat$($2967, $2968);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $2970 = self.idx;
                                var $2971 = self.code;
                                var $2972 = self.err;
                                var $2973 = Parser$Reply$error$($2970, $2971, $2972);
                                var $2969 = $2973;
                                break;
                            case 'Parser.Reply.value':
                                var $2974 = self.idx;
                                var $2975 = self.code;
                                var $2976 = self.val;
                                var self = Parser$text$("l", $2974, $2975);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2978 = self.idx;
                                        var $2979 = self.code;
                                        var $2980 = self.err;
                                        var $2981 = Parser$Reply$error$($2978, $2979, $2980);
                                        var $2977 = $2981;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2982 = self.idx;
                                        var $2983 = self.code;
                                        var _term$15 = Kind$Term$ref$("Nat.to_u64");
                                        var _term$16 = Kind$Term$app$(_term$15, Kind$Term$nat$($2976));
                                        var self = Kind$Parser$stop$($2961, $2982, $2983);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2985 = self.idx;
                                                var $2986 = self.code;
                                                var $2987 = self.err;
                                                var $2988 = Parser$Reply$error$($2985, $2986, $2987);
                                                var $2984 = $2988;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2989 = self.idx;
                                                var $2990 = self.code;
                                                var $2991 = self.val;
                                                var $2992 = Parser$Reply$value$($2989, $2990, Kind$Term$ori$($2991, _term$16));
                                                var $2984 = $2992;
                                                break;
                                        };
                                        var $2977 = $2984;
                                        break;
                                };
                                var $2969 = $2977;
                                break;
                        };
                        var $2962 = $2969;
                        break;
                };
                var $2954 = $2962;
                break;
        };
        return $2954;
    };
    const Kind$Parser$u64 = x0 => x1 => Kind$Parser$u64$(x0, x1);

    function Kind$Parser$nat$(_idx$1, _code$2) {
        var self = Kind$Parser$init$(_idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $2994 = self.idx;
                var $2995 = self.code;
                var $2996 = self.err;
                var $2997 = Parser$Reply$error$($2994, $2995, $2996);
                var $2993 = $2997;
                break;
            case 'Parser.Reply.value':
                var $2998 = self.idx;
                var $2999 = self.code;
                var $3000 = self.val;
                var self = Kind$Parser$spaces($2998)($2999);
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
                        var self = Parser$nat$($3006, $3007);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3009 = self.idx;
                                var $3010 = self.code;
                                var $3011 = self.err;
                                var $3012 = Parser$Reply$error$($3009, $3010, $3011);
                                var $3008 = $3012;
                                break;
                            case 'Parser.Reply.value':
                                var $3013 = self.idx;
                                var $3014 = self.code;
                                var $3015 = self.val;
                                var self = Kind$Parser$stop$($3000, $3013, $3014);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3017 = self.idx;
                                        var $3018 = self.code;
                                        var $3019 = self.err;
                                        var $3020 = Parser$Reply$error$($3017, $3018, $3019);
                                        var $3016 = $3020;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3021 = self.idx;
                                        var $3022 = self.code;
                                        var $3023 = self.val;
                                        var $3024 = Parser$Reply$value$($3021, $3022, Kind$Term$ori$($3023, Kind$Term$nat$($3015)));
                                        var $3016 = $3024;
                                        break;
                                };
                                var $3008 = $3016;
                                break;
                        };
                        var $3001 = $3008;
                        break;
                };
                var $2993 = $3001;
                break;
        };
        return $2993;
    };
    const Kind$Parser$nat = x0 => x1 => Kind$Parser$nat$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $3025 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $3025;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);

    function Kind$Parser$reference$(_idx$1, _code$2) {
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
                var self = Kind$Parser$name1$($3031, $3032);
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
                        var $3041 = self.val;
                        var self = ($3041 === "case");
                        if (self) {
                            var $3043 = Parser$fail("Reserved keyword.");
                            var $3042 = $3043;
                        } else {
                            var self = ($3041 === "do");
                            if (self) {
                                var $3045 = Parser$fail("Reserved keyword.");
                                var $3044 = $3045;
                            } else {
                                var self = ($3041 === "if");
                                if (self) {
                                    var $3047 = Parser$fail("Reserved keyword.");
                                    var $3046 = $3047;
                                } else {
                                    var self = ($3041 === "with");
                                    if (self) {
                                        var $3049 = Parser$fail("Reserved keyword.");
                                        var $3048 = $3049;
                                    } else {
                                        var self = ($3041 === "let");
                                        if (self) {
                                            var $3051 = Parser$fail("Reserved keyword.");
                                            var $3050 = $3051;
                                        } else {
                                            var self = ($3041 === "def");
                                            if (self) {
                                                var $3053 = Parser$fail("Reserved keyword.");
                                                var $3052 = $3053;
                                            } else {
                                                var self = ($3041 === "true");
                                                if (self) {
                                                    var $3055 = (_idx$9 => _code$10 => {
                                                        var $3056 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.true"));
                                                        return $3056;
                                                    });
                                                    var $3054 = $3055;
                                                } else {
                                                    var self = ($3041 === "false");
                                                    if (self) {
                                                        var $3058 = (_idx$9 => _code$10 => {
                                                            var $3059 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Bool.false"));
                                                            return $3059;
                                                        });
                                                        var $3057 = $3058;
                                                    } else {
                                                        var self = ($3041 === "unit");
                                                        if (self) {
                                                            var $3061 = (_idx$9 => _code$10 => {
                                                                var $3062 = Parser$Reply$value$(_idx$9, _code$10, Kind$Term$ref$("Unit.new"));
                                                                return $3062;
                                                            });
                                                            var $3060 = $3061;
                                                        } else {
                                                            var self = ($3041 === "none");
                                                            if (self) {
                                                                var _term$9 = Kind$Term$ref$("Maybe.none");
                                                                var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                var $3064 = (_idx$11 => _code$12 => {
                                                                    var $3065 = Parser$Reply$value$(_idx$11, _code$12, _term$10);
                                                                    return $3065;
                                                                });
                                                                var $3063 = $3064;
                                                            } else {
                                                                var self = ($3041 === "refl");
                                                                if (self) {
                                                                    var _term$9 = Kind$Term$ref$("Equal.refl");
                                                                    var _term$10 = Kind$Term$app$(_term$9, Kind$Term$hol$(Bits$e));
                                                                    var _term$11 = Kind$Term$app$(_term$10, Kind$Term$hol$(Bits$e));
                                                                    var $3067 = (_idx$12 => _code$13 => {
                                                                        var $3068 = Parser$Reply$value$(_idx$12, _code$13, _term$11);
                                                                        return $3068;
                                                                    });
                                                                    var $3066 = $3067;
                                                                } else {
                                                                    var $3069 = (_idx$9 => _code$10 => {
                                                                        var self = Kind$Parser$stop$($3033, _idx$9, _code$10);
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
                                                                                var $3077 = self.val;
                                                                                var $3078 = Parser$Reply$value$($3075, $3076, Kind$Term$ori$($3077, Kind$Term$ref$($3041)));
                                                                                var $3070 = $3078;
                                                                                break;
                                                                        };
                                                                        return $3070;
                                                                    });
                                                                    var $3066 = $3069;
                                                                };
                                                                var $3063 = $3066;
                                                            };
                                                            var $3060 = $3063;
                                                        };
                                                        var $3057 = $3060;
                                                    };
                                                    var $3054 = $3057;
                                                };
                                                var $3052 = $3054;
                                            };
                                            var $3050 = $3052;
                                        };
                                        var $3048 = $3050;
                                    };
                                    var $3046 = $3048;
                                };
                                var $3044 = $3046;
                            };
                            var $3042 = $3044;
                        };
                        var $3042 = $3042($3039)($3040);
                        var $3034 = $3042;
                        break;
                };
                var $3026 = $3034;
                break;
        };
        return $3026;
    };
    const Kind$Parser$reference = x0 => x1 => Kind$Parser$reference$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kind$Parser$application$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$text$("(", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3080 = self.idx;
                var $3081 = self.code;
                var $3082 = self.err;
                var $3083 = Parser$Reply$error$($3080, $3081, $3082);
                var $3079 = $3083;
                break;
            case 'Parser.Reply.value':
                var $3084 = self.idx;
                var $3085 = self.code;
                var self = Parser$until1$(Kind$Parser$text(")"), Kind$Parser$item(Kind$Parser$term), $3084, $3085);
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
                        var self = Kind$Parser$stop$(_init$1, $3091, $3092);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3095 = self.idx;
                                var $3096 = self.code;
                                var $3097 = self.err;
                                var $3098 = Parser$Reply$error$($3095, $3096, $3097);
                                var $3094 = $3098;
                                break;
                            case 'Parser.Reply.value':
                                var $3099 = self.idx;
                                var $3100 = self.code;
                                var $3101 = self.val;
                                var _expr$14 = (() => {
                                    var $3104 = _func$2;
                                    var $3105 = $3093;
                                    let _f$15 = $3104;
                                    let _x$14;
                                    while ($3105._ === 'List.cons') {
                                        _x$14 = $3105.head;
                                        var $3104 = Kind$Term$app$(_f$15, _x$14);
                                        _f$15 = $3104;
                                        $3105 = $3105.tail;
                                    }
                                    return _f$15;
                                })();
                                var $3102 = Parser$Reply$value$($3099, $3100, Kind$Term$ori$($3101, _expr$14));
                                var $3094 = $3102;
                                break;
                        };
                        var $3086 = $3094;
                        break;
                };
                var $3079 = $3086;
                break;
        };
        return $3079;
    };
    const Kind$Parser$application = x0 => x1 => x2 => x3 => Kind$Parser$application$(x0, x1, x2, x3);
    const Parser$spaces = Parser$many$(Parser$first_of$(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{a}"), List$nil))));

    function Parser$spaces_text$(_text$1, _idx$2, _code$3) {
        var self = Parser$spaces(_idx$2)(_code$3);
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
                var $3113 = Parser$text$(_text$1, $3111, $3112);
                var $3106 = $3113;
                break;
        };
        return $3106;
    };
    const Parser$spaces_text = x0 => x1 => x2 => Parser$spaces_text$(x0, x1, x2);

    function Kind$Parser$application$erased$(_init$1, _func$2, _idx$3, _code$4) {
        var self = Parser$get_index$(_idx$3, _code$4);
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
                var $3121 = self.val;
                var self = Parser$text$("<", $3119, $3120);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3123 = self.idx;
                        var $3124 = self.code;
                        var $3125 = self.err;
                        var $3126 = Parser$Reply$error$($3123, $3124, $3125);
                        var $3122 = $3126;
                        break;
                    case 'Parser.Reply.value':
                        var $3127 = self.idx;
                        var $3128 = self.code;
                        var self = Parser$until1$(Parser$spaces_text(">"), Kind$Parser$item(Kind$Parser$term), $3127, $3128);
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
                                var self = Kind$Parser$stop$($3121, $3134, $3135);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3138 = self.idx;
                                        var $3139 = self.code;
                                        var $3140 = self.err;
                                        var $3141 = Parser$Reply$error$($3138, $3139, $3140);
                                        var $3137 = $3141;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3142 = self.idx;
                                        var $3143 = self.code;
                                        var $3144 = self.val;
                                        var _expr$17 = (() => {
                                            var $3147 = _func$2;
                                            var $3148 = $3136;
                                            let _f$18 = $3147;
                                            let _x$17;
                                            while ($3148._ === 'List.cons') {
                                                _x$17 = $3148.head;
                                                var $3147 = Kind$Term$app$(_f$18, _x$17);
                                                _f$18 = $3147;
                                                $3148 = $3148.tail;
                                            }
                                            return _f$18;
                                        })();
                                        var $3145 = Parser$Reply$value$($3142, $3143, Kind$Term$ori$($3144, _expr$17));
                                        var $3137 = $3145;
                                        break;
                                };
                                var $3129 = $3137;
                                break;
                        };
                        var $3122 = $3129;
                        break;
                };
                var $3114 = $3122;
                break;
        };
        return $3114;
    };
    const Kind$Parser$application$erased = x0 => x1 => x2 => x3 => Kind$Parser$application$erased$(x0, x1, x2, x3);

    function Kind$Parser$arrow$(_init$1, _xtyp$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("->", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3150 = self.idx;
                var $3151 = self.code;
                var $3152 = self.err;
                var $3153 = Parser$Reply$error$($3150, $3151, $3152);
                var $3149 = $3153;
                break;
            case 'Parser.Reply.value':
                var $3154 = self.idx;
                var $3155 = self.code;
                var self = Kind$Parser$term$($3154, $3155);
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
                        var self = Kind$Parser$stop$(_init$1, $3161, $3162);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3165 = self.idx;
                                var $3166 = self.code;
                                var $3167 = self.err;
                                var $3168 = Parser$Reply$error$($3165, $3166, $3167);
                                var $3164 = $3168;
                                break;
                            case 'Parser.Reply.value':
                                var $3169 = self.idx;
                                var $3170 = self.code;
                                var $3171 = self.val;
                                var $3172 = Parser$Reply$value$($3169, $3170, Kind$Term$ori$($3171, Kind$Term$all$(Bool$false, "", "", _xtyp$2, (_s$14 => _x$15 => {
                                    var $3173 = $3163;
                                    return $3173;
                                }))));
                                var $3164 = $3172;
                                break;
                        };
                        var $3156 = $3164;
                        break;
                };
                var $3149 = $3156;
                break;
        };
        return $3149;
    };
    const Kind$Parser$arrow = x0 => x1 => x2 => x3 => Kind$Parser$arrow$(x0, x1, x2, x3);

    function Kind$Parser$op$(_sym$1, _ref$2, _init$3, _val0$4, _idx$5, _code$6) {
        var self = Kind$Parser$text$(_sym$1, _idx$5, _code$6);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3175 = self.idx;
                var $3176 = self.code;
                var $3177 = self.err;
                var $3178 = Parser$Reply$error$($3175, $3176, $3177);
                var $3174 = $3178;
                break;
            case 'Parser.Reply.value':
                var $3179 = self.idx;
                var $3180 = self.code;
                var self = Kind$Parser$term$($3179, $3180);
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
                        var self = Kind$Parser$stop$(_init$3, $3186, $3187);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3190 = self.idx;
                                var $3191 = self.code;
                                var $3192 = self.err;
                                var $3193 = Parser$Reply$error$($3190, $3191, $3192);
                                var $3189 = $3193;
                                break;
                            case 'Parser.Reply.value':
                                var $3194 = self.idx;
                                var $3195 = self.code;
                                var $3196 = self.val;
                                var _term$16 = Kind$Term$ref$(_ref$2);
                                var _term$17 = Kind$Term$app$(_term$16, _val0$4);
                                var _term$18 = Kind$Term$app$(_term$17, $3188);
                                var $3197 = Parser$Reply$value$($3194, $3195, Kind$Term$ori$($3196, _term$18));
                                var $3189 = $3197;
                                break;
                        };
                        var $3181 = $3189;
                        break;
                };
                var $3174 = $3181;
                break;
        };
        return $3174;
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
                var $3199 = self.idx;
                var $3200 = self.code;
                var $3201 = self.err;
                var $3202 = Parser$Reply$error$($3199, $3200, $3201);
                var $3198 = $3202;
                break;
            case 'Parser.Reply.value':
                var $3203 = self.idx;
                var $3204 = self.code;
                var self = Kind$Parser$term$($3203, $3204);
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
                        var $3212 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3210, $3211);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3214 = self.idx;
                                var $3215 = self.code;
                                var $3216 = self.err;
                                var $3217 = Parser$Reply$error$($3214, $3215, $3216);
                                var $3213 = $3217;
                                break;
                            case 'Parser.Reply.value':
                                var $3218 = self.idx;
                                var $3219 = self.code;
                                var _term$14 = Kind$Term$ref$("List.cons");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _head$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3212);
                                var self = Kind$Parser$stop$(_init$1, $3218, $3219);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3221 = self.idx;
                                        var $3222 = self.code;
                                        var $3223 = self.err;
                                        var $3224 = Parser$Reply$error$($3221, $3222, $3223);
                                        var $3220 = $3224;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3225 = self.idx;
                                        var $3226 = self.code;
                                        var $3227 = self.val;
                                        var $3228 = Parser$Reply$value$($3225, $3226, Kind$Term$ori$($3227, _term$17));
                                        var $3220 = $3228;
                                        break;
                                };
                                var $3213 = $3220;
                                break;
                        };
                        var $3205 = $3213;
                        break;
                };
                var $3198 = $3205;
                break;
        };
        return $3198;
    };
    const Kind$Parser$cons = x0 => x1 => x2 => x3 => Kind$Parser$cons$(x0, x1, x2, x3);

    function Kind$Parser$concat$(_init$1, _lst0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("++", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3230 = self.idx;
                var $3231 = self.code;
                var $3232 = self.err;
                var $3233 = Parser$Reply$error$($3230, $3231, $3232);
                var $3229 = $3233;
                break;
            case 'Parser.Reply.value':
                var $3234 = self.idx;
                var $3235 = self.code;
                var self = Kind$Parser$term$($3234, $3235);
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
                        var self = Kind$Parser$stop$(_init$1, $3241, $3242);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3245 = self.idx;
                                var $3246 = self.code;
                                var $3247 = self.err;
                                var $3248 = Parser$Reply$error$($3245, $3246, $3247);
                                var $3244 = $3248;
                                break;
                            case 'Parser.Reply.value':
                                var $3249 = self.idx;
                                var $3250 = self.code;
                                var _term$14 = Kind$Term$ref$("List.concat");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _lst0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3243);
                                var self = Kind$Parser$stop$(_init$1, $3249, $3250);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3252 = self.idx;
                                        var $3253 = self.code;
                                        var $3254 = self.err;
                                        var $3255 = Parser$Reply$error$($3252, $3253, $3254);
                                        var $3251 = $3255;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3256 = self.idx;
                                        var $3257 = self.code;
                                        var $3258 = self.val;
                                        var $3259 = Parser$Reply$value$($3256, $3257, Kind$Term$ori$($3258, _term$17));
                                        var $3251 = $3259;
                                        break;
                                };
                                var $3244 = $3251;
                                break;
                        };
                        var $3236 = $3244;
                        break;
                };
                var $3229 = $3236;
                break;
        };
        return $3229;
    };
    const Kind$Parser$concat = x0 => x1 => x2 => x3 => Kind$Parser$concat$(x0, x1, x2, x3);

    function Kind$Parser$string_concat$(_init$1, _str0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("|", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3261 = self.idx;
                var $3262 = self.code;
                var $3263 = self.err;
                var $3264 = Parser$Reply$error$($3261, $3262, $3263);
                var $3260 = $3264;
                break;
            case 'Parser.Reply.value':
                var $3265 = self.idx;
                var $3266 = self.code;
                var self = Kind$Parser$term$($3265, $3266);
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
                        var $3274 = self.val;
                        var self = Kind$Parser$stop$(_init$1, $3272, $3273);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3276 = self.idx;
                                var $3277 = self.code;
                                var $3278 = self.err;
                                var $3279 = Parser$Reply$error$($3276, $3277, $3278);
                                var $3275 = $3279;
                                break;
                            case 'Parser.Reply.value':
                                var $3280 = self.idx;
                                var $3281 = self.code;
                                var _term$14 = Kind$Term$ref$("String.concat");
                                var _term$15 = Kind$Term$app$(_term$14, _str0$2);
                                var _term$16 = Kind$Term$app$(_term$15, $3274);
                                var self = Kind$Parser$stop$(_init$1, $3280, $3281);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3283 = self.idx;
                                        var $3284 = self.code;
                                        var $3285 = self.err;
                                        var $3286 = Parser$Reply$error$($3283, $3284, $3285);
                                        var $3282 = $3286;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3287 = self.idx;
                                        var $3288 = self.code;
                                        var $3289 = self.val;
                                        var $3290 = Parser$Reply$value$($3287, $3288, Kind$Term$ori$($3289, _term$16));
                                        var $3282 = $3290;
                                        break;
                                };
                                var $3275 = $3282;
                                break;
                        };
                        var $3267 = $3275;
                        break;
                };
                var $3260 = $3267;
                break;
        };
        return $3260;
    };
    const Kind$Parser$string_concat = x0 => x1 => x2 => x3 => Kind$Parser$string_concat$(x0, x1, x2, x3);

    function Kind$Parser$sigma$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("~", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3292 = self.idx;
                var $3293 = self.code;
                var $3294 = self.err;
                var $3295 = Parser$Reply$error$($3292, $3293, $3294);
                var $3291 = $3295;
                break;
            case 'Parser.Reply.value':
                var $3296 = self.idx;
                var $3297 = self.code;
                var self = Kind$Parser$term$($3296, $3297);
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
                        var self = Kind$Parser$stop$(_init$1, $3303, $3304);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3307 = self.idx;
                                var $3308 = self.code;
                                var $3309 = self.err;
                                var $3310 = Parser$Reply$error$($3307, $3308, $3309);
                                var $3306 = $3310;
                                break;
                            case 'Parser.Reply.value':
                                var $3311 = self.idx;
                                var $3312 = self.code;
                                var $3313 = self.val;
                                var _term$14 = Kind$Term$ref$("Sigma.new");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, Kind$Term$hol$(Bits$e));
                                var _term$17 = Kind$Term$app$(_term$16, _val0$2);
                                var _term$18 = Kind$Term$app$(_term$17, $3305);
                                var $3314 = Parser$Reply$value$($3311, $3312, Kind$Term$ori$($3313, _term$18));
                                var $3306 = $3314;
                                break;
                        };
                        var $3298 = $3306;
                        break;
                };
                var $3291 = $3298;
                break;
        };
        return $3291;
    };
    const Kind$Parser$sigma = x0 => x1 => x2 => x3 => Kind$Parser$sigma$(x0, x1, x2, x3);

    function Kind$Parser$equality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("==", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3316 = self.idx;
                var $3317 = self.code;
                var $3318 = self.err;
                var $3319 = Parser$Reply$error$($3316, $3317, $3318);
                var $3315 = $3319;
                break;
            case 'Parser.Reply.value':
                var $3320 = self.idx;
                var $3321 = self.code;
                var self = Kind$Parser$term$($3320, $3321);
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
                        var self = Kind$Parser$stop$(_init$1, $3327, $3328);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3331 = self.idx;
                                var $3332 = self.code;
                                var $3333 = self.err;
                                var $3334 = Parser$Reply$error$($3331, $3332, $3333);
                                var $3330 = $3334;
                                break;
                            case 'Parser.Reply.value':
                                var $3335 = self.idx;
                                var $3336 = self.code;
                                var $3337 = self.val;
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3329);
                                var $3338 = Parser$Reply$value$($3335, $3336, Kind$Term$ori$($3337, _term$17));
                                var $3330 = $3338;
                                break;
                        };
                        var $3322 = $3330;
                        break;
                };
                var $3315 = $3322;
                break;
        };
        return $3315;
    };
    const Kind$Parser$equality = x0 => x1 => x2 => x3 => Kind$Parser$equality$(x0, x1, x2, x3);

    function Kind$Parser$inequality$(_init$1, _val0$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!=", _idx$3, _code$4);
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
                var self = Kind$Parser$term$($3344, $3345);
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
                        var self = Kind$Parser$stop$(_init$1, $3351, $3352);
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
                                var _term$14 = Kind$Term$ref$("Equal");
                                var _term$15 = Kind$Term$app$(_term$14, Kind$Term$hol$(Bits$e));
                                var _term$16 = Kind$Term$app$(_term$15, _val0$2);
                                var _term$17 = Kind$Term$app$(_term$16, $3353);
                                var _term$18 = Kind$Term$app$(Kind$Term$ref$("Not"), _term$17);
                                var $3362 = Parser$Reply$value$($3359, $3360, Kind$Term$ori$($3361, _term$18));
                                var $3354 = $3362;
                                break;
                        };
                        var $3346 = $3354;
                        break;
                };
                var $3339 = $3346;
                break;
        };
        return $3339;
    };
    const Kind$Parser$inequality = x0 => x1 => x2 => x3 => Kind$Parser$inequality$(x0, x1, x2, x3);

    function Kind$Parser$rewrite$(_init$1, _subt$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
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
                var self = Kind$Parser$text$("rewrite", $3368, $3369);
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
                        var self = Kind$Parser$name1$($3375, $3376);
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
                                var $3384 = self.val;
                                var self = Kind$Parser$text$("in", $3382, $3383);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3386 = self.idx;
                                        var $3387 = self.code;
                                        var $3388 = self.err;
                                        var $3389 = Parser$Reply$error$($3386, $3387, $3388);
                                        var $3385 = $3389;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3390 = self.idx;
                                        var $3391 = self.code;
                                        var self = Kind$Parser$term$($3390, $3391);
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
                                                var $3399 = self.val;
                                                var self = Kind$Parser$text$("with", $3397, $3398);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3401 = self.idx;
                                                        var $3402 = self.code;
                                                        var $3403 = self.err;
                                                        var $3404 = Parser$Reply$error$($3401, $3402, $3403);
                                                        var $3400 = $3404;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3405 = self.idx;
                                                        var $3406 = self.code;
                                                        var self = Kind$Parser$term$($3405, $3406);
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
                                                                var self = Kind$Parser$stop$(_init$1, $3412, $3413);
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $3416 = self.idx;
                                                                        var $3417 = self.code;
                                                                        var $3418 = self.err;
                                                                        var $3419 = Parser$Reply$error$($3416, $3417, $3418);
                                                                        var $3415 = $3419;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $3420 = self.idx;
                                                                        var $3421 = self.code;
                                                                        var $3422 = self.val;
                                                                        var _term$29 = Kind$Term$ref$("Equal.rewrite");
                                                                        var _term$30 = Kind$Term$app$(_term$29, Kind$Term$hol$(Bits$e));
                                                                        var _term$31 = Kind$Term$app$(_term$30, Kind$Term$hol$(Bits$e));
                                                                        var _term$32 = Kind$Term$app$(_term$31, Kind$Term$hol$(Bits$e));
                                                                        var _term$33 = Kind$Term$app$(_term$32, $3414);
                                                                        var _term$34 = Kind$Term$app$(_term$33, Kind$Term$lam$($3384, (_x$34 => {
                                                                            var $3424 = $3399;
                                                                            return $3424;
                                                                        })));
                                                                        var _term$35 = Kind$Term$app$(_term$34, _subt$2);
                                                                        var $3423 = Parser$Reply$value$($3420, $3421, Kind$Term$ori$($3422, _term$35));
                                                                        var $3415 = $3423;
                                                                        break;
                                                                };
                                                                var $3407 = $3415;
                                                                break;
                                                        };
                                                        var $3400 = $3407;
                                                        break;
                                                };
                                                var $3392 = $3400;
                                                break;
                                        };
                                        var $3385 = $3392;
                                        break;
                                };
                                var $3377 = $3385;
                                break;
                        };
                        var $3370 = $3377;
                        break;
                };
                var $3363 = $3370;
                break;
        };
        return $3363;
    };
    const Kind$Parser$rewrite = x0 => x1 => x2 => x3 => Kind$Parser$rewrite$(x0, x1, x2, x3);

    function Kind$Term$ann$(_done$1, _term$2, _type$3) {
        var $3425 = ({
            _: 'Kind.Term.ann',
            'done': _done$1,
            'term': _term$2,
            'type': _type$3
        });
        return $3425;
    };
    const Kind$Term$ann = x0 => x1 => x2 => Kind$Term$ann$(x0, x1, x2);

    function Kind$Parser$annotation$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("::", _idx$3, _code$4);
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
                var self = Kind$Parser$term$($3431, $3432);
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
                        var self = Kind$Parser$stop$(_init$1, $3438, $3439);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3442 = self.idx;
                                var $3443 = self.code;
                                var $3444 = self.err;
                                var $3445 = Parser$Reply$error$($3442, $3443, $3444);
                                var $3441 = $3445;
                                break;
                            case 'Parser.Reply.value':
                                var $3446 = self.idx;
                                var $3447 = self.code;
                                var $3448 = self.val;
                                var $3449 = Parser$Reply$value$($3446, $3447, Kind$Term$ori$($3448, Kind$Term$ann$(Bool$false, _term$2, $3440)));
                                var $3441 = $3449;
                                break;
                        };
                        var $3433 = $3441;
                        break;
                };
                var $3426 = $3433;
                break;
        };
        return $3426;
    };
    const Kind$Parser$annotation = x0 => x1 => x2 => x3 => Kind$Parser$annotation$(x0, x1, x2, x3);

    function Kind$Parser$application$hole$(_init$1, _term$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$("!", _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3451 = self.idx;
                var $3452 = self.code;
                var $3453 = self.err;
                var $3454 = Parser$Reply$error$($3451, $3452, $3453);
                var $3450 = $3454;
                break;
            case 'Parser.Reply.value':
                var $3455 = self.idx;
                var $3456 = self.code;
                var self = Kind$Parser$stop$(_init$1, $3455, $3456);
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
                        var $3464 = self.val;
                        var $3465 = Parser$Reply$value$($3462, $3463, Kind$Term$ori$($3464, Kind$Term$app$(_term$2, Kind$Term$hol$(Bits$e))));
                        var $3457 = $3465;
                        break;
                };
                var $3450 = $3457;
                break;
        };
        return $3450;
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
                        var $3467 = self.idx;
                        var $3468 = self.code;
                        var $3469 = self.val;
                        var $3470 = Kind$Parser$suffix$(_init$1, $3469, $3467, $3468);
                        var $3466 = $3470;
                        break;
                    case 'Parser.Reply.error':
                        var $3471 = Parser$Reply$value$(_idx$3, _code$4, _term$2);
                        var $3466 = $3471;
                        break;
                };
                return $3466;
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
                var self = Parser$first_of$(List$cons$(Kind$Parser$type, List$cons$(Kind$Parser$forall, List$cons$(Kind$Parser$lambda, List$cons$(Kind$Parser$lambda$erased, List$cons$(Kind$Parser$lambda$nameless, List$cons$(Kind$Parser$parenthesis, List$cons$(Kind$Parser$letforrange$u32, List$cons$(Kind$Parser$letforin, List$cons$(Kind$Parser$let, List$cons$(Kind$Parser$get, List$cons$(Kind$Parser$def, List$cons$(Kind$Parser$if, List$cons$(Kind$Parser$char, List$cons$(Kind$Parser$string, List$cons$(Kind$Parser$pair, List$cons$(Kind$Parser$sigma$type, List$cons$(Kind$Parser$some, List$cons$(Kind$Parser$apply, List$cons$(Kind$Parser$mirror, List$cons$(Kind$Parser$list, List$cons$(Kind$Parser$log, List$cons$(Kind$Parser$forrange$u32, List$cons$(Kind$Parser$forrange$u32$2, List$cons$(Kind$Parser$forin, List$cons$(Kind$Parser$forin$2, List$cons$(Kind$Parser$do, List$cons$(Kind$Parser$case, List$cons$(Kind$Parser$open, List$cons$(Kind$Parser$goal, List$cons$(Kind$Parser$hole, List$cons$(Kind$Parser$u8, List$cons$(Kind$Parser$u16, List$cons$(Kind$Parser$u32, List$cons$(Kind$Parser$u64, List$cons$(Kind$Parser$nat, List$cons$(Kind$Parser$reference, List$nil)))))))))))))))))))))))))))))))))))))($3477)($3478);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3481 = self.idx;
                        var $3482 = self.code;
                        var $3483 = self.err;
                        var $3484 = Parser$Reply$error$($3481, $3482, $3483);
                        var $3480 = $3484;
                        break;
                    case 'Parser.Reply.value':
                        var $3485 = self.idx;
                        var $3486 = self.code;
                        var $3487 = self.val;
                        var $3488 = Kind$Parser$suffix$($3479, $3487, $3485, $3486);
                        var $3480 = $3488;
                        break;
                };
                var $3472 = $3480;
                break;
        };
        return $3472;
    };
    const Kind$Parser$term = x0 => x1 => Kind$Parser$term$(x0, x1);

    function Kind$Parser$name_term$(_sep$1, _idx$2, _code$3) {
        var self = Kind$Parser$name$(_idx$2, _code$3);
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
                var $3496 = self.val;
                var self = Kind$Parser$text$(_sep$1, $3494, $3495);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3498 = self.idx;
                        var $3499 = self.code;
                        var $3500 = self.err;
                        var $3501 = Parser$Reply$error$($3498, $3499, $3500);
                        var $3497 = $3501;
                        break;
                    case 'Parser.Reply.value':
                        var $3502 = self.idx;
                        var $3503 = self.code;
                        var self = Kind$Parser$term$($3502, $3503);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3505 = self.idx;
                                var $3506 = self.code;
                                var $3507 = self.err;
                                var $3508 = Parser$Reply$error$($3505, $3506, $3507);
                                var $3504 = $3508;
                                break;
                            case 'Parser.Reply.value':
                                var $3509 = self.idx;
                                var $3510 = self.code;
                                var $3511 = self.val;
                                var $3512 = Parser$Reply$value$($3509, $3510, Pair$new$($3496, $3511));
                                var $3504 = $3512;
                                break;
                        };
                        var $3497 = $3504;
                        break;
                };
                var $3489 = $3497;
                break;
        };
        return $3489;
    };
    const Kind$Parser$name_term = x0 => x1 => x2 => Kind$Parser$name_term$(x0, x1, x2);

    function Kind$Binder$new$(_eras$1, _name$2, _term$3) {
        var $3513 = ({
            _: 'Kind.Binder.new',
            'eras': _eras$1,
            'name': _name$2,
            'term': _term$3
        });
        return $3513;
    };
    const Kind$Binder$new = x0 => x1 => x2 => Kind$Binder$new$(x0, x1, x2);

    function Kind$Parser$binder$homo$(_sep$1, _eras$2, _idx$3, _code$4) {
        var self = Kind$Parser$text$((() => {
            var self = _eras$2;
            if (self) {
                var $3515 = "<";
                return $3515;
            } else {
                var $3516 = "(";
                return $3516;
            };
        })(), _idx$3, _code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3517 = self.idx;
                var $3518 = self.code;
                var $3519 = self.err;
                var $3520 = Parser$Reply$error$($3517, $3518, $3519);
                var $3514 = $3520;
                break;
            case 'Parser.Reply.value':
                var $3521 = self.idx;
                var $3522 = self.code;
                var self = Parser$until1$(Kind$Parser$text((() => {
                    var self = _eras$2;
                    if (self) {
                        var $3524 = ">";
                        return $3524;
                    } else {
                        var $3525 = ")";
                        return $3525;
                    };
                })()), Kind$Parser$item(Kind$Parser$name_term(_sep$1)), $3521, $3522);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3526 = self.idx;
                        var $3527 = self.code;
                        var $3528 = self.err;
                        var $3529 = Parser$Reply$error$($3526, $3527, $3528);
                        var $3523 = $3529;
                        break;
                    case 'Parser.Reply.value':
                        var $3530 = self.idx;
                        var $3531 = self.code;
                        var $3532 = self.val;
                        var $3533 = Parser$Reply$value$($3530, $3531, List$mapped$($3532, (_pair$11 => {
                            var self = _pair$11;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3535 = self.fst;
                                    var $3536 = self.snd;
                                    var $3537 = Kind$Binder$new$(_eras$2, $3535, $3536);
                                    var $3534 = $3537;
                                    break;
                            };
                            return $3534;
                        })));
                        var $3523 = $3533;
                        break;
                };
                var $3514 = $3523;
                break;
        };
        return $3514;
    };
    const Kind$Parser$binder$homo = x0 => x1 => x2 => x3 => Kind$Parser$binder$homo$(x0, x1, x2, x3);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3539 = self.head;
                var $3540 = self.tail;
                var $3541 = List$cons$($3539, List$concat$($3540, _bs$3));
                var $3538 = $3541;
                break;
            case 'List.nil':
                var $3542 = _bs$3;
                var $3538 = $3542;
                break;
        };
        return $3538;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function List$flatten$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $3544 = self.head;
                var $3545 = self.tail;
                var $3546 = List$concat$($3544, List$flatten$($3545));
                var $3543 = $3546;
                break;
            case 'List.nil':
                var $3547 = List$nil;
                var $3543 = $3547;
                break;
        };
        return $3543;
    };
    const List$flatten = x0 => List$flatten$(x0);

    function Kind$Parser$binder$(_sep$1, _idx$2, _code$3) {
        var self = Parser$many1$(Parser$first_of$(List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$true), List$cons$(Kind$Parser$binder$homo(_sep$1)(Bool$false), List$nil))), _idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3549 = self.idx;
                var $3550 = self.code;
                var $3551 = self.err;
                var $3552 = Parser$Reply$error$($3549, $3550, $3551);
                var $3548 = $3552;
                break;
            case 'Parser.Reply.value':
                var $3553 = self.idx;
                var $3554 = self.code;
                var $3555 = self.val;
                var $3556 = Parser$Reply$value$($3553, $3554, List$flatten$($3555));
                var $3548 = $3556;
                break;
        };
        return $3548;
    };
    const Kind$Parser$binder = x0 => x1 => x2 => Kind$Parser$binder$(x0, x1, x2);
    const List$length = a0 => (list_length(a0));

    function Kind$Parser$make_forall$(_binds$1, _body$2) {
        var self = _binds$1;
        switch (self._) {
            case 'List.cons':
                var $3558 = self.head;
                var $3559 = self.tail;
                var self = $3558;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3561 = self.eras;
                        var $3562 = self.name;
                        var $3563 = self.term;
                        var $3564 = Kind$Term$all$($3561, "", $3562, $3563, (_s$8 => _x$9 => {
                            var $3565 = Kind$Parser$make_forall$($3559, _body$2);
                            return $3565;
                        }));
                        var $3560 = $3564;
                        break;
                };
                var $3557 = $3560;
                break;
            case 'List.nil':
                var $3566 = _body$2;
                var $3557 = $3566;
                break;
        };
        return $3557;
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
                        var $3567 = self.head;
                        var $3568 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $3570 = Maybe$some$($3567);
                            var $3569 = $3570;
                        } else {
                            var $3571 = (self - 1n);
                            var $3572 = List$at$($3571, $3568);
                            var $3569 = $3572;
                        };
                        return $3569;
                    case 'List.nil':
                        var $3573 = Maybe$none;
                        return $3573;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function List$at_last$(_index$2, _list$3) {
        var $3574 = List$at$(_index$2, List$reverse$(_list$3));
        return $3574;
    };
    const List$at_last = x0 => x1 => List$at_last$(x0, x1);

    function Kind$Term$var$(_name$1, _indx$2) {
        var $3575 = ({
            _: 'Kind.Term.var',
            'name': _name$1,
            'indx': _indx$2
        });
        return $3575;
    };
    const Kind$Term$var = x0 => x1 => Kind$Term$var$(x0, x1);

    function Kind$Context$get_name_skips$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3577 = Pair$new$("", 0n);
            var $3576 = $3577;
        } else {
            var $3578 = self.charCodeAt(0);
            var $3579 = self.slice(1);
            var _name_skips$4 = Kind$Context$get_name_skips$($3579);
            var self = _name_skips$4;
            switch (self._) {
                case 'Pair.new':
                    var $3581 = self.fst;
                    var $3582 = self.snd;
                    var self = ($3578 === 94);
                    if (self) {
                        var $3584 = Pair$new$($3581, Nat$succ$($3582));
                        var $3583 = $3584;
                    } else {
                        var $3585 = Pair$new$(String$cons$($3578, $3581), $3582);
                        var $3583 = $3585;
                    };
                    var $3580 = $3583;
                    break;
            };
            var $3576 = $3580;
        };
        return $3576;
    };
    const Kind$Context$get_name_skips = x0 => Kind$Context$get_name_skips$(x0);

    function Kind$Name$eql$(_a$1, _b$2) {
        var $3586 = (_a$1 === _b$2);
        return $3586;
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
                        var $3587 = self.head;
                        var $3588 = self.tail;
                        var self = $3587;
                        switch (self._) {
                            case 'Pair.new':
                                var $3590 = self.fst;
                                var $3591 = self.snd;
                                var self = Kind$Name$eql$(_name$1, $3590);
                                if (self) {
                                    var self = _skip$2;
                                    if (self === 0n) {
                                        var $3594 = Maybe$some$($3591);
                                        var $3593 = $3594;
                                    } else {
                                        var $3595 = (self - 1n);
                                        var $3596 = Kind$Context$find$go$(_name$1, $3595, $3588);
                                        var $3593 = $3596;
                                    };
                                    var $3592 = $3593;
                                } else {
                                    var $3597 = Kind$Context$find$go$(_name$1, _skip$2, $3588);
                                    var $3592 = $3597;
                                };
                                var $3589 = $3592;
                                break;
                        };
                        return $3589;
                    case 'List.nil':
                        var $3598 = Maybe$none;
                        return $3598;
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
                var $3600 = self.fst;
                var $3601 = self.snd;
                var $3602 = Kind$Context$find$go$($3600, $3601, _ctx$2);
                var $3599 = $3602;
                break;
        };
        return $3599;
    };
    const Kind$Context$find = x0 => x1 => Kind$Context$find$(x0, x1);

    function Kind$Path$o$(_path$1, _x$2) {
        var $3603 = _path$1((_x$2 + '0'));
        return $3603;
    };
    const Kind$Path$o = x0 => x1 => Kind$Path$o$(x0, x1);

    function Kind$Path$i$(_path$1, _x$2) {
        var $3604 = _path$1((_x$2 + '1'));
        return $3604;
    };
    const Kind$Path$i = x0 => x1 => Kind$Path$i$(x0, x1);

    function Kind$Path$to_bits$(_path$1) {
        var $3605 = _path$1(Bits$e);
        return $3605;
    };
    const Kind$Path$to_bits = x0 => Kind$Path$to_bits$(x0);

    function Kind$Term$bind$(_vars$1, _path$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kind.Term.var':
                var $3607 = self.name;
                var $3608 = self.indx;
                var self = List$at_last$($3608, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3610 = self.value;
                        var $3611 = Pair$snd$($3610);
                        var $3609 = $3611;
                        break;
                    case 'Maybe.none':
                        var $3612 = Kind$Term$var$($3607, $3608);
                        var $3609 = $3612;
                        break;
                };
                var $3606 = $3609;
                break;
            case 'Kind.Term.ref':
                var $3613 = self.name;
                var self = Kind$Context$find$($3613, _vars$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $3615 = self.value;
                        var $3616 = $3615;
                        var $3614 = $3616;
                        break;
                    case 'Maybe.none':
                        var $3617 = Kind$Term$ref$($3613);
                        var $3614 = $3617;
                        break;
                };
                var $3606 = $3614;
                break;
            case 'Kind.Term.all':
                var $3618 = self.eras;
                var $3619 = self.self;
                var $3620 = self.name;
                var $3621 = self.xtyp;
                var $3622 = self.body;
                var _vlen$9 = (list_length(_vars$1));
                var $3623 = Kind$Term$all$($3618, $3619, $3620, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3621), (_s$10 => _x$11 => {
                    var $3624 = Kind$Term$bind$(List$cons$(Pair$new$($3620, _x$11), List$cons$(Pair$new$($3619, _s$10), _vars$1)), Kind$Path$i(_path$2), $3622(Kind$Term$var$($3619, _vlen$9))(Kind$Term$var$($3620, Nat$succ$(_vlen$9))));
                    return $3624;
                }));
                var $3606 = $3623;
                break;
            case 'Kind.Term.lam':
                var $3625 = self.name;
                var $3626 = self.body;
                var _vlen$6 = (list_length(_vars$1));
                var $3627 = Kind$Term$lam$($3625, (_x$7 => {
                    var $3628 = Kind$Term$bind$(List$cons$(Pair$new$($3625, _x$7), _vars$1), Kind$Path$o(_path$2), $3626(Kind$Term$var$($3625, _vlen$6)));
                    return $3628;
                }));
                var $3606 = $3627;
                break;
            case 'Kind.Term.app':
                var $3629 = self.func;
                var $3630 = self.argm;
                var $3631 = Kind$Term$app$(Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3629), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3630));
                var $3606 = $3631;
                break;
            case 'Kind.Term.let':
                var $3632 = self.name;
                var $3633 = self.expr;
                var $3634 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3635 = Kind$Term$let$($3632, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3633), (_x$8 => {
                    var $3636 = Kind$Term$bind$(List$cons$(Pair$new$($3632, _x$8), _vars$1), Kind$Path$i(_path$2), $3634(Kind$Term$var$($3632, _vlen$7)));
                    return $3636;
                }));
                var $3606 = $3635;
                break;
            case 'Kind.Term.def':
                var $3637 = self.name;
                var $3638 = self.expr;
                var $3639 = self.body;
                var _vlen$7 = (list_length(_vars$1));
                var $3640 = Kind$Term$def$($3637, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3638), (_x$8 => {
                    var $3641 = Kind$Term$bind$(List$cons$(Pair$new$($3637, _x$8), _vars$1), Kind$Path$i(_path$2), $3639(Kind$Term$var$($3637, _vlen$7)));
                    return $3641;
                }));
                var $3606 = $3640;
                break;
            case 'Kind.Term.ann':
                var $3642 = self.done;
                var $3643 = self.term;
                var $3644 = self.type;
                var $3645 = Kind$Term$ann$($3642, Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3643), Kind$Term$bind$(_vars$1, Kind$Path$i(_path$2), $3644));
                var $3606 = $3645;
                break;
            case 'Kind.Term.gol':
                var $3646 = self.name;
                var $3647 = self.dref;
                var $3648 = self.verb;
                var $3649 = Kind$Term$gol$($3646, $3647, $3648);
                var $3606 = $3649;
                break;
            case 'Kind.Term.nat':
                var $3650 = self.natx;
                var $3651 = Kind$Term$nat$($3650);
                var $3606 = $3651;
                break;
            case 'Kind.Term.chr':
                var $3652 = self.chrx;
                var $3653 = Kind$Term$chr$($3652);
                var $3606 = $3653;
                break;
            case 'Kind.Term.str':
                var $3654 = self.strx;
                var $3655 = Kind$Term$str$($3654);
                var $3606 = $3655;
                break;
            case 'Kind.Term.cse':
                var $3656 = self.expr;
                var $3657 = self.name;
                var $3658 = self.with;
                var $3659 = self.cses;
                var $3660 = self.moti;
                var _expr$10 = Kind$Term$bind$(_vars$1, Kind$Path$o(_path$2), $3656);
                var _name$11 = $3657;
                var _wyth$12 = $3658;
                var _cses$13 = $3659;
                var _moti$14 = $3660;
                var $3661 = Kind$Term$cse$(Kind$Path$to_bits$(_path$2), _expr$10, _name$11, _wyth$12, _cses$13, _moti$14);
                var $3606 = $3661;
                break;
            case 'Kind.Term.ori':
                var $3662 = self.orig;
                var $3663 = self.expr;
                var $3664 = Kind$Term$ori$($3662, Kind$Term$bind$(_vars$1, _path$2, $3663));
                var $3606 = $3664;
                break;
            case 'Kind.Term.typ':
                var $3665 = Kind$Term$typ;
                var $3606 = $3665;
                break;
            case 'Kind.Term.hol':
                var $3666 = Kind$Term$hol$(Kind$Path$to_bits$(_path$2));
                var $3606 = $3666;
                break;
        };
        return $3606;
    };
    const Kind$Term$bind = x0 => x1 => x2 => Kind$Term$bind$(x0, x1, x2);
    const Kind$Status$done = ({
        _: 'Kind.Status.done'
    });

    function Kind$define$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _done$9, _defs$10) {
        var self = _done$9;
        if (self) {
            var $3668 = Kind$Status$done;
            var _stat$11 = $3668;
        } else {
            var $3669 = Kind$Status$init;
            var _stat$11 = $3669;
        };
        var $3667 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _stat$11), _defs$10);
        return $3667;
    };
    const Kind$define = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Kind$define$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Kind$Parser$file$def$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3671 = self.idx;
                var $3672 = self.code;
                var $3673 = self.err;
                var $3674 = Parser$Reply$error$($3671, $3672, $3673);
                var $3670 = $3674;
                break;
            case 'Parser.Reply.value':
                var $3675 = self.idx;
                var $3676 = self.code;
                var $3677 = self.val;
                var self = Kind$Parser$name1$($3675, $3676);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3679 = self.idx;
                        var $3680 = self.code;
                        var $3681 = self.err;
                        var $3682 = Parser$Reply$error$($3679, $3680, $3681);
                        var $3678 = $3682;
                        break;
                    case 'Parser.Reply.value':
                        var $3683 = self.idx;
                        var $3684 = self.code;
                        var $3685 = self.val;
                        var self = Parser$many$(Kind$Parser$binder(":"))($3683)($3684);
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
                                var _args$15 = List$flatten$($3693);
                                var self = Kind$Parser$text$(":", $3691, $3692);
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
                                        var self = Kind$Parser$term$($3699, $3700);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3702 = self.idx;
                                                var $3703 = self.code;
                                                var $3704 = self.err;
                                                var $3705 = Parser$Reply$error$($3702, $3703, $3704);
                                                var $3701 = $3705;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3706 = self.idx;
                                                var $3707 = self.code;
                                                var $3708 = self.val;
                                                var self = Kind$Parser$term$($3706, $3707);
                                                switch (self._) {
                                                    case 'Parser.Reply.error':
                                                        var $3710 = self.idx;
                                                        var $3711 = self.code;
                                                        var $3712 = self.err;
                                                        var $3713 = Parser$Reply$error$($3710, $3711, $3712);
                                                        var $3709 = $3713;
                                                        break;
                                                    case 'Parser.Reply.value':
                                                        var $3714 = self.idx;
                                                        var $3715 = self.code;
                                                        var $3716 = self.val;
                                                        var self = Kind$Parser$stop$($3677, $3714, $3715);
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
                                                                var _arit$28 = (list_length(_args$15));
                                                                var _type$29 = Kind$Parser$make_forall$(_args$15, $3708);
                                                                var _term$30 = Kind$Parser$make_lambda$(List$mapped$(_args$15, (_x$30 => {
                                                                    var self = _x$30;
                                                                    switch (self._) {
                                                                        case 'Kind.Binder.new':
                                                                            var $3727 = self.name;
                                                                            var $3728 = $3727;
                                                                            var $3726 = $3728;
                                                                            break;
                                                                    };
                                                                    return $3726;
                                                                })), $3716);
                                                                var _type$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                                    var $3729 = (_x$31 + '1');
                                                                    return $3729;
                                                                }), _type$29);
                                                                var _term$32 = Kind$Term$bind$(List$nil, (_x$32 => {
                                                                    var $3730 = (_x$32 + '0');
                                                                    return $3730;
                                                                }), _term$30);
                                                                var _defs$33 = Kind$define$(_file$1, _code$2, $3724, $3685, _term$32, _type$31, Bool$false, _arit$28, Bool$false, _defs$3);
                                                                var $3725 = Parser$Reply$value$($3722, $3723, _defs$33);
                                                                var $3717 = $3725;
                                                                break;
                                                        };
                                                        var $3709 = $3717;
                                                        break;
                                                };
                                                var $3701 = $3709;
                                                break;
                                        };
                                        var $3694 = $3701;
                                        break;
                                };
                                var $3686 = $3694;
                                break;
                        };
                        var $3678 = $3686;
                        break;
                };
                var $3670 = $3678;
                break;
        };
        return $3670;
    };
    const Kind$Parser$file$def = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$def$(x0, x1, x2, x3, x4);

    function Maybe$default$(_a$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $3732 = self.value;
                var $3733 = $3732;
                var $3731 = $3733;
                break;
            case 'Maybe.none':
                var $3734 = _a$2;
                var $3731 = $3734;
                break;
        };
        return $3731;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Kind$Constructor$new$(_name$1, _args$2, _inds$3) {
        var $3735 = ({
            _: 'Kind.Constructor.new',
            'name': _name$1,
            'args': _args$2,
            'inds': _inds$3
        });
        return $3735;
    };
    const Kind$Constructor$new = x0 => x1 => x2 => Kind$Constructor$new$(x0, x1, x2);

    function Kind$Parser$constructor$(_namespace$1, _idx$2, _code$3) {
        var self = Kind$Parser$name1$(_idx$2, _code$3);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3737 = self.idx;
                var $3738 = self.code;
                var $3739 = self.err;
                var $3740 = Parser$Reply$error$($3737, $3738, $3739);
                var $3736 = $3740;
                break;
            case 'Parser.Reply.value':
                var $3741 = self.idx;
                var $3742 = self.code;
                var $3743 = self.val;
                var self = Parser$maybe$(Kind$Parser$binder(":"), $3741, $3742);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3745 = self.idx;
                        var $3746 = self.code;
                        var $3747 = self.err;
                        var $3748 = Parser$Reply$error$($3745, $3746, $3747);
                        var $3744 = $3748;
                        break;
                    case 'Parser.Reply.value':
                        var $3749 = self.idx;
                        var $3750 = self.code;
                        var $3751 = self.val;
                        var self = Parser$maybe$((_idx$10 => _code$11 => {
                            var self = Kind$Parser$text$("~", _idx$10, _code$11);
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $3754 = self.idx;
                                    var $3755 = self.code;
                                    var $3756 = self.err;
                                    var $3757 = Parser$Reply$error$($3754, $3755, $3756);
                                    var $3753 = $3757;
                                    break;
                                case 'Parser.Reply.value':
                                    var $3758 = self.idx;
                                    var $3759 = self.code;
                                    var $3760 = Kind$Parser$binder$("=", $3758, $3759);
                                    var $3753 = $3760;
                                    break;
                            };
                            return $3753;
                        }), $3749, $3750);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3761 = self.idx;
                                var $3762 = self.code;
                                var $3763 = self.err;
                                var $3764 = Parser$Reply$error$($3761, $3762, $3763);
                                var $3752 = $3764;
                                break;
                            case 'Parser.Reply.value':
                                var $3765 = self.idx;
                                var $3766 = self.code;
                                var $3767 = self.val;
                                var _args$13 = Maybe$default$(List$nil, $3751);
                                var _inds$14 = Maybe$default$(List$nil, $3767);
                                var $3768 = Parser$Reply$value$($3765, $3766, Kind$Constructor$new$($3743, _args$13, _inds$14));
                                var $3752 = $3768;
                                break;
                        };
                        var $3744 = $3752;
                        break;
                };
                var $3736 = $3744;
                break;
        };
        return $3736;
    };
    const Kind$Parser$constructor = x0 => x1 => x2 => Kind$Parser$constructor$(x0, x1, x2);

    function Kind$Datatype$new$(_name$1, _pars$2, _inds$3, _ctrs$4) {
        var $3769 = ({
            _: 'Kind.Datatype.new',
            'name': _name$1,
            'pars': _pars$2,
            'inds': _inds$3,
            'ctrs': _ctrs$4
        });
        return $3769;
    };
    const Kind$Datatype$new = x0 => x1 => x2 => x3 => Kind$Datatype$new$(x0, x1, x2, x3);

    function Kind$Parser$datatype$(_idx$1, _code$2) {
        var self = Kind$Parser$text$("type ", _idx$1, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $3771 = self.idx;
                var $3772 = self.code;
                var $3773 = self.err;
                var $3774 = Parser$Reply$error$($3771, $3772, $3773);
                var $3770 = $3774;
                break;
            case 'Parser.Reply.value':
                var $3775 = self.idx;
                var $3776 = self.code;
                var self = Kind$Parser$name1$($3775, $3776);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3778 = self.idx;
                        var $3779 = self.code;
                        var $3780 = self.err;
                        var $3781 = Parser$Reply$error$($3778, $3779, $3780);
                        var $3777 = $3781;
                        break;
                    case 'Parser.Reply.value':
                        var $3782 = self.idx;
                        var $3783 = self.code;
                        var $3784 = self.val;
                        var self = Parser$maybe$(Kind$Parser$binder(":"), $3782, $3783);
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $3786 = self.idx;
                                var $3787 = self.code;
                                var $3788 = self.err;
                                var $3789 = Parser$Reply$error$($3786, $3787, $3788);
                                var $3785 = $3789;
                                break;
                            case 'Parser.Reply.value':
                                var $3790 = self.idx;
                                var $3791 = self.code;
                                var $3792 = self.val;
                                var self = Parser$maybe$((_idx$12 => _code$13 => {
                                    var self = Kind$Parser$text$("~", _idx$12, _code$13);
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $3795 = self.idx;
                                            var $3796 = self.code;
                                            var $3797 = self.err;
                                            var $3798 = Parser$Reply$error$($3795, $3796, $3797);
                                            var $3794 = $3798;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $3799 = self.idx;
                                            var $3800 = self.code;
                                            var $3801 = Kind$Parser$binder$(":", $3799, $3800);
                                            var $3794 = $3801;
                                            break;
                                    };
                                    return $3794;
                                }), $3790, $3791);
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $3802 = self.idx;
                                        var $3803 = self.code;
                                        var $3804 = self.err;
                                        var $3805 = Parser$Reply$error$($3802, $3803, $3804);
                                        var $3793 = $3805;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $3806 = self.idx;
                                        var $3807 = self.code;
                                        var $3808 = self.val;
                                        var _pars$15 = Maybe$default$(List$nil, $3792);
                                        var _inds$16 = Maybe$default$(List$nil, $3808);
                                        var self = Kind$Parser$text$("{", $3806, $3807);
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3810 = self.idx;
                                                var $3811 = self.code;
                                                var $3812 = self.err;
                                                var $3813 = Parser$Reply$error$($3810, $3811, $3812);
                                                var $3809 = $3813;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3814 = self.idx;
                                                var $3815 = self.code;
                                                var self = Parser$until$(Kind$Parser$text("}"), Kind$Parser$item(Kind$Parser$constructor($3784)))($3814)($3815);
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
                                                        var $3824 = Parser$Reply$value$($3821, $3822, Kind$Datatype$new$($3784, _pars$15, _inds$16, $3823));
                                                        var $3816 = $3824;
                                                        break;
                                                };
                                                var $3809 = $3816;
                                                break;
                                        };
                                        var $3793 = $3809;
                                        break;
                                };
                                var $3785 = $3793;
                                break;
                        };
                        var $3777 = $3785;
                        break;
                };
                var $3770 = $3777;
                break;
        };
        return $3770;
    };
    const Kind$Parser$datatype = x0 => x1 => Kind$Parser$datatype$(x0, x1);

    function Kind$Datatype$build_term$motive$go$(_type$1, _name$2, _inds$3) {
        var self = _inds$3;
        switch (self._) {
            case 'List.cons':
                var $3826 = self.head;
                var $3827 = self.tail;
                var self = $3826;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3829 = self.eras;
                        var $3830 = self.name;
                        var $3831 = self.term;
                        var $3832 = Kind$Term$all$($3829, "", $3830, $3831, (_s$9 => _x$10 => {
                            var $3833 = Kind$Datatype$build_term$motive$go$(_type$1, _name$2, $3827);
                            return $3833;
                        }));
                        var $3828 = $3832;
                        break;
                };
                var $3825 = $3828;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3835 = self.pars;
                        var $3836 = self.inds;
                        var _slf$8 = Kind$Term$ref$(_name$2);
                        var _slf$9 = (() => {
                            var $3839 = _slf$8;
                            var $3840 = $3835;
                            let _slf$10 = $3839;
                            let _var$9;
                            while ($3840._ === 'List.cons') {
                                _var$9 = $3840.head;
                                var $3839 = Kind$Term$app$(_slf$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3841 = self.name;
                                            var $3842 = $3841;
                                            return $3842;
                                    };
                                })()));
                                _slf$10 = $3839;
                                $3840 = $3840.tail;
                            }
                            return _slf$10;
                        })();
                        var _slf$10 = (() => {
                            var $3844 = _slf$9;
                            var $3845 = $3836;
                            let _slf$11 = $3844;
                            let _var$10;
                            while ($3845._ === 'List.cons') {
                                _var$10 = $3845.head;
                                var $3844 = Kind$Term$app$(_slf$11, Kind$Term$ref$((() => {
                                    var self = _var$10;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3846 = self.name;
                                            var $3847 = $3846;
                                            return $3847;
                                    };
                                })()));
                                _slf$11 = $3844;
                                $3845 = $3845.tail;
                            }
                            return _slf$11;
                        })();
                        var $3837 = Kind$Term$all$(Bool$false, "", "", _slf$10, (_s$11 => _x$12 => {
                            var $3848 = Kind$Term$typ;
                            return $3848;
                        }));
                        var $3834 = $3837;
                        break;
                };
                var $3825 = $3834;
                break;
        };
        return $3825;
    };
    const Kind$Datatype$build_term$motive$go = x0 => x1 => x2 => Kind$Datatype$build_term$motive$go$(x0, x1, x2);

    function Kind$Datatype$build_term$motive$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3850 = self.name;
                var $3851 = self.inds;
                var $3852 = Kind$Datatype$build_term$motive$go$(_type$1, $3850, $3851);
                var $3849 = $3852;
                break;
        };
        return $3849;
    };
    const Kind$Datatype$build_term$motive = x0 => Kind$Datatype$build_term$motive$(x0);

    function Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, _args$3) {
        var self = _args$3;
        switch (self._) {
            case 'List.cons':
                var $3854 = self.head;
                var $3855 = self.tail;
                var self = $3854;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3857 = self.eras;
                        var $3858 = self.name;
                        var $3859 = self.term;
                        var _eras$9 = $3857;
                        var _name$10 = $3858;
                        var _xtyp$11 = $3859;
                        var _body$12 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3855);
                        var $3860 = Kind$Term$all$(_eras$9, "", _name$10, _xtyp$11, (_s$13 => _x$14 => {
                            var $3861 = _body$12;
                            return $3861;
                        }));
                        var $3856 = $3860;
                        break;
                };
                var $3853 = $3856;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3863 = self.name;
                        var $3864 = self.pars;
                        var self = _ctor$2;
                        switch (self._) {
                            case 'Kind.Constructor.new':
                                var $3866 = self.name;
                                var $3867 = self.args;
                                var $3868 = self.inds;
                                var _ret$11 = Kind$Term$ref$(Kind$Name$read$("P"));
                                var _ret$12 = (() => {
                                    var $3871 = _ret$11;
                                    var $3872 = $3868;
                                    let _ret$13 = $3871;
                                    let _var$12;
                                    while ($3872._ === 'List.cons') {
                                        _var$12 = $3872.head;
                                        var $3871 = Kind$Term$app$(_ret$13, (() => {
                                            var self = _var$12;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3873 = self.term;
                                                    var $3874 = $3873;
                                                    return $3874;
                                            };
                                        })());
                                        _ret$13 = $3871;
                                        $3872 = $3872.tail;
                                    }
                                    return _ret$13;
                                })();
                                var _ctr$13 = String$flatten$(List$cons$($3863, List$cons$(Kind$Name$read$("."), List$cons$($3866, List$nil))));
                                var _slf$14 = Kind$Term$ref$(_ctr$13);
                                var _slf$15 = (() => {
                                    var $3876 = _slf$14;
                                    var $3877 = $3864;
                                    let _slf$16 = $3876;
                                    let _var$15;
                                    while ($3877._ === 'List.cons') {
                                        _var$15 = $3877.head;
                                        var $3876 = Kind$Term$app$(_slf$16, Kind$Term$ref$((() => {
                                            var self = _var$15;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3878 = self.name;
                                                    var $3879 = $3878;
                                                    return $3879;
                                            };
                                        })()));
                                        _slf$16 = $3876;
                                        $3877 = $3877.tail;
                                    }
                                    return _slf$16;
                                })();
                                var _slf$16 = (() => {
                                    var $3881 = _slf$15;
                                    var $3882 = $3867;
                                    let _slf$17 = $3881;
                                    let _var$16;
                                    while ($3882._ === 'List.cons') {
                                        _var$16 = $3882.head;
                                        var $3881 = Kind$Term$app$(_slf$17, Kind$Term$ref$((() => {
                                            var self = _var$16;
                                            switch (self._) {
                                                case 'Kind.Binder.new':
                                                    var $3883 = self.name;
                                                    var $3884 = $3883;
                                                    return $3884;
                                            };
                                        })()));
                                        _slf$17 = $3881;
                                        $3882 = $3882.tail;
                                    }
                                    return _slf$17;
                                })();
                                var $3869 = Kind$Term$app$(_ret$12, _slf$16);
                                var $3865 = $3869;
                                break;
                        };
                        var $3862 = $3865;
                        break;
                };
                var $3853 = $3862;
                break;
        };
        return $3853;
    };
    const Kind$Datatype$build_term$constructor$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructor$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructor$(_type$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kind.Constructor.new':
                var $3886 = self.args;
                var $3887 = Kind$Datatype$build_term$constructor$go$(_type$1, _ctor$2, $3886);
                var $3885 = $3887;
                break;
        };
        return $3885;
    };
    const Kind$Datatype$build_term$constructor = x0 => x1 => Kind$Datatype$build_term$constructor$(x0, x1);

    function Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3889 = self.head;
                var $3890 = self.tail;
                var self = $3889;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3892 = self.name;
                        var $3893 = Kind$Term$all$(Bool$false, "", $3892, Kind$Datatype$build_term$constructor$(_type$1, $3889), (_s$9 => _x$10 => {
                            var $3894 = Kind$Datatype$build_term$constructors$go$(_type$1, _name$2, $3890);
                            return $3894;
                        }));
                        var $3891 = $3893;
                        break;
                };
                var $3888 = $3891;
                break;
            case 'List.nil':
                var self = _type$1;
                switch (self._) {
                    case 'Kind.Datatype.new':
                        var $3896 = self.inds;
                        var _ret$8 = Kind$Term$ref$(Kind$Name$read$("P"));
                        var _ret$9 = (() => {
                            var $3899 = _ret$8;
                            var $3900 = $3896;
                            let _ret$10 = $3899;
                            let _var$9;
                            while ($3900._ === 'List.cons') {
                                _var$9 = $3900.head;
                                var $3899 = Kind$Term$app$(_ret$10, Kind$Term$ref$((() => {
                                    var self = _var$9;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3901 = self.name;
                                            var $3902 = $3901;
                                            return $3902;
                                    };
                                })()));
                                _ret$10 = $3899;
                                $3900 = $3900.tail;
                            }
                            return _ret$10;
                        })();
                        var $3897 = Kind$Term$app$(_ret$9, Kind$Term$ref$((_name$2 + ".Self")));
                        var $3895 = $3897;
                        break;
                };
                var $3888 = $3895;
                break;
        };
        return $3888;
    };
    const Kind$Datatype$build_term$constructors$go = x0 => x1 => x2 => Kind$Datatype$build_term$constructors$go$(x0, x1, x2);

    function Kind$Datatype$build_term$constructors$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3904 = self.name;
                var $3905 = self.ctrs;
                var $3906 = Kind$Datatype$build_term$constructors$go$(_type$1, $3904, $3905);
                var $3903 = $3906;
                break;
        };
        return $3903;
    };
    const Kind$Datatype$build_term$constructors = x0 => Kind$Datatype$build_term$constructors$(x0);

    function Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3908 = self.head;
                var $3909 = self.tail;
                var self = $3908;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3911 = self.name;
                        var $3912 = Kind$Term$lam$($3911, (_x$10 => {
                            var $3913 = Kind$Datatype$build_term$go$(_type$1, _name$2, $3909, _inds$4);
                            return $3913;
                        }));
                        var $3910 = $3912;
                        break;
                };
                var $3907 = $3910;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3915 = self.head;
                        var $3916 = self.tail;
                        var self = $3915;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3918 = self.name;
                                var $3919 = Kind$Term$lam$($3918, (_x$10 => {
                                    var $3920 = Kind$Datatype$build_term$go$(_type$1, _name$2, _pars$3, $3916);
                                    return $3920;
                                }));
                                var $3917 = $3919;
                                break;
                        };
                        var $3914 = $3917;
                        break;
                    case 'List.nil':
                        var $3921 = Kind$Term$all$(Bool$true, (_name$2 + ".Self"), Kind$Name$read$("P"), Kind$Datatype$build_term$motive$(_type$1), (_s$5 => _x$6 => {
                            var $3922 = Kind$Datatype$build_term$constructors$(_type$1);
                            return $3922;
                        }));
                        var $3914 = $3921;
                        break;
                };
                var $3907 = $3914;
                break;
        };
        return $3907;
    };
    const Kind$Datatype$build_term$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_term$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_term$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3924 = self.name;
                var $3925 = self.pars;
                var $3926 = self.inds;
                var $3927 = Kind$Datatype$build_term$go$(_type$1, $3924, $3925, $3926);
                var $3923 = $3927;
                break;
        };
        return $3923;
    };
    const Kind$Datatype$build_term = x0 => Kind$Datatype$build_term$(x0);

    function Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, _inds$4) {
        var self = _pars$3;
        switch (self._) {
            case 'List.cons':
                var $3929 = self.head;
                var $3930 = self.tail;
                var self = $3929;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3932 = self.name;
                        var $3933 = self.term;
                        var $3934 = Kind$Term$all$(Bool$false, "", $3932, $3933, (_s$10 => _x$11 => {
                            var $3935 = Kind$Datatype$build_type$go$(_type$1, _name$2, $3930, _inds$4);
                            return $3935;
                        }));
                        var $3931 = $3934;
                        break;
                };
                var $3928 = $3931;
                break;
            case 'List.nil':
                var self = _inds$4;
                switch (self._) {
                    case 'List.cons':
                        var $3937 = self.head;
                        var $3938 = self.tail;
                        var self = $3937;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3940 = self.name;
                                var $3941 = self.term;
                                var $3942 = Kind$Term$all$(Bool$false, "", $3940, $3941, (_s$10 => _x$11 => {
                                    var $3943 = Kind$Datatype$build_type$go$(_type$1, _name$2, _pars$3, $3938);
                                    return $3943;
                                }));
                                var $3939 = $3942;
                                break;
                        };
                        var $3936 = $3939;
                        break;
                    case 'List.nil':
                        var $3944 = Kind$Term$typ;
                        var $3936 = $3944;
                        break;
                };
                var $3928 = $3936;
                break;
        };
        return $3928;
    };
    const Kind$Datatype$build_type$go = x0 => x1 => x2 => x3 => Kind$Datatype$build_type$go$(x0, x1, x2, x3);

    function Kind$Datatype$build_type$(_type$1) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3946 = self.name;
                var $3947 = self.pars;
                var $3948 = self.inds;
                var $3949 = Kind$Datatype$build_type$go$(_type$1, $3946, $3947, $3948);
                var $3945 = $3949;
                break;
        };
        return $3945;
    };
    const Kind$Datatype$build_type = x0 => Kind$Datatype$build_type$(x0);

    function Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, _ctrs$3) {
        var self = _ctrs$3;
        switch (self._) {
            case 'List.cons':
                var $3951 = self.head;
                var $3952 = self.tail;
                var self = $3951;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3954 = self.name;
                        var $3955 = Kind$Term$lam$($3954, (_x$9 => {
                            var $3956 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3952);
                            return $3956;
                        }));
                        var $3953 = $3955;
                        break;
                };
                var $3950 = $3953;
                break;
            case 'List.nil':
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3958 = self.name;
                        var $3959 = self.args;
                        var _ret$7 = Kind$Term$ref$($3958);
                        var _ret$8 = (() => {
                            var $3962 = _ret$7;
                            var $3963 = $3959;
                            let _ret$9 = $3962;
                            let _arg$8;
                            while ($3963._ === 'List.cons') {
                                _arg$8 = $3963.head;
                                var $3962 = Kind$Term$app$(_ret$9, Kind$Term$ref$((() => {
                                    var self = _arg$8;
                                    switch (self._) {
                                        case 'Kind.Binder.new':
                                            var $3964 = self.name;
                                            var $3965 = $3964;
                                            return $3965;
                                    };
                                })()));
                                _ret$9 = $3962;
                                $3963 = $3963.tail;
                            }
                            return _ret$9;
                        })();
                        var $3960 = _ret$8;
                        var $3957 = $3960;
                        break;
                };
                var $3950 = $3957;
                break;
        };
        return $3950;
    };
    const Kind$Constructor$build_term$opt$go = x0 => x1 => x2 => Kind$Constructor$build_term$opt$go$(x0, x1, x2);

    function Kind$Constructor$build_term$opt$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3967 = self.ctrs;
                var $3968 = Kind$Constructor$build_term$opt$go$(_type$1, _ctor$2, $3967);
                var $3966 = $3968;
                break;
        };
        return $3966;
    };
    const Kind$Constructor$build_term$opt = x0 => x1 => Kind$Constructor$build_term$opt$(x0, x1);

    function Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3970 = self.head;
                var $3971 = self.tail;
                var self = $3970;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3973 = self.name;
                        var $3974 = Kind$Term$lam$($3973, (_x$11 => {
                            var $3975 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, $3971, _args$5);
                            return $3975;
                        }));
                        var $3972 = $3974;
                        break;
                };
                var $3969 = $3972;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $3977 = self.head;
                        var $3978 = self.tail;
                        var self = $3977;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $3980 = self.name;
                                var $3981 = Kind$Term$lam$($3980, (_x$11 => {
                                    var $3982 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, _name$3, _pars$4, $3978);
                                    return $3982;
                                }));
                                var $3979 = $3981;
                                break;
                        };
                        var $3976 = $3979;
                        break;
                    case 'List.nil':
                        var $3983 = Kind$Term$lam$(Kind$Name$read$("P"), (_x$6 => {
                            var $3984 = Kind$Constructor$build_term$opt$(_type$1, _ctor$2);
                            return $3984;
                        }));
                        var $3976 = $3983;
                        break;
                };
                var $3969 = $3976;
                break;
        };
        return $3969;
    };
    const Kind$Constructor$build_term$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_term$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_term$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $3986 = self.name;
                var $3987 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $3989 = self.args;
                        var $3990 = Kind$Constructor$build_term$go$(_type$1, _ctor$2, $3986, $3987, $3989);
                        var $3988 = $3990;
                        break;
                };
                var $3985 = $3988;
                break;
        };
        return $3985;
    };
    const Kind$Constructor$build_term = x0 => x1 => Kind$Constructor$build_term$(x0, x1);

    function Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, _args$5) {
        var self = _pars$4;
        switch (self._) {
            case 'List.cons':
                var $3992 = self.head;
                var $3993 = self.tail;
                var self = $3992;
                switch (self._) {
                    case 'Kind.Binder.new':
                        var $3995 = self.eras;
                        var $3996 = self.name;
                        var $3997 = self.term;
                        var $3998 = Kind$Term$all$($3995, "", $3996, $3997, (_s$11 => _x$12 => {
                            var $3999 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, $3993, _args$5);
                            return $3999;
                        }));
                        var $3994 = $3998;
                        break;
                };
                var $3991 = $3994;
                break;
            case 'List.nil':
                var self = _args$5;
                switch (self._) {
                    case 'List.cons':
                        var $4001 = self.head;
                        var $4002 = self.tail;
                        var self = $4001;
                        switch (self._) {
                            case 'Kind.Binder.new':
                                var $4004 = self.eras;
                                var $4005 = self.name;
                                var $4006 = self.term;
                                var $4007 = Kind$Term$all$($4004, "", $4005, $4006, (_s$11 => _x$12 => {
                                    var $4008 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, _name$3, _pars$4, $4002);
                                    return $4008;
                                }));
                                var $4003 = $4007;
                                break;
                        };
                        var $4000 = $4003;
                        break;
                    case 'List.nil':
                        var self = _type$1;
                        switch (self._) {
                            case 'Kind.Datatype.new':
                                var $4010 = self.pars;
                                var self = _ctor$2;
                                switch (self._) {
                                    case 'Kind.Constructor.new':
                                        var $4012 = self.inds;
                                        var _type$13 = Kind$Term$ref$(_name$3);
                                        var _type$14 = (() => {
                                            var $4015 = _type$13;
                                            var $4016 = $4010;
                                            let _type$15 = $4015;
                                            let _var$14;
                                            while ($4016._ === 'List.cons') {
                                                _var$14 = $4016.head;
                                                var $4015 = Kind$Term$app$(_type$15, Kind$Term$ref$((() => {
                                                    var self = _var$14;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4017 = self.name;
                                                            var $4018 = $4017;
                                                            return $4018;
                                                    };
                                                })()));
                                                _type$15 = $4015;
                                                $4016 = $4016.tail;
                                            }
                                            return _type$15;
                                        })();
                                        var _type$15 = (() => {
                                            var $4020 = _type$14;
                                            var $4021 = $4012;
                                            let _type$16 = $4020;
                                            let _var$15;
                                            while ($4021._ === 'List.cons') {
                                                _var$15 = $4021.head;
                                                var $4020 = Kind$Term$app$(_type$16, (() => {
                                                    var self = _var$15;
                                                    switch (self._) {
                                                        case 'Kind.Binder.new':
                                                            var $4022 = self.term;
                                                            var $4023 = $4022;
                                                            return $4023;
                                                    };
                                                })());
                                                _type$16 = $4020;
                                                $4021 = $4021.tail;
                                            }
                                            return _type$16;
                                        })();
                                        var $4013 = _type$15;
                                        var $4011 = $4013;
                                        break;
                                };
                                var $4009 = $4011;
                                break;
                        };
                        var $4000 = $4009;
                        break;
                };
                var $3991 = $4000;
                break;
        };
        return $3991;
    };
    const Kind$Constructor$build_type$go = x0 => x1 => x2 => x3 => x4 => Kind$Constructor$build_type$go$(x0, x1, x2, x3, x4);

    function Kind$Constructor$build_type$(_type$1, _ctor$2) {
        var self = _type$1;
        switch (self._) {
            case 'Kind.Datatype.new':
                var $4025 = self.name;
                var $4026 = self.pars;
                var self = _ctor$2;
                switch (self._) {
                    case 'Kind.Constructor.new':
                        var $4028 = self.args;
                        var $4029 = Kind$Constructor$build_type$go$(_type$1, _ctor$2, $4025, $4026, $4028);
                        var $4027 = $4029;
                        break;
                };
                var $4024 = $4027;
                break;
        };
        return $4024;
    };
    const Kind$Constructor$build_type = x0 => x1 => Kind$Constructor$build_type$(x0, x1);

    function Kind$Parser$file$adt$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$init$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4031 = self.idx;
                var $4032 = self.code;
                var $4033 = self.err;
                var $4034 = Parser$Reply$error$($4031, $4032, $4033);
                var $4030 = $4034;
                break;
            case 'Parser.Reply.value':
                var $4035 = self.idx;
                var $4036 = self.code;
                var $4037 = self.val;
                var self = Kind$Parser$datatype$($4035, $4036);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4039 = self.idx;
                        var $4040 = self.code;
                        var $4041 = self.err;
                        var $4042 = Parser$Reply$error$($4039, $4040, $4041);
                        var $4038 = $4042;
                        break;
                    case 'Parser.Reply.value':
                        var $4043 = self.idx;
                        var $4044 = self.code;
                        var $4045 = self.val;
                        var self = Kind$Parser$stop$($4037, $4043, $4044);
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
                                var self = $4045;
                                switch (self._) {
                                    case 'Kind.Datatype.new':
                                        var $4055 = self.name;
                                        var $4056 = self.pars;
                                        var $4057 = self.inds;
                                        var $4058 = self.ctrs;
                                        var _term$19 = Kind$Datatype$build_term$($4045);
                                        var _term$20 = Kind$Term$bind$(List$nil, (_x$20 => {
                                            var $4060 = (_x$20 + '1');
                                            return $4060;
                                        }), _term$19);
                                        var _type$21 = Kind$Datatype$build_type$($4045);
                                        var _type$22 = Kind$Term$bind$(List$nil, (_x$22 => {
                                            var $4061 = (_x$22 + '0');
                                            return $4061;
                                        }), _type$21);
                                        var _arit$23 = ((list_length($4056)) + (list_length($4057)));
                                        var _defs$24 = Kind$define$(_file$1, _code$2, $4053, $4055, _term$20, _type$22, Bool$false, _arit$23, Bool$false, _defs$3);
                                        var _defs$25 = List$fold$($4058, _defs$24, (_ctr$25 => _defs$26 => {
                                            var _typ_name$27 = $4055;
                                            var _ctr_arit$28 = (_arit$23 + (list_length((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4063 = self.args;
                                                        var $4064 = $4063;
                                                        return $4064;
                                                };
                                            })())));
                                            var _ctr_name$29 = String$flatten$(List$cons$(_typ_name$27, List$cons$(Kind$Name$read$("."), List$cons$((() => {
                                                var self = _ctr$25;
                                                switch (self._) {
                                                    case 'Kind.Constructor.new':
                                                        var $4065 = self.name;
                                                        var $4066 = $4065;
                                                        return $4066;
                                                };
                                            })(), List$nil))));
                                            var _ctr_term$30 = Kind$Constructor$build_term$($4045, _ctr$25);
                                            var _ctr_term$31 = Kind$Term$bind$(List$nil, (_x$31 => {
                                                var $4067 = (_x$31 + '1');
                                                return $4067;
                                            }), _ctr_term$30);
                                            var _ctr_type$32 = Kind$Constructor$build_type$($4045, _ctr$25);
                                            var _ctr_type$33 = Kind$Term$bind$(List$nil, (_x$33 => {
                                                var $4068 = (_x$33 + '0');
                                                return $4068;
                                            }), _ctr_type$32);
                                            var $4062 = Kind$define$(_file$1, _code$2, $4053, _ctr_name$29, _ctr_term$31, _ctr_type$33, Bool$true, _ctr_arit$28, Bool$false, _defs$26);
                                            return $4062;
                                        }));
                                        var $4059 = (_idx$26 => _code$27 => {
                                            var $4069 = Parser$Reply$value$(_idx$26, _code$27, _defs$25);
                                            return $4069;
                                        });
                                        var $4054 = $4059;
                                        break;
                                };
                                var $4054 = $4054($4051)($4052);
                                var $4046 = $4054;
                                break;
                        };
                        var $4038 = $4046;
                        break;
                };
                var $4030 = $4038;
                break;
        };
        return $4030;
    };
    const Kind$Parser$file$adt = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$adt$(x0, x1, x2, x3, x4);

    function Parser$eof$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $4071 = Parser$Reply$value$(_idx$1, _code$2, Unit$new);
            var $4070 = $4071;
        } else {
            var $4072 = self.charCodeAt(0);
            var $4073 = self.slice(1);
            var $4074 = Parser$Reply$error$(_idx$1, _code$2, "Expected end-of-file.");
            var $4070 = $4074;
        };
        return $4070;
    };
    const Parser$eof = x0 => x1 => Parser$eof$(x0, x1);

    function Kind$Parser$file$end$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Kind$Parser$spaces(_idx$4)(_code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4076 = self.idx;
                var $4077 = self.code;
                var $4078 = self.err;
                var $4079 = Parser$Reply$error$($4076, $4077, $4078);
                var $4075 = $4079;
                break;
            case 'Parser.Reply.value':
                var $4080 = self.idx;
                var $4081 = self.code;
                var self = Parser$eof$($4080, $4081);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $4083 = self.idx;
                        var $4084 = self.code;
                        var $4085 = self.err;
                        var $4086 = Parser$Reply$error$($4083, $4084, $4085);
                        var $4082 = $4086;
                        break;
                    case 'Parser.Reply.value':
                        var $4087 = self.idx;
                        var $4088 = self.code;
                        var $4089 = Parser$Reply$value$($4087, $4088, _defs$3);
                        var $4082 = $4089;
                        break;
                };
                var $4075 = $4082;
                break;
        };
        return $4075;
    };
    const Kind$Parser$file$end = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$end$(x0, x1, x2, x3, x4);

    function Kind$Parser$file$(_file$1, _code$2, _defs$3, _idx$4, _code$5) {
        var self = Parser$is_eof$(_idx$4, _code$5);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4091 = self.idx;
                var $4092 = self.code;
                var $4093 = self.err;
                var $4094 = Parser$Reply$error$($4091, $4092, $4093);
                var $4090 = $4094;
                break;
            case 'Parser.Reply.value':
                var $4095 = self.idx;
                var $4096 = self.code;
                var $4097 = self.val;
                var self = $4097;
                if (self) {
                    var $4099 = (_idx$9 => _code$10 => {
                        var $4100 = Parser$Reply$value$(_idx$9, _code$10, _defs$3);
                        return $4100;
                    });
                    var $4098 = $4099;
                } else {
                    var $4101 = (_idx$9 => _code$10 => {
                        var self = Parser$first_of$(List$cons$(Kind$Parser$file$def(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$adt(_file$1)(_code$2)(_defs$3), List$cons$(Kind$Parser$file$end(_file$1)(_code$2)(_defs$3), List$nil))))(_idx$9)(_code$10);
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
                                var $4110 = Kind$Parser$file$(_file$1, _code$2, $4109, $4107, $4108);
                                var $4102 = $4110;
                                break;
                        };
                        return $4102;
                    });
                    var $4098 = $4101;
                };
                var $4098 = $4098($4095)($4096);
                var $4090 = $4098;
                break;
        };
        return $4090;
    };
    const Kind$Parser$file = x0 => x1 => x2 => x3 => x4 => Kind$Parser$file$(x0, x1, x2, x3, x4);

    function Either$(_A$1, _B$2) {
        var $4111 = null;
        return $4111;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $4113 = self.head;
                var $4114 = self.tail;
                var $4115 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $4116 = "";
                        return $4116;
                    } else {
                        var $4117 = _sep$1;
                        return $4117;
                    };
                })(), List$cons$($4113, List$cons$(String$join$go$(_sep$1, $4114, Bool$false), List$nil))));
                var $4112 = $4115;
                break;
            case 'List.nil':
                var $4118 = "";
                var $4112 = $4118;
                break;
        };
        return $4112;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $4119 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $4119;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$highlight$end$(_col$1, _row$2, _res$3) {
        var $4120 = String$join$("\u{a}", _res$3);
        return $4120;
    };
    const Kind$highlight$end = x0 => x1 => x2 => Kind$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4122 = self.value;
                var $4123 = _f$5($4122);
                var $4121 = $4123;
                break;
            case 'Maybe.none':
                var $4124 = _a$4;
                var $4121 = $4124;
                break;
        };
        return $4121;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4126 = Bool$true;
            var $4125 = $4126;
        } else {
            var $4127 = (self - 1n);
            var $4128 = Bool$false;
            var $4125 = $4128;
        };
        return $4125;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4130 = Nat$zero;
            var $4129 = $4130;
        } else {
            var $4131 = (self - 1n);
            var $4132 = Nat$succ$(Nat$succ$(Nat$double$($4131)));
            var $4129 = $4132;
        };
        return $4129;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $4134 = Nat$zero;
            var $4133 = $4134;
        } else {
            var $4135 = (self - 1n);
            var $4136 = $4135;
            var $4133 = $4136;
        };
        return $4133;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $4138 = _str$3;
            var $4137 = $4138;
        } else {
            var $4139 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $4141 = String$cons$(_chr$2, String$pad_right$($4139, _chr$2, ""));
                var $4140 = $4141;
            } else {
                var $4142 = self.charCodeAt(0);
                var $4143 = self.slice(1);
                var $4144 = String$cons$($4142, String$pad_right$($4139, _chr$2, $4143));
                var $4140 = $4144;
            };
            var $4137 = $4140;
        };
        return $4137;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $4145 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $4145;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$left$(_value$3) {
        var $4146 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $4146;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $4147 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $4147;
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
                    var $4148 = Either$left$(_n$1);
                    return $4148;
                } else {
                    var $4149 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4151 = Either$right$(Nat$succ$($4149));
                        var $4150 = $4151;
                    } else {
                        var $4152 = (self - 1n);
                        var $4153 = Nat$sub_rem$($4152, $4149);
                        var $4150 = $4153;
                    };
                    return $4150;
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
                        var $4154 = self.value;
                        var $4155 = Nat$div_mod$go$($4154, _m$2, Nat$succ$(_d$3));
                        return $4155;
                    case 'Either.right':
                        var $4156 = Pair$new$(_d$3, _n$1);
                        return $4156;
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
                        var $4157 = self.fst;
                        var $4158 = self.snd;
                        var self = $4157;
                        if (self === 0n) {
                            var $4160 = List$cons$($4158, _res$3);
                            var $4159 = $4160;
                        } else {
                            var $4161 = (self - 1n);
                            var $4162 = Nat$to_base$go$(_base$1, $4157, List$cons$($4158, _res$3));
                            var $4159 = $4162;
                        };
                        return $4159;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $4163 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $4163;
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
                    var $4164 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $4164;
                } else {
                    var $4165 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $4167 = _r$3;
                        var $4166 = $4167;
                    } else {
                        var $4168 = (self - 1n);
                        var $4169 = Nat$mod$go$($4168, $4165, Nat$succ$(_r$3));
                        var $4166 = $4169;
                    };
                    return $4166;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $4170 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $4170;
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
                    var $4173 = self.value;
                    var $4174 = $4173;
                    var $4172 = $4174;
                    break;
                case 'Maybe.none':
                    var $4175 = 35;
                    var $4172 = $4175;
                    break;
            };
            var $4171 = $4172;
        } else {
            var $4176 = 35;
            var $4171 = $4176;
        };
        return $4171;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $4177 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $4178 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $4178;
        }));
        return $4177;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $4179 = Nat$to_string_base$(10n, _n$1);
        return $4179;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function Kind$color$(_col$1, _str$2) {
        var $4180 = String$cons$(27, String$cons$(91, (_col$1 + String$cons$(109, (_str$2 + String$cons$(27, String$cons$(91, String$cons$(48, String$cons$(109, String$nil)))))))));
        return $4180;
    };
    const Kind$color = x0 => x1 => Kind$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $4182 = self.head;
                var $4183 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $4185 = List$nil;
                    var $4184 = $4185;
                } else {
                    var $4186 = (self - 1n);
                    var $4187 = List$cons$($4182, List$take$($4186, $4183));
                    var $4184 = $4187;
                };
                var $4181 = $4184;
                break;
            case 'List.nil':
                var $4188 = List$nil;
                var $4181 = $4188;
                break;
        };
        return $4181;
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
                    var $4190 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                    var $4189 = $4190;
                } else {
                    var $4191 = self.charCodeAt(0);
                    var $4192 = self.slice(1);
                    var self = ($4191 === 10);
                    if (self) {
                        var _stp$12 = Maybe$extract$(_lft$6, Bool$false, Nat$is_zero);
                        var self = _stp$12;
                        if (self) {
                            var $4195 = Kind$highlight$end$(_col$4, _row$5, List$reverse$(_res$8));
                            var $4194 = $4195;
                        } else {
                            var _siz$13 = Nat$succ$(Nat$double$(_spa$9));
                            var self = _ix1$3;
                            if (self === 0n) {
                                var self = _lft$6;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $4198 = self.value;
                                        var $4199 = Maybe$some$(Nat$pred$($4198));
                                        var $4197 = $4199;
                                        break;
                                    case 'Maybe.none':
                                        var $4200 = Maybe$some$(_spa$9);
                                        var $4197 = $4200;
                                        break;
                                };
                                var _lft$14 = $4197;
                            } else {
                                var $4201 = (self - 1n);
                                var $4202 = _lft$6;
                                var _lft$14 = $4202;
                            };
                            var _ix0$15 = Nat$pred$(_ix0$2);
                            var _ix1$16 = Nat$pred$(_ix1$3);
                            var _col$17 = 0n;
                            var _row$18 = Nat$succ$(_row$5);
                            var _res$19 = List$cons$(String$reverse$(_lin$7), _res$8);
                            var _lin$20 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$18)), List$cons$(" | ", List$nil))));
                            var $4196 = Kind$highlight$tc$($4192, _ix0$15, _ix1$16, _col$17, _row$18, _lft$14, _lin$20, _res$19);
                            var $4194 = $4196;
                        };
                        var $4193 = $4194;
                    } else {
                        var _chr$12 = String$cons$($4191, String$nil);
                        var self = (Nat$is_zero$(_ix0$2) && (!Nat$is_zero$(_ix1$3)));
                        if (self) {
                            var $4204 = String$reverse$(Kind$color$("31", Kind$color$("4", _chr$12)));
                            var _chr$13 = $4204;
                        } else {
                            var $4205 = _chr$12;
                            var _chr$13 = $4205;
                        };
                        var self = (_ix0$2 === 1n);
                        if (self) {
                            var $4206 = List$take$(_spa$9, _res$8);
                            var _res$14 = $4206;
                        } else {
                            var $4207 = _res$8;
                            var _res$14 = $4207;
                        };
                        var _ix0$15 = Nat$pred$(_ix0$2);
                        var _ix1$16 = Nat$pred$(_ix1$3);
                        var _col$17 = Nat$succ$(_col$4);
                        var _lin$18 = String$flatten$(List$cons$(_chr$13, List$cons$(_lin$7, List$nil)));
                        var $4203 = Kind$highlight$tc$($4192, _ix0$15, _ix1$16, _col$17, _row$5, _lft$6, _lin$18, _res$14);
                        var $4193 = $4203;
                    };
                    var $4189 = $4193;
                };
                return $4189;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$highlight$tc = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$highlight$tc$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$highlight$(_code$1, _idx0$2, _idx1$3) {
        var $4208 = Kind$highlight$tc$(_code$1, _idx0$2, _idx1$3, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $4208;
    };
    const Kind$highlight = x0 => x1 => x2 => Kind$highlight$(x0, x1, x2);

    function Kind$Defs$read$(_file$1, _code$2, _defs$3) {
        var self = Kind$Parser$file$(_file$1, _code$2, _defs$3, 0n, _code$2);
        switch (self._) {
            case 'Parser.Reply.error':
                var $4210 = self.idx;
                var $4211 = self.err;
                var _err$7 = $4211;
                var _hig$8 = Kind$highlight$(_code$2, $4210, Nat$succ$($4210));
                var _str$9 = String$flatten$(List$cons$(_err$7, List$cons$("\u{a}", List$cons$(_hig$8, List$nil))));
                var $4212 = Either$left$(_str$9);
                var $4209 = $4212;
                break;
            case 'Parser.Reply.value':
                var $4213 = self.val;
                var $4214 = Either$right$($4213);
                var $4209 = $4214;
                break;
        };
        return $4209;
    };
    const Kind$Defs$read = x0 => x1 => x2 => Kind$Defs$read$(x0, x1, x2);

    function Kind$Synth$load$go$(_name$1, _files$2, _defs$3) {
        var self = _files$2;
        switch (self._) {
            case 'List.cons':
                var $4216 = self.head;
                var $4217 = self.tail;
                var $4218 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $4219 = _m$bind$6;
                    return $4219;
                }))(IO$get_file$($4216))((_code$6 => {
                    var _read$7 = Kind$Defs$read$($4216, _code$6, _defs$3);
                    var self = _read$7;
                    switch (self._) {
                        case 'Either.right':
                            var $4221 = self.value;
                            var _defs$9 = $4221;
                            var self = Kind$get$(_name$1, _defs$9);
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4223 = Kind$Synth$load$go$(_name$1, $4217, _defs$9);
                                    var $4222 = $4223;
                                    break;
                                case 'Maybe.some':
                                    var $4224 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                        var $4225 = _m$pure$12;
                                        return $4225;
                                    }))(Maybe$some$(_defs$9));
                                    var $4222 = $4224;
                                    break;
                            };
                            var $4220 = $4222;
                            break;
                        case 'Either.left':
                            var $4226 = Kind$Synth$load$go$(_name$1, $4217, _defs$3);
                            var $4220 = $4226;
                            break;
                    };
                    return $4220;
                }));
                var $4215 = $4218;
                break;
            case 'List.nil':
                var $4227 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4228 = _m$pure$5;
                    return $4228;
                }))(Maybe$none);
                var $4215 = $4227;
                break;
        };
        return $4215;
    };
    const Kind$Synth$load$go = x0 => x1 => x2 => Kind$Synth$load$go$(x0, x1, x2);

    function Kind$Synth$files_of$make$(_names$1, _last$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $4230 = self.head;
                var $4231 = self.tail;
                var _head$5 = (_last$2 + ($4230 + ".kind"));
                var _tail$6 = Kind$Synth$files_of$make$($4231, (_last$2 + ($4230 + "/")));
                var $4232 = List$cons$(_head$5, _tail$6);
                var $4229 = $4232;
                break;
            case 'List.nil':
                var $4233 = List$nil;
                var $4229 = $4233;
                break;
        };
        return $4229;
    };
    const Kind$Synth$files_of$make = x0 => x1 => Kind$Synth$files_of$make$(x0, x1);

    function Char$eql$(_a$1, _b$2) {
        var $4234 = (_a$1 === _b$2);
        return $4234;
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
                    var $4235 = Bool$true;
                    return $4235;
                } else {
                    var $4236 = self.charCodeAt(0);
                    var $4237 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $4239 = Bool$false;
                        var $4238 = $4239;
                    } else {
                        var $4240 = self.charCodeAt(0);
                        var $4241 = self.slice(1);
                        var self = Char$eql$($4236, $4240);
                        if (self) {
                            var $4243 = String$starts_with$($4241, $4237);
                            var $4242 = $4243;
                        } else {
                            var $4244 = Bool$false;
                            var $4242 = $4244;
                        };
                        var $4238 = $4242;
                    };
                    return $4238;
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
                    var $4245 = _xs$2;
                    return $4245;
                } else {
                    var $4246 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $4248 = String$nil;
                        var $4247 = $4248;
                    } else {
                        var $4249 = self.charCodeAt(0);
                        var $4250 = self.slice(1);
                        var $4251 = String$drop$($4246, $4250);
                        var $4247 = $4251;
                    };
                    return $4247;
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
                    var $4252 = _n$2;
                    return $4252;
                } else {
                    var $4253 = self.charCodeAt(0);
                    var $4254 = self.slice(1);
                    var $4255 = String$length$go$($4254, Nat$succ$(_n$2));
                    return $4255;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $4256 = String$length$go$(_xs$1, 0n);
        return $4256;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $4258 = List$cons$(_last$3, List$nil);
            var $4257 = $4258;
        } else {
            var $4259 = self.charCodeAt(0);
            var $4260 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $4262 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $4261 = $4262;
            } else {
                var _next$6 = String$cons$($4259, String$nil);
                var $4263 = String$split$go$($4260, _match$2, (_last$3 + _next$6));
                var $4261 = $4263;
            };
            var $4257 = $4261;
        };
        return $4257;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $4264 = String$split$go$(_xs$1, _match$2, "");
        return $4264;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Kind$Synth$files_of$(_name$1) {
        var $4265 = List$reverse$(Kind$Synth$files_of$make$(String$split$(_name$1, "."), ""));
        return $4265;
    };
    const Kind$Synth$files_of = x0 => Kind$Synth$files_of$(x0);

    function Kind$Synth$load$(_name$1, _defs$2) {
        var $4266 = Kind$Synth$load$go$(_name$1, Kind$Synth$files_of$(_name$1), _defs$2);
        return $4266;
    };
    const Kind$Synth$load = x0 => x1 => Kind$Synth$load$(x0, x1);
    const Kind$Status$wait = ({
        _: 'Kind.Status.wait'
    });

    function Kind$Check$(_V$1) {
        var $4267 = null;
        return $4267;
    };
    const Kind$Check = x0 => Kind$Check$(x0);

    function Kind$Check$result$(_value$2, _errors$3) {
        var $4268 = ({
            _: 'Kind.Check.result',
            'value': _value$2,
            'errors': _errors$3
        });
        return $4268;
    };
    const Kind$Check$result = x0 => x1 => Kind$Check$result$(x0, x1);

    function Kind$Error$undefined_reference$(_origin$1, _name$2) {
        var $4269 = ({
            _: 'Kind.Error.undefined_reference',
            'origin': _origin$1,
            'name': _name$2
        });
        return $4269;
    };
    const Kind$Error$undefined_reference = x0 => x1 => Kind$Error$undefined_reference$(x0, x1);

    function Kind$Error$waiting$(_name$1) {
        var $4270 = ({
            _: 'Kind.Error.waiting',
            'name': _name$1
        });
        return $4270;
    };
    const Kind$Error$waiting = x0 => Kind$Error$waiting$(x0);

    function Kind$Error$indirect$(_name$1) {
        var $4271 = ({
            _: 'Kind.Error.indirect',
            'name': _name$1
        });
        return $4271;
    };
    const Kind$Error$indirect = x0 => Kind$Error$indirect$(x0);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $4273 = self.value;
                var $4274 = Maybe$some$(_f$4($4273));
                var $4272 = $4274;
                break;
            case 'Maybe.none':
                var $4275 = Maybe$none;
                var $4272 = $4275;
                break;
        };
        return $4272;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function Kind$MPath$o$(_path$1) {
        var $4276 = Maybe$mapped$(_path$1, Kind$Path$o);
        return $4276;
    };
    const Kind$MPath$o = x0 => Kind$MPath$o$(x0);

    function Kind$MPath$i$(_path$1) {
        var $4277 = Maybe$mapped$(_path$1, Kind$Path$i);
        return $4277;
    };
    const Kind$MPath$i = x0 => Kind$MPath$i$(x0);

    function Kind$Error$patch$(_path$1, _term$2) {
        var $4278 = ({
            _: 'Kind.Error.patch',
            'path': _path$1,
            'term': _term$2
        });
        return $4278;
    };
    const Kind$Error$patch = x0 => x1 => Kind$Error$patch$(x0, x1);

    function Kind$MPath$to_bits$(_path$1) {
        var self = _path$1;
        switch (self._) {
            case 'Maybe.some':
                var $4280 = self.value;
                var $4281 = $4280(Bits$e);
                var $4279 = $4281;
                break;
            case 'Maybe.none':
                var $4282 = Bits$e;
                var $4279 = $4282;
                break;
        };
        return $4279;
    };
    const Kind$MPath$to_bits = x0 => Kind$MPath$to_bits$(x0);

    function Kind$Error$type_mismatch$(_origin$1, _expected$2, _detected$3, _context$4) {
        var $4283 = ({
            _: 'Kind.Error.type_mismatch',
            'origin': _origin$1,
            'expected': _expected$2,
            'detected': _detected$3,
            'context': _context$4
        });
        return $4283;
    };
    const Kind$Error$type_mismatch = x0 => x1 => x2 => x3 => Kind$Error$type_mismatch$(x0, x1, x2, x3);

    function Kind$Error$show_goal$(_name$1, _dref$2, _verb$3, _goal$4, _context$5) {
        var $4284 = ({
            _: 'Kind.Error.show_goal',
            'name': _name$1,
            'dref': _dref$2,
            'verb': _verb$3,
            'goal': _goal$4,
            'context': _context$5
        });
        return $4284;
    };
    const Kind$Error$show_goal = x0 => x1 => x2 => x3 => x4 => Kind$Error$show_goal$(x0, x1, x2, x3, x4);

    function Kind$Term$normalize$(_term$1, _defs$2) {
        var self = Kind$Term$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $4286 = self.name;
                var $4287 = self.indx;
                var $4288 = Kind$Term$var$($4286, $4287);
                var $4285 = $4288;
                break;
            case 'Kind.Term.ref':
                var $4289 = self.name;
                var $4290 = Kind$Term$ref$($4289);
                var $4285 = $4290;
                break;
            case 'Kind.Term.all':
                var $4291 = self.eras;
                var $4292 = self.self;
                var $4293 = self.name;
                var $4294 = self.xtyp;
                var $4295 = self.body;
                var $4296 = Kind$Term$all$($4291, $4292, $4293, Kind$Term$normalize$($4294, _defs$2), (_s$8 => _x$9 => {
                    var $4297 = Kind$Term$normalize$($4295(_s$8)(_x$9), _defs$2);
                    return $4297;
                }));
                var $4285 = $4296;
                break;
            case 'Kind.Term.lam':
                var $4298 = self.name;
                var $4299 = self.body;
                var $4300 = Kind$Term$lam$($4298, (_x$5 => {
                    var $4301 = Kind$Term$normalize$($4299(_x$5), _defs$2);
                    return $4301;
                }));
                var $4285 = $4300;
                break;
            case 'Kind.Term.app':
                var $4302 = self.func;
                var $4303 = self.argm;
                var $4304 = Kind$Term$app$(Kind$Term$normalize$($4302, _defs$2), Kind$Term$normalize$($4303, _defs$2));
                var $4285 = $4304;
                break;
            case 'Kind.Term.let':
                var $4305 = self.name;
                var $4306 = self.expr;
                var $4307 = self.body;
                var $4308 = Kind$Term$let$($4305, Kind$Term$normalize$($4306, _defs$2), (_x$6 => {
                    var $4309 = Kind$Term$normalize$($4307(_x$6), _defs$2);
                    return $4309;
                }));
                var $4285 = $4308;
                break;
            case 'Kind.Term.def':
                var $4310 = self.name;
                var $4311 = self.expr;
                var $4312 = self.body;
                var $4313 = Kind$Term$def$($4310, Kind$Term$normalize$($4311, _defs$2), (_x$6 => {
                    var $4314 = Kind$Term$normalize$($4312(_x$6), _defs$2);
                    return $4314;
                }));
                var $4285 = $4313;
                break;
            case 'Kind.Term.ann':
                var $4315 = self.done;
                var $4316 = self.term;
                var $4317 = self.type;
                var $4318 = Kind$Term$ann$($4315, Kind$Term$normalize$($4316, _defs$2), Kind$Term$normalize$($4317, _defs$2));
                var $4285 = $4318;
                break;
            case 'Kind.Term.gol':
                var $4319 = self.name;
                var $4320 = self.dref;
                var $4321 = self.verb;
                var $4322 = Kind$Term$gol$($4319, $4320, $4321);
                var $4285 = $4322;
                break;
            case 'Kind.Term.hol':
                var $4323 = self.path;
                var $4324 = Kind$Term$hol$($4323);
                var $4285 = $4324;
                break;
            case 'Kind.Term.nat':
                var $4325 = self.natx;
                var $4326 = Kind$Term$nat$($4325);
                var $4285 = $4326;
                break;
            case 'Kind.Term.chr':
                var $4327 = self.chrx;
                var $4328 = Kind$Term$chr$($4327);
                var $4285 = $4328;
                break;
            case 'Kind.Term.str':
                var $4329 = self.strx;
                var $4330 = Kind$Term$str$($4329);
                var $4285 = $4330;
                break;
            case 'Kind.Term.ori':
                var $4331 = self.expr;
                var $4332 = Kind$Term$normalize$($4331, _defs$2);
                var $4285 = $4332;
                break;
            case 'Kind.Term.typ':
                var $4333 = Kind$Term$typ;
                var $4285 = $4333;
                break;
            case 'Kind.Term.cse':
                var $4334 = _term$1;
                var $4285 = $4334;
                break;
        };
        return $4285;
    };
    const Kind$Term$normalize = x0 => x1 => Kind$Term$normalize$(x0, x1);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $4336 = self.tail;
                var $4337 = $4336;
                var $4335 = $4337;
                break;
            case 'List.nil':
                var $4338 = List$nil;
                var $4335 = $4338;
                break;
        };
        return $4335;
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
                        var $4339 = self.func;
                        var $4340 = self.argm;
                        var $4341 = Kind$SmartMotive$vals$cont$(_expr$1, $4339, List$cons$($4340, _args$3), _defs$4);
                        return $4341;
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
                        var $4342 = List$cons$(_expr$1, List$tail$(List$reverse$(_args$3)));
                        return $4342;
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
                        var $4343 = self.body;
                        var $4344 = Kind$SmartMotive$vals$(_expr$1, $4343(Kind$Term$typ)(Kind$Term$typ), _defs$3);
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
                        var $4345 = Kind$SmartMotive$vals$cont$(_expr$1, _type$2, List$nil, _defs$3);
                        return $4345;
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
                        var $4346 = self.self;
                        var $4347 = self.name;
                        var $4348 = self.body;
                        var $4349 = Kind$SmartMotive$nams$cont$(_name$1, $4348(Kind$Term$ref$($4346))(Kind$Term$ref$($4347)), List$cons$(String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4347, List$nil)))), _binds$3), _defs$4);
                        return $4349;
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
                        var $4350 = List$cons$(_name$1, List$tail$(_binds$3));
                        return $4350;
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
                var $4352 = self.xtyp;
                var $4353 = Kind$SmartMotive$nams$cont$(_name$1, $4352, List$nil, _defs$3);
                var $4351 = $4353;
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
                var $4354 = List$nil;
                var $4351 = $4354;
                break;
        };
        return $4351;
    };
    const Kind$SmartMotive$nams = x0 => x1 => x2 => Kind$SmartMotive$nams$(x0, x1, x2);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $4356 = self.head;
                var $4357 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $4359 = self.head;
                        var $4360 = self.tail;
                        var $4361 = List$cons$(Pair$new$($4356, $4359), List$zip$($4357, $4360));
                        var $4358 = $4361;
                        break;
                    case 'List.nil':
                        var $4362 = List$nil;
                        var $4358 = $4362;
                        break;
                };
                var $4355 = $4358;
                break;
            case 'List.nil':
                var $4363 = List$nil;
                var $4355 = $4363;
                break;
        };
        return $4355;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Kind$Term$serialize$name$(_name$1) {
        var $4364 = (kind_name_to_bits(_name$1));
        return $4364;
    };
    const Kind$Term$serialize$name = x0 => Kind$Term$serialize$name$(x0);

    function Kind$Term$serialize$(_term$1, _depth$2, _init$3, _diff$4, _x$5) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4366 = self.indx;
                var self = ($4366 >= _init$3);
                if (self) {
                    var _name$8 = a1 => (a1 + (nat_to_bits(Nat$pred$((_depth$2 - $4366 <= 0n ? 0n : _depth$2 - $4366)))));
                    var $4368 = (((_name$8(_x$5) + '1') + '0') + '0');
                    var $4367 = $4368;
                } else {
                    var _name$8 = a1 => (a1 + (nat_to_bits($4366)));
                    var $4369 = (((_name$8(_x$5) + '0') + '1') + '0');
                    var $4367 = $4369;
                };
                var $4365 = $4367;
                break;
            case 'Kind.Term.ref':
                var $4370 = self.name;
                var _name$7 = a1 => (a1 + Kind$Term$serialize$name$($4370));
                var $4371 = (((_name$7(_x$5) + '0') + '0') + '0');
                var $4365 = $4371;
                break;
            case 'Kind.Term.all':
                var $4372 = self.eras;
                var $4373 = self.self;
                var $4374 = self.name;
                var $4375 = self.xtyp;
                var $4376 = self.body;
                var self = $4372;
                if (self) {
                    var $4378 = Bits$i;
                    var _eras$11 = $4378;
                } else {
                    var $4379 = Bits$o;
                    var _eras$11 = $4379;
                };
                var _self$12 = a1 => (a1 + (kind_name_to_bits($4373)));
                var _xtyp$13 = Kind$Term$serialize($4375)(_depth$2)(_init$3)(_diff$4);
                var _body$14 = Kind$Term$serialize($4376(Kind$Term$var$($4373, _depth$2))(Kind$Term$var$($4374, Nat$succ$(_depth$2))))(Nat$succ$(Nat$succ$(_depth$2)))(_init$3)(_diff$4);
                var $4377 = (((_eras$11(_self$12(_xtyp$13(_body$14(_x$5)))) + '0') + '0') + '1');
                var $4365 = $4377;
                break;
            case 'Kind.Term.lam':
                var $4380 = self.name;
                var $4381 = self.body;
                var _body$8 = Kind$Term$serialize($4381(Kind$Term$var$($4380, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4382 = (((_body$8(_x$5) + '1') + '0') + '1');
                var $4365 = $4382;
                break;
            case 'Kind.Term.app':
                var $4383 = self.func;
                var $4384 = self.argm;
                var _func$8 = Kind$Term$serialize($4383)(_depth$2)(_init$3)(_diff$4);
                var _argm$9 = Kind$Term$serialize($4384)(_depth$2)(_init$3)(_diff$4);
                var $4385 = (((_func$8(_argm$9(_x$5)) + '0') + '1') + '1');
                var $4365 = $4385;
                break;
            case 'Kind.Term.let':
                var $4386 = self.name;
                var $4387 = self.expr;
                var $4388 = self.body;
                var _expr$9 = Kind$Term$serialize($4387)(_depth$2)(_init$3)(_diff$4);
                var _body$10 = Kind$Term$serialize($4388(Kind$Term$var$($4386, _depth$2)))(Nat$succ$(_depth$2))(_init$3)(_diff$4);
                var $4389 = (((_expr$9(_body$10(_x$5)) + '1') + '1') + '1');
                var $4365 = $4389;
                break;
            case 'Kind.Term.def':
                var $4390 = self.expr;
                var $4391 = self.body;
                var $4392 = Kind$Term$serialize$($4391($4390), _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4392;
                break;
            case 'Kind.Term.ann':
                var $4393 = self.term;
                var $4394 = Kind$Term$serialize$($4393, _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4394;
                break;
            case 'Kind.Term.gol':
                var $4395 = self.name;
                var _name$9 = a1 => (a1 + (kind_name_to_bits($4395)));
                var $4396 = (((_name$9(_x$5) + '0') + '0') + '0');
                var $4365 = $4396;
                break;
            case 'Kind.Term.nat':
                var $4397 = self.natx;
                var $4398 = Kind$Term$serialize$(Kind$Term$unroll_nat$($4397), _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4398;
                break;
            case 'Kind.Term.chr':
                var $4399 = self.chrx;
                var $4400 = Kind$Term$serialize$(Kind$Term$unroll_chr$($4399), _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4400;
                break;
            case 'Kind.Term.str':
                var $4401 = self.strx;
                var $4402 = Kind$Term$serialize$(Kind$Term$unroll_str$($4401), _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4402;
                break;
            case 'Kind.Term.ori':
                var $4403 = self.expr;
                var $4404 = Kind$Term$serialize$($4403, _depth$2, _init$3, _diff$4, _x$5);
                var $4365 = $4404;
                break;
            case 'Kind.Term.typ':
                var $4405 = (((_x$5 + '1') + '1') + '0');
                var $4365 = $4405;
                break;
            case 'Kind.Term.hol':
                var $4406 = _x$5;
                var $4365 = $4406;
                break;
            case 'Kind.Term.cse':
                var $4407 = _diff$4(_x$5);
                var $4365 = $4407;
                break;
        };
        return $4365;
    };
    const Kind$Term$serialize = x0 => x1 => x2 => x3 => x4 => Kind$Term$serialize$(x0, x1, x2, x3, x4);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kind$Term$identical$(_a$1, _b$2, _lv$3) {
        var _ah$4 = Kind$Term$serialize$(_a$1, _lv$3, _lv$3, Bits$o, Bits$e);
        var _bh$5 = Kind$Term$serialize$(_b$2, _lv$3, _lv$3, Bits$i, Bits$e);
        var $4408 = (_bh$5 === _ah$4);
        return $4408;
    };
    const Kind$Term$identical = x0 => x1 => x2 => Kind$Term$identical$(x0, x1, x2);

    function Kind$SmartMotive$replace$(_term$1, _from$2, _to$3, _lv$4) {
        var self = Kind$Term$identical$(_term$1, _from$2, _lv$4);
        if (self) {
            var $4410 = _to$3;
            var $4409 = $4410;
        } else {
            var self = _term$1;
            switch (self._) {
                case 'Kind.Term.var':
                    var $4412 = self.name;
                    var $4413 = self.indx;
                    var $4414 = Kind$Term$var$($4412, $4413);
                    var $4411 = $4414;
                    break;
                case 'Kind.Term.ref':
                    var $4415 = self.name;
                    var $4416 = Kind$Term$ref$($4415);
                    var $4411 = $4416;
                    break;
                case 'Kind.Term.all':
                    var $4417 = self.eras;
                    var $4418 = self.self;
                    var $4419 = self.name;
                    var $4420 = self.xtyp;
                    var $4421 = self.body;
                    var _xtyp$10 = Kind$SmartMotive$replace$($4420, _from$2, _to$3, _lv$4);
                    var _body$11 = $4421(Kind$Term$ref$($4418))(Kind$Term$ref$($4419));
                    var _body$12 = Kind$SmartMotive$replace$(_body$11, _from$2, _to$3, Nat$succ$(Nat$succ$(_lv$4)));
                    var $4422 = Kind$Term$all$($4417, $4418, $4419, _xtyp$10, (_s$13 => _x$14 => {
                        var $4423 = _body$12;
                        return $4423;
                    }));
                    var $4411 = $4422;
                    break;
                case 'Kind.Term.lam':
                    var $4424 = self.name;
                    var $4425 = self.body;
                    var _body$7 = $4425(Kind$Term$ref$($4424));
                    var _body$8 = Kind$SmartMotive$replace$(_body$7, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4426 = Kind$Term$lam$($4424, (_x$9 => {
                        var $4427 = _body$8;
                        return $4427;
                    }));
                    var $4411 = $4426;
                    break;
                case 'Kind.Term.app':
                    var $4428 = self.func;
                    var $4429 = self.argm;
                    var _func$7 = Kind$SmartMotive$replace$($4428, _from$2, _to$3, _lv$4);
                    var _argm$8 = Kind$SmartMotive$replace$($4429, _from$2, _to$3, _lv$4);
                    var $4430 = Kind$Term$app$(_func$7, _argm$8);
                    var $4411 = $4430;
                    break;
                case 'Kind.Term.let':
                    var $4431 = self.name;
                    var $4432 = self.expr;
                    var $4433 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4432, _from$2, _to$3, _lv$4);
                    var _body$9 = $4433(Kind$Term$ref$($4431));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4434 = Kind$Term$let$($4431, _expr$8, (_x$11 => {
                        var $4435 = _body$10;
                        return $4435;
                    }));
                    var $4411 = $4434;
                    break;
                case 'Kind.Term.def':
                    var $4436 = self.name;
                    var $4437 = self.expr;
                    var $4438 = self.body;
                    var _expr$8 = Kind$SmartMotive$replace$($4437, _from$2, _to$3, _lv$4);
                    var _body$9 = $4438(Kind$Term$ref$($4436));
                    var _body$10 = Kind$SmartMotive$replace$(_body$9, _from$2, _to$3, Nat$succ$(_lv$4));
                    var $4439 = Kind$Term$def$($4436, _expr$8, (_x$11 => {
                        var $4440 = _body$10;
                        return $4440;
                    }));
                    var $4411 = $4439;
                    break;
                case 'Kind.Term.ann':
                    var $4441 = self.done;
                    var $4442 = self.term;
                    var $4443 = self.type;
                    var _term$8 = Kind$SmartMotive$replace$($4442, _from$2, _to$3, _lv$4);
                    var _type$9 = Kind$SmartMotive$replace$($4443, _from$2, _to$3, _lv$4);
                    var $4444 = Kind$Term$ann$($4441, _term$8, _type$9);
                    var $4411 = $4444;
                    break;
                case 'Kind.Term.ori':
                    var $4445 = self.expr;
                    var $4446 = Kind$SmartMotive$replace$($4445, _from$2, _to$3, _lv$4);
                    var $4411 = $4446;
                    break;
                case 'Kind.Term.typ':
                    var $4447 = Kind$Term$typ;
                    var $4411 = $4447;
                    break;
                case 'Kind.Term.gol':
                case 'Kind.Term.hol':
                case 'Kind.Term.nat':
                case 'Kind.Term.chr':
                case 'Kind.Term.str':
                case 'Kind.Term.cse':
                    var $4448 = _term$1;
                    var $4411 = $4448;
                    break;
            };
            var $4409 = $4411;
        };
        return $4409;
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
                    var $4451 = self.fst;
                    var $4452 = self.snd;
                    var $4453 = Kind$SmartMotive$replace$(_moti$11, $4452, Kind$Term$ref$($4451), _lv$5);
                    var $4450 = $4453;
                    break;
            };
            return $4450;
        }));
        var $4449 = _moti$10;
        return $4449;
    };
    const Kind$SmartMotive$make = x0 => x1 => x2 => x3 => x4 => x5 => Kind$SmartMotive$make$(x0, x1, x2, x3, x4, x5);

    function Kind$Term$desugar_cse$motive$(_wyth$1, _moti$2) {
        var self = _wyth$1;
        switch (self._) {
            case 'List.cons':
                var $4455 = self.head;
                var $4456 = self.tail;
                var self = $4455;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $4458 = self.name;
                        var $4459 = self.type;
                        var $4460 = Kind$Term$all$(Bool$false, "", $4458, $4459, (_s$14 => _x$15 => {
                            var $4461 = Kind$Term$desugar_cse$motive$($4456, _moti$2);
                            return $4461;
                        }));
                        var $4457 = $4460;
                        break;
                };
                var $4454 = $4457;
                break;
            case 'List.nil':
                var $4462 = _moti$2;
                var $4454 = $4462;
                break;
        };
        return $4454;
    };
    const Kind$Term$desugar_cse$motive = x0 => x1 => Kind$Term$desugar_cse$motive$(x0, x1);

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4464 = Bool$true;
            var $4463 = $4464;
        } else {
            var $4465 = self.charCodeAt(0);
            var $4466 = self.slice(1);
            var $4467 = Bool$false;
            var $4463 = $4467;
        };
        return $4463;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, _type$3, _body$4, _defs$5) {
        var self = Kind$Term$reduce$(_type$3, _defs$5);
        switch (self._) {
            case 'Kind.Term.all':
                var $4469 = self.self;
                var $4470 = self.name;
                var $4471 = self.body;
                var $4472 = Kind$Term$lam$((() => {
                    var self = String$is_empty$($4470);
                    if (self) {
                        var $4473 = _name$1;
                        return $4473;
                    } else {
                        var $4474 = String$flatten$(List$cons$(_name$1, List$cons$(".", List$cons$($4470, List$nil))));
                        return $4474;
                    };
                })(), (_x$11 => {
                    var $4475 = Kind$Term$desugar_cse$argument$(_name$1, _wyth$2, $4471(Kind$Term$var$($4469, 0n))(Kind$Term$var$($4470, 0n)), _body$4, _defs$5);
                    return $4475;
                }));
                var $4468 = $4472;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
            case 'Kind.Term.app':
            case 'Kind.Term.ori':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4477 = self.head;
                        var $4478 = self.tail;
                        var self = $4477;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4480 = self.name;
                                var $4481 = Kind$Term$lam$($4480, (_x$19 => {
                                    var $4482 = Kind$Term$desugar_cse$argument$(_name$1, $4478, _type$3, _body$4, _defs$5);
                                    return $4482;
                                }));
                                var $4479 = $4481;
                                break;
                        };
                        var $4476 = $4479;
                        break;
                    case 'List.nil':
                        var $4483 = _body$4;
                        var $4476 = $4483;
                        break;
                };
                var $4468 = $4476;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4485 = self.head;
                        var $4486 = self.tail;
                        var self = $4485;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4488 = self.name;
                                var $4489 = Kind$Term$lam$($4488, (_x$18 => {
                                    var $4490 = Kind$Term$desugar_cse$argument$(_name$1, $4486, _type$3, _body$4, _defs$5);
                                    return $4490;
                                }));
                                var $4487 = $4489;
                                break;
                        };
                        var $4484 = $4487;
                        break;
                    case 'List.nil':
                        var $4491 = _body$4;
                        var $4484 = $4491;
                        break;
                };
                var $4468 = $4484;
                break;
            case 'Kind.Term.typ':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4493 = self.head;
                        var $4494 = self.tail;
                        var self = $4493;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4496 = self.name;
                                var $4497 = Kind$Term$lam$($4496, (_x$17 => {
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
                var $4468 = $4492;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4501 = self.head;
                        var $4502 = self.tail;
                        var self = $4501;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4504 = self.name;
                                var $4505 = Kind$Term$lam$($4504, (_x$20 => {
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
                var $4468 = $4500;
                break;
            case 'Kind.Term.cse':
                var self = _wyth$2;
                switch (self._) {
                    case 'List.cons':
                        var $4509 = self.head;
                        var $4510 = self.tail;
                        var self = $4509;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4512 = self.name;
                                var $4513 = Kind$Term$lam$($4512, (_x$23 => {
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
                var $4468 = $4508;
                break;
        };
        return $4468;
    };
    const Kind$Term$desugar_cse$argument = x0 => x1 => x2 => x3 => x4 => Kind$Term$desugar_cse$argument$(x0, x1, x2, x3, x4);

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $4517 = self.value;
                var $4518 = Maybe$some$($4517);
                var $4516 = $4518;
                break;
            case 'Maybe.none':
                var $4519 = _b$3;
                var $4516 = $4519;
                break;
        };
        return $4516;
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
                        var $4520 = self.self;
                        var $4521 = self.name;
                        var $4522 = self.xtyp;
                        var $4523 = self.body;
                        var _got$13 = Maybe$or$(Kind$get$($4521, _cses$4), Kind$get$("_", _cses$4));
                        var self = _got$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4525 = self.value;
                                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, _wyth$3, $4522, $4525, _defs$6);
                                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                                var _type$17 = $4523(Kind$Term$var$($4520, 0n))(Kind$Term$var$($4521, 0n));
                                var $4526 = Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$6, _ctxt$7);
                                var $4524 = $4526;
                                break;
                            case 'Maybe.none':
                                var _expr$14 = (() => {
                                    var $4529 = _expr$1;
                                    var $4530 = _wyth$3;
                                    let _expr$15 = $4529;
                                    let _defn$14;
                                    while ($4530._ === 'List.cons') {
                                        _defn$14 = $4530.head;
                                        var self = _defn$14;
                                        switch (self._) {
                                            case 'Kind.Def.new':
                                                var $4531 = self.term;
                                                var $4532 = Kind$Term$app$(_expr$15, $4531);
                                                var $4529 = $4532;
                                                break;
                                        };
                                        _expr$15 = $4529;
                                        $4530 = $4530.tail;
                                    }
                                    return _expr$15;
                                })();
                                var $4527 = _expr$14;
                                var $4524 = $4527;
                                break;
                        };
                        return $4524;
                    case 'Kind.Term.var':
                    case 'Kind.Term.lam':
                    case 'Kind.Term.app':
                    case 'Kind.Term.ori':
                        var _expr$10 = (() => {
                            var $4535 = _expr$1;
                            var $4536 = _wyth$3;
                            let _expr$11 = $4535;
                            let _defn$10;
                            while ($4536._ === 'List.cons') {
                                _defn$10 = $4536.head;
                                var $4535 = Kind$Term$app$(_expr$11, (() => {
                                    var self = _defn$10;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4537 = self.term;
                                            var $4538 = $4537;
                                            return $4538;
                                    };
                                })());
                                _expr$11 = $4535;
                                $4536 = $4536.tail;
                            }
                            return _expr$11;
                        })();
                        var $4533 = _expr$10;
                        return $4533;
                    case 'Kind.Term.ref':
                    case 'Kind.Term.hol':
                    case 'Kind.Term.nat':
                    case 'Kind.Term.chr':
                    case 'Kind.Term.str':
                        var _expr$9 = (() => {
                            var $4541 = _expr$1;
                            var $4542 = _wyth$3;
                            let _expr$10 = $4541;
                            let _defn$9;
                            while ($4542._ === 'List.cons') {
                                _defn$9 = $4542.head;
                                var $4541 = Kind$Term$app$(_expr$10, (() => {
                                    var self = _defn$9;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4543 = self.term;
                                            var $4544 = $4543;
                                            return $4544;
                                    };
                                })());
                                _expr$10 = $4541;
                                $4542 = $4542.tail;
                            }
                            return _expr$10;
                        })();
                        var $4539 = _expr$9;
                        return $4539;
                    case 'Kind.Term.typ':
                        var _expr$8 = (() => {
                            var $4547 = _expr$1;
                            var $4548 = _wyth$3;
                            let _expr$9 = $4547;
                            let _defn$8;
                            while ($4548._ === 'List.cons') {
                                _defn$8 = $4548.head;
                                var $4547 = Kind$Term$app$(_expr$9, (() => {
                                    var self = _defn$8;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4549 = self.term;
                                            var $4550 = $4549;
                                            return $4550;
                                    };
                                })());
                                _expr$9 = $4547;
                                $4548 = $4548.tail;
                            }
                            return _expr$9;
                        })();
                        var $4545 = _expr$8;
                        return $4545;
                    case 'Kind.Term.let':
                    case 'Kind.Term.def':
                    case 'Kind.Term.ann':
                    case 'Kind.Term.gol':
                        var _expr$11 = (() => {
                            var $4553 = _expr$1;
                            var $4554 = _wyth$3;
                            let _expr$12 = $4553;
                            let _defn$11;
                            while ($4554._ === 'List.cons') {
                                _defn$11 = $4554.head;
                                var $4553 = Kind$Term$app$(_expr$12, (() => {
                                    var self = _defn$11;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4555 = self.term;
                                            var $4556 = $4555;
                                            return $4556;
                                    };
                                })());
                                _expr$12 = $4553;
                                $4554 = $4554.tail;
                            }
                            return _expr$12;
                        })();
                        var $4551 = _expr$11;
                        return $4551;
                    case 'Kind.Term.cse':
                        var _expr$14 = (() => {
                            var $4559 = _expr$1;
                            var $4560 = _wyth$3;
                            let _expr$15 = $4559;
                            let _defn$14;
                            while ($4560._ === 'List.cons') {
                                _defn$14 = $4560.head;
                                var $4559 = Kind$Term$app$(_expr$15, (() => {
                                    var self = _defn$14;
                                    switch (self._) {
                                        case 'Kind.Def.new':
                                            var $4561 = self.term;
                                            var $4562 = $4561;
                                            return $4562;
                                    };
                                })());
                                _expr$15 = $4559;
                                $4560 = $4560.tail;
                            }
                            return _expr$15;
                        })();
                        var $4557 = _expr$14;
                        return $4557;
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
                var $4564 = self.self;
                var $4565 = self.name;
                var $4566 = self.xtyp;
                var $4567 = self.body;
                var _moti$14 = Kind$Term$desugar_cse$motive$(_wyth$3, _moti$5);
                var _argm$15 = Kind$Term$desugar_cse$argument$(_name$2, List$nil, $4566, _moti$14, _defs$7);
                var _expr$16 = Kind$Term$app$(_expr$1, _argm$15);
                var _type$17 = $4567(Kind$Term$var$($4564, 0n))(Kind$Term$var$($4565, 0n));
                var $4568 = Maybe$some$(Kind$Term$desugar_cse$cases$(_expr$16, _name$2, _wyth$3, _cses$4, _type$17, _defs$7, _ctxt$8));
                var $4563 = $4568;
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
                var $4569 = Maybe$none;
                var $4563 = $4569;
                break;
        };
        return $4563;
    };
    const Kind$Term$desugar_cse = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Kind$Term$desugar_cse$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Kind$Error$cant_infer$(_origin$1, _term$2, _context$3) {
        var $4570 = ({
            _: 'Kind.Error.cant_infer',
            'origin': _origin$1,
            'term': _term$2,
            'context': _context$3
        });
        return $4570;
    };
    const Kind$Error$cant_infer = x0 => x1 => x2 => Kind$Error$cant_infer$(x0, x1, x2);

    function Set$has$(_bits$1, _set$2) {
        var self = Map$get$(_bits$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $4572 = Bool$false;
                var $4571 = $4572;
                break;
            case 'Maybe.some':
                var $4573 = Bool$true;
                var $4571 = $4573;
                break;
        };
        return $4571;
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
                        var $4574 = self.name;
                        var $4575 = Maybe$some$(Pair$new$($4574, _arity$2));
                        return $4575;
                    case 'Kind.Term.ref':
                        var $4576 = self.name;
                        var $4577 = Maybe$some$(Pair$new$($4576, _arity$2));
                        return $4577;
                    case 'Kind.Term.app':
                        var $4578 = self.func;
                        var $4579 = Kind$Term$equal$extra_holes$funari$($4578, Nat$succ$(_arity$2));
                        return $4579;
                    case 'Kind.Term.ori':
                        var $4580 = self.expr;
                        var $4581 = Kind$Term$equal$extra_holes$funari$($4580, _arity$2);
                        return $4581;
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
                        var $4582 = Maybe$none;
                        return $4582;
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
                var $4584 = self.xtyp;
                var $4585 = self.body;
                var $4586 = (Kind$Term$has_holes$($4584) || Kind$Term$has_holes$($4585(Kind$Term$typ)(Kind$Term$typ)));
                var $4583 = $4586;
                break;
            case 'Kind.Term.lam':
                var $4587 = self.body;
                var $4588 = Kind$Term$has_holes$($4587(Kind$Term$typ));
                var $4583 = $4588;
                break;
            case 'Kind.Term.app':
                var $4589 = self.func;
                var $4590 = self.argm;
                var $4591 = (Kind$Term$has_holes$($4589) || Kind$Term$has_holes$($4590));
                var $4583 = $4591;
                break;
            case 'Kind.Term.let':
                var $4592 = self.expr;
                var $4593 = self.body;
                var $4594 = (Kind$Term$has_holes$($4592) || Kind$Term$has_holes$($4593(Kind$Term$typ)));
                var $4583 = $4594;
                break;
            case 'Kind.Term.def':
                var $4595 = self.expr;
                var $4596 = self.body;
                var $4597 = (Kind$Term$has_holes$($4595) || Kind$Term$has_holes$($4596(Kind$Term$typ)));
                var $4583 = $4597;
                break;
            case 'Kind.Term.ann':
                var $4598 = self.term;
                var $4599 = self.type;
                var $4600 = (Kind$Term$has_holes$($4598) || Kind$Term$has_holes$($4599));
                var $4583 = $4600;
                break;
            case 'Kind.Term.ori':
                var $4601 = self.expr;
                var $4602 = Kind$Term$has_holes$($4601);
                var $4583 = $4602;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.ref':
            case 'Kind.Term.typ':
            case 'Kind.Term.gol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
            case 'Kind.Term.cse':
                var $4603 = Bool$false;
                var $4583 = $4603;
                break;
            case 'Kind.Term.hol':
                var $4604 = Bool$true;
                var $4583 = $4604;
                break;
        };
        return $4583;
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
                    var $4607 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                    var $4606 = $4607;
                } else {
                    var $4608 = Kind$Check$result$(Maybe$some$(Bool$true), List$cons$(Kind$Error$patch$(_path$1, Kind$Term$normalize$(_term$2, Map$new)), List$nil));
                    var $4606 = $4608;
                };
                var $4605 = $4606;
                break;
            case 'Kind.Term.hol':
                var $4609 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4605 = $4609;
                break;
        };
        return $4605;
    };
    const Kind$Term$equal$hole = x0 => x1 => Kind$Term$equal$hole$(x0, x1);

    function Kind$Term$equal$extra_holes$filler$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kind.Term.app':
                var $4611 = self.func;
                var $4612 = self.argm;
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.app':
                        var $4614 = self.func;
                        var $4615 = self.argm;
                        var self = Kind$Term$equal$extra_holes$filler$($4611, $4614);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4617 = self.value;
                                var $4618 = self.errors;
                                var self = $4617;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4620 = Kind$Check$result$(Maybe$none, $4618);
                                        var $4619 = $4620;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Term$equal$extra_holes$filler$($4612, $4615);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4622 = self.value;
                                                var $4623 = self.errors;
                                                var $4624 = Kind$Check$result$($4622, List$concat$($4618, $4623));
                                                var $4621 = $4624;
                                                break;
                                        };
                                        var $4619 = $4621;
                                        break;
                                };
                                var $4616 = $4619;
                                break;
                        };
                        var $4613 = $4616;
                        break;
                    case 'Kind.Term.hol':
                        var $4625 = self.path;
                        var self = Kind$Term$equal$hole$($4625, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4627 = self.value;
                                var $4628 = self.errors;
                                var self = $4627;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4630 = Kind$Check$result$(Maybe$none, $4628);
                                        var $4629 = $4630;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4632 = self.value;
                                                var $4633 = self.errors;
                                                var $4634 = Kind$Check$result$($4632, List$concat$($4628, $4633));
                                                var $4631 = $4634;
                                                break;
                                        };
                                        var $4629 = $4631;
                                        break;
                                };
                                var $4626 = $4629;
                                break;
                        };
                        var $4613 = $4626;
                        break;
                    case 'Kind.Term.ori':
                        var $4635 = self.expr;
                        var $4636 = Kind$Term$equal$extra_holes$filler$(_a$1, $4635);
                        var $4613 = $4636;
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
                        var $4637 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4613 = $4637;
                        break;
                };
                var $4610 = $4613;
                break;
            case 'Kind.Term.hol':
                var $4638 = self.path;
                var self = Kind$Term$equal$hole$($4638, _b$2);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4640 = self.value;
                        var $4641 = self.errors;
                        var self = $4640;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4643 = Kind$Check$result$(Maybe$none, $4641);
                                var $4642 = $4643;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4645 = self.value;
                                        var $4646 = self.errors;
                                        var $4647 = Kind$Check$result$($4645, List$concat$($4641, $4646));
                                        var $4644 = $4647;
                                        break;
                                };
                                var $4642 = $4644;
                                break;
                        };
                        var $4639 = $4642;
                        break;
                };
                var $4610 = $4639;
                break;
            case 'Kind.Term.ori':
                var $4648 = self.expr;
                var $4649 = Kind$Term$equal$extra_holes$filler$($4648, _b$2);
                var $4610 = $4649;
                break;
            case 'Kind.Term.var':
            case 'Kind.Term.lam':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4651 = self.path;
                        var self = Kind$Term$equal$hole$($4651, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4653 = self.value;
                                var $4654 = self.errors;
                                var self = $4653;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4656 = Kind$Check$result$(Maybe$none, $4654);
                                        var $4655 = $4656;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4658 = self.value;
                                                var $4659 = self.errors;
                                                var $4660 = Kind$Check$result$($4658, List$concat$($4654, $4659));
                                                var $4657 = $4660;
                                                break;
                                        };
                                        var $4655 = $4657;
                                        break;
                                };
                                var $4652 = $4655;
                                break;
                        };
                        var $4650 = $4652;
                        break;
                    case 'Kind.Term.ori':
                        var $4661 = self.expr;
                        var $4662 = Kind$Term$equal$extra_holes$filler$(_a$1, $4661);
                        var $4650 = $4662;
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
                        var $4663 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4650 = $4663;
                        break;
                };
                var $4610 = $4650;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4665 = self.path;
                        var self = Kind$Term$equal$hole$($4665, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4667 = self.value;
                                var $4668 = self.errors;
                                var self = $4667;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4670 = Kind$Check$result$(Maybe$none, $4668);
                                        var $4669 = $4670;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4672 = self.value;
                                                var $4673 = self.errors;
                                                var $4674 = Kind$Check$result$($4672, List$concat$($4668, $4673));
                                                var $4671 = $4674;
                                                break;
                                        };
                                        var $4669 = $4671;
                                        break;
                                };
                                var $4666 = $4669;
                                break;
                        };
                        var $4664 = $4666;
                        break;
                    case 'Kind.Term.ori':
                        var $4675 = self.expr;
                        var $4676 = Kind$Term$equal$extra_holes$filler$(_a$1, $4675);
                        var $4664 = $4676;
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
                        var $4677 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4664 = $4677;
                        break;
                };
                var $4610 = $4664;
                break;
            case 'Kind.Term.typ':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4679 = self.path;
                        var self = Kind$Term$equal$hole$($4679, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4681 = self.value;
                                var $4682 = self.errors;
                                var self = $4681;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4684 = Kind$Check$result$(Maybe$none, $4682);
                                        var $4683 = $4684;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
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
                                };
                                var $4680 = $4683;
                                break;
                        };
                        var $4678 = $4680;
                        break;
                    case 'Kind.Term.ori':
                        var $4689 = self.expr;
                        var $4690 = Kind$Term$equal$extra_holes$filler$(_a$1, $4689);
                        var $4678 = $4690;
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
                        var $4691 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4678 = $4691;
                        break;
                };
                var $4610 = $4678;
                break;
            case 'Kind.Term.all':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4693 = self.path;
                        var self = Kind$Term$equal$hole$($4693, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4695 = self.value;
                                var $4696 = self.errors;
                                var self = $4695;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4698 = Kind$Check$result$(Maybe$none, $4696);
                                        var $4697 = $4698;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4700 = self.value;
                                                var $4701 = self.errors;
                                                var $4702 = Kind$Check$result$($4700, List$concat$($4696, $4701));
                                                var $4699 = $4702;
                                                break;
                                        };
                                        var $4697 = $4699;
                                        break;
                                };
                                var $4694 = $4697;
                                break;
                        };
                        var $4692 = $4694;
                        break;
                    case 'Kind.Term.ori':
                        var $4703 = self.expr;
                        var $4704 = Kind$Term$equal$extra_holes$filler$(_a$1, $4703);
                        var $4692 = $4704;
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
                        var $4705 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4692 = $4705;
                        break;
                };
                var $4610 = $4692;
                break;
            case 'Kind.Term.let':
            case 'Kind.Term.def':
            case 'Kind.Term.ann':
            case 'Kind.Term.gol':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4707 = self.path;
                        var self = Kind$Term$equal$hole$($4707, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4709 = self.value;
                                var $4710 = self.errors;
                                var self = $4709;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4712 = Kind$Check$result$(Maybe$none, $4710);
                                        var $4711 = $4712;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4714 = self.value;
                                                var $4715 = self.errors;
                                                var $4716 = Kind$Check$result$($4714, List$concat$($4710, $4715));
                                                var $4713 = $4716;
                                                break;
                                        };
                                        var $4711 = $4713;
                                        break;
                                };
                                var $4708 = $4711;
                                break;
                        };
                        var $4706 = $4708;
                        break;
                    case 'Kind.Term.ori':
                        var $4717 = self.expr;
                        var $4718 = Kind$Term$equal$extra_holes$filler$(_a$1, $4717);
                        var $4706 = $4718;
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
                        var $4719 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4706 = $4719;
                        break;
                };
                var $4610 = $4706;
                break;
            case 'Kind.Term.cse':
                var self = _b$2;
                switch (self._) {
                    case 'Kind.Term.hol':
                        var $4721 = self.path;
                        var self = Kind$Term$equal$hole$($4721, _a$1);
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $4723 = self.value;
                                var $4724 = self.errors;
                                var self = $4723;
                                switch (self._) {
                                    case 'Maybe.none':
                                        var $4726 = Kind$Check$result$(Maybe$none, $4724);
                                        var $4725 = $4726;
                                        break;
                                    case 'Maybe.some':
                                        var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4728 = self.value;
                                                var $4729 = self.errors;
                                                var $4730 = Kind$Check$result$($4728, List$concat$($4724, $4729));
                                                var $4727 = $4730;
                                                break;
                                        };
                                        var $4725 = $4727;
                                        break;
                                };
                                var $4722 = $4725;
                                break;
                        };
                        var $4720 = $4722;
                        break;
                    case 'Kind.Term.ori':
                        var $4731 = self.expr;
                        var $4732 = Kind$Term$equal$extra_holes$filler$(_a$1, $4731);
                        var $4720 = $4732;
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
                        var $4733 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4720 = $4733;
                        break;
                };
                var $4610 = $4720;
                break;
        };
        return $4610;
    };
    const Kind$Term$equal$extra_holes$filler = x0 => x1 => Kind$Term$equal$extra_holes$filler$(x0, x1);

    function Kind$Term$equal$extra_holes$(_a$1, _b$2) {
        var self = Kind$Term$equal$extra_holes$funari$(_a$1, 0n);
        switch (self._) {
            case 'Maybe.some':
                var $4735 = self.value;
                var self = Kind$Term$equal$extra_holes$funari$(_b$2, 0n);
                switch (self._) {
                    case 'Maybe.some':
                        var $4737 = self.value;
                        var self = $4735;
                        switch (self._) {
                            case 'Pair.new':
                                var $4739 = self.fst;
                                var $4740 = self.snd;
                                var self = $4737;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4742 = self.fst;
                                        var $4743 = self.snd;
                                        var _same_fun$9 = ($4739 === $4742);
                                        var _same_ari$10 = ($4740 === $4743);
                                        var self = (_same_fun$9 && _same_ari$10);
                                        if (self) {
                                            var $4745 = Kind$Term$equal$extra_holes$filler$(_a$1, _b$2);
                                            var $4744 = $4745;
                                        } else {
                                            var $4746 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                            var $4744 = $4746;
                                        };
                                        var $4741 = $4744;
                                        break;
                                };
                                var $4738 = $4741;
                                break;
                        };
                        var $4736 = $4738;
                        break;
                    case 'Maybe.none':
                        var $4747 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                        var $4736 = $4747;
                        break;
                };
                var $4734 = $4736;
                break;
            case 'Maybe.none':
                var $4748 = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                var $4734 = $4748;
                break;
        };
        return $4734;
    };
    const Kind$Term$equal$extra_holes = x0 => x1 => Kind$Term$equal$extra_holes$(x0, x1);

    function Set$set$(_bits$1, _set$2) {
        var $4749 = Map$set$(_bits$1, Unit$new, _set$2);
        return $4749;
    };
    const Set$set = x0 => x1 => Set$set$(x0, x1);
    const Set$mut$set = a0 => a1 => (((k, s) => ((s[k] = true), s))(a0, a1));

    function Bool$eql$(_a$1, _b$2) {
        var self = _a$1;
        if (self) {
            var $4751 = _b$2;
            var $4750 = $4751;
        } else {
            var $4752 = (!_b$2);
            var $4750 = $4752;
        };
        return $4750;
    };
    const Bool$eql = x0 => x1 => Bool$eql$(x0, x1);

    function Kind$Term$equal$(_a$1, _b$2, _defs$3, _lv$4, _seen$5) {
        var _ah$6 = Kind$Term$serialize$(Kind$Term$reduce$(_a$1, Map$new), _lv$4, _lv$4, Bits$o, Bits$e);
        var _bh$7 = Kind$Term$serialize$(Kind$Term$reduce$(_b$2, Map$new), _lv$4, _lv$4, Bits$i, Bits$e);
        var self = (_bh$7 === _ah$6);
        if (self) {
            var $4754 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
            var $4753 = $4754;
        } else {
            var _a1$8 = Kind$Term$reduce$(_a$1, _defs$3);
            var _b1$9 = Kind$Term$reduce$(_b$2, _defs$3);
            var _ah$10 = Kind$Term$serialize$(_a1$8, _lv$4, _lv$4, Bits$o, Bits$e);
            var _bh$11 = Kind$Term$serialize$(_b1$9, _lv$4, _lv$4, Bits$i, Bits$e);
            var self = (_bh$11 === _ah$10);
            if (self) {
                var $4756 = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                var $4755 = $4756;
            } else {
                var _id$12 = (_bh$11 + _ah$10);
                var self = (!!(_seen$5[_id$12]));
                if (self) {
                    var self = Kind$Term$equal$extra_holes$(_a$1, _b$2);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $4759 = self.value;
                            var $4760 = self.errors;
                            var self = $4759;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $4762 = Kind$Check$result$(Maybe$none, $4760);
                                    var $4761 = $4762;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Check$result$(Maybe$some$(Bool$true), List$nil);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4764 = self.value;
                                            var $4765 = self.errors;
                                            var $4766 = Kind$Check$result$($4764, List$concat$($4760, $4765));
                                            var $4763 = $4766;
                                            break;
                                    };
                                    var $4761 = $4763;
                                    break;
                            };
                            var $4758 = $4761;
                            break;
                    };
                    var $4757 = $4758;
                } else {
                    var self = _a1$8;
                    switch (self._) {
                        case 'Kind.Term.all':
                            var $4768 = self.eras;
                            var $4769 = self.self;
                            var $4770 = self.name;
                            var $4771 = self.xtyp;
                            var $4772 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.all':
                                    var $4774 = self.eras;
                                    var $4775 = self.self;
                                    var $4776 = self.name;
                                    var $4777 = self.xtyp;
                                    var $4778 = self.body;
                                    var _seen$23 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$24 = $4772(Kind$Term$var$($4769, _lv$4))(Kind$Term$var$($4770, Nat$succ$(_lv$4)));
                                    var _b1_body$25 = $4778(Kind$Term$var$($4775, _lv$4))(Kind$Term$var$($4776, Nat$succ$(_lv$4)));
                                    var _eq_self$26 = ($4769 === $4775);
                                    var _eq_eras$27 = Bool$eql$($4768, $4774);
                                    var self = (_eq_self$26 && _eq_eras$27);
                                    if (self) {
                                        var self = Kind$Term$equal$($4771, $4777, _defs$3, _lv$4, _seen$23);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4781 = self.value;
                                                var $4782 = self.errors;
                                                var self = $4781;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $4784 = self.value;
                                                        var self = Kind$Term$equal$(_a1_body$24, _b1_body$25, _defs$3, Nat$succ$(Nat$succ$(_lv$4)), _seen$23);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4786 = self.value;
                                                                var $4787 = self.errors;
                                                                var self = $4786;
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $4789 = self.value;
                                                                        var self = Kind$Check$result$(Maybe$some$(($4784 && $4789)), List$nil);
                                                                        switch (self._) {
                                                                            case 'Kind.Check.result':
                                                                                var $4791 = self.value;
                                                                                var $4792 = self.errors;
                                                                                var $4793 = Kind$Check$result$($4791, List$concat$($4787, $4792));
                                                                                var $4790 = $4793;
                                                                                break;
                                                                        };
                                                                        var $4788 = $4790;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $4794 = Kind$Check$result$(Maybe$none, $4787);
                                                                        var $4788 = $4794;
                                                                        break;
                                                                };
                                                                var self = $4788;
                                                                break;
                                                        };
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4795 = self.value;
                                                                var $4796 = self.errors;
                                                                var $4797 = Kind$Check$result$($4795, List$concat$($4782, $4796));
                                                                var $4785 = $4797;
                                                                break;
                                                        };
                                                        var $4783 = $4785;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $4798 = Kind$Check$result$(Maybe$none, $4782);
                                                        var $4783 = $4798;
                                                        break;
                                                };
                                                var $4780 = $4783;
                                                break;
                                        };
                                        var $4779 = $4780;
                                    } else {
                                        var $4799 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                        var $4779 = $4799;
                                    };
                                    var $4773 = $4779;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4800 = self.path;
                                    var $4801 = Kind$Term$equal$hole$($4800, _a$1);
                                    var $4773 = $4801;
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
                                    var $4802 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4773 = $4802;
                                    break;
                            };
                            var $4767 = $4773;
                            break;
                        case 'Kind.Term.lam':
                            var $4803 = self.name;
                            var $4804 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.lam':
                                    var $4806 = self.name;
                                    var $4807 = self.body;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$18 = $4804(Kind$Term$var$($4803, _lv$4));
                                    var _b1_body$19 = $4807(Kind$Term$var$($4806, _lv$4));
                                    var self = Kind$Term$equal$(_a1_body$18, _b1_body$19, _defs$3, Nat$succ$(_lv$4), _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4809 = self.value;
                                            var $4810 = self.errors;
                                            var self = $4809;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4812 = self.value;
                                                    var self = Kind$Check$result$(Maybe$some$($4812), List$nil);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4814 = self.value;
                                                            var $4815 = self.errors;
                                                            var $4816 = Kind$Check$result$($4814, List$concat$($4810, $4815));
                                                            var $4813 = $4816;
                                                            break;
                                                    };
                                                    var $4811 = $4813;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4817 = Kind$Check$result$(Maybe$none, $4810);
                                                    var $4811 = $4817;
                                                    break;
                                            };
                                            var $4808 = $4811;
                                            break;
                                    };
                                    var $4805 = $4808;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4818 = self.path;
                                    var $4819 = Kind$Term$equal$hole$($4818, _a$1);
                                    var $4805 = $4819;
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
                                    var $4820 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4805 = $4820;
                                    break;
                            };
                            var $4767 = $4805;
                            break;
                        case 'Kind.Term.app':
                            var $4821 = self.func;
                            var $4822 = self.argm;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.app':
                                    var $4824 = self.func;
                                    var $4825 = self.argm;
                                    var _seen$17 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var self = Kind$Term$equal$($4821, $4824, _defs$3, _lv$4, _seen$17);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4827 = self.value;
                                            var $4828 = self.errors;
                                            var self = $4827;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4830 = self.value;
                                                    var self = Kind$Term$equal$($4822, $4825, _defs$3, _lv$4, _seen$17);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4832 = self.value;
                                                            var $4833 = self.errors;
                                                            var self = $4832;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4835 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4830 && $4835)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4837 = self.value;
                                                                            var $4838 = self.errors;
                                                                            var $4839 = Kind$Check$result$($4837, List$concat$($4833, $4838));
                                                                            var $4836 = $4839;
                                                                            break;
                                                                    };
                                                                    var $4834 = $4836;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4840 = Kind$Check$result$(Maybe$none, $4833);
                                                                    var $4834 = $4840;
                                                                    break;
                                                            };
                                                            var self = $4834;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4841 = self.value;
                                                            var $4842 = self.errors;
                                                            var $4843 = Kind$Check$result$($4841, List$concat$($4828, $4842));
                                                            var $4831 = $4843;
                                                            break;
                                                    };
                                                    var $4829 = $4831;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4844 = Kind$Check$result$(Maybe$none, $4828);
                                                    var $4829 = $4844;
                                                    break;
                                            };
                                            var $4826 = $4829;
                                            break;
                                    };
                                    var $4823 = $4826;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4845 = self.path;
                                    var $4846 = Kind$Term$equal$hole$($4845, _a$1);
                                    var $4823 = $4846;
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
                                    var $4847 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4823 = $4847;
                                    break;
                            };
                            var $4767 = $4823;
                            break;
                        case 'Kind.Term.let':
                            var $4848 = self.name;
                            var $4849 = self.expr;
                            var $4850 = self.body;
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.let':
                                    var $4852 = self.name;
                                    var $4853 = self.expr;
                                    var $4854 = self.body;
                                    var _seen$19 = (((k, s) => ((s[k] = true), s))(_id$12, _seen$5));
                                    var _a1_body$20 = $4850(Kind$Term$var$($4848, _lv$4));
                                    var _b1_body$21 = $4854(Kind$Term$var$($4852, _lv$4));
                                    var self = Kind$Term$equal$($4849, $4853, _defs$3, _lv$4, _seen$19);
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $4856 = self.value;
                                            var $4857 = self.errors;
                                            var self = $4856;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $4859 = self.value;
                                                    var self = Kind$Term$equal$(_a1_body$20, _b1_body$21, _defs$3, Nat$succ$(_lv$4), _seen$19);
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4861 = self.value;
                                                            var $4862 = self.errors;
                                                            var self = $4861;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $4864 = self.value;
                                                                    var self = Kind$Check$result$(Maybe$some$(($4859 && $4864)), List$nil);
                                                                    switch (self._) {
                                                                        case 'Kind.Check.result':
                                                                            var $4866 = self.value;
                                                                            var $4867 = self.errors;
                                                                            var $4868 = Kind$Check$result$($4866, List$concat$($4862, $4867));
                                                                            var $4865 = $4868;
                                                                            break;
                                                                    };
                                                                    var $4863 = $4865;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $4869 = Kind$Check$result$(Maybe$none, $4862);
                                                                    var $4863 = $4869;
                                                                    break;
                                                            };
                                                            var self = $4863;
                                                            break;
                                                    };
                                                    switch (self._) {
                                                        case 'Kind.Check.result':
                                                            var $4870 = self.value;
                                                            var $4871 = self.errors;
                                                            var $4872 = Kind$Check$result$($4870, List$concat$($4857, $4871));
                                                            var $4860 = $4872;
                                                            break;
                                                    };
                                                    var $4858 = $4860;
                                                    break;
                                                case 'Maybe.none':
                                                    var $4873 = Kind$Check$result$(Maybe$none, $4857);
                                                    var $4858 = $4873;
                                                    break;
                                            };
                                            var $4855 = $4858;
                                            break;
                                    };
                                    var $4851 = $4855;
                                    break;
                                case 'Kind.Term.hol':
                                    var $4874 = self.path;
                                    var $4875 = Kind$Term$equal$hole$($4874, _a$1);
                                    var $4851 = $4875;
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
                                    var $4876 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4851 = $4876;
                                    break;
                            };
                            var $4767 = $4851;
                            break;
                        case 'Kind.Term.hol':
                            var $4877 = self.path;
                            var $4878 = Kind$Term$equal$hole$($4877, _b$2);
                            var $4767 = $4878;
                            break;
                        case 'Kind.Term.var':
                        case 'Kind.Term.ori':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4880 = self.path;
                                    var $4881 = Kind$Term$equal$hole$($4880, _a$1);
                                    var $4879 = $4881;
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
                                    var $4882 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4879 = $4882;
                                    break;
                            };
                            var $4767 = $4879;
                            break;
                        case 'Kind.Term.ref':
                        case 'Kind.Term.nat':
                        case 'Kind.Term.chr':
                        case 'Kind.Term.str':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4884 = self.path;
                                    var $4885 = Kind$Term$equal$hole$($4884, _a$1);
                                    var $4883 = $4885;
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
                                    var $4886 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4883 = $4886;
                                    break;
                            };
                            var $4767 = $4883;
                            break;
                        case 'Kind.Term.typ':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4888 = self.path;
                                    var $4889 = Kind$Term$equal$hole$($4888, _a$1);
                                    var $4887 = $4889;
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
                                    var $4890 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4887 = $4890;
                                    break;
                            };
                            var $4767 = $4887;
                            break;
                        case 'Kind.Term.def':
                        case 'Kind.Term.ann':
                        case 'Kind.Term.gol':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4892 = self.path;
                                    var $4893 = Kind$Term$equal$hole$($4892, _a$1);
                                    var $4891 = $4893;
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
                                    var $4894 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4891 = $4894;
                                    break;
                            };
                            var $4767 = $4891;
                            break;
                        case 'Kind.Term.cse':
                            var self = _b1$9;
                            switch (self._) {
                                case 'Kind.Term.hol':
                                    var $4896 = self.path;
                                    var $4897 = Kind$Term$equal$hole$($4896, _a$1);
                                    var $4895 = $4897;
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
                                    var $4898 = Kind$Check$result$(Maybe$some$(Bool$false), List$nil);
                                    var $4895 = $4898;
                                    break;
                            };
                            var $4767 = $4895;
                            break;
                    };
                    var $4757 = $4767;
                };
                var $4755 = $4757;
            };
            var $4753 = $4755;
        };
        return $4753;
    };
    const Kind$Term$equal = x0 => x1 => x2 => x3 => x4 => Kind$Term$equal$(x0, x1, x2, x3, x4);
    const Set$new = Map$new;
    const Set$mut$new = a0 => (({}));

    function Kind$Term$check$(_term$1, _type$2, _defs$3, _ctx$4, _path$5, _orig$6) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $4900 = self.name;
                var $4901 = self.indx;
                var self = List$at_last$($4901, _ctx$4);
                switch (self._) {
                    case 'Maybe.some':
                        var $4903 = self.value;
                        var $4904 = Kind$Check$result$(Maybe$some$((() => {
                            var self = $4903;
                            switch (self._) {
                                case 'Pair.new':
                                    var $4905 = self.snd;
                                    var $4906 = $4905;
                                    return $4906;
                            };
                        })()), List$nil);
                        var $4902 = $4904;
                        break;
                    case 'Maybe.none':
                        var $4907 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4900), List$nil));
                        var $4902 = $4907;
                        break;
                };
                var self = $4902;
                break;
            case 'Kind.Term.ref':
                var $4908 = self.name;
                var self = Kind$get$($4908, _defs$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $4910 = self.value;
                        var self = $4910;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $4912 = self.name;
                                var $4913 = self.term;
                                var $4914 = self.type;
                                var $4915 = self.stat;
                                var _ref_name$18 = $4912;
                                var _ref_type$19 = $4914;
                                var _ref_term$20 = $4913;
                                var _ref_stat$21 = $4915;
                                var self = _ref_stat$21;
                                switch (self._) {
                                    case 'Kind.Status.init':
                                        var $4917 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$waiting$(_ref_name$18), List$nil));
                                        var $4916 = $4917;
                                        break;
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $4918 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$nil);
                                        var $4916 = $4918;
                                        break;
                                    case 'Kind.Status.fail':
                                        var $4919 = Kind$Check$result$(Maybe$some$(_ref_type$19), List$cons$(Kind$Error$indirect$(_ref_name$18), List$nil));
                                        var $4916 = $4919;
                                        break;
                                };
                                var $4911 = $4916;
                                break;
                        };
                        var $4909 = $4911;
                        break;
                    case 'Maybe.none':
                        var $4920 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$undefined_reference$(_orig$6, $4908), List$nil));
                        var $4909 = $4920;
                        break;
                };
                var self = $4909;
                break;
            case 'Kind.Term.all':
                var $4921 = self.self;
                var $4922 = self.name;
                var $4923 = self.xtyp;
                var $4924 = self.body;
                var _ctx_size$12 = (list_length(_ctx$4));
                var _self_var$13 = Kind$Term$var$($4921, _ctx_size$12);
                var _body_var$14 = Kind$Term$var$($4922, Nat$succ$(_ctx_size$12));
                var _body_ctx$15 = List$cons$(Pair$new$($4922, $4923), List$cons$(Pair$new$($4921, _term$1), _ctx$4));
                var self = Kind$Term$check$($4923, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4926 = self.value;
                        var $4927 = self.errors;
                        var self = $4926;
                        switch (self._) {
                            case 'Maybe.none':
                                var $4929 = Kind$Check$result$(Maybe$none, $4927);
                                var $4928 = $4929;
                                break;
                            case 'Maybe.some':
                                var self = Kind$Term$check$($4924(_self_var$13)(_body_var$14), Maybe$some$(Kind$Term$typ), _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4931 = self.value;
                                        var $4932 = self.errors;
                                        var self = $4931;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $4934 = Kind$Check$result$(Maybe$none, $4932);
                                                var $4933 = $4934;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $4936 = self.value;
                                                        var $4937 = self.errors;
                                                        var $4938 = Kind$Check$result$($4936, List$concat$($4932, $4937));
                                                        var $4935 = $4938;
                                                        break;
                                                };
                                                var $4933 = $4935;
                                                break;
                                        };
                                        var self = $4933;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4939 = self.value;
                                        var $4940 = self.errors;
                                        var $4941 = Kind$Check$result$($4939, List$concat$($4927, $4940));
                                        var $4930 = $4941;
                                        break;
                                };
                                var $4928 = $4930;
                                break;
                        };
                        var $4925 = $4928;
                        break;
                };
                var self = $4925;
                break;
            case 'Kind.Term.lam':
                var $4942 = self.name;
                var $4943 = self.body;
                var self = _type$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $4945 = self.value;
                        var _typv$10 = Kind$Term$reduce$($4945, _defs$3);
                        var self = _typv$10;
                        switch (self._) {
                            case 'Kind.Term.all':
                                var $4947 = self.xtyp;
                                var $4948 = self.body;
                                var _ctx_size$16 = (list_length(_ctx$4));
                                var _self_var$17 = _term$1;
                                var _body_var$18 = Kind$Term$var$($4942, _ctx_size$16);
                                var _body_typ$19 = $4948(_self_var$17)(_body_var$18);
                                var _body_ctx$20 = List$cons$(Pair$new$($4942, $4947), _ctx$4);
                                var self = Kind$Term$check$($4943(_body_var$18), Maybe$some$(_body_typ$19), _defs$3, _body_ctx$20, Kind$MPath$o$(_path$5), _orig$6);
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
                                                var self = Kind$Check$result$(Maybe$some$($4945), List$nil);
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
                                        var $4949 = $4952;
                                        break;
                                };
                                var $4946 = $4949;
                                break;
                            case 'Kind.Term.var':
                            case 'Kind.Term.lam':
                            case 'Kind.Term.app':
                            case 'Kind.Term.ori':
                                var _expected$13 = Either$left$("(function type)");
                                var _detected$14 = Either$right$($4945);
                                var $4958 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                var $4946 = $4958;
                                break;
                            case 'Kind.Term.ref':
                            case 'Kind.Term.hol':
                            case 'Kind.Term.nat':
                            case 'Kind.Term.chr':
                            case 'Kind.Term.str':
                                var _expected$12 = Either$left$("(function type)");
                                var _detected$13 = Either$right$($4945);
                                var $4959 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$12, _detected$13, _ctx$4), List$nil));
                                var $4946 = $4959;
                                break;
                            case 'Kind.Term.typ':
                                var _expected$11 = Either$left$("(function type)");
                                var _detected$12 = Either$right$($4945);
                                var $4960 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$11, _detected$12, _ctx$4), List$nil));
                                var $4946 = $4960;
                                break;
                            case 'Kind.Term.let':
                            case 'Kind.Term.def':
                            case 'Kind.Term.ann':
                            case 'Kind.Term.gol':
                                var _expected$14 = Either$left$("(function type)");
                                var _detected$15 = Either$right$($4945);
                                var $4961 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                var $4946 = $4961;
                                break;
                            case 'Kind.Term.cse':
                                var _expected$17 = Either$left$("(function type)");
                                var _detected$18 = Either$right$($4945);
                                var $4962 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$17, _detected$18, _ctx$4), List$nil));
                                var $4946 = $4962;
                                break;
                        };
                        var $4944 = $4946;
                        break;
                    case 'Maybe.none':
                        var _lam_type$9 = Kind$Term$hol$(Bits$e);
                        var _lam_term$10 = Kind$Term$ann$(Bool$false, _term$1, _lam_type$9);
                        var $4963 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), _lam_term$10), List$nil));
                        var $4944 = $4963;
                        break;
                };
                var self = $4944;
                break;
            case 'Kind.Term.app':
                var $4964 = self.func;
                var $4965 = self.argm;
                var self = Kind$Term$check$($4964, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4967 = self.value;
                        var $4968 = self.errors;
                        var self = $4967;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4970 = self.value;
                                var _func_typ$12 = Kind$Term$reduce$($4970, _defs$3);
                                var self = _func_typ$12;
                                switch (self._) {
                                    case 'Kind.Term.all':
                                        var $4972 = self.xtyp;
                                        var $4973 = self.body;
                                        var self = Kind$Term$check$($4965, Maybe$some$($4972), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
                                        switch (self._) {
                                            case 'Kind.Check.result':
                                                var $4975 = self.value;
                                                var $4976 = self.errors;
                                                var self = $4975;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $4978 = Kind$Check$result$(Maybe$none, $4976);
                                                        var $4977 = $4978;
                                                        break;
                                                    case 'Maybe.some':
                                                        var self = Kind$Check$result$(Maybe$some$($4973($4964)($4965)), List$nil);
                                                        switch (self._) {
                                                            case 'Kind.Check.result':
                                                                var $4980 = self.value;
                                                                var $4981 = self.errors;
                                                                var $4982 = Kind$Check$result$($4980, List$concat$($4976, $4981));
                                                                var $4979 = $4982;
                                                                break;
                                                        };
                                                        var $4977 = $4979;
                                                        break;
                                                };
                                                var $4974 = $4977;
                                                break;
                                        };
                                        var self = $4974;
                                        break;
                                    case 'Kind.Term.var':
                                    case 'Kind.Term.lam':
                                    case 'Kind.Term.app':
                                    case 'Kind.Term.ori':
                                        var _expected$15 = Either$left$("(function type)");
                                        var _detected$16 = Either$right$(_func_typ$12);
                                        var $4983 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$15, _detected$16, _ctx$4), List$nil));
                                        var self = $4983;
                                        break;
                                    case 'Kind.Term.ref':
                                    case 'Kind.Term.hol':
                                    case 'Kind.Term.nat':
                                    case 'Kind.Term.chr':
                                    case 'Kind.Term.str':
                                        var _expected$14 = Either$left$("(function type)");
                                        var _detected$15 = Either$right$(_func_typ$12);
                                        var $4984 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$14, _detected$15, _ctx$4), List$nil));
                                        var self = $4984;
                                        break;
                                    case 'Kind.Term.typ':
                                        var _expected$13 = Either$left$("(function type)");
                                        var _detected$14 = Either$right$(_func_typ$12);
                                        var $4985 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$13, _detected$14, _ctx$4), List$nil));
                                        var self = $4985;
                                        break;
                                    case 'Kind.Term.let':
                                    case 'Kind.Term.def':
                                    case 'Kind.Term.ann':
                                    case 'Kind.Term.gol':
                                        var _expected$16 = Either$left$("(function type)");
                                        var _detected$17 = Either$right$(_func_typ$12);
                                        var $4986 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$16, _detected$17, _ctx$4), List$nil));
                                        var self = $4986;
                                        break;
                                    case 'Kind.Term.cse':
                                        var _expected$19 = Either$left$("(function type)");
                                        var _detected$20 = Either$right$(_func_typ$12);
                                        var $4987 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, _expected$19, _detected$20, _ctx$4), List$nil));
                                        var self = $4987;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $4988 = self.value;
                                        var $4989 = self.errors;
                                        var $4990 = Kind$Check$result$($4988, List$concat$($4968, $4989));
                                        var $4971 = $4990;
                                        break;
                                };
                                var $4969 = $4971;
                                break;
                            case 'Maybe.none':
                                var $4991 = Kind$Check$result$(Maybe$none, $4968);
                                var $4969 = $4991;
                                break;
                        };
                        var $4966 = $4969;
                        break;
                };
                var self = $4966;
                break;
            case 'Kind.Term.let':
                var $4992 = self.name;
                var $4993 = self.expr;
                var $4994 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($4993, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $4996 = self.value;
                        var $4997 = self.errors;
                        var self = $4996;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4999 = self.value;
                                var _body_val$14 = $4994(Kind$Term$var$($4992, _ctx_size$10));
                                var _body_ctx$15 = List$cons$(Pair$new$($4992, $4999), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5001 = self.value;
                                        var $5002 = self.errors;
                                        var self = $5001;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5004 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5004), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5006 = self.value;
                                                        var $5007 = self.errors;
                                                        var $5008 = Kind$Check$result$($5006, List$concat$($5002, $5007));
                                                        var $5005 = $5008;
                                                        break;
                                                };
                                                var $5003 = $5005;
                                                break;
                                            case 'Maybe.none':
                                                var $5009 = Kind$Check$result$(Maybe$none, $5002);
                                                var $5003 = $5009;
                                                break;
                                        };
                                        var self = $5003;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5010 = self.value;
                                        var $5011 = self.errors;
                                        var $5012 = Kind$Check$result$($5010, List$concat$($4997, $5011));
                                        var $5000 = $5012;
                                        break;
                                };
                                var $4998 = $5000;
                                break;
                            case 'Maybe.none':
                                var $5013 = Kind$Check$result$(Maybe$none, $4997);
                                var $4998 = $5013;
                                break;
                        };
                        var $4995 = $4998;
                        break;
                };
                var self = $4995;
                break;
            case 'Kind.Term.def':
                var $5014 = self.name;
                var $5015 = self.expr;
                var $5016 = self.body;
                var _ctx_size$10 = (list_length(_ctx$4));
                var self = Kind$Term$check$($5015, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5018 = self.value;
                        var $5019 = self.errors;
                        var self = $5018;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5021 = self.value;
                                var _body_val$14 = $5016(Kind$Term$ann$(Bool$true, $5015, $5021));
                                var _body_ctx$15 = List$cons$(Pair$new$($5014, $5021), _ctx$4);
                                var self = Kind$Term$check$(_body_val$14, _type$2, _defs$3, _body_ctx$15, Kind$MPath$i$(_path$5), _orig$6);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5023 = self.value;
                                        var $5024 = self.errors;
                                        var self = $5023;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5026 = self.value;
                                                var self = Kind$Check$result$(Maybe$some$($5026), List$nil);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5028 = self.value;
                                                        var $5029 = self.errors;
                                                        var $5030 = Kind$Check$result$($5028, List$concat$($5024, $5029));
                                                        var $5027 = $5030;
                                                        break;
                                                };
                                                var $5025 = $5027;
                                                break;
                                            case 'Maybe.none':
                                                var $5031 = Kind$Check$result$(Maybe$none, $5024);
                                                var $5025 = $5031;
                                                break;
                                        };
                                        var self = $5025;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5032 = self.value;
                                        var $5033 = self.errors;
                                        var $5034 = Kind$Check$result$($5032, List$concat$($5019, $5033));
                                        var $5022 = $5034;
                                        break;
                                };
                                var $5020 = $5022;
                                break;
                            case 'Maybe.none':
                                var $5035 = Kind$Check$result$(Maybe$none, $5019);
                                var $5020 = $5035;
                                break;
                        };
                        var $5017 = $5020;
                        break;
                };
                var self = $5017;
                break;
            case 'Kind.Term.ann':
                var $5036 = self.done;
                var $5037 = self.term;
                var $5038 = self.type;
                var self = $5036;
                if (self) {
                    var $5040 = Kind$Check$result$(Maybe$some$($5038), List$nil);
                    var $5039 = $5040;
                } else {
                    var self = Kind$Term$check$($5037, Maybe$some$($5038), _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                    switch (self._) {
                        case 'Kind.Check.result':
                            var $5042 = self.value;
                            var $5043 = self.errors;
                            var self = $5042;
                            switch (self._) {
                                case 'Maybe.none':
                                    var $5045 = Kind$Check$result$(Maybe$none, $5043);
                                    var $5044 = $5045;
                                    break;
                                case 'Maybe.some':
                                    var self = Kind$Term$check$($5038, Maybe$some$(Kind$Term$typ), _defs$3, _ctx$4, Kind$MPath$i$(_path$5), _orig$6);
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
                                                    var self = Kind$Check$result$(Maybe$some$($5038), List$nil);
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
                                            var self = $5049;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kind.Check.result':
                                            var $5055 = self.value;
                                            var $5056 = self.errors;
                                            var $5057 = Kind$Check$result$($5055, List$concat$($5043, $5056));
                                            var $5046 = $5057;
                                            break;
                                    };
                                    var $5044 = $5046;
                                    break;
                            };
                            var $5041 = $5044;
                            break;
                    };
                    var $5039 = $5041;
                };
                var self = $5039;
                break;
            case 'Kind.Term.gol':
                var $5058 = self.name;
                var $5059 = self.dref;
                var $5060 = self.verb;
                var $5061 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$show_goal$($5058, $5059, $5060, _type$2, _ctx$4), List$nil));
                var self = $5061;
                break;
            case 'Kind.Term.cse':
                var $5062 = self.path;
                var $5063 = self.expr;
                var $5064 = self.name;
                var $5065 = self.with;
                var $5066 = self.cses;
                var $5067 = self.moti;
                var _expr$13 = $5063;
                var self = Kind$Term$check$(_expr$13, Maybe$none, _defs$3, _ctx$4, Kind$MPath$o$(_path$5), _orig$6);
                switch (self._) {
                    case 'Kind.Check.result':
                        var $5069 = self.value;
                        var $5070 = self.errors;
                        var self = $5069;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5072 = self.value;
                                var self = $5067;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5074 = self.value;
                                        var $5075 = Kind$Term$desugar_cse$($5063, $5064, $5065, $5066, $5074, $5072, _defs$3, _ctx$4);
                                        var _dsug$17 = $5075;
                                        break;
                                    case 'Maybe.none':
                                        var self = _type$2;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5077 = self.value;
                                                var _size$18 = (list_length(_ctx$4));
                                                var _typv$19 = Kind$Term$normalize$($5077, Map$new);
                                                var _moti$20 = Kind$SmartMotive$make$($5064, $5063, $5072, _typv$19, _size$18, _defs$3);
                                                var $5078 = _moti$20;
                                                var _moti$17 = $5078;
                                                break;
                                            case 'Maybe.none':
                                                var $5079 = Kind$Term$hol$(Bits$e);
                                                var _moti$17 = $5079;
                                                break;
                                        };
                                        var $5076 = Maybe$some$(Kind$Term$cse$($5062, $5063, $5064, $5065, $5066, Maybe$some$(_moti$17)));
                                        var _dsug$17 = $5076;
                                        break;
                                };
                                var self = _dsug$17;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $5080 = self.value;
                                        var $5081 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$patch$(Kind$MPath$to_bits$(_path$5), $5080), List$nil));
                                        var self = $5081;
                                        break;
                                    case 'Maybe.none':
                                        var $5082 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$cant_infer$(_orig$6, _term$1, _ctx$4), List$nil));
                                        var self = $5082;
                                        break;
                                };
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5083 = self.value;
                                        var $5084 = self.errors;
                                        var $5085 = Kind$Check$result$($5083, List$concat$($5070, $5084));
                                        var $5073 = $5085;
                                        break;
                                };
                                var $5071 = $5073;
                                break;
                            case 'Maybe.none':
                                var $5086 = Kind$Check$result$(Maybe$none, $5070);
                                var $5071 = $5086;
                                break;
                        };
                        var $5068 = $5071;
                        break;
                };
                var self = $5068;
                break;
            case 'Kind.Term.ori':
                var $5087 = self.orig;
                var $5088 = self.expr;
                var $5089 = Kind$Term$check$($5088, _type$2, _defs$3, _ctx$4, _path$5, Maybe$some$($5087));
                var self = $5089;
                break;
            case 'Kind.Term.typ':
                var $5090 = Kind$Check$result$(Maybe$some$(Kind$Term$typ), List$nil);
                var self = $5090;
                break;
            case 'Kind.Term.hol':
                var $5091 = Kind$Check$result$(_type$2, List$nil);
                var self = $5091;
                break;
            case 'Kind.Term.nat':
                var $5092 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Nat")), List$nil);
                var self = $5092;
                break;
            case 'Kind.Term.chr':
                var $5093 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("Char")), List$nil);
                var self = $5093;
                break;
            case 'Kind.Term.str':
                var $5094 = Kind$Check$result$(Maybe$some$(Kind$Term$ref$("String")), List$nil);
                var self = $5094;
                break;
        };
        switch (self._) {
            case 'Kind.Check.result':
                var $5095 = self.value;
                var $5096 = self.errors;
                var self = $5095;
                switch (self._) {
                    case 'Maybe.some':
                        var $5098 = self.value;
                        var self = _type$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5100 = self.value;
                                var self = Kind$Term$equal$($5100, $5098, _defs$3, (list_length(_ctx$4)), (({})));
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5102 = self.value;
                                        var $5103 = self.errors;
                                        var self = $5102;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $5105 = self.value;
                                                var self = $5105;
                                                if (self) {
                                                    var $5107 = Kind$Check$result$(Maybe$some$($5100), List$nil);
                                                    var self = $5107;
                                                } else {
                                                    var $5108 = Kind$Check$result$(_type$2, List$cons$(Kind$Error$type_mismatch$(_orig$6, Either$right$($5100), Either$right$($5098), _ctx$4), List$nil));
                                                    var self = $5108;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5109 = self.value;
                                                        var $5110 = self.errors;
                                                        var $5111 = Kind$Check$result$($5109, List$concat$($5103, $5110));
                                                        var $5106 = $5111;
                                                        break;
                                                };
                                                var $5104 = $5106;
                                                break;
                                            case 'Maybe.none':
                                                var $5112 = Kind$Check$result$(Maybe$none, $5103);
                                                var $5104 = $5112;
                                                break;
                                        };
                                        var $5101 = $5104;
                                        break;
                                };
                                var self = $5101;
                                break;
                            case 'Maybe.none':
                                var $5113 = Kind$Check$result$(Maybe$some$($5098), List$nil);
                                var self = $5113;
                                break;
                        };
                        switch (self._) {
                            case 'Kind.Check.result':
                                var $5114 = self.value;
                                var $5115 = self.errors;
                                var $5116 = Kind$Check$result$($5114, List$concat$($5096, $5115));
                                var $5099 = $5116;
                                break;
                        };
                        var $5097 = $5099;
                        break;
                    case 'Maybe.none':
                        var $5117 = Kind$Check$result$(Maybe$none, $5096);
                        var $5097 = $5117;
                        break;
                };
                var $4899 = $5097;
                break;
        };
        return $4899;
    };
    const Kind$Term$check = x0 => x1 => x2 => x3 => x4 => x5 => Kind$Term$check$(x0, x1, x2, x3, x4, x5);

    function Kind$Path$nil$(_x$1) {
        var $5118 = _x$1;
        return $5118;
    };
    const Kind$Path$nil = x0 => Kind$Path$nil$(x0);
    const Kind$MPath$nil = Maybe$some$(Kind$Path$nil);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $5120 = Bool$true;
                var $5119 = $5120;
                break;
            case 'List.cons':
                var $5121 = Bool$false;
                var $5119 = $5121;
                break;
        };
        return $5119;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kind$Term$patch_at$(_path$1, _term$2, _fn$3) {
        var self = _term$2;
        switch (self._) {
            case 'Kind.Term.all':
                var $5123 = self.eras;
                var $5124 = self.self;
                var $5125 = self.name;
                var $5126 = self.xtyp;
                var $5127 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5129 = self.slice(0, -1);
                        var $5130 = Kind$Term$all$($5123, $5124, $5125, Kind$Term$patch_at$($5129, $5126, _fn$3), $5127);
                        var $5128 = $5130;
                        break;
                    case 'i':
                        var $5131 = self.slice(0, -1);
                        var $5132 = Kind$Term$all$($5123, $5124, $5125, $5126, (_s$10 => _x$11 => {
                            var $5133 = Kind$Term$patch_at$($5131, $5127(_s$10)(_x$11), _fn$3);
                            return $5133;
                        }));
                        var $5128 = $5132;
                        break;
                    case 'e':
                        var $5134 = _fn$3(_term$2);
                        var $5128 = $5134;
                        break;
                };
                var $5122 = $5128;
                break;
            case 'Kind.Term.lam':
                var $5135 = self.name;
                var $5136 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5138 = _fn$3(_term$2);
                        var $5137 = $5138;
                        break;
                    case 'o':
                    case 'i':
                        var $5139 = Kind$Term$lam$($5135, (_x$7 => {
                            var $5140 = Kind$Term$patch_at$(Bits$tail$(_path$1), $5136(_x$7), _fn$3);
                            return $5140;
                        }));
                        var $5137 = $5139;
                        break;
                };
                var $5122 = $5137;
                break;
            case 'Kind.Term.app':
                var $5141 = self.func;
                var $5142 = self.argm;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5144 = self.slice(0, -1);
                        var $5145 = Kind$Term$app$(Kind$Term$patch_at$($5144, $5141, _fn$3), $5142);
                        var $5143 = $5145;
                        break;
                    case 'i':
                        var $5146 = self.slice(0, -1);
                        var $5147 = Kind$Term$app$($5141, Kind$Term$patch_at$($5146, $5142, _fn$3));
                        var $5143 = $5147;
                        break;
                    case 'e':
                        var $5148 = _fn$3(_term$2);
                        var $5143 = $5148;
                        break;
                };
                var $5122 = $5143;
                break;
            case 'Kind.Term.let':
                var $5149 = self.name;
                var $5150 = self.expr;
                var $5151 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5153 = self.slice(0, -1);
                        var $5154 = Kind$Term$let$($5149, Kind$Term$patch_at$($5153, $5150, _fn$3), $5151);
                        var $5152 = $5154;
                        break;
                    case 'i':
                        var $5155 = self.slice(0, -1);
                        var $5156 = Kind$Term$let$($5149, $5150, (_x$8 => {
                            var $5157 = Kind$Term$patch_at$($5155, $5151(_x$8), _fn$3);
                            return $5157;
                        }));
                        var $5152 = $5156;
                        break;
                    case 'e':
                        var $5158 = _fn$3(_term$2);
                        var $5152 = $5158;
                        break;
                };
                var $5122 = $5152;
                break;
            case 'Kind.Term.def':
                var $5159 = self.name;
                var $5160 = self.expr;
                var $5161 = self.body;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5163 = self.slice(0, -1);
                        var $5164 = Kind$Term$def$($5159, Kind$Term$patch_at$($5163, $5160, _fn$3), $5161);
                        var $5162 = $5164;
                        break;
                    case 'i':
                        var $5165 = self.slice(0, -1);
                        var $5166 = Kind$Term$def$($5159, $5160, (_x$8 => {
                            var $5167 = Kind$Term$patch_at$($5165, $5161(_x$8), _fn$3);
                            return $5167;
                        }));
                        var $5162 = $5166;
                        break;
                    case 'e':
                        var $5168 = _fn$3(_term$2);
                        var $5162 = $5168;
                        break;
                };
                var $5122 = $5162;
                break;
            case 'Kind.Term.ann':
                var $5169 = self.done;
                var $5170 = self.term;
                var $5171 = self.type;
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $5173 = self.slice(0, -1);
                        var $5174 = Kind$Term$ann$($5169, Kind$Term$patch_at$($5173, $5170, _fn$3), $5171);
                        var $5172 = $5174;
                        break;
                    case 'i':
                        var $5175 = self.slice(0, -1);
                        var $5176 = Kind$Term$ann$($5169, $5170, Kind$Term$patch_at$($5175, $5171, _fn$3));
                        var $5172 = $5176;
                        break;
                    case 'e':
                        var $5177 = _fn$3(_term$2);
                        var $5172 = $5177;
                        break;
                };
                var $5122 = $5172;
                break;
            case 'Kind.Term.ori':
                var $5178 = self.orig;
                var $5179 = self.expr;
                var $5180 = Kind$Term$ori$($5178, Kind$Term$patch_at$(_path$1, $5179, _fn$3));
                var $5122 = $5180;
                break;
            case 'Kind.Term.var':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5182 = _fn$3(_term$2);
                        var $5181 = $5182;
                        break;
                    case 'o':
                    case 'i':
                        var $5183 = _term$2;
                        var $5181 = $5183;
                        break;
                };
                var $5122 = $5181;
                break;
            case 'Kind.Term.ref':
            case 'Kind.Term.hol':
            case 'Kind.Term.nat':
            case 'Kind.Term.chr':
            case 'Kind.Term.str':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5185 = _fn$3(_term$2);
                        var $5184 = $5185;
                        break;
                    case 'o':
                    case 'i':
                        var $5186 = _term$2;
                        var $5184 = $5186;
                        break;
                };
                var $5122 = $5184;
                break;
            case 'Kind.Term.typ':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5188 = _fn$3(_term$2);
                        var $5187 = $5188;
                        break;
                    case 'o':
                    case 'i':
                        var $5189 = _term$2;
                        var $5187 = $5189;
                        break;
                };
                var $5122 = $5187;
                break;
            case 'Kind.Term.gol':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5191 = _fn$3(_term$2);
                        var $5190 = $5191;
                        break;
                    case 'o':
                    case 'i':
                        var $5192 = _term$2;
                        var $5190 = $5192;
                        break;
                };
                var $5122 = $5190;
                break;
            case 'Kind.Term.cse':
                var self = _path$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'e':
                        var $5194 = _fn$3(_term$2);
                        var $5193 = $5194;
                        break;
                    case 'o':
                    case 'i':
                        var $5195 = _term$2;
                        var $5193 = $5195;
                        break;
                };
                var $5122 = $5193;
                break;
        };
        return $5122;
    };
    const Kind$Term$patch_at = x0 => x1 => x2 => Kind$Term$patch_at$(x0, x1, x2);

    function Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, _errs$10, _fixd$11) {
        var self = _errs$10;
        switch (self._) {
            case 'List.cons':
                var $5197 = self.head;
                var $5198 = self.tail;
                var self = $5197;
                switch (self._) {
                    case 'Kind.Error.waiting':
                        var $5200 = self.name;
                        var $5201 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                            var $5202 = _m$bind$15;
                            return $5202;
                        }))(Kind$Synth$one$($5200, _defs$9))((_new_defs$15 => {
                            var self = _new_defs$15;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5204 = self.value;
                                    var $5205 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5204, $5198, Bool$true);
                                    var $5203 = $5205;
                                    break;
                                case 'Maybe.none':
                                    var $5206 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5198, _fixd$11);
                                    var $5203 = $5206;
                                    break;
                            };
                            return $5203;
                        }));
                        var $5199 = $5201;
                        break;
                    case 'Kind.Error.patch':
                        var $5207 = self.path;
                        var $5208 = self.term;
                        var self = $5207;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $5210 = self.slice(0, -1);
                                var _term$17 = Kind$Term$patch_at$($5210, _term$5, (_x$17 => {
                                    var $5212 = $5208;
                                    return $5212;
                                }));
                                var $5211 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$17, _type$6, _isct$7, _arit$8, _defs$9, $5198, Bool$true);
                                var $5209 = $5211;
                                break;
                            case 'i':
                                var $5213 = self.slice(0, -1);
                                var _type$17 = Kind$Term$patch_at$($5213, _type$6, (_x$17 => {
                                    var $5215 = $5208;
                                    return $5215;
                                }));
                                var $5214 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$17, _isct$7, _arit$8, _defs$9, $5198, Bool$true);
                                var $5209 = $5214;
                                break;
                            case 'e':
                                var $5216 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $5217 = _m$pure$17;
                                    return $5217;
                                }))(Maybe$none);
                                var $5209 = $5216;
                                break;
                        };
                        var $5199 = $5209;
                        break;
                    case 'Kind.Error.undefined_reference':
                        var $5218 = self.name;
                        var $5219 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                            var $5220 = _m$bind$16;
                            return $5220;
                        }))(Kind$Synth$one$($5218, _defs$9))((_new_defs$16 => {
                            var self = _new_defs$16;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $5222 = self.value;
                                    var $5223 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, $5222, $5198, Bool$true);
                                    var $5221 = $5223;
                                    break;
                                case 'Maybe.none':
                                    var $5224 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5198, _fixd$11);
                                    var $5221 = $5224;
                                    break;
                            };
                            return $5221;
                        }));
                        var $5199 = $5219;
                        break;
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.cant_infer':
                        var $5225 = Kind$Synth$fix$(_file$1, _code$2, _orig$3, _name$4, _term$5, _type$6, _isct$7, _arit$8, _defs$9, $5198, _fixd$11);
                        var $5199 = $5225;
                        break;
                };
                var $5196 = $5199;
                break;
            case 'List.nil':
                var self = _fixd$11;
                if (self) {
                    var _type$12 = Kind$Term$bind$(List$nil, (_x$12 => {
                        var $5228 = (_x$12 + '1');
                        return $5228;
                    }), _type$6);
                    var _term$13 = Kind$Term$bind$(List$nil, (_x$13 => {
                        var $5229 = (_x$13 + '0');
                        return $5229;
                    }), _term$5);
                    var _defs$14 = Kind$set$(_name$4, Kind$Def$new$(_file$1, _code$2, _orig$3, _name$4, _term$13, _type$12, _isct$7, _arit$8, Kind$Status$init), _defs$9);
                    var $5227 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                        var $5230 = _m$pure$16;
                        return $5230;
                    }))(Maybe$some$(_defs$14));
                    var $5226 = $5227;
                } else {
                    var $5231 = IO$monad$((_m$bind$12 => _m$pure$13 => {
                        var $5232 = _m$pure$13;
                        return $5232;
                    }))(Maybe$none);
                    var $5226 = $5231;
                };
                var $5196 = $5226;
                break;
        };
        return $5196;
    };
    const Kind$Synth$fix = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Kind$Synth$fix$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);

    function Kind$Status$fail$(_errors$1) {
        var $5233 = ({
            _: 'Kind.Status.fail',
            'errors': _errors$1
        });
        return $5233;
    };
    const Kind$Status$fail = x0 => Kind$Status$fail$(x0);

    function Kind$Synth$one$(_name$1, _defs$2) {
        var self = Kind$get$(_name$1, _defs$2);
        switch (self._) {
            case 'Maybe.some':
                var $5235 = self.value;
                var self = $5235;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5237 = self.file;
                        var $5238 = self.code;
                        var $5239 = self.orig;
                        var $5240 = self.name;
                        var $5241 = self.term;
                        var $5242 = self.type;
                        var $5243 = self.isct;
                        var $5244 = self.arit;
                        var $5245 = self.stat;
                        var _file$13 = $5237;
                        var _code$14 = $5238;
                        var _orig$15 = $5239;
                        var _name$16 = $5240;
                        var _term$17 = $5241;
                        var _type$18 = $5242;
                        var _isct$19 = $5243;
                        var _arit$20 = $5244;
                        var _stat$21 = $5245;
                        var self = _stat$21;
                        switch (self._) {
                            case 'Kind.Status.init':
                                var _defs$22 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Kind$Status$wait), _defs$2);
                                var self = Kind$Term$check$(_type$18, Maybe$some$(Kind$Term$typ), _defs$22, List$nil, Kind$MPath$i$(Kind$MPath$nil), Maybe$none);
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5248 = self.value;
                                        var $5249 = self.errors;
                                        var self = $5248;
                                        switch (self._) {
                                            case 'Maybe.none':
                                                var $5251 = Kind$Check$result$(Maybe$none, $5249);
                                                var $5250 = $5251;
                                                break;
                                            case 'Maybe.some':
                                                var self = Kind$Term$check$(_term$17, Maybe$some$(_type$18), _defs$22, List$nil, Kind$MPath$o$(Kind$MPath$nil), Maybe$none);
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5253 = self.value;
                                                        var $5254 = self.errors;
                                                        var self = $5253;
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $5256 = Kind$Check$result$(Maybe$none, $5254);
                                                                var $5255 = $5256;
                                                                break;
                                                            case 'Maybe.some':
                                                                var self = Kind$Check$result$(Maybe$some$(Unit$new), List$nil);
                                                                switch (self._) {
                                                                    case 'Kind.Check.result':
                                                                        var $5258 = self.value;
                                                                        var $5259 = self.errors;
                                                                        var $5260 = Kind$Check$result$($5258, List$concat$($5254, $5259));
                                                                        var $5257 = $5260;
                                                                        break;
                                                                };
                                                                var $5255 = $5257;
                                                                break;
                                                        };
                                                        var self = $5255;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Kind.Check.result':
                                                        var $5261 = self.value;
                                                        var $5262 = self.errors;
                                                        var $5263 = Kind$Check$result$($5261, List$concat$($5249, $5262));
                                                        var $5252 = $5263;
                                                        break;
                                                };
                                                var $5250 = $5252;
                                                break;
                                        };
                                        var _checked$23 = $5250;
                                        break;
                                };
                                var self = _checked$23;
                                switch (self._) {
                                    case 'Kind.Check.result':
                                        var $5264 = self.errors;
                                        var self = List$is_empty$($5264);
                                        if (self) {
                                            var _defs$26 = Kind$define$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, Bool$true, _defs$22);
                                            var $5266 = IO$monad$((_m$bind$27 => _m$pure$28 => {
                                                var $5267 = _m$pure$28;
                                                return $5267;
                                            }))(Maybe$some$(_defs$26));
                                            var $5265 = $5266;
                                        } else {
                                            var $5268 = IO$monad$((_m$bind$26 => _m$pure$27 => {
                                                var $5269 = _m$bind$26;
                                                return $5269;
                                            }))(Kind$Synth$fix$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _defs$22, $5264, Bool$false))((_fixed$26 => {
                                                var self = _fixed$26;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $5271 = self.value;
                                                        var $5272 = Kind$Synth$one$(_name$16, $5271);
                                                        var $5270 = $5272;
                                                        break;
                                                    case 'Maybe.none':
                                                        var _stat$27 = Kind$Status$fail$($5264);
                                                        var _defs$28 = Kind$set$(_name$16, Kind$Def$new$(_file$13, _code$14, _orig$15, _name$16, _term$17, _type$18, _isct$19, _arit$20, _stat$27), _defs$22);
                                                        var $5273 = IO$monad$((_m$bind$29 => _m$pure$30 => {
                                                            var $5274 = _m$pure$30;
                                                            return $5274;
                                                        }))(Maybe$some$(_defs$28));
                                                        var $5270 = $5273;
                                                        break;
                                                };
                                                return $5270;
                                            }));
                                            var $5265 = $5268;
                                        };
                                        var $5247 = $5265;
                                        break;
                                };
                                var $5246 = $5247;
                                break;
                            case 'Kind.Status.wait':
                            case 'Kind.Status.done':
                                var $5275 = IO$monad$((_m$bind$22 => _m$pure$23 => {
                                    var $5276 = _m$pure$23;
                                    return $5276;
                                }))(Maybe$some$(_defs$2));
                                var $5246 = $5275;
                                break;
                            case 'Kind.Status.fail':
                                var $5277 = IO$monad$((_m$bind$23 => _m$pure$24 => {
                                    var $5278 = _m$pure$24;
                                    return $5278;
                                }))(Maybe$some$(_defs$2));
                                var $5246 = $5277;
                                break;
                        };
                        var $5236 = $5246;
                        break;
                };
                var $5234 = $5236;
                break;
            case 'Maybe.none':
                var $5279 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5280 = _m$bind$3;
                    return $5280;
                }))(Kind$Synth$load$(_name$1, _defs$2))((_loaded$3 => {
                    var self = _loaded$3;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5282 = self.value;
                            var $5283 = Kind$Synth$one$(_name$1, $5282);
                            var $5281 = $5283;
                            break;
                        case 'Maybe.none':
                            var $5284 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                                var $5285 = _m$pure$5;
                                return $5285;
                            }))(Maybe$none);
                            var $5281 = $5284;
                            break;
                    };
                    return $5281;
                }));
                var $5234 = $5279;
                break;
        };
        return $5234;
    };
    const Kind$Synth$one = x0 => x1 => Kind$Synth$one$(x0, x1);

    function Map$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'Map.tie':
                var $5287 = self.val;
                var $5288 = self.lft;
                var $5289 = self.rgt;
                var self = $5287;
                switch (self._) {
                    case 'Maybe.some':
                        var $5291 = self.value;
                        var $5292 = Maybe$some$(_fn$3($5291));
                        var _val$8 = $5292;
                        break;
                    case 'Maybe.none':
                        var $5293 = Maybe$none;
                        var _val$8 = $5293;
                        break;
                };
                var _lft$9 = Map$map$(_fn$3, $5288);
                var _rgt$10 = Map$map$(_fn$3, $5289);
                var $5290 = Map$tie$(_val$8, _lft$9, _rgt$10);
                var $5286 = $5290;
                break;
            case 'Map.new':
                var $5294 = Map$new;
                var $5286 = $5294;
                break;
        };
        return $5286;
    };
    const Map$map = x0 => x1 => Map$map$(x0, x1);
    const Kind$Term$inline$names = (() => {
        var _inl$1 = List$cons$("Monad.pure", List$cons$("Monad.bind", List$cons$("Monad.new", List$cons$("Parser.monad", List$cons$("Parser.bind", List$cons$("Parser.pure", List$cons$("Kind.Check.pure", List$cons$("Kind.Check.bind", List$cons$("Kind.Check.monad", List$cons$("Kind.Check.value", List$cons$("Kind.Check.none", List$nil)))))))))));
        var _kvs$2 = List$mapped$(_inl$1, (_x$2 => {
            var $5296 = Pair$new$((kind_name_to_bits(_x$2)), Unit$new);
            return $5296;
        }));
        var $5295 = Map$from_list$(_kvs$2);
        return $5295;
    })();

    function Kind$Term$inline$reduce$(_term$1, _defs$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5298 = self.name;
                var _inli$4 = Set$has$((kind_name_to_bits($5298)), Kind$Term$inline$names);
                var self = _inli$4;
                if (self) {
                    var self = Kind$get$($5298, _defs$2);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5301 = self.value;
                            var self = $5301;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5303 = self.term;
                                    var $5304 = Kind$Term$inline$reduce$($5303, _defs$2);
                                    var $5302 = $5304;
                                    break;
                            };
                            var $5300 = $5302;
                            break;
                        case 'Maybe.none':
                            var $5305 = Kind$Term$ref$($5298);
                            var $5300 = $5305;
                            break;
                    };
                    var $5299 = $5300;
                } else {
                    var $5306 = _term$1;
                    var $5299 = $5306;
                };
                var $5297 = $5299;
                break;
            case 'Kind.Term.app':
                var $5307 = self.func;
                var $5308 = self.argm;
                var _func$5 = Kind$Term$inline$reduce$($5307, _defs$2);
                var self = _func$5;
                switch (self._) {
                    case 'Kind.Term.lam':
                        var $5310 = self.body;
                        var $5311 = Kind$Term$inline$reduce$($5310($5308), _defs$2);
                        var $5309 = $5311;
                        break;
                    case 'Kind.Term.let':
                        var $5312 = self.name;
                        var $5313 = self.expr;
                        var $5314 = self.body;
                        var $5315 = Kind$Term$let$($5312, $5313, (_x$9 => {
                            var $5316 = Kind$Term$inline$reduce$(Kind$Term$app$($5314(_x$9), $5308), _defs$2);
                            return $5316;
                        }));
                        var $5309 = $5315;
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
                        var $5317 = _term$1;
                        var $5309 = $5317;
                        break;
                };
                var $5297 = $5309;
                break;
            case 'Kind.Term.ori':
                var $5318 = self.expr;
                var $5319 = Kind$Term$inline$reduce$($5318, _defs$2);
                var $5297 = $5319;
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
                var $5320 = _term$1;
                var $5297 = $5320;
                break;
        };
        return $5297;
    };
    const Kind$Term$inline$reduce = x0 => x1 => Kind$Term$inline$reduce$(x0, x1);

    function Kind$Term$inline$(_term$1, _defs$2) {
        var self = Kind$Term$inline$reduce$(_term$1, _defs$2);
        switch (self._) {
            case 'Kind.Term.var':
                var $5322 = self.name;
                var $5323 = self.indx;
                var $5324 = Kind$Term$var$($5322, $5323);
                var $5321 = $5324;
                break;
            case 'Kind.Term.ref':
                var $5325 = self.name;
                var $5326 = Kind$Term$ref$($5325);
                var $5321 = $5326;
                break;
            case 'Kind.Term.all':
                var $5327 = self.eras;
                var $5328 = self.self;
                var $5329 = self.name;
                var $5330 = self.xtyp;
                var $5331 = self.body;
                var $5332 = Kind$Term$all$($5327, $5328, $5329, Kind$Term$inline$($5330, _defs$2), (_s$8 => _x$9 => {
                    var $5333 = Kind$Term$inline$($5331(_s$8)(_x$9), _defs$2);
                    return $5333;
                }));
                var $5321 = $5332;
                break;
            case 'Kind.Term.lam':
                var $5334 = self.name;
                var $5335 = self.body;
                var $5336 = Kind$Term$lam$($5334, (_x$5 => {
                    var $5337 = Kind$Term$inline$($5335(_x$5), _defs$2);
                    return $5337;
                }));
                var $5321 = $5336;
                break;
            case 'Kind.Term.app':
                var $5338 = self.func;
                var $5339 = self.argm;
                var $5340 = Kind$Term$app$(Kind$Term$inline$($5338, _defs$2), Kind$Term$inline$($5339, _defs$2));
                var $5321 = $5340;
                break;
            case 'Kind.Term.let':
                var $5341 = self.name;
                var $5342 = self.expr;
                var $5343 = self.body;
                var $5344 = Kind$Term$let$($5341, Kind$Term$inline$($5342, _defs$2), (_x$6 => {
                    var $5345 = Kind$Term$inline$($5343(_x$6), _defs$2);
                    return $5345;
                }));
                var $5321 = $5344;
                break;
            case 'Kind.Term.def':
                var $5346 = self.name;
                var $5347 = self.expr;
                var $5348 = self.body;
                var $5349 = Kind$Term$def$($5346, Kind$Term$inline$($5347, _defs$2), (_x$6 => {
                    var $5350 = Kind$Term$inline$($5348(_x$6), _defs$2);
                    return $5350;
                }));
                var $5321 = $5349;
                break;
            case 'Kind.Term.ann':
                var $5351 = self.done;
                var $5352 = self.term;
                var $5353 = self.type;
                var $5354 = Kind$Term$ann$($5351, Kind$Term$inline$($5352, _defs$2), Kind$Term$inline$($5353, _defs$2));
                var $5321 = $5354;
                break;
            case 'Kind.Term.gol':
                var $5355 = self.name;
                var $5356 = self.dref;
                var $5357 = self.verb;
                var $5358 = Kind$Term$gol$($5355, $5356, $5357);
                var $5321 = $5358;
                break;
            case 'Kind.Term.hol':
                var $5359 = self.path;
                var $5360 = Kind$Term$hol$($5359);
                var $5321 = $5360;
                break;
            case 'Kind.Term.nat':
                var $5361 = self.natx;
                var $5362 = Kind$Term$nat$($5361);
                var $5321 = $5362;
                break;
            case 'Kind.Term.chr':
                var $5363 = self.chrx;
                var $5364 = Kind$Term$chr$($5363);
                var $5321 = $5364;
                break;
            case 'Kind.Term.str':
                var $5365 = self.strx;
                var $5366 = Kind$Term$str$($5365);
                var $5321 = $5366;
                break;
            case 'Kind.Term.ori':
                var $5367 = self.expr;
                var $5368 = Kind$Term$inline$($5367, _defs$2);
                var $5321 = $5368;
                break;
            case 'Kind.Term.typ':
                var $5369 = Kind$Term$typ;
                var $5321 = $5369;
                break;
            case 'Kind.Term.cse':
                var $5370 = _term$1;
                var $5321 = $5370;
                break;
        };
        return $5321;
    };
    const Kind$Term$inline = x0 => x1 => Kind$Term$inline$(x0, x1);

    function Map$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5372 = self.val;
                var $5373 = self.lft;
                var $5374 = self.rgt;
                var self = $5372;
                switch (self._) {
                    case 'Maybe.some':
                        var $5376 = self.value;
                        var $5377 = List$cons$($5376, _list$3);
                        var _list0$7 = $5377;
                        break;
                    case 'Maybe.none':
                        var $5378 = _list$3;
                        var _list0$7 = $5378;
                        break;
                };
                var _list1$8 = Map$values$go$($5373, _list0$7);
                var _list2$9 = Map$values$go$($5374, _list1$8);
                var $5375 = _list2$9;
                var $5371 = $5375;
                break;
            case 'Map.new':
                var $5379 = _list$3;
                var $5371 = $5379;
                break;
        };
        return $5371;
    };
    const Map$values$go = x0 => x1 => Map$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $5380 = Map$values$go$(_xs$2, List$nil);
        return $5380;
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
                        var $5382 = _name$2;
                        var $5381 = $5382;
                    } else {
                        var $5383 = (self - 1n);
                        var $5384 = (_name$2 + ("^" + Nat$show$(_brui$3)));
                        var $5381 = $5384;
                    };
                    return $5381;
                } else {
                    var $5385 = (self - 1n);
                    var self = _vars$4;
                    switch (self._) {
                        case 'List.cons':
                            var $5387 = self.head;
                            var $5388 = self.tail;
                            var self = (_name$2 === $5387);
                            if (self) {
                                var $5390 = Nat$succ$(_brui$3);
                                var _brui$8 = $5390;
                            } else {
                                var $5391 = _brui$3;
                                var _brui$8 = $5391;
                            };
                            var $5389 = Kind$Core$var_name$($5385, _name$2, _brui$8, $5388);
                            var $5386 = $5389;
                            break;
                        case 'List.nil':
                            var $5392 = "unbound";
                            var $5386 = $5392;
                            break;
                    };
                    return $5386;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Core$var_name = x0 => x1 => x2 => x3 => Kind$Core$var_name$(x0, x1, x2, x3);

    function Kind$Name$show$(_name$1) {
        var $5393 = _name$1;
        return $5393;
    };
    const Kind$Name$show = x0 => Kind$Name$show$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5395 = self.slice(0, -1);
                var $5396 = (2n * Bits$to_nat$($5395));
                var $5394 = $5396;
                break;
            case 'i':
                var $5397 = self.slice(0, -1);
                var $5398 = Nat$succ$((2n * Bits$to_nat$($5397)));
                var $5394 = $5398;
                break;
            case 'e':
                var $5399 = 0n;
                var $5394 = $5399;
                break;
        };
        return $5394;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $5401 = u16_to_word(self);
                var $5402 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($5401)));
                var $5400 = $5402;
                break;
        };
        return $5400;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function Kind$escape$char$(_chr$1) {
        var self = (_chr$1 === Kind$backslash);
        if (self) {
            var $5404 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
            var $5403 = $5404;
        } else {
            var self = (_chr$1 === 34);
            if (self) {
                var $5406 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                var $5405 = $5406;
            } else {
                var self = (_chr$1 === 39);
                if (self) {
                    var $5408 = String$cons$(Kind$backslash, String$cons$(_chr$1, String$nil));
                    var $5407 = $5408;
                } else {
                    var self = U16$btw$(32, _chr$1, 126);
                    if (self) {
                        var $5410 = String$cons$(_chr$1, String$nil);
                        var $5409 = $5410;
                    } else {
                        var $5411 = String$flatten$(List$cons$(String$cons$(Kind$backslash, String$nil), List$cons$("u{", List$cons$(U16$show_hex$(_chr$1), List$cons$("}", List$cons$(String$nil, List$nil))))));
                        var $5409 = $5411;
                    };
                    var $5407 = $5409;
                };
                var $5405 = $5407;
            };
            var $5403 = $5405;
        };
        return $5403;
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
                    var $5412 = String$reverse$(_result$2);
                    return $5412;
                } else {
                    var $5413 = self.charCodeAt(0);
                    var $5414 = self.slice(1);
                    var $5415 = Kind$escape$go$($5414, (String$reverse$(Kind$escape$char$($5413)) + _result$2));
                    return $5415;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$escape$go = x0 => x1 => Kind$escape$go$(x0, x1);

    function Kind$escape$(_str$1) {
        var $5416 = Kind$escape$go$(_str$1, "");
        return $5416;
    };
    const Kind$escape = x0 => Kind$escape$(x0);

    function Kind$Core$show$(_term$1, _indx$2, _vars$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5418 = self.name;
                var $5419 = self.indx;
                var $5420 = Kind$Core$var_name$(Nat$pred$((_indx$2 - $5419 <= 0n ? 0n : _indx$2 - $5419)), $5418, 0n, _vars$3);
                var $5417 = $5420;
                break;
            case 'Kind.Term.ref':
                var $5421 = self.name;
                var $5422 = Kind$Name$show$($5421);
                var $5417 = $5422;
                break;
            case 'Kind.Term.all':
                var $5423 = self.eras;
                var $5424 = self.self;
                var $5425 = self.name;
                var $5426 = self.xtyp;
                var $5427 = self.body;
                var _eras$9 = $5423;
                var self = _eras$9;
                if (self) {
                    var $5429 = "%";
                    var _init$10 = $5429;
                } else {
                    var $5430 = "@";
                    var _init$10 = $5430;
                };
                var _self$11 = Kind$Name$show$($5424);
                var _name$12 = Kind$Name$show$($5425);
                var _xtyp$13 = Kind$Core$show$($5426, _indx$2, _vars$3);
                var _body$14 = Kind$Core$show$($5427(Kind$Term$var$($5424, _indx$2))(Kind$Term$var$($5425, Nat$succ$(_indx$2))), Nat$succ$(Nat$succ$(_indx$2)), List$cons$($5425, List$cons$($5424, _vars$3)));
                var $5428 = String$flatten$(List$cons$(_init$10, List$cons$(_self$11, List$cons$("(", List$cons$(_name$12, List$cons$(":", List$cons$(_xtyp$13, List$cons$(") ", List$cons$(_body$14, List$nil)))))))));
                var $5417 = $5428;
                break;
            case 'Kind.Term.lam':
                var $5431 = self.name;
                var $5432 = self.body;
                var _name$6 = Kind$Name$show$($5431);
                var _body$7 = Kind$Core$show$($5432(Kind$Term$var$($5431, _indx$2)), Nat$succ$(_indx$2), List$cons$($5431, _vars$3));
                var $5433 = String$flatten$(List$cons$("#", List$cons$(_name$6, List$cons$(" ", List$cons$(_body$7, List$nil)))));
                var $5417 = $5433;
                break;
            case 'Kind.Term.app':
                var $5434 = self.func;
                var $5435 = self.argm;
                var _func$6 = Kind$Core$show$($5434, _indx$2, _vars$3);
                var _argm$7 = Kind$Core$show$($5435, _indx$2, _vars$3);
                var $5436 = String$flatten$(List$cons$("(", List$cons$(_func$6, List$cons$(" ", List$cons$(_argm$7, List$cons$(")", List$nil))))));
                var $5417 = $5436;
                break;
            case 'Kind.Term.let':
                var $5437 = self.name;
                var $5438 = self.expr;
                var $5439 = self.body;
                var _name$7 = Kind$Name$show$($5437);
                var _expr$8 = Kind$Core$show$($5438, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5439(Kind$Term$var$($5437, _indx$2)), Nat$succ$(_indx$2), List$cons$($5437, _vars$3));
                var $5440 = String$flatten$(List$cons$("!", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5417 = $5440;
                break;
            case 'Kind.Term.def':
                var $5441 = self.name;
                var $5442 = self.expr;
                var $5443 = self.body;
                var _name$7 = Kind$Name$show$($5441);
                var _expr$8 = Kind$Core$show$($5442, _indx$2, _vars$3);
                var _body$9 = Kind$Core$show$($5443(Kind$Term$var$($5441, _indx$2)), Nat$succ$(_indx$2), List$cons$($5441, _vars$3));
                var $5444 = String$flatten$(List$cons$("$", List$cons$(_name$7, List$cons$(" = ", List$cons$(_expr$8, List$cons$("; ", List$cons$(_body$9, List$nil)))))));
                var $5417 = $5444;
                break;
            case 'Kind.Term.ann':
                var $5445 = self.term;
                var $5446 = self.type;
                var _term$7 = Kind$Core$show$($5445, _indx$2, _vars$3);
                var _type$8 = Kind$Core$show$($5446, _indx$2, _vars$3);
                var $5447 = String$flatten$(List$cons$("{", List$cons$(_term$7, List$cons$(":", List$cons$(_type$8, List$cons$("}", List$nil))))));
                var $5417 = $5447;
                break;
            case 'Kind.Term.nat':
                var $5448 = self.natx;
                var $5449 = String$flatten$(List$cons$("+", List$cons$(Nat$show$($5448), List$nil)));
                var $5417 = $5449;
                break;
            case 'Kind.Term.chr':
                var $5450 = self.chrx;
                var $5451 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5450), List$cons$("\'", List$nil))));
                var $5417 = $5451;
                break;
            case 'Kind.Term.str':
                var $5452 = self.strx;
                var $5453 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5452), List$cons$("\"", List$nil))));
                var $5417 = $5453;
                break;
            case 'Kind.Term.ori':
                var $5454 = self.expr;
                var $5455 = Kind$Core$show$($5454, _indx$2, _vars$3);
                var $5417 = $5455;
                break;
            case 'Kind.Term.typ':
                var $5456 = "*";
                var $5417 = $5456;
                break;
            case 'Kind.Term.gol':
                var $5457 = "<GOL>";
                var $5417 = $5457;
                break;
            case 'Kind.Term.hol':
                var $5458 = "<HOL>";
                var $5417 = $5458;
                break;
            case 'Kind.Term.cse':
                var $5459 = "<CSE>";
                var $5417 = $5459;
                break;
        };
        return $5417;
    };
    const Kind$Core$show = x0 => x1 => x2 => Kind$Core$show$(x0, x1, x2);

    function Kind$Defs$core$(_defs$1) {
        var _result$2 = "";
        var _result$3 = (() => {
            var $5462 = _result$2;
            var $5463 = Map$values$(_defs$1);
            let _result$4 = $5462;
            let _defn$3;
            while ($5463._ === 'List.cons') {
                _defn$3 = $5463.head;
                var self = _defn$3;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5464 = self.name;
                        var $5465 = self.term;
                        var $5466 = self.type;
                        var $5467 = self.stat;
                        var self = $5467;
                        switch (self._) {
                            case 'Kind.Status.init':
                            case 'Kind.Status.wait':
                            case 'Kind.Status.fail':
                                var $5469 = _result$4;
                                var $5468 = $5469;
                                break;
                            case 'Kind.Status.done':
                                var _name$14 = $5464;
                                var _term$15 = Kind$Core$show$($5465, 0n, List$nil);
                                var _type$16 = Kind$Core$show$($5466, 0n, List$nil);
                                var $5470 = String$flatten$(List$cons$(_result$4, List$cons$(_name$14, List$cons$(" : ", List$cons$(_type$16, List$cons$(" = ", List$cons$(_term$15, List$cons$(";\u{a}", List$nil))))))));
                                var $5468 = $5470;
                                break;
                        };
                        var $5462 = $5468;
                        break;
                };
                _result$4 = $5462;
                $5463 = $5463.tail;
            }
            return _result$4;
        })();
        var $5460 = _result$3;
        return $5460;
    };
    const Kind$Defs$core = x0 => Kind$Defs$core$(x0);

    function Kind$to_core$io$one$(_name$1) {
        var $5471 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5472 = _m$bind$2;
            return $5472;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5474 = self.value;
                    var $5475 = $5474;
                    var _defs$3 = $5475;
                    break;
                case 'Maybe.none':
                    var $5476 = Map$new;
                    var _defs$3 = $5476;
                    break;
            };
            var _defs$4 = Map$map$((_defn$4 => {
                var self = _defn$4;
                switch (self._) {
                    case 'Kind.Def.new':
                        var $5478 = self.file;
                        var $5479 = self.code;
                        var $5480 = self.orig;
                        var $5481 = self.name;
                        var $5482 = self.term;
                        var $5483 = self.type;
                        var $5484 = self.isct;
                        var $5485 = self.arit;
                        var $5486 = self.stat;
                        var _term$14 = Kind$Term$inline$($5482, _defs$3);
                        var _type$15 = Kind$Term$inline$($5483, _defs$3);
                        var $5487 = Kind$Def$new$($5478, $5479, $5480, $5481, _term$14, _type$15, $5484, $5485, $5486);
                        var $5477 = $5487;
                        break;
                };
                return $5477;
            }), _defs$3);
            var $5473 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                var $5488 = _m$pure$6;
                return $5488;
            }))(Kind$Defs$core$(_defs$4));
            return $5473;
        }));
        return $5471;
    };
    const Kind$to_core$io$one = x0 => Kind$to_core$io$one$(x0);

    function IO$put_string$(_text$1) {
        var $5489 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $5490 = IO$end$(Unit$new);
            return $5490;
        }));
        return $5489;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $5491 = IO$put_string$((_text$1 + "\u{a}"));
        return $5491;
    };
    const IO$print = x0 => IO$print$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $5493 = self.value;
                var $5494 = _f$4($5493);
                var $5492 = $5494;
                break;
            case 'Maybe.none':
                var $5495 = Maybe$none;
                var $5492 = $5495;
                break;
        };
        return $5492;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $5496 = _new$2(Maybe$bind)(Maybe$some);
        return $5496;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Kind$Term$show$as_nat$go$(_term$1) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5498 = self.name;
                var self = ($5498 === "Nat.zero");
                if (self) {
                    var $5500 = Maybe$some$(0n);
                    var $5499 = $5500;
                } else {
                    var $5501 = Maybe$none;
                    var $5499 = $5501;
                };
                var $5497 = $5499;
                break;
            case 'Kind.Term.app':
                var $5502 = self.func;
                var $5503 = self.argm;
                var self = $5502;
                switch (self._) {
                    case 'Kind.Term.ref':
                        var $5505 = self.name;
                        var self = ($5505 === "Nat.succ");
                        if (self) {
                            var $5507 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                                var $5508 = _m$bind$5;
                                return $5508;
                            }))(Kind$Term$show$as_nat$go$($5503))((_pred$5 => {
                                var $5509 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $5510 = _m$pure$7;
                                    return $5510;
                                }))(Nat$succ$(_pred$5));
                                return $5509;
                            }));
                            var $5506 = $5507;
                        } else {
                            var $5511 = Maybe$none;
                            var $5506 = $5511;
                        };
                        var $5504 = $5506;
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
                        var $5512 = Maybe$none;
                        var $5504 = $5512;
                        break;
                };
                var $5497 = $5504;
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
                var $5513 = Maybe$none;
                var $5497 = $5513;
                break;
        };
        return $5497;
    };
    const Kind$Term$show$as_nat$go = x0 => Kind$Term$show$as_nat$go$(x0);

    function Kind$Term$show$as_nat$(_term$1) {
        var $5514 = Maybe$mapped$(Kind$Term$show$as_nat$go$(_term$1), Nat$show);
        return $5514;
    };
    const Kind$Term$show$as_nat = x0 => Kind$Term$show$as_nat$(x0);

    function Kind$Term$show$is_ref$(_term$1, _name$2) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.ref':
                var $5516 = self.name;
                var $5517 = (_name$2 === $5516);
                var $5515 = $5517;
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
                var $5518 = Bool$false;
                var $5515 = $5518;
                break;
        };
        return $5515;
    };
    const Kind$Term$show$is_ref = x0 => x1 => Kind$Term$show$is_ref$(x0, x1);

    function Kind$Term$show$app$done$(_term$1, _path$2, _args$3) {
        var _arity$4 = (list_length(_args$3));
        var self = (Kind$Term$show$is_ref$(_term$1, "Equal") && (_arity$4 === 3n));
        if (self) {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var _eq_lft$6 = Maybe$default$("?", List$at$(1n, _args$3));
            var _eq_rgt$7 = Maybe$default$("?", List$at$(2n, _args$3));
            var $5520 = String$flatten$(List$cons$(_eq_lft$6, List$cons$(" == ", List$cons$(_eq_rgt$7, List$nil))));
            var $5519 = $5520;
        } else {
            var _func$5 = Kind$Term$show$go$(_term$1, _path$2);
            var self = _func$5;
            if (self.length === 0) {
                var $5522 = Bool$false;
                var _wrap$6 = $5522;
            } else {
                var $5523 = self.charCodeAt(0);
                var $5524 = self.slice(1);
                var $5525 = ($5523 === 40);
                var _wrap$6 = $5525;
            };
            var _args$7 = String$join$(",", _args$3);
            var self = _wrap$6;
            if (self) {
                var $5526 = String$flatten$(List$cons$("(", List$cons$(_func$5, List$cons$(")", List$nil))));
                var _func$8 = $5526;
            } else {
                var $5527 = _func$5;
                var _func$8 = $5527;
            };
            var $5521 = String$flatten$(List$cons$(_func$8, List$cons$("(", List$cons$(_args$7, List$cons$(")", List$nil)))));
            var $5519 = $5521;
        };
        return $5519;
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
                        var $5528 = self.func;
                        var $5529 = self.argm;
                        var $5530 = Kind$Term$show$app$($5528, Kind$MPath$o$(_path$2), List$cons$(Kind$Term$show$go$($5529, Kind$MPath$i$(_path$2)), _args$3));
                        return $5530;
                    case 'Kind.Term.ori':
                        var $5531 = self.expr;
                        var $5532 = Kind$Term$show$app$($5531, _path$2, _args$3);
                        return $5532;
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
                        var $5533 = Kind$Term$show$app$done$(_term$1, _path$2, _args$3);
                        return $5533;
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
                var $5535 = self.val;
                var $5536 = self.lft;
                var $5537 = self.rgt;
                var self = $5535;
                switch (self._) {
                    case 'Maybe.some':
                        var $5539 = self.value;
                        var $5540 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $5539), _list$4);
                        var _list0$8 = $5540;
                        break;
                    case 'Maybe.none':
                        var $5541 = _list$4;
                        var _list0$8 = $5541;
                        break;
                };
                var _list1$9 = Map$to_list$go$($5536, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$to_list$go$($5537, (_key$3 + '1'), _list1$9);
                var $5538 = _list2$10;
                var $5534 = $5538;
                break;
            case 'Map.new':
                var $5542 = _list$4;
                var $5534 = $5542;
                break;
        };
        return $5534;
    };
    const Map$to_list$go = x0 => x1 => x2 => Map$to_list$go$(x0, x1, x2);

    function Map$to_list$(_xs$2) {
        var $5543 = List$reverse$(Map$to_list$go$(_xs$2, Bits$e, List$nil));
        return $5543;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $5545 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5547 = List$cons$(_head$6, _tail$7);
                    var $5546 = $5547;
                } else {
                    var $5548 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $5549 = Bits$chunks_of$go$(_len$1, $5545, $5548, _chunk$7);
                    var $5546 = $5549;
                };
                var $5544 = $5546;
                break;
            case 'i':
                var $5550 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $5552 = List$cons$(_head$6, _tail$7);
                    var $5551 = $5552;
                } else {
                    var $5553 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $5554 = Bits$chunks_of$go$(_len$1, $5550, $5553, _chunk$7);
                    var $5551 = $5554;
                };
                var $5544 = $5551;
                break;
            case 'e':
                var $5555 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $5544 = $5555;
                break;
        };
        return $5544;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $5556 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $5556;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $5558 = Word$e;
            var $5557 = $5558;
        } else {
            var $5559 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $5561 = self.slice(0, -1);
                    var $5562 = Word$o$(Word$from_bits$($5559, $5561));
                    var $5560 = $5562;
                    break;
                case 'i':
                    var $5563 = self.slice(0, -1);
                    var $5564 = Word$i$(Word$from_bits$($5559, $5563));
                    var $5560 = $5564;
                    break;
                case 'e':
                    var $5565 = Word$o$(Word$from_bits$($5559, Bits$e));
                    var $5560 = $5565;
                    break;
            };
            var $5557 = $5560;
        };
        return $5557;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);

    function Kind$Name$from_bits$(_bits$1) {
        var _list$2 = Bits$chunks_of$(6n, _bits$1);
        var _name$3 = List$fold$(_list$2, String$nil, (_bts$3 => _name$4 => {
            var _u16$5 = U16$new$(Word$from_bits$(16n, Bits$reverse$(_bts$3)));
            var self = U16$btw$(0, _u16$5, 25);
            if (self) {
                var $5568 = ((_u16$5 + 65) & 0xFFFF);
                var _chr$6 = $5568;
            } else {
                var self = U16$btw$(26, _u16$5, 51);
                if (self) {
                    var $5570 = ((_u16$5 + 71) & 0xFFFF);
                    var $5569 = $5570;
                } else {
                    var self = U16$btw$(52, _u16$5, 61);
                    if (self) {
                        var $5572 = (Math.max(_u16$5 - 4, 0));
                        var $5571 = $5572;
                    } else {
                        var self = (62 === _u16$5);
                        if (self) {
                            var $5574 = 46;
                            var $5573 = $5574;
                        } else {
                            var $5575 = 95;
                            var $5573 = $5575;
                        };
                        var $5571 = $5573;
                    };
                    var $5569 = $5571;
                };
                var _chr$6 = $5569;
            };
            var $5567 = String$cons$(_chr$6, _name$4);
            return $5567;
        }));
        var $5566 = _name$3;
        return $5566;
    };
    const Kind$Name$from_bits = x0 => Kind$Name$from_bits$(x0);

    function Kind$Term$show$go$(_term$1, _path$2) {
        var self = Kind$Term$show$as_nat$(_term$1);
        switch (self._) {
            case 'Maybe.some':
                var $5577 = self.value;
                var $5578 = $5577;
                var $5576 = $5578;
                break;
            case 'Maybe.none':
                var self = _term$1;
                switch (self._) {
                    case 'Kind.Term.var':
                        var $5580 = self.name;
                        var $5581 = Kind$Name$show$($5580);
                        var $5579 = $5581;
                        break;
                    case 'Kind.Term.ref':
                        var $5582 = self.name;
                        var _name$4 = Kind$Name$show$($5582);
                        var self = _path$2;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5584 = self.value;
                                var _path_val$6 = ((Bits$e + '1') + Kind$Path$to_bits$($5584));
                                var _path_str$7 = Nat$show$(Bits$to_nat$(_path_val$6));
                                var $5585 = String$flatten$(List$cons$(_name$4, List$cons$(Kind$color$("2", ("-" + _path_str$7)), List$nil)));
                                var $5583 = $5585;
                                break;
                            case 'Maybe.none':
                                var $5586 = _name$4;
                                var $5583 = $5586;
                                break;
                        };
                        var $5579 = $5583;
                        break;
                    case 'Kind.Term.all':
                        var $5587 = self.eras;
                        var $5588 = self.self;
                        var $5589 = self.name;
                        var $5590 = self.xtyp;
                        var $5591 = self.body;
                        var _eras$8 = $5587;
                        var _self$9 = Kind$Name$show$($5588);
                        var _name$10 = Kind$Name$show$($5589);
                        var _type$11 = Kind$Term$show$go$($5590, Kind$MPath$o$(_path$2));
                        var self = _eras$8;
                        if (self) {
                            var $5593 = "<";
                            var _open$12 = $5593;
                        } else {
                            var $5594 = "(";
                            var _open$12 = $5594;
                        };
                        var self = _eras$8;
                        if (self) {
                            var $5595 = ">";
                            var _clos$13 = $5595;
                        } else {
                            var $5596 = ")";
                            var _clos$13 = $5596;
                        };
                        var _body$14 = Kind$Term$show$go$($5591(Kind$Term$var$($5588, 0n))(Kind$Term$var$($5589, 0n)), Kind$MPath$i$(_path$2));
                        var $5592 = String$flatten$(List$cons$(_self$9, List$cons$(_open$12, List$cons$(_name$10, List$cons$(":", List$cons$(_type$11, List$cons$(_clos$13, List$cons$(" ", List$cons$(_body$14, List$nil)))))))));
                        var $5579 = $5592;
                        break;
                    case 'Kind.Term.lam':
                        var $5597 = self.name;
                        var $5598 = self.body;
                        var _name$5 = Kind$Name$show$($5597);
                        var _body$6 = Kind$Term$show$go$($5598(Kind$Term$var$($5597, 0n)), Kind$MPath$o$(_path$2));
                        var $5599 = String$flatten$(List$cons$("(", List$cons$(_name$5, List$cons$(") ", List$cons$(_body$6, List$nil)))));
                        var $5579 = $5599;
                        break;
                    case 'Kind.Term.let':
                        var $5600 = self.name;
                        var $5601 = self.expr;
                        var $5602 = self.body;
                        var _name$6 = Kind$Name$show$($5600);
                        var _expr$7 = Kind$Term$show$go$($5601, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5602(Kind$Term$var$($5600, 0n)), Kind$MPath$i$(_path$2));
                        var $5603 = String$flatten$(List$cons$("let ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5579 = $5603;
                        break;
                    case 'Kind.Term.def':
                        var $5604 = self.name;
                        var $5605 = self.expr;
                        var $5606 = self.body;
                        var _name$6 = Kind$Name$show$($5604);
                        var _expr$7 = Kind$Term$show$go$($5605, Kind$MPath$o$(_path$2));
                        var _body$8 = Kind$Term$show$go$($5606(Kind$Term$var$($5604, 0n)), Kind$MPath$i$(_path$2));
                        var $5607 = String$flatten$(List$cons$("def ", List$cons$(_name$6, List$cons$(" = ", List$cons$(_expr$7, List$cons$("; ", List$cons$(_body$8, List$nil)))))));
                        var $5579 = $5607;
                        break;
                    case 'Kind.Term.ann':
                        var $5608 = self.term;
                        var $5609 = self.type;
                        var _term$6 = Kind$Term$show$go$($5608, Kind$MPath$o$(_path$2));
                        var _type$7 = Kind$Term$show$go$($5609, Kind$MPath$i$(_path$2));
                        var $5610 = String$flatten$(List$cons$(_term$6, List$cons$("::", List$cons$(_type$7, List$nil))));
                        var $5579 = $5610;
                        break;
                    case 'Kind.Term.gol':
                        var $5611 = self.name;
                        var _name$6 = Kind$Name$show$($5611);
                        var $5612 = String$flatten$(List$cons$("?", List$cons$(_name$6, List$nil)));
                        var $5579 = $5612;
                        break;
                    case 'Kind.Term.nat':
                        var $5613 = self.natx;
                        var $5614 = String$flatten$(List$cons$(Nat$show$($5613), List$nil));
                        var $5579 = $5614;
                        break;
                    case 'Kind.Term.chr':
                        var $5615 = self.chrx;
                        var $5616 = String$flatten$(List$cons$("\'", List$cons$(Kind$escape$char$($5615), List$cons$("\'", List$nil))));
                        var $5579 = $5616;
                        break;
                    case 'Kind.Term.str':
                        var $5617 = self.strx;
                        var $5618 = String$flatten$(List$cons$("\"", List$cons$(Kind$escape$($5617), List$cons$("\"", List$nil))));
                        var $5579 = $5618;
                        break;
                    case 'Kind.Term.cse':
                        var $5619 = self.expr;
                        var $5620 = self.name;
                        var $5621 = self.with;
                        var $5622 = self.cses;
                        var $5623 = self.moti;
                        var _expr$9 = Kind$Term$show$go$($5619, Kind$MPath$o$(_path$2));
                        var _name$10 = Kind$Name$show$($5620);
                        var _wyth$11 = String$join$("", List$mapped$($5621, (_defn$11 => {
                            var self = _defn$11;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5626 = self.name;
                                    var $5627 = self.term;
                                    var $5628 = self.type;
                                    var _name$21 = Kind$Name$show$($5626);
                                    var _type$22 = Kind$Term$show$go$($5628, Maybe$none);
                                    var _term$23 = Kind$Term$show$go$($5627, Maybe$none);
                                    var $5629 = String$flatten$(List$cons$(_name$21, List$cons$(": ", List$cons$(_type$22, List$cons$(" = ", List$cons$(_term$23, List$cons$(";", List$nil)))))));
                                    var $5625 = $5629;
                                    break;
                            };
                            return $5625;
                        })));
                        var _cses$12 = Map$to_list$($5622);
                        var _cses$13 = String$join$("", List$mapped$(_cses$12, (_x$13 => {
                            var _name$14 = Kind$Name$from_bits$(Pair$fst$(_x$13));
                            var _term$15 = Kind$Term$show$go$(Pair$snd$(_x$13), Maybe$none);
                            var $5630 = String$flatten$(List$cons$(_name$14, List$cons$(": ", List$cons$(_term$15, List$cons$("; ", List$nil)))));
                            return $5630;
                        })));
                        var self = $5623;
                        switch (self._) {
                            case 'Maybe.some':
                                var $5631 = self.value;
                                var $5632 = String$flatten$(List$cons$(": ", List$cons$(Kind$Term$show$go$($5631, Maybe$none), List$nil)));
                                var _moti$14 = $5632;
                                break;
                            case 'Maybe.none':
                                var $5633 = "";
                                var _moti$14 = $5633;
                                break;
                        };
                        var $5624 = String$flatten$(List$cons$("case ", List$cons$(_expr$9, List$cons$(" as ", List$cons$(_name$10, List$cons$(_wyth$11, List$cons$(" { ", List$cons$(_cses$13, List$cons$("}", List$cons$(_moti$14, List$nil))))))))));
                        var $5579 = $5624;
                        break;
                    case 'Kind.Term.ori':
                        var $5634 = self.expr;
                        var $5635 = Kind$Term$show$go$($5634, _path$2);
                        var $5579 = $5635;
                        break;
                    case 'Kind.Term.typ':
                        var $5636 = "Type";
                        var $5579 = $5636;
                        break;
                    case 'Kind.Term.app':
                        var $5637 = Kind$Term$show$app$(_term$1, _path$2, List$nil);
                        var $5579 = $5637;
                        break;
                    case 'Kind.Term.hol':
                        var $5638 = "_";
                        var $5579 = $5638;
                        break;
                };
                var $5576 = $5579;
                break;
        };
        return $5576;
    };
    const Kind$Term$show$go = x0 => x1 => Kind$Term$show$go$(x0, x1);

    function Kind$Term$show$(_term$1) {
        var $5639 = Kind$Term$show$go$(_term$1, Maybe$none);
        return $5639;
    };
    const Kind$Term$show = x0 => Kind$Term$show$(x0);

    function Kind$Defs$report$types$(_defs$1, _names$2) {
        var _types$3 = "";
        var _types$4 = (() => {
            var $5642 = _types$3;
            var $5643 = _names$2;
            let _types$5 = $5642;
            let _name$4;
            while ($5643._ === 'List.cons') {
                _name$4 = $5643.head;
                var self = Kind$get$(_name$4, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5644 = self.value;
                        var self = $5644;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5646 = self.type;
                                var $5647 = (_types$5 + (_name$4 + (": " + (Kind$Term$show$($5646) + "\u{a}"))));
                                var $5645 = $5647;
                                break;
                        };
                        var $5642 = $5645;
                        break;
                    case 'Maybe.none':
                        var $5648 = _types$5;
                        var $5642 = $5648;
                        break;
                };
                _types$5 = $5642;
                $5643 = $5643.tail;
            }
            return _types$5;
        })();
        var $5640 = _types$4;
        return $5640;
    };
    const Kind$Defs$report$types = x0 => x1 => Kind$Defs$report$types$(x0, x1);

    function Map$keys$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'Map.tie':
                var $5650 = self.val;
                var $5651 = self.lft;
                var $5652 = self.rgt;
                var self = $5650;
                switch (self._) {
                    case 'Maybe.none':
                        var $5654 = _list$4;
                        var _list0$8 = $5654;
                        break;
                    case 'Maybe.some':
                        var $5655 = List$cons$(Bits$reverse$(_key$3), _list$4);
                        var _list0$8 = $5655;
                        break;
                };
                var _list1$9 = Map$keys$go$($5651, (_key$3 + '0'), _list0$8);
                var _list2$10 = Map$keys$go$($5652, (_key$3 + '1'), _list1$9);
                var $5653 = _list2$10;
                var $5649 = $5653;
                break;
            case 'Map.new':
                var $5656 = _list$4;
                var $5649 = $5656;
                break;
        };
        return $5649;
    };
    const Map$keys$go = x0 => x1 => x2 => Map$keys$go$(x0, x1, x2);

    function Map$keys$(_xs$2) {
        var $5657 = List$reverse$(Map$keys$go$(_xs$2, Bits$e, List$nil));
        return $5657;
    };
    const Map$keys = x0 => Map$keys$(x0);

    function Kind$Error$relevant$(_errors$1, _got$2) {
        var self = _errors$1;
        switch (self._) {
            case 'List.cons':
                var $5659 = self.head;
                var $5660 = self.tail;
                var self = $5659;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                    case 'Kind.Error.cant_infer':
                        var $5662 = (!_got$2);
                        var _keep$5 = $5662;
                        break;
                    case 'Kind.Error.show_goal':
                        var $5663 = Bool$true;
                        var _keep$5 = $5663;
                        break;
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                        var $5664 = Bool$false;
                        var _keep$5 = $5664;
                        break;
                };
                var self = $5659;
                switch (self._) {
                    case 'Kind.Error.type_mismatch':
                    case 'Kind.Error.undefined_reference':
                        var $5665 = Bool$true;
                        var _got$6 = $5665;
                        break;
                    case 'Kind.Error.show_goal':
                    case 'Kind.Error.waiting':
                    case 'Kind.Error.indirect':
                    case 'Kind.Error.patch':
                    case 'Kind.Error.cant_infer':
                        var $5666 = _got$2;
                        var _got$6 = $5666;
                        break;
                };
                var _tail$7 = Kind$Error$relevant$($5660, _got$6);
                var self = _keep$5;
                if (self) {
                    var $5667 = List$cons$($5659, _tail$7);
                    var $5661 = $5667;
                } else {
                    var $5668 = _tail$7;
                    var $5661 = $5668;
                };
                var $5658 = $5661;
                break;
            case 'List.nil':
                var $5669 = List$nil;
                var $5658 = $5669;
                break;
        };
        return $5658;
    };
    const Kind$Error$relevant = x0 => x1 => Kind$Error$relevant$(x0, x1);

    function Kind$Context$show$(_context$1) {
        var self = _context$1;
        switch (self._) {
            case 'List.cons':
                var $5671 = self.head;
                var $5672 = self.tail;
                var self = $5671;
                switch (self._) {
                    case 'Pair.new':
                        var $5674 = self.fst;
                        var $5675 = self.snd;
                        var _name$6 = Kind$Name$show$($5674);
                        var _type$7 = Kind$Term$show$(Kind$Term$normalize$($5675, Map$new));
                        var _rest$8 = Kind$Context$show$($5672);
                        var $5676 = String$flatten$(List$cons$(_rest$8, List$cons$("- ", List$cons$(_name$6, List$cons$(": ", List$cons$(_type$7, List$cons$("\u{a}", List$nil)))))));
                        var $5673 = $5676;
                        break;
                };
                var $5670 = $5673;
                break;
            case 'List.nil':
                var $5677 = "";
                var $5670 = $5677;
                break;
        };
        return $5670;
    };
    const Kind$Context$show = x0 => Kind$Context$show$(x0);

    function Kind$Term$expand_at$(_path$1, _term$2, _defs$3) {
        var $5678 = Kind$Term$patch_at$(_path$1, _term$2, (_term$4 => {
            var self = _term$4;
            switch (self._) {
                case 'Kind.Term.ref':
                    var $5680 = self.name;
                    var self = Kind$get$($5680, _defs$3);
                    switch (self._) {
                        case 'Maybe.some':
                            var $5682 = self.value;
                            var self = $5682;
                            switch (self._) {
                                case 'Kind.Def.new':
                                    var $5684 = self.term;
                                    var $5685 = $5684;
                                    var $5683 = $5685;
                                    break;
                            };
                            var $5681 = $5683;
                            break;
                        case 'Maybe.none':
                            var $5686 = Kind$Term$ref$($5680);
                            var $5681 = $5686;
                            break;
                    };
                    var $5679 = $5681;
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
                    var $5687 = _term$4;
                    var $5679 = $5687;
                    break;
            };
            return $5679;
        }));
        return $5678;
    };
    const Kind$Term$expand_at = x0 => x1 => x2 => Kind$Term$expand_at$(x0, x1, x2);

    function Kind$Term$expand_ct$(_term$1, _defs$2, _arity$3) {
        var self = _term$1;
        switch (self._) {
            case 'Kind.Term.var':
                var $5689 = self.name;
                var $5690 = self.indx;
                var $5691 = Kind$Term$var$($5689, $5690);
                var $5688 = $5691;
                break;
            case 'Kind.Term.ref':
                var $5692 = self.name;
                var self = Kind$get$($5692, _defs$2);
                switch (self._) {
                    case 'Maybe.some':
                        var $5694 = self.value;
                        var self = $5694;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5696 = self.term;
                                var $5697 = self.isct;
                                var $5698 = self.arit;
                                var self = ($5697 && (_arity$3 > $5698));
                                if (self) {
                                    var $5700 = $5696;
                                    var $5699 = $5700;
                                } else {
                                    var $5701 = Kind$Term$ref$($5692);
                                    var $5699 = $5701;
                                };
                                var $5695 = $5699;
                                break;
                        };
                        var $5693 = $5695;
                        break;
                    case 'Maybe.none':
                        var $5702 = Kind$Term$ref$($5692);
                        var $5693 = $5702;
                        break;
                };
                var $5688 = $5693;
                break;
            case 'Kind.Term.all':
                var $5703 = self.eras;
                var $5704 = self.self;
                var $5705 = self.name;
                var $5706 = self.xtyp;
                var $5707 = self.body;
                var $5708 = Kind$Term$all$($5703, $5704, $5705, Kind$Term$expand_ct$($5706, _defs$2, 0n), (_s$9 => _x$10 => {
                    var $5709 = Kind$Term$expand_ct$($5707(_s$9)(_x$10), _defs$2, 0n);
                    return $5709;
                }));
                var $5688 = $5708;
                break;
            case 'Kind.Term.lam':
                var $5710 = self.name;
                var $5711 = self.body;
                var $5712 = Kind$Term$lam$($5710, (_x$6 => {
                    var $5713 = Kind$Term$expand_ct$($5711(_x$6), _defs$2, 0n);
                    return $5713;
                }));
                var $5688 = $5712;
                break;
            case 'Kind.Term.app':
                var $5714 = self.func;
                var $5715 = self.argm;
                var $5716 = Kind$Term$app$(Kind$Term$expand_ct$($5714, _defs$2, Nat$succ$(_arity$3)), Kind$Term$expand_ct$($5715, _defs$2, 0n));
                var $5688 = $5716;
                break;
            case 'Kind.Term.let':
                var $5717 = self.name;
                var $5718 = self.expr;
                var $5719 = self.body;
                var $5720 = Kind$Term$let$($5717, Kind$Term$expand_ct$($5718, _defs$2, 0n), (_x$7 => {
                    var $5721 = Kind$Term$expand_ct$($5719(_x$7), _defs$2, 0n);
                    return $5721;
                }));
                var $5688 = $5720;
                break;
            case 'Kind.Term.def':
                var $5722 = self.name;
                var $5723 = self.expr;
                var $5724 = self.body;
                var $5725 = Kind$Term$def$($5722, Kind$Term$expand_ct$($5723, _defs$2, 0n), (_x$7 => {
                    var $5726 = Kind$Term$expand_ct$($5724(_x$7), _defs$2, 0n);
                    return $5726;
                }));
                var $5688 = $5725;
                break;
            case 'Kind.Term.ann':
                var $5727 = self.done;
                var $5728 = self.term;
                var $5729 = self.type;
                var $5730 = Kind$Term$ann$($5727, Kind$Term$expand_ct$($5728, _defs$2, 0n), Kind$Term$expand_ct$($5729, _defs$2, 0n));
                var $5688 = $5730;
                break;
            case 'Kind.Term.gol':
                var $5731 = self.name;
                var $5732 = self.dref;
                var $5733 = self.verb;
                var $5734 = Kind$Term$gol$($5731, $5732, $5733);
                var $5688 = $5734;
                break;
            case 'Kind.Term.hol':
                var $5735 = self.path;
                var $5736 = Kind$Term$hol$($5735);
                var $5688 = $5736;
                break;
            case 'Kind.Term.nat':
                var $5737 = self.natx;
                var $5738 = Kind$Term$nat$($5737);
                var $5688 = $5738;
                break;
            case 'Kind.Term.chr':
                var $5739 = self.chrx;
                var $5740 = Kind$Term$chr$($5739);
                var $5688 = $5740;
                break;
            case 'Kind.Term.str':
                var $5741 = self.strx;
                var $5742 = Kind$Term$str$($5741);
                var $5688 = $5742;
                break;
            case 'Kind.Term.ori':
                var $5743 = self.orig;
                var $5744 = self.expr;
                var $5745 = Kind$Term$ori$($5743, $5744);
                var $5688 = $5745;
                break;
            case 'Kind.Term.typ':
                var $5746 = Kind$Term$typ;
                var $5688 = $5746;
                break;
            case 'Kind.Term.cse':
                var $5747 = _term$1;
                var $5688 = $5747;
                break;
        };
        return $5688;
    };
    const Kind$Term$expand_ct = x0 => x1 => x2 => Kind$Term$expand_ct$(x0, x1, x2);

    function Kind$Term$expand$(_dref$1, _term$2, _defs$3) {
        var _term$4 = Kind$Term$normalize$(_term$2, Map$new);
        var _term$5 = (() => {
            var $5750 = _term$4;
            var $5751 = _dref$1;
            let _term$6 = $5750;
            let _path$5;
            while ($5751._ === 'List.cons') {
                _path$5 = $5751.head;
                var _term$7 = Kind$Term$expand_at$(_path$5, _term$6, _defs$3);
                var _term$8 = Kind$Term$normalize$(_term$7, Map$new);
                var _term$9 = Kind$Term$expand_ct$(_term$8, _defs$3, 0n);
                var _term$10 = Kind$Term$normalize$(_term$9, Map$new);
                var $5750 = _term$10;
                _term$6 = $5750;
                $5751 = $5751.tail;
            }
            return _term$6;
        })();
        var $5748 = _term$5;
        return $5748;
    };
    const Kind$Term$expand = x0 => x1 => x2 => Kind$Term$expand$(x0, x1, x2);

    function Kind$Error$show$(_error$1, _defs$2) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5753 = self.expected;
                var $5754 = self.detected;
                var $5755 = self.context;
                var self = $5753;
                switch (self._) {
                    case 'Either.left':
                        var $5757 = self.value;
                        var $5758 = $5757;
                        var _expected$7 = $5758;
                        break;
                    case 'Either.right':
                        var $5759 = self.value;
                        var $5760 = Kind$Term$show$(Kind$Term$normalize$($5759, Map$new));
                        var _expected$7 = $5760;
                        break;
                };
                var self = $5754;
                switch (self._) {
                    case 'Either.left':
                        var $5761 = self.value;
                        var $5762 = $5761;
                        var _detected$8 = $5762;
                        break;
                    case 'Either.right':
                        var $5763 = self.value;
                        var $5764 = Kind$Term$show$(Kind$Term$normalize$($5763, Map$new));
                        var _detected$8 = $5764;
                        break;
                };
                var $5756 = String$flatten$(List$cons$("Type mismatch.\u{a}", List$cons$("- Expected: ", List$cons$(_expected$7, List$cons$("\u{a}", List$cons$("- Detected: ", List$cons$(_detected$8, List$cons$("\u{a}", List$cons$((() => {
                    var self = $5755;
                    switch (self._) {
                        case 'List.nil':
                            var $5765 = "";
                            return $5765;
                        case 'List.cons':
                            var $5766 = String$flatten$(List$cons$("With context:\u{a}", List$cons$(Kind$Context$show$($5755), List$nil)));
                            return $5766;
                    };
                })(), List$nil)))))))));
                var $5752 = $5756;
                break;
            case 'Kind.Error.show_goal':
                var $5767 = self.name;
                var $5768 = self.dref;
                var $5769 = self.verb;
                var $5770 = self.goal;
                var $5771 = self.context;
                var _goal_name$8 = String$flatten$(List$cons$("Goal ?", List$cons$(Kind$Name$show$($5767), List$cons$(":\u{a}", List$nil))));
                var self = $5770;
                switch (self._) {
                    case 'Maybe.some':
                        var $5773 = self.value;
                        var _goal$10 = Kind$Term$expand$($5768, $5773, _defs$2);
                        var $5774 = String$flatten$(List$cons$("With type: ", List$cons$((() => {
                            var self = $5769;
                            if (self) {
                                var $5775 = Kind$Term$show$go$(_goal$10, Maybe$some$((_x$11 => {
                                    var $5776 = _x$11;
                                    return $5776;
                                })));
                                return $5775;
                            } else {
                                var $5777 = Kind$Term$show$(_goal$10);
                                return $5777;
                            };
                        })(), List$cons$("\u{a}", List$nil))));
                        var _with_type$9 = $5774;
                        break;
                    case 'Maybe.none':
                        var $5778 = "";
                        var _with_type$9 = $5778;
                        break;
                };
                var self = $5771;
                switch (self._) {
                    case 'List.nil':
                        var $5779 = "";
                        var _with_ctxt$10 = $5779;
                        break;
                    case 'List.cons':
                        var $5780 = String$flatten$(List$cons$("With ctxt:\u{a}", List$cons$(Kind$Context$show$($5771), List$nil)));
                        var _with_ctxt$10 = $5780;
                        break;
                };
                var $5772 = String$flatten$(List$cons$(_goal_name$8, List$cons$(_with_type$9, List$cons$(_with_ctxt$10, List$nil))));
                var $5752 = $5772;
                break;
            case 'Kind.Error.waiting':
                var $5781 = self.name;
                var $5782 = String$flatten$(List$cons$("Waiting for \'", List$cons$($5781, List$cons$("\'.", List$nil))));
                var $5752 = $5782;
                break;
            case 'Kind.Error.indirect':
                var $5783 = self.name;
                var $5784 = String$flatten$(List$cons$("Error on dependency \'", List$cons$($5783, List$cons$("\'.", List$nil))));
                var $5752 = $5784;
                break;
            case 'Kind.Error.patch':
                var $5785 = self.term;
                var $5786 = String$flatten$(List$cons$("Patching: ", List$cons$(Kind$Term$show$($5785), List$nil)));
                var $5752 = $5786;
                break;
            case 'Kind.Error.undefined_reference':
                var $5787 = self.name;
                var $5788 = String$flatten$(List$cons$("Undefined reference: ", List$cons$(Kind$Name$show$($5787), List$cons$("\u{a}", List$nil))));
                var $5752 = $5788;
                break;
            case 'Kind.Error.cant_infer':
                var $5789 = self.term;
                var $5790 = self.context;
                var _term$6 = Kind$Term$show$($5789);
                var _context$7 = Kind$Context$show$($5790);
                var $5791 = String$flatten$(List$cons$("Can\'t infer type of: ", List$cons$(_term$6, List$cons$("\u{a}", List$cons$("With ctxt:\u{a}", List$cons$(_context$7, List$nil))))));
                var $5752 = $5791;
                break;
        };
        return $5752;
    };
    const Kind$Error$show = x0 => x1 => Kind$Error$show$(x0, x1);

    function Kind$Error$origin$(_error$1) {
        var self = _error$1;
        switch (self._) {
            case 'Kind.Error.type_mismatch':
                var $5793 = self.origin;
                var $5794 = $5793;
                var $5792 = $5794;
                break;
            case 'Kind.Error.undefined_reference':
                var $5795 = self.origin;
                var $5796 = $5795;
                var $5792 = $5796;
                break;
            case 'Kind.Error.cant_infer':
                var $5797 = self.origin;
                var $5798 = $5797;
                var $5792 = $5798;
                break;
            case 'Kind.Error.show_goal':
            case 'Kind.Error.waiting':
            case 'Kind.Error.indirect':
            case 'Kind.Error.patch':
                var $5799 = Maybe$none;
                var $5792 = $5799;
                break;
        };
        return $5792;
    };
    const Kind$Error$origin = x0 => Kind$Error$origin$(x0);

    function Kind$Defs$report$errors$(_defs$1) {
        var _errors$2 = "";
        var _errors$3 = (() => {
            var $5802 = _errors$2;
            var $5803 = Map$keys$(_defs$1);
            let _errors$4 = $5802;
            let _key$3;
            while ($5803._ === 'List.cons') {
                _key$3 = $5803.head;
                var _name$5 = Kind$Name$from_bits$(_key$3);
                var self = Kind$get$(_name$5, _defs$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $5804 = self.value;
                        var self = $5804;
                        switch (self._) {
                            case 'Kind.Def.new':
                                var $5806 = self.file;
                                var $5807 = self.code;
                                var $5808 = self.name;
                                var $5809 = self.stat;
                                var self = $5809;
                                switch (self._) {
                                    case 'Kind.Status.fail':
                                        var $5811 = self.errors;
                                        var self = $5811;
                                        switch (self._) {
                                            case 'List.nil':
                                                var $5813 = _errors$4;
                                                var $5812 = $5813;
                                                break;
                                            case 'List.cons':
                                                var _name_str$19 = $5808;
                                                var _rel_errs$20 = Kind$Error$relevant$($5811, Bool$false);
                                                var _errors$21 = (() => {
                                                    var $5816 = _errors$4;
                                                    var $5817 = _rel_errs$20;
                                                    let _errors$22 = $5816;
                                                    let _err$21;
                                                    while ($5817._ === 'List.cons') {
                                                        _err$21 = $5817.head;
                                                        var _err_msg$23 = Kind$Error$show$(_err$21, _defs$1);
                                                        var self = Kind$Error$origin$(_err$21);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $5818 = self.value;
                                                                var self = $5818;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $5820 = self.fst;
                                                                        var $5821 = self.snd;
                                                                        var _inside$27 = ("Inside \'" + ($5806 + "\':\u{a}"));
                                                                        var _source$28 = Kind$highlight$($5807, $5820, $5821);
                                                                        var $5822 = (_inside$27 + (_source$28 + "\u{a}"));
                                                                        var $5819 = $5822;
                                                                        break;
                                                                };
                                                                var _ori_msg$24 = $5819;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $5823 = "";
                                                                var _ori_msg$24 = $5823;
                                                                break;
                                                        };
                                                        var $5816 = (_errors$22 + (_err_msg$23 + (_ori_msg$24 + "\u{a}")));
                                                        _errors$22 = $5816;
                                                        $5817 = $5817.tail;
                                                    }
                                                    return _errors$22;
                                                })();
                                                var $5814 = _errors$21;
                                                var $5812 = $5814;
                                                break;
                                        };
                                        var $5810 = $5812;
                                        break;
                                    case 'Kind.Status.init':
                                    case 'Kind.Status.wait':
                                    case 'Kind.Status.done':
                                        var $5824 = _errors$4;
                                        var $5810 = $5824;
                                        break;
                                };
                                var $5805 = $5810;
                                break;
                        };
                        var $5802 = $5805;
                        break;
                    case 'Maybe.none':
                        var $5825 = _errors$4;
                        var $5802 = $5825;
                        break;
                };
                _errors$4 = $5802;
                $5803 = $5803.tail;
            }
            return _errors$4;
        })();
        var $5800 = _errors$3;
        return $5800;
    };
    const Kind$Defs$report$errors = x0 => Kind$Defs$report$errors$(x0);

    function Kind$Defs$report$(_defs$1, _names$2) {
        var _types$3 = Kind$Defs$report$types$(_defs$1, _names$2);
        var _errors$4 = Kind$Defs$report$errors$(_defs$1);
        var self = _errors$4;
        if (self.length === 0) {
            var $5827 = "All terms check.";
            var _errors$5 = $5827;
        } else {
            var $5828 = self.charCodeAt(0);
            var $5829 = self.slice(1);
            var $5830 = _errors$4;
            var _errors$5 = $5830;
        };
        var $5826 = (_types$3 + ("\u{a}" + _errors$5));
        return $5826;
    };
    const Kind$Defs$report = x0 => x1 => Kind$Defs$report$(x0, x1);

    function Kind$checker$io$one$(_name$1) {
        var $5831 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5832 = _m$bind$2;
            return $5832;
        }))(Kind$Synth$one$(_name$1, Map$new))((_new_defs$2 => {
            var self = _new_defs$2;
            switch (self._) {
                case 'Maybe.some':
                    var $5834 = self.value;
                    var $5835 = IO$print$(Kind$Defs$report$($5834, List$cons$(_name$1, List$nil)));
                    var $5833 = $5835;
                    break;
                case 'Maybe.none':
                    var _notfound$3 = ("Term not found: \'" + (_name$1 + "\'."));
                    var _filelist$4 = List$mapped$(Kind$Synth$files_of$(_name$1), (_x$4 => {
                        var $5837 = ("\'" + (_x$4 + "\'"));
                        return $5837;
                    }));
                    var _searched$5 = ("Searched on: " + (String$join$(", ", _filelist$4) + "."));
                    var $5836 = IO$print$((_notfound$3 + ("\u{a}" + _searched$5)));
                    var $5833 = $5836;
                    break;
            };
            return $5833;
        }));
        return $5831;
    };
    const Kind$checker$io$one = x0 => Kind$checker$io$one$(x0);

    function Kind$Synth$many$(_names$1, _defs$2) {
        var self = _names$1;
        switch (self._) {
            case 'List.cons':
                var $5839 = self.head;
                var $5840 = self.tail;
                var $5841 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $5842 = _m$bind$5;
                    return $5842;
                }))(Kind$Synth$one$($5839, _defs$2))((_new_defs$5 => {
                    var self = _new_defs$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $5844 = self.value;
                            var $5845 = Kind$Synth$many$($5840, $5844);
                            var $5843 = $5845;
                            break;
                        case 'Maybe.none':
                            var $5846 = Kind$Synth$many$($5840, _defs$2);
                            var $5843 = $5846;
                            break;
                    };
                    return $5843;
                }));
                var $5838 = $5841;
                break;
            case 'List.nil':
                var $5847 = IO$monad$((_m$bind$3 => _m$pure$4 => {
                    var $5848 = _m$pure$4;
                    return $5848;
                }))(_defs$2);
                var $5838 = $5847;
                break;
        };
        return $5838;
    };
    const Kind$Synth$many = x0 => x1 => Kind$Synth$many$(x0, x1);

    function Kind$Synth$file$(_file$1, _defs$2) {
        var $5849 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $5850 = _m$bind$3;
            return $5850;
        }))(IO$get_file$(_file$1))((_code$3 => {
            var _read$4 = Kind$Defs$read$(_file$1, _code$3, _defs$2);
            var self = _read$4;
            switch (self._) {
                case 'Either.left':
                    var $5852 = self.value;
                    var $5853 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $5854 = _m$pure$7;
                        return $5854;
                    }))(Either$left$($5852));
                    var $5851 = $5853;
                    break;
                case 'Either.right':
                    var $5855 = self.value;
                    var _file_defs$6 = $5855;
                    var _file_keys$7 = Map$keys$(_file_defs$6);
                    var _file_nams$8 = List$mapped$(_file_keys$7, Kind$Name$from_bits);
                    var $5856 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $5857 = _m$bind$9;
                        return $5857;
                    }))(Kind$Synth$many$(_file_nams$8, _file_defs$6))((_defs$9 => {
                        var $5858 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $5859 = _m$pure$11;
                            return $5859;
                        }))(Either$right$(Pair$new$(_file_nams$8, _defs$9)));
                        return $5858;
                    }));
                    var $5851 = $5856;
                    break;
            };
            return $5851;
        }));
        return $5849;
    };
    const Kind$Synth$file = x0 => x1 => Kind$Synth$file$(x0, x1);

    function Kind$checker$io$file$(_file$1) {
        var $5860 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $5861 = _m$bind$2;
            return $5861;
        }))(Kind$Synth$file$(_file$1, Map$new))((_loaded$2 => {
            var self = _loaded$2;
            switch (self._) {
                case 'Either.left':
                    var $5863 = self.value;
                    var $5864 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                        var $5865 = _m$bind$4;
                        return $5865;
                    }))(IO$print$(String$flatten$(List$cons$("On \'", List$cons$(_file$1, List$cons$("\':", List$nil))))))((_$4 => {
                        var $5866 = IO$print$($5863);
                        return $5866;
                    }));
                    var $5862 = $5864;
                    break;
                case 'Either.right':
                    var $5867 = self.value;
                    var self = $5867;
                    switch (self._) {
                        case 'Pair.new':
                            var $5869 = self.fst;
                            var $5870 = self.snd;
                            var _nams$6 = $5869;
                            var _defs$7 = $5870;
                            var self = _nams$6;
                            switch (self._) {
                                case 'List.nil':
                                    var $5872 = IO$print$(("File not found or empty: \'" + (_file$1 + "\'.")));
                                    var $5871 = $5872;
                                    break;
                                case 'List.cons':
                                    var $5873 = IO$print$(Kind$Defs$report$(_defs$7, _nams$6));
                                    var $5871 = $5873;
                                    break;
                            };
                            var $5868 = $5871;
                            break;
                    };
                    var $5862 = $5868;
                    break;
            };
            return $5862;
        }));
        return $5860;
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
                        var $5874 = self.value;
                        var $5875 = $5874;
                        return $5875;
                    case 'IO.ask':
                        var $5876 = self.then;
                        var $5877 = IO$purify$($5876(""));
                        return $5877;
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
                var $5879 = self.value;
                var $5880 = $5879;
                var $5878 = $5880;
                break;
            case 'Either.right':
                var $5881 = self.value;
                var $5882 = IO$purify$((() => {
                    var _defs$3 = $5881;
                    var _nams$4 = List$mapped$(Map$keys$(_defs$3), Kind$Name$from_bits);
                    var $5883 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $5884 = _m$bind$5;
                        return $5884;
                    }))(Kind$Synth$many$(_nams$4, _defs$3))((_defs$5 => {
                        var $5885 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $5886 = _m$pure$7;
                            return $5886;
                        }))(Kind$Defs$report$(_defs$5, _nams$4));
                        return $5885;
                    }));
                    return $5883;
                })());
                var $5878 = $5882;
                break;
        };
        return $5878;
    };
    const Kind$checker$code = x0 => Kind$checker$code$(x0);

    function Kind$Term$read$(_code$1) {
        var self = Kind$Parser$term$(0n, _code$1);
        switch (self._) {
            case 'Parser.Reply.value':
                var $5888 = self.val;
                var $5889 = Maybe$some$($5888);
                var $5887 = $5889;
                break;
            case 'Parser.Reply.error':
                var $5890 = Maybe$none;
                var $5887 = $5890;
                break;
        };
        return $5887;
    };
    const Kind$Term$read = x0 => Kind$Term$read$(x0);
    const Kind = (() => {
        var __$1 = Kind$to_core$io$one;
        var __$2 = Kind$checker$io$one;
        var __$3 = Kind$checker$io$file;
        var __$4 = Kind$checker$code;
        var __$5 = Kind$Term$read;
        var $5891 = IO$monad$((_m$bind$6 => _m$pure$7 => {
            var $5892 = _m$pure$7;
            return $5892;
        }))(Unit$new);
        return $5891;
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