(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[661],{

/***/ 661:
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
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
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

    function BitsMap$(_A$1) {
        var $35 = null;
        return $35;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $36 = null;
        return $36;
    };
    const Map = x0 => Map$(x0);
    const App$MiniMMO$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $37 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $37;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const Unit$new = null;
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $38 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $38;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $39 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $39;
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
                var $41 = self.pred;
                var $42 = (Word$to_bits$($41) + '0');
                var $40 = $42;
                break;
            case 'Word.i':
                var $43 = self.pred;
                var $44 = (Word$to_bits$($43) + '1');
                var $40 = $44;
                break;
            case 'Word.e':
                var $45 = Bits$e;
                var $40 = $45;
                break;
        };
        return $40;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $46 = 1n + _pred$1;
        return $46;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $48 = Bits$e;
            var $47 = $48;
        } else {
            var $49 = self.charCodeAt(0);
            var $50 = self.slice(1);
            var $51 = (String$to_bits$($50) + (u16_to_bits($49)));
            var $47 = $51;
        };
        return $47;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $53 = self.head;
                var $54 = self.tail;
                var self = $53;
                switch (self._) {
                    case 'Pair.new':
                        var $56 = self.fst;
                        var $57 = self.snd;
                        var $58 = (bitsmap_set(String$to_bits$($56), $57, Map$from_list$($54), 'set'));
                        var $55 = $58;
                        break;
                };
                var $52 = $55;
                break;
            case 'List.nil':
                var $59 = BitsMap$new;
                var $52 = $59;
                break;
        };
        return $52;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $60 = null;
        return $60;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const App$MiniMMO$init = App$Store$new$(Unit$new, Map$from_list$(List$nil));

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $62 = self.snd;
                var $63 = $62;
                var $61 = $63;
                break;
        };
        return $61;
    };
    const Pair$snd = x0 => Pair$snd$(x0);
    const App$State$global = Pair$snd;
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $64 = null;
        return $64;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $65 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $65;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $67 = self.val;
                var $68 = self.lft;
                var $69 = self.rgt;
                var self = $67;
                switch (self._) {
                    case 'Maybe.some':
                        var $71 = self.value;
                        var $72 = List$cons$($71, _list$3);
                        var _list0$7 = $72;
                        break;
                    case 'Maybe.none':
                        var $73 = _list$3;
                        var _list0$7 = $73;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($68, _list0$7);
                var _list2$9 = BitsMap$values$go$($69, _list1$8);
                var $70 = _list2$9;
                var $66 = $70;
                break;
            case 'BitsMap.new':
                var $74 = _list$3;
                var $66 = $74;
                break;
        };
        return $66;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $75 = BitsMap$values$go$(_xs$2, List$nil);
        return $75;
    };
    const Map$values = x0 => Map$values$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $76 = (String.fromCharCode(_head$1) + _tail$2);
        return $76;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $78 = self.head;
                var $79 = self.tail;
                var $80 = _cons$5($78)(List$fold$($79, _nil$4, _cons$5));
                var $77 = $80;
                break;
            case 'List.nil':
                var $81 = _nil$4;
                var $77 = $81;
                break;
        };
        return $77;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $82 = null;
        return $82;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $83 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $83;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $84 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $84;
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
                    var $85 = Either$left$(_n$1);
                    return $85;
                } else {
                    var $86 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $88 = Either$right$(Nat$succ$($86));
                        var $87 = $88;
                    } else {
                        var $89 = (self - 1n);
                        var $90 = Nat$sub_rem$($89, $86);
                        var $87 = $90;
                    };
                    return $87;
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
                        var $91 = self.value;
                        var $92 = Nat$div_mod$go$($91, _m$2, Nat$succ$(_d$3));
                        return $92;
                    case 'Either.right':
                        var $93 = Pair$new$(_d$3, _n$1);
                        return $93;
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
                        var $94 = self.fst;
                        var $95 = self.snd;
                        var self = $94;
                        if (self === 0n) {
                            var $97 = List$cons$($95, _res$3);
                            var $96 = $97;
                        } else {
                            var $98 = (self - 1n);
                            var $99 = Nat$to_base$go$(_base$1, $94, List$cons$($95, _res$3));
                            var $96 = $99;
                        };
                        return $96;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $100 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $100;
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
                    var $101 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $101;
                } else {
                    var $102 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $104 = _r$3;
                        var $103 = $104;
                    } else {
                        var $105 = (self - 1n);
                        var $106 = Nat$mod$go$($105, $102, Nat$succ$(_r$3));
                        var $103 = $106;
                    };
                    return $103;
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
        var $107 = null;
        return $107;
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
                        var $108 = self.head;
                        var $109 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $111 = Maybe$some$($108);
                            var $110 = $111;
                        } else {
                            var $112 = (self - 1n);
                            var $113 = List$at$($112, $109);
                            var $110 = $113;
                        };
                        return $110;
                    case 'List.nil':
                        var $114 = Maybe$none;
                        return $114;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $117 = self.value;
                    var $118 = $117;
                    var $116 = $118;
                    break;
                case 'Maybe.none':
                    var $119 = 35;
                    var $116 = $119;
                    break;
            };
            var $115 = $116;
        } else {
            var $120 = 35;
            var $115 = $120;
        };
        return $115;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $121 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $122 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $122;
        }));
        return $121;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $123 = Nat$to_string_base$(10n, _n$1);
        return $123;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $125 = self.pred;
                var $126 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $125));
                var $124 = $126;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $127));
                var $124 = $128;
                break;
            case 'Word.e':
                var $129 = _nil$3;
                var $124 = $129;
                break;
        };
        return $124;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $130 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $131 = Nat$succ$((2n * _x$4));
            return $131;
        }), _word$2);
        return $130;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $132 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $132;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $133 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $133;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function App$MiniMMO$draw$(_state$1) {
        var _avatars$2 = List$nil;
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $135 = self.global;
                var $136 = $135;
                var _map$3 = $136;
                break;
        };
        var _avatars$4 = (() => {
            var $138 = _avatars$2;
            var $139 = Map$values$(_map$3);
            let _avatars$5 = $138;
            let _player$4;
            while ($139._ === 'List.cons') {
                _player$4 = $139.head;
                var _style$6 = Map$from_list$(List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("left", (Nat$show$((BigInt((() => {
                    var self = _player$4;
                    switch (self._) {
                        case 'App.MiniMMO.Player.new':
                            var $140 = self.x;
                            var $141 = $140;
                            return $141;
                    };
                })()))) + "px")), List$cons$(Pair$new$("top", (Nat$show$((BigInt((() => {
                    var self = _player$4;
                    switch (self._) {
                        case 'App.MiniMMO.Player.new':
                            var $142 = self.y;
                            var $143 = $142;
                            return $143;
                    };
                })()))) + "px")), List$nil))));
                var $138 = List$cons$(DOM$node$("div", Map$from_list$(List$nil), _style$6, List$cons$(DOM$text$("X"), List$nil)), _avatars$5);
                _avatars$5 = $138;
                $139 = $139.tail;
            }
            return _avatars$5;
        })();
        var $134 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), _avatars$4);
        return $134;
    };
    const App$MiniMMO$draw = x0 => App$MiniMMO$draw$(x0);

    function IO$(_A$1) {
        var $144 = null;
        return $144;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $146 = self.fst;
                var $147 = $146;
                var $145 = $147;
                break;
        };
        return $145;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $148 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $148;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $150 = self.value;
                var $151 = _f$4($150);
                var $149 = $151;
                break;
            case 'IO.ask':
                var $152 = self.query;
                var $153 = self.param;
                var $154 = self.then;
                var $155 = IO$ask$($152, $153, (_x$8 => {
                    var $156 = IO$bind$($154(_x$8), _f$4);
                    return $156;
                }));
                var $149 = $155;
                break;
        };
        return $149;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $157 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $157;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $158 = _new$2(IO$bind)(IO$end);
        return $158;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $159 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $160 = IO$end$(Unit$new);
            return $160;
        }));
        return $159;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $161 = _m$pure$3;
        return $161;
    }))(Maybe$none);

    function App$do$(_call$2, _param$3) {
        var $162 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $163 = _m$bind$4;
            return $163;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $164 = App$pass;
            return $164;
        }));
        return $162;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $165 = App$do$("watch", _room$2);
        return $165;
    };
    const App$watch = x0 => App$watch$(x0);
    const App$MiniMMO$room = "0xc910a02b7c8a12";

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $167 = Bool$false;
                var $166 = $167;
                break;
            case 'Cmp.eql':
                var $168 = Bool$true;
                var $166 = $168;
                break;
        };
        return $166;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
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
                var $170 = self.pred;
                var $171 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $173 = self.pred;
                            var $174 = (_a$pred$10 => {
                                var $175 = Word$cmp$go$(_a$pred$10, $173, _c$4);
                                return $175;
                            });
                            var $172 = $174;
                            break;
                        case 'Word.i':
                            var $176 = self.pred;
                            var $177 = (_a$pred$10 => {
                                var $178 = Word$cmp$go$(_a$pred$10, $176, Cmp$ltn);
                                return $178;
                            });
                            var $172 = $177;
                            break;
                        case 'Word.e':
                            var $179 = (_a$pred$8 => {
                                var $180 = _c$4;
                                return $180;
                            });
                            var $172 = $179;
                            break;
                    };
                    var $172 = $172($170);
                    return $172;
                });
                var $169 = $171;
                break;
            case 'Word.i':
                var $181 = self.pred;
                var $182 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $184 = self.pred;
                            var $185 = (_a$pred$10 => {
                                var $186 = Word$cmp$go$(_a$pred$10, $184, Cmp$gtn);
                                return $186;
                            });
                            var $183 = $185;
                            break;
                        case 'Word.i':
                            var $187 = self.pred;
                            var $188 = (_a$pred$10 => {
                                var $189 = Word$cmp$go$(_a$pred$10, $187, _c$4);
                                return $189;
                            });
                            var $183 = $188;
                            break;
                        case 'Word.e':
                            var $190 = (_a$pred$8 => {
                                var $191 = _c$4;
                                return $191;
                            });
                            var $183 = $190;
                            break;
                    };
                    var $183 = $183($181);
                    return $183;
                });
                var $169 = $182;
                break;
            case 'Word.e':
                var $192 = (_b$5 => {
                    var $193 = _c$4;
                    return $193;
                });
                var $169 = $192;
                break;
        };
        var $169 = $169(_b$3);
        return $169;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $194 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $194;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $195 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $195;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$new_post$(_room$2, _data$3) {
        var $196 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $197 = _m$bind$4;
            return $197;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $198 = App$pass;
            return $198;
        }));
        return $196;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);
    const App$MiniMMO$command$a_down = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const App$MiniMMO$command$d_down = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const App$MiniMMO$command$w_down = "0x0000000000000000000000000000000000000000000000000000000000000007";
    const App$MiniMMO$command$s_down = "0x0000000000000000000000000000000000000000000000000000000000000005";
    const App$MiniMMO$command$a_up = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const App$MiniMMO$command$d_up = "0x0000000000000000000000000000000000000000000000000000000000000002";
    const App$MiniMMO$command$w_up = "0x0000000000000000000000000000000000000000000000000000000000000006";
    const App$MiniMMO$command$s_up = "0x0000000000000000000000000000000000000000000000000000000000000004";

    function App$MiniMMO$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.key_down':
                var $200 = self.code;
                var self = ($200 === 65);
                if (self) {
                    var $202 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$a_down);
                    var $201 = $202;
                } else {
                    var self = ($200 === 68);
                    if (self) {
                        var $204 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$d_down);
                        var $203 = $204;
                    } else {
                        var self = ($200 === 87);
                        if (self) {
                            var $206 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$w_down);
                            var $205 = $206;
                        } else {
                            var self = ($200 === 83);
                            if (self) {
                                var $208 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$s_down);
                                var $207 = $208;
                            } else {
                                var $209 = App$pass;
                                var $207 = $209;
                            };
                            var $205 = $207;
                        };
                        var $203 = $205;
                    };
                    var $201 = $203;
                };
                var $199 = $201;
                break;
            case 'App.Event.key_up':
                var $210 = self.code;
                var self = ($210 === 65);
                if (self) {
                    var $212 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$a_up);
                    var $211 = $212;
                } else {
                    var self = ($210 === 68);
                    if (self) {
                        var $214 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$d_up);
                        var $213 = $214;
                    } else {
                        var self = ($210 === 87);
                        if (self) {
                            var $216 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$w_up);
                            var $215 = $216;
                        } else {
                            var self = ($210 === 83);
                            if (self) {
                                var $218 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$s_up);
                                var $217 = $218;
                            } else {
                                var $219 = App$pass;
                                var $217 = $219;
                            };
                            var $215 = $217;
                        };
                        var $213 = $215;
                    };
                    var $211 = $213;
                };
                var $199 = $211;
                break;
            case 'App.Event.init':
                var $220 = App$watch$(App$MiniMMO$room);
                var $199 = $220;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $221 = App$pass;
                var $199 = $221;
                break;
        };
        return $199;
    };
    const App$MiniMMO$when = x0 => x1 => App$MiniMMO$when$(x0, x1);

    function BitsMap$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'BitsMap.tie':
                var $223 = self.val;
                var $224 = self.lft;
                var $225 = self.rgt;
                var self = $223;
                switch (self._) {
                    case 'Maybe.some':
                        var $227 = self.value;
                        var $228 = Maybe$some$(_fn$3($227));
                        var _val$8 = $228;
                        break;
                    case 'Maybe.none':
                        var $229 = Maybe$none;
                        var _val$8 = $229;
                        break;
                };
                var _lft$9 = BitsMap$map$(_fn$3, $224);
                var _rgt$10 = BitsMap$map$(_fn$3, $225);
                var $226 = BitsMap$tie$(_val$8, _lft$9, _rgt$10);
                var $222 = $226;
                break;
            case 'BitsMap.new':
                var $230 = BitsMap$new;
                var $222 = $230;
                break;
        };
        return $222;
    };
    const BitsMap$map = x0 => x1 => BitsMap$map$(x0, x1);

    function Map$map$(_fn$3, _map$4) {
        var $231 = BitsMap$map$(_fn$3, _map$4);
        return $231;
    };
    const Map$map = x0 => x1 => Map$map$(x0, x1);

    function U32$new$(_value$1) {
        var $232 = word_to_u32(_value$1);
        return $232;
    };
    const U32$new = x0 => U32$new$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$(_size$1) {
        var $233 = null;
        return $233;
    };
    const Word = x0 => Word$(x0);

    function Word$i$(_pred$2) {
        var $234 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $234;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $235 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $235;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $237 = self.pred;
                var $238 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $240 = self.pred;
                            var $241 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $243 = Word$i$(Word$subber$(_a$pred$10, $240, Bool$true));
                                    var $242 = $243;
                                } else {
                                    var $244 = Word$o$(Word$subber$(_a$pred$10, $240, Bool$false));
                                    var $242 = $244;
                                };
                                return $242;
                            });
                            var $239 = $241;
                            break;
                        case 'Word.i':
                            var $245 = self.pred;
                            var $246 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $248 = Word$o$(Word$subber$(_a$pred$10, $245, Bool$true));
                                    var $247 = $248;
                                } else {
                                    var $249 = Word$i$(Word$subber$(_a$pred$10, $245, Bool$true));
                                    var $247 = $249;
                                };
                                return $247;
                            });
                            var $239 = $246;
                            break;
                        case 'Word.e':
                            var $250 = (_a$pred$8 => {
                                var $251 = Word$e;
                                return $251;
                            });
                            var $239 = $250;
                            break;
                    };
                    var $239 = $239($237);
                    return $239;
                });
                var $236 = $238;
                break;
            case 'Word.i':
                var $252 = self.pred;
                var $253 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $255 = self.pred;
                            var $256 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $258 = Word$o$(Word$subber$(_a$pred$10, $255, Bool$false));
                                    var $257 = $258;
                                } else {
                                    var $259 = Word$i$(Word$subber$(_a$pred$10, $255, Bool$false));
                                    var $257 = $259;
                                };
                                return $257;
                            });
                            var $254 = $256;
                            break;
                        case 'Word.i':
                            var $260 = self.pred;
                            var $261 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $263 = Word$i$(Word$subber$(_a$pred$10, $260, Bool$true));
                                    var $262 = $263;
                                } else {
                                    var $264 = Word$o$(Word$subber$(_a$pred$10, $260, Bool$false));
                                    var $262 = $264;
                                };
                                return $262;
                            });
                            var $254 = $261;
                            break;
                        case 'Word.e':
                            var $265 = (_a$pred$8 => {
                                var $266 = Word$e;
                                return $266;
                            });
                            var $254 = $265;
                            break;
                    };
                    var $254 = $254($252);
                    return $254;
                });
                var $236 = $253;
                break;
            case 'Word.e':
                var $267 = (_b$5 => {
                    var $268 = Word$e;
                    return $268;
                });
                var $236 = $267;
                break;
        };
        var $236 = $236(_b$3);
        return $236;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $269 = Word$subber$(_a$2, _b$3, Bool$false);
        return $269;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

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
                    var $270 = _x$4;
                    return $270;
                } else {
                    var $271 = (self - 1n);
                    var $272 = Nat$apply$($271, _f$3, _f$3(_x$4));
                    return $272;
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
                var $274 = self.pred;
                var $275 = Word$i$($274);
                var $273 = $275;
                break;
            case 'Word.i':
                var $276 = self.pred;
                var $277 = Word$o$(Word$inc$($276));
                var $273 = $277;
                break;
            case 'Word.e':
                var $278 = Word$e;
                var $273 = $278;
                break;
        };
        return $273;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $280 = Word$e;
            var $279 = $280;
        } else {
            var $281 = (self - 1n);
            var $282 = Word$o$(Word$zero$($281));
            var $279 = $282;
        };
        return $279;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $283 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $283;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $285 = self.pred;
                var $286 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $288 = self.pred;
                            var $289 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $291 = Word$i$(Word$adder$(_a$pred$10, $288, Bool$false));
                                    var $290 = $291;
                                } else {
                                    var $292 = Word$o$(Word$adder$(_a$pred$10, $288, Bool$false));
                                    var $290 = $292;
                                };
                                return $290;
                            });
                            var $287 = $289;
                            break;
                        case 'Word.i':
                            var $293 = self.pred;
                            var $294 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $296 = Word$o$(Word$adder$(_a$pred$10, $293, Bool$true));
                                    var $295 = $296;
                                } else {
                                    var $297 = Word$i$(Word$adder$(_a$pred$10, $293, Bool$false));
                                    var $295 = $297;
                                };
                                return $295;
                            });
                            var $287 = $294;
                            break;
                        case 'Word.e':
                            var $298 = (_a$pred$8 => {
                                var $299 = Word$e;
                                return $299;
                            });
                            var $287 = $298;
                            break;
                    };
                    var $287 = $287($285);
                    return $287;
                });
                var $284 = $286;
                break;
            case 'Word.i':
                var $300 = self.pred;
                var $301 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $303 = self.pred;
                            var $304 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $306 = Word$o$(Word$adder$(_a$pred$10, $303, Bool$true));
                                    var $305 = $306;
                                } else {
                                    var $307 = Word$i$(Word$adder$(_a$pred$10, $303, Bool$false));
                                    var $305 = $307;
                                };
                                return $305;
                            });
                            var $302 = $304;
                            break;
                        case 'Word.i':
                            var $308 = self.pred;
                            var $309 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $311 = Word$i$(Word$adder$(_a$pred$10, $308, Bool$true));
                                    var $310 = $311;
                                } else {
                                    var $312 = Word$o$(Word$adder$(_a$pred$10, $308, Bool$true));
                                    var $310 = $312;
                                };
                                return $310;
                            });
                            var $302 = $309;
                            break;
                        case 'Word.e':
                            var $313 = (_a$pred$8 => {
                                var $314 = Word$e;
                                return $314;
                            });
                            var $302 = $313;
                            break;
                    };
                    var $302 = $302($300);
                    return $302;
                });
                var $284 = $301;
                break;
            case 'Word.e':
                var $315 = (_b$5 => {
                    var $316 = Word$e;
                    return $316;
                });
                var $284 = $315;
                break;
        };
        var $284 = $284(_b$3);
        return $284;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $317 = Word$adder$(_a$2, _b$3, Bool$false);
        return $317;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function App$MiniMMO$Player$new$(_w$1, _a$2, _s$3, _d$4, _x$5, _y$6) {
        var $318 = ({
            _: 'App.MiniMMO.Player.new',
            'w': _w$1,
            'a': _a$2,
            's': _s$3,
            'd': _d$4,
            'x': _x$5,
            'y': _y$6
        });
        return $318;
    };
    const App$MiniMMO$Player$new = x0 => x1 => x2 => x3 => x4 => x5 => App$MiniMMO$Player$new$(x0, x1, x2, x3, x4, x5);

    function App$MiniMMO$tick$(_tick$1, _map$2) {
        var _map$3 = Map$map$((_player$3 => {
            var self = _player$3;
            switch (self._) {
                case 'App.MiniMMO.Player.new':
                    var $321 = self.w;
                    var $322 = self.a;
                    var $323 = self.s;
                    var $324 = self.d;
                    var $325 = self.x;
                    var $326 = self.y;
                    var _w$10 = $321;
                    var _a$11 = $322;
                    var _s$12 = $323;
                    var _d$13 = $324;
                    var _x$14 = $325;
                    var _y$15 = $326;
                    var self = $322;
                    if (self) {
                        var $328 = ((_x$14 - 4) >>> 0);
                        var _x$16 = $328;
                    } else {
                        var $329 = _x$14;
                        var _x$16 = $329;
                    };
                    var self = $324;
                    if (self) {
                        var $330 = ((_x$16 + 4) >>> 0);
                        var _x$17 = $330;
                    } else {
                        var $331 = _x$16;
                        var _x$17 = $331;
                    };
                    var self = $321;
                    if (self) {
                        var $332 = ((_y$15 - 4) >>> 0);
                        var _y$18 = $332;
                    } else {
                        var $333 = _y$15;
                        var _y$18 = $333;
                    };
                    var self = $323;
                    if (self) {
                        var $334 = ((_y$18 + 4) >>> 0);
                        var _y$19 = $334;
                    } else {
                        var $335 = _y$18;
                        var _y$19 = $335;
                    };
                    var $327 = App$MiniMMO$Player$new$(_w$10, _a$11, _s$12, _d$13, _x$17, _y$19);
                    var $320 = $327;
                    break;
            };
            return $320;
        }), _map$2);
        var $319 = _map$3;
        return $319;
    };
    const App$MiniMMO$tick = x0 => x1 => App$MiniMMO$tick$(x0, x1);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Map$get$(_key$2, _map$3) {
        var $336 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $336;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $337 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $337;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function App$MiniMMO$post$(_time$1, _room$2, _addr$3, _data$4, _map$5) {
        var self = Map$get$(_addr$3, _map$5);
        switch (self._) {
            case 'Maybe.some':
                var $339 = self.value;
                var _player$7 = $339;
                var self = (_data$4 === App$MiniMMO$command$a_down);
                if (self) {
                    var self = _player$7;
                    switch (self._) {
                        case 'App.MiniMMO.Player.new':
                            var $342 = self.w;
                            var $343 = self.s;
                            var $344 = self.d;
                            var $345 = self.x;
                            var $346 = self.y;
                            var $347 = App$MiniMMO$Player$new$($342, Bool$true, $343, $344, $345, $346);
                            var $341 = $347;
                            break;
                    };
                    var _player$8 = $341;
                } else {
                    var self = (_data$4 === App$MiniMMO$command$s_down);
                    if (self) {
                        var self = _player$7;
                        switch (self._) {
                            case 'App.MiniMMO.Player.new':
                                var $350 = self.w;
                                var $351 = self.a;
                                var $352 = self.d;
                                var $353 = self.x;
                                var $354 = self.y;
                                var $355 = App$MiniMMO$Player$new$($350, $351, Bool$true, $352, $353, $354);
                                var $349 = $355;
                                break;
                        };
                        var $348 = $349;
                    } else {
                        var self = (_data$4 === App$MiniMMO$command$d_down);
                        if (self) {
                            var self = _player$7;
                            switch (self._) {
                                case 'App.MiniMMO.Player.new':
                                    var $358 = self.w;
                                    var $359 = self.a;
                                    var $360 = self.s;
                                    var $361 = self.x;
                                    var $362 = self.y;
                                    var $363 = App$MiniMMO$Player$new$($358, $359, $360, Bool$true, $361, $362);
                                    var $357 = $363;
                                    break;
                            };
                            var $356 = $357;
                        } else {
                            var self = (_data$4 === App$MiniMMO$command$w_down);
                            if (self) {
                                var self = _player$7;
                                switch (self._) {
                                    case 'App.MiniMMO.Player.new':
                                        var $366 = self.a;
                                        var $367 = self.s;
                                        var $368 = self.d;
                                        var $369 = self.x;
                                        var $370 = self.y;
                                        var $371 = App$MiniMMO$Player$new$(Bool$true, $366, $367, $368, $369, $370);
                                        var $365 = $371;
                                        break;
                                };
                                var $364 = $365;
                            } else {
                                var self = (_data$4 === App$MiniMMO$command$a_up);
                                if (self) {
                                    var self = _player$7;
                                    switch (self._) {
                                        case 'App.MiniMMO.Player.new':
                                            var $374 = self.w;
                                            var $375 = self.s;
                                            var $376 = self.d;
                                            var $377 = self.x;
                                            var $378 = self.y;
                                            var $379 = App$MiniMMO$Player$new$($374, Bool$false, $375, $376, $377, $378);
                                            var $373 = $379;
                                            break;
                                    };
                                    var $372 = $373;
                                } else {
                                    var self = (_data$4 === App$MiniMMO$command$s_up);
                                    if (self) {
                                        var self = _player$7;
                                        switch (self._) {
                                            case 'App.MiniMMO.Player.new':
                                                var $382 = self.w;
                                                var $383 = self.a;
                                                var $384 = self.d;
                                                var $385 = self.x;
                                                var $386 = self.y;
                                                var $387 = App$MiniMMO$Player$new$($382, $383, Bool$false, $384, $385, $386);
                                                var $381 = $387;
                                                break;
                                        };
                                        var $380 = $381;
                                    } else {
                                        var self = (_data$4 === App$MiniMMO$command$d_up);
                                        if (self) {
                                            var self = _player$7;
                                            switch (self._) {
                                                case 'App.MiniMMO.Player.new':
                                                    var $390 = self.w;
                                                    var $391 = self.a;
                                                    var $392 = self.s;
                                                    var $393 = self.x;
                                                    var $394 = self.y;
                                                    var $395 = App$MiniMMO$Player$new$($390, $391, $392, Bool$false, $393, $394);
                                                    var $389 = $395;
                                                    break;
                                            };
                                            var $388 = $389;
                                        } else {
                                            var self = (_data$4 === App$MiniMMO$command$w_up);
                                            if (self) {
                                                var self = _player$7;
                                                switch (self._) {
                                                    case 'App.MiniMMO.Player.new':
                                                        var $398 = self.a;
                                                        var $399 = self.s;
                                                        var $400 = self.d;
                                                        var $401 = self.x;
                                                        var $402 = self.y;
                                                        var $403 = App$MiniMMO$Player$new$(Bool$false, $398, $399, $400, $401, $402);
                                                        var $397 = $403;
                                                        break;
                                                };
                                                var $396 = $397;
                                            } else {
                                                var $404 = _player$7;
                                                var $396 = $404;
                                            };
                                            var $388 = $396;
                                        };
                                        var $380 = $388;
                                    };
                                    var $372 = $380;
                                };
                                var $364 = $372;
                            };
                            var $356 = $364;
                        };
                        var $348 = $356;
                    };
                    var _player$8 = $348;
                };
                var $340 = _player$8;
                var _player$6 = $340;
                break;
            case 'Maybe.none':
                var $405 = App$MiniMMO$Player$new$(Bool$false, Bool$false, Bool$false, Bool$false, 0, 0);
                var _player$6 = $405;
                break;
        };
        var $338 = Map$set$(_addr$3, _player$6, _map$5);
        return $338;
    };
    const App$MiniMMO$post = x0 => x1 => x2 => x3 => x4 => App$MiniMMO$post$(x0, x1, x2, x3, x4);
    const App$MiniMMO = App$new$(App$MiniMMO$init, App$MiniMMO$draw, App$MiniMMO$when, App$MiniMMO$tick, App$MiniMMO$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'BitsMap': BitsMap,
        'Map': Map,
        'App.MiniMMO.State': App$MiniMMO$State,
        'App.Store.new': App$Store$new,
        'Unit.new': Unit$new,
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
        'App.MiniMMO.init': App$MiniMMO$init,
        'Pair.snd': Pair$snd,
        'App.State.global': App$State$global,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'BitsMap.values.go': BitsMap$values$go,
        'Map.values': Map$values,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
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
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'DOM.node': DOM$node,
        'DOM.text': DOM$text,
        'App.MiniMMO.draw': App$MiniMMO$draw,
        'IO': IO,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.do': IO$do,
        'App.pass': App$pass,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.MiniMMO.room': App$MiniMMO$room,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'App.new_post': App$new_post,
        'App.MiniMMO.command.a_down': App$MiniMMO$command$a_down,
        'App.MiniMMO.command.d_down': App$MiniMMO$command$d_down,
        'App.MiniMMO.command.w_down': App$MiniMMO$command$w_down,
        'App.MiniMMO.command.s_down': App$MiniMMO$command$s_down,
        'App.MiniMMO.command.a_up': App$MiniMMO$command$a_up,
        'App.MiniMMO.command.d_up': App$MiniMMO$command$d_up,
        'App.MiniMMO.command.w_up': App$MiniMMO$command$w_up,
        'App.MiniMMO.command.s_up': App$MiniMMO$command$s_up,
        'App.MiniMMO.when': App$MiniMMO$when,
        'BitsMap.map': BitsMap$map,
        'Map.map': Map$map,
        'U32.new': U32$new,
        'Word.e': Word$e,
        'Word': Word,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'U32.from_nat': U32$from_nat,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'App.MiniMMO.Player.new': App$MiniMMO$Player$new,
        'App.MiniMMO.tick': App$MiniMMO$tick,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'String.eql': String$eql,
        'Map.set': Map$set,
        'App.MiniMMO.post': App$MiniMMO$post,
        'App.MiniMMO': App$MiniMMO,
    };
})();

/***/ })

}]);
//# sourceMappingURL=661.index.js.map