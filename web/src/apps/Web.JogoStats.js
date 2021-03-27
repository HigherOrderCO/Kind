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

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $2 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $0 = c2;
                return $0;
            } else {
                var $1 = c2;
                return $1;
            };
        })();
        return $2;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $6 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $3 = c2;
                return $3;
            } else {
                var $4 = (self - 1n);
                var $5 = c2($4);
                return $5;
            };
        })();
        return $6;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $9 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $7 = u16_to_word(self);
                    var $8 = c0($7);
                    return $8;
            };
        })();
        return $9;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $10 = u32_to_word(self);
                    var $11 = c0($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $15 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $13 = u64_to_word(self);
                    var $14 = c0($13);
                    return $14;
            };
        })();
        return $15;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $20 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $16 = c2;
                return $16;
            } else {
                var $17 = self.charCodeAt(0);
                var $18 = self.slice(1);
                var $19 = c2($17)($18);
                return $19;
            };
        })();
        return $20;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $21 = buffer32_to_depth(self);
                    var $22 = buffer32_to_u32array(self);
                    var $23 = c0($21)($22);
                    return $23;
            };
        })();
        return $24;
    });

    function App$Render$txt$(_text$1) {
        var $25 = ({
            _: 'App.Render.txt',
            'text': _text$1
        });
        return $25;
    };
    const App$Render$txt = x0 => App$Render$txt$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $26 = (String.fromCharCode(_head$1) + _tail$2);
        return $26;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $28 = self.head;
                var $29 = self.tail;
                var $30 = _cons$5($28)(List$fold$($29, _nil$4, _cons$5));
                var $27 = $30;
                break;
            case 'List.nil':
                var $31 = _nil$4;
                var $27 = $31;
                break;
        };
        return $27;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $32 = null;
        return $32;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $33 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $33;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $34 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $34;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$succ$(_pred$1) {
        var $35 = 1n + _pred$1;
        return $35;
    };
    const Nat$succ = x0 => Nat$succ$(x0);

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
                    var $36 = Either$left$(_n$1);
                    return $36;
                } else {
                    var $37 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $39 = Either$right$(Nat$succ$($37));
                        var $38 = $39;
                    } else {
                        var $40 = (self - 1n);
                        var $41 = Nat$sub_rem$($40, $37);
                        var $38 = $41;
                    };
                    return $38;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $42 = null;
        return $42;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $43 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $43;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

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
                        var $44 = self.value;
                        var $45 = Nat$div_mod$go$($44, _m$2, Nat$succ$(_d$3));
                        return $45;
                    case 'Either.right':
                        var $46 = Pair$new$(_d$3, _n$1);
                        return $46;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$zero = 0n;
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function List$(_A$1) {
        var $47 = null;
        return $47;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $48 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $48;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

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
                        var $49 = self.fst;
                        var $50 = self.snd;
                        var self = $49;
                        if (self === 0n) {
                            var $52 = List$cons$($50, _res$3);
                            var $51 = $52;
                        } else {
                            var $53 = (self - 1n);
                            var $54 = Nat$to_base$go$(_base$1, $49, List$cons$($50, _res$3));
                            var $51 = $54;
                        };
                        return $51;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
    const List$nil = ({
        _: 'List.nil'
    });

    function Nat$to_base$(_base$1, _nat$2) {
        var $55 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $55;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

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
                    var $56 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $56;
                } else {
                    var $57 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $59 = _r$3;
                        var $58 = $59;
                    } else {
                        var $60 = (self - 1n);
                        var $61 = Nat$mod$go$($60, $57, Nat$succ$(_r$3));
                        var $58 = $61;
                    };
                    return $58;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $62 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $62;
    };
    const Nat$mod = x0 => x1 => Nat$mod$(x0, x1);
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $63 = null;
        return $63;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$some$(_value$2) {
        var $64 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $64;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

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
                        var $65 = self.head;
                        var $66 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $68 = Maybe$some$($65);
                            var $67 = $68;
                        } else {
                            var $69 = (self - 1n);
                            var $70 = List$at$($69, $66);
                            var $67 = $70;
                        };
                        return $67;
                    case 'List.nil':
                        var $71 = Maybe$none;
                        return $71;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = Nat$mod$(_n$2, _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $74 = self.value;
                    var $75 = $74;
                    var $73 = $75;
                    break;
                case 'Maybe.none':
                    var $76 = 35;
                    var $73 = $76;
                    break;
            };
            var $72 = $73;
        } else {
            var $77 = 35;
            var $72 = $77;
        };
        return $72;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $78 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $79 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $79;
        }));
        return $78;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $80 = Nat$to_string_base$(10n, _n$1);
        return $80;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function App$Action$(_S$1) {
        var $81 = null;
        return $81;
    };
    const App$Action = x0 => App$Action$(x0);

    function App$Action$watch$(_room$2) {
        var $82 = ({
            _: 'App.Action.watch',
            'room': _room$2
        });
        return $82;
    };
    const App$Action$watch = x0 => App$Action$watch$(x0);
    const Web$Jogo$room = "0x196581625482";

    function App$Action$state$(_value$2) {
        var $83 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $83;
    };
    const App$Action$state = x0 => App$Action$state$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $84 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $84;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$JogoStats = App$new$(0n, (_state$1 => {
        var $85 = App$Render$txt$(("foram feitos " + (Nat$show$(_state$1) + " posts no jogo")));
        return $85;
    }), (_event$1 => _state$2 => {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $87 = List$cons$(App$Action$watch$(Web$Jogo$room), List$nil);
                var $86 = $87;
                break;
            case 'App.Event.tick':
            case 'App.Event.xkey':
                var $88 = List$nil;
                var $86 = $88;
                break;
            case 'App.Event.post':
                var $89 = List$cons$(App$Action$state$((_state$2 + 1n)), List$nil);
                var $86 = $89;
                break;
        };
        return $86;
    }));
    return {
        'App.Render.txt': App$Render$txt,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.succ': Nat$succ,
        'Nat.sub_rem': Nat$sub_rem,
        'Pair': Pair,
        'Pair.new': Pair$new,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.zero': Nat$zero,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'List.nil': List$nil,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.false': Bool$false,
        'Bool.and': Bool$and,
        'Bool.true': Bool$true,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'App.Action': App$Action,
        'App.Action.watch': App$Action$watch,
        'Web.Jogo.room': Web$Jogo$room,
        'App.Action.state': App$Action$state,
        'Nat.add': Nat$add,
        'App.new': App$new,
        'Web.JogoStats': Web$JogoStats,
    };
})();