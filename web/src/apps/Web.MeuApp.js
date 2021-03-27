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
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $2 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $0 = c2;
                return $0;
            } else {
                var $1 = c2;
                return $1;
            };
        })();
        return $2;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $6 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $3 = c2;
                return $3;
            } else {
                var $4 = (self - 1n);
                var $5 = c2($4);
                return $5;
            };
        })();
        return $6;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $9 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $7 = u16_to_word(self);
                    var $8 = c0($7);
                    return $8;
            };
        })();
        return $9;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $10 = u32_to_word(self);
                    var $11 = c0($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $15 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $13 = u64_to_word(self);
                    var $14 = c0($13);
                    return $14;
            };
        })();
        return $15;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $20 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $16 = c2;
                return $16;
            } else {
                var $17 = self.charCodeAt(0);
                var $18 = self.slice(1);
                var $19 = c2($17)($18);
                return $19;
            };
        })();
        return $20;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $21 = buffer32_to_depth(self);
                    var $22 = buffer32_to_u32array(self);
                    var $23 = c0($21)($22);
                    return $23;
            };
        })();
        return $24;
    });

    function App$Render$txt$(_text$1) {
        var $25 = ({
            _: 'App.Render.txt',
            'text': _text$1
        });
        return $25;
    };
    const App$Render$txt = x0 => App$Render$txt$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function App$Action$(_S$1) {
        var $26 = null;
        return $26;
    };
    const App$Action = x0 => App$Action$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $27 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $27;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$MeuApp = App$new$(0n, (_state$1 => {
        var $28 = App$Render$txt$("oi tudo bem?");
        return $28;
    }), (_event$1 => _state$2 => {
        var $29 = List$nil;
        return $29;
    }));
    return {
        'App.Render.txt': App$Render$txt,
        'List.nil': List$nil,
        'App.Action': App$Action,
        'App.new': App$new,
        'Web.MeuApp': Web$MeuApp,
    };
})();