(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[821],{

/***/ 821:
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
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $5 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $2 = c0;
                return $2;
            } else {
                var $3 = (self - 1n);
                var $4 = c1($3);
                return $4;
            };
        })();
        return $5;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $11 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $6 = self.slice(0, -1);
                    var $7 = c1($6);
                    return $7;
                case 'i':
                    var $8 = self.slice(0, -1);
                    var $9 = c2($8);
                    return $9;
                case 'e':
                    var $10 = c0;
                    return $10;
            };
        })();
        return $11;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $14 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $12 = u16_to_word(self);
                    var $13 = c0($12);
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $15 = u32_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $18 = u64_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $25 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $21 = c0;
                return $21;
            } else {
                var $22 = self.charCodeAt(0);
                var $23 = self.slice(1);
                var $24 = c1($22)($23);
                return $24;
            };
        })();
        return $25;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $29 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $26 = buffer32_to_depth(self);
                    var $27 = buffer32_to_u32array(self);
                    var $28 = c0($26)($27);
                    return $28;
            };
        })();
        return $29;
    });

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $30 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $30;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $31 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $31;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Home$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $32 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $32;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const Unit$new = null;
    const App$Home$init = App$Store$new$("No code.", Unit$new);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $33 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $33;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $34 = null;
        return $34;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $35 = null;
        return $35;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $36 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $37 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $37;
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
                var $39 = self.pred;
                var $40 = (Word$to_bits$($39) + '0');
                var $38 = $40;
                break;
            case 'Word.i':
                var $41 = self.pred;
                var $42 = (Word$to_bits$($41) + '1');
                var $38 = $42;
                break;
            case 'Word.e':
                var $43 = Bits$e;
                var $38 = $43;
                break;
        };
        return $38;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function Nat$succ$(_pred$1) {
        var $44 = 1n + _pred$1;
        return $44;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $46 = Bits$e;
            var $45 = $46;
        } else {
            var $47 = self.charCodeAt(0);
            var $48 = self.slice(1);
            var $49 = (String$to_bits$($48) + (u16_to_bits($47)));
            var $45 = $49;
        };
        return $45;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $51 = self.head;
                var $52 = self.tail;
                var self = $51;
                switch (self._) {
                    case 'Pair.new':
                        var $54 = self.fst;
                        var $55 = self.snd;
                        var $56 = (bitsmap_set(String$to_bits$($54), $55, Map$from_list$($52), 'set'));
                        var $53 = $56;
                        break;
                };
                var $50 = $53;
                break;
            case 'List.nil':
                var $57 = BitsMap$new;
                var $50 = $57;
                break;
        };
        return $50;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $58 = null;
        return $58;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $59 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $59;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const App$Home$img$uwu_logo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCCRXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAEAAAExAAIAAAAeAAAAModpAAQAAAABAAAAUAAAAABBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKQAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAi6ADAAQAAAABAAAAQwAAAAD/4Qr8aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIwNERDOTg0QUNDNTExRUFBQUJGRjExQ0U1RkRFMzY1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIwNERDOTgzQUNDNTExRUFBQUJGRjExQ0U1RkRFMzY1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjA0REM5ODFBQ0M1MTFFQUFBQkZGMTFDRTVGREUzNjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjA0REM5ODJBQ0M1MTFFQUFBQkZGMTFDRTVGREUzNjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/wAARCABDAIsDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8f/9sAQwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/90ABAAS/9oADAMBAAIRAxEAPwD6M8Y+MNF8JaLLrOsytHZxMqARqXd3c4VEUdSaqMXJ2RcKbk7IXwl4u0bxVokOs6RK0lnKWX512OjocMjqejA05wcXZhODi7Pc3AcjNQQQ3EnlRyS9kUt1x90Zo3Y0tTxL4R/G/wAReLvGtzouq21ullcRTTWHkhlaIQt9x2LHdlD1x1rpq0Uo3Oyvhoxgmj3IdB3rmOIWgAoAKACgAoAKAOU8c/Ezwp4Jjtn124eNrtmEMUMZlchMb3Kr0Vc8mrhTctjWnRlPY6OwvrW/sre+tJRNa3UazQSr0ZHG5WGeeQagzas7MsUCGP3+nTOKAtc8L8CfHbxBrHxOl8O6pBbw6XdXFxbWQjVllikty20OxYhi4Qk10yorlud9TCpU+ZHuy9K5jgR//9DvP2qbox+E9Htu1xqIc/8AbGB2/rXVhN2duBj7zL/7Mbofhw6gYKahcBh9dp/rU4n4xY74/keujOBnrXOcZmeJrtLTw9ql052rBaTyE/7sZOacd0VTV5JHyr+zoX/4Wjpuev2S53j6xZP6134j4D1cYv3Z9fDpXnnkBQAUAFABQAUAFAHy/wDtT3DN400mDOVi05mx6F5iD+YXmu7C/D8z1cArRfqe6fCplPw28MlTkDTbYZHtGAf1FclT4mefW+NnWVBkNYc0gPjCW5/s342SXEXH2bxGSMHA2m5IYfkcfjXqWvD5HtpXpW8l+R9oL0FeYeIf/9HtP2rUJ0Lw/JjKreyqf+BW7f4V1YXc78Du/QP2VdRV/DuuacTl7a9SYr7TxAD9YzRit7ix6tJM90B4rlOE89+PGuJpPwy1f5ts18q2MI9TOQrD8I9x/CtKK946cJHmmvI8U/ZosHuPiM9yBlLKxlZm9DKyoP0zXZiX7tjtxr9yx9WjoK888kWgAoAKACgAoAKAPlv9qOIr4+0x+0mmjH1WZ678L8J6uBfunr/wD1OO++FmjANuktFktZR6NFIwA/75K1y1laTOLFK02eig5GayOchuZo4I5J5W2xRKXdj0CqMkn6AU0rjSuz4csZpdZ8fW1yoLPqWsLLHjqfOudwP5V6e0beR7j92n8j7oXoK8s8I//9L1L9pTSJL74bzXca5bS7mG6fHJ8vJikx+Ema3w0veOrBytP1R458APGFv4d8dC2vXENjrUf2V3c4RJly0DE+53J7ZrpxELrQ7sXTco+aPrUyBULMcKoyzEjAA6knpXnnj+XU+Vv2gfiLbeJ9dh0fSphNpGjufMmQ5SW7YbWxjqI1yo9Tmu7D07bnrYOjyq73O5/Zc8NyW+i6r4inTa+pzC3tCevk22csO2GkY/lWWJlrY58dVvoe6iuY4QoAKACgAoAKACgD5//aq0JmttD15UJjhkksrlx280CSLPsSjD6kV14WVro9DAy3Rk/sz+ObbTb688K6jKIVv3+1aaXOFM+AssQPYsoUj1xTxEOpWMpOSukfSW8KuScAcknj8a40jzTxD46/GPS7bSLrwt4fu1udUvV8m/uoDvS2hb767h8pkcfLjsCc4rqo0b6vQ7sLh23d7HmfwC8Kya58Q7O62ZstEH224fHy+YAVgQH13MWx6Ctq80onVi5qMLdz6+HSvPPHP/0/pzVtMtNT066069jEtpdxtDOh7o4Ib+dNOzuOMmndbnxX4/8A6z4K1mTTdRjd7JmP8AZ+oFf3dxGDlcsRtEijG5fXnJGK9KnVTXme3RrRmvMoXXjDxXdaeNPudcvptOC7RbSXMhjKdgRuBIx0Bz9apU12LVNb21Nj4c/DPXvG+pxwWcbW+jxMPtuqMp8tEyCyxngPIQowq9OpqatVRXmZ1q6gvM+ydE0aw0bSbTS9OiEFnZxLDBGOyqMc+pPUnua81ybd2eNKbk7svcDikSUpdZ0qO/TT3vIVv5VLR2bSIJmUdSIydx/KnZj5Xa9tC6OlIRFPcwwI0kzrFEv3nchVH1JppXBJt6Do5UkQOjBlYZDAggj2I4pBYeOlAET3MAlERkUSsMrHkbiB1IXqaaQ7PsZHjHwrp3inw5e6FqH+ovIyBIBlo3XlJF90YA++MU4Ssyqc3CV0fGXjDwbr/hDVn07WrcxMGza3i5EEygnEkbjAHXODgg8V6UKiktD26VZTXYpXPiXX7mAQ3esXk1uBgRy3crIP8AgLuQeKr2aXQPZxXRGl4O+H/inxbdra6HYMYCcSX8gKWsQP3maQg7vooJJ4qJTUVqTVrRitT62+HHw80vwRoC6dZt511KRJf3xG1ppfXHOFUcKM8CuCpUcnc8itVdR67HXLworMyP/9T6nOMn3oAydRbw9qUz6JqCQXjONz2UyLIpC88qwIyAc+tOL7GypVIx50tO5y1v8OPg/DqkqxaJYfbrb99KhTcABySVbKnGc4qvay7m0vb8qlrZ7HYaPc6TPZgaX5f2SM7FWJQiLjsFAGOvpUu7MK1OcJWndM0R0pGQ1s0A9j408aajP/wuzUNQ8xluLbW0SKYH5lWGRY1CtwQAqnGDXowXufI9qlFezXpc+y1wABXnHinz1+1ffTE+HdNEpNrL9puLi2yQrNGEEbOB1AJOPTtXXhVuejgI7s3v2YdfkvPB15o88rSTaVdERB23FYJlDIBnoA4YAdqjEwszPGwtJM9m3dK52cJ8deNNd1C8+NtzqEN1IJrbWIrWzkVj8iQyJFhBngEA5A65r0YwSh8j2qUEqXqj7GC96848ZFW/07T7+3e2v7WK7t25aGZFkQ/VWBH6U02hqbW25yVh4X+FCtc3dpo+nbrRj58n2dPlI7gMP5VXtJd2dcqVdWTv72xrXPirQ7DTba5tx5lpOxWIQLgKF4Y4G3GPSochwwFSU3GWjXc34JY5YI5YzuSQBlPqGGQfyNBxyi02nuiSgR//1fqZjj5uwoA858MO194wmv25VDNMx9AfkXn6dKSPosdH2eGUO9ippBa6vdauh977JdSe+ZOBzUm+JSjGnH+9Ffmb3w1b/Rb5OySJjjHVfT8Ko4M6d5Q9Dth0pniiGkB8V/GTT59O+KHiGIrskkuReQH1E6iVWB9myD6V6dGV4nt4Zp019x9QeD/iZ4X1fwfZ6zPqdvbMIF+3pNIiNFMgxKrBiCMMDj1HSuGdNpnl1KMlJ6dT5o+Mfj238ZeNJL2ybdpVjELTT3PHmKGy8uD2dzge2K7qFNxWp6WGpOENdxPg349j8G+MYru8cjR79Ba6keyKWzFLjr8jcE+hNFaF0ViaXPHzPprxX8UPCGgaDNqjalbXD+UWs7aGVZJJnIyiqiEnDHHPauCNKTZ5NOhKTtZnyr8PbK7174k6IkgMk1zqS3l3jn5Y5PPlY/TGK76j5Y/I9eq1Gm/Q+3F6CvNPDIbri3mPcI38qC6a95ep5l4Zge40/W4+Tm0DY6klSWH8qk+kxzSlTfmitBmfwzcALkWd1HKcdlnXY3p1I/Wg6JSSxC/vRa+a1O+8F3Zn8P2+45aHdEf+AEgfpiqR87mEOWs/PU3xQcR//9b6mdAwIPQjBoBOzuYth4astLguxZBmlnVsFzkjg4UdOMmg66mLlVlHn2TX4GL4O8N3sNpfrfxGF7lPs6gkE7cEM3uCeRSsd2Y45OUXDVRdzX8KeHZtFt545pVmeZs5QEDA4Xr3xTOTH4xV5JpWSRvjpQcKFoA8e+PHwku/FUcOuaEqNrtknlS2xIX7TByQFY8CSMk7SR0JHpXRQq8r12OvDYjk0eqPmq68L+Ira6Nvd6JfR3KHDRm1mJyOn3VIP1zXbzLyPT9pDuelfDL4DeIdc1CC+8S2r6bocTB5LabK3FzjGIwvBRGH3mODjgDnIyq4hLRbnPXxaSstWU/if8FPEXhrVLi80ezm1Lw9O7PA9urSS26tyYpUAZ9q9FcA8dcUqFZPfcdDEqej0ZwukeD/ABTqlyIdM0S8nmY9VtnQDJ6l3CqB7k4rVzS7G8qsI63R9K/BL4NzeD0k1rW2R9euI/KSGM7ktos5Khu7sQNx9OBxXHWrOWh5uJxPPotj1xRgADp2rnRxkc0e+NkPRgRn60Di7O5z3hzwm2lJerJMsv2oeWhUYKpgjn1PNKx6GLx/teWy+EZongxLGxvbS6mE6Xg2ZUbdqDO3HXkE5osPE5g5zjJK3Kauh6Lb6RaG1t2Z1Zy5LnnJ+lNHLicS60uZ9jUHSg5z/9f6oNACEDFAWAevegQtAxRQAUANPJalLYGGB+VK4CYGc456Z9qEJi4FUykIAOTj1pXAdtHpQhC0wCgAxQAEUAGBQAUAf//Z";

    function DOM$text$(_value$1) {
        var $60 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $60;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function App$Home$draw$(_state$1) {
        var $61 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-flow", "row nowrap"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("padding-top", "12px"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Home$img$uwu_logo), List$nil)), Map$from_list$(List$cons$(Pair$new$("transform", "scale(0.666)"), List$nil)), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("border-radius", "16px"), List$cons$(Pair$new$("background-color", "rgb(245,245,245)"), List$cons$(Pair$new$("width", "640px"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("List/quicksort.kind"), List$nil)), List$cons$(DOM$node$("pre", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$((() => {
            var self = _state$1;
            switch (self._) {
                case 'App.Store.new':
                    var $62 = self.local;
                    var $63 = $62;
                    return $63;
            };
        })()), List$nil)), List$nil))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("width", "42px"), List$cons$(Pair$new$("height", "42px"), List$cons$(Pair$new$("border-radius", "21px"), List$cons$(Pair$new$("background-color", "green"), List$cons$(Pair$new$("margin", "8px 16px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("color", "white"), List$nil))))))))))), List$cons$(DOM$text$("User"), List$nil)), List$nil))));
        return $61;
    };
    const App$Home$draw = x0 => App$Home$draw$(x0);

    function IO$(_A$1) {
        var $64 = null;
        return $64;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $65 = null;
        return $65;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $67 = self.fst;
                var $68 = $67;
                var $66 = $68;
                break;
        };
        return $66;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $69 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $69;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $71 = self.value;
                var $72 = _f$4($71);
                var $70 = $72;
                break;
            case 'IO.ask':
                var $73 = self.query;
                var $74 = self.param;
                var $75 = self.then;
                var $76 = IO$ask$($73, $74, (_x$8 => {
                    var $77 = IO$bind$($75(_x$8), _f$4);
                    return $77;
                }));
                var $70 = $76;
                break;
        };
        return $70;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $78 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $78;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $79 = _new$2(IO$bind)(IO$end);
        return $79;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$request$(_url$1) {
        var $80 = IO$ask$("request", _url$1, (_text$2 => {
            var $81 = IO$end$(_text$2);
            return $81;
        }));
        return $80;
    };
    const IO$request = x0 => IO$request$(x0);

    function App$set_local$(_value$2) {
        var $82 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $83 = _m$pure$4;
            return $83;
        }))(Maybe$some$(_value$2));
        return $82;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $84 = _m$pure$3;
        return $84;
    }))(Maybe$none);

    function App$Home$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $86 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $87 = _m$bind$6;
                    return $87;
                }))(IO$request$("http://uwu.tech:7172/List.kind"))((_file$6 => {
                    var $88 = App$set_local$(_file$6);
                    return $88;
                }));
                var $85 = $86;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $89 = App$pass;
                var $85 = $89;
                break;
            case 'App.Event.mouse_down':
                var $90 = App$set_local$((() => {
                    var self = _state$2;
                    switch (self._) {
                        case 'App.Store.new':
                            var $91 = self.local;
                            var $92 = $91;
                            return $92;
                    };
                })());
                var $85 = $90;
                break;
        };
        return $85;
    };
    const App$Home$when = x0 => x1 => App$Home$when$(x0, x1);

    function App$no_tick$(_tick$2, _glob$3) {
        var $93 = _glob$3;
        return $93;
    };
    const App$no_tick = x0 => x1 => App$no_tick$(x0, x1);
    const App$Home$tick = App$no_tick;

    function App$Home$post$(_time$1, _room$2, _addr$3, _data$4, _global_state$5) {
        var $94 = _global_state$5;
        return $94;
    };
    const App$Home$post = x0 => x1 => x2 => x3 => x4 => App$Home$post$(x0, x1, x2, x3, x4);
    const App$Home = App$new$(App$Home$init, App$Home$draw, App$Home$when, App$Home$tick, App$Home$post);
    return {
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.Home.State': App$Home$State,
        'App.Store.new': App$Store$new,
        'Unit.new': Unit$new,
        'App.Home.init': App$Home$init,
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
        'App.Home.img.uwu_logo': App$Home$img$uwu_logo,
        'DOM.text': DOM$text,
        'App.Home.draw': App$Home$draw,
        'IO': IO,
        'Maybe': Maybe,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.request': IO$request,
        'App.set_local': App$set_local,
        'App.pass': App$pass,
        'App.Home.when': App$Home$when,
        'App.no_tick': App$no_tick,
        'App.Home.tick': App$Home$tick,
        'App.Home.post': App$Home$post,
        'App.Home': App$Home,
    };
})();

/***/ })

}]);
//# sourceMappingURL=821.index.js.map