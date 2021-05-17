(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[317],{

/***/ 317:
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

    function App$Store$new$(_local$2, _global$3) {
        var $33 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $33;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);

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
    const App$Kind$State = App$State$new;

    function App$Kind$State$local$new$(_device$1, _page$2, _mouse_over$3) {
        var $35 = ({
            _: 'App.Kind.State.local.new',
            'device': _device$1,
            'page': _page$2,
            'mouse_over': _mouse_over$3
        });
        return $35;
    };
    const App$Kind$State$local$new = x0 => x1 => x2 => App$Kind$State$local$new$(x0, x1, x2);
    const Device$big_desktop = ({
        _: 'Device.big_desktop'
    });
    const App$Kind$Page$home = ({
        _: 'App.Kind.Page.home'
    });
    const Unit$new = null;

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
    const App$Kind$typography$body_size = "12pt";
    const App$Kind$typography$typeface_body = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const App$Kind$typography$body_strong = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "800"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));
    const App$Kind$typography$l = "16pt";
    const App$Kind$typography$typeface_header = "\'Lato\', \'Helvetica\', \'Verdana\', sans-serif";
    const App$Kind$typography$h2 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$l), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const App$Kind$typography$xl = "18pt";
    const App$Kind$typography$h1 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const App$Kind$typography$body = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_body), List$cons$(Pair$new$("font-weight", "300"), List$cons$(Pair$new$("line-height", "1.35"), List$nil)))));
    const App$Kind$img$croni = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAxhJREFUSIm1lz9IW1EUh79YR0lTxFhsIKZJOigSMBA6NGnrH5yKUHARHCrYIqGDYMeqtKMBp1BqoR0EOzhlFKND7SApFkpopqQhkIY2JUMzuaWDvdf73rvvvSr1DIF73rv3u79z7znnxcPlWMflucdzGcC155sAjE/G5YP9vWPWXj4G8Mif/wUVQDfoRcC2IbSDAiRTcQur+zzAofA0AAO9AUaCIQCKtSqNVl0o4vDDsWHi/p5xLMxNsS1QZ8ValXwha4Dr1IKz4s5QeJqB3oB0OEHPnqdJpuIW5WbrcoJexEaCISYSaaH03GAAg9p/sWKtysbOssH399JZLqUObKu2WKs6gvOFLGvPN8kXstJnvuFOYABKlRz5QpZGqw5Ao1UnX8iysbNsUWXelJpaytigWgsuVXL4vWH83jClSo5Gq27w+b1hLVw19XKNT8YtcFvFR8N9HA33SbjfG5Y+wADXHYE5f80h14EtOef3hu32J6HifJ3gqmrbPL799Zejr9muMJFIA8h7oLP9vWPtBbMLtafZrtguZoaWKjkAWTZ1cLM51upmu2IJc7NdYSg8bQCqFU7AzWE3m12tluVSzUmziXfMpVTUbEtaKa3xig4KEItOAHDzRoJv3z+xuLCOr/uWHNtBAfp91+jpifL2/Qr37j6wQMEm1KJyjQRDhlS5MxXj4+4X2wioJhqGcu6G6Govl1NHisYGmUik5fk6lVHRMHRmBp+rKzmlkQoXa9uBDVAxYWNnmcWFdenvv36VaGzQsLhb81BUW0qmAWpW8urNMwB+/vhtWVS8W6xVLRvY/XwofUszGZZmMhIuDtzytdFo1ZkaTbo2A3We2IQY69JsNTNPMhWnC+iIUDZadfnyQG/ANYRm1QO9AaZGk4wEQxboia/Damae7a0DQDnj1+9WgNPwiIliciQSkQtEIhHD2GzmzZ74Ojx8ep/ZuTG2tw7Escl/Ep3FhXVm58YAePLoBXDalwWkXC4bNiHGcJb3QnU0NijXAlQgaP5JdADUDSRTcUd1wsrlsvarUgfUDtQNuLzjNsd1/h9Ji2BZJdnEIwAAAABJRU5ErkJggg==";

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $65 = self.val;
                var $66 = self.lft;
                var $67 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $69 = self.val;
                        var $70 = self.lft;
                        var $71 = self.rgt;
                        var self = $65;
                        switch (self._) {
                            case 'Maybe.none':
                                var $73 = BitsMap$tie$($69, BitsMap$union$($66, $70), BitsMap$union$($67, $71));
                                var $72 = $73;
                                break;
                            case 'Maybe.some':
                                var $74 = BitsMap$tie$($65, BitsMap$union$($66, $70), BitsMap$union$($67, $71));
                                var $72 = $74;
                                break;
                        };
                        var $68 = $72;
                        break;
                    case 'BitsMap.new':
                        var $75 = _a$2;
                        var $68 = $75;
                        break;
                };
                var $64 = $68;
                break;
            case 'BitsMap.new':
                var $76 = _b$3;
                var $64 = $76;
                break;
        };
        return $64;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function Map$union$(_a$2, _b$3) {
        var $77 = BitsMap$union$(_a$2, _b$3);
        return $77;
    };
    const Map$union = x0 => x1 => Map$union$(x0, x1);
    const App$Kind$typography$button = Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "600"), List$cons$(Pair$new$("line-height", "1"), List$nil))))));
    const App$Kind$constant$secondary_color = "#3891A6";

    function App$Kind$comp$btn_primary_solid$(_title$1, _id$2) {
        var $78 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$2), List$nil)), Map$union$(App$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("background-color", App$Kind$constant$secondary_color), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border-radius", "7px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))))))), List$cons$(DOM$text$(_title$1), List$nil));
        return $78;
    };
    const App$Kind$comp$btn_primary_solid = x0 => x1 => App$Kind$comp$btn_primary_solid$(x0, x1);
    const App$Kind$typography$typeface_code = "\'apl385\', \'Anonymous Pro\', \'Monaco\', \'Courier New\', monospace";
    const App$Kind$typography$code = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_code), List$cons$(Pair$new$("font-weight", "400"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));

    function String$cons$(_head$1, _tail$2) {
        var $79 = (String.fromCharCode(_head$1) + _tail$2);
        return $79;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const App$Kind$constant$primary_color = "#71558C";

    function App$Kind$comp$heading$(_typography$1, _title$2) {
        var $80 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_typography$1, Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$nil))), List$cons$(DOM$text$(_title$2), List$nil));
        return $80;
    };
    const App$Kind$comp$heading = x0 => x1 => App$Kind$comp$heading$(x0, x1);

    function Buffer32$new$(_depth$1, _array$2) {
        var $81 = u32array_to_buffer32(_array$2);
        return $81;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $82 = null;
        return $82;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $83 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $83;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $84 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $84;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $86 = Array$tip$(_x$3);
            var $85 = $86;
        } else {
            var $87 = (self - 1n);
            var _half$5 = Array$alloc$($87, _x$3);
            var $88 = Array$tie$(_half$5, _half$5);
            var $85 = $88;
        };
        return $85;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $89 = word_to_u32(_value$1);
        return $89;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $90 = null;
        return $90;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $91 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $91;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $93 = Word$e;
            var $92 = $93;
        } else {
            var $94 = (self - 1n);
            var $95 = Word$o$(Word$zero$($94));
            var $92 = $95;
        };
        return $92;
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
                        var $96 = self.pred;
                        var $97 = Word$bit_length$go$($96, Nat$succ$(_c$3), _n$4);
                        return $97;
                    case 'Word.i':
                        var $98 = self.pred;
                        var $99 = Word$bit_length$go$($98, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $99;
                    case 'Word.e':
                        var $100 = _n$4;
                        return $100;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $101 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $101;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $103 = u32_to_word(self);
                var $104 = Word$bit_length$($103);
                var $102 = $104;
                break;
        };
        return $102;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $105 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $105;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $107 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $109 = Word$i$(Word$shift_left$one$go$($107, Bool$false));
                    var $108 = $109;
                } else {
                    var $110 = Word$o$(Word$shift_left$one$go$($107, Bool$false));
                    var $108 = $110;
                };
                var $106 = $108;
                break;
            case 'Word.i':
                var $111 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $113 = Word$i$(Word$shift_left$one$go$($111, Bool$true));
                    var $112 = $113;
                } else {
                    var $114 = Word$o$(Word$shift_left$one$go$($111, Bool$true));
                    var $112 = $114;
                };
                var $106 = $112;
                break;
            case 'Word.e':
                var $115 = Word$e;
                var $106 = $115;
                break;
        };
        return $106;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $117 = self.pred;
                var $118 = Word$o$(Word$shift_left$one$go$($117, Bool$false));
                var $116 = $118;
                break;
            case 'Word.i':
                var $119 = self.pred;
                var $120 = Word$o$(Word$shift_left$one$go$($119, Bool$true));
                var $116 = $120;
                break;
            case 'Word.e':
                var $121 = Word$e;
                var $116 = $121;
                break;
        };
        return $116;
    };
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);

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
                    var $122 = _value$3;
                    return $122;
                } else {
                    var $123 = (self - 1n);
                    var $124 = Word$shift_left$($123, Word$shift_left$one$(_value$3));
                    return $124;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $126 = self.pred;
                var $127 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $129 = self.pred;
                            var $130 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $132 = Word$i$(Word$adder$(_a$pred$10, $129, Bool$false));
                                    var $131 = $132;
                                } else {
                                    var $133 = Word$o$(Word$adder$(_a$pred$10, $129, Bool$false));
                                    var $131 = $133;
                                };
                                return $131;
                            });
                            var $128 = $130;
                            break;
                        case 'Word.i':
                            var $134 = self.pred;
                            var $135 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $137 = Word$o$(Word$adder$(_a$pred$10, $134, Bool$true));
                                    var $136 = $137;
                                } else {
                                    var $138 = Word$i$(Word$adder$(_a$pred$10, $134, Bool$false));
                                    var $136 = $138;
                                };
                                return $136;
                            });
                            var $128 = $135;
                            break;
                        case 'Word.e':
                            var $139 = (_a$pred$8 => {
                                var $140 = Word$e;
                                return $140;
                            });
                            var $128 = $139;
                            break;
                    };
                    var $128 = $128($126);
                    return $128;
                });
                var $125 = $127;
                break;
            case 'Word.i':
                var $141 = self.pred;
                var $142 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $144 = self.pred;
                            var $145 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $147 = Word$o$(Word$adder$(_a$pred$10, $144, Bool$true));
                                    var $146 = $147;
                                } else {
                                    var $148 = Word$i$(Word$adder$(_a$pred$10, $144, Bool$false));
                                    var $146 = $148;
                                };
                                return $146;
                            });
                            var $143 = $145;
                            break;
                        case 'Word.i':
                            var $149 = self.pred;
                            var $150 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $152 = Word$i$(Word$adder$(_a$pred$10, $149, Bool$true));
                                    var $151 = $152;
                                } else {
                                    var $153 = Word$o$(Word$adder$(_a$pred$10, $149, Bool$true));
                                    var $151 = $153;
                                };
                                return $151;
                            });
                            var $143 = $150;
                            break;
                        case 'Word.e':
                            var $154 = (_a$pred$8 => {
                                var $155 = Word$e;
                                return $155;
                            });
                            var $143 = $154;
                            break;
                    };
                    var $143 = $143($141);
                    return $143;
                });
                var $125 = $142;
                break;
            case 'Word.e':
                var $156 = (_b$5 => {
                    var $157 = Word$e;
                    return $157;
                });
                var $125 = $156;
                break;
        };
        var $125 = $125(_b$3);
        return $125;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $158 = Word$adder$(_a$2, _b$3, Bool$false);
        return $158;
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
                        var $159 = self.pred;
                        var $160 = Word$mul$go$($159, Word$shift_left$(1n, _b$4), _acc$5);
                        return $160;
                    case 'Word.i':
                        var $161 = self.pred;
                        var $162 = Word$mul$go$($161, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $162;
                    case 'Word.e':
                        var $163 = _acc$5;
                        return $163;
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
                var $165 = self.pred;
                var $166 = Word$o$(Word$to_zero$($165));
                var $164 = $166;
                break;
            case 'Word.i':
                var $167 = self.pred;
                var $168 = Word$o$(Word$to_zero$($167));
                var $164 = $168;
                break;
            case 'Word.e':
                var $169 = Word$e;
                var $164 = $169;
                break;
        };
        return $164;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $170 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $170;
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
                    var $171 = _x$4;
                    return $171;
                } else {
                    var $172 = (self - 1n);
                    var $173 = Nat$apply$($172, _f$3, _f$3(_x$4));
                    return $173;
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
                var $175 = self.pred;
                var $176 = Word$i$($175);
                var $174 = $176;
                break;
            case 'Word.i':
                var $177 = self.pred;
                var $178 = Word$o$(Word$inc$($177));
                var $174 = $178;
                break;
            case 'Word.e':
                var $179 = Word$e;
                var $174 = $179;
                break;
        };
        return $174;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $180 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $180;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $181 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $181;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $182 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $182;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const App$Kind$typography$xxl = "21pt";
    const App$Kind$typography$subtitle = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xxl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function App$Kind$comp$title_phone$(_title$1) {
        var $183 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$subtitle, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $183;
    };
    const App$Kind$comp$title_phone = x0 => App$Kind$comp$title_phone$(x0);
    const App$Kind$typography$xxxl = "24pt";
    const App$Kind$typography$title = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$xxxl), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("line-height", "1.5"), List$nil))))));

    function App$Kind$comp$title$(_title$1) {
        var $184 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$title, Map$from_list$(List$cons$(Pair$new$("margin-top", "1em"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$text$(_title$1), List$nil));
        return $184;
    };
    const App$Kind$comp$title = x0 => App$Kind$comp$title$(x0);
    const App$Kind$constant$light_gray_color = "#D3D3D3";

    function App$Kind$comp$header_tab$(_is_active$1, _is_hover$2, _title$3, _id$4) {
        var _normal$5 = Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 1em"), List$cons$(Pair$new$("font-weight", "500"), List$cons$(Pair$new$("font-size", "1.1em"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))));
        var _active$6 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", App$Kind$constant$secondary_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var _hover$7 = Map$from_list$(List$cons$(Pair$new$("border-style", "none none solid none"), List$cons$(Pair$new$("border-color", App$Kind$constant$light_gray_color), List$cons$(Pair$new$("border-width", "thin"), List$nil))));
        var $185 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", _id$4), List$nil)), (() => {
            var self = _is_active$1;
            if (self) {
                var $186 = Map$union$(_normal$5, _active$6);
                return $186;
            } else {
                var self = _is_hover$2;
                if (self) {
                    var $188 = Map$union$(_normal$5, _hover$7);
                    var $187 = $188;
                } else {
                    var $189 = _normal$5;
                    var $187 = $189;
                };
                return $187;
            };
        })(), List$cons$(DOM$text$(_title$3), List$nil));
        return $185;
    };
    const App$Kind$comp$header_tab = x0 => x1 => x2 => x3 => App$Kind$comp$header_tab$(x0, x1, x2, x3);

    function App$Kind$helper$is_eql$(_src$1, _trg$2) {
        var self = _src$1;
        switch (self._) {
            case 'App.Kind.Page.home':
                var self = _trg$2;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $192 = Bool$true;
                        var $191 = $192;
                        break;
                    case 'App.Kind.Page.apps':
                        var $193 = Bool$false;
                        var $191 = $193;
                        break;
                };
                var $190 = $191;
                break;
            case 'App.Kind.Page.apps':
                var self = _trg$2;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $195 = Bool$false;
                        var $194 = $195;
                        break;
                    case 'App.Kind.Page.apps':
                        var $196 = Bool$true;
                        var $194 = $196;
                        break;
                };
                var $190 = $194;
                break;
        };
        return $190;
    };
    const App$Kind$helper$is_eql = x0 => x1 => App$Kind$helper$is_eql$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $198 = Bool$false;
                var $197 = $198;
                break;
            case 'Cmp.eql':
                var $199 = Bool$true;
                var $197 = $199;
                break;
        };
        return $197;
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
                var $201 = self.pred;
                var $202 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$10 => {
                                var $206 = Word$cmp$go$(_a$pred$10, $204, _c$4);
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$10 => {
                                var $209 = Word$cmp$go$(_a$pred$10, $207, Cmp$ltn);
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$8 => {
                                var $211 = _c$4;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $200 = $202;
                break;
            case 'Word.i':
                var $212 = self.pred;
                var $213 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $215 = self.pred;
                            var $216 = (_a$pred$10 => {
                                var $217 = Word$cmp$go$(_a$pred$10, $215, Cmp$gtn);
                                return $217;
                            });
                            var $214 = $216;
                            break;
                        case 'Word.i':
                            var $218 = self.pred;
                            var $219 = (_a$pred$10 => {
                                var $220 = Word$cmp$go$(_a$pred$10, $218, _c$4);
                                return $220;
                            });
                            var $214 = $219;
                            break;
                        case 'Word.e':
                            var $221 = (_a$pred$8 => {
                                var $222 = _c$4;
                                return $222;
                            });
                            var $214 = $221;
                            break;
                    };
                    var $214 = $214($212);
                    return $214;
                });
                var $200 = $213;
                break;
            case 'Word.e':
                var $223 = (_b$5 => {
                    var $224 = _c$4;
                    return $224;
                });
                var $200 = $223;
                break;
        };
        var $200 = $200(_b$3);
        return $200;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $225 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $225;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $226 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $226;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const App$Kind$Page$apps = ({
        _: 'App.Kind.Page.apps'
    });

    function App$Kind$comp$header_tabs$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $228 = self.page;
                var $229 = self.mouse_over;
                var _tabs$5 = List$cons$(App$Kind$comp$header_tab$(App$Kind$helper$is_eql$(App$Kind$Page$home, $228), ("tab_home" === $229), "Home", "tab_home"), List$cons$(App$Kind$comp$header_tab$(App$Kind$helper$is_eql$(App$Kind$Page$apps, $228), ("tab_apps" === $229), "Apps", "tab_apps"), List$nil));
                var $230 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$button, Map$from_list$(List$cons$(Pair$new$("padding-top", "0.5em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), _tabs$5);
                var $227 = $230;
                break;
        };
        return $227;
    };
    const App$Kind$comp$header_tabs = x0 => App$Kind$comp$header_tabs$(x0);

    function App$Kind$comp$header$(_stt$1, _container_layout$2) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $232 = self.device;
                var _vbox$6 = VoxBox$alloc_capacity$(100);
                var _line$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin", "auto"), List$cons$(Pair$new$("max-width", "65em"), List$cons$(Pair$new$("padding", "0.5em 0"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "3pt"), List$cons$(Pair$new$("border-top", (App$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("border-bottom", (App$Kind$constant$primary_color + " dashed 1pt")), List$cons$(Pair$new$("margin-left", "10%"), List$cons$(Pair$new$("margin-right", "10%"), List$nil)))))), List$nil), List$nil));
                var $233 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "header"), List$nil)), _container_layout$2, List$cons$((() => {
                    var self = $232;
                    switch (self._) {
                        case 'Device.phone':
                            var $234 = App$Kind$comp$title_phone$("KIND language");
                            return $234;
                        case 'Device.tablet':
                        case 'Device.desktop':
                        case 'Device.big_desktop':
                            var $235 = App$Kind$comp$title$("KIND language");
                            return $235;
                    };
                })(), List$cons$(_line$7, List$cons$(App$Kind$comp$header_tabs$(_stt$1), List$nil))));
                var $231 = $233;
                break;
        };
        return $231;
    };
    const App$Kind$comp$header = x0 => x1 => App$Kind$comp$header$(x0, x1);
    const App$Kind$typography$xs = "9pt";
    const App$Kind$typography$xxs = "8pt";
    const App$Kind$typography$s = "10pt";
    const App$Kind$typography$h3 = Map$from_list$(List$cons$(Pair$new$("font-size", App$Kind$typography$body_size), List$cons$(Pair$new$("font-family", App$Kind$typography$typeface_header), List$cons$(Pair$new$("font-weight", "700"), List$cons$(Pair$new$("line-height", "1.5"), List$nil)))));
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $236 = null;
        return $236;
    };
    const List = x0 => List$(x0);

    function App$Kind$comp$list$(_items$1) {
        var _li$2 = List$nil;
        var _li$3 = (() => {
            var $239 = _li$2;
            var $240 = _items$1;
            let _li$4 = $239;
            let _item$3;
            while ($240._ === 'List.cons') {
                _item$3 = $240.head;
                var $239 = List$cons$(DOM$node$("li", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("line-height", "1.35"), List$nil)), List$cons$(_item$3, List$nil)), _li$4);
                _li$4 = $239;
                $240 = $240.tail;
            }
            return _li$4;
        })();
        var $237 = DOM$node$("ul", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("list-style-type", "none"), List$nil)), _li$3);
        return $237;
    };
    const App$Kind$comp$list = x0 => App$Kind$comp$list$(x0);

    function App$Kind$comp$link_white$(_txt$1, _font_size$2, _href$3) {
        var $241 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", _font_size$2), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$nil)))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $241;
    };
    const App$Kind$comp$link_white = x0 => x1 => x2 => App$Kind$comp$link_white$(x0, x1, x2);
    const App$Kind$constant$dark_pri_color = "#44366B";

    function App$Kind$comp$footer$(_device$1, _container_layout$2) {
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $243 = "0.5em 0";
                var _vertical_padding$3 = $243;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $244 = "1em 0";
                var _vertical_padding$3 = $244;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $245 = App$Kind$typography$xs;
                var _footer_font_size$4 = $245;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $246 = App$Kind$typography$body_size;
                var _footer_font_size$4 = $246;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $247 = App$Kind$typography$xxs;
                var _footer_font_size_s$5 = $247;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $248 = App$Kind$typography$s;
                var _footer_font_size_s$5 = $248;
                break;
        };
        var self = _device$1;
        switch (self._) {
            case 'Device.phone':
                var $249 = App$Kind$typography$h3;
                var _heading_typography$6 = $249;
                break;
            case 'Device.tablet':
            case 'Device.desktop':
            case 'Device.big_desktop':
                var $250 = App$Kind$typography$h2;
                var _heading_typography$6 = $250;
                break;
        };
        var _join_us_txt$7 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(_heading_typography$6, "Join Us"), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(App$Kind$comp$list$(List$cons$(App$Kind$comp$link_white$("Github", _footer_font_size$4, "https://github.com/uwu-tech/Kind"), List$cons$(App$Kind$comp$link_white$("Telegram", _footer_font_size$4, "https://t.me/formality_lang"), List$nil))), List$nil)), List$nil)));
        var _join_us$8 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "flex-end"), List$nil)))))), List$cons$(_join_us_txt$7, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size$4), List$nil)), List$cons$(DOM$text$("\u{2764} by UwU Tech"), List$nil)), List$nil)));
        var _join_us_wrapper$9 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", _vertical_padding$3), List$cons$(Pair$new$("background-color", App$Kind$constant$primary_color), List$nil))), List$cons$(_join_us$8, List$nil));
        var _msg_footer$10 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(_container_layout$2, Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-size", _footer_font_size_s$5), List$nil)), List$cons$(DOM$text$("This website was created using Kind!"), List$nil)), List$cons$(App$Kind$comp$link_white$("*u* show me the code!", _footer_font_size_s$5, "https://github.com/uwu-tech/Kind/blob/master/base/Web/Kind.kind"), List$nil)));
        var _msg_footer_wrapper$11 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "0.5em 0"), List$cons$(Pair$new$("background-color", App$Kind$constant$dark_pri_color), List$nil))), List$cons$(_msg_footer$10, List$nil));
        var $242 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "footer"), List$nil)), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("color", "white"), List$nil)))), List$cons$(_join_us_wrapper$9, List$cons$(_msg_footer_wrapper$11, List$nil)));
        return $242;
    };
    const App$Kind$comp$footer = x0 => x1 => App$Kind$comp$footer$(x0, x1);

    function App$Kind$comp$page$(_page_name$1, _stt$2, _body_contents$3) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $252 = self.device;
                var self = $252;
                switch (self._) {
                    case 'Device.phone':
                        var $254 = Map$from_list$(List$cons$(Pair$new$("width", "85%"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil))));
                        var _container_layout$7 = $254;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $255 = Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("max-width", "600pt"), List$cons$(Pair$new$("margin-left", "auto"), List$cons$(Pair$new$("margin-right", "auto"), List$nil)))));
                        var _container_layout$7 = $255;
                        break;
                };
                var self = $252;
                switch (self._) {
                    case 'Device.phone':
                        var $256 = "1.5em 0";
                        var _body_container_padding$8 = $256;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $257 = "2.5em 0";
                        var _body_container_padding$8 = $257;
                        break;
                };
                var _page_layout$9 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("height", "100%"), List$nil)))));
                var $253 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("page-" + _page_name$1)), List$nil)), Map$union$(App$Kind$typography$body, _page_layout$9), List$cons$(App$Kind$comp$header$(_stt$2, _container_layout$7), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "body-container"), List$nil)), Map$union$(_container_layout$7, Map$from_list$(List$cons$(Pair$new$("flex", "1"), List$cons$(Pair$new$("padding", _body_container_padding$8), List$nil)))), _body_contents$3), List$cons$(App$Kind$comp$footer$($252, _container_layout$7), List$nil))));
                var $251 = $253;
                break;
        };
        return $251;
    };
    const App$Kind$comp$page = x0 => x1 => x2 => App$Kind$comp$page$(x0, x1, x2);

    function App$Kind$draw_page_home$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $259 = self.device;
                var _span$5 = (_txt$5 => {
                    var $261 = DOM$node$("span", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$5), List$nil));
                    return $261;
                });
                var _line$6 = (_txt$6 => {
                    var $262 = DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$(_txt$6), List$nil));
                    return $262;
                });
                var _line_break$7 = DOM$node$("br", Map$from_list$(List$nil), Map$from_list$(List$nil), List$nil);
                var _span_bold$8 = (_txt$8 => {
                    var $263 = DOM$node$("span", Map$from_list$(List$nil), App$Kind$typography$body_strong, List$cons$(DOM$text$(_txt$8), List$nil));
                    return $263;
                });
                var self = $259;
                switch (self._) {
                    case 'Device.phone':
                        var $264 = "6em";
                        var _go_to_apps_height$9 = $264;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $265 = "10em";
                        var _go_to_apps_height$9 = $265;
                        break;
                };
                var self = $259;
                switch (self._) {
                    case 'Device.phone':
                        var $266 = App$Kind$typography$h2;
                        var _heading_typography$10 = $266;
                        break;
                    case 'Device.tablet':
                    case 'Device.desktop':
                    case 'Device.big_desktop':
                        var $267 = App$Kind$typography$h1;
                        var _heading_typography$10 = $267;
                        break;
                };
                var _intro$11 = DOM$node$("div", Map$from_list$(List$nil), App$Kind$typography$body, List$cons$(_span$5("Kind is a cute "), List$cons$(_span_bold$8("proof"), List$cons$(_span$5("gramming language."), List$cons$(_line_break$7, List$cons$(_line_break$7, List$cons$(_span$5("It\'s "), List$cons$(_span_bold$8("capable of everything"), List$cons$(_line$6("from web apps to games to"), List$cons$(_line$6("advanced mathematical proofs."), List$nil))))))))));
                var _croni$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-left", "3em"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-end"), List$nil)))), List$cons$(_span$5("gl hf!"), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Kind$img$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "2em"), List$cons$(Pair$new$("height", "2em"), List$nil))), List$nil), List$nil)));
                var _call_to_apps$12 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", _go_to_apps_height$9), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))), List$cons$(App$Kind$comp$btn_primary_solid$("GO TO APPS", "btn_pri_home_go_to_apps"), List$cons$(_croni$12, List$nil)));
                var _instructions$13 = DOM$node$("div", Map$from_list$(List$nil), Map$union$(App$Kind$typography$code, Map$from_list$(List$cons$(Pair$new$("margin-top", "0.5em"), List$cons$(Pair$new$("padding", "0.5em"), List$cons$(Pair$new$("box-shadow", (App$Kind$constant$primary_color + " -2px 2px 1px")), List$cons$(Pair$new$("border", "1px solid"), List$nil)))))), List$cons$(_line$6("npm i -g kind-lang"), List$cons$(_line$6("git clone https://github.com/uwu-tech/Kind"), List$cons$(_line$6("cd Kind/base"), List$cons$(_line$6("kind Main"), List$cons$(_line$6("kind Main --run"), List$nil))))));
                var _install$13 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "instructions"), List$nil)), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(_heading_typography$10, "Install"), List$cons$(_instructions$13, List$nil)));
                var $260 = App$Kind$comp$page$("home", _stt$1, List$cons$(_intro$11, List$cons$(_call_to_apps$12, List$cons$(_install$13, List$nil))));
                var $258 = $260;
                break;
        };
        return $258;
    };
    const App$Kind$draw_page_home = x0 => App$Kind$draw_page_home$(x0);

    function App$Kind$comp$game_card$(_src$1, _title$2, _path$3) {
        var _banner$4 = DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _src$1), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100px"), List$cons$(Pair$new$("height", "100px"), List$nil))), List$nil);
        var $268 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _path$3), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("text-decoration", "none"), List$nil)))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "120px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("margin", "10px 20px"), List$cons$(Pair$new$("border", "solid 1px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))))), List$cons$(_banner$4, List$cons$(DOM$text$(_title$2), List$nil))), List$nil));
        return $268;
    };
    const App$Kind$comp$game_card = x0 => x1 => x2 => App$Kind$comp$game_card$(x0, x1, x2);
    const App$Kind$img$app_senhas = "data:image/png;base64,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";
    const App$Kind$img$app_tic_tac_toe = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAdlJREFUeJztm01uglAURrFxRyylm2nSQdNBk27GpbgmHDBpFHnvwH0/lXNmTu41hw9FPjxN0zRIHm+t38B/QlkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBVAWQFkAZQGUBTiHT/z5+v378vP7I3xFq9UmC5BO1mUccwa9X6+b30TpFZnzkytMFiD3M2tFef5xa7tiPTU5K0wWIDdZs/i7gxOVqWordo41WYB0suZDvXIo9nwPVlsRMjb+onQDyZNi8QwtsddLhzC6SNbM4lFNnqFRu7x0CIYlq9AXeYXhIfNNFiDg585+ig4PnG+yAMoCnJ79HeXuruPRWLzLarIAygIoC6AswNMP+M1YhckwKAuhLICyAO0b6ai6uMIKkwXopZHeXxdXWGGyAB010uu7SqygmCxAF4106YFRizrqDevzCo30ZRxL12LbOGiybKSL00sj/Tg5fJeNdFXaN9IVLhRspBugLICyAMoC+KzDMj7rsBdlAZQFUBbAZx0AJgtgyQrmmyyAJSuYb7IAlqwAkwXosWStwLZT5KBVmKdhcXpMVv0Kw0uHePotWTtcYbIAlqwAkwVQFiD+TukLY7IAygIoC6AsgLIANxbY0ByDNCtkAAAAAElFTkSuQmCC";
    const App$Kind$img$app_kaelin = "data:image/png;base64,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";
    const App$Kind$content_apps = List$cons$(App$Kind$comp$game_card$(App$Kind$img$app_senhas, "Senhas", "App.Senhas"), List$cons$(App$Kind$comp$game_card$(App$Kind$img$app_tic_tac_toe, "TicTacToe", "App.TicTacToe"), List$cons$(App$Kind$comp$game_card$(App$Kind$img$app_kaelin, "Kaelin", "App.Kaelin"), List$nil)));

    function App$Kind$comp$link_black$(_txt$1, _href$2) {
        var $269 = DOM$node$("a", Map$from_list$(List$cons$(Pair$new$("href", _href$2), List$cons$(Pair$new$("target", "_blank"), List$nil))), Map$from_list$(List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))), List$cons$(DOM$text$(_txt$1), List$nil));
        return $269;
    };
    const App$Kind$comp$link_black = x0 => x1 => App$Kind$comp$link_black$(x0, x1);
    const App$Kind$content_apps_text = App$Kind$comp$list$(List$cons$(App$Kind$comp$link_black$("Demo", "App.Demo"), List$cons$(App$Kind$comp$link_black$("Online", "App.Online"), List$nil)));

    function App$Kind$draw_page_apps$(_stt$1) {
        var _with_banner$2 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$nil))))), App$Kind$content_apps);
        var _no_banner$3 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "2em"), List$nil)), List$cons$(App$Kind$content_apps_text, List$nil));
        var _games$2 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "game-container"), List$nil)), Map$from_list$(List$nil), List$cons$(App$Kind$comp$heading$(App$Kind$typography$h1, "Games"), List$cons$(_with_banner$2, List$cons$(_no_banner$3, List$nil))));
        var $270 = App$Kind$comp$page$("apps", _stt$1, List$cons$(_games$2, List$nil));
        return $270;
    };
    const App$Kind$draw_page_apps = x0 => App$Kind$draw_page_apps$(x0);

    function App$Kind$draw_page$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $272 = self.page;
                var self = $272;
                switch (self._) {
                    case 'App.Kind.Page.home':
                        var $274 = App$Kind$draw_page_home$(_stt$1);
                        var $273 = $274;
                        break;
                    case 'App.Kind.Page.apps':
                        var $275 = App$Kind$draw_page_apps$(_stt$1);
                        var $273 = $275;
                        break;
                };
                var $271 = $273;
                break;
        };
        return $271;
    };
    const App$Kind$draw_page = x0 => App$Kind$draw_page$(x0);

    function IO$(_A$1) {
        var $276 = null;
        return $276;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $277 = null;
        return $277;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $279 = self.fst;
                var $280 = $279;
                var $278 = $280;
                break;
        };
        return $278;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $282 = Bool$true;
                var $281 = $282;
                break;
            case 'Cmp.gtn':
                var $283 = Bool$false;
                var $281 = $283;
                break;
        };
        return $281;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $284 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $284;
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
            var $286 = Device$phone;
            var $285 = $286;
        } else {
            var self = (_width$1 <= 768);
            if (self) {
                var $288 = Device$tablet;
                var $287 = $288;
            } else {
                var self = (_width$1 <= 992);
                if (self) {
                    var $290 = Device$desktop;
                    var $289 = $290;
                } else {
                    var $291 = Device$big_desktop;
                    var $289 = $291;
                };
                var $287 = $289;
            };
            var $285 = $287;
        };
        return $285;
    };
    const Device$classify = x0 => Device$classify$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $292 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $292;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $294 = self.value;
                var $295 = _f$4($294);
                var $293 = $295;
                break;
            case 'IO.ask':
                var $296 = self.query;
                var $297 = self.param;
                var $298 = self.then;
                var $299 = IO$ask$($296, $297, (_x$8 => {
                    var $300 = IO$bind$($298(_x$8), _f$4);
                    return $300;
                }));
                var $293 = $299;
                break;
        };
        return $293;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $301 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $301;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $302 = _new$2(IO$bind)(IO$end);
        return $302;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function App$set_local$(_value$2) {
        var $303 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $304 = _m$pure$4;
            return $304;
        }))(Maybe$some$(_value$2));
        return $303;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $305 = _m$pure$3;
        return $305;
    }))(Maybe$none);

    function App$Kind$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $307 = self.device;
                var $308 = self.page;
                var $309 = App$Kind$State$local$new$($307, $308, _id$1);
                var $306 = $309;
                break;
        };
        return $306;
    };
    const App$Kind$set_mouse_over = x0 => x1 => App$Kind$set_mouse_over$(x0, x1);
    const App$Kind$Event$go_to_home = ({
        _: 'App.Kind.Event.go_to_home'
    });
    const App$Kind$Event$go_to_apps = ({
        _: 'App.Kind.Event.go_to_apps'
    });
    const App$Kind$comp$id_action = Map$from_list$(List$cons$(Pair$new$("tab_home", App$Kind$Event$go_to_home), List$cons$(Pair$new$("tab_apps", App$Kind$Event$go_to_apps), List$cons$(Pair$new$("btn_pri_home_go_to_apps", App$Kind$Event$go_to_apps), List$nil))));
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Map$get$(_key$2, _map$3) {
        var $310 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $310;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function App$Kind$exe_event$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
            case 'App.Kind.State.local.new':
                var $312 = self.device;
                var $313 = self.mouse_over;
                var _actions$6 = App$Kind$comp$id_action;
                var self = Map$get$(_id$1, _actions$6);
                switch (self._) {
                    case 'Maybe.some':
                        var $315 = self.value;
                        var self = $315;
                        switch (self._) {
                            case 'App.Kind.Event.go_to_home':
                                var $317 = App$Kind$State$local$new$($312, App$Kind$Page$home, $313);
                                var $316 = $317;
                                break;
                            case 'App.Kind.Event.go_to_apps':
                                var $318 = App$Kind$State$local$new$($312, App$Kind$Page$apps, $313);
                                var $316 = $318;
                                break;
                        };
                        var $314 = $316;
                        break;
                    case 'Maybe.none':
                        var $319 = _stt$2;
                        var $314 = $319;
                        break;
                };
                var $311 = $314;
                break;
        };
        return $311;
    };
    const App$Kind$exe_event = x0 => x1 => App$Kind$exe_event$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $320 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $320;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Kind = (() => {
        var _init$1 = App$Store$new$(App$Kind$State$local$new$(Device$big_desktop, App$Kind$Page$home, ""), Unit$new);
        var _draw$2 = (_state$2 => {
            var $322 = App$Kind$draw_page$((() => {
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $323 = self.local;
                        var $324 = $323;
                        return $324;
                };
            })());
            return $322;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $326 = self.info;
                    var self = $326;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $328 = self.screen_size;
                            var self = $328;
                            switch (self._) {
                                case 'Pair.new':
                                    var $330 = self.fst;
                                    var _device$12 = Device$classify$($330);
                                    var $331 = App$set_local$(App$Kind$State$local$new$(_device$12, App$Kind$Page$home, ""));
                                    var $329 = $331;
                                    break;
                            };
                            var $327 = $329;
                            break;
                    };
                    var $325 = $327;
                    break;
                case 'App.Event.mouse_over':
                    var $332 = self.id;
                    var $333 = App$set_local$(App$Kind$set_mouse_over$($332, (() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'App.Store.new':
                                var $334 = self.local;
                                var $335 = $334;
                                return $335;
                        };
                    })()));
                    var $325 = $333;
                    break;
                case 'App.Event.mouse_click':
                    var $336 = self.id;
                    var $337 = App$set_local$(App$Kind$exe_event$($336, (() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'App.Store.new':
                                var $338 = self.local;
                                var $339 = $338;
                                return $339;
                        };
                    })()));
                    var $325 = $337;
                    break;
                case 'App.Event.frame':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_down':
                case 'App.Event.key_up':
                case 'App.Event.input':
                    var $340 = App$pass;
                    var $325 = $340;
                    break;
            };
            return $325;
        });
        var _tick$4 = (_tick$4 => _glob$5 => {
            var $341 = _glob$5;
            return $341;
        });
        var _post$5 = (_time$5 => _room$6 => _addr$7 => _data$8 => _glob$9 => {
            var $342 = _glob$9;
            return $342;
        });
        var $321 = App$new$(_init$1, _draw$2, _when$3, _tick$4, _post$5);
        return $321;
    })();
    return {
        'App.Store.new': App$Store$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Kind.State': App$Kind$State,
        'App.Kind.State.local.new': App$Kind$State$local$new,
        'Device.big_desktop': Device$big_desktop,
        'App.Kind.Page.home': App$Kind$Page$home,
        'Unit.new': Unit$new,
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
        'App.Kind.typography.body_size': App$Kind$typography$body_size,
        'App.Kind.typography.typeface_body': App$Kind$typography$typeface_body,
        'App.Kind.typography.body_strong': App$Kind$typography$body_strong,
        'App.Kind.typography.l': App$Kind$typography$l,
        'App.Kind.typography.typeface_header': App$Kind$typography$typeface_header,
        'App.Kind.typography.h2': App$Kind$typography$h2,
        'App.Kind.typography.xl': App$Kind$typography$xl,
        'App.Kind.typography.h1': App$Kind$typography$h1,
        'App.Kind.typography.body': App$Kind$typography$body,
        'App.Kind.img.croni': App$Kind$img$croni,
        'BitsMap.union': BitsMap$union,
        'Map.union': Map$union,
        'App.Kind.typography.button': App$Kind$typography$button,
        'App.Kind.constant.secondary_color': App$Kind$constant$secondary_color,
        'App.Kind.comp.btn_primary_solid': App$Kind$comp$btn_primary_solid,
        'App.Kind.typography.typeface_code': App$Kind$typography$typeface_code,
        'App.Kind.typography.code': App$Kind$typography$code,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.Kind.constant.primary_color': App$Kind$constant$primary_color,
        'App.Kind.comp.heading': App$Kind$comp$heading,
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
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
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
        'App.Kind.typography.xxl': App$Kind$typography$xxl,
        'App.Kind.typography.subtitle': App$Kind$typography$subtitle,
        'App.Kind.comp.title_phone': App$Kind$comp$title_phone,
        'App.Kind.typography.xxxl': App$Kind$typography$xxxl,
        'App.Kind.typography.title': App$Kind$typography$title,
        'App.Kind.comp.title': App$Kind$comp$title,
        'App.Kind.constant.light_gray_color': App$Kind$constant$light_gray_color,
        'App.Kind.comp.header_tab': App$Kind$comp$header_tab,
        'App.Kind.helper.is_eql': App$Kind$helper$is_eql,
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
        'App.Kind.Page.apps': App$Kind$Page$apps,
        'App.Kind.comp.header_tabs': App$Kind$comp$header_tabs,
        'App.Kind.comp.header': App$Kind$comp$header,
        'App.Kind.typography.xs': App$Kind$typography$xs,
        'App.Kind.typography.xxs': App$Kind$typography$xxs,
        'App.Kind.typography.s': App$Kind$typography$s,
        'App.Kind.typography.h3': App$Kind$typography$h3,
        'List.for': List$for,
        'List': List,
        'App.Kind.comp.list': App$Kind$comp$list,
        'App.Kind.comp.link_white': App$Kind$comp$link_white,
        'App.Kind.constant.dark_pri_color': App$Kind$constant$dark_pri_color,
        'App.Kind.comp.footer': App$Kind$comp$footer,
        'App.Kind.comp.page': App$Kind$comp$page,
        'App.Kind.draw_page_home': App$Kind$draw_page_home,
        'App.Kind.comp.game_card': App$Kind$comp$game_card,
        'App.Kind.img.app_senhas': App$Kind$img$app_senhas,
        'App.Kind.img.app_tic_tac_toe': App$Kind$img$app_tic_tac_toe,
        'App.Kind.img.app_kaelin': App$Kind$img$app_kaelin,
        'App.Kind.content_apps': App$Kind$content_apps,
        'App.Kind.comp.link_black': App$Kind$comp$link_black,
        'App.Kind.content_apps_text': App$Kind$content_apps_text,
        'App.Kind.draw_page_apps': App$Kind$draw_page_apps,
        'App.Kind.draw_page': App$Kind$draw_page,
        'IO': IO,
        'Maybe': Maybe,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
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
        'App.set_local': App$set_local,
        'App.pass': App$pass,
        'App.Kind.set_mouse_over': App$Kind$set_mouse_over,
        'App.Kind.Event.go_to_home': App$Kind$Event$go_to_home,
        'App.Kind.Event.go_to_apps': App$Kind$Event$go_to_apps,
        'App.Kind.comp.id_action': App$Kind$comp$id_action,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'App.Kind.exe_event': App$Kind$exe_event,
        'App.new': App$new,
        'App.Kind': App$Kind,
    };
})();

/***/ })

}]);
//# sourceMappingURL=317.index.js.map