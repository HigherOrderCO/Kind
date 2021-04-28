(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[464],{

/***/ 464:
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

    function Web$Kind$State$new$(_device$1, _page$2, _mouse_over$3) {
        var $33 = ({
            _: 'Web.Kind.State.new',
            'device': _device$1,
            'page': _page$2,
            'mouse_over': _mouse_over$3
        });
        return $33;
    };
    const Web$Kind$State$new = x0 => x1 => x2 => Web$Kind$State$new$(x0, x1, x2);
    const Device$big_desktop = ({
        _: 'Device.big_desktop'
    });
    const Web$Kind$Page$home = ({
        _: 'Web.Kind.Page.home'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $34 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $34;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

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
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $37 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $37;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $38 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $38;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $40 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $42 = self.val;
                        var $43 = self.lft;
                        var $44 = self.rgt;
                        var $45 = BitsMap$tie$($42, BitsMap$set$($40, _val$3, $43), $44);
                        var $41 = $45;
                        break;
                    case 'BitsMap.new':
                        var $46 = BitsMap$tie$(Maybe$none, BitsMap$set$($40, _val$3, BitsMap$new), BitsMap$new);
                        var $41 = $46;
                        break;
                };
                var $39 = $41;
                break;
            case 'i':
                var $47 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $49 = self.val;
                        var $50 = self.lft;
                        var $51 = self.rgt;
                        var $52 = BitsMap$tie$($49, $50, BitsMap$set$($47, _val$3, $51));
                        var $48 = $52;
                        break;
                    case 'BitsMap.new':
                        var $53 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($47, _val$3, BitsMap$new));
                        var $48 = $53;
                        break;
                };
                var $39 = $48;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $55 = self.lft;
                        var $56 = self.rgt;
                        var $57 = BitsMap$tie$(Maybe$some$(_val$3), $55, $56);
                        var $54 = $57;
                        break;
                    case 'BitsMap.new':
                        var $58 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $54 = $58;
                        break;
                };
                var $39 = $54;
                break;
        };
        return $39;
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
                var $60 = self.pred;
                var $61 = (Word$to_bits$($60) + '0');
                var $59 = $61;
                break;
            case 'Word.i':
                var $62 = self.pred;
                var $63 = (Word$to_bits$($62) + '1');
                var $59 = $63;
                break;
            case 'Word.e':
                var $64 = Bits$e;
                var $59 = $64;
                break;
        };
        return $59;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $65 = 1n + _pred$1;
        return $65;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
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
                        var $77 = BitsMap$set$(String$to_bits$($75), $76, Map$from_list$($73));
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

    function List$cons$(_head$2, _tail$3) {
        var $80 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $80;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $81 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $81;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $82 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $82;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const Web$Kind$typography$body_size = "12pt";
    const Web$Kind$typography$typeface_body = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const Web$Kind$typography$body_strong = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$body_size), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "800"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));
    const Web$Kind$typography$l = "16pt";
    const Web$Kind$typography$typeface_header = "\'Lato\', \'Helvetica\', \'Verdana\', sans-serif";
    const Web$Kind$typography$h2 = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$l), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const Web$Kind$typography$xl = "18pt";
    const Web$Kind$typography$h1 = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$xl), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const Web$Kind$typography$body = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$body_size), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "300"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));
    const Web$Kind$img$croni = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAxhJREFUSIm1lz9IW1EUh79YR0lTxFhsIKZJOigSMBA6NGnrH5yKUHARHCrYIqGDYMeqtKMBp1BqoR0EOzhlFKND7SApFkpopqQhkIY2JUMzuaWDvdf73rvvvSr1DIF73rv3u79z7znnxcPlWMflucdzGcC155sAjE/G5YP9vWPWXj4G8Mif/wUVQDfoRcC2IbSDAiRTcQur+zzAofA0AAO9AUaCIQCKtSqNVl0o4vDDsWHi/p5xLMxNsS1QZ8ValXwha4Dr1IKz4s5QeJqB3oB0OEHPnqdJpuIW5WbrcoJexEaCISYSaaH03GAAg9p/sWKtysbOssH399JZLqUObKu2WKs6gvOFLGvPN8kXstJnvuFOYABKlRz5QpZGqw5Ao1UnX8iysbNsUWXelJpaytigWgsuVXL4vWH83jClSo5Gq27w+b1hLVw19XKNT8YtcFvFR8N9HA33SbjfG5Y+wADXHYE5f80h14EtOef3hu32J6HifJ3gqmrbPL799Zejr9muMJFIA8h7oLP9vWPtBbMLtafZrtguZoaWKjkAWTZ1cLM51upmu2IJc7NdYSg8bQCqFU7AzWE3m12tluVSzUmziXfMpVTUbEtaKa3xig4KEItOAHDzRoJv3z+xuLCOr/uWHNtBAfp91+jpifL2/Qr37j6wQMEm1KJyjQRDhlS5MxXj4+4X2wioJhqGcu6G6Govl1NHisYGmUik5fk6lVHRMHRmBp+rKzmlkQoXa9uBDVAxYWNnmcWFdenvv36VaGzQsLhb81BUW0qmAWpW8urNMwB+/vhtWVS8W6xVLRvY/XwofUszGZZmMhIuDtzytdFo1ZkaTbo2A3We2IQY69JsNTNPMhWnC+iIUDZadfnyQG/ANYRm1QO9AaZGk4wEQxboia/Damae7a0DQDnj1+9WgNPwiIliciQSkQtEIhHD2GzmzZ74Ojx8ep/ZuTG2tw7Escl/Ep3FhXVm58YAePLoBXDalwWkXC4bNiHGcJb3QnU0NijXAlQgaP5JdADUDSRTcUd1wsrlsvarUgfUDtQNuLzjNsd1/h9Ji2BZJdnEIwAAAABJRU5ErkJggg==";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $84 = self.val;
                var $85 = self.lft;
                var $86 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $88 = self.val;
                        var $89 = self.lft;
                        var $90 = self.rgt;
                        var self = $84;
                        switch (self._) {
                            case 'Maybe.none':
                                var $92 = BitsMap$tie$($88, BitsMap$union$($85, $89), BitsMap$union$($86, $90));
                                var $91 = $92;
                                break;
                            case 'Maybe.some':
                                var $93 = BitsMap$tie$($84, BitsMap$union$($85, $89), BitsMap$union$($86, $90));
                                var $91 = $93;
                                break;
                        };
                        var $87 = $91;
                        break;
                    case 'BitsMap.new':
                        var $94 = _a$2;
                        var $87 = $94;
                        break;
                };
                var $83 = $87;
                break;
            case 'BitsMap.new':
                var $95 = _b$3;
                var $83 = $95;
                break;
        };
        return $83;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $96 = BitsMap$union$(_a$2, _b$3);
        return $96;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);
    const Web$Kind$typography$button = Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("font-size", Web$Kind$typography$body_size), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "600"), List$cons$(Pair$new$("line-height", "1"), List$nil))))));
    const Web$Kind$constant$secondary_color = "#3891A6";

    function Web$Kind$comp$btn_primary_solid$(_title$1, _id$2) {
        var $97 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$2), List$nil)), Map$union$(Web$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("background-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border-radius", "7px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))))), List$cons$(DOM$text$(_title$1), List$nil));
        return $97;
    };
    const Web$Kind$comp$btn_primary_solid = x0 => x1 => Web$Kind$comp$btn_primary_solid$(x0, x1);
    const Web$Kind$typography$typeface_code = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const Web$Kind$typography$code = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$body_size), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_code), List$cons$(Pair$new$("font-weight", "400"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));

    function String$cons$(_head$1, _tail$2) {
        var $98 = (String.fromCharCode(_head$1) + _tail$2);
        return $98;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Web$Kind$constant$primary_color = "#71558C";

    function Web$Kind$comp$heading$(_typography$1, _title$2) {
        var $99 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_typography$1, Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$nil))), List$cons$(DOM$text$(_title$2), List$nil));
        return $99;
    };
    const Web$Kind$comp$heading = x0 => x1 => Web$Kind$comp$heading$(x0, x1);

    function Buffer32$new$(_depth$1, _array$2) {
        var $100 = u32array_to_buffer32(_array$2);
        return $100;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $101 = null;
        return $101;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $102 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $102;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $103 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $103;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $105 = Array$tip$(_x$3);
            var $104 = $105;
        } else {
            var $106 = (self - 1n);
            var _half$5 = Array$alloc$($106, _x$3);
            var $107 = Array$tie$(_half$5, _half$5);
            var $104 = $107;
        };
        return $104;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $108 = word_to_u32(_value$1);
        return $108;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $109 = null;
        return $109;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $110 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $110;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $112 = Word$e;
            var $111 = $112;
        } else {
            var $113 = (self - 1n);
            var $114 = Word$o$(Word$zero$($113));
            var $111 = $114;
        };
        return $111;
    };
    const Word$zero = x0 => Word$zero$(x0);
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
                        var $115 = self.pred;
                        var $116 = Word$bit_length$go$($115, Nat$succ$(_c$3), _n$4);
                        return $116;
                    case 'Word.i':
                        var $117 = self.pred;
                        var $118 = Word$bit_length$go$($117, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $118;
                    case 'Word.e':
                        var $119 = _n$4;
                        return $119;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $120 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $120;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $122 = u32_to_word(self);
                var $123 = Word$bit_length$($122);
                var $121 = $123;
                break;
        };
        return $121;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $124 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $124;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $126 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $128 = Word$i$(Word$shift_left1$aux$($126, Bool$false));
                    var $127 = $128;
                } else {
                    var $129 = Word$o$(Word$shift_left1$aux$($126, Bool$false));
                    var $127 = $129;
                };
                var $125 = $127;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $132 = Word$i$(Word$shift_left1$aux$($130, Bool$true));
                    var $131 = $132;
                } else {
                    var $133 = Word$o$(Word$shift_left1$aux$($130, Bool$true));
                    var $131 = $133;
                };
                var $125 = $131;
                break;
            case 'Word.e':
                var $134 = Word$e;
                var $125 = $134;
                break;
        };
        return $125;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $136 = self.pred;
                var $137 = Word$o$(Word$shift_left1$aux$($136, Bool$false));
                var $135 = $137;
                break;
            case 'Word.i':
                var $138 = self.pred;
                var $139 = Word$o$(Word$shift_left1$aux$($138, Bool$true));
                var $135 = $139;
                break;
            case 'Word.e':
                var $140 = Word$e;
                var $135 = $140;
                break;
        };
        return $135;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $142 = self.pred;
                var $143 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $145 = self.pred;
                            var $146 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $148 = Word$i$(Word$adder$(_a$pred$10, $145, Bool$false));
                                    var $147 = $148;
                                } else {
                                    var $149 = Word$o$(Word$adder$(_a$pred$10, $145, Bool$false));
                                    var $147 = $149;
                                };
                                return $147;
                            });
                            var $144 = $146;
                            break;
                        case 'Word.i':
                            var $150 = self.pred;
                            var $151 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $153 = Word$o$(Word$adder$(_a$pred$10, $150, Bool$true));
                                    var $152 = $153;
                                } else {
                                    var $154 = Word$i$(Word$adder$(_a$pred$10, $150, Bool$false));
                                    var $152 = $154;
                                };
                                return $152;
                            });
                            var $144 = $151;
                            break;
                        case 'Word.e':
                            var $155 = (_a$pred$8 => {
                                var $156 = Word$e;
                                return $156;
                            });
                            var $144 = $155;
                            break;
                    };
                    var $144 = $144($142);
                    return $144;
                });
                var $141 = $143;
                break;
            case 'Word.i':
                var $157 = self.pred;
                var $158 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $163 = Word$o$(Word$adder$(_a$pred$10, $160, Bool$true));
                                    var $162 = $163;
                                } else {
                                    var $164 = Word$i$(Word$adder$(_a$pred$10, $160, Bool$false));
                                    var $162 = $164;
                                };
                                return $162;
                            });
                            var $159 = $161;
                            break;
                        case 'Word.i':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $168 = Word$i$(Word$adder$(_a$pred$10, $165, Bool$true));
                                    var $167 = $168;
                                } else {
                                    var $169 = Word$o$(Word$adder$(_a$pred$10, $165, Bool$true));
                                    var $167 = $169;
                                };
                                return $167;
                            });
                            var $159 = $166;
                            break;
                        case 'Word.e':
                            var $170 = (_a$pred$8 => {
                                var $171 = Word$e;
                                return $171;
                            });
                            var $159 = $170;
                            break;
                    };
                    var $159 = $159($157);
                    return $159;
                });
                var $141 = $158;
                break;
            case 'Word.e':
                var $172 = (_b$5 => {
                    var $173 = Word$e;
                    return $173;
                });
                var $141 = $172;
                break;
        };
        var $141 = $141(_b$3);
        return $141;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $174 = Word$adder$(_a$2, _b$3, Bool$false);
        return $174;
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
                        var $175 = self.pred;
                        var $176 = Word$mul$go$($175, Word$shift_left1$(_b$4), _acc$5);
                        return $176;
                    case 'Word.i':
                        var $177 = self.pred;
                        var $178 = Word$mul$go$($177, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $178;
                    case 'Word.e':
                        var $179 = _acc$5;
                        return $179;
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
                var $181 = self.pred;
                var $182 = Word$o$(Word$to_zero$($181));
                var $180 = $182;
                break;
            case 'Word.i':
                var $183 = self.pred;
                var $184 = Word$o$(Word$to_zero$($183));
                var $180 = $184;
                break;
            case 'Word.e':
                var $185 = Word$e;
                var $180 = $185;
                break;
        };
        return $180;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $186 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $186;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

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
                    var $187 = _x$4;
                    return $187;
                } else {
                    var $188 = (self - 1n);
                    var $189 = Nat$apply$($188, _f$3, _f$3(_x$4));
                    return $189;
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
                var $191 = self.pred;
                var $192 = Word$i$($191);
                var $190 = $192;
                break;
            case 'Word.i':
                var $193 = self.pred;
                var $194 = Word$o$(Word$inc$($193));
                var $190 = $194;
                break;
            case 'Word.e':
                var $195 = Word$e;
                var $190 = $195;
                break;
        };
        return $190;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $196 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $196;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $197 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $197;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $198 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $198;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kind$typography$xxl = "21pt";
    const Web$Kind$typography$subtitle = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$xxl), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function Web$Kind$comp$title_phone$(_title$1) {
        var $199 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(Web$Kind$typography$subtitle, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $199;
    };
    const Web$Kind$comp$title_phone = x0 => Web$Kind$comp$title_phone$(x0);
    const Web$Kind$typography$xxxl = "24pt";
    const Web$Kind$typography$title = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$xxxl), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function Web$Kind$comp$title$(_title$1) {
        var $200 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(Web$Kind$typography$title, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $200;
    };
    const Web$Kind$comp$title = x0 => Web$Kind$comp$title$(x0);
    const Web$Kind$constant$light_gray_color = "#D3D3D3";

    function Web$Kind$comp$header_tab$(_is_active$1, _is_hover$2, _title$3, _id$4) {
        var _normal$5 = Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("font-weight", "500"), List$cons$(Pair$new$("font-size", "1.1em"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))));
        var _active$6 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$secondary_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var _hover$7 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", Web$Kind$constant$light_gray_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var $201 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$4), List$nil)), (() => {
            var self = _is_active$1;
            if (self) {
                var $202 = Map$union$(_normal$5, _active$6);
                return $202;
            } else {
                var self = _is_hover$2;
                if (self) {
                    var $204 = Map$union$(_normal$5, _hover$7);
                    var $203 = $204;
                } else {
                    var $205 = _normal$5;
                    var $203 = $205;
                };
                return $203;
            };
        })(), List$cons$(DOM$text$(_title$3), List$nil));
        return $201;
    };
    const Web$Kind$comp$header_tab = x0 => x1 => x2 => x3 => Web$Kind$comp$header_tab$(x0, x1, x2, x3);

    function Web$Kind$helper$is_eql$(_src$1, _trg$2) {
        var self = _src$1;
        switch (self._) {
            case 'Web.Kind.Page.home':
                var self = _trg$2;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $208 = Bool$true;
                        var $207 = $208;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $209 = Bool$false;
                        var $207 = $209;
                        break;
                };
                var $206 = $207;
                break;
            case 'Web.Kind.Page.apps':
                var self = _trg$2;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $211 = Bool$false;
                        var $210 = $211;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $212 = Bool$true;
                        var $210 = $212;
                        break;
                };
                var $206 = $210;
                break;
        };
        return $206;
    };
    const Web$Kind$helper$is_eql = x0 => x1 => Web$Kind$helper$is_eql$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $214 = Bool$false;
                var $213 = $214;
                break;
            case 'Cmp.eql':
                var $215 = Bool$true;
                var $213 = $215;
                break;
        };
        return $213;
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
                var $217 = self.pred;
                var $218 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $220 = self.pred;
                            var $221 = (_a$pred$10 => {
                                var $222 = Word$cmp$go$(_a$pred$10, $220, _c$4);
                                return $222;
                            });
                            var $219 = $221;
                            break;
                        case 'Word.i':
                            var $223 = self.pred;
                            var $224 = (_a$pred$10 => {
                                var $225 = Word$cmp$go$(_a$pred$10, $223, Cmp$ltn);
                                return $225;
                            });
                            var $219 = $224;
                            break;
                        case 'Word.e':
                            var $226 = (_a$pred$8 => {
                                var $227 = _c$4;
                                return $227;
                            });
                            var $219 = $226;
                            break;
                    };
                    var $219 = $219($217);
                    return $219;
                });
                var $216 = $218;
                break;
            case 'Word.i':
                var $228 = self.pred;
                var $229 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $231 = self.pred;
                            var $232 = (_a$pred$10 => {
                                var $233 = Word$cmp$go$(_a$pred$10, $231, Cmp$gtn);
                                return $233;
                            });
                            var $230 = $232;
                            break;
                        case 'Word.i':
                            var $234 = self.pred;
                            var $235 = (_a$pred$10 => {
                                var $236 = Word$cmp$go$(_a$pred$10, $234, _c$4);
                                return $236;
                            });
                            var $230 = $235;
                            break;
                        case 'Word.e':
                            var $237 = (_a$pred$8 => {
                                var $238 = _c$4;
                                return $238;
                            });
                            var $230 = $237;
                            break;
                    };
                    var $230 = $230($228);
                    return $230;
                });
                var $216 = $229;
                break;
            case 'Word.e':
                var $239 = (_b$5 => {
                    var $240 = _c$4;
                    return $240;
                });
                var $216 = $239;
                break;
        };
        var $216 = $216(_b$3);
        return $216;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $241 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $241;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $242 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $242;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const Web$Kind$Page$apps = ({
        _: 'Web.Kind.Page.apps'
    });

    function Web$Kind$comp$header_tabs$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $244 = self.page;
                var $245 = self.mouse_over;
                var _tabs$5 = List$cons$(Web$Kind$comp$header_tab$(Web$Kind$helper$is_eql$(Web$Kind$Page$home, $244), ("tab_home" === $245), "Home", "tab_home"), List$cons$(Web$Kind$comp$header_tab$(Web$Kind$helper$is_eql$(Web$Kind$Page$apps, $244), ("tab_apps" === $245), "Apps", "tab_apps"), List$nil));
                var $246 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(Web$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("padding-top", "0.5em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), _tabs$5);
                var $243 = $246;
                break;
        };
        return $243;
    };
    const Web$Kind$comp$header_tabs = x0 => Web$Kind$comp$header_tabs$(x0);

    function Web$Kind$comp$header$(_stt$1, _container_layout$2) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $248 = self.device;
                var _vbox$6 = VoxBox$alloc_capacity$(100);
                var _line$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "auto"), List$cons$(Pair$new$("max-width", "65em"), List$cons$(Pair$new$("padding", "0.5em 0"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "3pt"), List$cons$(Pair$new$("border-top", (Web$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("border-bottom", (Web$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("margin-left", "10%"), List$cons$(Pair$new$("margin-right", "10%"), List$nil)))))), List$nil), List$nil));
                var $249 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "header"), List$nil)), _container_layout$2, List$cons$((() => {
                    var self = $248;
                    switch (self._) {
                        case 'Device.phone':
                            var $250 = Web$Kind$comp$title_phone$("KIND language");
                            return $250;
                        case 'Device.tablet':
                        case 'Device.desktop':
                        case 'Device.big_desktop':
                            var $251 = Web$Kind$comp$title$("KIND language");
                            return $251;
                    };
                })(), List$cons$(_line$7, List$cons$(Web$Kind$comp$header_tabs$(_stt$1), List$nil))));
                var $247 = $249;
                break;
        };
        return $247;
    };
    const Web$Kind$comp$header = x0 => x1 => Web$Kind$comp$header$(x0, x1);
    const Web$Kind$typography$xs = "9pt";
    const Web$Kind$typography$xxs = "8pt";
    const Web$Kind$typography$s = "10pt";
    const Web$Kind$typography$h3 = Map$from_list$(List$cons$(Pair$new$("font-size", Web$Kind$typography$body_size), List$cons$(Pair$new$("font-family", Web$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $252 = null;
        return $252;
    };
    const List = x0 => List$(x0);

    function Web$Kind$comp$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $255 = _li$2;
            var $256 = _items$1;
            let _li$4 = $255;
            let _item$3;
            while ($256._ === 'List.cons') {
                _item$3 = $256.head;
                var $255 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("line-height", "1.35"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $255;
                $256 = $256.tail;
            }
            return _li$4;
        })();
        var $253 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $253;
    };
    const Web$Kind$comp$list = x0 => Web$Kind$comp$list$(x0);

    function Web$Kind$comp$link_white$(_txt$1, _font_size$2, _href$3) {
        var $257 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", _font_size$2), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $257;
    };
    const Web$Kind$comp$link_white = x0 => x1 => x2 => Web$Kind$comp$link_white$(x0, x1, x2);
    const Web$Kind$constant$dark_pri_color = "#44366B";

    function Web$Kind$comp$footer$(_device$1, _container_layout$2) {
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $259 = "0.5em 0";
                var _vertical_padding$3 = $259;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $260 = "1em 0";
                var _vertical_padding$3 = $260;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $261 = Web$Kind$typography$xs;
                var _footer_font_size$4 = $261;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $262 = Web$Kind$typography$body_size;
                var _footer_font_size$4 = $262;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $263 = Web$Kind$typography$xxs;
                var _footer_font_size_s$5 = $263;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $264 = Web$Kind$typography$s;
                var _footer_font_size_s$5 = $264;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $265 = Web$Kind$typography$h3;
                var _heading_typography$6 = $265;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $266 = Web$Kind$typography$h2;
                var _heading_typography$6 = $266;
                break;
        };
        var _join_us_txt$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$comp$heading$(_heading_typography$6, "Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$Kind$comp$list$(List$cons$(Web$Kind$comp$link_white$("Github", _footer_font_size$4, "https://github.com/uwu-tech/Kind"), List$cons$(Web$Kind$comp$link_white$("Telegram", _footer_font_size$4, "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$8 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$nil)))))), List$cons$(_join_us_txt$7, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size$4), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _join_us_wrapper$9 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", _vertical_padding$3), List$cons$(Pair$new$("background-color", Web$Kind$constant$primary_color), List$nil))), List$cons$(_join_us$8, List$nil));
        var _msg_footer$10 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size_s$5), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(Web$Kind$comp$link_white$("*u* show me the code!", _footer_font_size_s$5, "https://github.com/uwu-tech/Kind/blob/master/base/Web/Kind.kind"), List$nil)));
        var _msg_footer_wrapper$11 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 0"), List$cons$(Pair$new$("background-color", Web$Kind$constant$dark_pri_color), List$nil))), List$cons$(_msg_footer$10, List$nil));
        var $258 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "footer"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil)))), List$cons$(_join_us_wrapper$9, List$cons$(_msg_footer_wrapper$11, List$nil)));
        return $258;
    };
    const Web$Kind$comp$footer = x0 => x1 => Web$Kind$comp$footer$(x0, x1);

    function Web$Kind$comp$page$(_page_name$1, _stt$2, _body_contents$3) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $268 = self.device;
                var self = $268;
                switch (self._) {
                    case 'Device.phone':
                        var $270 = Map$from_list$(List$cons$(Pair$new$("width", "85%"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil))));
                        var _container_layout$7 = $270;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $271 = Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("max-width", "600pt"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil)))));
                        var _container_layout$7 = $271;
                        break;
                };
                var self = $268;
                switch (self._) {
                    case 'Device.phone':
                        var $272 = "1.5em 0";
                        var _body_container_padding$8 = $272;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $273 = "2.5em 0";
                        var _body_container_padding$8 = $273;
                        break;
                };
                var _page_layout$9 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil)))));
                var $269 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("page-" + _page_name$1)), List$nil)), Map$union$(Web$Kind$typography$body, _page_layout$9), List$cons$(Web$Kind$comp$header$(_stt$2, _container_layout$7), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "body-container"), List$nil)), Map$union$(_container_layout$7, Map$from_list$(List$cons$(Pair$new$("flex", "1"), List$cons$(Pair$new$("padding", _body_container_padding$8), List$nil)))), _body_contents$3), List$cons$(Web$Kind$comp$footer$($268, _container_layout$7), List$nil))));
                var $267 = $269;
                break;
        };
        return $267;
    };
    const Web$Kind$comp$page = x0 => x1 => x2 => Web$Kind$comp$page$(x0, x1, x2);

    function Web$Kind$draw_page_home$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $275 = self.device;
                var _span$5 = (_txt$5 => {
                    var $277 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$5), List$nil));
                    return $277;
                });
                var _line$6 = (_txt$6 => {
                    var $278 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$6), List$nil));
                    return $278;
                });
                var _line_break$7 = DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil);
                var _span_bold$8 = (_txt$8 => {
                    var $279 = DOM$node$("span", Map$from_list$(List$nil), Web$Kind$typography$body_strong, List$cons$(DOM$text$(_txt$8), List$nil));
                    return $279;
                });
                var self = $275;
                switch (self._) {
                    case 'Device.phone':
                        var $280 = "6em";
                        var _go_to_apps_height$9 = $280;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $281 = "10em";
                        var _go_to_apps_height$9 = $281;
                        break;
                };
                var self = $275;
                switch (self._) {
                    case 'Device.phone':
                        var $282 = Web$Kind$typography$h2;
                        var _heading_typography$10 = $282;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $283 = Web$Kind$typography$h1;
                        var _heading_typography$10 = $283;
                        break;
                };
                var _intro$11 = DOM$node$("div", Map$from_list$(List$nil), Web$Kind$typography$body, List$cons$(_span$5("Kind is a cute "), List$cons$(_span_bold$8("proof"), List$cons$(_span$5("gramming language."), List$cons$(_line_break$7, List$cons$(_line_break$7, List$cons$(_span$5("It\'s "), List$cons$(_span_bold$8("capable of everything"), List$cons$(_line$6("from web apps to games to"), List$cons$(_line$6("advanced mathematical proofs."), List$nil))))))))));
                var _croni$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "3em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(_span$5("gl hf!"), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", Web$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "2em"), List$cons$(Pair$new$("height", "2em"), List$nil))), List$nil), List$nil)));
                var _call_to_apps$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", _go_to_apps_height$9), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(Web$Kind$comp$btn_primary_solid$("GO TO APPS", "btn_pri_home_go_to_apps"), List$cons$(_croni$12, List$nil)));
                var _instructions$13 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(Web$Kind$typography$code, Map$from_list$(List$cons$(Pair$new$("margin-top", "0.5em"), List$cons$(Pair$new$("padding", "0.5em"), List$cons$(Pair$new$("box-shadow", (Web$Kind$constant$primary_color + " -2px 2px 1px")), List$cons$(Pair$new$("border", "1px solid"), List$nil)))))), List$cons$(_line$6("npm i -g kind-lang"), List$cons$(_line$6("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$6("cd Kind/base"), List$cons$(_line$6("kind Main"), List$cons$(_line$6("kind Main --run"), List$nil))))));
                var _install$13 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "instructions"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$comp$heading$(_heading_typography$10, "Install"), List$cons$(_instructions$13, List$nil)));
                var $276 = Web$Kind$comp$page$("home", _stt$1, List$cons$(_intro$11, List$cons$(_call_to_apps$12, List$cons$(_install$13, List$nil))));
                var $274 = $276;
                break;
        };
        return $274;
    };
    const Web$Kind$draw_page_home = x0 => Web$Kind$draw_page_home$(x0);

    function Web$Kind$comp$game_card$(_src$1, _title$2, _path$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var $284 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _path$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("text-decoration", "none"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))))), List$cons$(_banner$4, List$cons$(DOM$text$(_title$2), List$nil))), List$nil));
        return $284;
    };
    const Web$Kind$comp$game_card = x0 => x1 => x2 => Web$Kind$comp$game_card$(x0, x1, x2);
    const Web$Kind$img$app_senhas = "data:image/png;base64,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";
    const Web$Kind$img$app_tic_tac_toe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAdlJREFUeJztm01uglAURrFxRyylm2nSQdNBk27GpbgmHDBpFHnvwH0/lXNmTu41hw9FPjxN0zRIHm+t38B/QlkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBTiHT/z5+v378vP7I3xFq9UmC5BO1mUccwa9X6+b30TpFZnzkytMFiD3M2tFef5xa7tiPTU5K0wWIDdZs/i7gxOVqWordo41WYB0suZDvXIo9nwPVlsRMjb+onQDyZNi8QwtsddLhzC6SNbM4lFNnqFRu7x0CIYlq9AXeYXhIfNNFiDg585+ig4PnG+yAMoCnJ79HeXuruPRWLzLarIAygIoC6AswNMP+M1YhckwKAuhLICyAO0b6ai6uMIKkwXopZHeXxdXWGGyAB010uu7SqygmCxAF4106YFRizrqDevzCo30ZRxL12LbOGiybKSL00sj/Tg5fJeNdFXaN9IVLhRspBugLICyAMoC+KzDMj7rsBdlAZQFUBbAZx0AJgtgyQrmmyyAJSuYb7IAlqwAkwXosWStwLZT5KBVmKdhcXpMVv0Kw0uHePotWTtcYbIAlqwAkwVQFiD+TukLY7IAygIoC6AsgLIANxbY0ByDNCtkAAAAAElFTkSuQmCC";
    const Web$Kind$img$app_kaelin = "data:image/png;base64,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";
    const Web$Kind$content_apps = List$cons$(Web$Kind$comp$game_card$(Web$Kind$img$app_senhas, "Senhas", "Web.Senhas"), List$cons$(Web$Kind$comp$game_card$(Web$Kind$img$app_tic_tac_toe, "TicTacToe", "Web.TicTacToe"), List$cons$(Web$Kind$comp$game_card$(Web$Kind$img$app_kaelin, "Kaelin", "Web.Kaelin"), List$nil)));

    function Web$Kind$comp$link_black$(_txt$1, _href$2) {
        var $285 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $285;
    };
    const Web$Kind$comp$link_black = x0 => x1 => Web$Kind$comp$link_black$(x0, x1);
    const Web$Kind$content_apps_text = Web$Kind$comp$list$(List$cons$(Web$Kind$comp$link_black$("Demo", "Web.Demo"), List$cons$(Web$Kind$comp$link_black$("Online", "Web.Online"), List$nil)));

    function Web$Kind$draw_page_apps$(_stt$1) {
        var _with_banner$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), Web$Kind$content_apps);
        var _no_banner$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "2em"), List$nil)), List$cons$(Web$Kind$content_apps_text, List$nil));
        var _games$2 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(Web$Kind$comp$heading$(Web$Kind$typography$h1, "Games"), List$cons$(_with_banner$2, List$cons$(_no_banner$3, List$nil))));
        var $286 = Web$Kind$comp$page$("apps", _stt$1, List$cons$(_games$2, List$nil));
        return $286;
    };
    const Web$Kind$draw_page_apps = x0 => Web$Kind$draw_page_apps$(x0);

    function Web$Kind$draw_page$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $288 = self.page;
                var self = $288;
                switch (self._) {
                    case 'Web.Kind.Page.home':
                        var $290 = Web$Kind$draw_page_home$(_stt$1);
                        var $289 = $290;
                        break;
                    case 'Web.Kind.Page.apps':
                        var $291 = Web$Kind$draw_page_apps$(_stt$1);
                        var $289 = $291;
                        break;
                };
                var $287 = $289;
                break;
        };
        return $287;
    };
    const Web$Kind$draw_page = x0 => Web$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $292 = null;
        return $292;
    };
    const IO = x0 => IO$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $294 = Bool$true;
                var $293 = $294;
                break;
            case 'Cmp.gtn':
                var $295 = Bool$false;
                var $293 = $295;
                break;
        };
        return $293;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $296 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $296;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);
    const Device$phone = ({
        _: 'Device.phone'
    });
    const Device$tablet = ({
        _: 'Device.tablet'
    });
    const Device$desktop = ({
        _: 'Device.desktop'
    });

    function Device$classify$(_width$1) {
        var self = (_width$1 <= 600);
        if (self) {
            var $298 = Device$phone;
            var $297 = $298;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $300 = Device$tablet;
                var $299 = $300;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $302 = Device$desktop;
                    var $301 = $302;
                } else {
                    var $303 = Device$big_desktop;
                    var $301 = $303;
                };
                var $299 = $301;
            };
            var $297 = $299;
        };
        return $297;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $304 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $304;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $306 = self.value;
                var $307 = _f$4($306);
                var $305 = $307;
                break;
            case 'IO.ask':
                var $308 = self.query;
                var $309 = self.param;
                var $310 = self.then;
                var $311 = IO$ask$($308, $309, (_x$8 => {
                    var $312 = IO$bind$($310(_x$8), _f$4);
                    return $312;
                }));
                var $305 = $311;
                break;
        };
        return $305;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $313 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $313;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $314 = _new$2(IO$bind)(IO$end);
        return $314;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $315 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $315;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);

    function App$store$(_value$2) {
        var $316 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $317 = _m$pure$4;
            return $317;
        }))(Dynamic$new$(_value$2));
        return $316;
    };
    const App$store = x0 => App$store$(x0);
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $318 = _m$pure$2;
        return $318;
    }))(Dynamic$new$(Unit$new));

    function Web$Kind$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $320 = self.device;
                var $321 = self.page;
                var $322 = Web$Kind$State$new$($320, $321, _id$1);
                var $319 = $322;
                break;
        };
        return $319;
    };
    const Web$Kind$set_mouse_over = x0 => x1 => Web$Kind$set_mouse_over$(x0, x1);
    const Web$Kind$Event$go_to_home = ({
        _: 'Web.Kind.Event.go_to_home'
    });
    const Web$Kind$Event$go_to_apps = ({
        _: 'Web.Kind.Event.go_to_apps'
    });
    const Web$Kind$comp$id_action = Map$from_list$(List$cons$(Pair$new$("tab_home", Web$Kind$Event$go_to_home), List$cons$(Pair$new$("tab_apps", Web$Kind$Event$go_to_apps), List$cons$(Pair$new$("btn_pri_home_go_to_apps", Web$Kind$Event$go_to_apps), List$nil))));

    function Maybe$(_A$1) {
        var $323 = null;
        return $323;
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
                        var $324 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $326 = self.lft;
                                var $327 = BitsMap$get$($324, $326);
                                var $325 = $327;
                                break;
                            case 'BitsMap.new':
                                var $328 = Maybe$none;
                                var $325 = $328;
                                break;
                        };
                        return $325;
                    case 'i':
                        var $329 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $331 = self.rgt;
                                var $332 = BitsMap$get$($329, $331);
                                var $330 = $332;
                                break;
                            case 'BitsMap.new':
                                var $333 = Maybe$none;
                                var $330 = $333;
                                break;
                        };
                        return $330;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $335 = self.val;
                                var $336 = $335;
                                var $334 = $336;
                                break;
                            case 'BitsMap.new':
                                var $337 = Maybe$none;
                                var $334 = $337;
                                break;
                        };
                        return $334;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $338 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $338;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kind$exe_event$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'Web.Kind.State.new':
                var $340 = self.device;
                var $341 = self.mouse_over;
                var _actions$6 = Web$Kind$comp$id_action;
                var self = Map$get$(_id$1, _actions$6);
                switch (self._) {
                    case 'Maybe.some':
                        var $343 = self.value;
                        var self = $343;
                        switch (self._) {
                            case 'Web.Kind.Event.go_to_home':
                                var $345 = Web$Kind$State$new$($340, Web$Kind$Page$home, $341);
                                var $344 = $345;
                                break;
                            case 'Web.Kind.Event.go_to_apps':
                                var $346 = Web$Kind$State$new$($340, Web$Kind$Page$apps, $341);
                                var $344 = $346;
                                break;
                        };
                        var $342 = $344;
                        break;
                    case 'Maybe.none':
                        var $347 = _stt$2;
                        var $342 = $347;
                        break;
                };
                var $339 = $342;
                break;
        };
        return $339;
    };
    const Web$Kind$exe_event = x0 => x1 => Web$Kind$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $348 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $348;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kind = (() => {
        var _init$1 = Web$Kind$State$new$(Device$big_desktop, Web$Kind$Page$home, "");
        var _draw$2 = (_state$2 => {
            var self = _state$2;
            switch (self._) {
                case 'Web.Kind.State.new':
                    var $351 = Web$Kind$draw_page$(_state$2);
                    var $350 = $351;
                    break;
            };
            return $350;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $353 = self.info;
                    var self = $353;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $355 = self.screen_size;
                            var self = $355;
                            switch (self._) {
                                case 'Pair.new':
                                    var $357 = self.fst;
                                    var _device$12 = Device$classify$($357);
                                    var $358 = App$store$(Web$Kind$State$new$(_device$12, Web$Kind$Page$home, ""));
                                    var $356 = $358;
                                    break;
                            };
                            var $354 = $356;
                            break;
                    };
                    var $352 = $354;
                    break;
                case 'App.Event.mouse_over':
                    var $359 = self.id;
                    var $360 = App$store$(Web$Kind$set_mouse_over$($359, _state$4));
                    var $352 = $360;
                    break;
                case 'App.Event.mouse_click':
                    var $361 = self.id;
                    var $362 = App$store$(Web$Kind$exe_event$($361, _state$4));
                    var $352 = $362;
                    break;
                case 'App.Event.resize':
                    var $363 = self.info;
                    var self = $363;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $365 = self.screen_size;
                            var self = $365;
                            switch (self._) {
                                case 'Pair.new':
                                    var $367 = self.fst;
                                    var self = _state$4;
                                    switch (self._) {
                                        case 'Web.Kind.State.new':
                                            var $369 = self.page;
                                            var $370 = self.mouse_over;
                                            var _device$14 = Device$classify$($367);
                                            var $371 = App$store$(Web$Kind$State$new$(_device$14, $369, $370));
                                            var $368 = $371;
                                            break;
                                    };
                                    var $366 = $368;
                                    break;
                            };
                            var $364 = $366;
                            break;
                    };
                    var $352 = $364;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_out':
                    var $372 = App$pass;
                    var $352 = $372;
                    break;
            };
            return $352;
        });
        var $349 = App$new$(_init$1, _draw$2, _when$3);
        return $349;
    })();
    return {
        'Web.Kind.State.new': Web$Kind$State$new,
        'Device.big_desktop': Device$big_desktop,
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
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'Pair.new': Pair$new,
        'Web.Kind.typography.body_size': Web$Kind$typography$body_size,
        'Web.Kind.typography.typeface_body': Web$Kind$typography$typeface_body,
        'Web.Kind.typography.body_strong': Web$Kind$typography$body_strong,
        'Web.Kind.typography.l': Web$Kind$typography$l,
        'Web.Kind.typography.typeface_header': Web$Kind$typography$typeface_header,
        'Web.Kind.typography.h2': Web$Kind$typography$h2,
        'Web.Kind.typography.xl': Web$Kind$typography$xl,
        'Web.Kind.typography.h1': Web$Kind$typography$h1,
        'Web.Kind.typography.body': Web$Kind$typography$body,
        'Web.Kind.img.croni': Web$Kind$img$croni,
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
        'Web.Kind.typography.button': Web$Kind$typography$button,
        'Web.Kind.constant.secondary_color': Web$Kind$constant$secondary_color,
        'Web.Kind.comp.btn_primary_solid': Web$Kind$comp$btn_primary_solid,
        'Web.Kind.typography.typeface_code': Web$Kind$typography$typeface_code,
        'Web.Kind.typography.code': Web$Kind$typography$code,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Web.Kind.constant.primary_color': Web$Kind$constant$primary_color,
        'Web.Kind.comp.heading': Web$Kind$comp$heading,
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Word.i': Word$i,
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
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'Web.Kind.typography.xxl': Web$Kind$typography$xxl,
        'Web.Kind.typography.subtitle': Web$Kind$typography$subtitle,
        'Web.Kind.comp.title_phone': Web$Kind$comp$title_phone,
        'Web.Kind.typography.xxxl': Web$Kind$typography$xxxl,
        'Web.Kind.typography.title': Web$Kind$typography$title,
        'Web.Kind.comp.title': Web$Kind$comp$title,
        'Web.Kind.constant.light_gray_color': Web$Kind$constant$light_gray_color,
        'Web.Kind.comp.header_tab': Web$Kind$comp$header_tab,
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
        'Web.Kind.comp.header_tabs': Web$Kind$comp$header_tabs,
        'Web.Kind.comp.header': Web$Kind$comp$header,
        'Web.Kind.typography.xs': Web$Kind$typography$xs,
        'Web.Kind.typography.xxs': Web$Kind$typography$xxs,
        'Web.Kind.typography.s': Web$Kind$typography$s,
        'Web.Kind.typography.h3': Web$Kind$typography$h3,
        'List.for': List$for,
        'List': List,
        'Web.Kind.comp.list': Web$Kind$comp$list,
        'Web.Kind.comp.link_white': Web$Kind$comp$link_white,
        'Web.Kind.constant.dark_pri_color': Web$Kind$constant$dark_pri_color,
        'Web.Kind.comp.footer': Web$Kind$comp$footer,
        'Web.Kind.comp.page': Web$Kind$comp$page,
        'Web.Kind.draw_page_home': Web$Kind$draw_page_home,
        'Web.Kind.comp.game_card': Web$Kind$comp$game_card,
        'Web.Kind.img.app_senhas': Web$Kind$img$app_senhas,
        'Web.Kind.img.app_tic_tac_toe': Web$Kind$img$app_tic_tac_toe,
        'Web.Kind.img.app_kaelin': Web$Kind$img$app_kaelin,
        'Web.Kind.content_apps': Web$Kind$content_apps,
        'Web.Kind.comp.link_black': Web$Kind$comp$link_black,
        'Web.Kind.content_apps_text': Web$Kind$content_apps_text,
        'Web.Kind.draw_page_apps': Web$Kind$draw_page_apps,
        'Web.Kind.draw_page': Web$Kind$draw_page,
        'IO': IO,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Device.phone': Device$phone,
        'Device.tablet': Device$tablet,
        'Device.desktop': Device$desktop,
        'Device.classify': Device$classify,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.store': App$store,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'Web.Kind.set_mouse_over': Web$Kind$set_mouse_over,
        'Web.Kind.Event.go_to_home': Web$Kind$Event$go_to_home,
        'Web.Kind.Event.go_to_apps': Web$Kind$Event$go_to_apps,
        'Web.Kind.comp.id_action': Web$Kind$comp$id_action,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kind.exe_event': Web$Kind$exe_event,
        'App.new': App$new,
        'Web.Kind': Web$Kind,
    };
})();

/***/ })

}]);
//# sourceMappingURL=464.index.js.map