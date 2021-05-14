(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[190],{

/***/ 190:
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
    var f64 = new Float64Array(1);
    var u32 = new Uint32Array(f64.buffer);

    function f64_get_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            return (u32[0] >>> i) & 1;
        } else {
            return (u32[1] >>> (i - 32)) & 1;
        }
    };

    function f64_set_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            u32[0] = u32[0] | (1 << i);
        } else {
            u32[1] = u32[1] | (1 << (i - 32));
        }
        return f64[0];
    };

    function word_to_f64(w) {
        var x = 0;
        for (var i = 0; i < 64; ++i) {
            x = w._ === 'Word.i' ? f64_set_bit(x, i) : x;
            w = w.pred;
        };
        return x;
    };

    function f64_to_word(x) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 64; ++i) {
            w = {
                _: f64_get_bit(x, 64 - i - 1) ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function f64_make(s, a, b) {
        return (s ? 1 : -1) * Number(a) / 10 ** Number(b);
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
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $26 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $24 = f64_to_word(self);
                    var $25 = c0($24);
                    return $25;
            };
        })();
        return $26;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $31 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $27 = c0;
                return $27;
            } else {
                var $28 = self.charCodeAt(0);
                var $29 = self.slice(1);
                var $30 = c1($28)($29);
                return $30;
            };
        })();
        return $31;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $35 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $32 = buffer32_to_depth(self);
                    var $33 = buffer32_to_u32array(self);
                    var $34 = c0($32)($33);
                    return $34;
            };
        })();
        return $35;
    });
    const F64$read = a0 => (parseFloat(a0));

    function V3$new$(_x$1, _y$2, _z$3) {
        var $36 = ({
            _: 'V3.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $36;
    };
    const V3$new = x0 => x1 => x2 => V3$new$(x0, x1, x2);
    const F64$make = a0 => a1 => a2 => (f64_make(a0, a1, a2));
    const Bool$true = true;
    const F64$from_nat = a0 => (Number(a0));

    function Web$AsManga$Pad$new$(_left$1, _right$2, _up$3, _down$4) {
        var $37 = ({
            _: 'Web.AsManga.Pad.new',
            'left': _left$1,
            'right': _right$2,
            'up': _up$3,
            'down': _down$4
        });
        return $37;
    };
    const Web$AsManga$Pad$new = x0 => x1 => x2 => x3 => Web$AsManga$Pad$new$(x0, x1, x2, x3);
    const Bool$false = false;
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$sub = a0 => a1 => (a0 - a1);

    function Web$AsManga$Sprite$new$(_width$1, _height$2, _pivot_x$3, _pivot_y$4, _data$5) {
        var $38 = ({
            _: 'Web.AsManga.Sprite.new',
            'width': _width$1,
            'height': _height$2,
            'pivot_x': _pivot_x$3,
            'pivot_y': _pivot_y$4,
            'data': _data$5
        });
        return $38;
    };
    const Web$AsManga$Sprite$new = x0 => x1 => x2 => x3 => x4 => Web$AsManga$Sprite$new$(x0, x1, x2, x3, x4);

    function Web$AsManga$Assets$Among$make$(_width$1, _height$2, _data$3) {
        var _pivot_x$4 = (_width$1 / (2.0));
        var _pivot_y$5 = (_height$2 - (16.0));
        var $39 = Web$AsManga$Sprite$new$(_width$1, _height$2, _pivot_x$4, _pivot_y$5, _data$3);
        return $39;
    };
    const Web$AsManga$Assets$Among$make = x0 => x1 => x2 => Web$AsManga$Assets$Among$make$(x0, x1, x2);
    const Web$AsManga$Assets$Among$Walk$5 = Web$AsManga$Assets$Among$make$((Number(76n)), (Number(97n)), "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABhCAYAAAB8pUfDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA3FSURBVHhe7ZxtjFxVGcfP2CbW1O5uW6KJgGxtSVp52d3S7s7L4kJbTaMmrYWYmCBIMLYBpCUgQgqUGoJfsNqKLSFAkMRPbVOb+EGlS+GTpNUtRtQItk2Nxpi0bGs0Jtrd6/9/5547zz33uS8zc2dnCzwnv53Ze96e85/zdl9mzAf2gb2vbRn4LthXKpVekeCYZV+Q5gbwvrN+cDt4ERwD0xaI5ElkXMBFcBY8BZaC96z1AfaQ04BCFMW3wXvKrFDvAvYQrdHtwDJZNuvg0L6k7RbwNpBDSmt0O8iyKdz94JK0bwDON7JBRGu0Nwi+BnY4PBFwE8DEp+WNlD937lzOfS/hPXv2JWMcGklDMGzcKoBZ38Ok5iEiFxPgHiDKc7HlPwvmgllv/GTlyhdr0BZwHCsguoIqSh4mwV2gB7jlCw6AWT2vLQCRbQIIG7MEYHNVF6pNwSwngTNUZd2Ee7hZa28C12G/IU8DNjAiVgGCTYHzQPQ0t36yFsw6406czlnHfTA+/XkH/xQCKohghecQR12x+gGPdbyX8RPhviYP3DhuBnQs4jCHCuca/JPJKfAv55gGRZLI3krRUua0wnsZG70f2ApaJXSWIuBNJtuBzKfBnroGcHshWYc6JcrWw/pVWC+j8u7msh18Rx8DnF/wTyJHwRCweVpErV8g47jV4fkrtG7N2KvcCgqBYmmC2eM7gZavAKRAJCmec25TZjeXboFtswekCcYdvZavIKRYJC2+KdHUVY1wvrgZbAP21MSFeyotLz4F708gSTCWqeUrECmI1j43/mWQy2KnLr3gx8A2liBBdFUK4AQs89bpxUR8OJIfB0M4Z8XzCEbAA+AUSAlLEJ5HkDY1NXUOvHrs2LH/jo+Phxw6dMjbsGGDrIdtDuG5J15vBamG07gwk18Qe0yeVc0KwRXK5m2wBkKOq/mILjL4OPg6eBRsB38HSkDp3lGEVmxiYsIbGhrS6qcGXPR4SpdodjiGguXZAxEr2ACweRtsTxTseRBPD5aDBwHFIi8CJQwhtGuTk5OeGURpUR+sDlwAEy12cow/uaBYB4HNF+UgTogxVPDe5Qag5pFikYThWIhgCOY8SouKZnVgL1ONXc8makkwfeJeAjz0pLvUfPH0gENRivUCSAmnENoxzntmCiWdBA0/pBbqlQ1u2mQibz14xyzzfmju9XaUdoQcKm3wjpbGfJAwnPQrZp6sMADOIPq0uSom1hEQTw/WgccFfwApodfr8TYh7ER4GmEcgXOaDIcQ4L0fvo/AXkWbQOBi4QtGGr1MaqFuaB8HMhEyrQe2fdMZeN5iMwevYYUBp5ufvzgcpWAZq2OuMB1lMUIFwY9jsII9Bep+SC1Uwb4HZCJkakawcRBWJvASBVPPFfsBh6EULKOH5QqOYLFgBbsb1H2RWnwRxOw1IBMhUzOC3QXCygJ4rADBElbIpkJewfQh+RMQsxMg6jz2T3jJAVYZvInDXuepKyQXid0glmce4J5LCgZKfyt5MoQNTxKg1dDwRQr2KoiZTBzwBIi1VeFV4Oa9BtTjkwRL3OFzV+8IZnbB8Z+b6dLJDgo2Dhp+zLRgXwH1+LXmiJvBF4woF/Y8UwGuYI/DcQvF4zC1xNM2z46Ahh9SMN6ei5lMHJBXsF3AzfskqMenCZZ4heLLINqohmB13Pj2oFibQMMHKRjcjJtMHEDB7KTutllO+DcBN299/0VuTpj0Cc9T43kDyuBbwF0EiiH6AdyHYx8DjfqtWLwYoZpMHNCOYPUJn1xrJtzMEVIvRfeBzUBvdDvUhXoIrAUfxrFo3VawxIda3Awgr2Ba3tOgkT7yjwNviOhXOQSfA3rDm+ch8FWIUQPzQmHcOnmMz4AkmpsBtCNYNP2k6Y0ecLgArgd6WR3BCpUkWObjUm4GkCaYxM3XD6JpfmnWqRccJexpK0G8vK6QaUqmPIJpp0Sc06LpdptvZgpGKNrnQbzMGSfTzgEnU6uC3Qmi6W4zL+cSzPI6uBzEy54xMo27WSdTq4IxXzTdIFbKZgSz+zScr/kXJuWNlo1gLIG4L8lcBe5wjgkyraOCkUnTFz/YZcZB3H+fTCtQsKMgnnYcJ/NqRBeZ1YLtQHlqRBd5zizFi+v/AF8zbRdwMuYRbAdw8+mCfca8Hj/YZTaZe/Di+m+OgkzDfOpu5G4HxQnWZybjB7uEXVQMPsTAb9l2Xn3ONEWwMZAlGE+yrVAWXTDylrlGj5hhKNZesxlvVcF4fyPTbgMyEwrJI9gRIMUiyYJtN0/qETMMBfu0+R3eti7YGiAzoZA8guWf9MlQxpWLmeId8ylvnvk33qqCqXeJXOMDdDITCuEpTiuCvQDcdLacae9EacCN7DgXUbHkAfMMDv8HhDdvZNv5jEmmKXe+WxVsJ3DTNQQbKx11IzuOFOuc6Z3uM//A4T+C0G/Z9twmMwUFtSLYVuCmawhGDppNboKOIgXj3ft677ofhH7bdvP5ktwmn2kNCnoTpAl2CoSVBmi356KCLUG+mTxVkr2rt8TbghSsD4R+23Y39fQhnyh2BON8NAVUPwLCSgN6gZZOMuXtNI+G+yElQVvYcl02msOIZnv4GvHbtjv1KqtrsefD6t22WcEIe56W1jLl9Zjz3ts4NWFDlARt4QpFfma+gCi2hcQ23LbdqQ/QucYvJDiCcXhlCaY9wXcQaGktdccHzW+8s2ahlqAtpFBnTL/fs/rMBURZwWI3btjmpuYvGrujI9i1IEswihqpHPAcTUtrsY7XRdMeh2qHf5r53mGz0Rvz94SNuhosAhGf2eamv/Ys92KisBNA9SvgQSDTk/qDdPmZQuNe914yd0R6hwUORXDjWcgp1MkH9241+71e/3kPtw7LBHD99dvc0lcCE74Auh24TvB/Dr0KcNOTPwOZPo3Gp99vznhbzR4sCjtD5AN9hAsG2Wp2ecPmV6KcPKhXKFr+Cg0fglUEawXupjWHNeRw0YhuS+LxWplJsPfH/E19+DfN7I5fK7RJuBhoDmu4ArgUJZh2dcVMgrZsAGR9McutNCE+aeN7EWkkbnzRUFSukrxnGvOXu4O2jT1NbmRdbMWaAyJ+G5gtgn0JxPzlnN3U3ivLkr4GKCsnFwKS4h36kGYtuAX8AmiNLBJ+cBEf6CMppHe5xk+A14j4cCwvrrmMgevBW8A64jroYtOBzUBrZBo86efK/bQ4lgQvBqj1F9678ho3vJw4NcdykrZvcuFWRubl5tQd4hyC7wLtUSwfCtbyytiO2bMDzakUOPnyiu5jIOu808U9s2A5rmC7cSy2m5d0/AvySWa/n6Q5FcDLKBw63GHbRtvtgEUKksUm4NbBefAs+BFYluGPT1d+6CP2dcEGFIl7nqSh1o5g2kVLXySJkiZkK+iKKVc3yHOgmTmpFa4Hss5MLgL+INtDoGumXHDkvT5t31U0iZN5EntBV1ZEafZEXQj2UzArBeu6WDQrViAY5y2KNSsFK/wXUFoxRzA2opuC/QBwAVHFHAVdNblCdkGw8CRa8AaYvYK1eKe8CLRLNMuA3aKogt0HumpdEIxbFW6AI/cTA/aAVMH4dFJXjV9YcgTL+/1KDSu0xTbewutq2jAkg+A8sHl5qhRL9x3QVVOeJ2v2xodEikWsUH8BG0FMgIAe8Hsg86qC3Qy6aopgRBMjD7LBhKc/aUJZ7J15mfeSEowN1QTJgg3l7Txe6Esaei5WrEtDsLvB/wSKk5xbePGOjz/x1ryExwjj1Uk6BQ7DQ0ATnmg3ls0ikMdKwWvhxl8UzxCsE7D3vQU0oSzqjw/ltY4JRtsNZlCwewEfhOMQ1ISyxPKqX3JPsI4KRpsBwTgnvQbsfNWcYD09PX8drFQeI0Pl8vqV1Wra7+0XKxgqXLa6Wt1SQeXgjZUrV55bsWKFN2/eR+QCIBaBVuFdpS3TpdJx/9dFGxO6xRXJCvlbEC3riv5+b6Q6GjJcLp8YqVafHa7VHhmp1T6LNB8CFErSuq0qj65D4ftW12rvoAKPQKwIq0Yq3tXLV3ifuOLKaXL5lVd56XwyZEEvH8CLNpKClUqT4c+xZgt2BjwCaiBa1rWDgxHBfIJ2WFaXawdWl6tbRkdHFyJP84KxJ1GkkUpl0i2cuIKN1G50oFNpNNKuuE69eooetsrvZcY8DDgkJdy+EK6yK0Asv8+cOXO88ijqyxBM+jNSHj3OUYT8+QxCDSQJZSlSMDJ//ny3sRCp/SF+2WWXNS+Yj3883/OuI+XyyWhhhJV0jo/2cG+lNzonrsA+y6+5DuVTAL3eBq5gdThMUU66oTs+M9OC9S1cqInQDBGh5sydO71k6TKUbRuv19sgKpRPpTbJqQnlZdvq6uizMykYJ+bFGD7saWTBgt6m6O3rmyaLFi+evnr5cn8Rigqg19tApgUQCx1H/UZI0jJa4upI4eqro1ZJcXCekWhp0pEfLnEEUPNIgnTVG4+Uy7VtA2NjiTdNrGAuERsZGblhuFLbO1wdPYaCp7IdzIh3J+F2yaovFh9QX9z2Y+G6c3h4uCdoLk3ThPiWGKEZ1fd7X6X2MCrbN1ytvkLYjZMdlM4DrdHtkFVfrXbc+km/uW1IGnKBaZqQ0BIjmrGBAYpZxlCGQ3QsEJVdPSKo1uh2qFR+janjAHfvhPXWp5RUUdLM1cMSscSIAkyW3YnyeXojaddcfy0xS4wILC0+K+9sN+m/fS8wpf8DSX33E6ZfVCgAAAAASUVORK5CYII=");

    function Web$AsManga$State$new$(_time$1, _pos$2, _pad$3, _spd$4, _spr$5) {
        var $40 = ({
            _: 'Web.AsManga.State.new',
            'time': _time$1,
            'pos': _pos$2,
            'pad': _pad$3,
            'spd': _spd$4,
            'spr': _spr$5
        });
        return $40;
    };
    const Web$AsManga$State$new = x0 => x1 => x2 => x3 => x4 => Web$AsManga$State$new$(x0, x1, x2, x3, x4);

    function List$cons$(_head$2, _tail$3) {
        var $41 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $41;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    const Web$AsManga$Assets$Among$Walk$0 = Web$AsManga$Assets$Among$make$((Number(84n)), (Number(113n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$1 = Web$AsManga$Assets$Among$make$((Number(84n)), (Number(115n)), "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABzCAYAAAAGwiVPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA7sSURBVHhe7Z1tjB1VGcfnEjRGIt1goiQYtjWVQFSWjbvtvXuXLi6NFUEwwAc+YFtTA2jRgn4AstAXJBgTxBQx9UO1bYxfbAhool9KKQ2JRpu0otFEqi34xQ8CWxITE9Pu9f+fmefec84883rP3N2722fyy+7OzDnnOf857/OywUW7aBetgo2Au8A+cAT8ASyQRqNxAhwR4nO+C3g+w100w+4Dh0EongZE7Jgo51B8inwzWJHGUvU0eBucB65AFgUENaG4O8CKMVbTeUBh6oLCsmmYAMvapGprIvjELLFsa5edsYp3OxmgidBlHGwDczG7HTYDRKiGjTEFZZNxED+XjY0CU0ySEIECPQSOA+ywQAAL2f9LQMHHgBMf0+hy6aWXct/DYOhNSqab4RAKeBScBdjRFycBS7WWDqCw74K1YKiNQxlmxsogS9QpcCEGO73BC4QqgV8tpLSyo+JFHkq7H0hGupm7AfwbiJi+BSXnwPXASFf8EFGHzjg0MjMRZoxiMrOmmHUIigRDDFFNX8gWMDTGsV9inHkFQCNWi4Bp7AeuHzFs14fC2D69ARKZ2AvqKpFpsLPTfAEspaxFS97UTugmIGIOUlCSMl6lj0NRSlk6HUFXhSXFh6B/BK+AYzm8bJAylKKP5BHABRUMPJaecYwnjhrO77cG5QQ7LUyxXwQzCnac3qHPrF1Lyni16RiJHZ0Fnc6pxlghQdnO9sIOFPF7SYmqzNV/BDqdY42ZTEHZJLCd7YUbOOI3WRKLKezdTadiR8+AfEGvAr0wi4L4LdwBajU0Y8FOg10OB4DjZFTdybFgxhax0ejymHUBKrAJPfnsSGd222xndi5iZteMRbh/Pzgz2xnBFvwX4cjDYCSOx4bzfu9TVE4d+1i/3AyyBT0NLsmLfxxsBs+AozF/Axcinsc2j62MnV443Xnwfw/2hL0T2OnSJ2/t6WeBDH8EN8ECPAOyBf0a4lYFvQ7MgruBtsViXoOtH9t0flMk6DzYAHo+SL77Xp36Srx2KBEKZmIFOQnSBZ0HmI4mBf0oeBLsBi8AbYOYl2C7BVs/NoctFJQbS37PD8k3Ry6VjVeDbUdFAU3WgJ5+uxq7rE6JQ6RDQA3LUjkXcwZkbGwPT2KratuxhTHFJR4KiB/UgPQ1m5JpI7Eyyenb58F2ILclhGuBe77ZIRFN0E+DRLgrweOAYrLEFNjWYEPX09lpbAewHcOWZbwQYQfFTQTdDiJfRAdSuXOS0knCiCnkQYA/UpkFcn6P3aB3mjtseh0kwwCWTgq6F5TZFnLI20TQPSDyRXQgle71c8nNjKSzGpwBLE1IIRWKzvNtXgC901xBt4JEGCmdJK3tTNs0EU3yNhGUo4fIH9GBVBL0WWBlUKaD5DwiNsEJoVK83eCGizgL0gVVblF0gtvBzpiC1d3bJoKSa4HtG8fgpe0UsCKqLuhNoCcmcQV1bk9EcKwpgv4WDHITMX8HRoHtW2lB2ei6kRQS9BcgGfZWkC1oMgz4JhBBc3p3r9tJcBBIc+NB0A3AioQLFW8EazvPBTs6e4I9nZ3BrgXyUnDbwqvB9MJR9OI4sfOUEabHHpAuKNc0E2HYfoqY5Cnwc/AWqGP7K2A7zXQ4ohAxCX2x/UN3Us4eB04kM8AWRYfDIzfsMWCfZwr6EkiEYakwBXX5qUeeBloa5EEQ+QRXQzjyKW3PADuDhQV1w5GkoCIm4aM0iTB5gg6Kq0HkkwjKtYzS9hqwM7gSBb0H9HwSQblAVNrQrFmRgfoErVTl6+Zz4IOg55MIWmmWZEYUswvYouhoYZOCmn/wEZxEGK5Jahmtj4Uut4bCWf7ED/ZWqu40K7KI+gQlarj3gXuBLoBvIjG/Cj6gC4qfG0ElsyKLqFdQPpKjhqWo9wNdBJ+YYmqC9vX8kxVZhD9BRzENtXYALrjoYWOa4D5givB1sBXwGNtck9UxHwFafMJlgOet6QqpCcrHiCqvMNHMyGL8CTqDv60dMfqkYNEQYTnu7Pu5fCWBooKOADdsMUFRDDqfBMnwiwLF5G0fLy85KAkUFTR/ppQmqJDx1PEgoaDe3nFSEhicoISPHfKRbj45whcWknHWjj9B4yGCg782dCw4ZQ3siXWCgjwUJmgPhFXhVaAubkf4ef4egiovYfkTlJwNRksJ6hszbXXqG+HH4jGXE7lfQQ80tliZSpxQM2bay0LQOxovWplKnFAzZtoZY2BvhqbFjZx3LbkwL6h+AjccSQpK1J0DwhSU7ajiN5pqfzYQQY8HG5I7B4QpaEqV9yro94GTgH9BXwjuTO4cEAUE/RnwZnuAk8BW4FfQ2eBocueAKCAodvuzJ4GTgN8FZrkwcm/JOThQtqvT5eAbwJvxrTIngXoE5axpsQUd1wWt9DBDmt0InATqETQspYjbODBQ/hVciR/adHmIBZ1p5M/t6+LXwRfwYxwk/PYq6CqAmmhiP46YjlZ9jgLt3B5HEL/5ZIp6Ug18O3geP0I/nfyGGng1NwHTjwxuBqaYJF/Q1cE/FkXQa4Lv4Ufop5nXPwPv9iYwE0GivUe609kGTDHJS0A71+RC51Bw78AFDYKnQOinmdfjwLtxpmAmgkT304cc+GKCCClwDKuda3Khc3lwrnMu+NDABL0zfGZVFZSPInk3zpbMRJDodvqRgnQyrwJTTEELk2QumAt/QYIWiRP75PXghs5I8A5+3QRCH5lH4YvAu/FlLjMRJJrVMfkRlJwJ1tQq6Dw6zk8Gf8KvF4AqqNceXuw2YCaCRD8FVB9BlqCrgRZGZxxt9XxjVW2CRlWdYpKun5JPUvpxxSJ2EzATiRNO65iyBE0+wZzHlsYBS1T1pApwQSb6lWL+BnT9NPPKh+U4l58GXi3xFkjEDsAFZ5NnAXvzLcA8l5QXFElai9DuCbI/7biMFkzeQ1W/KvgnDlNMnqaNSBK8A54AXu4v3Q/grytoWa4HiTznEJX4HzR2eBN0a/ATHJKqPg80X1NBMuF7W309QcLAjIhoiZQgeq27ONKERHCpz1w/FSEF2S+YQr6Lknld8BfsFjHJHND8TIUaENbayreXKah8REBLpASsXiwVibynYAtqHtuG8fCTweOdw8Fd4fJfSGCzN3io80Swu7M5OBDOwmwxibrClIUIKvAV9tKmfJGhH6RDWAxMMVn1E/4hjxPgUbAR5ApOTUq97q1+Cax/ylZ9X4iY58DHQMK3hUZjH1+KDonC8HMeqcKKLoW/9WSWzljQywGnkW8B01mKxFdnrgCJhB3yF0rqQQS9AWh+3Q1Bu6/t42+BebsFJMKILmxTc0cAnCmYYhJEQjHFMTNRwn1M/AnAgXzCgZj/ADfsIGCnlCYmH6id74ppCypwSGiVVlOb3Kr/HWAGjilbXTkJMBdviyyuCOmdUjHkwh8GXwJmPlw4rtbicGGnqi5Gk8xS+jxwArCX1hIpAoW1X57Np6qgTIcX7iHwceDmQ+M9oMWlQVHVdvWHINWOAifAoNs+EfJNwGcCOBvTfODFooBcCUstPRmwdGpNWBZMMxHXaZBqfwdOgLQ5fF2wraWQrh8UloPyFvhwvK8KawE7UpbOsoIS+pGIN7Xax52QiRapT6TNI2+DVcDywewEFP9yMcLeDcpMMjTop9X5ngf8DxGqKQ5rkfrEFJQlx03fFETzLxeEWYuh0ZGUXrws9JPDyG78FJT/KUI1x+Fy65nVEDF/DyxHBVNMx79CIMwIBD3sSVB2flb8qYJy4u84XGX5rSwUk1U9daz4LXA74FLaIXAWaOel0b0YnBFhV5/sBVb8ZQQdxVXNG/j2C3tzLvN10+0KAKp8fCrnS2gcVkmtIJpPJua5ZBRYcTIN9SuOiqCE7Q/nupGw2OURjiBSO6GqrwSyx2UGZZHcjR9kzfxcTDEPgUR8TENd1qMjmgOSQcBekpH221MSjiETaRGmRTH6WtCF8cUt9aPaESKq5puJiMnFFXVqzTRSjQsjbgBD0JB4P++E8l582ZkQyVzkpZhe3mKD8aIkvvLTo9hzAxFsKrQ4sled+FwPq4srookWKeC8mQNywofEhFdiuJ9OjQErrBk3xfT9UWlzsVzxn52MiEY0QY+DbhjT38LromwT2IaZgQUzch9IvD5LpmbyPT/Fh1MgTVCOQKx1VNPf0s0Si7OH74dmwjh58XLXFj0YRVV8YNvIpssVlH1FYjgnOpRatXeNwkqJdRPoB765xyam3w6ojCmfNCacVLwITDF56yZxrgjqpQCwfeOVYXGXiEvBj7ySRvSft2p5UqOAyeePiSPYlwGnwKkTDYbpq3SmGUsV79/TObdZSIOdA//b1mWgjDUKUtRYuqRQaKJlMbBPsbNDYWeWRhXTRMujqMnDHJpoadwDhtI0oYpSxtg3KG9gq1DM94OhMk2gspQ1Vn/3Tq9J5nrnUjRNlH6oYtIfsLPhaEZge1n4/vtimSaCT1acaSL4ZMWZJoJPVpxpIvhkxZkmgk9Wjn2m3b56ojk9UydxUsNtyMjGyampByZb7UfXTU3vJJOt1mvr2+0T69vTnUGyzqQ1NU8/1rWmD/b8aj9Kf8ebzUGsbhUzOhMJ2IKAU0fWt1rzEA8Z0tAzXheWoOE+zac2jrVPgH0icJy1wdlka/pmXOl9k+32ac3BdJKZrpOigva40eTwZHPqgbGZmXqWE8dbrVGKONGcehfVZYHoTmWRzHSd9Cloj+b0CYobS9G/oUpPRFU56fRyxr0g0OHHkKP/UUSvausJL1dcQakB+wtI0p+giGjfRUGxj7V0w4ZPQJL+BKVFoiYTXc5YgmLYNdFqTUIKEbOwoGYACw4pKGyvCXAbcGnchezjlsNAy1Qpphxy0s+jOb0Bne/Ukcn1rUfGxsbY26u6ZBCadkDoGjuqda32vnXoAdMdNjOTPL4kBY3G0YfZVsYimqZpkkVo2gFBtbGxmZGJZnMjBsePrUdPCF4OabXhXHqGFlnQEyx9YQnEgJ4CspDEWUozTZMsuqYdJHl2iQPEHhuZmGhunJxscjq6m6BkP4eMvMx2qS5B1zWbpzBu/pVMM0k8Le7niRRNkyy6ph0kmlU9Ngwm/lela9pBolnVY8Ng4n8Fgsb/AbNQc9mG/x6zAAAAAElFTkSuQmCC");
    const Web$AsManga$Assets$Among$Walk$2 = Web$AsManga$Assets$Among$make$((Number(84n)), (Number(112n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$3 = Web$AsManga$Assets$Among$make$((Number(84n)), (Number(107n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$4 = Web$AsManga$Assets$Among$make$((Number(76n)), (Number(97n)), "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABhCAYAAAB8pUfDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAA1ySURBVHhe7Zx7iB3VHcfPJJaEhiTrpk9rjM+0kehmzd7d+9i4UUMRWjAkFfrARhBMSqQNpVhBXWOxL0jVVCVSgpv+qaGxLwg0TVZbaKHSREhbsNFYoVBsbFaLkra4O/1+Z+659zdnfjN35t659ybR3/BJ7p05j9/53nPO/ObMzJr37X17T9uV4D4wBZ6vM+2wB3wXjID3nFGgrYAi/AHMKfgO8thpQPFYznlrA4CN/CuQjU8iTTDJN8F5ZRTqW4C9QmtwElkFIyx7ElwGzmnbDGyPcgUoGivcOdvjOEfJXqA1ssEwuAPcW2enw40A3UfNW0fWxbmRPfucseXAHYKxRq4Fe8FJgB0RkCGC3X8UbAdKeayjged5FO2csMXgRRBpAGg0bgtgw/ElEWRQBbO8BW4HS0C9XNbRAIL5YD8+n9VnUg4DGybYhjTgkDoM8KUw2DsThqoV7xDomjEo5KmflWhOSKxDHHrs/swrY6pI+l0AH7rCDMAvhY8RrB/kJlCocYJ24yPXAReZViNIxyHzR4AvXYVD3BFN+lJYL+MQYmGycIusXEPLI/EvBW+CWYAMqXBosadox7LiiOb6MwE6NimWragwtLOfBsMILb+EQqwXoPUR7H7+SFp+0HEvyxUn5YUi4EMqaEEQf2n5uwDbaOfbtuY096I3KJi/0G7As1naEOGvavO4sDe0Gl5ZelXByLaSXHHaUuAW4O8AnG+yzDlpgjEyx4dEGIdp+bqM216SWTQOx0iBjwB8yEySYIyJ/gHwRSUhSu8HuURjBBwpAP/kQhdsmb/OPOOfwWd8ifE8iOcRrAX3gJeAu802uQjbFDZps7Ozp8BvT5w4cergwYP+4cOHAw4cOOBv2rRJq0/2NC4SpBonv0gB+CcXumBlXCT/LlEwXkDH84CPga3gvjqngLtBqCq2aWzt2PGXjvtr1qyR9UrBGIMiZNSNETkTNTKvAPiQiy8DWUbIQ4mC8SI7nh58EtwNrFj7AHuSs1GsTuydd94JMKtRWli3FIzg0lQ3G040nF7hrfC3eFP+Um8G3+caDHnH/AlvOuBec2+DXeayRl7JAMTaPG+37y9cGBNsCDjpQ0fvBpNNvFdw0YwNKSLb1dg6tbewmTMobRjE/WEvU43XihHBjFkPmkLpyPZvBzI/uQKc8X/0gc+rgsXTw4eLomKZpyBYIFdcMPa617B1YnuxBYKdAJo/CSsbnPA7FOxGIPOTR8AZRPcXx4bkdHA8xhzCx4hg3p+tXLpgi2YX+RtnN/oPYXsE2xGxYYoPtmew8fgktkex/Qsb7Si25f9ZHgpG1gDXn4SA1l4OicR5BdOG5J8a85cr2BSIp4cPCcMxSbBU3K2+f3B20F8/i/ZZoSw7getPgmB2JVQkvh1E2pjCYSDzWmb9G8x0I/BFBQ0mQSz9JWDS4TiYq9PtbQcQ/nDBEf9/DsSMYjmC7QSaOBp3AJmXUPACBHsK9EqwISD8qa/QqkFsB4K9DmQ+yzSYxaXVblWwx0AszweBKxh5HfRCMMefumDqikYHgmnD8VIwG3C72acKdgTE8wHGX65g3wdHwEnQrW0aOL6kCRZLbMwDQBPIRROMQzQ8fiOON744OKuhIWXgCiZ5GHCYWrQ02YmcYGK+hJ1IHZJuQpBVsCeAm/dBEB5PE4z3HON5wa1Ab2DRNMW6NVEwBvUxcxOCrIJp8dcUCI+nCcbV13jeOuxp2vAsllCsuwAD5rgfjB5UcxOCTgTjMA2PD5ujboYIqYuGA+BOoDe2cxjzMVBeGIilCZb4iIGSIatgMo/lJOCxcOK3k359ZwSuwiauWFg+DbQG54UX8l8HWwB78AKg1RdyM0i0ggWzx0LBTpuBRMEIRVsN9LL6wl0g1ZQ70+0KxkskeywUbNrckCoYoWhrQLy8vtDSlGvJLIJpIQXnNHs8FGy32dFSMML7lbeAeJk9p6W1KRijeZmHNGMwyx1mb3RHC54DKfcSe0FLK1CweL5WZ8okeNf6F4BnUstmwJMEkTdxSdyXZHhjhk/6aMdAS1PWw4oTjLxulsV3dggcjqClSYM9Oe5/QEtTVlzbFawZg0kOm0p8Z4f0U7DvgHeByDQB1HoER4DMQ54D8QVGrvtHdvQBV+C96qJncBeppbUpGFc0ZB6iC5Z2idQrXME2qfchzEHQ0rgM21XBBsyMzNgXpFgz3lLs0sIi8xhoaW0Ktg/IPEQXjBwzQ9EdPUYKNuVtwS5VsJZRPi12Ize8CaLWK8g+6ZO+z2Oe12DE/B7t5Y8b8Z8a8ASYyRzBuGqq19tEE+zXQEvbfjxWGHWxTnhX4uv/kgTL/JyYIxjhXW+97hBNsL1ASxty1AzrB3pBXbBt5nG0lYLxRk3Ef2qQ+c04RvtOAcnDKyR74GrZYA7pB3oBxJrxLsQJ6J9zJO57IFhm+ymIFOB5O+2PEoBdDtqkuQOEF91hGkm4/+fmM5kuxouGdU7iB73A/Nefp4cUx0FmexBECvC8W1oIxoXCaB5jbgDpgl1qXvFPmUH3YNf5u/l4IBYx5gLg+p4tpLD2FRApwPPWtxCMRPMYMwDSBSP3mQfdg13ns+ZngVjzzS/xVRVsI8hsVRApwENwl18w8hpIF2yJedN/1axwE3SNZ80tjd41z/wQu1TB+I5CZlsBOOlJUMhGwLvbzcY2YXAaeYKvzk+A6ncEhhlvm0WNHZxjJJHEGUDkPSdhGS+by/3N8GfAvCWSNm7cyLZy1Tm32WUeS73gRYCTOe83Wr4GNLHIN0CkLYlQtJO4COaXogR7wwzMPW02z603z2O3/IFtUk4bga+yrW29hGojfostOCdyXT8bvDjfZ25rWzCK/oTZOrfZPI2Q4Q34/i6QYlnBjoKGr7Ktbb8SKHuZLDwn9lZbHsIz6HbMMffjwv4BM5nKdrMrELqZnyJJNMEi4QTbSNTnJ/LY3QC9u1GgRVYmK1SO8+lD25CzBYrGS76Y/1tBx8ZrKrvWrwgSqVA5PgQ0p/tJbHWFPic+DtCucTKkcDyLaBXaY45g5BjQHO8HvC6O9C5CnzOvThRpyvIQ+SrQnO8H6psf7F25Yq8iTeuBCSwBXG/7Amh1gd8JdiGTIVFQN39UCf/YSF+Mp+QcgkkomtbYNCgyV0V2iX0aEbGIFKtvvYsvMSlPYefhbaA1WGM/kHmTeijnLPZimTYiWCFnxrxGsaQTroMJcPJlYx4CeeM193m064Gbhj2vEc1LrJ8dx13t2jGgOSag42wAI2y3Ye2gTd7sZexRjwI1zrLY/X35Qx/XAemc4KPgx6DVEnc7UBy3Pv3FMKAJlumuUDdsJ3AdBBTqTWAvRbrBaqDVHUOKNQP6JhbtCHAcvA24127dQHuuVsWK9TDoW7xljWdGx8FngdbAosktWN/FotER4Rwnd61x3SC3YJnvNXbTHMGy3CkvCk0wniEZqEZir7NGsDYfLSgK7az4Ijh7BaMDPRDMXgtaeCLRHoC5GPBYomB5l5+9OoVZHwRjTLcbaBE896cKlnUJxwpVuGC8DuuhYBxu7EWyPgtvxJwGZ7dgyjOxWZ72ycurgLf55tWR9REuE3GRkmKlCpZ1DuuaYMojnsRtsG2IbJAkKf1vAIVyy3dpvjUXwrwRwSyp7w0JK1QkaQmCuUstVgBLmmC8OOfa1eXALVeDl2AyPzl7BbsTKIJJhgFv9sqbv3wmVsJbXpmD0DochgcAxcksWFbrmmBXgBaCdQPOk38Btsdqgl0LYnmzWtcEo/HRIM25LsHe6C4XaUM8lvdXExMTCwk+99cWLFjAJRPNyQLhimrSMnRrwQYHB18ul8s7yEh5fMNwudy7xUNWBu4iQ5XKweGxsZkrVq3yFyxcGHO0MzhP8fnTVqu0rmCR5yYCVq5c6VcqlYCxWs0frdVeAHtKldo9FBBpirW15fHaWLX6+Fil8sowKk2Cwn1i+SU5WeEvXsoXDKKNDAWTjyclYYX6G+BJJH4CcQWLss6yv1Stblu7di3/DmQu46TnjV1//VUo4MnRSnVmtDaOXyVkrHDW+aujfyFOwEcNGGZQCL7TRPgQsoTHmU7Lb/z58+cHdTTRfJAEQr5A8ZA/k3kjlUoJvWmGmaVY3RKMLFq8WG1wp3zowx9p1JFDMEumPxzplWq1EzbTuS7YqmuuadTRhmA+tNiCclLNG61Wv2cz9EqwC5ctUxvcLhyKl1+5slF+E80HiRAMowxzMx9jTbVgDitVx5+MZG7gOuCiOdGaq68d8gcGB/3FS5Z2BIW/6lOr/OtKYyiX/uT1v06lNlMqldQ3QgKBNHjKRSV75BBVC4+gC5KNTvMT1x8pVmv/cZI7VCqVtw0NDdmbJq4usR0ugeGsMYIK94yWx1/QKmqiNaKXuP60EIw9qVrbXypXtw1NTGh3llQ93J2SmFH9kZHyBpxK70EAOFWqjE8H1Nb9W29EL3EEsUJVKi+WKpVpzM+HMGK+jQ7wJUQDw/UmpVmiHu4Bi2tJ+wPD5ccguBl8EYHi/aPV8cnRSu0HGN5HRsrV02NVNKpImr0HPR89pVLbacH3cfygQ3XXsphsdxIRa5kAlrT/fDDZ7iRi1ipB0v7zwWS7FYz3f79pDPNdAt+iAAAAAElFTkSuQmCC");
    const Web$AsManga$Assets$Among$Walk$6 = Web$AsManga$Assets$Among$make$((Number(78n)), (Number(118n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$7 = Web$AsManga$Assets$Among$make$((Number(78n)), (Number(120n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$8 = Web$AsManga$Assets$Among$make$((Number(78n)), (Number(117n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$9 = Web$AsManga$Assets$Among$make$((Number(77n)), (Number(107n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$10 = Web$AsManga$Assets$Among$make$((Number(76n)), (Number(95n)), "data:image/png;base64,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");
    const Web$AsManga$Assets$Among$Walk$11 = Web$AsManga$Assets$Among$make$((Number(76n)), (Number(95n)), "data:image/png;base64,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");
    const List$nil = ({
        _: 'List.nil'
    });

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $43 = self.pred;
                var $44 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $43));
                var $42 = $44;
                break;
            case 'Word.i':
                var $45 = self.pred;
                var $46 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $45));
                var $42 = $46;
                break;
            case 'Word.e':
                var $47 = _nil$3;
                var $42 = $47;
                break;
        };
        return $42;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$zero = 0n;

    function Nat$succ$(_pred$1) {
        var $48 = 1n + _pred$1;
        return $48;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $49 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $50 = Nat$succ$((2n * _x$4));
            return $50;
        }), _word$2);
        return $49;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));
    const F64$to_u32 = a0 => ((a0 >>> 0));

    function F64$to_nat$(_x$1) {
        var $51 = (BigInt(((_x$1 >>> 0))));
        return $51;
    };
    const F64$to_nat = x0 => F64$to_nat$(x0);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$mod = a0 => a1 => (a0 % a1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $53 = self.value;
                var $54 = $53;
                var $52 = $54;
                break;
            case 'Maybe.none':
                var $55 = _a$3;
                var $52 = $55;
                break;
        };
        return $52;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Maybe$(_A$1) {
        var $56 = null;
        return $56;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$some$(_value$2) {
        var $57 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $57;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function List$get$(_index$2, _list$3) {
        var List$get$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$get = _index$2 => _list$3 => List$get$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $58 = self.head;
                        var $59 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $61 = Maybe$some$($58);
                            var $60 = $61;
                        } else {
                            var $62 = (self - 1n);
                            var $63 = List$get$($62, $59);
                            var $60 = $63;
                        };
                        return $60;
                    case 'List.nil':
                        var $64 = Maybe$none;
                        return $64;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);
    const Web$AsManga$Assets$Among$Idle$0 = Web$AsManga$Assets$Among$make$((Number(78n)), (Number(103n)), "data:image/png;base64,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");

    function Web$AsManga$sprite$(_time$1, _is_walking$2) {
        var self = _is_walking$2;
        if (self) {
            var _walk_sprites$3 = List$cons$(Web$AsManga$Assets$Among$Walk$0, List$cons$(Web$AsManga$Assets$Among$Walk$1, List$cons$(Web$AsManga$Assets$Among$Walk$2, List$cons$(Web$AsManga$Assets$Among$Walk$3, List$cons$(Web$AsManga$Assets$Among$Walk$4, List$cons$(Web$AsManga$Assets$Among$Walk$5, List$cons$(Web$AsManga$Assets$Among$Walk$6, List$cons$(Web$AsManga$Assets$Among$Walk$7, List$cons$(Web$AsManga$Assets$Among$Walk$8, List$cons$(Web$AsManga$Assets$Among$Walk$9, List$cons$(Web$AsManga$Assets$Among$Walk$10, List$cons$(Web$AsManga$Assets$Among$Walk$11, List$nil))))))))))));
            var _idx$4 = F64$to_nat$((((_time$1 / (1000.0)) % (1.0)) * (12.0)));
            var _spr$5 = Maybe$default$(List$get$(_idx$4, _walk_sprites$3), Web$AsManga$Assets$Among$Idle$0);
            var $66 = _spr$5;
            var $65 = $66;
        } else {
            var $67 = Web$AsManga$Assets$Among$Idle$0;
            var $65 = $67;
        };
        return $65;
    };
    const Web$AsManga$sprite = x0 => x1 => Web$AsManga$sprite$(x0, x1);

    function List$any$(_cond$2, _list$3) {
        var List$any$ = (_cond$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _list$3]
        });
        var List$any = _cond$2 => _list$3 => List$any$(_cond$2, _list$3);
        var arg = [_cond$2, _list$3];
        while (true) {
            let [_cond$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $68 = self.head;
                        var $69 = self.tail;
                        var self = _cond$2($68);
                        if (self) {
                            var $71 = Bool$true;
                            var $70 = $71;
                        } else {
                            var $72 = List$any$(_cond$2, $69);
                            var $70 = $72;
                        };
                        return $70;
                    case 'List.nil':
                        var $73 = Bool$false;
                        return $73;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$any = x0 => x1 => List$any$(x0, x1);

    function Web$AsManga$is_walking$(_pad$1) {
        var self = _pad$1;
        switch (self._) {
            case 'Web.AsManga.Pad.new':
                var $75 = self.left;
                var $76 = self.right;
                var $77 = self.up;
                var $78 = self.down;
                var $79 = List$any$((_x$6 => {
                    var $80 = _x$6;
                    return $80;
                }), List$cons$($75, List$cons$($76, List$cons$($77, List$cons$($78, List$nil)))));
                var $74 = $79;
                break;
        };
        return $74;
    };
    const Web$AsManga$is_walking = x0 => Web$AsManga$is_walking$(x0);

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $81 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $81;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $82 = null;
        return $82;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $83 = null;
        return $83;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $84 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $84;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $86 = self.pred;
                var $87 = (Word$to_bits$($86) + '0');
                var $85 = $87;
                break;
            case 'Word.i':
                var $88 = self.pred;
                var $89 = (Word$to_bits$($88) + '1');
                var $85 = $89;
                break;
            case 'Word.e':
                var $90 = Bits$e;
                var $85 = $90;
                break;
        };
        return $85;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $92 = Bits$e;
            var $91 = $92;
        } else {
            var $93 = self.charCodeAt(0);
            var $94 = self.slice(1);
            var $95 = (String$to_bits$($94) + (u16_to_bits($93)));
            var $91 = $95;
        };
        return $91;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $97 = self.head;
                var $98 = self.tail;
                var self = $97;
                switch (self._) {
                    case 'Pair.new':
                        var $100 = self.fst;
                        var $101 = self.snd;
                        var $102 = (bitsmap_set(String$to_bits$($100), $101, Map$from_list$($98), 'set'));
                        var $99 = $102;
                        break;
                };
                var $96 = $99;
                break;
            case 'List.nil':
                var $103 = BitsMap$new;
                var $96 = $103;
                break;
        };
        return $96;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function Pair$(_A$1, _B$2) {
        var $104 = null;
        return $104;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function DOM$text$(_value$1) {
        var $105 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $105;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $106 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $106;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $107 = (String.fromCharCode(_head$1) + _tail$2);
        return $107;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const F64$show = a0 => (String(a0));

    function Web$AsManga$Sprite$render$(_spr$1, _pos$2) {
        var _attrs$3 = Map$from_list$(List$cons$(Pair$new$("src", (() => {
            var self = _spr$1;
            switch (self._) {
                case 'Web.AsManga.Sprite.new':
                    var $109 = self.data;
                    var $110 = $109;
                    return $110;
            };
        })()), List$nil));
        var _pos_x$4 = ((() => {
            var self = _pos$2;
            switch (self._) {
                case 'V3.new':
                    var $111 = self.x;
                    var $112 = $111;
                    return $112;
            };
        })() - (() => {
            var self = _spr$1;
            switch (self._) {
                case 'Web.AsManga.Sprite.new':
                    var $113 = self.pivot_x;
                    var $114 = $113;
                    return $114;
            };
        })());
        var _pos_y$5 = ((() => {
            var self = _pos$2;
            switch (self._) {
                case 'V3.new':
                    var $115 = self.y;
                    var $116 = $115;
                    return $116;
            };
        })() - (() => {
            var self = _spr$1;
            switch (self._) {
                case 'Web.AsManga.Sprite.new':
                    var $117 = self.pivot_y;
                    var $118 = $117;
                    return $118;
            };
        })());
        var _style$6 = Map$from_list$(List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("left", ((String(_pos_x$4)) + "px")), List$cons$(Pair$new$("top", ((String(_pos_y$5)) + "px")), List$nil))));
        var $108 = DOM$node$("img", _attrs$3, _style$6, List$nil);
        return $108;
    };
    const Web$AsManga$Sprite$render = x0 => x1 => Web$AsManga$Sprite$render$(x0, x1);

    function IO$(_A$1) {
        var $119 = null;
        return $119;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $120 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $120;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $122 = self.value;
                var $123 = _f$4($122);
                var $121 = $123;
                break;
            case 'IO.ask':
                var $124 = self.query;
                var $125 = self.param;
                var $126 = self.then;
                var $127 = IO$ask$($124, $125, (_x$8 => {
                    var $128 = IO$bind$($126(_x$8), _f$4);
                    return $128;
                }));
                var $121 = $127;
                break;
        };
        return $121;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $129 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $129;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $130 = _new$2(IO$bind)(IO$end);
        return $130;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $131 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $131;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);

    function App$store$(_value$2) {
        var $132 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $133 = _m$pure$4;
            return $133;
        }))(Dynamic$new$(_value$2));
        return $132;
    };
    const App$store = x0 => App$store$(x0);

    function Word$to_f64$(_a$2) {
        var Word$to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$to_f64 = _a$2 => Word$to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$to_f64 = x0 => Word$to_f64$(x0);
    const U64$to_f64 = a0 => (Number(a0));
    const Unit$new = null;
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $134 = _m$pure$2;
        return $134;
    }))(Dynamic$new$(Unit$new));
    const F64$add = a0 => a1 => (a0 + a1);

    function V3$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'V3.new':
                var $136 = self.x;
                var $137 = self.y;
                var $138 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'V3.new':
                        var $140 = self.x;
                        var $141 = self.y;
                        var $142 = self.z;
                        var $143 = V3$new$(($136 + $140), ($137 + $141), ($138 + $142));
                        var $139 = $143;
                        break;
                };
                var $135 = $139;
                break;
        };
        return $135;
    };
    const V3$add = x0 => x1 => V3$add$(x0, x1);

    function Web$AsManga$pad_dir$(_pad$1, _spd$2) {
        var self = _pad$1;
        switch (self._) {
            case 'Web.AsManga.Pad.new':
                var $145 = self.left;
                var $146 = self.right;
                var $147 = self.up;
                var $148 = self.down;
                var _x$7 = ((() => {
                    var self = $145;
                    if (self) {
                        var $150 = (_spd$2 * (-1.0));
                        return $150;
                    } else {
                        var $151 = (0.0);
                        return $151;
                    };
                })() + (() => {
                    var self = $146;
                    if (self) {
                        var $152 = _spd$2;
                        return $152;
                    } else {
                        var $153 = (0.0);
                        return $153;
                    };
                })());
                var _y$8 = ((() => {
                    var self = $147;
                    if (self) {
                        var $154 = (_spd$2 * (-1.0));
                        return $154;
                    } else {
                        var $155 = (0.0);
                        return $155;
                    };
                })() + (() => {
                    var self = $148;
                    if (self) {
                        var $156 = _spd$2;
                        return $156;
                    } else {
                        var $157 = (0.0);
                        return $157;
                    };
                })());
                var $149 = V3$new$(_x$7, _y$8, (Number(0n)));
                var $144 = $149;
                break;
        };
        return $144;
    };
    const Web$AsManga$pad_dir = x0 => x1 => Web$AsManga$pad_dir$(x0, x1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $159 = Bool$false;
                var $158 = $159;
                break;
            case 'Cmp.eql':
                var $160 = Bool$true;
                var $158 = $160;
                break;
        };
        return $158;
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
                var $162 = self.pred;
                var $163 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var $167 = Word$cmp$go$(_a$pred$10, $165, _c$4);
                                return $167;
                            });
                            var $164 = $166;
                            break;
                        case 'Word.i':
                            var $168 = self.pred;
                            var $169 = (_a$pred$10 => {
                                var $170 = Word$cmp$go$(_a$pred$10, $168, Cmp$ltn);
                                return $170;
                            });
                            var $164 = $169;
                            break;
                        case 'Word.e':
                            var $171 = (_a$pred$8 => {
                                var $172 = _c$4;
                                return $172;
                            });
                            var $164 = $171;
                            break;
                    };
                    var $164 = $164($162);
                    return $164;
                });
                var $161 = $163;
                break;
            case 'Word.i':
                var $173 = self.pred;
                var $174 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $176 = self.pred;
                            var $177 = (_a$pred$10 => {
                                var $178 = Word$cmp$go$(_a$pred$10, $176, Cmp$gtn);
                                return $178;
                            });
                            var $175 = $177;
                            break;
                        case 'Word.i':
                            var $179 = self.pred;
                            var $180 = (_a$pred$10 => {
                                var $181 = Word$cmp$go$(_a$pred$10, $179, _c$4);
                                return $181;
                            });
                            var $175 = $180;
                            break;
                        case 'Word.e':
                            var $182 = (_a$pred$8 => {
                                var $183 = _c$4;
                                return $183;
                            });
                            var $175 = $182;
                            break;
                    };
                    var $175 = $175($173);
                    return $175;
                });
                var $161 = $174;
                break;
            case 'Word.e':
                var $184 = (_b$5 => {
                    var $185 = _c$4;
                    return $185;
                });
                var $161 = $184;
                break;
        };
        var $161 = $161(_b$3);
        return $161;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $186 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $186;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $187 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $187;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $188 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $188;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$AsManga$AsManga = (() => {
        var _time$1 = (0.0);
        var _pos$2 = V3$new$((Number(50n)), (Number(100n)), (Number(0n)));
        var _pad$3 = Web$AsManga$Pad$new$(Bool$false, Bool$false, Bool$false, Bool$false);
        var _spd$4 = (3.0);
        var _spr$5 = Web$AsManga$Assets$Among$Walk$5;
        var _init$1 = Web$AsManga$State$new$(_time$1, _pos$2, _pad$3, _spd$4, _spr$5);
        var _draw$2 = (_state$2 => {
            var _among_str$3 = Web$AsManga$sprite$((() => {
                var self = _state$2;
                switch (self._) {
                    case 'Web.AsManga.State.new':
                        var $191 = self.time;
                        var $192 = $191;
                        return $192;
                };
            })(), Web$AsManga$is_walking$((() => {
                var self = _state$2;
                switch (self._) {
                    case 'Web.AsManga.State.new':
                        var $193 = self.pad;
                        var $194 = $193;
                        return $194;
                };
            })()));
            var self = _state$2;
            switch (self._) {
                case 'Web.AsManga.State.new':
                    var $195 = self.pos;
                    var $196 = $195;
                    var _among_pos$4 = $196;
                    break;
            };
            var $190 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("\u{a}          Bem-vindo ao AsManga! Esse \u{e9} o primeiro deploy do joguinho, que se\u{a}          tornar\u{e1} uma par\u{f3}dia de Among Us, por\u{e9}m o impostor \u{e9} uma manga. A\u{a}          inten\u{e7}\u{e3}o \u{e9} replicar um prot\u{f3}tipo jog\u{e1}vel do Among Us no menor tempo\u{a}          poss\u{ed}vel. Por enquanto, o app \u{e9} apenas esse bloco de textos. Aos poucos,\u{a}          ele vai evoluir. Quanto tempo vou levar?\u{a}        "), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("\u{a}          No momento: estou aproveitando a oportunidade pra melhorar\u{a}          o framework de sincronia de tempo cliente/servidor dos apps\u{a}          do Kind. Quando terminar isso, passarei a fazer o networking\u{a}          do AsManga.\u{a}        "), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(Web$AsManga$Sprite$render$(_among_str$3, _among_pos$4), List$nil)), List$nil))));
            return $190;
        });
        var _when$3 = (_event$3 => _state$4 => {
            var self = _event$3;
            switch (self._) {
                case 'App.Event.init':
                    var $198 = self.time;
                    var $199 = App$store$((() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'Web.AsManga.State.new':
                                var $200 = self.pos;
                                var $201 = self.pad;
                                var $202 = self.spd;
                                var $203 = self.spr;
                                var $204 = Web$AsManga$State$new$((Number($198)), $200, $201, $202, $203);
                                return $204;
                        };
                    })());
                    var $197 = $199;
                    break;
                case 'App.Event.frame':
                    var $205 = self.time;
                    var self = _state$4;
                    switch (self._) {
                        case 'Web.AsManga.State.new':
                            var $207 = self.pos;
                            var $208 = self.pad;
                            var $209 = self.spd;
                            var $210 = self.spr;
                            var $211 = Web$AsManga$State$new$((Number($205)), $207, $208, $209, $210);
                            var _state$7 = $211;
                            break;
                    };
                    var self = _state$7;
                    switch (self._) {
                        case 'Web.AsManga.State.new':
                            var $212 = self.time;
                            var $213 = self.pad;
                            var $214 = self.spd;
                            var $215 = self.spr;
                            var $216 = Web$AsManga$State$new$($212, V3$add$((() => {
                                var self = _state$7;
                                switch (self._) {
                                    case 'Web.AsManga.State.new':
                                        var $217 = self.pos;
                                        var $218 = $217;
                                        return $218;
                                };
                            })(), Web$AsManga$pad_dir$((() => {
                                var self = _state$7;
                                switch (self._) {
                                    case 'Web.AsManga.State.new':
                                        var $219 = self.pad;
                                        var $220 = $219;
                                        return $220;
                                };
                            })(), (() => {
                                var self = _state$7;
                                switch (self._) {
                                    case 'Web.AsManga.State.new':
                                        var $221 = self.spd;
                                        var $222 = $221;
                                        return $222;
                                };
                            })())), $213, $214, $215);
                            var _state$8 = $216;
                            break;
                    };
                    var $206 = App$store$(_state$8);
                    var $197 = $206;
                    break;
                case 'App.Event.key_down':
                    var $223 = self.code;
                    var self = _state$4;
                    switch (self._) {
                        case 'Web.AsManga.State.new':
                            var $225 = self.pad;
                            var $226 = $225;
                            var _pad$7 = $226;
                            break;
                    };
                    var self = ($223 === 65);
                    if (self) {
                        var self = _pad$7;
                        switch (self._) {
                            case 'Web.AsManga.Pad.new':
                                var $228 = self.right;
                                var $229 = self.up;
                                var $230 = self.down;
                                var $231 = Web$AsManga$Pad$new$(Bool$true, $228, $229, $230);
                                var $227 = $231;
                                break;
                        };
                        var _pad$8 = $227;
                    } else {
                        var self = ($223 === 68);
                        if (self) {
                            var self = _pad$7;
                            switch (self._) {
                                case 'Web.AsManga.Pad.new':
                                    var $234 = self.left;
                                    var $235 = self.up;
                                    var $236 = self.down;
                                    var $237 = Web$AsManga$Pad$new$($234, Bool$true, $235, $236);
                                    var $233 = $237;
                                    break;
                            };
                            var $232 = $233;
                        } else {
                            var self = ($223 === 87);
                            if (self) {
                                var self = _pad$7;
                                switch (self._) {
                                    case 'Web.AsManga.Pad.new':
                                        var $240 = self.left;
                                        var $241 = self.right;
                                        var $242 = self.down;
                                        var $243 = Web$AsManga$Pad$new$($240, $241, Bool$true, $242);
                                        var $239 = $243;
                                        break;
                                };
                                var $238 = $239;
                            } else {
                                var self = ($223 === 83);
                                if (self) {
                                    var self = _pad$7;
                                    switch (self._) {
                                        case 'Web.AsManga.Pad.new':
                                            var $246 = self.left;
                                            var $247 = self.right;
                                            var $248 = self.up;
                                            var $249 = Web$AsManga$Pad$new$($246, $247, $248, Bool$true);
                                            var $245 = $249;
                                            break;
                                    };
                                    var $244 = $245;
                                } else {
                                    var $250 = _pad$7;
                                    var $244 = $250;
                                };
                                var $238 = $244;
                            };
                            var $232 = $238;
                        };
                        var _pad$8 = $232;
                    };
                    var $224 = App$store$((() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'Web.AsManga.State.new':
                                var $251 = self.time;
                                var $252 = self.pos;
                                var $253 = self.spd;
                                var $254 = self.spr;
                                var $255 = Web$AsManga$State$new$($251, $252, _pad$8, $253, $254);
                                return $255;
                        };
                    })());
                    var $197 = $224;
                    break;
                case 'App.Event.key_up':
                    var $256 = self.code;
                    var self = _state$4;
                    switch (self._) {
                        case 'Web.AsManga.State.new':
                            var $258 = self.pad;
                            var $259 = $258;
                            var _pad$7 = $259;
                            break;
                    };
                    var self = ($256 === 65);
                    if (self) {
                        var self = _pad$7;
                        switch (self._) {
                            case 'Web.AsManga.Pad.new':
                                var $261 = self.right;
                                var $262 = self.up;
                                var $263 = self.down;
                                var $264 = Web$AsManga$Pad$new$(Bool$false, $261, $262, $263);
                                var $260 = $264;
                                break;
                        };
                        var _pad$8 = $260;
                    } else {
                        var self = ($256 === 68);
                        if (self) {
                            var self = _pad$7;
                            switch (self._) {
                                case 'Web.AsManga.Pad.new':
                                    var $267 = self.left;
                                    var $268 = self.up;
                                    var $269 = self.down;
                                    var $270 = Web$AsManga$Pad$new$($267, Bool$false, $268, $269);
                                    var $266 = $270;
                                    break;
                            };
                            var $265 = $266;
                        } else {
                            var self = ($256 === 87);
                            if (self) {
                                var self = _pad$7;
                                switch (self._) {
                                    case 'Web.AsManga.Pad.new':
                                        var $273 = self.left;
                                        var $274 = self.right;
                                        var $275 = self.down;
                                        var $276 = Web$AsManga$Pad$new$($273, $274, Bool$false, $275);
                                        var $272 = $276;
                                        break;
                                };
                                var $271 = $272;
                            } else {
                                var self = ($256 === 83);
                                if (self) {
                                    var self = _pad$7;
                                    switch (self._) {
                                        case 'Web.AsManga.Pad.new':
                                            var $279 = self.left;
                                            var $280 = self.right;
                                            var $281 = self.up;
                                            var $282 = Web$AsManga$Pad$new$($279, $280, $281, Bool$false);
                                            var $278 = $282;
                                            break;
                                    };
                                    var $277 = $278;
                                } else {
                                    var $283 = _pad$7;
                                    var $277 = $283;
                                };
                                var $271 = $277;
                            };
                            var $265 = $271;
                        };
                        var _pad$8 = $265;
                    };
                    var $257 = App$store$((() => {
                        var self = _state$4;
                        switch (self._) {
                            case 'Web.AsManga.State.new':
                                var $284 = self.time;
                                var $285 = self.pos;
                                var $286 = self.spd;
                                var $287 = self.spr;
                                var $288 = Web$AsManga$State$new$($284, $285, _pad$8, $286, $287);
                                return $288;
                        };
                    })());
                    var $197 = $257;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_click':
                case 'App.Event.input':
                    var $289 = App$pass;
                    var $197 = $289;
                    break;
            };
            return $197;
        });
        var $189 = App$new$(_init$1, _draw$2, _when$3);
        return $189;
    })();
    const Web$AsManga = Web$AsManga$AsManga;
    return {
        'F64.read': F64$read,
        'V3.new': V3$new,
        'F64.make': F64$make,
        'Bool.true': Bool$true,
        'F64.from_nat': F64$from_nat,
        'Web.AsManga.Pad.new': Web$AsManga$Pad$new,
        'Bool.false': Bool$false,
        'F64.div': F64$div,
        'F64.sub': F64$sub,
        'Web.AsManga.Sprite.new': Web$AsManga$Sprite$new,
        'Web.AsManga.Assets.Among.make': Web$AsManga$Assets$Among$make,
        'Web.AsManga.Assets.Among.Walk.5': Web$AsManga$Assets$Among$Walk$5,
        'Web.AsManga.State.new': Web$AsManga$State$new,
        'List.cons': List$cons,
        'Web.AsManga.Assets.Among.Walk.0': Web$AsManga$Assets$Among$Walk$0,
        'Web.AsManga.Assets.Among.Walk.1': Web$AsManga$Assets$Among$Walk$1,
        'Web.AsManga.Assets.Among.Walk.2': Web$AsManga$Assets$Among$Walk$2,
        'Web.AsManga.Assets.Among.Walk.3': Web$AsManga$Assets$Among$Walk$3,
        'Web.AsManga.Assets.Among.Walk.4': Web$AsManga$Assets$Among$Walk$4,
        'Web.AsManga.Assets.Among.Walk.6': Web$AsManga$Assets$Among$Walk$6,
        'Web.AsManga.Assets.Among.Walk.7': Web$AsManga$Assets$Among$Walk$7,
        'Web.AsManga.Assets.Among.Walk.8': Web$AsManga$Assets$Among$Walk$8,
        'Web.AsManga.Assets.Among.Walk.9': Web$AsManga$Assets$Among$Walk$9,
        'Web.AsManga.Assets.Among.Walk.10': Web$AsManga$Assets$Among$Walk$10,
        'Web.AsManga.Assets.Among.Walk.11': Web$AsManga$Assets$Among$Walk$11,
        'List.nil': List$nil,
        'Word.fold': Word$fold,
        'Nat.zero': Nat$zero,
        'Nat.succ': Nat$succ,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'F64.to_u32': F64$to_u32,
        'F64.to_nat': F64$to_nat,
        'F64.mul': F64$mul,
        'F64.mod': F64$mod,
        'Maybe.default': Maybe$default,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'List.get': List$get,
        'Web.AsManga.Assets.Among.Idle.0': Web$AsManga$Assets$Among$Idle$0,
        'Web.AsManga.sprite': Web$AsManga$sprite,
        'List.any': List$any,
        'Web.AsManga.is_walking': Web$AsManga$is_walking,
        'DOM.node': DOM$node,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'Pair': Pair,
        'DOM.text': DOM$text,
        'Pair.new': Pair$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'F64.show': F64$show,
        'Web.AsManga.Sprite.render': Web$AsManga$Sprite$render,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.store': App$store,
        'Word.to_f64': Word$to_f64,
        'U64.to_f64': U64$to_f64,
        'Unit.new': Unit$new,
        'App.pass': App$pass,
        'F64.add': F64$add,
        'V3.add': V3$add,
        'Web.AsManga.pad_dir': Web$AsManga$pad_dir,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'App.new': App$new,
        'Web.AsManga.AsManga': Web$AsManga$AsManga,
        'Web.AsManga': Web$AsManga,
    };
})();

/***/ })

}]);
//# sourceMappingURL=190.index.js.map