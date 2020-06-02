module.exports = (function() {
    var inst_nat = x => x(0n)(x0 => 1n + x0);
    var elim_nat = (x => (() => c0 => c1 => {
        var self = x;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return c0;
            case 'succ':
                var $0 = (self - 1n);
                return c1($0);
        }
    })());
    var Nat$succ = (pred$1 => 1n + pred$1);
    var Nat$add = a0 => a1 => (a0 + a1);
    var List$sum$tco = xs$1 => sum$2 => {
        var List$sum$tco = xs$1 => sum$2 => ({
            ctr: 'TCO',
            arg: [xs$1, sum$2]
        });
        while (true) {
            var R = (() => {
                var self = xs$1;
                switch (self._) {
                    case 'List.nil':
                        return sum$2;
                    case 'List.cons':
                        var $1 = self.x;
                        var $2 = self.xs;
                        return List$sum$tco($2)(($1 + sum$2));
                }
            })();
            if (R.ctr === 'TCO')[xs$1, sum$2] = R.arg;
            else return R;
        }
    };
    var Nat$zero = 0n;
    var List$sum = (xs$1 => List$sum$tco(xs$1)(0n));
    var List = (A$1 => null);
    var List$cons = (x$2 => (xs$3 => ({
        _: 'List.cons',
        'x': x$2,
        'xs': xs$3
    })));
    var List$range$tco = lim$1 => xs$2 => {
        var List$range$tco = lim$1 => xs$2 => ({
            ctr: 'TCO',
            arg: [lim$1, xs$2]
        });
        while (true) {
            var R = (() => {
                var self = lim$1;
                switch (self === 0n ? 'zero' : 'succ') {
                    case 'zero':
                        return xs$2;
                    case 'succ':
                        var $3 = (self - 1n);
                        return List$range$tco($3)(List$cons($3)(xs$2));
                }
            })();
            if (R.ctr === 'TCO')[lim$1, xs$2] = R.arg;
            else return R;
        }
    };
    var List$nil = ({
        _: 'List.nil'
    });
    var List$range = (lim$1 => List$range$tco(lim$1)(List$nil));
    var Nat$mul = a0 => a1 => (a0 * a1);
    var Nat$double = (n$1 => (() => {
        var self = n$1;
        switch (self === 0n ? 'zero' : 'succ') {
            case 'zero':
                return 0n;
            case 'succ':
                var $4 = (self - 1n);
                return Nat$succ(Nat$succ(Nat$double($4)));
        }
    })());
    var main = List$sum(List$range((Nat$double(1000n) * Nat$double(1000n))));
    return {
        'Nat.succ': Nat$succ,
        'Nat.add': Nat$add,
        'List.sum.tco': List$sum$tco,
        'Nat.zero': Nat$zero,
        'List.sum': List$sum,
        'List': List,
        'List.cons': List$cons,
        'List.range.tco': List$range$tco,
        'List.nil': List$nil,
        'List.range': List$range,
        'Nat.mul': Nat$mul,
        'Nat.double': Nat$double,
        'main': main,
    };
})();
console.log(module.exports['main']);
