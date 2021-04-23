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

    function Web$Kind$State$new$(_screen_size$1, _page$2, _mouse_over$3) {
        var $33 = ({
            _: 'Web.Kind.State.new',
            'screen_size': _screen_size$1,
            'page': _page$2,
            'mouse_over': _mouse_over$3
        });
        return $33;
    };
    const Web$Kind$State$new = x0 => x1 => x2 => Web$Kind$State$new$(x0, x1, x2);

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
    const Web$Kind$Page$home = ({
        _: 'Web.Kind.Page.home'
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

    function String$cons$(_head$1, _tail$2) {
        var $184 = (String.fromCharCode(_head$1) + _tail$2);
        return $184;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Web$Kind$constant$primary_color = "#71558C";
<<<<<<< HEAD
    const Web$Kind$constant$light_gray_color = "#D3D3D3";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $186 = self.val;
                var $187 = self.lft;
                var $188 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $190 = self.val;
                        var $191 = self.lft;
                        var $192 = self.rgt;
                        var self = $186;
                        switch (self._) {
                            case 'Maybe.none':
                                var $194 = BitsMap$tie$($190, BitsMap$union$($187, $191), BitsMap$union$($188, $192));
                                var $193 = $194;
                                break;
                            case 'Maybe.some':
                                var $195 = BitsMap$tie$($186, BitsMap$union$($187, $191), BitsMap$union$($188, $192));
                                var $193 = $195;
                                break;
                        };
                        var $189 = $193;
                        break;
                    case 'BitsMap.new':
                        var $196 = _a$2;
                        var $189 = $196;
                        break;
                };
                var $185 = $189;
                break;
            case 'BitsMap.new':
                var $197 = _b$3;
                var $185 = $197;
                break;
        };
        return $185;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $198 = BitsMap$union$(_a$2, _b$3);
        return $198;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);

    function Web$Kind$component$header_tab$(_is_active$1, _is_hover$2, _title$3, _id$4) {
        var _normal$5 = Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("padding-bottom", "4px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))));
        var _active$6 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var _hover$7 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$light_gray_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var $199 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$4), List$nil)), (() => {
            var self = _is_active$1;
            if (self) {
                var $200 = Map$union$(_normal$5, _active$6);
                return $200;
            } else {
                var self = _is_hover$2;
                if (self) {
                    var $202 = Map$union$(_normal$5, _hover$7);
                    var $201 = $202;
                } else {
                    var $203 = _normal$5;
                    var $201 = $203;
                };
                return $201;
            };
        })(), List$cons$(DOM$text$(_title$3), List$nil));
        return $199;
    };
    const Web$Kind$component$header_tab = x0 => x1 => x2 => x3 => Web$Kind$component$header_tab$(x0, x1, x2, x3);

    function Web$Kind$helper$is_eql$(_src$1, _trg$2) {
        var self = _src$1;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var self = _trg$2;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $206 = Bool$true;
                        var $205 = $206;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $207 = Bool$false;
                        var $205 = $207;
                        break;
                };
                var $204 = $205;
                break;
            case 'Web.Kind.Page.apps':
                var self = _trg$2;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $209 = Bool$false;
                        var $208 = $209;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $210 = Bool$true;
                        var $208 = $210;
                        break;
                };
                var $204 = $208;
                break;
        };
        return $204;
=======

    function Web$Kind$component$header_tab$(_is_active$1, _title$2, _id$3) {
        var self = _is_active$1;
        if (self) {
            var $186 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $185 = $186;
        } else {
            var $187 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$3), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("margin-bottom", "2px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $185 = $187;
        };
        return $185;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$helper$is_eql = x0 => x1 => Web$Kind$helper$is_eql$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
<<<<<<< HEAD
                var $212 = Bool$false;
                var $211 = $212;
                break;
            case 'Cmp.eql':
                var $213 = Bool$true;
                var $211 = $213;
                break;
        };
        return $211;
=======
                var $189 = Bool$false;
                var $188 = $189;
                break;
            case 'Cmp.eql':
                var $190 = Bool$true;
                var $188 = $190;
                break;
        };
        return $188;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
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
<<<<<<< HEAD
                var $215 = self.pred;
                var $216 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $218 = self.pred;
                            var $219 = (_a$pred$10 => {
                                var $220 = Word$cmp$go$(_a$pred$10, $218, _c$4);
                                return $220;
                            });
                            var $217 = $219;
                            break;
                        case 'Word.i':
                            var $221 = self.pred;
                            var $222 = (_a$pred$10 => {
                                var $223 = Word$cmp$go$(_a$pred$10, $221, Cmp$ltn);
                                return $223;
                            });
                            var $217 = $222;
                            break;
                        case 'Word.e':
                            var $224 = (_a$pred$8 => {
                                var $225 = _c$4;
                                return $225;
                            });
                            var $217 = $224;
                            break;
                    };
                    var $217 = $217($215);
                    return $217;
                });
                var $214 = $216;
                break;
            case 'Word.i':
                var $226 = self.pred;
                var $227 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $229 = self.pred;
                            var $230 = (_a$pred$10 => {
                                var $231 = Word$cmp$go$(_a$pred$10, $229, Cmp$gtn);
                                return $231;
                            });
                            var $228 = $230;
                            break;
                        case 'Word.i':
                            var $232 = self.pred;
                            var $233 = (_a$pred$10 => {
                                var $234 = Word$cmp$go$(_a$pred$10, $232, _c$4);
                                return $234;
                            });
                            var $228 = $233;
                            break;
                        case 'Word.e':
                            var $235 = (_a$pred$8 => {
                                var $236 = _c$4;
                                return $236;
                            });
                            var $228 = $235;
                            break;
                    };
                    var $228 = $228($226);
                    return $228;
                });
                var $214 = $227;
                break;
            case 'Word.e':
                var $237 = (_b$5 => {
                    var $238 = _c$4;
                    return $238;
                });
                var $214 = $237;
                break;
        };
        var $214 = $214(_b$3);
        return $214;
=======
                var $192 = self.pred;
                var $193 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $195 = self.pred;
                            var $196 = (_a$pred$10 => {
                                var $197 = Word$cmp$go$(_a$pred$10, $195, _c$4);
                                return $197;
                            });
                            var $194 = $196;
                            break;
                        case 'Word.i':
                            var $198 = self.pred;
                            var $199 = (_a$pred$10 => {
                                var $200 = Word$cmp$go$(_a$pred$10, $198, Cmp$ltn);
                                return $200;
                            });
                            var $194 = $199;
                            break;
                        case 'Word.e':
                            var $201 = (_a$pred$8 => {
                                var $202 = _c$4;
                                return $202;
                            });
                            var $194 = $201;
                            break;
                    };
                    var $194 = $194($192);
                    return $194;
                });
                var $191 = $193;
                break;
            case 'Word.i':
                var $203 = self.pred;
                var $204 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $206 = self.pred;
                            var $207 = (_a$pred$10 => {
                                var $208 = Word$cmp$go$(_a$pred$10, $206, Cmp$gtn);
                                return $208;
                            });
                            var $205 = $207;
                            break;
                        case 'Word.i':
                            var $209 = self.pred;
                            var $210 = (_a$pred$10 => {
                                var $211 = Word$cmp$go$(_a$pred$10, $209, _c$4);
                                return $211;
                            });
                            var $205 = $210;
                            break;
                        case 'Word.e':
                            var $212 = (_a$pred$8 => {
                                var $213 = _c$4;
                                return $213;
                            });
                            var $205 = $212;
                            break;
                    };
                    var $205 = $205($203);
                    return $205;
                });
                var $191 = $204;
                break;
            case 'Word.e':
                var $214 = (_b$5 => {
                    var $215 = _c$4;
                    return $215;
                });
                var $191 = $214;
                break;
        };
        var $191 = $191(_b$3);
        return $191;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
<<<<<<< HEAD
        var $239 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $239;
=======
        var $216 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $216;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
<<<<<<< HEAD
        var $240 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $240;
=======
        var $217 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $217;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
    });

    function Web$Kind$component$header_tabs$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
<<<<<<< HEAD
            case 'Web.Kind.State.new':
                var $242 = self.page;
                var $243 = self.mouse_over;
                var _tabs$5 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_eql$(Web$Kind$Page$home, $242), ("tab_home" === $243), "Home", "tab_home"), List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_eql$(Web$Kind$Page$apps, $242), ("tab_apps" === $243), "Apps", "tab_apps"), List$nil));
                var $244 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), _tabs$5);
                var $241 = $244;
                break;
        };
        return $241;
=======
            case 'Web.Kind.Page.home':
                var $219 = (_title$1 === "Home");
                var $218 = $219;
                break;
            case 'Web.Kind.Page.apps':
                var $220 = (_title$1 === "Apps");
                var $218 = $220;
                break;
        };
        return $218;
    };
    const Web$Kind$helper$is_current = x0 => x1 => Web$Kind$helper$is_current$(x0, x1);
    const Web$Kind$constant$action_go_to_home = "action_go_to_home";

    function Web$Kind$component$header_tabs$(_page$1) {
        var _tabs$2 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$("Home", _page$1), "Home", Web$Kind$constant$action_go_to_home), List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$("Apps", _page$1), "Apps", Web$Kind$constant$action_go_to_apps), List$nil));
        var $221 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), _tabs$2);
        return $221;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$header_tabs = x0 => Web$Kind$component$header_tabs$(x0);

    function Web$Kind$component$header$(_stt$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "auto"), List$cons$(Pair$new$("max-width", "65em"), List$nil))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "4px"), List$cons$(Pair$new$("border-top", (Web$Kind$constant$primary_color + " dashed 1px")), List$cons$(Pair$new$("border-bottom", (Web$Kind$constant$primary_color + " dashed 1px")), List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("margin-bottom", "1em"), List$cons$(Pair$new$("margin-left", "15%"), List$cons$(Pair$new$("margin-right", "15%"), List$nil)))))))), List$nil), List$nil));
<<<<<<< HEAD
        var $245 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_stt$1), List$nil))));
        return $245;
=======
        var $222 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_page$1), List$nil))));
        return $222;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);

    function Web$Kind$component$body_container$(_ele$1) {
<<<<<<< HEAD
        var $246 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 40px 20%"), List$cons$(Pair$new$("flex", "1"), List$nil))), _ele$1);
        return $246;
=======
        var $223 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 40px 20%"), List$cons$(Pair$new$("flex", "1"), List$nil))), _ele$1);
        return $223;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$body_container = x0 => Web$Kind$component$body_container$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
<<<<<<< HEAD
        var $247 = null;
        return $247;
=======
        var $224 = null;
        return $224;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const List = x0 => List$(x0);

    function Web$Kind$component$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
<<<<<<< HEAD
            var $250 = _li$2;
            var $251 = _items$1;
            let _li$4 = $250;
            let _item$3;
            while ($251._ === 'List.cons') {
                _item$3 = $251.head;
                var $250 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $250;
                $251 = $251.tail;
            }
            return _li$4;
        })();
        var $248 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $248;
=======
            var $227 = _li$2;
            var $228 = _items$1;
            let _li$4 = $227;
            let _item$3;
            while ($228._ === 'List.cons') {
                _item$3 = $228.head;
                var $227 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $227;
                $228 = $228.tail;
            }
            return _li$4;
        })();
        var $225 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $225;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$list = x0 => Web$Kind$component$list$(x0);

    function Web$Kind$component$link_white$(_txt$1, _href$2) {
<<<<<<< HEAD
        var $252 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $252;
=======
        var $229 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $229;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$link_white = x0 => x1 => Web$Kind$component$link_white$(x0, x1);
    const Web$Kind$constant$dark_pri_color = "#44366B";
    const Web$Kind$component$footer = (() => {
        var _join_us_txt$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(Web$Kind$component$list$(List$cons$(Web$Kind$component$link_white$(" Github", "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$component$link_white$(" Telegram", "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "110px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$primary_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("padding-right", "20%"), List$nil))))))))), List$cons$(_join_us_txt$1, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "20px"), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _msg_footer$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("background-color", Web$Kind$constant$dark_pri_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10px 20% 10px 20%"), List$nil))))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(Web$Kind$component$link_white$("*u* show me the code!", "https://github.com/uwu-tech/Kind/blob/master/base/Web/Kind.kind"), List$nil)));
<<<<<<< HEAD
        var $253 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "0px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil))))), List$cons$(_join_us$1, List$cons$(_msg_footer$2, List$nil)));
        return $253;
=======
        var $230 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "0px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil))))), List$cons$(_join_us$1, List$cons$(_msg_footer$2, List$nil)));
        return $230;
    })();
    const Web$Kind$draw_page_home = (() => {
        var _line$1 = (_txt$1 => {
            var $232 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $232;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $233 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $233;
        });
        var _span_bold$4 = (_txt$4 => {
            var $234 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $234;
        });
        var _intro$5 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(_span$3("Kind is a cute "), List$cons$(_span_bold$4("proof"), List$cons$(_span$3("gramming language."), List$cons$(_line_break$2, List$cons$(_span$3("It\'s "), List$cons$(_span_bold$4("capable of everything"), List$cons$(_line$1("from web apps to games to"), List$cons$(_line$1("advanced mathematical proofs."), List$nil)))))))));
        var _croni$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "40px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("gl hf!"), List$nil)), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", Web$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "30px"), List$cons$(Pair$new$("height", "30px"), List$nil))), List$nil), List$nil)));
        var _call_to_apps$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "100px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(Web$Kind$component$btn_primary_solid$("GO TO APPS", Web$Kind$constant$action_go_to_apps), List$cons$(_croni$6, List$nil)));
        var _instructions$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$1("npm i -g kind-lang"), List$cons$(_line$1("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$1("cd Kind/base"), List$cons$(_line$1("kind Main"), List$cons$(_line$1("kind Main --run"), List$nil))))));
        var _install$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$7, List$nil)));
        var $231 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-home"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$home), List$cons$(Web$Kind$component$body_container$(List$cons$(_intro$5, List$cons$(_call_to_apps$6, List$cons$(_install$7, List$nil)))), List$cons$(Web$Kind$component$footer, List$nil))));
        return $231;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    })();

    function Web$Kind$draw_page_home$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var _line$5 = (_txt$5 => {
                    var $256 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$5), List$nil));
                    return $256;
                });
                var _line_break$6 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
                var _span$7 = (_txt$7 => {
                    var $257 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$7), List$nil));
                    return $257;
                });
                var _span_bold$8 = (_txt$8 => {
                    var $258 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$8), List$nil));
                    return $258;
                });
                var _intro$9 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(_span$7("Kind is a cute "), List$cons$(_span_bold$8("proof"), List$cons$(_span$7("gramming language."), List$cons$(_line_break$6, List$cons$(_span$7("It\'s "), List$cons$(_span_bold$8("capable of everything"), List$cons$(_line$5("from web apps to games to"), List$cons$(_line$5("advanced mathematical proofs."), List$nil)))))))));
                var _croni$10 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "40px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("gl hf!"), List$nil)), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", Web$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "30px"), List$cons$(Pair$new$("height", "30px"), List$nil))), List$nil), List$nil)));
                var _call_to_apps$10 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "100px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(Web$Kind$component$btn_primary_solid$("GO TO APPS", "btn_pri_home_go_to_apps"), List$cons$(_croni$10, List$nil)));
                var _instructions$11 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$5("npm i -g kind-lang"), List$cons$(_line$5("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$5("cd Kind/base"), List$cons$(_line$5("kind Main"), List$cons$(_line$5("kind Main --run"), List$nil))))));
                var _install$11 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$11, List$nil)));
                var $255 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-home"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(_stt$1), List$cons$(Web$Kind$component$body_container$(List$cons$(_intro$9, List$cons$(_call_to_apps$10, List$cons$(_install$11, List$nil)))), List$cons$(Web$Kind$component$footer, List$nil))));
                var $254 = $255;
                break;
        };
        return $254;
    };
    const Web$Kind$draw_page_home = x0 => Web$Kind$draw_page_home$(x0);

    function Web$Kind$component$game_card$(_src$1, _title$2, _path$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var _title$5 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _path$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("text-decoration", "none"), List$nil))))), List$cons$(DOM$text$(_title$2), List$nil));
<<<<<<< HEAD
        var $259 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))))), List$cons$(_banner$4, List$cons$(_title$5, List$nil)));
        return $259;
=======
        var $235 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))))), List$cons$(_banner$4, List$cons$(_title$5, List$nil)));
        return $235;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$component$game_card = x0 => x1 => x2 => Web$Kind$component$game_card$(x0, x1, x2);
    const Web$Kind$img$app_senhas = "data:image/png;base64,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";
    const Web$Kind$img$app_tic_tac_toe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAdlJREFUeJztm01uglAURrFxRyylm2nSQdNBk27GpbgmHDBpFHnvwH0/lXNmTu41hw9FPjxN0zRIHm+t38B/QlkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBTiHT/z5+v378vP7I3xFq9UmC5BO1mUccwa9X6+b30TpFZnzkytMFiD3M2tFef5xa7tiPTU5K0wWIDdZs/i7gxOVqWordo41WYB0suZDvXIo9nwPVlsRMjb+onQDyZNi8QwtsddLhzC6SNbM4lFNnqFRu7x0CIYlq9AXeYXhIfNNFiDg585+ig4PnG+yAMoCnJ79HeXuruPRWLzLarIAygIoC6AswNMP+M1YhckwKAuhLICyAO0b6ai6uMIKkwXopZHeXxdXWGGyAB010uu7SqygmCxAF4106YFRizrqDevzCo30ZRxL12LbOGiybKSL00sj/Tg5fJeNdFXaN9IVLhRspBugLICyAMoC+KzDMj7rsBdlAZQFUBbAZx0AJgtgyQrmmyyAJSuYb7IAlqwAkwXosWStwLZT5KBVmKdhcXpMVv0Kw0uHePotWTtcYbIAlqwAkwVQFiD+TukLY7IAygIoC6AsgLIANxbY0ByDNCtkAAAAAElFTkSuQmCC";
    const Web$Kind$img$app_kaelin = "data:image/png;base64,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";
    const Web$Kind$content_apps = List$cons$(Web$Kind$component$game_card$(Web$Kind$img$app_senhas, "Senhas", "Web.Senhas"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$app_tic_tac_toe, "TicTacToe", "Web.TicTacToe"), List$cons$(Web$Kind$component$game_card$(Web$Kind$img$app_kaelin, "Kaelin", "Web.Kaelin"), List$nil)));

    function Web$Kind$component$link_black$(_txt$1, _href$2) {
<<<<<<< HEAD
        var $260 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $260;
    };
    const Web$Kind$component$link_black = x0 => x1 => Web$Kind$component$link_black$(x0, x1);
    const Web$Kind$content_apps_text = Web$Kind$component$list$(List$cons$(Web$Kind$component$link_black$("Demo", "Web.Demo"), List$cons$(Web$Kind$component$link_black$("Online", "Web.Online"), List$nil)));

    function Web$Kind$draw_page_apps$(_stt$1) {
        var _line$2 = (_txt$2 => {
            var $262 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$2), List$nil));
            return $262;
        });
        var _line_break$3 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$4 = (_txt$4 => {
            var $263 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$4), List$nil));
            return $263;
        });
        var _span_bold$5 = (_txt$5 => {
            var $264 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$5), List$nil));
            return $264;
        });
        var _with_banner$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), Web$Kind$content_apps);
        var _no_banner$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "30px"), List$nil)), List$cons$(Web$Kind$content_apps_text, List$nil));
        var _games$6 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$component$title$("Games"), List$cons$(_with_banner$6, List$cons$(_no_banner$7, List$nil))));
        var $261 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-apps"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(_stt$1), List$cons$(Web$Kind$component$body_container$(List$cons$(_games$6, List$nil)), List$cons$(Web$Kind$component$footer, List$nil))));
        return $261;
    };
    const Web$Kind$draw_page_apps = x0 => Web$Kind$draw_page_apps$(x0);
=======
        var $236 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $236;
    };
    const Web$Kind$component$link_black = x0 => x1 => Web$Kind$component$link_black$(x0, x1);
    const Web$Kind$content_apps_text = Web$Kind$component$list$(List$cons$(Web$Kind$component$link_black$("Demo", "Web.Demo"), List$cons$(Web$Kind$component$link_black$("Online", "Web.Online"), List$nil)));
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
    });
    const Web$Kind$draw_page_apps = (() => {
        var _line$1 = (_txt$1 => {
            var $238 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $238;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $239 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $239;
        });
        var _span_bold$4 = (_txt$4 => {
            var $240 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $240;
        });
        var _with_banner$5 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), Web$Kind$content_apps);
        var _no_banner$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "30px"), List$nil)), List$cons$(Web$Kind$content_apps_text, List$nil));
        var _games$5 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$component$title$("Games"), List$cons$(_with_banner$5, List$cons$(_no_banner$6, List$nil))));
        var $237 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-apps"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$apps), List$cons$(Web$Kind$component$body_container$(List$cons$(_games$5, List$nil)), List$cons$(Web$Kind$component$footer, List$nil))));
        return $237;
    })();
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a

    function Web$Kind$draw_page$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
<<<<<<< HEAD
            case 'Web.Kind.State.new':
                var $266 = self.page;
                var self = $266;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $268 = Web$Kind$draw_page_home$(_stt$1);
                        var $267 = $268;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $269 = Web$Kind$draw_page_apps$(_stt$1);
                        var $267 = $269;
                        break;
                };
                var $265 = $267;
                break;
        };
        return $265;
=======
            case 'Web.Kind.Page.home':
                var $242 = Web$Kind$draw_page_home;
                var $241 = $242;
                break;
            case 'Web.Kind.Page.apps':
                var $243 = Web$Kind$draw_page_apps;
                var $241 = $243;
                break;
        };
        return $241;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$draw_page = x0 => Web$Kind$draw_page$(x0);

    function IO$(_A$1) {
<<<<<<< HEAD
        var $270 = null;
        return $270;
=======
        var $244 = null;
        return $244;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
<<<<<<< HEAD
        var $271 = ({
=======
        var $245 = ({
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
<<<<<<< HEAD
        return $271;
=======
        return $245;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
<<<<<<< HEAD
                var $273 = self.value;
                var $274 = _f$4($273);
                var $272 = $274;
                break;
            case 'IO.ask':
                var $275 = self.query;
                var $276 = self.param;
                var $277 = self.then;
                var $278 = IO$ask$($275, $276, (_x$8 => {
                    var $279 = IO$bind$($277(_x$8), _f$4);
                    return $279;
                }));
                var $272 = $278;
                break;
        };
        return $272;
=======
                var $247 = self.value;
                var $248 = _f$4($247);
                var $246 = $248;
                break;
            case 'IO.ask':
                var $249 = self.query;
                var $250 = self.param;
                var $251 = self.then;
                var $252 = IO$ask$($249, $250, (_x$8 => {
                    var $253 = IO$bind$($251(_x$8), _f$4);
                    return $253;
                }));
                var $246 = $252;
                break;
        };
        return $246;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
<<<<<<< HEAD
        var $280 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $280;
=======
        var $254 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $254;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
<<<<<<< HEAD
        var $281 = _new$2(IO$bind)(IO$end);
        return $281;
=======
        var $255 = _new$2(IO$bind)(IO$end);
        return $255;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
<<<<<<< HEAD
        var $282 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $282;
=======
        var $256 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $256;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
<<<<<<< HEAD
        var $283 = _m$pure$2;
        return $283;
    }))(Dynamic$new$(Unit$new));

    function App$store$(_value$2) {
        var $284 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $285 = _m$pure$4;
            return $285;
        }))(Dynamic$new$(_value$2));
        return $284;
=======
        var $257 = _m$pure$2;
        return $257;
    }))(Dynamic$new$(Unit$new));

    function App$store$(_value$2) {
        var $258 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $259 = _m$pure$4;
            return $259;
        }))(Dynamic$new$(_value$2));
        return $258;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kind$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Kind.State.new':
<<<<<<< HEAD
                var $287 = self.screen_size;
                var $288 = self.page;
                var $289 = Web$Kind$State$new$($287, $288, _id$1);
                var $286 = $289;
                break;
        };
        return $286;
    };
    const Web$Kind$set_mouse_over = x0 => x1 => Web$Kind$set_mouse_over$(x0, x1);
    const Web$Kind$Event$go_to_home = ({
        _: 'Web.Kind.Event.go_to_home'
    });
    const Web$Kind$Event$go_to_apps = ({
        _: 'Web.Kind.Event.go_to_apps'
    });
    const Web$Kind$component$id_action = Map$from_list$(List$cons$(Pair$new$("tab_home", Web$Kind$Event$go_to_home), List$cons$(Pair$new$("tab_apps", Web$Kind$Event$go_to_apps), List$cons$(Pair$new$("btn_pri_home_go_to_apps", Web$Kind$Event$go_to_apps), List$nil))));

    function Maybe$(_A$1) {
        var $290 = null;
        return $290;
    };
    const Maybe = x0 => Maybe$(x0);

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
                        var $291 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $293 = self.lft;
                                var $294 = BitsMap$get$($291, $293);
                                var $292 = $294;
                                break;
                            case 'BitsMap.new':
                                var $295 = Maybe$none;
                                var $292 = $295;
                                break;
                        };
                        return $292;
                    case 'i':
                        var $296 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $298 = self.rgt;
                                var $299 = BitsMap$get$($296, $298);
                                var $297 = $299;
                                break;
                            case 'BitsMap.new':
                                var $300 = Maybe$none;
                                var $297 = $300;
                                break;
                        };
                        return $297;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $302 = self.val;
                                var $303 = $302;
                                var $301 = $303;
                                break;
                            case 'BitsMap.new':
                                var $304 = Maybe$none;
                                var $301 = $304;
                                break;
                        };
                        return $301;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $305 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $305;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kind$exe_event$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $307 = self.screen_size;
                var $308 = self.mouse_over;
                var _actions$6 = Web$Kind$component$id_action;
                var self = Map$get$(_id$1, _actions$6);
                switch (self._) {
                    case 'Maybe.some':
                        var $310 = self.value;
                        var self = $310;
                        switch (self._) {
                            case 'Web.Kind.Event.go_to_home':
                                var $312 = Web$Kind$State$new$($307, Web$Kind$Page$home, $308);
                                var $311 = $312;
                                break;
                            case 'Web.Kind.Event.go_to_apps':
                                var $313 = Web$Kind$State$new$($307, Web$Kind$Page$apps, $308);
                                var $311 = $313;
                                break;
                        };
                        var $309 = $311;
                        break;
                    case 'Maybe.none':
                        var $314 = _stt$2;
                        var $309 = $314;
                        break;
                };
                var $306 = $309;
                break;
        };
        return $306;
=======
                var $261 = self.screen_size;
                var $262 = self.page;
                var self = (_e_id$2 === Web$Kind$constant$action_go_to_home);
                if (self) {
                    var $264 = Web$Kind$State$new$($261, Web$Kind$Page$home);
                    var $263 = $264;
                } else {
                    var self = (_e_id$2 === Web$Kind$constant$action_go_to_apps);
                    if (self) {
                        var $266 = Web$Kind$State$new$($261, Web$Kind$Page$apps);
                        var $265 = $266;
                    } else {
                        var $267 = Web$Kind$State$new$($261, $262);
                        var $265 = $267;
                    };
                    var $263 = $265;
                };
                var $260 = $263;
                break;
        };
        return $260;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const Web$Kind$exe_event = x0 => x1 => Web$Kind$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
<<<<<<< HEAD
        var $315 = ({
=======
        var $268 = ({
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
<<<<<<< HEAD
        return $315;
=======
        return $268;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kind = (() => {
        var _init$1 = Web$Kind$State$new$(Pair$new$(500, 400), Web$Kind$Page$home, "");
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.Kind.State.new':
<<<<<<< HEAD
                    var $318 = Web$Kind$draw_page$(_state$2);
                    var $317 = $318;
                    break;
            };
            return $317;
=======
                    var $271 = self.page;
                    var $272 = Web$Kind$draw_page$($271);
                    var $270 = $272;
                    break;
            };
            return $270;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
<<<<<<< HEAD
                case 'App.Event.mouse_over':
                    var $320 = self.id;
                    var $321 = App$store$(Web$Kind$set_mouse_over$($320, _state$4));
                    var $319 = $321;
                    break;
                case 'App.Event.mouse_click':
                    var $322 = self.id;
                    var $323 = App$store$(Web$Kind$exe_event$($322, _state$4));
                    var $319 = $323;
=======
                case 'App.Event.dom':
                    var $274 = self.name;
                    var $275 = self.id;
                    var $276 = App$store$(Web$Kind$exe_event$(_state$4, $275, $274));
                    var $273 = $276;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
<<<<<<< HEAD
                case 'App.Event.mouse_out':
                    var $324 = App$pass;
                    var $319 = $324;
                    break;
            };
            return $319;
        });
        var $316 = App$new$(_init$1, _draw$2, _when$3);
        return $316;
=======
                    var $277 = App$pass;
                    var $273 = $277;
                    break;
            };
            return $273;
        });
        var $269 = App$new$(_init$1, _draw$2, _when$3);
        return $269;
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
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
        'Web.Kind.Page.home': Web$Kind$Page$home,
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
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Web.Kind.constant.primary_color': Web$Kind$constant$primary_color,
<<<<<<< HEAD
        'Web.Kind.constant.light_gray_color': Web$Kind$constant$light_gray_color,
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
=======
>>>>>>> 78e0242f4d50fa945d8b5e00818ed5657b04e16a
        'Web.Kind.component.header_tab': Web$Kind$component$header_tab,
        'Web.Kind.helper.is_eql': Web$Kind$helper$is_eql,
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
        'Web.Kind.Page.apps': Web$Kind$Page$apps,
        'Web.Kind.component.header_tabs': Web$Kind$component$header_tabs,
        'Web.Kind.component.header': Web$Kind$component$header,
        'Web.Kind.component.body_container': Web$Kind$component$body_container,
        'List.for': List$for,
        'List': List,
        'Web.Kind.component.list': Web$Kind$component$list,
        'Web.Kind.component.link_white': Web$Kind$component$link_white,
        'Web.Kind.constant.dark_pri_color': Web$Kind$constant$dark_pri_color,
        'Web.Kind.component.footer': Web$Kind$component$footer,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'Web.Kind.component.game_card': Web$Kind$component$game_card,
        'Web.Kind.img.app_senhas': Web$Kind$img$app_senhas,
        'Web.Kind.img.app_tic_tac_toe': Web$Kind$img$app_tic_tac_toe,
        'Web.Kind.img.app_kaelin': Web$Kind$img$app_kaelin,
        'Web.Kind.content_apps': Web$Kind$content_apps,
        'Web.Kind.component.link_black': Web$Kind$component$link_black,
        'Web.Kind.content_apps_text': Web$Kind$content_apps_text,
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
        'App.store': App$store,
        'Web.Kind.set_mouse_over': Web$Kind$set_mouse_over,
        'Web.Kind.Event.go_to_home': Web$Kind$Event$go_to_home,
        'Web.Kind.Event.go_to_apps': Web$Kind$Event$go_to_apps,
        'Web.Kind.component.id_action': Web$Kind$component$id_action,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kind.exe_event': Web$Kind$exe_event,
        'App.new': App$new,
        'Web.Kind': Web$Kind,
    };
})();