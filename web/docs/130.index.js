(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[130],{

/***/ 130:
/***/ ((module) => {

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
    var bitsmap_new = {
        _: 'BitsMap.new'
    };
    var bitsmap_tie = function(val, lft, rgt) {
        return {
            _: 'BitsMap.tip',
            val,
            lft,
            rgt
        };
    }
    var maybe_none = {
        _: 'Maybe.none'
    };
    var maybe_some = function(value) {
        return {
            _: 'Maybe.some',
            value
        };
    }
    var bitsmap_get = function(bits, map) {
        for (var i = bits.length - 1; i >= 0; --i) {
            if (map._ !== 'BitsMap.new') {
                map = bits[i] === '0' ? map.lft : map.rgt;
            }
        }
        return map._ === 'BitsMap.new' ? maybe_none : map.val;
    }
    var bitsmap_set = function(bits, val, map, mode) {
        var res = {
            value: map
        };
        var key = 'value';
        var obj = res;
        for (var i = bits.length - 1; i >= 0; --i) {
            var map = obj[key];
            if (map._ === 'BitsMap.new') {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: maybe_none,
                    lft: bitsmap_new,
                    rgt: bitsmap_new
                };
            } else {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: map.val,
                    lft: map.lft,
                    rgt: map.rgt
                };
            }
            obj = obj[key];
            key = bits[i] === '0' ? 'lft' : 'rgt';
        }
        var map = obj[key];
        if (map._ === 'BitsMap.new') {
            var x = mode === 'del' ? maybe_none : {
                _: 'Maybe.some',
                value: val
            };
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: bitsmap_new,
                rgt: bitsmap_new
            };
        } else {
            var x = mode === 'set' ? {
                _: 'Maybe.some',
                value: val
            } : mode === 'del' ? maybe_none : map.val;
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: map.lft,
                rgt: map.rgt
            };
        }
        return res.value;
    };
    const inst_unit = x => x(null);
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
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
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
                var $5 = c0;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c1($6);
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
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $18 = u32_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $21 = u64_to_word(self);
                    var $22 = c0($21);
                    return $22;
            };
        })();
        return $23;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
                return $27;
            };
        })();
        return $28;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $32 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $29 = buffer32_to_depth(self);
                    var $30 = buffer32_to_u32array(self);
                    var $31 = c0($29)($30);
                    return $31;
            };
        })();
        return $32;
    });

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $33 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $33;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $34 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $34;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Hello$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $35 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $35;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$Hello$init = App$Store$new$(0n, 0n);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $36 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $36;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $37 = null;
        return $37;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $38 = null;
        return $38;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $39 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $39;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $40 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $40;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $42 = self.pred;
                var $43 = (Word$to_bits$($42) + '0');
                var $41 = $43;
                break;
            case 'Word.i':
                var $44 = self.pred;
                var $45 = (Word$to_bits$($44) + '1');
                var $41 = $45;
                break;
            case 'Word.e':
                var $46 = Bits$e;
                var $41 = $46;
                break;
        };
        return $41;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $47 = 1n + _pred$1;
        return $47;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $49 = Bits$e;
            var $48 = $49;
        } else {
            var $50 = self.charCodeAt(0);
            var $51 = self.slice(1);
            var $52 = (String$to_bits$($51) + (u16_to_bits($50)));
            var $48 = $52;
        };
        return $48;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $54 = self.head;
                var $55 = self.tail;
                var self = $54;
                switch (self._) {
                    case 'Pair.new':
                        var $57 = self.fst;
                        var $58 = self.snd;
                        var $59 = (bitsmap_set(String$to_bits$($57), $58, Map$from_list$($55), 'set'));
                        var $56 = $59;
                        break;
                };
                var $53 = $56;
                break;
            case 'List.nil':
                var $60 = BitsMap$new;
                var $53 = $60;
                break;
        };
        return $53;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $61 = null;
        return $61;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $62 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $62;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $63 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $63;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $64 = (String.fromCharCode(_head$1) + _tail$2);
        return $64;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $66 = self.head;
                var $67 = self.tail;
                var $68 = _cons$5($66)(List$fold$($67, _nil$4, _cons$5));
                var $65 = $68;
                break;
            case 'List.nil':
                var $69 = _nil$4;
                var $65 = $69;
                break;
        };
        return $65;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $70 = null;
        return $70;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $71 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $71;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $72 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $72;
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
                    var $73 = Either$left$(_n$1);
                    return $73;
                } else {
                    var $74 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $76 = Either$right$(Nat$succ$($74));
                        var $75 = $76;
                    } else {
                        var $77 = (self - 1n);
                        var $78 = Nat$sub_rem$($77, $74);
                        var $75 = $78;
                    };
                    return $75;
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
                        var $79 = self.value;
                        var $80 = Nat$div_mod$go$($79, _m$2, Nat$succ$(_d$3));
                        return $80;
                    case 'Either.right':
                        var $81 = Pair$new$(_d$3, _n$1);
                        return $81;
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

    function List$(_A$1) {
        var $82 = null;
        return $82;
    };
    const List = x0 => List$(x0);

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
                        var $83 = self.fst;
                        var $84 = self.snd;
                        var self = $83;
                        if (self === 0n) {
                            var $86 = List$cons$($84, _res$3);
                            var $85 = $86;
                        } else {
                            var $87 = (self - 1n);
                            var $88 = Nat$to_base$go$(_base$1, $83, List$cons$($84, _res$3));
                            var $85 = $88;
                        };
                        return $85;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $89 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $89;
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
                    var $90 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $90;
                } else {
                    var $91 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $93 = _r$3;
                        var $92 = $93;
                    } else {
                        var $94 = (self - 1n);
                        var $95 = Nat$mod$go$($94, $91, Nat$succ$(_r$3));
                        var $92 = $95;
                    };
                    return $92;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$false = false;
    const Bool$and = a0 => a1 => (a0 && a1);
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $96 = null;
        return $96;
    };
    const Maybe = x0 => Maybe$(x0);

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
                        var $97 = self.head;
                        var $98 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $100 = Maybe$some$($97);
                            var $99 = $100;
                        } else {
                            var $101 = (self - 1n);
                            var $102 = List$at$($101, $98);
                            var $99 = $102;
                        };
                        return $99;
                    case 'List.nil':
                        var $103 = Maybe$none;
                        return $103;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $106 = self.value;
                    var $107 = $106;
                    var $105 = $107;
                    break;
                case 'Maybe.none':
                    var $108 = 35;
                    var $105 = $108;
                    break;
            };
            var $104 = $105;
        } else {
            var $109 = 35;
            var $104 = $109;
        };
        return $104;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $110 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $111 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $111;
        }));
        return $110;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $112 = Nat$to_string_base$(10n, _n$1);
        return $112;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function App$Hello$draw$(_state$1) {
        var $113 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("border", "1px solid black"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$nil)), List$cons$(DOM$text$("Hello, world!"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(("Clicks: " + Nat$show$((() => {
            var self = _state$1;
            switch (self._) {
                case 'App.Store.new':
                    var $114 = self.local;
                    var $115 = $114;
                    return $115;
            };
        })()))), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(("Visits: " + Nat$show$((() => {
            var self = _state$1;
            switch (self._) {
                case 'App.Store.new':
                    var $116 = self.global;
                    var $117 = $116;
                    return $117;
            };
        })()))), List$nil)), List$nil))));
        return $113;
    };
    const App$Hello$draw = x0 => App$Hello$draw$(x0);

    function IO$(_A$1) {
        var $118 = null;
        return $118;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $120 = self.fst;
                var $121 = $120;
                var $119 = $121;
                break;
        };
        return $119;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $122 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $122;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $124 = self.value;
                var $125 = _f$4($124);
                var $123 = $125;
                break;
            case 'IO.ask':
                var $126 = self.query;
                var $127 = self.param;
                var $128 = self.then;
                var $129 = IO$ask$($126, $127, (_x$8 => {
                    var $130 = IO$bind$($128(_x$8), _f$4);
                    return $130;
                }));
                var $123 = $129;
                break;
        };
        return $123;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $131 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $131;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $132 = _new$2(IO$bind)(IO$end);
        return $132;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const Unit$new = null;

    function IO$do$(_call$1, _param$2) {
        var $133 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $134 = IO$end$(Unit$new);
            return $134;
        }));
        return $133;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $135 = _m$pure$3;
        return $135;
    }))(Maybe$none);

    function App$do$(_call$2, _param$3) {
        var $136 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $137 = _m$bind$4;
            return $137;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $138 = App$pass;
            return $138;
        }));
        return $136;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $139 = App$do$("watch", _room$2);
        return $139;
    };
    const App$watch = x0 => App$watch$(x0);
    const App$room_zero = "0x00000000000000";

    function App$new_post$(_room$2, _data$3) {
        var $140 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $141 = _m$bind$4;
            return $141;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $142 = App$pass;
            return $142;
        }));
        return $140;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);
    const App$empty_post = "0x0000000000000000000000000000000000000000000000000000000000000000";

    function App$set_local$(_value$2) {
        var $143 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $144 = _m$pure$4;
            return $144;
        }))(Maybe$some$(_value$2));
        return $143;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);

    function App$Hello$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $146 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $147 = _m$bind$6;
                    return $147;
                }))(App$watch$(App$room_zero))((_$6 => {
                    var $148 = App$new_post$(App$room_zero, App$empty_post);
                    return $148;
                }));
                var $145 = $146;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $149 = App$pass;
                var $145 = $149;
                break;
            case 'App.Event.mouse_down':
                var $150 = App$set_local$(((() => {
                    var self = _state$2;
                    switch (self._) {
                        case 'App.Store.new':
                            var $151 = self.local;
                            var $152 = $151;
                            return $152;
                    };
                })() + 1n));
                var $145 = $150;
                break;
        };
        return $145;
    };
    const App$Hello$when = x0 => x1 => App$Hello$when$(x0, x1);

    function App$no_tick$(_tick$2, _glob$3) {
        var $153 = _glob$3;
        return $153;
    };
    const App$no_tick = x0 => x1 => App$no_tick$(x0, x1);
    const App$Hello$tick = App$no_tick;

    function App$Hello$post$(_time$1, _room$2, _addr$3, _data$4, _global_state$5) {
        var $154 = (_global_state$5 + 1n);
        return $154;
    };
    const App$Hello$post = x0 => x1 => x2 => x3 => x4 => App$Hello$post$(x0, x1, x2, x3, x4);
    const App$Hello = App$new$(App$Hello$init, App$Hello$draw, App$Hello$when, App$Hello$tick, App$Hello$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Hello.State': App$Hello$State,
        'App.Store.new': App$Store$new,
        'App.Hello.init': App$Hello$init,
        'DOM.node': DOM$node,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'Nat.to_base.go': Nat$to_base$go,
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
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'App.Hello.draw': App$Hello$draw,
        'IO': IO,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Unit.new': Unit$new,
        'IO.do': IO$do,
        'App.pass': App$pass,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.room_zero': App$room_zero,
        'App.new_post': App$new_post,
        'App.empty_post': App$empty_post,
        'App.set_local': App$set_local,
        'Nat.add': Nat$add,
        'App.Hello.when': App$Hello$when,
        'App.no_tick': App$no_tick,
        'App.Hello.tick': App$Hello$tick,
        'App.Hello.post': App$Hello$post,
        'App.Hello': App$Hello,
    };
})();

/***/ })

}]);
//# sourceMappingURL=130.index.js.map