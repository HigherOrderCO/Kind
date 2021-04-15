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
                    var $35 = _x$4;
                    return $35;
                } else {
                    var $36 = (self - 1n);
                    var $37 = Nat$apply$($36, _f$3, _f$3(_x$4));
                    return $37;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function U32$new$(_value$1) {
        var $38 = word_to_u32(_value$1);
        return $38;
    };
    const U32$new = x0 => U32$new$(x0);

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

    function Nat$succ$(_pred$1) {
        var $48 = 1n + _pred$1;
        return $48;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $50 = u32_to_word(self);
                var $51 = U32$new$(Word$inc$($50));
                var $49 = $51;
                break;
        };
        return $49;
    };
    const U32$inc = x0 => U32$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $53 = Word$e;
            var $52 = $53;
        } else {
            var $54 = (self - 1n);
            var $55 = Word$o$(Word$zero$($54));
            var $52 = $55;
        };
        return $52;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U32$zero = U32$new$(Word$zero$(32n));
    const Nat$to_u32 = a0 => (Number(a0));
    const Web$Kind$Page$home = ({
        _: 'Web.Kind.Page.home'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $56 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $56;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $57 = null;
        return $57;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $58 = null;
        return $58;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $59 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $59;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $60 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $60;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $62 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $64 = self.val;
                        var $65 = self.lft;
                        var $66 = self.rgt;
                        var $67 = BitsMap$tie$($64, BitsMap$set$($62, _val$3, $65), $66);
                        var $63 = $67;
                        break;
                    case 'BitsMap.new':
                        var $68 = BitsMap$tie$(Maybe$none, BitsMap$set$($62, _val$3, BitsMap$new), BitsMap$new);
                        var $63 = $68;
                        break;
                };
                var $61 = $63;
                break;
            case 'i':
                var $69 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $71 = self.val;
                        var $72 = self.lft;
                        var $73 = self.rgt;
                        var $74 = BitsMap$tie$($71, $72, BitsMap$set$($69, _val$3, $73));
                        var $70 = $74;
                        break;
                    case 'BitsMap.new':
                        var $75 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($69, _val$3, BitsMap$new));
                        var $70 = $75;
                        break;
                };
                var $61 = $70;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $77 = self.lft;
                        var $78 = self.rgt;
                        var $79 = BitsMap$tie$(Maybe$some$(_val$3), $77, $78);
                        var $76 = $79;
                        break;
                    case 'BitsMap.new':
                        var $80 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $76 = $80;
                        break;
                };
                var $61 = $76;
                break;
        };
        return $61;
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
                var $82 = self.pred;
                var $83 = (Word$to_bits$($82) + '0');
                var $81 = $83;
                break;
            case 'Word.i':
                var $84 = self.pred;
                var $85 = (Word$to_bits$($84) + '1');
                var $81 = $85;
                break;
            case 'Word.e':
                var $86 = Bits$e;
                var $81 = $86;
                break;
        };
        return $81;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $88 = Bits$e;
            var $87 = $88;
        } else {
            var $89 = self.charCodeAt(0);
            var $90 = self.slice(1);
            var $91 = (String$to_bits$($90) + (u16_to_bits($89)));
            var $87 = $91;
        };
        return $87;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $93 = self.head;
                var $94 = self.tail;
                var self = $93;
                switch (self._) {
                    case 'Pair.new':
                        var $96 = self.fst;
                        var $97 = self.snd;
                        var $98 = BitsMap$set$(String$to_bits$($96), $97, Map$from_list$($94));
                        var $95 = $98;
                        break;
                };
                var $92 = $95;
                break;
            case 'List.nil':
                var $99 = BitsMap$new;
                var $92 = $99;
                break;
        };
        return $92;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $100 = null;
        return $100;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $101 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $101;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const Web$Kind$constant$p_tag_size = "16px";

    function DOM$text$(_value$1) {
        var $102 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $102;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Web$Kind$img$croni = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAxhJREFUSIm1lz9IW1EUh79YR0lTxFhsIKZJOigSMBA6NGnrH5yKUHARHCrYIqGDYMeqtKMBp1BqoR0EOzhlFKND7SApFkpopqQhkIY2JUMzuaWDvdf73rvvvSr1DIF73rv3u79z7znnxcPlWMflucdzGcC155sAjE/G5YP9vWPWXj4G8Mif/wUVQDfoRcC2IbSDAiRTcQur+zzAofA0AAO9AUaCIQCKtSqNVl0o4vDDsWHi/p5xLMxNsS1QZ8ValXwha4Dr1IKz4s5QeJqB3oB0OEHPnqdJpuIW5WbrcoJexEaCISYSaaH03GAAg9p/sWKtysbOssH399JZLqUObKu2WKs6gvOFLGvPN8kXstJnvuFOYABKlRz5QpZGqw5Ao1UnX8iysbNsUWXelJpaytigWgsuVXL4vWH83jClSo5Gq27w+b1hLVw19XKNT8YtcFvFR8N9HA33SbjfG5Y+wADXHYE5f80h14EtOef3hu32J6HifJ3gqmrbPL799Zejr9muMJFIA8h7oLP9vWPtBbMLtafZrtguZoaWKjkAWTZ1cLM51upmu2IJc7NdYSg8bQCqFU7AzWE3m12tluVSzUmziXfMpVTUbEtaKa3xig4KEItOAHDzRoJv3z+xuLCOr/uWHNtBAfp91+jpifL2/Qr37j6wQMEm1KJyjQRDhlS5MxXj4+4X2wioJhqGcu6G6Govl1NHisYGmUik5fk6lVHRMHRmBp+rKzmlkQoXa9uBDVAxYWNnmcWFdenvv36VaGzQsLhb81BUW0qmAWpW8urNMwB+/vhtWVS8W6xVLRvY/XwofUszGZZmMhIuDtzytdFo1ZkaTbo2A3We2IQY69JsNTNPMhWnC+iIUDZadfnyQG/ANYRm1QO9AaZGk4wEQxboia/Damae7a0DQDnj1+9WgNPwiIliciQSkQtEIhHD2GzmzZ74Ojx8ep/ZuTG2tw7Escl/Ep3FhXVm58YAePLoBXDalwWkXC4bNiHGcJb3QnU0NijXAlQgaP5JdADUDSRTcUd1wsrlsvarUgfUDtQNuLzjNsd1/h9Ji2BZJdnEIwAAAABJRU5ErkJggg==";
    const Web$Kind$constant$secondary_color = "#3891A6";
    const Web$Kind$component$btn_go_to_apps_solid = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "btn_go_to_apps"), List$nil)), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("width", "120px"), List$cons$(Pair$new$("height", "30px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border-radius", "7px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))))))))), List$cons$(DOM$text$("GO TO APPS"), List$nil));

    function Web$Kind$component$title$(_title$1) {
        var $103 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", "20px"), List$cons$(Pair$new$("font-family", "Helvetica"), List$cons$(Pair$new$("font-weight", "bold"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $103;
    };
    const Web$Kind$component$title = x0 => Web$Kind$component$title$(x0);

    function Buffer32$new$(_depth$1, _array$2) {
        var $104 = u32array_to_buffer32(_array$2);
        return $104;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $105 = null;
        return $105;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $106 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $106;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $107 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $107;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $109 = Array$tip$(_x$3);
            var $108 = $109;
        } else {
            var $110 = (self - 1n);
            var _half$5 = Array$alloc$($110, _x$3);
            var $111 = Array$tie$(_half$5, _half$5);
            var $108 = $111;
        };
        return $108;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $113 = Bool$false;
                var $112 = $113;
                break;
            case 'Cmp.eql':
                var $114 = Bool$true;
                var $112 = $114;
                break;
        };
        return $112;
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
                var $116 = self.pred;
                var $117 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $119 = self.pred;
                            var $120 = (_a$pred$10 => {
                                var $121 = Word$cmp$go$(_a$pred$10, $119, _c$4);
                                return $121;
                            });
                            var $118 = $120;
                            break;
                        case 'Word.i':
                            var $122 = self.pred;
                            var $123 = (_a$pred$10 => {
                                var $124 = Word$cmp$go$(_a$pred$10, $122, Cmp$ltn);
                                return $124;
                            });
                            var $118 = $123;
                            break;
                        case 'Word.e':
                            var $125 = (_a$pred$8 => {
                                var $126 = _c$4;
                                return $126;
                            });
                            var $118 = $125;
                            break;
                    };
                    var $118 = $118($116);
                    return $118;
                });
                var $115 = $117;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $130 = self.pred;
                            var $131 = (_a$pred$10 => {
                                var $132 = Word$cmp$go$(_a$pred$10, $130, Cmp$gtn);
                                return $132;
                            });
                            var $129 = $131;
                            break;
                        case 'Word.i':
                            var $133 = self.pred;
                            var $134 = (_a$pred$10 => {
                                var $135 = Word$cmp$go$(_a$pred$10, $133, _c$4);
                                return $135;
                            });
                            var $129 = $134;
                            break;
                        case 'Word.e':
                            var $136 = (_a$pred$8 => {
                                var $137 = _c$4;
                                return $137;
                            });
                            var $129 = $136;
                            break;
                    };
                    var $129 = $129($127);
                    return $129;
                });
                var $115 = $128;
                break;
            case 'Word.e':
                var $138 = (_b$5 => {
                    var $139 = _c$4;
                    return $139;
                });
                var $115 = $138;
                break;
        };
        var $115 = $115(_b$3);
        return $115;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $140 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $140;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $141 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $141;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $143 = 0n;
            var $142 = $143;
        } else {
            var $144 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $142 = $144;
        };
        return $142;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $146 = self.pred;
                var $147 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $149 = self.pred;
                            var $150 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $152 = Word$i$(Word$subber$(_a$pred$10, $149, Bool$true));
                                    var $151 = $152;
                                } else {
                                    var $153 = Word$o$(Word$subber$(_a$pred$10, $149, Bool$false));
                                    var $151 = $153;
                                };
                                return $151;
                            });
                            var $148 = $150;
                            break;
                        case 'Word.i':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $157 = Word$o$(Word$subber$(_a$pred$10, $154, Bool$true));
                                    var $156 = $157;
                                } else {
                                    var $158 = Word$i$(Word$subber$(_a$pred$10, $154, Bool$true));
                                    var $156 = $158;
                                };
                                return $156;
                            });
                            var $148 = $155;
                            break;
                        case 'Word.e':
                            var $159 = (_a$pred$8 => {
                                var $160 = Word$e;
                                return $160;
                            });
                            var $148 = $159;
                            break;
                    };
                    var $148 = $148($146);
                    return $148;
                });
                var $145 = $147;
                break;
            case 'Word.i':
                var $161 = self.pred;
                var $162 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $164 = self.pred;
                            var $165 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $167 = Word$o$(Word$subber$(_a$pred$10, $164, Bool$false));
                                    var $166 = $167;
                                } else {
                                    var $168 = Word$i$(Word$subber$(_a$pred$10, $164, Bool$false));
                                    var $166 = $168;
                                };
                                return $166;
                            });
                            var $163 = $165;
                            break;
                        case 'Word.i':
                            var $169 = self.pred;
                            var $170 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $172 = Word$i$(Word$subber$(_a$pred$10, $169, Bool$true));
                                    var $171 = $172;
                                } else {
                                    var $173 = Word$o$(Word$subber$(_a$pred$10, $169, Bool$false));
                                    var $171 = $173;
                                };
                                return $171;
                            });
                            var $163 = $170;
                            break;
                        case 'Word.e':
                            var $174 = (_a$pred$8 => {
                                var $175 = Word$e;
                                return $175;
                            });
                            var $163 = $174;
                            break;
                    };
                    var $163 = $163($161);
                    return $163;
                });
                var $145 = $162;
                break;
            case 'Word.e':
                var $176 = (_b$5 => {
                    var $177 = Word$e;
                    return $177;
                });
                var $145 = $176;
                break;
        };
        var $145 = $145(_b$3);
        return $145;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $178 = Word$subber$(_a$2, _b$3, Bool$false);
        return $178;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $179 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $179;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $181 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $183 = Word$i$(Word$shift_left1$aux$($181, Bool$false));
                    var $182 = $183;
                } else {
                    var $184 = Word$o$(Word$shift_left1$aux$($181, Bool$false));
                    var $182 = $184;
                };
                var $180 = $182;
                break;
            case 'Word.i':
                var $185 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $187 = Word$i$(Word$shift_left1$aux$($185, Bool$true));
                    var $186 = $187;
                } else {
                    var $188 = Word$o$(Word$shift_left1$aux$($185, Bool$true));
                    var $186 = $188;
                };
                var $180 = $186;
                break;
            case 'Word.e':
                var $189 = Word$e;
                var $180 = $189;
                break;
        };
        return $180;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $191 = self.pred;
                var $192 = Word$o$(Word$shift_left1$aux$($191, Bool$false));
                var $190 = $192;
                break;
            case 'Word.i':
                var $193 = self.pred;
                var $194 = Word$o$(Word$shift_left1$aux$($193, Bool$true));
                var $190 = $194;
                break;
            case 'Word.e':
                var $195 = Word$e;
                var $190 = $195;
                break;
        };
        return $190;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $197 = self.pred;
                var $198 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $200 = self.pred;
                            var $201 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $203 = Word$i$(Word$adder$(_a$pred$10, $200, Bool$false));
                                    var $202 = $203;
                                } else {
                                    var $204 = Word$o$(Word$adder$(_a$pred$10, $200, Bool$false));
                                    var $202 = $204;
                                };
                                return $202;
                            });
                            var $199 = $201;
                            break;
                        case 'Word.i':
                            var $205 = self.pred;
                            var $206 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $208 = Word$o$(Word$adder$(_a$pred$10, $205, Bool$true));
                                    var $207 = $208;
                                } else {
                                    var $209 = Word$i$(Word$adder$(_a$pred$10, $205, Bool$false));
                                    var $207 = $209;
                                };
                                return $207;
                            });
                            var $199 = $206;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$8 => {
                                var $211 = Word$e;
                                return $211;
                            });
                            var $199 = $210;
                            break;
                    };
                    var $199 = $199($197);
                    return $199;
                });
                var $196 = $198;
                break;
            case 'Word.i':
                var $212 = self.pred;
                var $213 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $215 = self.pred;
                            var $216 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $218 = Word$o$(Word$adder$(_a$pred$10, $215, Bool$true));
                                    var $217 = $218;
                                } else {
                                    var $219 = Word$i$(Word$adder$(_a$pred$10, $215, Bool$false));
                                    var $217 = $219;
                                };
                                return $217;
                            });
                            var $214 = $216;
                            break;
                        case 'Word.i':
                            var $220 = self.pred;
                            var $221 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $223 = Word$i$(Word$adder$(_a$pred$10, $220, Bool$true));
                                    var $222 = $223;
                                } else {
                                    var $224 = Word$o$(Word$adder$(_a$pred$10, $220, Bool$true));
                                    var $222 = $224;
                                };
                                return $222;
                            });
                            var $214 = $221;
                            break;
                        case 'Word.e':
                            var $225 = (_a$pred$8 => {
                                var $226 = Word$e;
                                return $226;
                            });
                            var $214 = $225;
                            break;
                    };
                    var $214 = $214($212);
                    return $214;
                });
                var $196 = $213;
                break;
            case 'Word.e':
                var $227 = (_b$5 => {
                    var $228 = Word$e;
                    return $228;
                });
                var $196 = $227;
                break;
        };
        var $196 = $196(_b$3);
        return $196;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $229 = Word$adder$(_a$2, _b$3, Bool$false);
        return $229;
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
                        var $230 = self.pred;
                        var $231 = Word$mul$go$($230, Word$shift_left1$(_b$4), _acc$5);
                        return $231;
                    case 'Word.i':
                        var $232 = self.pred;
                        var $233 = Word$mul$go$($232, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $233;
                    case 'Word.e':
                        var $234 = _acc$5;
                        return $234;
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
                var $236 = self.pred;
                var $237 = Word$o$(Word$to_zero$($236));
                var $235 = $237;
                break;
            case 'Word.i':
                var $238 = self.pred;
                var $239 = Word$o$(Word$to_zero$($238));
                var $235 = $239;
                break;
            case 'Word.e':
                var $240 = Word$e;
                var $235 = $240;
                break;
        };
        return $235;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $241 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $241;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $242 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $242;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $243 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $243;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kind$constant$primary_color = "#71558C";
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $244 = (String.fromCharCode(_head$1) + _tail$2);
        return $244;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $246 = String$nil;
            var $245 = $246;
        } else {
            var $247 = (self - 1n);
            var $248 = (_xs$1 + String$repeat$(_xs$1, $247));
            var $245 = $248;
        };
        return $245;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $249 = null;
        return $249;
    };
    const List = x0 => List$(x0);

    function Web$Kind$component$header_tab$(_is_active$1, _title$2) {
        var self = _is_active$1;
        if (self) {
            var $251 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "80px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $250 = $251;
        } else {
            var $252 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "10px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "80px"), List$cons$(Pair$new$("margin-bottom", "2px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $250 = $252;
        };
        return $250;
    };
    const Web$Kind$component$header_tab = x0 => x1 => Web$Kind$component$header_tab$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kind$helper$is_current$(_title$1, _page$2) {
        var self = _page$2;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var $254 = (_title$1 === "Home");
                var $253 = $254;
                break;
            case 'Web.Kind.Page.apps':
                var $255 = (_title$1 === "Apps");
                var $253 = $255;
                break;
        };
        return $253;
    };
    const Web$Kind$helper$is_current = x0 => x1 => Web$Kind$helper$is_current$(x0, x1);

    function Web$Kind$component$header_tabs$(_page$1) {
        var _titles$2 = List$cons$("Apps", List$cons$("Home", List$nil));
        var _tabs$3 = List$nil;
        var _tabs$4 = (() => {
            var $258 = _tabs$3;
            var $259 = _titles$2;
            let _tabs$5 = $258;
            let _title$4;
            while ($259._ === 'List.cons') {
                _title$4 = $259.head;
                var $258 = List$cons$(Web$Kind$component$header_tab$(Web$Kind$helper$is_current$(_title$4, _page$1), _title$4), _tabs$5);
                _tabs$5 = $258;
                $259 = $259.tail;
            }
            return _tabs$5;
        })();
        var $256 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), _tabs$4);
        return $256;
    };
    const Web$Kind$component$header_tabs = x0 => Web$Kind$component$header_tabs$(x0);

    function Web$Kind$component$header$(_page$1) {
        var _vbox$2 = VoxBox$alloc_capacity$(100);
        var _line$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("padding", "10px 50px 10px 50px"), List$nil))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("color", Web$Kind$constant$primary_color), List$nil)), List$cons$(DOM$text$(String$repeat$("=", 90n)), List$nil)), List$nil));
        var $260 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("h2", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "40px"), List$cons$(Pair$new$("font-family", "verdana"), List$cons$(Pair$new$("text-align", "center"), List$nil)))), List$cons$(DOM$text$("KIND language"), List$nil)), List$cons$(_line$3, List$cons$(Web$Kind$component$header_tabs$(_page$1), List$nil))));
        return $260;
    };
    const Web$Kind$component$header = x0 => Web$Kind$component$header$(x0);

    function Web$Kind$component$body_container$(_ele$1) {
        var $261 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "40px 20% 40px 20%"), List$cons$(Pair$new$("flex", "1"), List$nil))), _ele$1);
        return $261;
    };
    const Web$Kind$component$body_container = x0 => Web$Kind$component$body_container$(x0);

    function Web$Kind$component$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $264 = _li$2;
            var $265 = _items$1;
            let _li$4 = $264;
            let _item$3;
            while ($265._ === 'List.cons') {
                _item$3 = $265.head;
                var $264 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "5px"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $264;
                $265 = $265.tail;
            }
            return _li$4;
        })();
        var $262 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $262;
    };
    const Web$Kind$component$list = x0 => Web$Kind$component$list$(x0);

    function Web$Kind$component$link_white$(_txt$1, _href$2) {
        var $266 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $266;
    };
    const Web$Kind$component$link_white = x0 => x1 => Web$Kind$component$link_white$(x0, x1);
    const Web$Kind$constant$dark_pri_color = "#44366B";
    const Web$Kind$component$footer = (() => {
        var _join_us_txt$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(Web$Kind$component$list$(List$cons$(Web$Kind$component$link_white$(" Github", "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$component$link_white$(" Telegram", "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$1 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "110px"), List$cons$(Pair$new$("background-color", Web$Kind$constant$primary_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$cons$(Pair$new$("padding-left", "20%"), List$cons$(Pair$new$("padding-right", "20%"), List$nil))))))))), List$cons$(_join_us_txt$1, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "20px"), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _msg_footer$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("background-color", Web$Kind$constant$dark_pri_color), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10px 20% 10px 20%"), List$nil))))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(Web$Kind$component$link_white$("\u{1f9d0}\u{ddd0} show me the code!", "https://github.com/uwu-tech/Kind/tree/master/base/Web/Kind"), List$nil)));
        var $267 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "170px"), List$cons$(Pair$new$("margin-bottom", "0px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil)))))), List$cons$(_join_us$1, List$cons$(_msg_footer$2, List$nil)));
        return $267;
    })();
    const Web$Kind$draw_page_home = (() => {
        var _line$1 = (_txt$1 => {
            var $269 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $269;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $270 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $270;
        });
        var _span_bold$4 = (_txt$4 => {
            var $271 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $271;
        });
        var _intro$5 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(_span$3("Kind is a cute "), List$cons$(_span_bold$4("proof"), List$cons$(_span$3("gramming language."), List$cons$(_line_break$2, List$cons$(_span$3("It\'s "), List$cons$(_span_bold$4("capable of everything"), List$cons$(_line$1("from web apps to games to advanced"), List$cons$(_line$1("mathematical proofs."), List$nil)))))))));
        var _croni$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "40px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("gl hf!"), List$nil)), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", Web$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "30px"), List$cons$(Pair$new$("height", "30px"), List$nil))), List$nil), List$nil)));
        var _call_to_apps$6 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "100px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(Web$Kind$component$btn_go_to_apps_solid, List$cons$(_croni$6, List$nil)));
        var _instructions$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$cons$(Pair$new$("padding", "5px"), List$cons$(Pair$new$("border", "1px solid"), List$nil)))), List$cons$(_line$1("npm i -g kind-lang"), List$cons$(_line$1("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$1("cd Kind/base"), List$cons$(_line$1("kind Main"), List$cons$(_line$1("kind Main --run"), List$nil))))));
        var _install$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "20px 0px 20px 0px"), List$nil)), List$cons$(Web$Kind$component$title$("Install"), List$cons$(_instructions$7, List$nil)));
        var $268 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-home"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$home), List$cons$(Web$Kind$component$body_container$(List$cons$(_intro$5, List$cons$(_call_to_apps$6, List$cons$(_install$7, List$nil)))), List$cons$(Web$Kind$component$footer, List$nil))));
        return $268;
    })();

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $272 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $272;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $274 = self.length;
                var $275 = $274;
                var $273 = $275;
                break;
        };
        return $273;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $277 = Word$e;
            var $276 = $277;
        } else {
            var $278 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $280 = self.pred;
                    var $281 = Word$o$(Word$trim$($278, $280));
                    var $279 = $281;
                    break;
                case 'Word.i':
                    var $282 = self.pred;
                    var $283 = Word$i$(Word$trim$($278, $282));
                    var $279 = $283;
                    break;
                case 'Word.e':
                    var $284 = Word$o$(Word$trim$($278, Word$e));
                    var $279 = $284;
                    break;
            };
            var $276 = $279;
        };
        return $276;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $286 = self.value;
                var $287 = $286;
                var $285 = $287;
                break;
            case 'Array.tie':
                var $288 = Unit$new;
                var $285 = $288;
                break;
        };
        return $285;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $290 = self.lft;
                var $291 = self.rgt;
                var $292 = Pair$new$($290, $291);
                var $289 = $292;
                break;
            case 'Array.tip':
                var $293 = Unit$new;
                var $289 = $293;
                break;
        };
        return $289;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $294 = self.pred;
                        var $295 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $294);
                        return $295;
                    case 'Word.i':
                        var $296 = self.pred;
                        var $297 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $296);
                        return $297;
                    case 'Word.e':
                        var $298 = _nil$3;
                        return $298;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $299 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $301 = self.fst;
                    var $302 = _rec$6($301);
                    var $300 = $302;
                    break;
            };
            return $300;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $304 = self.snd;
                    var $305 = _rec$6($304);
                    var $303 = $305;
                    break;
            };
            return $303;
        }), _idx$3)(_arr$4);
        return $299;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $307 = self.pred;
                var $308 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $310 = self.pred;
                            var $311 = (_a$pred$9 => {
                                var $312 = Word$o$(Word$and$(_a$pred$9, $310));
                                return $312;
                            });
                            var $309 = $311;
                            break;
                        case 'Word.i':
                            var $313 = self.pred;
                            var $314 = (_a$pred$9 => {
                                var $315 = Word$o$(Word$and$(_a$pred$9, $313));
                                return $315;
                            });
                            var $309 = $314;
                            break;
                        case 'Word.e':
                            var $316 = (_a$pred$7 => {
                                var $317 = Word$e;
                                return $317;
                            });
                            var $309 = $316;
                            break;
                    };
                    var $309 = $309($307);
                    return $309;
                });
                var $306 = $308;
                break;
            case 'Word.i':
                var $318 = self.pred;
                var $319 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $321 = self.pred;
                            var $322 = (_a$pred$9 => {
                                var $323 = Word$o$(Word$and$(_a$pred$9, $321));
                                return $323;
                            });
                            var $320 = $322;
                            break;
                        case 'Word.i':
                            var $324 = self.pred;
                            var $325 = (_a$pred$9 => {
                                var $326 = Word$i$(Word$and$(_a$pred$9, $324));
                                return $326;
                            });
                            var $320 = $325;
                            break;
                        case 'Word.e':
                            var $327 = (_a$pred$7 => {
                                var $328 = Word$e;
                                return $328;
                            });
                            var $320 = $327;
                            break;
                    };
                    var $320 = $320($318);
                    return $320;
                });
                var $306 = $319;
                break;
            case 'Word.e':
                var $329 = (_b$4 => {
                    var $330 = Word$e;
                    return $330;
                });
                var $306 = $329;
                break;
        };
        var $306 = $306(_b$3);
        return $306;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $332 = self.pred;
                var $333 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $335 = self.pred;
                            var $336 = (_a$pred$9 => {
                                var $337 = Word$o$(Word$or$(_a$pred$9, $335));
                                return $337;
                            });
                            var $334 = $336;
                            break;
                        case 'Word.i':
                            var $338 = self.pred;
                            var $339 = (_a$pred$9 => {
                                var $340 = Word$i$(Word$or$(_a$pred$9, $338));
                                return $340;
                            });
                            var $334 = $339;
                            break;
                        case 'Word.e':
                            var $341 = (_a$pred$7 => {
                                var $342 = Word$e;
                                return $342;
                            });
                            var $334 = $341;
                            break;
                    };
                    var $334 = $334($332);
                    return $334;
                });
                var $331 = $333;
                break;
            case 'Word.i':
                var $343 = self.pred;
                var $344 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $346 = self.pred;
                            var $347 = (_a$pred$9 => {
                                var $348 = Word$i$(Word$or$(_a$pred$9, $346));
                                return $348;
                            });
                            var $345 = $347;
                            break;
                        case 'Word.i':
                            var $349 = self.pred;
                            var $350 = (_a$pred$9 => {
                                var $351 = Word$i$(Word$or$(_a$pred$9, $349));
                                return $351;
                            });
                            var $345 = $350;
                            break;
                        case 'Word.e':
                            var $352 = (_a$pred$7 => {
                                var $353 = Word$e;
                                return $353;
                            });
                            var $345 = $352;
                            break;
                    };
                    var $345 = $345($343);
                    return $345;
                });
                var $331 = $344;
                break;
            case 'Word.e':
                var $354 = (_b$4 => {
                    var $355 = Word$e;
                    return $355;
                });
                var $331 = $354;
                break;
        };
        var $331 = $331(_b$3);
        return $331;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $356 = Word$foldl$((_arr$6 => {
            var $357 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $357;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $359 = self.fst;
                    var $360 = self.snd;
                    var $361 = Array$tie$(_rec$7($359), $360);
                    var $358 = $361;
                    break;
            };
            return $358;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $363 = self.fst;
                    var $364 = self.snd;
                    var $365 = Array$tie$($363, _rec$7($364));
                    var $362 = $365;
                    break;
            };
            return $362;
        }), _idx$3)(_arr$5);
        return $356;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $366 = Array$mut$(_idx$3, (_x$6 => {
            var $367 = _val$4;
            return $367;
        }), _arr$5);
        return $366;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $369 = self.capacity;
                var $370 = self.buffer;
                var $371 = VoxBox$new$(_length$1, $369, $370);
                var $368 = $371;
                break;
        };
        return $368;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $373 = _img$5;
            var $374 = 0;
            var $375 = _len$6;
            let _img$8 = $373;
            for (let _i$7 = $374; _i$7 < $375; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $373 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $373;
            };
            return _img$8;
        })();
        var $372 = _img$7;
        return $372;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

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
                        var $376 = self.pred;
                        var $377 = Word$bit_length$go$($376, Nat$succ$(_c$3), _n$4);
                        return $377;
                    case 'Word.i':
                        var $378 = self.pred;
                        var $379 = Word$bit_length$go$($378, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $379;
                    case 'Word.e':
                        var $380 = _n$4;
                        return $380;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $381 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $381;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $382 = _value$3;
                    return $382;
                } else {
                    var $383 = (self - 1n);
                    var $384 = Word$shift_left$($383, Word$shift_left1$(_value$3));
                    return $384;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $386 = Bool$false;
                var $385 = $386;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $387 = Bool$true;
                var $385 = $387;
                break;
        };
        return $385;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $388 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $388;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $390 = self.pred;
                var $391 = Word$o$(Word$shift_right1$aux$($390));
                var $389 = $391;
                break;
            case 'Word.i':
                var $392 = self.pred;
                var $393 = Word$i$(Word$shift_right1$aux$($392));
                var $389 = $393;
                break;
            case 'Word.e':
                var $394 = Word$o$(Word$e);
                var $389 = $394;
                break;
        };
        return $389;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $396 = self.pred;
                var $397 = Word$shift_right1$aux$($396);
                var $395 = $397;
                break;
            case 'Word.i':
                var $398 = self.pred;
                var $399 = Word$shift_right1$aux$($398);
                var $395 = $399;
                break;
            case 'Word.e':
                var $400 = Word$e;
                var $395 = $400;
                break;
        };
        return $395;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $401 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $401;
                } else {
                    var $402 = Pair$new$(Bool$false, _value$5);
                    var self = $402;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $403 = self.fst;
                        var $404 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $406 = $404;
                            var $405 = $406;
                        } else {
                            var $407 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $403;
                            if (self) {
                                var $409 = Word$div$go$($407, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $404);
                                var $408 = $409;
                            } else {
                                var $410 = Word$div$go$($407, _sub_copy$3, _new_shift_copy$9, $404);
                                var $408 = $410;
                            };
                            var $405 = $408;
                        };
                        return $405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $412 = Word$to_zero$(_a$2);
            var $411 = $412;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $413 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $411 = $413;
        };
        return $411;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => (a0.length);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $414 = (parseInt(_chr$3, 16));
        return $414;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $416 = _img$3;
            var $417 = 0;
            var $418 = _siz$2;
            let _img$5 = $416;
            for (let _i$4 = $417; _i$4 < $418; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $416 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $416;
            };
            return _img$5;
        })();
        var $415 = _img$4;
        return $415;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Kaelin$Assets$chars$croni_idle_00 = VoxBox$parse$("1500210000001600210000001700210000001800210000001900210000001a00210000001b00210000001c0021000000130120000000140120000000150120807d9a160120807d9a170120c3c2cd180120c3c2cd190120c3c2cd1a0120807d9a1b012000000012021f00000013021f807d9a14021f807d9a15021f807d9a16021fc3c2cd17021fc3c2cd18021fc3c2cd19021f807d9a1a021f0000000b031e0000000c031e0000000d031e0000000e031e0000000f031e00000010031e00000011031e00000012031e807d9a13031e807d9a14031e807d9a15031ec3c2cd16031ec3c2cd17031ec3c2cd18031ec3c2cd19031e00000009041d0000000a041d0000000b041d2a234f0c041d2a234f0d041d44366b0e041d71558c0f041d71558c10041d44366b11041d2a234f12041d00000013041d00000014041dc3c2cd15041dc3c2cd16041dc3c2cd17041dc3c2cd18041d807d9a19041d00000007051c00000008051c00000009051c2a234f0a051c2a234f0b051c44366b0c051c71558c0d051c71558c0e051c71558c0f051c71558c10051c71558c11051c71558c12051c71558c13051c44366b14051c00000015051cc3c2cd16051cc3c2cd17051cc3c2cd18051c00000006061b00000007061b2a234f08061b44366b09061b44366b0a061b44366b0b061b71558c0c061b71558c0d061b71558c0e061b71558c0f061b71558c10061b71558c11061b71558c12061b71558c13061b71558c14061b44366b15061b00000016061bc3c2cd17061bc3c2cd18061b00000005071a00000006071a2a234f07071a2a234f08071a44366b09071a44366b0a071a44366b0b071a71558c0c071a71558c0d071a71558c0e071a71558c0f071a71558c10071a71558c11071a71558c12071a71558c13071a71558c14071a71558c15071a44366b16071a00000017071ac3c2cd18071a0000000508190000000608192a234f07081944366b08081944366b09081944366b0a081944366b0b081971558c0c081971558c0d081971558c0e081971558c0f081971558c10081971558c11081971558c12081971558c13081944366b14081900000015081944366b160819000000170819c3c2cd180819807d9a1908190000000409180000000509182a234f0609182a234f07091844366b08091844366b09091844366b0a091844366b0b091844366b0c091871558c0d091871558c0e091871558c0f091871558c10091871558c11091871558c12091871558c130918000000140918807d9a150918000000160918000000170918c3c2cd180918c3c2cd190918000000040a17000000050a172a234f060a17000000070a17000000080a172a234f090a1744366b0a0a172a234f0b0a170000000c0a170000000d0a170000000e0a1771558c0f0a1771558c100a1771558c110a1771558c120a1744366b130a17000000140a17807d9a150a17807d9a160a17000000170a17c3c2cd180a17c3c2cd190a17807d9a1a0a17000000040b16000000050b16000000060b16160e23070b16160e23080b16000000090b162a234f0a0b160000000b0b16160e230c0b16160e230d0b16160e230e0b160000000f0b1671558c100b1671558c110b1671558c120b1644366b130b16000000140b16807d9a150b16807d9a160b16c3c2cd170b16c3c2cd180b16c3c2cd190b16c3c2cd1a0b16807d9a1b0b16000000040c15000000050c15000000060c15de3938070c15de3938080c15160e23090c150000000a0c15160e230b0c15de39380c0c15de39380d0c15160e230e0c15160e230f0c15000000100c1571558c110c1544366b120c1544366b130c15000000140c15807d9a150c15807d9a160c15807d9a170c15c3c2cd180c15c3c2cd190c15c3c2cd1a0c15c3c2cd1b0c15000000050d14000000060d14de3938070d14de3938080d14160e23090d14160e230a0d14160e230b0d14de39380c0d14de39380d0d14160e230e0d14160e230f0d14000000100d1444366b110d1444366b120d14000000130d14807d9a140d14807d9a150d14807d9a160d14807d9a170d14807d9a180d14c3c2cd190d14c3c2cd1a0d14c3c2cd1b0d14807d9a1c0d14000000050e13000000060e13160e23070e13160e23080e13160e23090e13160e230a0e13160e230b0e13160e230c0e13160e230d0e13160e230e0e130000000f0e1344366b100e1344366b110e132a234f120e13000000130e13807d9a140e13807d9a150e13807d9a160e13807d9a170e13807d9a180e13807d9a190e13c3c2cd1a0e13c3c2cd1b0e13807d9a1c0e13000000060f12000000070f12160e23080f12160e23090f12160e230a0f12160e230b0f12160e230c0f12160e230d0f120000000e0f1244366b0f0f1244366b100f122a234f110f12000000120f12000000130f12000000140f12807d9a150f12807d9a160f12807d9a170f12807d9a180f12807d9a190f12807d9a1a0f12c3c2cd1b0f12807d9a1c0f12000000061011000000071011000000081011160e23091011160e230a1011160e230b1011160e230c10110000000d10112a234f0e10112a234f0f10110000001010110000001110112a234f12101144366b13101144366b141011000000151011000000161011807d9a171011807d9a181011807d9a191011807d9a1a1011c3c2cd1b1011807d9a1c10110000000511100000000611102a234f07111044366b0811100000000911100000000a11100000000b11100000000c11100000000d11100000000e11100000000f11102a234f10111044366b11111071558c12111071558c13111071558c14111071558c15111044366b161110000000171110807d9a181110807d9a191110807d9a1a1110807d9a1b111000000004120f00000005120f00000006120f44366b07120f44366b08120f44366b09120f0000000a120f69658b0b120f44366b0c120f44366b0d120f0000000e120f2a234f0f120f44366b10120f71558c11120f71558c12120f71558c13120f71558c14120f71558c15120f71558c16120f44366b17120f00000018120f807d9a19120f807d9a1a120f00000004130e00000005130e2a234f06130e44366b07130e71558c08130e44366b09130e0000000a130e69658b0b130e807d9a0c130e44366b0d130e0000000e130e2a234f0f130e44366b10130e71558c11130e71558c12130e71558c13130e71558c14130e71558c15130e71558c16130e71558c17130e44366b18130e00000019130e00000004140d00000005140d44366b06140d44366b07140d71558c08140d71558c09140d0000000a140d69658b0b140d807d9a0c140d69658b0d140d44366b0e140d0000000f140d44366b10140d44366b11140d71558c12140d71558c13140d71558c14140d71558c15140d71558c16140d71558c17140d71558c18140d44366b19140d00000003150c00000004150c2a234f05150c44366b06150c44366b07150c71558c08150c71558c09150c0000000a150c69658b0b150c807d9a0c150c69658b0d150c44366b0e150c0000000f150c2a234f10150c44366b11150c71558c12150c71558c13150c71558c14150c71558c15150c71558c16150c71558c17150c71558c18150c71558c19150c0000001a150c00000002160b00000003160b2a234f04160b2a234f05160b44366b06160b71558c07160b71558c08160b00000009160b69658b0a160b69658b0b160b807d9a0c160b807d9a0d160b69658b0e160b0000000f160b2a234f10160b44366b11160b44366b12160b71558c13160b71558c14160b71558c15160b71558c16160b71558c17160b71558c18160b71558c19160b44366b1a160b0000001b160b00000001170a00000002170a2a234f03170a2a234f04170a2a234f05170a2a234f06170a71558c07170a71558c08170a00000009170a0000000a170a69658b0b170a69658b0c170a807d9a0d170a69658b0e170a0000000f170a2a234f10170a2a234f11170a44366b12170a44366b13170a44366b14170a71558c15170a71558c16170a71558c17170a2a234f18170a44366b19170a44366b1a170a71558c1b170a71558c1c170a0000000118090000000218092a234f03180944366b04180944366b05180944366b0618092a234f07180971558c0818090000000918090000000a18090000000b18090000000c18090000000d18090000000e18090000000f18090000001018092a234f11180944366b12180944366b1318092a234f1418092a234f15180944366b16180944366b17180971558c18180971558c19180971558c1a180971558c1b180944366b1c1809c3c2cd1d180900000000190800000001190869658b0219082a234f0319082a234f04190871558c05190844366b06190844366b07190844366b0819080000000919080000000a19080000000b19080000000c19080000000d19080000000e19080000000f19080000001019082a234f1119082a234f12190844366b13190844366b14190871558c15190871558c16190871558c17190871558c18190871558c19190871558c1a190869658b1b1908c3c2cd1c190869658b1d1908000000001a07000000011a0769658b021a07c3c2cd031a072a234f041a072a234f051a0771558c061a0771558c071a0771558c081a07000000091a072424240a1a070000000b1a070000000c1a072424240d1a072424240e1a070000000f1a07000000101a072a234f111a072a234f121a0744366b131a0744366b141a0744366b151a0771558c161a0771558c171a0771558c181a0769658b191a07c3c2cd1a1a07c3c2cd1b1a0769658b1c1a07000000011b06000000021b0669658b031b06c3c2cd041b06c3c2cd051b062a234f061b062a234f071b06000000081b06242424091b062424240a1b060000000b1b060000000c1b062424240d1b062424240e1b060000000f1b06000000101b06000000111b062a234f121b062a234f131b062a234f141b0644366b151b0669658b161b06c3c2cd171b06c3c2cd181b06c3c2cd191b0669658b1a1b060000001b1b06000000021c05000000031c05000000041c0569658b051c05c3c2cd061c05c3c2cd071c05000000081c05242424091c052424240a1c052424240b1c052424240c1c052424240d1c052424240e1c052424240f1c05242424101c05242424111c05000000121c05c3c2cd131c05c3c2cd141c05c3c2cd151c05c3c2cd161c05c3c2cd171c0569658b181c05000000191c05000000041d04000000051d04000000061d04000000071d04000000111d04000000121d04000000131d04000000141d04000000151d04000000161d04000000171d04000000");
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
    });
    const Web$Kind$draw_page_apps = (() => {
        var _line$1 = (_txt$1 => {
            var $420 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $420;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $421 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $421;
        });
        var _span_bold$4 = (_txt$4 => {
            var $422 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $422;
        });
        var _vbox$5 = VoxBox$alloc_capacity$(1000);
        var _banner$5 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), VoxBox$Draw$image$(50, 50, 0, Kaelin$Assets$chars$croni_idle_00, _vbox$5));
        var _games$5 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$component$title$("Games"), List$cons$(_banner$5, List$nil)));
        var $419 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-home"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$apps), List$cons$(Web$Kind$component$body_container$(List$cons$(_games$5, List$nil)), List$cons$(Web$Kind$component$footer, List$nil))));
        return $419;
    })();

    function Web$Kind$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var $424 = Web$Kind$draw_page_home;
                var $423 = $424;
                break;
            case 'Web.Kind.Page.apps':
                var $425 = Web$Kind$draw_page_apps;
                var $423 = $425;
                break;
        };
        return $423;
    };
    const Web$Kind$draw_page = x0 => Web$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $426 = null;
        return $426;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $427 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $427;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $429 = self.value;
                var $430 = _f$4($429);
                var $428 = $430;
                break;
            case 'IO.ask':
                var $431 = self.query;
                var $432 = self.param;
                var $433 = self.then;
                var $434 = IO$ask$($431, $432, (_x$8 => {
                    var $435 = IO$bind$($433(_x$8), _f$4);
                    return $435;
                }));
                var $428 = $434;
                break;
        };
        return $428;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $436 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $436;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $437 = _new$2(IO$bind)(IO$end);
        return $437;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $438 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $438;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $439 = _m$pure$2;
        return $439;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $440 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $440;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kind = (() => {
        var _init$1 = Web$Kind$State$new$(Pair$new$(500, 400), Web$Kind$Page$home);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.Kind.State.new':
                    var $443 = self.page;
                    var $444 = Web$Kind$draw_page$($443);
                    var $442 = $444;
                    break;
            };
            return $442;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.dom':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                    var $446 = App$pass;
                    var $445 = $446;
                    break;
            };
            return $445;
        });
        var $441 = App$new$(_init$1, _draw$2, _when$3);
        return $441;
    })();
    return {
        'Web.Kind.State.new': Web$Kind$State$new,
        'Pair.new': Pair$new,
        'Nat.apply': Nat$apply,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.inc': U32$inc,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
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
        'Web.Kind.component.btn_go_to_apps_solid': Web$Kind$component$btn_go_to_apps_solid,
        'Web.Kind.component.title': Web$Kind$component$title,
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'Buffer32.alloc': Buffer32$alloc,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.shr': U32$shr,
        'U32.needed_depth.go': U32$needed_depth$go,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'U32.needed_depth': U32$needed_depth,
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
        'List.for': List$for,
        'List': List,
        'Web.Kind.component.header_tab': Web$Kind$component$header_tab,
        'Bool.and': Bool$and,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kind.helper.is_current': Web$Kind$helper$is_current,
        'Web.Kind.component.header_tabs': Web$Kind$component$header_tabs,
        'Web.Kind.component.header': Web$Kind$component$header,
        'Web.Kind.component.body_container': Web$Kind$component$body_container,
        'Web.Kind.component.list': Web$Kind$component$list,
        'Web.Kind.component.link_white': Web$Kind$component$link_white,
        'Web.Kind.constant.dark_pri_color': Web$Kind$constant$dark_pri_color,
        'Web.Kind.component.footer': Web$Kind$component$footer,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'DOM.vbox': DOM$vbox,
        'VoxBox.get_len': VoxBox$get_len,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'U32.add': U32$add,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'Col32.new': Col32$new,
        'VoxBox.parse': VoxBox$parse,
        'Kaelin.Assets.chars.croni_idle_00': Kaelin$Assets$chars$croni_idle_00,
        'Web.Kind.Page.apps': Web$Kind$Page$apps,
        'Web.Kind.draw_page_apps': Web$Kind$draw_page_apps,
        'Web.Kind.draw_page': Web$Kind$draw_page,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'App.new': App$new,
        'Web.Kind': Web$Kind,
    };
})();