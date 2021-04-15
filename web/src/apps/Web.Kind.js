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
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
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
            var $251 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "30px"), List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))), List$cons$(DOM$text$(_title$2), List$nil));
            var $250 = $251;
        } else {
            var $252 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "10px"), List$cons$(Pair$new$("font-size", "18px"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("width", "70px"), List$cons$(Pair$new$("margin-bottom", "2px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(DOM$text$(_title$2), List$nil));
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
    const Web$Kind$Page$home = ({
        _: 'Web.Kind.Page.home'
    });

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

    function Web$Kind$component$game_card$(_src$1, _title$2, _url$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var _title$5 = DOM$node$("a", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$cons$(Pair$new$("cursor", "pointer"), List$nil))), List$cons$(DOM$text$(_title$2), List$nil));
        var $272 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil)))), List$cons$(_banner$4, List$cons$(_title$5, List$nil)));
        return $272;
    };
    const Web$Kind$component$game_card = x0 => x1 => x2 => Web$Kind$component$game_card$(x0, x1, x2);
    const Web$Kind$img$banner_template = "data:image/png;base64,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";
    const Web$Kind$draw_page_apps = (() => {
        var _line$1 = (_txt$1 => {
            var $274 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$1), List$nil));
            return $274;
        });
        var _line_break$2 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil), List$nil));
        var _span$3 = (_txt$3 => {
            var $275 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil)), List$cons$(DOM$text$(_txt$3), List$nil));
            return $275;
        });
        var _span_bold$4 = (_txt$4 => {
            var $276 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("font-size", Web$Kind$constant$p_tag_size), List$nil))), List$cons$(DOM$text$(_txt$4), List$nil));
            return $276;
        });
        var _game$5 = Web$Kind$component$game_card$(Web$Kind$img$banner_template, "Senhas", "senhas");
        var _game_container$5 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$component$title$("Games"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "space-evenly"), List$nil))), List$cons$(_game$5, List$cons$(_game$5, List$nil))), List$nil)));
        var $273 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page-apps"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil))))), List$cons$(Web$Kind$component$header$(Web$Kind$Page$apps), List$cons$(Web$Kind$component$body_container$(List$cons$(_game_container$5, List$nil)), List$cons$(Web$Kind$component$footer, List$nil))));
        return $273;
    })();

    function Web$Kind$draw_page$(_page$1) {
        var self = _page$1;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var $278 = Web$Kind$draw_page_home;
                var $277 = $278;
                break;
            case 'Web.Kind.Page.apps':
                var $279 = Web$Kind$draw_page_apps;
                var $277 = $279;
                break;
        };
        return $277;
    };
    const Web$Kind$draw_page = x0 => Web$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $280 = null;
        return $280;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $281 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $281;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $283 = self.value;
                var $284 = _f$4($283);
                var $282 = $284;
                break;
            case 'IO.ask':
                var $285 = self.query;
                var $286 = self.param;
                var $287 = self.then;
                var $288 = IO$ask$($285, $286, (_x$8 => {
                    var $289 = IO$bind$($287(_x$8), _f$4);
                    return $289;
                }));
                var $282 = $288;
                break;
        };
        return $282;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $290 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $290;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $291 = _new$2(IO$bind)(IO$end);
        return $291;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $292 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $292;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $293 = _m$pure$2;
        return $293;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $294 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $294;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kind = (() => {
        var _init$1 = Web$Kind$State$new$(Pair$new$(500, 400), Web$Kind$Page$apps);
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.Kind.State.new':
                    var $297 = self.page;
                    var $298 = Web$Kind$draw_page$($297);
                    var $296 = $298;
                    break;
            };
            return $296;
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
                    var $300 = App$pass;
                    var $299 = $300;
                    break;
            };
            return $299;
        });
        var $295 = App$new$(_init$1, _draw$2, _when$3);
        return $295;
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
        'Web.Kind.Page.home': Web$Kind$Page$home,
        'Web.Kind.component.body_container': Web$Kind$component$body_container,
        'Web.Kind.component.list': Web$Kind$component$list,
        'Web.Kind.component.link_white': Web$Kind$component$link_white,
        'Web.Kind.constant.dark_pri_color': Web$Kind$constant$dark_pri_color,
        'Web.Kind.component.footer': Web$Kind$component$footer,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'Web.Kind.component.game_card': Web$Kind$component$game_card,
        'Web.Kind.img.banner_template': Web$Kind$img$banner_template,
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
        'App.new': App$new,
        'Web.Kind': Web$Kind,
    };
})();