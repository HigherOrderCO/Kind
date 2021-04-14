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
                var $2 = c2;
                return $2;
            } else {
                var $3 = (self - 1n);
                var $4 = c2($3);
                return $4;
            };
        })();
        return $5;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $8 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $6 = u16_to_word(self);
                    var $7 = c0($6);
                    return $7;
            };
        })();
        return $8;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $11 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $9 = u32_to_word(self);
                    var $10 = c0($9);
                    return $10;
            };
        })();
        return $11;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $14 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $12 = u64_to_word(self);
                    var $13 = c0($12);
                    return $13;
            };
        })();
        return $14;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $19 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $15 = c2;
                return $15;
            } else {
                var $16 = self.charCodeAt(0);
                var $17 = self.slice(1);
                var $18 = c2($16)($17);
                return $18;
            };
        })();
        return $19;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $20 = buffer32_to_depth(self);
                    var $21 = buffer32_to_u32array(self);
                    var $22 = c0($20)($21);
                    return $22;
            };
        })();
        return $23;
    });

    function App$new$(_init$2, _draw$3, _when$4) {
        var $24 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $24;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Unit$new = null;

    function DOM$text$(_value$1) {
        var $25 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $25;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function IO$(_A$1) {
        var $26 = null;
        return $26;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $27 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $27;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $29 = self.value;
                var $30 = _f$4($29);
                var $28 = $30;
                break;
            case 'IO.ask':
                var $31 = self.query;
                var $32 = self.param;
                var $33 = self.then;
                var $34 = IO$ask$($31, $32, (_x$8 => {
                    var $35 = IO$bind$($33(_x$8), _f$4);
                    return $35;
                }));
                var $28 = $34;
                break;
        };
        return $28;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $36 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $36;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $37 = _new$2(IO$bind)(IO$end);
        return $37;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $38 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $38;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $39 = _m$pure$2;
        return $39;
    }))(Dynamic$new$(Unit$new));
    const Web$Kaelin = App$new$(Unit$new, (_s$1 => {
        var $40 = DOM$text$("TODO");
        return $40;
    }), (_e$1 => _s$2 => {
        var $41 = App$pass;
        return $41;
    }));
    return {
        'App.new': App$new,
        'Unit.new': Unit$new,
        'DOM.text': DOM$text,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'Web.Kaelin': Web$Kaelin,
    };
})();