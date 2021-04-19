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
                var $24 = c2;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c2($25)($26);
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

    function Web$Kind$State$new$(_screen_size$1, _page$2) {
        var $33 = ({
            _: 'Web.Kind.State.new',
            'screen_size': _screen_size$1,
            'page': _page$2
        });
        return $33;
    };
    const Web$Kind$State$new = x0 => x1 => Web$Kind$State$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $34 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $34;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function U32$new$(_value$1) {
        var $35 = word_to_u32(_value$1);
        return $35;
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
                    var $36 = _x$4;
                    return $36;
                } else {
                    var $37 = (self - 1n);
                    var $38 = Nat$apply$($37, _f$3, _f$3(_x$4));
                    return $38;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $39 = null;
        return $39;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $40 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $40;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $41 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $41;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $43 = self.pred;
                var $44 = Word$i$($43);
                var $42 = $44;
                break;
            case 'Word.i':
                var $45 = self.pred;
                var $46 = Word$o$(Word$inc$($45));
                var $42 = $46;
                break;
            case 'Word.e':
                var $47 = Word$e;
                var $42 = $47;
                break;
        };
        return $42;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $49 = Word$e;
            var $48 = $49;
        } else {
            var $50 = (self - 1n);
            var $51 = Word$o$(Word$zero$($50));
            var $48 = $51;
        };
        return $48;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $52 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $52;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $53 = 1n + _pred$1;
        return $53;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $54 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $54;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $55 = null;
        return $55;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $56 = null;
        return $56;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $57 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $57;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $58 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $58;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $60 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $62 = self.val;
                        var $63 = self.lft;
                        var $64 = self.rgt;
                        var $65 = BitsMap$tie$($62, BitsMap$set$($60, _val$3, $63), $64);
                        var $61 = $65;
                        break;
                    case 'BitsMap.new':
                        var $66 = BitsMap$tie$(Maybe$none, BitsMap$set$($60, _val$3, BitsMap$new), BitsMap$new);
                        var $61 = $66;
                        break;
                };
                var $59 = $61;
                break;
            case 'i':
                var $67 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $69 = self.val;
                        var $70 = self.lft;
                        var $71 = self.rgt;
                        var $72 = BitsMap$tie$($69, $70, BitsMap$set$($67, _val$3, $71));
                        var $68 = $72;
                        break;
                    case 'BitsMap.new':
                        var $73 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($67, _val$3, BitsMap$new));
                        var $68 = $73;
                        break;
                };
                var $59 = $68;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $75 = self.lft;
                        var $76 = self.rgt;
                        var $77 = BitsMap$tie$(Maybe$some$(_val$3), $75, $76);
                        var $74 = $77;
                        break;
                    case 'BitsMap.new':
                        var $78 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $74 = $78;
                        break;
                };
                var $59 = $74;
                break;
        };
        return $59;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $80 = self.pred;
                var $81 = (Word$to_bits$($80) + '0');
                var $79 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = (Word$to_bits$($82) + '1');
                var $79 = $83;
                break;
            case 'Word.e':
                var $84 = Bits$e;
                var $79 = $84;
                break;
        };
        return $79;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $86 = Bits$e;
            var $85 = $86;
        } else {
            var $87 = self.charCodeAt(0);
            var $88 = self.slice(1);
            var $89 = (String$to_bits$($88) + (u16_to_bits($87)));
            var $85 = $89;
        };
        return $85;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $91 = self.head;
                var $92 = self.tail;
                var self = $91;
                switch (self._) {
                    case 'Pair.new':
                        var $94 = self.fst;
                        var $95 = self.snd;
                        var $96 = BitsMap$set$(String$to_bits$($94), $95, Map$from_list$($92));
                        var $93 = $96;
                        break;
                };
                var $90 = $93;
                break;
            case 'List.nil':
                var $97 = BitsMap$new;
                var $90 = $97;
                break;
        };
        return $90;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $98 = null;
        return $98;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $99 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $99;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const Web$Kind$constant$p_tag_size = "16px";

    function DOM$text$(_value$1) {
        var $100 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $100;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Web$Kind$img$croni = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAxhJREFUSIm1lz9IW1EUh79YR0lTxFhsIKZJOigSMBA6NGnrH5yKUHARHCrYIqGDYMeqtKMBp1BqoR0EOzhlFKND7SApFkpopqQhkIY2JUMzuaWDvdf73rvvvSr1DIF73rv3u79z7znnxcPlWMflucdzGcC155sAjE/G5YP9vWPWXj4G8Mif/wUVQDfoRcC2IbSDAiRTcQur+zzAofA0AAO9AUaCIQCKtSqNVl0o4vDDsWHi/p5xLMxNsS1QZ8ValXwha4Dr1IKz4s5QeJqB3oB0OEHPnqdJpuIW5WbrcoJexEaCISYSaaH03GAAg9p/sWKtysbOssH399JZLqUObKu2WKs6gvOFLGvPN8kXstJnvuFOYABKlRz5QpZGqw5Ao1UnX8iysbNsUWXelJpaytigWgsuVXL4vWH83jClSo5Gq27w+b1hLVw19XKNT8YtcFvFR8N9HA33SbjfG5Y+wADXHYE5f80h14EtOef3hu32J6HifJ3gqmrbPL799Zejr9muMJFIA8h7oLP9vWPtBbMLtafZrtguZoaWKjkAWTZ1cLM51upmu2IJc7NdYSg8bQCqFU7AzWE3m12tluVSzUmziXfMpVTUbEtaKa3xig4KEItOAHDzRoJv3z+xuLCOr/uWHNtBAfp91+jpifL2/Qr37j6wQMEm1KJyjQRDhlS5MxXj4+4X2wioJhqGcu6G6Govl1NHisYGmUik5fk6lVHRMHRmBp+rKzmlkQoXa9uBDVAxYWNnmcWFdenvv36VaGzQsLhb81BUW0qmAWpW8urNMwB+/vhtWVS8W6xVLRvY/XwofUszGZZmMhIuDtzytdFo1ZkaTbo2A3We2IQY69JsNTNPMhWnC+iIUDZadfnyQG/ANYRm1QO9AaZGk4wEQxboia/Damae7a0DQDnj1+9WgNPwiIliciQSkQtEIhHD2GzmzZ74Ojx8ep/ZuTG2tw7Escl/Ep3FhXVm58YAePLoBXDalwWkXC4bNiHGcJb3QnU0NijXAlQgaP5JdADUDSRTcUd1wsrlsvarUgfUDtQNuLzjNsd1/h9Ji2BZJdnEIwAAAABJRU5ErkJggg==";
    const Web$Kind$constant$secondary_color = "#3891A6";

    function Web$Kind$component$btn_primary_solid$(_title$1, _id$2) {
        var $101 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$2), List$nil)), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("width", "120px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border-radius", "7px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))))))))), List$cons$(DOM$text$(_title$1), List$nil));
        return $101;
    };
    const Web$Kind$component$btn_primary_solid = x0 => x1 => Web$Kind$component$btn_primary_solid$(x0, x1);
    const Web$Kind$constant$action_go_to_apps = "action_go_to_apps";

    function Web$Kind$component$title$(_title$1) {
        var $102 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "20px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $102;
    };
    const Web$Kind$component$title = x0 => Web$Kind$component$title$(x0);

    function Buffer32$new$(_depth$1, _array$2) {
        var $103 = u32array_to_buffer32(_array$2);
        return $103;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $104 = null;
        return $104;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $105 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $105;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $106 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $106;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $108 = Array$tip$(_x$3);
            var $107 = $108;
        } else {
            var $109 = (self - 1n);
            var _half$5 = Array$alloc$($109, _x$3);
            var $110 = Array$tie$(_half$5, _half$5);
            var $107 = $110;
        };
        return $107;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $111 = self.pred;
                        var $112 = Word$bit_length$go$($111, Nat$succ$(_c$3), _n$4);
                        return $112;
                    case 'Word.i':
                        var $113 = self.pred;
                        var $114 = Word$bit_length$go$($113, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $114;
                    case 'Word.e':
                        var $115 = _n$4;
                        return $115;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $116 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $116;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $118 = u32_to_word(self);
                var $119 = Word$bit_length$($118);
                var $117 = $119;
                break;
        };
        return $117;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $121 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $123 = Word$i$(Word$shift_left1$aux$($121, Bool$false));
                    var $122 = $123;
                } else {
                    var $124 = Word$o$(Word$shift_left1$aux$($121, Bool$false));
                    var $122 = $124;
                };
                var $120 = $122;
                break;
            case 'Word.i':
                var $125 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $127 = Word$i$(Word$shift_left1$aux$($125, Bool$true));
                    var $126 = $127;
                } else {
                    var $128 = Word$o$(Word$shift_left1$aux$($125, Bool$true));
                    var $126 = $128;
                };
                var $120 = $126;
                break;
            case 'Word.e':
                var $129 = Word$e;
                var $120 = $129;
                break;
        };
        return $120;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $131 = self.pred;
                var $132 = Word$o$(Word$shift_left1$aux$($131, Bool$false));
                var $130 = $132;
                break;
            case 'Word.i':
                var $133 = self.pred;
                var $134 = Word$o$(Word$shift_left1$aux$($133, Bool$true));
                var $130 = $134;
                break;
            case 'Word.e':
                var $135 = Word$e;
                var $130 = $135;
                break;
        };
        return $130;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $137 = self.pred;
                var $138 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $140 = self.pred;
                            var $141 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $143 = Word$i$(Word$adder$(_a$pred$10, $140, Bool$false));
                                    var $142 = $143;
                                } else {
                                    var $144 = Word$o$(Word$adder$(_a$pred$10, $140, Bool$false));
                                    var $142 = $144;
                                };
                                return $142;
                            });
                            var $139 = $141;
                            break;
                        case 'Word.i':
                            var $145 = self.pred;
                            var $146 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $148 = Word$o$(Word$adder$(_a$pred$10, $145, Bool$true));
                                    var $147 = $148;
                                } else {
                                    var $149 = Word$i$(Word$adder$(_a$pred$10, $145, Bool$false));
                                    var $147 = $149;
                                };
                                return $147;
                            });
                            var $139 = $146;
                            break;
                        case 'Word.e':
                            var $150 = (_a$pred$8 => {
                                var $151 = Word$e;
                                return $151;
                            });
                            var $139 = $150;
                            break;
                    };
                    var $139 = $139($137);
                    return $139;
                });
                var $136 = $138;
                break;
            case 'Word.i':
                var $152 = self.pred;
                var $153 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $155 = self.pred;
                            var $156 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $158 = Word$o$(Word$adder$(_a$pred$10, $155, Bool$true));
                                    var $157 = $158;
                                } else {
                                    var $159 = Word$i$(Word$adder$(_a$pred$10, $155, Bool$false));
                                    var $157 = $159;
                                };
                                return $157;
                            });
                            var $154 = $156;
                            break;
                        case 'Word.i':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $163 = Word$i$(Word$adder$(_a$pred$10, $160, Bool$true));
                                    var $162 = $163;
                                } else {
                                    var $164 = Word$o$(Word$adder$(_a$pred$10, $160, Bool$true));
                                    var $162 = $164;
                                };
                                return $162;
                            });
                            var $154 = $161;
                            break;
                        case 'Word.e':
                            var $165 = (_a$pred$8 => {
                                var $166 = Word$e;
                                return $166;
                            });
                            var $154 = $165;
                            break;
                    };
                    var $154 = $154($152);
                    return $154;
                });
                var $136 = $153;
                break;
            case 'Word.e':
                var $167 = (_b$5 => {
                    var $168 = Word$e;
                    return $168;
                });
                var $136 = $167;
                break;
        };
        var $136 = $136(_b$3);
        return $136;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $169 = Word$adder$(_a$2, _b$3, Bool$false);
        return $169;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $170 = self.pred;
                        var $171 = Word$mul$go$($170, Word$shift_left1$(_b$4), _acc$5);
                        return $171;
                    case 'Word.i':
                        var $172 = self.pred;
                        var $173 = Word$mul$go$($172, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $173;
                    case 'Word.e':
                        var $174 = _acc$5;
                        return $174;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $176 = self.pred;
                var $177 = Word$o$(Word$to_zero$($176));
                var $175 = $177;
                break;
            case 'Word.i':
                var $178 = self.pred;
                var $179 = Word$o$(Word$to_zero$($178));
                var $175 = $179;
                break;
            case 'Word.e':
                var $180 = Word$e;
                var $175 = $180;
                break;
        };
        return $175;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $181 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $181;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $182 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $182;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $183 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $183;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kind$constant$primary_color = "#71558C";
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $184 = (String.fromCharCode(_head$1) + _tail$2);
        return $184;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $186 = String$nil;
            var $185 = $186;
        } else {
            var $187 = (self - 1n);
            var $188 = (_xs$1 + String$repeat$(_xs$1, $187));
            var $185 = $188;
        };
        return $185;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Web$Kind$component$header_tab$(_is_active$1, _title$2, _id$3) {
        var self = _is_active$1;
        if (self) {
            var $190 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $189 = $190;
        } else {
            var $191 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("margin-bottom", "2px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $189 = $191;
        };
        return $189;
    };
    const Web$Kind$component$header_tab = x0 => x1 => x2 => Web$Kind$component$header_tab$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $193 = Bool$false;
                var $192 = $193;
                break;
            case 'Cmp.eql':
                var $194 = Bool$true;
                var $192 = $194;
                break;
        };
        return $192;
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
                var $196 = self.pred;
                var $197 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $199 = self.pred;
                            var $200 = (_a$pred$10 => {
                                var $201 = Word$cmp$go$(_a$pred$10, $199, _c$4);
                                return $201;
                            });
                            var $198 = $200;
                            break;
                        case 'Word.i':
                            var $202 = self.pred;
                            var $203 = (_a$pred$10 => {
                                var $204 = Word$cmp$go$(_a$pred$10, $202, Cmp$ltn);
                                return $204;
                            });
                            var $198 = $203;
                            break;
                        case 'Word.e':
                            var $205 = (_a$pred$8 => {
                                var $206 = _c$4;
                                return $206;
                            });
                            var $198 = $205;
                            break;
                    };
                    var $198 = $198($196);
                    return $198;
                });
                var $195 = $197;
                break;
            case 'Word.i':
                var $207 = self.pred;
                var $208 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $210 = self.pred;
                            var $211 = (_a$pred$10 => {
                                var $212 = Word$cmp$go$(_a$pred$10, $210, Cmp$gtn);
                                return $212;
                            });
                            var $209 = $211;
                            break;
                        case 'Word.i':
                            var $213 = self.pred;
                            var $214 = (_a$pred$10 => {
                                var $215 = Word$cmp$go$(_a$pred$10, $213, _c$4);
                                return $215;
                            });
                            var $209 = $214;
                            break;
                        case 'Word.e':
                            var $216 = (_a$pred$8 => {
                                var $217 = _c$4;
                                return $217;
                            });
                            var $209 = $216;
                            break;
                    };
                    var $209 = $209($207);
                    return $209;
                });
                var $195 = $208;
                break;
            case 'Word.e':
                var $218 = (_b$5 => {
                    var $219 = _c$4;
                    return $219;
                });
                var $195 = $218;
                break;
        };
        var $195 = $195(_b$3);
        return $195;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $220 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $220;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $221 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $221;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kind$helper$is_current$(_title$1, _page$2) {
        var self = _page$2;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var $223 = (_title$1 === "Home");
                var $222 = $223;
                break;
            case 'Web.Kind.Page.apps':
                var $224 = (_title$1 === "Apps");
                var $222 = $224;
                break;
        };
        return $222;
    };
    const Web$Kind$helper$is_current = x0 => x1 => Web$Kind$helper$is_current$(x0, x1);
    const Web$Kind$constant$action_go_to_home = "action_go_to_home";

    function Web$Kind$component$header_tabs$(_page$1) {
        var _tabs$2 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$("Home", _page$1), "Home", Web$Kind$constant$action_go_to_home), List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$("Apps", _page$1), "Apps", Web$Kind$constant$action_go_to_apps), List$nil));
        var $225 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), _tabs$2);
        return $225;
    };
    const Web$Kind$component$header_tabs = x0 => Web$Kind$component$header_tabs$(x0);

    function Web$Kind$component$header$(_page$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("padding", "10px 50px 10px 50px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("color", Web$Kind$constant$primary_color), List$nil)), List$cons$(DOM$text$(String$repeat$("=", 90n)), List$nil)), List$nil));
        var $226 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_page$1), List$nil))));
        return $226;
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);
    const Web$Kind$Page$home = ({
        _: 'Web.Kind.Page.home'
    });

    function Web$Kind$component$body_container$(_ele$1) {
        var $227 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 40px 20%"), List$cons$(Pair$new$("flex", "1"), List$nil))), _ele$1);
        return $227;
    };
    const Web$Kind$component$body_container = x0 => Web$Kind$component$body_container$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $228 = null;
        return $228;
    };
    const List = x0 => List$(x0);

    function Web$Kind$component$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $231 = _li$2;
            var $232 = _items$1;
            let _li$4 = $231;
            let _item$3;
            while ($232._ === 'List.cons') {
                _item$3 = $232.head;
                var $231 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $231;
                $232 = $232.tail;
            }
            return _li$4;
        })();
        var $229 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $229;
    };
    const Web$Kind$component$list = x0 => Web$Kind$component$list$(x0);

    function Web$Kind$component$link_white$(_txt$1, _href$2) {
        var $233 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $233;
    };
    const Web$Kind$component$link_white = x0 => x1 => Web$Kind$component$link_white$(x0, x1);
    const Web$Kind$constant$dark_pri_color = "#44366B";
    const Web$Kind$component$footer = (() => {
        var _join_us_txt$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(Web$Kind$component$list$(List$cons$(Web$Kind$component$link_white$(" Github", "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$component$link_white$(" Telegram", "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "110px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$primary_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("padding-right", "20%"), List$nil))))))))), List$cons$(_join_us_txt$1, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "20px"), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _msg_footer$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("background-color", Web$Kind$constant$dark_pri_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10px 20% 10px 20%"), List$nil))))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(Web$Kind$component$link_white$("\u{1f9d0}\u{ddd0} show me the code!", "https://github.com/uwu-tech/Kind/tree/master/base/Web/Kind"), List$nil)));
        var $234 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "170px"), List$cons$(Pair$new$("margin-bottom", "0px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil)))))), List$cons$(_join_us$1, List$cons$(_msg_footer$2, List$nil)));
        return $234;
    })();
    const Web$Kind$draw_page_home = (() => {
        var _line$1 = (_txt$1 => {
            var $236 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $236;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $237 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $237;
        });
        var _span_bold$4 = (_txt$4 => {
            var $238 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $238;
        });
        var _intro$5 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(_span$3("Kind is a cute "), List$cons$(_span_bold$4("proof"), List$cons$(_span$3("gramming language."), List$cons$(_line_break$2, List$cons$(_span$3("It\'s "), List$cons$(_span_bold$4("capable of everything"), List$cons$(_line$1("from web apps to games to advanced"), List$cons$(_line$1("mathematical proofs."), List$nil)))))))));
        var _croni$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "40px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("gl hf!"), List$nil)), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", Web$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "30px"), List$cons$(Pair$new$("height", "30px"), List$nil))), List$nil), List$nil)));
        var _call_to_apps$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "100px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(Web$Kind$component$btn_primary_solid$("GO TO APPS", Web$Kind$constant$action_go_to_apps), List$cons$(_croni$6, List$nil)));
        var _instructions$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$1("npm i -g kind-lang"), List$cons$(_line$1("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$1("cd Kind/base"), List$cons$(_line$1("kind Main"), List$cons$(_line$1("kind Main --run"), List$nil))))));
        var _install$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$7, List$nil)));
        var $235 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-home"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$home), List$cons$(Web$Kind$component$body_container$(List$cons$(_intro$5, List$cons$(_call_to_apps$6, List$cons$(_install$7, List$nil)))), List$cons$(Web$Kind$component$footer, List$nil))));
        return $235;
    })();

    function Web$Kind$component$game_card$(_src$1, _title$2, _path$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var _title$5 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _path$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("text-decoration", "none"), List$nil))))), List$cons$(DOM$text$(_title$2), List$nil));
        var $239 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$nil))))), List$cons$(_banner$4, List$cons$(_title$5, List$nil)));
        return $239;
    };
    const Web$Kind$component$game_card = x0 => x1 => x2 => Web$Kind$component$game_card$(x0, x1, x2);
    const Web$Kind$img$banner_template = "data:image/png;base64,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";
    const Web$Kind$content_apps = List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Senhas", "Web.Senhas"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "TicTacToe", "Web.TicTacToe"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Kaelin", "Web.Kaelin"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Demo", "Web.Demo"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Demo", "Web.Demo"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Demo", "Web.Demo"), List$nil))))));
    const Web$Kind$draw_page_apps = (() => {
        var _line$1 = (_txt$1 => {
            var $241 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $241;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $242 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $242;
        });
        var _span_bold$4 = (_txt$4 => {
            var $243 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $243;
        });
        var _games$5 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$component$title$("Games"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), Web$Kind$content_apps), List$nil)));
        var $240 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-apps"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$apps), List$cons$(Web$Kind$component$body_container$(List$cons$(_games$5, List$nil)), List$cons$(Web$Kind$component$footer, List$nil))));
        return $240;
    })();

    function Web$Kind$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var $245 = Web$Kind$draw_page_home;
                var $244 = $245;
                break;
            case 'Web.Kind.Page.apps':
                var $246 = Web$Kind$draw_page_apps;
                var $244 = $246;
                break;
        };
        return $244;
    };
    const Web$Kind$draw_page = x0 => Web$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $247 = null;
        return $247;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $248 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $248;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $250 = self.value;
                var $251 = _f$4($250);
                var $249 = $251;
                break;
            case 'IO.ask':
                var $252 = self.query;
                var $253 = self.param;
                var $254 = self.then;
                var $255 = IO$ask$($252, $253, (_x$8 => {
                    var $256 = IO$bind$($254(_x$8), _f$4);
                    return $256;
                }));
                var $249 = $255;
                break;
        };
        return $249;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $257 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $257;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $258 = _new$2(IO$bind)(IO$end);
        return $258;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $259 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $259;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $260 = _m$pure$2;
        return $260;
    }))(Dynamic$new$(Unit$new));
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function App$store$(_value$2) {
        var $261 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $262 = _m$pure$4;
            return $262;
        }))(Dynamic$new$(_value$2));
        return $261;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kind$exe_event$(_stt$1, _e_id$2, _e_name$3) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $264 = self.screen_size;
                var $265 = self.page;
                var self = (_e_id$2 === Web$Kind$constant$action_go_to_home);
                if (self) {
                    var $267 = Web$Kind$State$new$($264, Web$Kind$Page$home);
                    var $266 = $267;
                } else {
                    var self = (_e_id$2 === Web$Kind$constant$action_go_to_apps);
                    if (self) {
                        var $269 = Web$Kind$State$new$($264, Web$Kind$Page$apps);
                        var $268 = $269;
                    } else {
                        var $270 = Web$Kind$State$new$($264, $265);
                        var $268 = $270;
                    };
                    var $266 = $268;
                };
                var $263 = $266;
                break;
        };
        return $263;
    };
    const Web$Kind$exe_event = x0 => x1 => x2 => Web$Kind$exe_event$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $271 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $271;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kind = (() => {
        var _init$1 = Web$Kind$State$new$(Pair$new$(500, 400), Web$Kind$Page$apps);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.Kind.State.new':
                    var $274 = self.page;
                    var $275 = Web$Kind$draw_page$($274);
                    var $273 = $275;
                    break;
            };
            return $273;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.dom':
                    var $277 = self.name;
                    var $278 = self.id;
                    var $279 = ((console.log((("DOM!! " + $277) + String$nil)), (_x$8 => {
                        var $280 = App$store$(Web$Kind$exe_event$(_state$4, $278, $277));
                        return $280;
                    })()));
                    var $276 = $279;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                    var $281 = App$pass;
                    var $276 = $281;
                    break;
            };
            return $276;
        });
        var $272 = App$new$(_init$1, _draw$2, _when$3);
        return $272;
    })();
    return {
        'Web.Kind.State.new': Web$Kind$State$new,
        'Pair.new': Pair$new,
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
        'Web.Kind.Page.apps': Web$Kind$Page$apps,
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
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'Web.Kind.constant.p_tag_size': Web$Kind$constant$p_tag_size,
        'DOM.text': DOM$text,
        'Web.Kind.img.croni': Web$Kind$img$croni,
        'Web.Kind.constant.secondary_color': Web$Kind$constant$secondary_color,
        'Web.Kind.component.btn_primary_solid': Web$Kind$component$btn_primary_solid,
        'Web.Kind.constant.action_go_to_apps': Web$Kind$constant$action_go_to_apps,
        'Web.Kind.component.title': Web$Kind$component$title,
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'Web.Kind.constant.primary_color': Web$Kind$constant$primary_color,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.repeat': String$repeat,
        'Web.Kind.component.header_tab': Web$Kind$component$header_tab,
        'Bool.and': Bool$and,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kind.helper.is_current': Web$Kind$helper$is_current,
        'Web.Kind.constant.action_go_to_home': Web$Kind$constant$action_go_to_home,
        'Web.Kind.component.header_tabs': Web$Kind$component$header_tabs,
        'Web.Kind.component.header': Web$Kind$component$header,
        'Web.Kind.Page.home': Web$Kind$Page$home,
        'Web.Kind.component.body_container': Web$Kind$component$body_container,
        'List.for': List$for,
        'List': List,
        'Web.Kind.component.list': Web$Kind$component$list,
        'Web.Kind.component.link_white': Web$Kind$component$link_white,
        'Web.Kind.constant.dark_pri_color': Web$Kind$constant$dark_pri_color,
        'Web.Kind.component.footer': Web$Kind$component$footer,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'Web.Kind.component.game_card': Web$Kind$component$game_card,
        'Web.Kind.img.banner_template': Web$Kind$img$banner_template,
        'Web.Kind.content_apps': Web$Kind$content_apps,
        'Web.Kind.draw_page_apps': Web$Kind$draw_page_apps,
        'Web.Kind.draw_page': Web$Kind$draw_page,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Debug.log': Debug$log,
        'App.store': App$store,
        'Web.Kind.exe_event': Web$Kind$exe_event,
        'App.new': App$new,
        'Web.Kind': Web$Kind,
    };
})();