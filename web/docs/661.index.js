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
    const App$MiniMMO$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $35 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $35;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const Unit$new = null;

    function App$MiniMMO$State$global$new$(_run$1, _map$2) {
        var $36 = ({
            _: 'App.MiniMMO.State.global.new',
            'run': _run$1,
            'map': _map$2
        });
        return $36;
    };
    const App$MiniMMO$State$global$new = x0 => x1 => App$MiniMMO$State$global$new$(x0, x1);

    function U32$new$(_value$1) {
        var $37 = word_to_u32(_value$1);
        return $37;
    };
    const U32$new = x0 => U32$new$(x0);

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
                    var $38 = _x$4;
                    return $38;
                } else {
                    var $39 = (self - 1n);
                    var $40 = Nat$apply$($39, _f$3, _f$3(_x$4));
                    return $40;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $41 = null;
        return $41;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $42 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $42;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $43 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $45 = self.pred;
                var $46 = Word$i$($45);
                var $44 = $46;
                break;
            case 'Word.i':
                var $47 = self.pred;
                var $48 = Word$o$(Word$inc$($47));
                var $44 = $48;
                break;
            case 'Word.e':
                var $49 = Word$e;
                var $44 = $49;
                break;
        };
        return $44;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $51 = Word$e;
            var $50 = $51;
        } else {
            var $52 = (self - 1n);
            var $53 = Word$o$(Word$zero$($52));
            var $50 = $53;
        };
        return $50;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $54 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $54;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $55 = 1n + _pred$1;
        return $55;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function BitsMap$(_A$1) {
        var $56 = null;
        return $56;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $57 = null;
        return $57;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $58 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $58;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $59 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $59;
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
                var $61 = self.pred;
                var $62 = (Word$to_bits$($61) + '0');
                var $60 = $62;
                break;
            case 'Word.i':
                var $63 = self.pred;
                var $64 = (Word$to_bits$($63) + '1');
                var $60 = $64;
                break;
            case 'Word.e':
                var $65 = Bits$e;
                var $60 = $65;
                break;
        };
        return $60;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $67 = Bits$e;
            var $66 = $67;
        } else {
            var $68 = self.charCodeAt(0);
            var $69 = self.slice(1);
            var $70 = (String$to_bits$($69) + (u16_to_bits($68)));
            var $66 = $70;
        };
        return $66;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $72 = self.head;
                var $73 = self.tail;
                var self = $72;
                switch (self._) {
                    case 'Pair.new':
                        var $75 = self.fst;
                        var $76 = self.snd;
                        var $77 = (bitsmap_set(String$to_bits$($75), $76, Map$from_list$($73), 'set'));
                        var $74 = $77;
                        break;
                };
                var $71 = $74;
                break;
            case 'List.nil':
                var $78 = BitsMap$new;
                var $71 = $78;
                break;
        };
        return $71;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $79 = null;
        return $79;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const App$MiniMMO$init = App$Store$new$(Unit$new, App$MiniMMO$State$global$new$(0, Map$from_list$(List$nil)));

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $81 = self.snd;
                var $82 = $81;
                var $80 = $82;
                break;
        };
        return $80;
    };
    const Pair$snd = x0 => Pair$snd$(x0);
    const App$State$global = Pair$snd;
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $83 = null;
        return $83;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $84 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $84;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $86 = self.val;
                var $87 = self.lft;
                var $88 = self.rgt;
                var self = $86;
                switch (self._) {
                    case 'Maybe.some':
                        var $90 = self.value;
                        var $91 = List$cons$($90, _list$3);
                        var _list0$7 = $91;
                        break;
                    case 'Maybe.none':
                        var $92 = _list$3;
                        var _list0$7 = $92;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($87, _list0$7);
                var _list2$9 = BitsMap$values$go$($88, _list1$8);
                var $89 = _list2$9;
                var $85 = $89;
                break;
            case 'BitsMap.new':
                var $93 = _list$3;
                var $85 = $93;
                break;
        };
        return $85;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $94 = BitsMap$values$go$(_xs$2, List$nil);
        return $94;
    };
    const Map$values = x0 => Map$values$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $95 = (String.fromCharCode(_head$1) + _tail$2);
        return $95;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $97 = self.head;
                var $98 = self.tail;
                var $99 = _cons$5($97)(List$fold$($98, _nil$4, _cons$5));
                var $96 = $99;
                break;
            case 'List.nil':
                var $100 = _nil$4;
                var $96 = $100;
                break;
        };
        return $96;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $101 = null;
        return $101;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $102 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $102;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $103 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $103;
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
                    var $104 = Either$left$(_n$1);
                    return $104;
                } else {
                    var $105 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $107 = Either$right$(Nat$succ$($105));
                        var $106 = $107;
                    } else {
                        var $108 = (self - 1n);
                        var $109 = Nat$sub_rem$($108, $105);
                        var $106 = $109;
                    };
                    return $106;
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
                        var $110 = self.value;
                        var $111 = Nat$div_mod$go$($110, _m$2, Nat$succ$(_d$3));
                        return $111;
                    case 'Either.right':
                        var $112 = Pair$new$(_d$3, _n$1);
                        return $112;
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
                        var $113 = self.fst;
                        var $114 = self.snd;
                        var self = $113;
                        if (self === 0n) {
                            var $116 = List$cons$($114, _res$3);
                            var $115 = $116;
                        } else {
                            var $117 = (self - 1n);
                            var $118 = Nat$to_base$go$(_base$1, $113, List$cons$($114, _res$3));
                            var $115 = $118;
                        };
                        return $115;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $119 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $119;
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
                    var $120 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $120;
                } else {
                    var $121 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $123 = _r$3;
                        var $122 = $123;
                    } else {
                        var $124 = (self - 1n);
                        var $125 = Nat$mod$go$($124, $121, Nat$succ$(_r$3));
                        var $122 = $125;
                    };
                    return $122;
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
        var $126 = null;
        return $126;
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
                        var $127 = self.head;
                        var $128 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $130 = Maybe$some$($127);
                            var $129 = $130;
                        } else {
                            var $131 = (self - 1n);
                            var $132 = List$at$($131, $128);
                            var $129 = $132;
                        };
                        return $129;
                    case 'List.nil':
                        var $133 = Maybe$none;
                        return $133;
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
                    var $136 = self.value;
                    var $137 = $136;
                    var $135 = $137;
                    break;
                case 'Maybe.none':
                    var $138 = 35;
                    var $135 = $138;
                    break;
            };
            var $134 = $135;
        } else {
            var $139 = 35;
            var $134 = $139;
        };
        return $134;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $140 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $141 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $141;
        }));
        return $140;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $142 = Nat$to_string_base$(10n, _n$1);
        return $142;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $144 = self.pred;
                var $145 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $144));
                var $143 = $145;
                break;
            case 'Word.i':
                var $146 = self.pred;
                var $147 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $146));
                var $143 = $147;
                break;
            case 'Word.e':
                var $148 = _nil$3;
                var $143 = $148;
                break;
        };
        return $143;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $149 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $150 = Nat$succ$((2n * _x$4));
            return $150;
        }), _word$2);
        return $149;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $151 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $151;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $152 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $152;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function App$MiniMMO$draw$(_state$1) {
        var _avatars$2 = List$nil;
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $154 = self.global;
                var $155 = $154;
                var self = $155;
                break;
        };
        switch (self._) {
            case 'App.MiniMMO.State.global.new':
                var $156 = self.map;
                var _avatars$5 = (() => {
                    var $159 = _avatars$2;
                    var $160 = Map$values$($156);
                    let _avatars$6 = $159;
                    let _player$5;
                    while ($160._ === 'List.cons') {
                        _player$5 = $160.head;
                        var _style$7 = Map$from_list$(List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("left", (Nat$show$((BigInt((() => {
                            var self = _player$5;
                            switch (self._) {
                                case 'App.MiniMMO.Player.new':
                                    var $161 = self.x;
                                    var $162 = $161;
                                    return $162;
                            };
                        })()))) + "px")), List$cons$(Pair$new$("top", (Nat$show$((BigInt((() => {
                            var self = _player$5;
                            switch (self._) {
                                case 'App.MiniMMO.Player.new':
                                    var $163 = self.y;
                                    var $164 = $163;
                                    return $164;
                            };
                        })()))) + "px")), List$nil))));
                        var $159 = List$cons$(DOM$node$("div", Map$from_list$(List$nil), _style$7, List$cons$(DOM$text$("X"), List$nil)), _avatars$6);
                        _avatars$6 = $159;
                        $160 = $160.tail;
                    }
                    return _avatars$6;
                })();
                var $157 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), _avatars$5);
                var $153 = $157;
                break;
        };
        return $153;
    };
    const App$MiniMMO$draw = x0 => App$MiniMMO$draw$(x0);

    function IO$(_A$1) {
        var $165 = null;
        return $165;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $167 = self.fst;
                var $168 = $167;
                var $166 = $168;
                break;
        };
        return $166;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $169 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $169;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $171 = self.value;
                var $172 = _f$4($171);
                var $170 = $172;
                break;
            case 'IO.ask':
                var $173 = self.query;
                var $174 = self.param;
                var $175 = self.then;
                var $176 = IO$ask$($173, $174, (_x$8 => {
                    var $177 = IO$bind$($175(_x$8), _f$4);
                    return $177;
                }));
                var $170 = $176;
                break;
        };
        return $170;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $178 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $178;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $179 = _new$2(IO$bind)(IO$end);
        return $179;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $180 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $181 = IO$end$(Unit$new);
            return $181;
        }));
        return $180;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $182 = _m$pure$3;
        return $182;
    }))(Maybe$none);

    function App$do$(_call$2, _param$3) {
        var $183 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $184 = _m$bind$4;
            return $184;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $185 = App$pass;
            return $185;
        }));
        return $183;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $186 = App$do$("watch", _room$2);
        return $186;
    };
    const App$watch = x0 => App$watch$(x0);
    const App$MiniMMO$room = "0xc910a02b7c8a12";

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $188 = Bool$false;
                var $187 = $188;
                break;
            case 'Cmp.eql':
                var $189 = Bool$true;
                var $187 = $189;
                break;
        };
        return $187;
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
                var $191 = self.pred;
                var $192 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $194 = self.pred;
                            var $195 = (_a$pred$10 => {
                                var $196 = Word$cmp$go$(_a$pred$10, $194, _c$4);
                                return $196;
                            });
                            var $193 = $195;
                            break;
                        case 'Word.i':
                            var $197 = self.pred;
                            var $198 = (_a$pred$10 => {
                                var $199 = Word$cmp$go$(_a$pred$10, $197, Cmp$ltn);
                                return $199;
                            });
                            var $193 = $198;
                            break;
                        case 'Word.e':
                            var $200 = (_a$pred$8 => {
                                var $201 = _c$4;
                                return $201;
                            });
                            var $193 = $200;
                            break;
                    };
                    var $193 = $193($191);
                    return $193;
                });
                var $190 = $192;
                break;
            case 'Word.i':
                var $202 = self.pred;
                var $203 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $205 = self.pred;
                            var $206 = (_a$pred$10 => {
                                var $207 = Word$cmp$go$(_a$pred$10, $205, Cmp$gtn);
                                return $207;
                            });
                            var $204 = $206;
                            break;
                        case 'Word.i':
                            var $208 = self.pred;
                            var $209 = (_a$pred$10 => {
                                var $210 = Word$cmp$go$(_a$pred$10, $208, _c$4);
                                return $210;
                            });
                            var $204 = $209;
                            break;
                        case 'Word.e':
                            var $211 = (_a$pred$8 => {
                                var $212 = _c$4;
                                return $212;
                            });
                            var $204 = $211;
                            break;
                    };
                    var $204 = $204($202);
                    return $204;
                });
                var $190 = $203;
                break;
            case 'Word.e':
                var $213 = (_b$5 => {
                    var $214 = _c$4;
                    return $214;
                });
                var $190 = $213;
                break;
        };
        var $190 = $190(_b$3);
        return $190;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $215 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $215;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $216 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $216;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$new_post$(_room$2, _data$3) {
        var $217 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $218 = _m$bind$4;
            return $218;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $219 = App$pass;
            return $219;
        }));
        return $217;
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
                var $221 = self.code;
                var self = ($221 === 65);
                if (self) {
                    var $223 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$a_down);
                    var $222 = $223;
                } else {
                    var self = ($221 === 68);
                    if (self) {
                        var $225 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$d_down);
                        var $224 = $225;
                    } else {
                        var self = ($221 === 87);
                        if (self) {
                            var $227 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$w_down);
                            var $226 = $227;
                        } else {
                            var self = ($221 === 83);
                            if (self) {
                                var $229 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$s_down);
                                var $228 = $229;
                            } else {
                                var $230 = App$pass;
                                var $228 = $230;
                            };
                            var $226 = $228;
                        };
                        var $224 = $226;
                    };
                    var $222 = $224;
                };
                var $220 = $222;
                break;
            case 'App.Event.key_up':
                var $231 = self.code;
                var self = ($231 === 65);
                if (self) {
                    var $233 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$a_up);
                    var $232 = $233;
                } else {
                    var self = ($231 === 68);
                    if (self) {
                        var $235 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$d_up);
                        var $234 = $235;
                    } else {
                        var self = ($231 === 87);
                        if (self) {
                            var $237 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$w_up);
                            var $236 = $237;
                        } else {
                            var self = ($231 === 83);
                            if (self) {
                                var $239 = App$new_post$(App$MiniMMO$room, App$MiniMMO$command$s_up);
                                var $238 = $239;
                            } else {
                                var $240 = App$pass;
                                var $238 = $240;
                            };
                            var $236 = $238;
                        };
                        var $234 = $236;
                    };
                    var $232 = $234;
                };
                var $220 = $232;
                break;
            case 'App.Event.init':
                var $241 = App$watch$(App$MiniMMO$room);
                var $220 = $241;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $242 = App$pass;
                var $220 = $242;
                break;
        };
        return $220;
    };
    const App$MiniMMO$when = x0 => x1 => App$MiniMMO$when$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $244 = Bool$false;
                var $243 = $244;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $245 = Bool$true;
                var $243 = $245;
                break;
        };
        return $243;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $246 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $246;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U32$gte = a0 => a1 => (a0 >= a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BitsMap$map$(_fn$3, _map$4) {
        var self = _map$4;
        switch (self._) {
            case 'BitsMap.tie':
                var $248 = self.val;
                var $249 = self.lft;
                var $250 = self.rgt;
                var self = $248;
                switch (self._) {
                    case 'Maybe.some':
                        var $252 = self.value;
                        var $253 = Maybe$some$(_fn$3($252));
                        var _val$8 = $253;
                        break;
                    case 'Maybe.none':
                        var $254 = Maybe$none;
                        var _val$8 = $254;
                        break;
                };
                var _lft$9 = BitsMap$map$(_fn$3, $249);
                var _rgt$10 = BitsMap$map$(_fn$3, $250);
                var $251 = BitsMap$tie$(_val$8, _lft$9, _rgt$10);
                var $247 = $251;
                break;
            case 'BitsMap.new':
                var $255 = BitsMap$new;
                var $247 = $255;
                break;
        };
        return $247;
    };
    const BitsMap$map = x0 => x1 => BitsMap$map$(x0, x1);

    function Map$map$(_fn$3, _map$4) {
        var $256 = BitsMap$map$(_fn$3, _map$4);
        return $256;
    };
    const Map$map = x0 => x1 => Map$map$(x0, x1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $258 = self.pred;
                var $259 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $261 = self.pred;
                            var $262 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $264 = Word$i$(Word$subber$(_a$pred$10, $261, Bool$true));
                                    var $263 = $264;
                                } else {
                                    var $265 = Word$o$(Word$subber$(_a$pred$10, $261, Bool$false));
                                    var $263 = $265;
                                };
                                return $263;
                            });
                            var $260 = $262;
                            break;
                        case 'Word.i':
                            var $266 = self.pred;
                            var $267 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $269 = Word$o$(Word$subber$(_a$pred$10, $266, Bool$true));
                                    var $268 = $269;
                                } else {
                                    var $270 = Word$i$(Word$subber$(_a$pred$10, $266, Bool$true));
                                    var $268 = $270;
                                };
                                return $268;
                            });
                            var $260 = $267;
                            break;
                        case 'Word.e':
                            var $271 = (_a$pred$8 => {
                                var $272 = Word$e;
                                return $272;
                            });
                            var $260 = $271;
                            break;
                    };
                    var $260 = $260($258);
                    return $260;
                });
                var $257 = $259;
                break;
            case 'Word.i':
                var $273 = self.pred;
                var $274 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $276 = self.pred;
                            var $277 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $279 = Word$o$(Word$subber$(_a$pred$10, $276, Bool$false));
                                    var $278 = $279;
                                } else {
                                    var $280 = Word$i$(Word$subber$(_a$pred$10, $276, Bool$false));
                                    var $278 = $280;
                                };
                                return $278;
                            });
                            var $275 = $277;
                            break;
                        case 'Word.i':
                            var $281 = self.pred;
                            var $282 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $284 = Word$i$(Word$subber$(_a$pred$10, $281, Bool$true));
                                    var $283 = $284;
                                } else {
                                    var $285 = Word$o$(Word$subber$(_a$pred$10, $281, Bool$false));
                                    var $283 = $285;
                                };
                                return $283;
                            });
                            var $275 = $282;
                            break;
                        case 'Word.e':
                            var $286 = (_a$pred$8 => {
                                var $287 = Word$e;
                                return $287;
                            });
                            var $275 = $286;
                            break;
                    };
                    var $275 = $275($273);
                    return $275;
                });
                var $257 = $274;
                break;
            case 'Word.e':
                var $288 = (_b$5 => {
                    var $289 = Word$e;
                    return $289;
                });
                var $257 = $288;
                break;
        };
        var $257 = $257(_b$3);
        return $257;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $290 = Word$subber$(_a$2, _b$3, Bool$false);
        return $290;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $292 = self.pred;
                var $293 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $295 = self.pred;
                            var $296 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $298 = Word$i$(Word$adder$(_a$pred$10, $295, Bool$false));
                                    var $297 = $298;
                                } else {
                                    var $299 = Word$o$(Word$adder$(_a$pred$10, $295, Bool$false));
                                    var $297 = $299;
                                };
                                return $297;
                            });
                            var $294 = $296;
                            break;
                        case 'Word.i':
                            var $300 = self.pred;
                            var $301 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $303 = Word$o$(Word$adder$(_a$pred$10, $300, Bool$true));
                                    var $302 = $303;
                                } else {
                                    var $304 = Word$i$(Word$adder$(_a$pred$10, $300, Bool$false));
                                    var $302 = $304;
                                };
                                return $302;
                            });
                            var $294 = $301;
                            break;
                        case 'Word.e':
                            var $305 = (_a$pred$8 => {
                                var $306 = Word$e;
                                return $306;
                            });
                            var $294 = $305;
                            break;
                    };
                    var $294 = $294($292);
                    return $294;
                });
                var $291 = $293;
                break;
            case 'Word.i':
                var $307 = self.pred;
                var $308 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $310 = self.pred;
                            var $311 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $313 = Word$o$(Word$adder$(_a$pred$10, $310, Bool$true));
                                    var $312 = $313;
                                } else {
                                    var $314 = Word$i$(Word$adder$(_a$pred$10, $310, Bool$false));
                                    var $312 = $314;
                                };
                                return $312;
                            });
                            var $309 = $311;
                            break;
                        case 'Word.i':
                            var $315 = self.pred;
                            var $316 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $318 = Word$i$(Word$adder$(_a$pred$10, $315, Bool$true));
                                    var $317 = $318;
                                } else {
                                    var $319 = Word$o$(Word$adder$(_a$pred$10, $315, Bool$true));
                                    var $317 = $319;
                                };
                                return $317;
                            });
                            var $309 = $316;
                            break;
                        case 'Word.e':
                            var $320 = (_a$pred$8 => {
                                var $321 = Word$e;
                                return $321;
                            });
                            var $309 = $320;
                            break;
                    };
                    var $309 = $309($307);
                    return $309;
                });
                var $291 = $308;
                break;
            case 'Word.e':
                var $322 = (_b$5 => {
                    var $323 = Word$e;
                    return $323;
                });
                var $291 = $322;
                break;
        };
        var $291 = $291(_b$3);
        return $291;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $324 = Word$adder$(_a$2, _b$3, Bool$false);
        return $324;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function App$MiniMMO$Player$new$(_w$1, _a$2, _s$3, _d$4, _x$5, _y$6) {
        var $325 = ({
            _: 'App.MiniMMO.Player.new',
            'w': _w$1,
            'a': _a$2,
            's': _s$3,
            'd': _d$4,
            'x': _x$5,
            'y': _y$6
        });
        return $325;
    };
    const App$MiniMMO$Player$new = x0 => x1 => x2 => x3 => x4 => x5 => App$MiniMMO$Player$new$(x0, x1, x2, x3, x4, x5);

    function App$MiniMMO$tick$(_tick$1, _glob$2) {
        var self = _glob$2;
        switch (self._) {
            case 'App.MiniMMO.State.global.new':
                var $327 = self.run;
                var $328 = self.map;
                var self = ($327 >= 256);
                if (self) {
                    var $330 = _glob$2;
                    var $329 = $330;
                } else {
                    var _map$5 = Map$map$((_player$5 => {
                        var self = _player$5;
                        switch (self._) {
                            case 'App.MiniMMO.Player.new':
                                var $333 = self.w;
                                var $334 = self.a;
                                var $335 = self.s;
                                var $336 = self.d;
                                var $337 = self.x;
                                var $338 = self.y;
                                var _w$12 = $333;
                                var _a$13 = $334;
                                var _s$14 = $335;
                                var _d$15 = $336;
                                var _x$16 = $337;
                                var _y$17 = $338;
                                var self = $334;
                                if (self) {
                                    var $340 = ((_x$16 - 4) >>> 0);
                                    var _x$18 = $340;
                                } else {
                                    var $341 = _x$16;
                                    var _x$18 = $341;
                                };
                                var self = $336;
                                if (self) {
                                    var $342 = ((_x$18 + 4) >>> 0);
                                    var _x$19 = $342;
                                } else {
                                    var $343 = _x$18;
                                    var _x$19 = $343;
                                };
                                var self = $333;
                                if (self) {
                                    var $344 = ((_y$17 - 4) >>> 0);
                                    var _y$20 = $344;
                                } else {
                                    var $345 = _y$17;
                                    var _y$20 = $345;
                                };
                                var self = $335;
                                if (self) {
                                    var $346 = ((_y$20 + 4) >>> 0);
                                    var _y$21 = $346;
                                } else {
                                    var $347 = _y$20;
                                    var _y$21 = $347;
                                };
                                var $339 = App$MiniMMO$Player$new$(_w$12, _a$13, _s$14, _d$15, _x$19, _y$21);
                                var $332 = $339;
                                break;
                        };
                        return $332;
                    }), $328);
                    var $331 = App$MiniMMO$State$global$new$((($327 + 1) >>> 0), _map$5);
                    var $329 = $331;
                };
                var $326 = $329;
                break;
        };
        return $326;
    };
    const App$MiniMMO$tick = x0 => x1 => App$MiniMMO$tick$(x0, x1);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Map$get$(_key$2, _map$3) {
        var $348 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $348;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $349 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $349;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function App$MiniMMO$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var self = _glob$5;
        switch (self._) {
            case 'App.MiniMMO.State.global.new':
                var $351 = self.map;
                var self = Map$get$(_addr$3, $351);
                switch (self._) {
                    case 'Maybe.some':
                        var $353 = self.value;
                        var _player$9 = $353;
                        var self = (_data$4 === App$MiniMMO$command$a_down);
                        if (self) {
                            var self = _player$9;
                            switch (self._) {
                                case 'App.MiniMMO.Player.new':
                                    var $356 = self.w;
                                    var $357 = self.s;
                                    var $358 = self.d;
                                    var $359 = self.x;
                                    var $360 = self.y;
                                    var $361 = App$MiniMMO$Player$new$($356, Bool$true, $357, $358, $359, $360);
                                    var $355 = $361;
                                    break;
                            };
                            var _player$10 = $355;
                        } else {
                            var self = (_data$4 === App$MiniMMO$command$s_down);
                            if (self) {
                                var self = _player$9;
                                switch (self._) {
                                    case 'App.MiniMMO.Player.new':
                                        var $364 = self.w;
                                        var $365 = self.a;
                                        var $366 = self.d;
                                        var $367 = self.x;
                                        var $368 = self.y;
                                        var $369 = App$MiniMMO$Player$new$($364, $365, Bool$true, $366, $367, $368);
                                        var $363 = $369;
                                        break;
                                };
                                var $362 = $363;
                            } else {
                                var self = (_data$4 === App$MiniMMO$command$d_down);
                                if (self) {
                                    var self = _player$9;
                                    switch (self._) {
                                        case 'App.MiniMMO.Player.new':
                                            var $372 = self.w;
                                            var $373 = self.a;
                                            var $374 = self.s;
                                            var $375 = self.x;
                                            var $376 = self.y;
                                            var $377 = App$MiniMMO$Player$new$($372, $373, $374, Bool$true, $375, $376);
                                            var $371 = $377;
                                            break;
                                    };
                                    var $370 = $371;
                                } else {
                                    var self = (_data$4 === App$MiniMMO$command$w_down);
                                    if (self) {
                                        var self = _player$9;
                                        switch (self._) {
                                            case 'App.MiniMMO.Player.new':
                                                var $380 = self.a;
                                                var $381 = self.s;
                                                var $382 = self.d;
                                                var $383 = self.x;
                                                var $384 = self.y;
                                                var $385 = App$MiniMMO$Player$new$(Bool$true, $380, $381, $382, $383, $384);
                                                var $379 = $385;
                                                break;
                                        };
                                        var $378 = $379;
                                    } else {
                                        var self = (_data$4 === App$MiniMMO$command$a_up);
                                        if (self) {
                                            var self = _player$9;
                                            switch (self._) {
                                                case 'App.MiniMMO.Player.new':
                                                    var $388 = self.w;
                                                    var $389 = self.s;
                                                    var $390 = self.d;
                                                    var $391 = self.x;
                                                    var $392 = self.y;
                                                    var $393 = App$MiniMMO$Player$new$($388, Bool$false, $389, $390, $391, $392);
                                                    var $387 = $393;
                                                    break;
                                            };
                                            var $386 = $387;
                                        } else {
                                            var self = (_data$4 === App$MiniMMO$command$s_up);
                                            if (self) {
                                                var self = _player$9;
                                                switch (self._) {
                                                    case 'App.MiniMMO.Player.new':
                                                        var $396 = self.w;
                                                        var $397 = self.a;
                                                        var $398 = self.d;
                                                        var $399 = self.x;
                                                        var $400 = self.y;
                                                        var $401 = App$MiniMMO$Player$new$($396, $397, Bool$false, $398, $399, $400);
                                                        var $395 = $401;
                                                        break;
                                                };
                                                var $394 = $395;
                                            } else {
                                                var self = (_data$4 === App$MiniMMO$command$d_up);
                                                if (self) {
                                                    var self = _player$9;
                                                    switch (self._) {
                                                        case 'App.MiniMMO.Player.new':
                                                            var $404 = self.w;
                                                            var $405 = self.a;
                                                            var $406 = self.s;
                                                            var $407 = self.x;
                                                            var $408 = self.y;
                                                            var $409 = App$MiniMMO$Player$new$($404, $405, $406, Bool$false, $407, $408);
                                                            var $403 = $409;
                                                            break;
                                                    };
                                                    var $402 = $403;
                                                } else {
                                                    var self = (_data$4 === App$MiniMMO$command$w_up);
                                                    if (self) {
                                                        var self = _player$9;
                                                        switch (self._) {
                                                            case 'App.MiniMMO.Player.new':
                                                                var $412 = self.a;
                                                                var $413 = self.s;
                                                                var $414 = self.d;
                                                                var $415 = self.x;
                                                                var $416 = self.y;
                                                                var $417 = App$MiniMMO$Player$new$(Bool$false, $412, $413, $414, $415, $416);
                                                                var $411 = $417;
                                                                break;
                                                        };
                                                        var $410 = $411;
                                                    } else {
                                                        var $418 = _player$9;
                                                        var $410 = $418;
                                                    };
                                                    var $402 = $410;
                                                };
                                                var $394 = $402;
                                            };
                                            var $386 = $394;
                                        };
                                        var $378 = $386;
                                    };
                                    var $370 = $378;
                                };
                                var $362 = $370;
                            };
                            var _player$10 = $362;
                        };
                        var $354 = _player$10;
                        var _player$8 = $354;
                        break;
                    case 'Maybe.none':
                        var $419 = App$MiniMMO$Player$new$(Bool$false, Bool$false, Bool$false, Bool$false, 0, 0);
                        var _player$8 = $419;
                        break;
                };
                var _map$9 = Map$set$(_addr$3, _player$8, $351);
                var $352 = App$MiniMMO$State$global$new$(0, _map$9);
                var $350 = $352;
                break;
        };
        return $350;
    };
    const App$MiniMMO$post = x0 => x1 => x2 => x3 => x4 => App$MiniMMO$post$(x0, x1, x2, x3, x4);
    const App$MiniMMO = App$new$(App$MiniMMO$init, App$MiniMMO$draw, App$MiniMMO$when, App$MiniMMO$tick, App$MiniMMO$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.MiniMMO.State': App$MiniMMO$State,
        'App.Store.new': App$Store$new,
        'Unit.new': Unit$new,
        'App.MiniMMO.State.global.new': App$MiniMMO$State$global$new,
        'U32.new': U32$new,
        'Nat.apply': Nat$apply,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'Nat.to_u32': Nat$to_u32,
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
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'U32.gte': U32$gte,
        'U32.from_nat': U32$from_nat,
        'BitsMap.map': BitsMap$map,
        'Map.map': Map$map,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
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