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
  var list_for = list => nil => cons => {
      while (list._ !== 'List.nil') {
          nil = cons(list.head)(nil);
          list = list.tail;
      }
      return nil;
  };
  var nat_to_bits = n => {
      return n === 0n ? '' : n.toString(2);
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
  const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
  const elim_string = (x => {
      var $22 = (() => c0 => c1 => {
          var self = x;
          if (self.length === 0) {
              var $18 = c0;
              return $18;
          } else {
              var $19 = self.charCodeAt(0);
              var $20 = self.slice(1);
              var $21 = c1($19)($20);
              return $21;
          };
      })();
      return $22;
  });

  function Ether$RLP$Tree$tip$(_value$1) {
      var $23 = ({
          _: 'Ether.RLP.Tree.tip',
          'value': _value$1
      });
      return $23;
  };
  const Ether$RLP$Tree$tip = x0 => Ether$RLP$Tree$tip$(x0);
  const Bits$e = '';
  const Bool$false = false;
  const Bool$true = true;

  function Cmp$as_eql$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
          case 'Cmp.gtn':
              var $25 = Bool$false;
              var $24 = $25;
              break;
          case 'Cmp.eql':
              var $26 = Bool$true;
              var $24 = $26;
              break;
      };
      return $24;
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
              var $28 = self.pred;
              var $29 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $31 = self.pred;
                          var $32 = (_a$pred$10 => {
                              var $33 = Word$cmp$go$(_a$pred$10, $31, _c$4);
                              return $33;
                          });
                          var $30 = $32;
                          break;
                      case 'Word.i':
                          var $34 = self.pred;
                          var $35 = (_a$pred$10 => {
                              var $36 = Word$cmp$go$(_a$pred$10, $34, Cmp$ltn);
                              return $36;
                          });
                          var $30 = $35;
                          break;
                      case 'Word.e':
                          var $37 = (_a$pred$8 => {
                              var $38 = _c$4;
                              return $38;
                          });
                          var $30 = $37;
                          break;
                  };
                  var $30 = $30($28);
                  return $30;
              });
              var $27 = $29;
              break;
          case 'Word.i':
              var $39 = self.pred;
              var $40 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $42 = self.pred;
                          var $43 = (_a$pred$10 => {
                              var $44 = Word$cmp$go$(_a$pred$10, $42, Cmp$gtn);
                              return $44;
                          });
                          var $41 = $43;
                          break;
                      case 'Word.i':
                          var $45 = self.pred;
                          var $46 = (_a$pred$10 => {
                              var $47 = Word$cmp$go$(_a$pred$10, $45, _c$4);
                              return $47;
                          });
                          var $41 = $46;
                          break;
                      case 'Word.e':
                          var $48 = (_a$pred$8 => {
                              var $49 = _c$4;
                              return $49;
                          });
                          var $41 = $48;
                          break;
                  };
                  var $41 = $41($39);
                  return $41;
              });
              var $27 = $40;
              break;
          case 'Word.e':
              var $50 = (_b$5 => {
                  var $51 = _c$4;
                  return $51;
              });
              var $27 = $50;
              break;
      };
      var $27 = $27(_b$3);
      return $27;
  };
  const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
  const Cmp$eql = ({
      _: 'Cmp.eql'
  });

  function Word$cmp$(_a$2, _b$3) {
      var $52 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
      return $52;
  };
  const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

  function Word$eql$(_a$2, _b$3) {
      var $53 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
      return $53;
  };
  const Word$eql = x0 => x1 => Word$eql$(x0, x1);

  function Nat$succ$(_pred$1) {
      var $54 = 1n + _pred$1;
      return $54;
  };
  const Nat$succ = x0 => Nat$succ$(x0);
  const Nat$zero = 0n;
  const U16$eql = a0 => a1 => (a0 === a1);

  function Char$parse$type$(_str$1) {
      var $55 = null;
      return $55;
  };
  const Char$parse$type = x0 => Char$parse$type$(x0);
  const Unit$new = null;

  function Char$parse$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $57 = Unit$new;
          var $56 = $57;
      } else {
          var $58 = self.charCodeAt(0);
          var $59 = self.slice(1);
          var $60 = $58;
          var $56 = $60;
      };
      return $56;
  };
  const Char$parse = x0 => Char$parse$(x0);
  const Bits$i = a0 => (a0 + '1');
  const Bits$o = a0 => (a0 + '0');

  function Bits$read$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $62 = Bits$e;
          var $61 = $62;
      } else {
          var $63 = self.charCodeAt(0);
          var $64 = self.slice(1);
          var self = ($63 === Char$parse$("1"));
          if (self) {
              var $66 = (Bits$read$($64) + '1');
              var $65 = $66;
          } else {
              var $67 = (Bits$read$($64) + '0');
              var $65 = $67;
          };
          var $61 = $65;
      };
      return $61;
  };
  const Bits$read = x0 => Bits$read$(x0);

  function Pair$fst$(_pair$3) {
      var self = _pair$3;
      switch (self._) {
          case 'Pair.new':
              var $69 = self.fst;
              var $70 = $69;
              var $68 = $70;
              break;
      };
      return $68;
  };
  const Pair$fst = x0 => Pair$fst$(x0);

  function Either$(_A$1, _B$2) {
      var $71 = null;
      return $71;
  };
  const Either = x0 => x1 => Either$(x0, x1);

  function Either$left$(_value$3) {
      var $72 = ({
          _: 'Either.left',
          'value': _value$3
      });
      return $72;
  };
  const Either$left = x0 => Either$left$(x0);

  function Either$right$(_value$3) {
      var $73 = ({
          _: 'Either.right',
          'value': _value$3
      });
      return $73;
  };
  const Either$right = x0 => Either$right$(x0);

  function Nat$sub_rem$(_n$1, _m$2) {
      var Nat$sub_rem$ = (_n$1, _m$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2]
      });
      var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
      var arg = [_n$1, _m$2];
      while (true) {
          let [_n$1, _m$2] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $74 = Either$left$(_n$1);
                  return $74;
              } else {
                  var $75 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $77 = Either$right$(Nat$succ$($75));
                      var $76 = $77;
                  } else {
                      var $78 = (self - 1n);
                      var $79 = Nat$sub_rem$($78, $75);
                      var $76 = $79;
                  };
                  return $76;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

  function Pair$(_A$1, _B$2) {
      var $80 = null;
      return $80;
  };
  const Pair = x0 => x1 => Pair$(x0, x1);

  function Pair$new$(_fst$3, _snd$4) {
      var $81 = ({
          _: 'Pair.new',
          'fst': _fst$3,
          'snd': _snd$4
      });
      return $81;
  };
  const Pair$new = x0 => x1 => Pair$new$(x0, x1);

  function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
      var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _d$3]
      });
      var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
      var arg = [_n$1, _m$2, _d$3];
      while (true) {
          let [_n$1, _m$2, _d$3] = arg;
          var R = (() => {
              var self = Nat$sub_rem$(_n$1, _m$2);
              switch (self._) {
                  case 'Either.left':
                      var $82 = self.value;
                      var $83 = Nat$div_mod$go$($82, _m$2, Nat$succ$(_d$3));
                      return $83;
                  case 'Either.right':
                      var $84 = Pair$new$(_d$3, _n$1);
                      return $84;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
  const Nat$div_mod = a0 => a1 => (({
      _: 'Pair.new',
      'fst': a0 / a1,
      'snd': a0 % a1
  }));
  const Nat$div = a0 => a1 => (a0 / a1);

  function Bits$length$go$(_xs$1, _n$2) {
      var Bits$length$go$ = (_xs$1, _n$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _n$2]
      });
      var Bits$length$go = _xs$1 => _n$2 => Bits$length$go$(_xs$1, _n$2);
      var arg = [_xs$1, _n$2];
      while (true) {
          let [_xs$1, _n$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $85 = self.slice(0, -1);
                      var $86 = Bits$length$go$($85, Nat$succ$(_n$2));
                      return $86;
                  case 'i':
                      var $87 = self.slice(0, -1);
                      var $88 = Bits$length$go$($87, Nat$succ$(_n$2));
                      return $88;
                  case 'e':
                      var $89 = _n$2;
                      return $89;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$length$go = x0 => x1 => Bits$length$go$(x0, x1);

  function Bits$length$(_xs$1) {
      var $90 = Bits$length$go$(_xs$1, 0n);
      return $90;
  };
  const Bits$length = x0 => Bits$length$(x0);
  const Nat$gtn = a0 => a1 => (a0 > a1);

  function Nat$mod$go$(_n$1, _m$2, _r$3) {
      var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _r$3]
      });
      var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
      var arg = [_n$1, _m$2, _r$3];
      while (true) {
          let [_n$1, _m$2, _r$3] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $91 = Nat$mod$go$(_n$1, _r$3, _m$2);
                  return $91;
              } else {
                  var $92 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $94 = _r$3;
                      var $93 = $94;
                  } else {
                      var $95 = (self - 1n);
                      var $96 = Nat$mod$go$($95, $92, Nat$succ$(_r$3));
                      var $93 = $96;
                  };
                  return $93;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
  const Nat$mod = a0 => a1 => (a0 % a1);
  const Nat$add = a0 => a1 => (a0 + a1);

  function Nat$max$(_a$1, _b$2) {
      var self = (_a$1 > _b$2);
      if (self) {
          var $98 = _a$1;
          var $97 = $98;
      } else {
          var $99 = _b$2;
          var $97 = $99;
      };
      return $97;
  };
  const Nat$max = x0 => x1 => Nat$max$(x0, x1);

  function Ether$Bits$get_bytes_size$(_bytes$1) {
      var _bytes_size$2 = (Bits$length$(_bytes$1) / 8n);
      var self = ((Bits$length$(_bytes$1) % 8n) > 0n);
      if (self) {
          var $101 = (_bytes_size$2 + 1n);
          var $100 = $101;
      } else {
          var $102 = Nat$max$(1n, _bytes_size$2);
          var $100 = $102;
      };
      return $100;
  };
  const Ether$Bits$get_bytes_size = x0 => Ether$Bits$get_bytes_size$(x0);
  const Bool$and = a0 => a1 => (a0 && a1);
  const Nat$eql = a0 => a1 => (a0 === a1);

  function Cmp$as_ltn$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
              var $104 = Bool$true;
              var $103 = $104;
              break;
          case 'Cmp.eql':
          case 'Cmp.gtn':
              var $105 = Bool$false;
              var $103 = $105;
              break;
      };
      return $103;
  };
  const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

  function Bits$cmp$go$(_a$1, _b$2, _c$3) {
      var Bits$cmp$go$ = (_a$1, _b$2, _c$3) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2, _c$3]
      });
      var Bits$cmp$go = _a$1 => _b$2 => _c$3 => Bits$cmp$go$(_a$1, _b$2, _c$3);
      var arg = [_a$1, _b$2, _c$3];
      while (true) {
          let [_a$1, _b$2, _c$3] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $106 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $108 = self.slice(0, -1);
                              var $109 = Bits$cmp$go$($106, $108, _c$3);
                              var $107 = $109;
                              break;
                          case 'i':
                              var $110 = self.slice(0, -1);
                              var $111 = Bits$cmp$go$($106, $110, Cmp$ltn);
                              var $107 = $111;
                              break;
                          case 'e':
                              var $112 = Bits$cmp$go$($106, Bits$e, _c$3);
                              var $107 = $112;
                              break;
                      };
                      return $107;
                  case 'i':
                      var $113 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $115 = self.slice(0, -1);
                              var $116 = Bits$cmp$go$($113, $115, Cmp$gtn);
                              var $114 = $116;
                              break;
                          case 'i':
                              var $117 = self.slice(0, -1);
                              var $118 = Bits$cmp$go$($113, $117, _c$3);
                              var $114 = $118;
                              break;
                          case 'e':
                              var $119 = Cmp$gtn;
                              var $114 = $119;
                              break;
                      };
                      return $114;
                  case 'e':
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $121 = self.slice(0, -1);
                              var $122 = Bits$cmp$go$(Bits$e, $121, _c$3);
                              var $120 = $122;
                              break;
                          case 'e':
                              var $123 = _c$3;
                              var $120 = $123;
                              break;
                          case 'i':
                              var $124 = Cmp$ltn;
                              var $120 = $124;
                              break;
                      };
                      return $120;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$cmp$go = x0 => x1 => x2 => Bits$cmp$go$(x0, x1, x2);

  function Bits$cmp$(_a$1, _b$2) {
      var $125 = Bits$cmp$go$(_a$1, _b$2, Cmp$eql);
      return $125;
  };
  const Bits$cmp = x0 => x1 => Bits$cmp$(x0, x1);

  function Bits$ltn$(_a$1, _b$2) {
      var $126 = Cmp$as_ltn$(Bits$cmp$(_a$1, _b$2));
      return $126;
  };
  const Bits$ltn = x0 => x1 => Bits$ltn$(x0, x1);

  function Bits$inc$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $128 = self.slice(0, -1);
              var $129 = ($128 + '1');
              var $127 = $129;
              break;
          case 'i':
              var $130 = self.slice(0, -1);
              var $131 = (Bits$inc$($130) + '0');
              var $127 = $131;
              break;
          case 'e':
              var $132 = (Bits$e + '1');
              var $127 = $132;
              break;
      };
      return $127;
  };
  const Bits$inc = x0 => Bits$inc$(x0);
  const Nat$to_bits = a0 => (nat_to_bits(a0));
  const Ether$RLP$Constants$bits_128 = (nat_to_bits(128n));

  function Bits$concat$tail$(_a$1, _b$2) {
      var Bits$concat$tail$ = (_a$1, _b$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2]
      });
      var Bits$concat$tail = _a$1 => _b$2 => Bits$concat$tail$(_a$1, _b$2);
      var arg = [_a$1, _b$2];
      while (true) {
          let [_a$1, _b$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $133 = self.slice(0, -1);
                      var $134 = Bits$concat$tail$($133, (_b$2 + '0'));
                      return $134;
                  case 'i':
                      var $135 = self.slice(0, -1);
                      var $136 = Bits$concat$tail$($135, (_b$2 + '1'));
                      return $136;
                  case 'e':
                      var $137 = _b$2;
                      return $137;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$concat$tail = x0 => x1 => Bits$concat$tail$(x0, x1);

  function Bits$reverse$tco$(_a$1, _r$2) {
      var Bits$reverse$tco$ = (_a$1, _r$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _r$2]
      });
      var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
      var arg = [_a$1, _r$2];
      while (true) {
          let [_a$1, _r$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $138 = self.slice(0, -1);
                      var $139 = Bits$reverse$tco$($138, (_r$2 + '0'));
                      return $139;
                  case 'i':
                      var $140 = self.slice(0, -1);
                      var $141 = Bits$reverse$tco$($140, (_r$2 + '1'));
                      return $141;
                  case 'e':
                      var $142 = _r$2;
                      return $142;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

  function Bits$reverse$(_a$1) {
      var $143 = Bits$reverse$tco$(_a$1, Bits$e);
      return $143;
  };
  const Bits$reverse = x0 => Bits$reverse$(x0);

  function Bits$concat$go$(_a$1, _b$2) {
      var $144 = Bits$concat$tail$(Bits$reverse$(_a$1), _b$2);
      return $144;
  };
  const Bits$concat$go = x0 => x1 => Bits$concat$go$(x0, x1);
  const Nat$ltn = a0 => a1 => (a0 < a1);

  function Ether$RPL$proof$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $146 = Bits$e;
          var $145 = $146;
      } else {
          var $147 = Bits$concat$go$(Ether$RPL$proof$encode$binary$((_value$1 / 256n)), (nat_to_bits((_value$1 % 256n))));
          var $145 = $147;
      };
      return $145;
  };
  const Ether$RPL$proof$encode$binary = x0 => Ether$RPL$proof$encode$binary$(x0);

  function Ether$RPL$proof$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $149 = (nat_to_bits((_value$1 + _offSet$2)));
          var $148 = $149;
      } else {
          var _binary_encoding$3 = Ether$RPL$proof$encode$binary$(_value$1);
          var _len$4 = Ether$Bits$get_bytes_size$(_binary_encoding$3);
          var $150 = Bits$concat$go$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), _binary_encoding$3);
          var $148 = $150;
      };
      return $148;
  };
  const Ether$RPL$proof$encode_length = x0 => x1 => Ether$RPL$proof$encode_length$(x0, x1);
  const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
  const Bits$concat = a0 => a1 => (a1 + a0);
  const Debug$log = a0 => a1 => ((console.log(a0), a1()));

  function String$cons$(_head$1, _tail$2) {
      var $151 = (String.fromCharCode(_head$1) + _tail$2);
      return $151;
  };
  const String$cons = x0 => x1 => String$cons$(x0, x1);
  const String$concat = a0 => a1 => (a0 + a1);

  function List$fold$(_list$2, _nil$4, _cons$5) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $153 = self.head;
              var $154 = self.tail;
              var $155 = _cons$5($153)(List$fold$($154, _nil$4, _cons$5));
              var $152 = $155;
              break;
          case 'List.nil':
              var $156 = _nil$4;
              var $152 = $156;
              break;
      };
      return $152;
  };
  const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

  function List$(_A$1) {
      var $157 = null;
      return $157;
  };
  const List = x0 => List$(x0);

  function List$cons$(_head$2, _tail$3) {
      var $158 = ({
          _: 'List.cons',
          'head': _head$2,
          'tail': _tail$3
      });
      return $158;
  };
  const List$cons = x0 => x1 => List$cons$(x0, x1);

  function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
      var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
          ctr: 'TCO',
          arg: [_base$1, _nat$2, _res$3]
      });
      var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
      var arg = [_base$1, _nat$2, _res$3];
      while (true) {
          let [_base$1, _nat$2, _res$3] = arg;
          var R = (() => {
              var self = (({
                  _: 'Pair.new',
                  'fst': _nat$2 / _base$1,
                  'snd': _nat$2 % _base$1
              }));
              switch (self._) {
                  case 'Pair.new':
                      var $159 = self.fst;
                      var $160 = self.snd;
                      var self = $159;
                      if (self === 0n) {
                          var $162 = List$cons$($160, _res$3);
                          var $161 = $162;
                      } else {
                          var $163 = (self - 1n);
                          var $164 = Nat$to_base$go$(_base$1, $159, List$cons$($160, _res$3));
                          var $161 = $164;
                      };
                      return $161;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
  const List$nil = ({
      _: 'List.nil'
  });

  function Nat$to_base$(_base$1, _nat$2) {
      var $165 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
      return $165;
  };
  const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
  const String$nil = '';
  const Nat$lte = a0 => a1 => (a0 <= a1);

  function Maybe$(_A$1) {
      var $166 = null;
      return $166;
  };
  const Maybe = x0 => Maybe$(x0);
  const Maybe$none = ({
      _: 'Maybe.none'
  });

  function Maybe$some$(_value$2) {
      var $167 = ({
          _: 'Maybe.some',
          'value': _value$2
      });
      return $167;
  };
  const Maybe$some = x0 => Maybe$some$(x0);

  function List$at$(_index$2, _list$3) {
      var List$at$ = (_index$2, _list$3) => ({
          ctr: 'TCO',
          arg: [_index$2, _list$3]
      });
      var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
      var arg = [_index$2, _list$3];
      while (true) {
          let [_index$2, _list$3] = arg;
          var R = (() => {
              var self = _list$3;
              switch (self._) {
                  case 'List.cons':
                      var $168 = self.head;
                      var $169 = self.tail;
                      var self = _index$2;
                      if (self === 0n) {
                          var $171 = Maybe$some$($168);
                          var $170 = $171;
                      } else {
                          var $172 = (self - 1n);
                          var $173 = List$at$($172, $169);
                          var $170 = $173;
                      };
                      return $170;
                  case 'List.nil':
                      var $174 = Maybe$none;
                      return $174;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const List$at = x0 => x1 => List$at$(x0, x1);

  function Nat$show_digit$(_base$1, _n$2) {
      var _m$3 = (_n$2 % _base$1);
      var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
      var self = ((_base$1 > 0n) && (_base$1 <= 64n));
      if (self) {
          var self = List$at$(_m$3, _base64$4);
          switch (self._) {
              case 'Maybe.some':
                  var $177 = self.value;
                  var $178 = $177;
                  var $176 = $178;
                  break;
              case 'Maybe.none':
                  var $179 = 35;
                  var $176 = $179;
                  break;
          };
          var $175 = $176;
      } else {
          var $180 = 35;
          var $175 = $180;
      };
      return $175;
  };
  const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

  function Nat$to_string_base$(_base$1, _nat$2) {
      var $181 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
          var $182 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
          return $182;
      }));
      return $181;
  };
  const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

  function Nat$show$(_n$1) {
      var $183 = Nat$to_string_base$(10n, _n$1);
      return $183;
  };
  const Nat$show = x0 => Nat$show$(x0);

  function Ether$RLP$proof$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $185 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($185);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($185, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $187 = $185;
                  var $186 = $187;
              } else {
                  var $188 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$3, 128n), $185);
                  var $186 = $188;
              };
              var $184 = $186;
              break;
          case 'Ether.RLP.Tree.list':
              var $189 = self.value;
              var _bytes$3 = Bits$e;
              var _bytes$4 = (() => {
                  var $192 = _bytes$3;
                  var $193 = $189;
                  let _bytes$5 = $192;
                  let _item$4;
                  while ($193._ === 'List.cons') {
                      _item$4 = $193.head;
                      var $192 = (Ether$RLP$proof$encode$bytes$(_item$4) + _bytes$5);
                      _bytes$5 = $192;
                      $193 = $193.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = Ether$Bits$get_bytes_size$(_bytes$4);
              var $190 = ((console.log(("Second encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $194 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $194;
              })()));
              var $184 = $190;
              break;
      };
      return $184;
  };
  const Ether$RLP$proof$encode$bytes = x0 => Ether$RLP$proof$encode$bytes$(x0);

  function List$concat$(_as$2, _bs$3) {
      var self = _as$2;
      switch (self._) {
          case 'List.cons':
              var $196 = self.head;
              var $197 = self.tail;
              var $198 = List$cons$($196, List$concat$($197, _bs$3));
              var $195 = $198;
              break;
          case 'List.nil':
              var $199 = _bs$3;
              var $195 = $199;
              break;
      };
      return $195;
  };
  const List$concat = x0 => x1 => List$concat$(x0, x1);

  function Ether$RPL$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $201 = List$nil;
          var $200 = $201;
      } else {
          var $202 = List$concat$(Ether$RPL$encode$binary$((_value$1 / 256n)), List$cons$((nat_to_bits((_value$1 % 256n))), List$nil));
          var $200 = $202;
      };
      return $200;
  };
  const Ether$RPL$encode$binary = x0 => Ether$RPL$encode$binary$(x0);

  function List$foldr$(_nil$3, _cons$4, _xs$5) {
      var self = _xs$5;
      switch (self._) {
          case 'List.cons':
              var $204 = self.head;
              var $205 = self.tail;
              var $206 = _cons$4($204)(List$foldr$(_nil$3, _cons$4, $205));
              var $203 = $206;
              break;
          case 'List.nil':
              var $207 = _nil$3;
              var $203 = $207;
              break;
      };
      return $203;
  };
  const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

  function Bits$show$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $209 = self.slice(0, -1);
              var $210 = String$cons$(48, Bits$show$($209));
              var $208 = $210;
              break;
          case 'i':
              var $211 = self.slice(0, -1);
              var $212 = String$cons$(49, Bits$show$($211));
              var $208 = $212;
              break;
          case 'e':
              var $213 = "";
              var $208 = $213;
              break;
      };
      return $208;
  };
  const Bits$show = x0 => Bits$show$(x0);

  function Ether$RPL$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $215 = List$cons$((nat_to_bits((_value$1 + _offSet$2))), List$nil);
          var $214 = $215;
      } else {
          var self = (_value$1 < 18446744073709551616n);
          if (self) {
              var _binary_encoding$3 = Ether$RPL$encode$binary$(_value$1);
              var _len$4 = List$foldr$(0n, (_x$4 => _y$5 => {
                  var $218 = (Ether$Bits$get_bytes_size$(_x$4) + _y$5);
                  return $218;
              }), _binary_encoding$3);
              var $217 = ((console.log((Nat$show$(_value$1) + (" " + Bits$show$(List$foldr$(Bits$e, Bits$concat, List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3)))))), (_$5 => {
                  var $219 = List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3);
                  return $219;
              })()));
              var $216 = $217;
          } else {
              var $220 = List$nil;
              var $216 = $220;
          };
          var $214 = $216;
      };
      return $214;
  };
  const Ether$RPL$encode_length = x0 => x1 => Ether$RPL$encode_length$(x0, x1);

  function Ether$RLP$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $222 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($222);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($222, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $224 = List$cons$($222, List$nil);
                  var $223 = $224;
              } else {
                  var $225 = List$concat$(Ether$RPL$encode_length$(_bytes_size$3, 128n), List$cons$($222, List$nil));
                  var $223 = $225;
              };
              var $221 = $223;
              break;
          case 'Ether.RLP.Tree.list':
              var $226 = self.value;
              var _bytes$3 = List$nil;
              var _bytes$4 = (() => {
                  var $229 = _bytes$3;
                  var $230 = $226;
                  let _bytes$5 = $229;
                  let _item$4;
                  while ($230._ === 'List.cons') {
                      _item$4 = $230.head;
                      var $229 = List$concat$(_bytes$5, Ether$RLP$encode$bytes$(_item$4));
                      _bytes$5 = $229;
                      $230 = $230.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = List$foldr$(0n, (_x$5 => _y$6 => {
                  var $231 = (Ether$Bits$get_bytes_size$(_x$5) + _y$6);
                  return $231;
              }), _bytes$4);
              var $227 = ((console.log(("first encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $232 = List$concat$(Ether$RPL$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $232;
              })()));
              var $221 = $227;
              break;
      };
      return $221;
  };
  const Ether$RLP$encode$bytes = x0 => Ether$RLP$encode$bytes$(x0);

  function Bits$take$(_n$1, _xs$2) {
      var self = _n$1;
      if (self === 0n) {
          var $234 = Bits$e;
          var $233 = $234;
      } else {
          var $235 = (self - 1n);
          var self = _xs$2;
          switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
              case 'o':
                  var $237 = self.slice(0, -1);
                  var $238 = (Bits$take$($235, $237) + '0');
                  var $236 = $238;
                  break;
              case 'i':
                  var $239 = self.slice(0, -1);
                  var $240 = (Bits$take$($235, $239) + '1');
                  var $236 = $240;
                  break;
              case 'e':
                  var $241 = Bits$e;
                  var $236 = $241;
                  break;
          };
          var $233 = $236;
      };
      return $233;
  };
  const Bits$take = x0 => x1 => Bits$take$(x0, x1);

  function Bits$drop$(_n$1, _xs$2) {
      var Bits$drop$ = (_n$1, _xs$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _xs$2]
      });
      var Bits$drop = _n$1 => _xs$2 => Bits$drop$(_n$1, _xs$2);
      var arg = [_n$1, _xs$2];
      while (true) {
          let [_n$1, _xs$2] = arg;
          var R = (() => {
              var self = _n$1;
              if (self === 0n) {
                  var $242 = _xs$2;
                  return $242;
              } else {
                  var $243 = (self - 1n);
                  var self = _xs$2;
                  switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                      case 'o':
                          var $245 = self.slice(0, -1);
                          var $246 = Bits$drop$($243, $245);
                          var $244 = $246;
                          break;
                      case 'i':
                          var $247 = self.slice(0, -1);
                          var $248 = Bits$drop$($243, $247);
                          var $244 = $248;
                          break;
                      case 'e':
                          var $249 = _xs$2;
                          var $244 = $249;
                          break;
                  };
                  return $244;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$drop = x0 => x1 => Bits$drop$(x0, x1);

  function Bits$break$(_len$1, _bits$2) {
      var $250 = Pair$new$(Bits$take$(_len$1, _bits$2), Bits$drop$(_len$1, _bits$2));
      return $250;
  };
  const Bits$break = x0 => x1 => Bits$break$(x0, x1);

  function String$reverse$go$(_xs$1, _res$2) {
      var String$reverse$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$reverse$go = _xs$1 => _res$2 => String$reverse$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              if (self.length === 0) {
                  var $251 = _res$2;
                  return $251;
              } else {
                  var $252 = self.charCodeAt(0);
                  var $253 = self.slice(1);
                  var $254 = String$reverse$go$($253, String$cons$($252, _res$2));
                  return $254;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

  function String$reverse$(_xs$1) {
      var $255 = String$reverse$go$(_xs$1, String$nil);
      return $255;
  };
  const String$reverse = x0 => String$reverse$(x0);

  function Bits$hex$encode$(_x$1) {
      var self = _x$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $257 = self.slice(0, -1);
              var self = $257;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $259 = self.slice(0, -1);
                      var self = $259;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $261 = self.slice(0, -1);
                              var self = $261;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $263 = self.slice(0, -1);
                                      var $264 = ("0" + Bits$hex$encode$($263));
                                      var $262 = $264;
                                      break;
                                  case 'i':
                                      var $265 = self.slice(0, -1);
                                      var $266 = ("8" + Bits$hex$encode$($265));
                                      var $262 = $266;
                                      break;
                                  case 'e':
                                      var $267 = "0";
                                      var $262 = $267;
                                      break;
                              };
                              var $260 = $262;
                              break;
                          case 'i':
                              var $268 = self.slice(0, -1);
                              var self = $268;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $270 = self.slice(0, -1);
                                      var $271 = ("4" + Bits$hex$encode$($270));
                                      var $269 = $271;
                                      break;
                                  case 'i':
                                      var $272 = self.slice(0, -1);
                                      var $273 = ("c" + Bits$hex$encode$($272));
                                      var $269 = $273;
                                      break;
                                  case 'e':
                                      var $274 = "4";
                                      var $269 = $274;
                                      break;
                              };
                              var $260 = $269;
                              break;
                          case 'e':
                              var $275 = "0";
                              var $260 = $275;
                              break;
                      };
                      var $258 = $260;
                      break;
                  case 'i':
                      var $276 = self.slice(0, -1);
                      var self = $276;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $278 = self.slice(0, -1);
                              var self = $278;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $280 = self.slice(0, -1);
                                      var $281 = ("2" + Bits$hex$encode$($280));
                                      var $279 = $281;
                                      break;
                                  case 'i':
                                      var $282 = self.slice(0, -1);
                                      var $283 = ("a" + Bits$hex$encode$($282));
                                      var $279 = $283;
                                      break;
                                  case 'e':
                                      var $284 = "2";
                                      var $279 = $284;
                                      break;
                              };
                              var $277 = $279;
                              break;
                          case 'i':
                              var $285 = self.slice(0, -1);
                              var self = $285;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $287 = self.slice(0, -1);
                                      var $288 = ("6" + Bits$hex$encode$($287));
                                      var $286 = $288;
                                      break;
                                  case 'i':
                                      var $289 = self.slice(0, -1);
                                      var $290 = ("e" + Bits$hex$encode$($289));
                                      var $286 = $290;
                                      break;
                                  case 'e':
                                      var $291 = "6";
                                      var $286 = $291;
                                      break;
                              };
                              var $277 = $286;
                              break;
                          case 'e':
                              var $292 = "2";
                              var $277 = $292;
                              break;
                      };
                      var $258 = $277;
                      break;
                  case 'e':
                      var $293 = "0";
                      var $258 = $293;
                      break;
              };
              var $256 = $258;
              break;
          case 'i':
              var $294 = self.slice(0, -1);
              var self = $294;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $296 = self.slice(0, -1);
                      var self = $296;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $298 = self.slice(0, -1);
                              var self = $298;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $300 = self.slice(0, -1);
                                      var $301 = ("1" + Bits$hex$encode$($300));
                                      var $299 = $301;
                                      break;
                                  case 'i':
                                      var $302 = self.slice(0, -1);
                                      var $303 = ("9" + Bits$hex$encode$($302));
                                      var $299 = $303;
                                      break;
                                  case 'e':
                                      var $304 = "1";
                                      var $299 = $304;
                                      break;
                              };
                              var $297 = $299;
                              break;
                          case 'i':
                              var $305 = self.slice(0, -1);
                              var self = $305;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $307 = self.slice(0, -1);
                                      var $308 = ("5" + Bits$hex$encode$($307));
                                      var $306 = $308;
                                      break;
                                  case 'i':
                                      var $309 = self.slice(0, -1);
                                      var $310 = ("d" + Bits$hex$encode$($309));
                                      var $306 = $310;
                                      break;
                                  case 'e':
                                      var $311 = "5";
                                      var $306 = $311;
                                      break;
                              };
                              var $297 = $306;
                              break;
                          case 'e':
                              var $312 = "1";
                              var $297 = $312;
                              break;
                      };
                      var $295 = $297;
                      break;
                  case 'i':
                      var $313 = self.slice(0, -1);
                      var self = $313;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $315 = self.slice(0, -1);
                              var self = $315;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $317 = self.slice(0, -1);
                                      var $318 = ("3" + Bits$hex$encode$($317));
                                      var $316 = $318;
                                      break;
                                  case 'i':
                                      var $319 = self.slice(0, -1);
                                      var $320 = ("b" + Bits$hex$encode$($319));
                                      var $316 = $320;
                                      break;
                                  case 'e':
                                      var $321 = "3";
                                      var $316 = $321;
                                      break;
                              };
                              var $314 = $316;
                              break;
                          case 'i':
                              var $322 = self.slice(0, -1);
                              var self = $322;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $324 = self.slice(0, -1);
                                      var $325 = ("7" + Bits$hex$encode$($324));
                                      var $323 = $325;
                                      break;
                                  case 'i':
                                      var $326 = self.slice(0, -1);
                                      var $327 = ("f" + Bits$hex$encode$($326));
                                      var $323 = $327;
                                      break;
                                  case 'e':
                                      var $328 = "7";
                                      var $323 = $328;
                                      break;
                              };
                              var $314 = $323;
                              break;
                          case 'e':
                              var $329 = "3";
                              var $314 = $329;
                              break;
                      };
                      var $295 = $314;
                      break;
                  case 'e':
                      var $330 = "1";
                      var $295 = $330;
                      break;
              };
              var $256 = $295;
              break;
          case 'e':
              var $331 = "";
              var $256 = $331;
              break;
      };
      return $256;
  };
  const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
  const Ether$RLP$Constants$bits_184 = (nat_to_bits(184n));
  const Nat$mul = a0 => a1 => (a0 * a1);
  const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

  function Bits$to_nat$(_b$1) {
      var self = _b$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $333 = self.slice(0, -1);
              var $334 = (2n * Bits$to_nat$($333));
              var $332 = $334;
              break;
          case 'i':
              var $335 = self.slice(0, -1);
              var $336 = Nat$succ$((2n * Bits$to_nat$($335)));
              var $332 = $336;
              break;
          case 'e':
              var $337 = 0n;
              var $332 = $337;
              break;
      };
      return $332;
  };
  const Bits$to_nat = x0 => Bits$to_nat$(x0);
  const Ether$RLP$Constants$bits_192 = (nat_to_bits(192n));
  const Bits$eql = a0 => a1 => (a1 === a0);

  function Ether$RLP$proof$encode$read$binary$(_value$1) {
      var self = Bits$break$(8n, _value$1);
      switch (self._) {
          case 'Pair.new':
              var $339 = self.fst;
              var $340 = self.snd;
              var _decode$4 = Bits$to_nat$($339);
              var self = ((Bits$e + '0') === $340);
              if (self) {
                  var $342 = _decode$4;
                  var $341 = $342;
              } else {
                  var $343 = (Ether$RLP$proof$encode$read$binary$($340) + (_decode$4 * 256n));
                  var $341 = $343;
              };
              var $338 = $341;
              break;
      };
      return $338;
  };
  const Ether$RLP$proof$encode$read$binary = x0 => Ether$RLP$proof$encode$read$binary$(x0);

  function Ether$RLP$proof$encode$read$(_bits$1) {
      var self = Bits$break$(8n, _bits$1);
      switch (self._) {
          case 'Pair.new':
              var $345 = self.fst;
              var $346 = self.snd;
              var $347 = ("0x" + (() => {
                  var self = Bits$ltn$($345, Ether$RLP$Constants$bits_128);
                  if (self) {
                      var $348 = String$reverse$(Bits$hex$encode$(_bits$1));
                      return $348;
                  } else {
                      var self = Bits$ltn$($345, Ether$RLP$Constants$bits_184);
                      if (self) {
                          var _content_length$4 = ((Bits$to_nat$($345) - 128n <= 0n ? 0n : Bits$to_nat$($345) - 128n) * 8n);
                          var self = Bits$break$(_content_length$4, $346);
                          switch (self._) {
                              case 'Pair.new':
                                  var $351 = self.fst;
                                  var $352 = (String$reverse$(Bits$hex$encode$($345)) + String$reverse$(Bits$hex$encode$($351)));
                                  var $350 = $352;
                                  break;
                          };
                          var $349 = $350;
                      } else {
                          var self = Bits$ltn$($345, Ether$RLP$Constants$bits_192);
                          if (self) {
                              var _content_length$4 = ((Bits$to_nat$($345) - 183n <= 0n ? 0n : Bits$to_nat$($345) - 183n) * 8n);
                              var self = Bits$break$(_content_length$4, $346);
                              switch (self._) {
                                  case 'Pair.new':
                                      var $355 = self.fst;
                                      var $356 = self.snd;
                                      var _length$7 = Ether$RLP$proof$encode$read$binary$($355);
                                      var self = Bits$break$((_length$7 * 8n), $356);
                                      switch (self._) {
                                          case 'Pair.new':
                                              var $358 = self.fst;
                                              var $359 = (String$reverse$(Bits$hex$encode$($345)) + (String$reverse$(Bits$hex$encode$($355)) + String$reverse$(Bits$hex$encode$($358))));
                                              var $357 = $359;
                                              break;
                                      };
                                      var $354 = $357;
                                      break;
                              };
                              var $353 = $354;
                          } else {
                              var $360 = "";
                              var $353 = $360;
                          };
                          var $349 = $353;
                      };
                      return $349;
                  };
              })());
              var $344 = $347;
              break;
      };
      return $344;
  };
  const Ether$RLP$proof$encode$read = x0 => Ether$RLP$proof$encode$read$(x0);

  function List$map$(_f$3, _as$4) {
      var self = _as$4;
      switch (self._) {
          case 'List.cons':
              var $362 = self.head;
              var $363 = self.tail;
              var $364 = List$cons$(_f$3($362), List$map$(_f$3, $363));
              var $361 = $364;
              break;
          case 'List.nil':
              var $365 = List$nil;
              var $361 = $365;
              break;
      };
      return $361;
  };
  const List$map = x0 => x1 => List$map$(x0, x1);

  function String$pad_right$(_size$1, _chr$2, _str$3) {
      var self = _size$1;
      if (self === 0n) {
          var $367 = _str$3;
          var $366 = $367;
      } else {
          var $368 = (self - 1n);
          var self = _str$3;
          if (self.length === 0) {
              var $370 = String$cons$(_chr$2, String$pad_right$($368, _chr$2, ""));
              var $369 = $370;
          } else {
              var $371 = self.charCodeAt(0);
              var $372 = self.slice(1);
              var $373 = String$cons$($371, String$pad_right$($368, _chr$2, $372));
              var $369 = $373;
          };
          var $366 = $369;
      };
      return $366;
  };
  const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

  function String$pad_left$(_size$1, _chr$2, _str$3) {
      var $374 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
      return $374;
  };
  const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

  function String$flatten$go$(_xs$1, _res$2) {
      var String$flatten$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self._) {
                  case 'List.cons':
                      var $375 = self.head;
                      var $376 = self.tail;
                      var $377 = String$flatten$go$($376, (_res$2 + $375));
                      return $377;
                  case 'List.nil':
                      var $378 = _res$2;
                      return $378;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

  function String$flatten$(_xs$1) {
      var $379 = String$flatten$go$(_xs$1, "");
      return $379;
  };
  const String$flatten = x0 => String$flatten$(x0);

  function String$join$go$(_sep$1, _list$2, _fst$3) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $381 = self.head;
              var $382 = self.tail;
              var $383 = String$flatten$(List$cons$((() => {
                  var self = _fst$3;
                  if (self) {
                      var $384 = "";
                      return $384;
                  } else {
                      var $385 = _sep$1;
                      return $385;
                  };
              })(), List$cons$($381, List$cons$(String$join$go$(_sep$1, $382, Bool$false), List$nil))));
              var $380 = $383;
              break;
          case 'List.nil':
              var $386 = "";
              var $380 = $386;
              break;
      };
      return $380;
  };
  const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

  function String$join$(_sep$1, _list$2) {
      var $387 = String$join$go$(_sep$1, _list$2, Bool$true);
      return $387;
  };
  const String$join = x0 => x1 => String$join$(x0, x1);

  function Ether$RLP$encode$read$(_bits$1) {
      var _hexfify$2 = List$map$((_x$2 => {
          var $389 = String$pad_left$(2n, 48, String$reverse$(Bits$hex$encode$(_x$2)));
          return $389;
      }), _bits$1);
      var $388 = ("0x" + String$join$("", _hexfify$2));
      return $388;
  };
  const Ether$RLP$encode$read = x0 => Ether$RLP$encode$read$(x0);
  const Ether$tests = (() => {
      var _v$1 = Ether$RLP$Tree$tip$(Bits$read$("1000000100000000000000000110110000000000000000000010000000000000000011011000111111111111111111111111111111111011111000000000000100011111111111111111111111111111111101111100000000000000000000000000000001000000000000000001101100100011111111111111111111111111111111101111100000000000010001111111111111111111111111111111110111110000000000000000000000000000000100000000000000000110110000000000000000000010000000000000000011011000000000000000000010110110"));
      var _test1$2 = Ether$RLP$proof$encode$bytes$(_v$1);
      var _test2$3 = Ether$RLP$encode$bytes$(_v$1);
      var $390 = ((console.log(Ether$RLP$proof$encode$read$(_test1$2)), (_$4 => {
          var $391 = ((console.log(Ether$RLP$encode$read$(_test2$3)), (_$5 => {
              var _test2$6 = List$foldr$(Bits$e, Bits$concat, _test2$3);
              var $392 = Pair$new$(_test1$2, _test2$6);
              return $392;
          })()));
          return $391;
      })()));
      return $390;
  })();
  return {
      'Ether.RLP.Tree.tip': Ether$RLP$Tree$tip,
      'Bits.e': Bits$e,
      'Bool.false': Bool$false,
      'Bool.true': Bool$true,
      'Cmp.as_eql': Cmp$as_eql,
      'Cmp.ltn': Cmp$ltn,
      'Cmp.gtn': Cmp$gtn,
      'Word.cmp.go': Word$cmp$go,
      'Cmp.eql': Cmp$eql,
      'Word.cmp': Word$cmp,
      'Word.eql': Word$eql,
      'Nat.succ': Nat$succ,
      'Nat.zero': Nat$zero,
      'U16.eql': U16$eql,
      'Char.parse.type': Char$parse$type,
      'Unit.new': Unit$new,
      'Char.parse': Char$parse,
      'Bits.i': Bits$i,
      'Bits.o': Bits$o,
      'Bits.read': Bits$read,
      'Pair.fst': Pair$fst,
      'Either': Either,
      'Either.left': Either$left,
      'Either.right': Either$right,
      'Nat.sub_rem': Nat$sub_rem,
      'Pair': Pair,
      'Pair.new': Pair$new,
      'Nat.div_mod.go': Nat$div_mod$go,
      'Nat.div_mod': Nat$div_mod,
      'Nat.div': Nat$div,
      'Bits.length.go': Bits$length$go,
      'Bits.length': Bits$length,
      'Nat.gtn': Nat$gtn,
      'Nat.mod.go': Nat$mod$go,
      'Nat.mod': Nat$mod,
      'Nat.add': Nat$add,
      'Nat.max': Nat$max,
      'Ether.Bits.get_bytes_size': Ether$Bits$get_bytes_size,
      'Bool.and': Bool$and,
      'Nat.eql': Nat$eql,
      'Cmp.as_ltn': Cmp$as_ltn,
      'Bits.cmp.go': Bits$cmp$go,
      'Bits.cmp': Bits$cmp,
      'Bits.ltn': Bits$ltn,
      'Bits.inc': Bits$inc,
      'Nat.to_bits': Nat$to_bits,
      'Ether.RLP.Constants.bits_128': Ether$RLP$Constants$bits_128,
      'Bits.concat.tail': Bits$concat$tail,
      'Bits.reverse.tco': Bits$reverse$tco,
      'Bits.reverse': Bits$reverse,
      'Bits.concat.go': Bits$concat$go,
      'Nat.ltn': Nat$ltn,
      'Ether.RPL.proof.encode.binary': Ether$RPL$proof$encode$binary,
      'Ether.RPL.proof.encode_length': Ether$RPL$proof$encode_length,
      'List.for': List$for,
      'Bits.concat': Bits$concat,
      'Debug.log': Debug$log,
      'String.cons': String$cons,
      'String.concat': String$concat,
      'List.fold': List$fold,
      'List': List,
      'List.cons': List$cons,
      'Nat.to_base.go': Nat$to_base$go,
      'List.nil': List$nil,
      'Nat.to_base': Nat$to_base,
      'String.nil': String$nil,
      'Nat.lte': Nat$lte,
      'Maybe': Maybe,
      'Maybe.none': Maybe$none,
      'Maybe.some': Maybe$some,
      'List.at': List$at,
      'Nat.show_digit': Nat$show_digit,
      'Nat.to_string_base': Nat$to_string_base,
      'Nat.show': Nat$show,
      'Ether.RLP.proof.encode.bytes': Ether$RLP$proof$encode$bytes,
      'List.concat': List$concat,
      'Ether.RPL.encode.binary': Ether$RPL$encode$binary,
      'List.foldr': List$foldr,
      'Bits.show': Bits$show,
      'Ether.RPL.encode_length': Ether$RPL$encode_length,
      'Ether.RLP.encode.bytes': Ether$RLP$encode$bytes,
      'Bits.take': Bits$take,
      'Bits.drop': Bits$drop,
      'Bits.break': Bits$break,
      'String.reverse.go': String$reverse$go,
      'String.reverse': String$reverse,
      'Bits.hex.encode': Bits$hex$encode,
      'Ether.RLP.Constants.bits_184': Ether$RLP$Constants$bits_184,
      'Nat.mul': Nat$mul,
      'Nat.sub': Nat$sub,
      'Bits.to_nat': Bits$to_nat,
      'Ether.RLP.Constants.bits_192': Ether$RLP$Constants$bits_192,
      'Bits.eql': Bits$eql,
      'Ether.RLP.proof.encode.read.binary': Ether$RLP$proof$encode$read$binary,
      'Ether.RLP.proof.encode.read': Ether$RLP$proof$encode$read,
      'List.map': List$map,
      'String.pad_right': String$pad_right,
      'String.pad_left': String$pad_left,
      'String.flatten.go': String$flatten$go,
      'String.flatten': String$flatten,
      'String.join.go': String$join$go,
      'String.join': String$join,
      'Ether.RLP.encode.read': Ether$RLP$encode$read,
      'Ether.tests': Ether$tests,
  };
})();
var MAIN = module.exports['Ether.tests'];
try {
  console.log(JSON.stringify(MAIN, null, 2) || '<unprintable>')
} catch (e) {
  console.log(MAIN);
};
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
  var list_for = list => nil => cons => {
      while (list._ !== 'List.nil') {
          nil = cons(list.head)(nil);
          list = list.tail;
      }
      return nil;
  };
  var nat_to_bits = n => {
      return n === 0n ? '' : n.toString(2);
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
  const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
  const elim_string = (x => {
      var $22 = (() => c0 => c1 => {
          var self = x;
          if (self.length === 0) {
              var $18 = c0;
              return $18;
          } else {
              var $19 = self.charCodeAt(0);
              var $20 = self.slice(1);
              var $21 = c1($19)($20);
              return $21;
          };
      })();
      return $22;
  });

  function Ether$RLP$Tree$tip$(_value$1) {
      var $23 = ({
          _: 'Ether.RLP.Tree.tip',
          'value': _value$1
      });
      return $23;
  };
  const Ether$RLP$Tree$tip = x0 => Ether$RLP$Tree$tip$(x0);
  const Bits$e = '';
  const Bool$false = false;
  const Bool$true = true;

  function Cmp$as_eql$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
          case 'Cmp.gtn':
              var $25 = Bool$false;
              var $24 = $25;
              break;
          case 'Cmp.eql':
              var $26 = Bool$true;
              var $24 = $26;
              break;
      };
      return $24;
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
              var $28 = self.pred;
              var $29 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $31 = self.pred;
                          var $32 = (_a$pred$10 => {
                              var $33 = Word$cmp$go$(_a$pred$10, $31, _c$4);
                              return $33;
                          });
                          var $30 = $32;
                          break;
                      case 'Word.i':
                          var $34 = self.pred;
                          var $35 = (_a$pred$10 => {
                              var $36 = Word$cmp$go$(_a$pred$10, $34, Cmp$ltn);
                              return $36;
                          });
                          var $30 = $35;
                          break;
                      case 'Word.e':
                          var $37 = (_a$pred$8 => {
                              var $38 = _c$4;
                              return $38;
                          });
                          var $30 = $37;
                          break;
                  };
                  var $30 = $30($28);
                  return $30;
              });
              var $27 = $29;
              break;
          case 'Word.i':
              var $39 = self.pred;
              var $40 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $42 = self.pred;
                          var $43 = (_a$pred$10 => {
                              var $44 = Word$cmp$go$(_a$pred$10, $42, Cmp$gtn);
                              return $44;
                          });
                          var $41 = $43;
                          break;
                      case 'Word.i':
                          var $45 = self.pred;
                          var $46 = (_a$pred$10 => {
                              var $47 = Word$cmp$go$(_a$pred$10, $45, _c$4);
                              return $47;
                          });
                          var $41 = $46;
                          break;
                      case 'Word.e':
                          var $48 = (_a$pred$8 => {
                              var $49 = _c$4;
                              return $49;
                          });
                          var $41 = $48;
                          break;
                  };
                  var $41 = $41($39);
                  return $41;
              });
              var $27 = $40;
              break;
          case 'Word.e':
              var $50 = (_b$5 => {
                  var $51 = _c$4;
                  return $51;
              });
              var $27 = $50;
              break;
      };
      var $27 = $27(_b$3);
      return $27;
  };
  const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
  const Cmp$eql = ({
      _: 'Cmp.eql'
  });

  function Word$cmp$(_a$2, _b$3) {
      var $52 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
      return $52;
  };
  const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

  function Word$eql$(_a$2, _b$3) {
      var $53 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
      return $53;
  };
  const Word$eql = x0 => x1 => Word$eql$(x0, x1);

  function Nat$succ$(_pred$1) {
      var $54 = 1n + _pred$1;
      return $54;
  };
  const Nat$succ = x0 => Nat$succ$(x0);
  const Nat$zero = 0n;
  const U16$eql = a0 => a1 => (a0 === a1);

  function Char$parse$type$(_str$1) {
      var $55 = null;
      return $55;
  };
  const Char$parse$type = x0 => Char$parse$type$(x0);
  const Unit$new = null;

  function Char$parse$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $57 = Unit$new;
          var $56 = $57;
      } else {
          var $58 = self.charCodeAt(0);
          var $59 = self.slice(1);
          var $60 = $58;
          var $56 = $60;
      };
      return $56;
  };
  const Char$parse = x0 => Char$parse$(x0);
  const Bits$i = a0 => (a0 + '1');
  const Bits$o = a0 => (a0 + '0');

  function Bits$read$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $62 = Bits$e;
          var $61 = $62;
      } else {
          var $63 = self.charCodeAt(0);
          var $64 = self.slice(1);
          var self = ($63 === Char$parse$("1"));
          if (self) {
              var $66 = (Bits$read$($64) + '1');
              var $65 = $66;
          } else {
              var $67 = (Bits$read$($64) + '0');
              var $65 = $67;
          };
          var $61 = $65;
      };
      return $61;
  };
  const Bits$read = x0 => Bits$read$(x0);

  function Pair$fst$(_pair$3) {
      var self = _pair$3;
      switch (self._) {
          case 'Pair.new':
              var $69 = self.fst;
              var $70 = $69;
              var $68 = $70;
              break;
      };
      return $68;
  };
  const Pair$fst = x0 => Pair$fst$(x0);

  function Either$(_A$1, _B$2) {
      var $71 = null;
      return $71;
  };
  const Either = x0 => x1 => Either$(x0, x1);

  function Either$left$(_value$3) {
      var $72 = ({
          _: 'Either.left',
          'value': _value$3
      });
      return $72;
  };
  const Either$left = x0 => Either$left$(x0);

  function Either$right$(_value$3) {
      var $73 = ({
          _: 'Either.right',
          'value': _value$3
      });
      return $73;
  };
  const Either$right = x0 => Either$right$(x0);

  function Nat$sub_rem$(_n$1, _m$2) {
      var Nat$sub_rem$ = (_n$1, _m$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2]
      });
      var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
      var arg = [_n$1, _m$2];
      while (true) {
          let [_n$1, _m$2] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $74 = Either$left$(_n$1);
                  return $74;
              } else {
                  var $75 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $77 = Either$right$(Nat$succ$($75));
                      var $76 = $77;
                  } else {
                      var $78 = (self - 1n);
                      var $79 = Nat$sub_rem$($78, $75);
                      var $76 = $79;
                  };
                  return $76;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

  function Pair$(_A$1, _B$2) {
      var $80 = null;
      return $80;
  };
  const Pair = x0 => x1 => Pair$(x0, x1);

  function Pair$new$(_fst$3, _snd$4) {
      var $81 = ({
          _: 'Pair.new',
          'fst': _fst$3,
          'snd': _snd$4
      });
      return $81;
  };
  const Pair$new = x0 => x1 => Pair$new$(x0, x1);

  function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
      var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _d$3]
      });
      var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
      var arg = [_n$1, _m$2, _d$3];
      while (true) {
          let [_n$1, _m$2, _d$3] = arg;
          var R = (() => {
              var self = Nat$sub_rem$(_n$1, _m$2);
              switch (self._) {
                  case 'Either.left':
                      var $82 = self.value;
                      var $83 = Nat$div_mod$go$($82, _m$2, Nat$succ$(_d$3));
                      return $83;
                  case 'Either.right':
                      var $84 = Pair$new$(_d$3, _n$1);
                      return $84;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
  const Nat$div_mod = a0 => a1 => (({
      _: 'Pair.new',
      'fst': a0 / a1,
      'snd': a0 % a1
  }));
  const Nat$div = a0 => a1 => (a0 / a1);

  function Bits$length$go$(_xs$1, _n$2) {
      var Bits$length$go$ = (_xs$1, _n$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _n$2]
      });
      var Bits$length$go = _xs$1 => _n$2 => Bits$length$go$(_xs$1, _n$2);
      var arg = [_xs$1, _n$2];
      while (true) {
          let [_xs$1, _n$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $85 = self.slice(0, -1);
                      var $86 = Bits$length$go$($85, Nat$succ$(_n$2));
                      return $86;
                  case 'i':
                      var $87 = self.slice(0, -1);
                      var $88 = Bits$length$go$($87, Nat$succ$(_n$2));
                      return $88;
                  case 'e':
                      var $89 = _n$2;
                      return $89;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$length$go = x0 => x1 => Bits$length$go$(x0, x1);

  function Bits$length$(_xs$1) {
      var $90 = Bits$length$go$(_xs$1, 0n);
      return $90;
  };
  const Bits$length = x0 => Bits$length$(x0);
  const Nat$gtn = a0 => a1 => (a0 > a1);

  function Nat$mod$go$(_n$1, _m$2, _r$3) {
      var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _r$3]
      });
      var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
      var arg = [_n$1, _m$2, _r$3];
      while (true) {
          let [_n$1, _m$2, _r$3] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $91 = Nat$mod$go$(_n$1, _r$3, _m$2);
                  return $91;
              } else {
                  var $92 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $94 = _r$3;
                      var $93 = $94;
                  } else {
                      var $95 = (self - 1n);
                      var $96 = Nat$mod$go$($95, $92, Nat$succ$(_r$3));
                      var $93 = $96;
                  };
                  return $93;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
  const Nat$mod = a0 => a1 => (a0 % a1);
  const Nat$add = a0 => a1 => (a0 + a1);

  function Nat$max$(_a$1, _b$2) {
      var self = (_a$1 > _b$2);
      if (self) {
          var $98 = _a$1;
          var $97 = $98;
      } else {
          var $99 = _b$2;
          var $97 = $99;
      };
      return $97;
  };
  const Nat$max = x0 => x1 => Nat$max$(x0, x1);

  function Ether$Bits$get_bytes_size$(_bytes$1) {
      var _bytes_size$2 = (Bits$length$(_bytes$1) / 8n);
      var self = ((Bits$length$(_bytes$1) % 8n) > 0n);
      if (self) {
          var $101 = (_bytes_size$2 + 1n);
          var $100 = $101;
      } else {
          var $102 = Nat$max$(1n, _bytes_size$2);
          var $100 = $102;
      };
      return $100;
  };
  const Ether$Bits$get_bytes_size = x0 => Ether$Bits$get_bytes_size$(x0);
  const Bool$and = a0 => a1 => (a0 && a1);
  const Nat$eql = a0 => a1 => (a0 === a1);

  function Cmp$as_ltn$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
              var $104 = Bool$true;
              var $103 = $104;
              break;
          case 'Cmp.eql':
          case 'Cmp.gtn':
              var $105 = Bool$false;
              var $103 = $105;
              break;
      };
      return $103;
  };
  const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

  function Bits$cmp$go$(_a$1, _b$2, _c$3) {
      var Bits$cmp$go$ = (_a$1, _b$2, _c$3) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2, _c$3]
      });
      var Bits$cmp$go = _a$1 => _b$2 => _c$3 => Bits$cmp$go$(_a$1, _b$2, _c$3);
      var arg = [_a$1, _b$2, _c$3];
      while (true) {
          let [_a$1, _b$2, _c$3] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $106 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $108 = self.slice(0, -1);
                              var $109 = Bits$cmp$go$($106, $108, _c$3);
                              var $107 = $109;
                              break;
                          case 'i':
                              var $110 = self.slice(0, -1);
                              var $111 = Bits$cmp$go$($106, $110, Cmp$ltn);
                              var $107 = $111;
                              break;
                          case 'e':
                              var $112 = Bits$cmp$go$($106, Bits$e, _c$3);
                              var $107 = $112;
                              break;
                      };
                      return $107;
                  case 'i':
                      var $113 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $115 = self.slice(0, -1);
                              var $116 = Bits$cmp$go$($113, $115, Cmp$gtn);
                              var $114 = $116;
                              break;
                          case 'i':
                              var $117 = self.slice(0, -1);
                              var $118 = Bits$cmp$go$($113, $117, _c$3);
                              var $114 = $118;
                              break;
                          case 'e':
                              var $119 = Cmp$gtn;
                              var $114 = $119;
                              break;
                      };
                      return $114;
                  case 'e':
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $121 = self.slice(0, -1);
                              var $122 = Bits$cmp$go$(Bits$e, $121, _c$3);
                              var $120 = $122;
                              break;
                          case 'e':
                              var $123 = _c$3;
                              var $120 = $123;
                              break;
                          case 'i':
                              var $124 = Cmp$ltn;
                              var $120 = $124;
                              break;
                      };
                      return $120;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$cmp$go = x0 => x1 => x2 => Bits$cmp$go$(x0, x1, x2);

  function Bits$cmp$(_a$1, _b$2) {
      var $125 = Bits$cmp$go$(_a$1, _b$2, Cmp$eql);
      return $125;
  };
  const Bits$cmp = x0 => x1 => Bits$cmp$(x0, x1);

  function Bits$ltn$(_a$1, _b$2) {
      var $126 = Cmp$as_ltn$(Bits$cmp$(_a$1, _b$2));
      return $126;
  };
  const Bits$ltn = x0 => x1 => Bits$ltn$(x0, x1);

  function Bits$inc$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $128 = self.slice(0, -1);
              var $129 = ($128 + '1');
              var $127 = $129;
              break;
          case 'i':
              var $130 = self.slice(0, -1);
              var $131 = (Bits$inc$($130) + '0');
              var $127 = $131;
              break;
          case 'e':
              var $132 = (Bits$e + '1');
              var $127 = $132;
              break;
      };
      return $127;
  };
  const Bits$inc = x0 => Bits$inc$(x0);
  const Nat$to_bits = a0 => (nat_to_bits(a0));
  const Ether$RLP$Constants$bits_128 = (nat_to_bits(128n));

  function Bits$concat$tail$(_a$1, _b$2) {
      var Bits$concat$tail$ = (_a$1, _b$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2]
      });
      var Bits$concat$tail = _a$1 => _b$2 => Bits$concat$tail$(_a$1, _b$2);
      var arg = [_a$1, _b$2];
      while (true) {
          let [_a$1, _b$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $133 = self.slice(0, -1);
                      var $134 = Bits$concat$tail$($133, (_b$2 + '0'));
                      return $134;
                  case 'i':
                      var $135 = self.slice(0, -1);
                      var $136 = Bits$concat$tail$($135, (_b$2 + '1'));
                      return $136;
                  case 'e':
                      var $137 = _b$2;
                      return $137;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$concat$tail = x0 => x1 => Bits$concat$tail$(x0, x1);

  function Bits$reverse$tco$(_a$1, _r$2) {
      var Bits$reverse$tco$ = (_a$1, _r$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _r$2]
      });
      var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
      var arg = [_a$1, _r$2];
      while (true) {
          let [_a$1, _r$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $138 = self.slice(0, -1);
                      var $139 = Bits$reverse$tco$($138, (_r$2 + '0'));
                      return $139;
                  case 'i':
                      var $140 = self.slice(0, -1);
                      var $141 = Bits$reverse$tco$($140, (_r$2 + '1'));
                      return $141;
                  case 'e':
                      var $142 = _r$2;
                      return $142;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

  function Bits$reverse$(_a$1) {
      var $143 = Bits$reverse$tco$(_a$1, Bits$e);
      return $143;
  };
  const Bits$reverse = x0 => Bits$reverse$(x0);

  function Bits$concat$go$(_a$1, _b$2) {
      var $144 = Bits$concat$tail$(Bits$reverse$(_a$1), _b$2);
      return $144;
  };
  const Bits$concat$go = x0 => x1 => Bits$concat$go$(x0, x1);
  const Nat$ltn = a0 => a1 => (a0 < a1);

  function Ether$RPL$proof$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $146 = Bits$e;
          var $145 = $146;
      } else {
          var $147 = Bits$concat$go$(Ether$RPL$proof$encode$binary$((_value$1 / 256n)), (nat_to_bits((_value$1 % 256n))));
          var $145 = $147;
      };
      return $145;
  };
  const Ether$RPL$proof$encode$binary = x0 => Ether$RPL$proof$encode$binary$(x0);

  function Ether$RPL$proof$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $149 = (nat_to_bits((_value$1 + _offSet$2)));
          var $148 = $149;
      } else {
          var _binary_encoding$3 = Ether$RPL$proof$encode$binary$(_value$1);
          var _len$4 = Ether$Bits$get_bytes_size$(_binary_encoding$3);
          var $150 = Bits$concat$go$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), _binary_encoding$3);
          var $148 = $150;
      };
      return $148;
  };
  const Ether$RPL$proof$encode_length = x0 => x1 => Ether$RPL$proof$encode_length$(x0, x1);
  const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
  const Bits$concat = a0 => a1 => (a1 + a0);
  const Debug$log = a0 => a1 => ((console.log(a0), a1()));

  function String$cons$(_head$1, _tail$2) {
      var $151 = (String.fromCharCode(_head$1) + _tail$2);
      return $151;
  };
  const String$cons = x0 => x1 => String$cons$(x0, x1);
  const String$concat = a0 => a1 => (a0 + a1);

  function List$fold$(_list$2, _nil$4, _cons$5) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $153 = self.head;
              var $154 = self.tail;
              var $155 = _cons$5($153)(List$fold$($154, _nil$4, _cons$5));
              var $152 = $155;
              break;
          case 'List.nil':
              var $156 = _nil$4;
              var $152 = $156;
              break;
      };
      return $152;
  };
  const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

  function List$(_A$1) {
      var $157 = null;
      return $157;
  };
  const List = x0 => List$(x0);

  function List$cons$(_head$2, _tail$3) {
      var $158 = ({
          _: 'List.cons',
          'head': _head$2,
          'tail': _tail$3
      });
      return $158;
  };
  const List$cons = x0 => x1 => List$cons$(x0, x1);

  function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
      var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
          ctr: 'TCO',
          arg: [_base$1, _nat$2, _res$3]
      });
      var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
      var arg = [_base$1, _nat$2, _res$3];
      while (true) {
          let [_base$1, _nat$2, _res$3] = arg;
          var R = (() => {
              var self = (({
                  _: 'Pair.new',
                  'fst': _nat$2 / _base$1,
                  'snd': _nat$2 % _base$1
              }));
              switch (self._) {
                  case 'Pair.new':
                      var $159 = self.fst;
                      var $160 = self.snd;
                      var self = $159;
                      if (self === 0n) {
                          var $162 = List$cons$($160, _res$3);
                          var $161 = $162;
                      } else {
                          var $163 = (self - 1n);
                          var $164 = Nat$to_base$go$(_base$1, $159, List$cons$($160, _res$3));
                          var $161 = $164;
                      };
                      return $161;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
  const List$nil = ({
      _: 'List.nil'
  });

  function Nat$to_base$(_base$1, _nat$2) {
      var $165 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
      return $165;
  };
  const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
  const String$nil = '';
  const Nat$lte = a0 => a1 => (a0 <= a1);

  function Maybe$(_A$1) {
      var $166 = null;
      return $166;
  };
  const Maybe = x0 => Maybe$(x0);
  const Maybe$none = ({
      _: 'Maybe.none'
  });

  function Maybe$some$(_value$2) {
      var $167 = ({
          _: 'Maybe.some',
          'value': _value$2
      });
      return $167;
  };
  const Maybe$some = x0 => Maybe$some$(x0);

  function List$at$(_index$2, _list$3) {
      var List$at$ = (_index$2, _list$3) => ({
          ctr: 'TCO',
          arg: [_index$2, _list$3]
      });
      var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
      var arg = [_index$2, _list$3];
      while (true) {
          let [_index$2, _list$3] = arg;
          var R = (() => {
              var self = _list$3;
              switch (self._) {
                  case 'List.cons':
                      var $168 = self.head;
                      var $169 = self.tail;
                      var self = _index$2;
                      if (self === 0n) {
                          var $171 = Maybe$some$($168);
                          var $170 = $171;
                      } else {
                          var $172 = (self - 1n);
                          var $173 = List$at$($172, $169);
                          var $170 = $173;
                      };
                      return $170;
                  case 'List.nil':
                      var $174 = Maybe$none;
                      return $174;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const List$at = x0 => x1 => List$at$(x0, x1);

  function Nat$show_digit$(_base$1, _n$2) {
      var _m$3 = (_n$2 % _base$1);
      var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
      var self = ((_base$1 > 0n) && (_base$1 <= 64n));
      if (self) {
          var self = List$at$(_m$3, _base64$4);
          switch (self._) {
              case 'Maybe.some':
                  var $177 = self.value;
                  var $178 = $177;
                  var $176 = $178;
                  break;
              case 'Maybe.none':
                  var $179 = 35;
                  var $176 = $179;
                  break;
          };
          var $175 = $176;
      } else {
          var $180 = 35;
          var $175 = $180;
      };
      return $175;
  };
  const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

  function Nat$to_string_base$(_base$1, _nat$2) {
      var $181 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
          var $182 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
          return $182;
      }));
      return $181;
  };
  const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

  function Nat$show$(_n$1) {
      var $183 = Nat$to_string_base$(10n, _n$1);
      return $183;
  };
  const Nat$show = x0 => Nat$show$(x0);

  function Ether$RLP$proof$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $185 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($185);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($185, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $187 = $185;
                  var $186 = $187;
              } else {
                  var $188 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$3, 128n), $185);
                  var $186 = $188;
              };
              var $184 = $186;
              break;
          case 'Ether.RLP.Tree.list':
              var $189 = self.value;
              var _bytes$3 = Bits$e;
              var _bytes$4 = (() => {
                  var $192 = _bytes$3;
                  var $193 = $189;
                  let _bytes$5 = $192;
                  let _item$4;
                  while ($193._ === 'List.cons') {
                      _item$4 = $193.head;
                      var $192 = (Ether$RLP$proof$encode$bytes$(_item$4) + _bytes$5);
                      _bytes$5 = $192;
                      $193 = $193.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = Ether$Bits$get_bytes_size$(_bytes$4);
              var $190 = ((console.log(("Second encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $194 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $194;
              })()));
              var $184 = $190;
              break;
      };
      return $184;
  };
  const Ether$RLP$proof$encode$bytes = x0 => Ether$RLP$proof$encode$bytes$(x0);

  function List$concat$(_as$2, _bs$3) {
      var self = _as$2;
      switch (self._) {
          case 'List.cons':
              var $196 = self.head;
              var $197 = self.tail;
              var $198 = List$cons$($196, List$concat$($197, _bs$3));
              var $195 = $198;
              break;
          case 'List.nil':
              var $199 = _bs$3;
              var $195 = $199;
              break;
      };
      return $195;
  };
  const List$concat = x0 => x1 => List$concat$(x0, x1);

  function Ether$RPL$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $201 = List$nil;
          var $200 = $201;
      } else {
          var $202 = List$concat$(Ether$RPL$encode$binary$((_value$1 / 256n)), List$cons$((nat_to_bits((_value$1 % 256n))), List$nil));
          var $200 = $202;
      };
      return $200;
  };
  const Ether$RPL$encode$binary = x0 => Ether$RPL$encode$binary$(x0);

  function List$foldr$(_nil$3, _cons$4, _xs$5) {
      var self = _xs$5;
      switch (self._) {
          case 'List.cons':
              var $204 = self.head;
              var $205 = self.tail;
              var $206 = _cons$4($204)(List$foldr$(_nil$3, _cons$4, $205));
              var $203 = $206;
              break;
          case 'List.nil':
              var $207 = _nil$3;
              var $203 = $207;
              break;
      };
      return $203;
  };
  const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

  function Bits$show$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $209 = self.slice(0, -1);
              var $210 = String$cons$(48, Bits$show$($209));
              var $208 = $210;
              break;
          case 'i':
              var $211 = self.slice(0, -1);
              var $212 = String$cons$(49, Bits$show$($211));
              var $208 = $212;
              break;
          case 'e':
              var $213 = "";
              var $208 = $213;
              break;
      };
      return $208;
  };
  const Bits$show = x0 => Bits$show$(x0);

  function Ether$RPL$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $215 = List$cons$((nat_to_bits((_value$1 + _offSet$2))), List$nil);
          var $214 = $215;
      } else {
          var self = (_value$1 < 18446744073709551616n);
          if (self) {
              var _binary_encoding$3 = Ether$RPL$encode$binary$(_value$1);
              var _len$4 = List$foldr$(0n, (_x$4 => _y$5 => {
                  var $218 = (Ether$Bits$get_bytes_size$(_x$4) + _y$5);
                  return $218;
              }), _binary_encoding$3);
              var $217 = ((console.log((Nat$show$(_value$1) + (" " + Bits$show$(List$foldr$(Bits$e, Bits$concat, List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3)))))), (_$5 => {
                  var $219 = List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3);
                  return $219;
              })()));
              var $216 = $217;
          } else {
              var $220 = List$nil;
              var $216 = $220;
          };
          var $214 = $216;
      };
      return $214;
  };
  const Ether$RPL$encode_length = x0 => x1 => Ether$RPL$encode_length$(x0, x1);

  function Ether$RLP$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $222 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($222);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($222, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $224 = List$cons$($222, List$nil);
                  var $223 = $224;
              } else {
                  var $225 = List$concat$(Ether$RPL$encode_length$(_bytes_size$3, 128n), List$cons$($222, List$nil));
                  var $223 = $225;
              };
              var $221 = $223;
              break;
          case 'Ether.RLP.Tree.list':
              var $226 = self.value;
              var _bytes$3 = List$nil;
              var _bytes$4 = (() => {
                  var $229 = _bytes$3;
                  var $230 = $226;
                  let _bytes$5 = $229;
                  let _item$4;
                  while ($230._ === 'List.cons') {
                      _item$4 = $230.head;
                      var $229 = List$concat$(_bytes$5, Ether$RLP$encode$bytes$(_item$4));
                      _bytes$5 = $229;
                      $230 = $230.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = List$foldr$(0n, (_x$5 => _y$6 => {
                  var $231 = (Ether$Bits$get_bytes_size$(_x$5) + _y$6);
                  return $231;
              }), _bytes$4);
              var $227 = ((console.log(("first encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $232 = List$concat$(Ether$RPL$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $232;
              })()));
              var $221 = $227;
              break;
      };
      return $221;
  };
  const Ether$RLP$encode$bytes = x0 => Ether$RLP$encode$bytes$(x0);

  function Bits$take$(_n$1, _xs$2) {
      var self = _n$1;
      if (self === 0n) {
          var $234 = Bits$e;
          var $233 = $234;
      } else {
          var $235 = (self - 1n);
          var self = _xs$2;
          switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
              case 'o':
                  var $237 = self.slice(0, -1);
                  var $238 = (Bits$take$($235, $237) + '0');
                  var $236 = $238;
                  break;
              case 'i':
                  var $239 = self.slice(0, -1);
                  var $240 = (Bits$take$($235, $239) + '1');
                  var $236 = $240;
                  break;
              case 'e':
                  var $241 = Bits$e;
                  var $236 = $241;
                  break;
          };
          var $233 = $236;
      };
      return $233;
  };
  const Bits$take = x0 => x1 => Bits$take$(x0, x1);

  function Bits$drop$(_n$1, _xs$2) {
      var Bits$drop$ = (_n$1, _xs$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _xs$2]
      });
      var Bits$drop = _n$1 => _xs$2 => Bits$drop$(_n$1, _xs$2);
      var arg = [_n$1, _xs$2];
      while (true) {
          let [_n$1, _xs$2] = arg;
          var R = (() => {
              var self = _n$1;
              if (self === 0n) {
                  var $242 = _xs$2;
                  return $242;
              } else {
                  var $243 = (self - 1n);
                  var self = _xs$2;
                  switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                      case 'o':
                          var $245 = self.slice(0, -1);
                          var $246 = Bits$drop$($243, $245);
                          var $244 = $246;
                          break;
                      case 'i':
                          var $247 = self.slice(0, -1);
                          var $248 = Bits$drop$($243, $247);
                          var $244 = $248;
                          break;
                      case 'e':
                          var $249 = _xs$2;
                          var $244 = $249;
                          break;
                  };
                  return $244;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$drop = x0 => x1 => Bits$drop$(x0, x1);

  function Bits$break$(_len$1, _bits$2) {
      var $250 = Pair$new$(Bits$take$(_len$1, _bits$2), Bits$drop$(_len$1, _bits$2));
      return $250;
  };
  const Bits$break = x0 => x1 => Bits$break$(x0, x1);

  function String$reverse$go$(_xs$1, _res$2) {
      var String$reverse$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$reverse$go = _xs$1 => _res$2 => String$reverse$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              if (self.length === 0) {
                  var $251 = _res$2;
                  return $251;
              } else {
                  var $252 = self.charCodeAt(0);
                  var $253 = self.slice(1);
                  var $254 = String$reverse$go$($253, String$cons$($252, _res$2));
                  return $254;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

  function String$reverse$(_xs$1) {
      var $255 = String$reverse$go$(_xs$1, String$nil);
      return $255;
  };
  const String$reverse = x0 => String$reverse$(x0);

  function Bits$hex$encode$(_x$1) {
      var self = _x$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $257 = self.slice(0, -1);
              var self = $257;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $259 = self.slice(0, -1);
                      var self = $259;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $261 = self.slice(0, -1);
                              var self = $261;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $263 = self.slice(0, -1);
                                      var $264 = ("0" + Bits$hex$encode$($263));
                                      var $262 = $264;
                                      break;
                                  case 'i':
                                      var $265 = self.slice(0, -1);
                                      var $266 = ("8" + Bits$hex$encode$($265));
                                      var $262 = $266;
                                      break;
                                  case 'e':
                                      var $267 = "0";
                                      var $262 = $267;
                                      break;
                              };
                              var $260 = $262;
                              break;
                          case 'i':
                              var $268 = self.slice(0, -1);
                              var self = $268;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $270 = self.slice(0, -1);
                                      var $271 = ("4" + Bits$hex$encode$($270));
                                      var $269 = $271;
                                      break;
                                  case 'i':
                                      var $272 = self.slice(0, -1);
                                      var $273 = ("c" + Bits$hex$encode$($272));
                                      var $269 = $273;
                                      break;
                                  case 'e':
                                      var $274 = "4";
                                      var $269 = $274;
                                      break;
                              };
                              var $260 = $269;
                              break;
                          case 'e':
                              var $275 = "0";
                              var $260 = $275;
                              break;
                      };
                      var $258 = $260;
                      break;
                  case 'i':
                      var $276 = self.slice(0, -1);
                      var self = $276;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $278 = self.slice(0, -1);
                              var self = $278;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $280 = self.slice(0, -1);
                                      var $281 = ("2" + Bits$hex$encode$($280));
                                      var $279 = $281;
                                      break;
                                  case 'i':
                                      var $282 = self.slice(0, -1);
                                      var $283 = ("a" + Bits$hex$encode$($282));
                                      var $279 = $283;
                                      break;
                                  case 'e':
                                      var $284 = "2";
                                      var $279 = $284;
                                      break;
                              };
                              var $277 = $279;
                              break;
                          case 'i':
                              var $285 = self.slice(0, -1);
                              var self = $285;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $287 = self.slice(0, -1);
                                      var $288 = ("6" + Bits$hex$encode$($287));
                                      var $286 = $288;
                                      break;
                                  case 'i':
                                      var $289 = self.slice(0, -1);
                                      var $290 = ("e" + Bits$hex$encode$($289));
                                      var $286 = $290;
                                      break;
                                  case 'e':
                                      var $291 = "6";
                                      var $286 = $291;
                                      break;
                              };
                              var $277 = $286;
                              break;
                          case 'e':
                              var $292 = "2";
                              var $277 = $292;
                              break;
                      };
                      var $258 = $277;
                      break;
                  case 'e':
                      var $293 = "0";
                      var $258 = $293;
                      break;
              };
              var $256 = $258;
              break;
          case 'i':
              var $294 = self.slice(0, -1);
              var self = $294;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $296 = self.slice(0, -1);
                      var self = $296;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $298 = self.slice(0, -1);
                              var self = $298;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $300 = self.slice(0, -1);
                                      var $301 = ("1" + Bits$hex$encode$($300));
                                      var $299 = $301;
                                      break;
                                  case 'i':
                                      var $302 = self.slice(0, -1);
                                      var $303 = ("9" + Bits$hex$encode$($302));
                                      var $299 = $303;
                                      break;
                                  case 'e':
                                      var $304 = "1";
                                      var $299 = $304;
                                      break;
                              };
                              var $297 = $299;
                              break;
                          case 'i':
                              var $305 = self.slice(0, -1);
                              var self = $305;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $307 = self.slice(0, -1);
                                      var $308 = ("5" + Bits$hex$encode$($307));
                                      var $306 = $308;
                                      break;
                                  case 'i':
                                      var $309 = self.slice(0, -1);
                                      var $310 = ("d" + Bits$hex$encode$($309));
                                      var $306 = $310;
                                      break;
                                  case 'e':
                                      var $311 = "5";
                                      var $306 = $311;
                                      break;
                              };
                              var $297 = $306;
                              break;
                          case 'e':
                              var $312 = "1";
                              var $297 = $312;
                              break;
                      };
                      var $295 = $297;
                      break;
                  case 'i':
                      var $313 = self.slice(0, -1);
                      var self = $313;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $315 = self.slice(0, -1);
                              var self = $315;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $317 = self.slice(0, -1);
                                      var $318 = ("3" + Bits$hex$encode$($317));
                                      var $316 = $318;
                                      break;
                                  case 'i':
                                      var $319 = self.slice(0, -1);
                                      var $320 = ("b" + Bits$hex$encode$($319));
                                      var $316 = $320;
                                      break;
                                  case 'e':
                                      var $321 = "3";
                                      var $316 = $321;
                                      break;
                              };
                              var $314 = $316;
                              break;
                          case 'i':
                              var $322 = self.slice(0, -1);
                              var self = $322;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $324 = self.slice(0, -1);
                                      var $325 = ("7" + Bits$hex$encode$($324));
                                      var $323 = $325;
                                      break;
                                  case 'i':
                                      var $326 = self.slice(0, -1);
                                      var $327 = ("f" + Bits$hex$encode$($326));
                                      var $323 = $327;
                                      break;
                                  case 'e':
                                      var $328 = "7";
                                      var $323 = $328;
                                      break;
                              };
                              var $314 = $323;
                              break;
                          case 'e':
                              var $329 = "3";
                              var $314 = $329;
                              break;
                      };
                      var $295 = $314;
                      break;
                  case 'e':
                      var $330 = "1";
                      var $295 = $330;
                      break;
              };
              var $256 = $295;
              break;
          case 'e':
              var $331 = "";
              var $256 = $331;
              break;
      };
      return $256;
  };
  const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
  const Ether$RLP$Constants$bits_184 = (nat_to_bits(184n));
  const Nat$mul = a0 => a1 => (a0 * a1);
  const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

  function Bits$to_nat$(_b$1) {
      var self = _b$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $333 = self.slice(0, -1);
              var $334 = (2n * Bits$to_nat$($333));
              var $332 = $334;
              break;
          case 'i':
              var $335 = self.slice(0, -1);
              var $336 = Nat$succ$((2n * Bits$to_nat$($335)));
              var $332 = $336;
              break;
          case 'e':
              var $337 = 0n;
              var $332 = $337;
              break;
      };
      return $332;
  };
  const Bits$to_nat = x0 => Bits$to_nat$(x0);
  const Ether$RLP$Constants$bits_192 = (nat_to_bits(192n));
  const Bits$eql = a0 => a1 => (a1 === a0);

  function Ether$RLP$proof$encode$read$binary$(_value$1) {
      var self = Bits$break$(8n, _value$1);
      switch (self._) {
          case 'Pair.new':
              var $339 = self.fst;
              var $340 = self.snd;
              var _decode$4 = Bits$to_nat$($339);
              var self = ((Bits$e + '0') === $340);
              if (self) {
                  var $342 = _decode$4;
                  var $341 = $342;
              } else {
                  var $343 = (Ether$RLP$proof$encode$read$binary$($340) + (_decode$4 * 256n));
                  var $341 = $343;
              };
              var $338 = $341;
              break;
      };
      return $338;
  };
  const Ether$RLP$proof$encode$read$binary = x0 => Ether$RLP$proof$encode$read$binary$(x0);

  function Ether$RLP$proof$encode$read$(_bits$1) {
      var self = Bits$break$(8n, _bits$1);
      switch (self._) {
          case 'Pair.new':
              var $345 = self.fst;
              var $346 = self.snd;
              var $347 = ("0x" + (() => {
                  var self = Bits$ltn$($345, Ether$RLP$Constants$bits_128);
                  if (self) {
                      var $348 = String$reverse$(Bits$hex$encode$(_bits$1));
                      return $348;
                  } else {
                      var self = Bits$ltn$($345, Ether$RLP$Constants$bits_184);
                      if (self) {
                          var _content_length$4 = ((Bits$to_nat$($345) - 128n <= 0n ? 0n : Bits$to_nat$($345) - 128n) * 8n);
                          var self = Bits$break$(_content_length$4, $346);
                          switch (self._) {
                              case 'Pair.new':
                                  var $351 = self.fst;
                                  var $352 = (String$reverse$(Bits$hex$encode$($345)) + String$reverse$(Bits$hex$encode$($351)));
                                  var $350 = $352;
                                  break;
                          };
                          var $349 = $350;
                      } else {
                          var self = Bits$ltn$($345, Ether$RLP$Constants$bits_192);
                          if (self) {
                              var _content_length$4 = ((Bits$to_nat$($345) - 183n <= 0n ? 0n : Bits$to_nat$($345) - 183n) * 8n);
                              var self = Bits$break$(_content_length$4, $346);
                              switch (self._) {
                                  case 'Pair.new':
                                      var $355 = self.fst;
                                      var $356 = self.snd;
                                      var _length$7 = Ether$RLP$proof$encode$read$binary$($355);
                                      var self = Bits$break$((_length$7 * 8n), $356);
                                      switch (self._) {
                                          case 'Pair.new':
                                              var $358 = self.fst;
                                              var $359 = (String$reverse$(Bits$hex$encode$($345)) + (String$reverse$(Bits$hex$encode$($355)) + String$reverse$(Bits$hex$encode$($358))));
                                              var $357 = $359;
                                              break;
                                      };
                                      var $354 = $357;
                                      break;
                              };
                              var $353 = $354;
                          } else {
                              var $360 = "";
                              var $353 = $360;
                          };
                          var $349 = $353;
                      };
                      return $349;
                  };
              })());
              var $344 = $347;
              break;
      };
      return $344;
  };
  const Ether$RLP$proof$encode$read = x0 => Ether$RLP$proof$encode$read$(x0);

  function List$map$(_f$3, _as$4) {
      var self = _as$4;
      switch (self._) {
          case 'List.cons':
              var $362 = self.head;
              var $363 = self.tail;
              var $364 = List$cons$(_f$3($362), List$map$(_f$3, $363));
              var $361 = $364;
              break;
          case 'List.nil':
              var $365 = List$nil;
              var $361 = $365;
              break;
      };
      return $361;
  };
  const List$map = x0 => x1 => List$map$(x0, x1);

  function String$pad_right$(_size$1, _chr$2, _str$3) {
      var self = _size$1;
      if (self === 0n) {
          var $367 = _str$3;
          var $366 = $367;
      } else {
          var $368 = (self - 1n);
          var self = _str$3;
          if (self.length === 0) {
              var $370 = String$cons$(_chr$2, String$pad_right$($368, _chr$2, ""));
              var $369 = $370;
          } else {
              var $371 = self.charCodeAt(0);
              var $372 = self.slice(1);
              var $373 = String$cons$($371, String$pad_right$($368, _chr$2, $372));
              var $369 = $373;
          };
          var $366 = $369;
      };
      return $366;
  };
  const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

  function String$pad_left$(_size$1, _chr$2, _str$3) {
      var $374 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
      return $374;
  };
  const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

  function String$flatten$go$(_xs$1, _res$2) {
      var String$flatten$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self._) {
                  case 'List.cons':
                      var $375 = self.head;
                      var $376 = self.tail;
                      var $377 = String$flatten$go$($376, (_res$2 + $375));
                      return $377;
                  case 'List.nil':
                      var $378 = _res$2;
                      return $378;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

  function String$flatten$(_xs$1) {
      var $379 = String$flatten$go$(_xs$1, "");
      return $379;
  };
  const String$flatten = x0 => String$flatten$(x0);

  function String$join$go$(_sep$1, _list$2, _fst$3) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $381 = self.head;
              var $382 = self.tail;
              var $383 = String$flatten$(List$cons$((() => {
                  var self = _fst$3;
                  if (self) {
                      var $384 = "";
                      return $384;
                  } else {
                      var $385 = _sep$1;
                      return $385;
                  };
              })(), List$cons$($381, List$cons$(String$join$go$(_sep$1, $382, Bool$false), List$nil))));
              var $380 = $383;
              break;
          case 'List.nil':
              var $386 = "";
              var $380 = $386;
              break;
      };
      return $380;
  };
  const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

  function String$join$(_sep$1, _list$2) {
      var $387 = String$join$go$(_sep$1, _list$2, Bool$true);
      return $387;
  };
  const String$join = x0 => x1 => String$join$(x0, x1);

  function Ether$RLP$encode$read$(_bits$1) {
      var _hexfify$2 = List$map$((_x$2 => {
          var $389 = String$pad_left$(2n, 48, String$reverse$(Bits$hex$encode$(_x$2)));
          return $389;
      }), _bits$1);
      var $388 = ("0x" + String$join$("", _hexfify$2));
      return $388;
  };
  const Ether$RLP$encode$read = x0 => Ether$RLP$encode$read$(x0);
  const Ether$tests = (() => {
      var _v$1 = Ether$RLP$Tree$tip$(Bits$read$("1000000100000000000000000110110000000000000000000010000000000000000011011000111111111111111111111111111111111011111000000000000100011111111111111111111111111111111101111100000000000000000000000000000001000000000000000001101100100011111111111111111111111111111111101111100000000000010001111111111111111111111111111111110111110000000000000000000000000000000100000000000000000110110000000000000000000010000000000000000011011000000000000000000010110110"));
      var _test1$2 = Ether$RLP$proof$encode$bytes$(_v$1);
      var _test2$3 = Ether$RLP$encode$bytes$(_v$1);
      var $390 = ((console.log(Ether$RLP$proof$encode$read$(_test1$2)), (_$4 => {
          var $391 = ((console.log(Ether$RLP$encode$read$(_test2$3)), (_$5 => {
              var _test2$6 = List$foldr$(Bits$e, Bits$concat, _test2$3);
              var $392 = Pair$new$(_test1$2, _test2$6);
              return $392;
          })()));
          return $391;
      })()));
      return $390;
  })();
  return {
      'Ether.RLP.Tree.tip': Ether$RLP$Tree$tip,
      'Bits.e': Bits$e,
      'Bool.false': Bool$false,
      'Bool.true': Bool$true,
      'Cmp.as_eql': Cmp$as_eql,
      'Cmp.ltn': Cmp$ltn,
      'Cmp.gtn': Cmp$gtn,
      'Word.cmp.go': Word$cmp$go,
      'Cmp.eql': Cmp$eql,
      'Word.cmp': Word$cmp,
      'Word.eql': Word$eql,
      'Nat.succ': Nat$succ,
      'Nat.zero': Nat$zero,
      'U16.eql': U16$eql,
      'Char.parse.type': Char$parse$type,
      'Unit.new': Unit$new,
      'Char.parse': Char$parse,
      'Bits.i': Bits$i,
      'Bits.o': Bits$o,
      'Bits.read': Bits$read,
      'Pair.fst': Pair$fst,
      'Either': Either,
      'Either.left': Either$left,
      'Either.right': Either$right,
      'Nat.sub_rem': Nat$sub_rem,
      'Pair': Pair,
      'Pair.new': Pair$new,
      'Nat.div_mod.go': Nat$div_mod$go,
      'Nat.div_mod': Nat$div_mod,
      'Nat.div': Nat$div,
      'Bits.length.go': Bits$length$go,
      'Bits.length': Bits$length,
      'Nat.gtn': Nat$gtn,
      'Nat.mod.go': Nat$mod$go,
      'Nat.mod': Nat$mod,
      'Nat.add': Nat$add,
      'Nat.max': Nat$max,
      'Ether.Bits.get_bytes_size': Ether$Bits$get_bytes_size,
      'Bool.and': Bool$and,
      'Nat.eql': Nat$eql,
      'Cmp.as_ltn': Cmp$as_ltn,
      'Bits.cmp.go': Bits$cmp$go,
      'Bits.cmp': Bits$cmp,
      'Bits.ltn': Bits$ltn,
      'Bits.inc': Bits$inc,
      'Nat.to_bits': Nat$to_bits,
      'Ether.RLP.Constants.bits_128': Ether$RLP$Constants$bits_128,
      'Bits.concat.tail': Bits$concat$tail,
      'Bits.reverse.tco': Bits$reverse$tco,
      'Bits.reverse': Bits$reverse,
      'Bits.concat.go': Bits$concat$go,
      'Nat.ltn': Nat$ltn,
      'Ether.RPL.proof.encode.binary': Ether$RPL$proof$encode$binary,
      'Ether.RPL.proof.encode_length': Ether$RPL$proof$encode_length,
      'List.for': List$for,
      'Bits.concat': Bits$concat,
      'Debug.log': Debug$log,
      'String.cons': String$cons,
      'String.concat': String$concat,
      'List.fold': List$fold,
      'List': List,
      'List.cons': List$cons,
      'Nat.to_base.go': Nat$to_base$go,
      'List.nil': List$nil,
      'Nat.to_base': Nat$to_base,
      'String.nil': String$nil,
      'Nat.lte': Nat$lte,
      'Maybe': Maybe,
      'Maybe.none': Maybe$none,
      'Maybe.some': Maybe$some,
      'List.at': List$at,
      'Nat.show_digit': Nat$show_digit,
      'Nat.to_string_base': Nat$to_string_base,
      'Nat.show': Nat$show,
      'Ether.RLP.proof.encode.bytes': Ether$RLP$proof$encode$bytes,
      'List.concat': List$concat,
      'Ether.RPL.encode.binary': Ether$RPL$encode$binary,
      'List.foldr': List$foldr,
      'Bits.show': Bits$show,
      'Ether.RPL.encode_length': Ether$RPL$encode_length,
      'Ether.RLP.encode.bytes': Ether$RLP$encode$bytes,
      'Bits.take': Bits$take,
      'Bits.drop': Bits$drop,
      'Bits.break': Bits$break,
      'String.reverse.go': String$reverse$go,
      'String.reverse': String$reverse,
      'Bits.hex.encode': Bits$hex$encode,
      'Ether.RLP.Constants.bits_184': Ether$RLP$Constants$bits_184,
      'Nat.mul': Nat$mul,
      'Nat.sub': Nat$sub,
      'Bits.to_nat': Bits$to_nat,
      'Ether.RLP.Constants.bits_192': Ether$RLP$Constants$bits_192,
      'Bits.eql': Bits$eql,
      'Ether.RLP.proof.encode.read.binary': Ether$RLP$proof$encode$read$binary,
      'Ether.RLP.proof.encode.read': Ether$RLP$proof$encode$read,
      'List.map': List$map,
      'String.pad_right': String$pad_right,
      'String.pad_left': String$pad_left,
      'String.flatten.go': String$flatten$go,
      'String.flatten': String$flatten,
      'String.join.go': String$join$go,
      'String.join': String$join,
      'Ether.RLP.encode.read': Ether$RLP$encode$read,
      'Ether.tests': Ether$tests,
  };
})();
var MAIN = module.exports['Ether.tests'];
try {
  console.log(JSON.stringify(MAIN, null, 2) || '<unprintable>')
} catch (e) {
  console.log(MAIN);
};
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
  var list_for = list => nil => cons => {
      while (list._ !== 'List.nil') {
          nil = cons(list.head)(nil);
          list = list.tail;
      }
      return nil;
  };
  var nat_to_bits = n => {
      return n === 0n ? '' : n.toString(2);
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
  const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
  const elim_string = (x => {
      var $22 = (() => c0 => c1 => {
          var self = x;
          if (self.length === 0) {
              var $18 = c0;
              return $18;
          } else {
              var $19 = self.charCodeAt(0);
              var $20 = self.slice(1);
              var $21 = c1($19)($20);
              return $21;
          };
      })();
      return $22;
  });

  function Ether$RLP$Tree$tip$(_value$1) {
      var $23 = ({
          _: 'Ether.RLP.Tree.tip',
          'value': _value$1
      });
      return $23;
  };
  const Ether$RLP$Tree$tip = x0 => Ether$RLP$Tree$tip$(x0);
  const Bits$e = '';
  const Bool$false = false;
  const Bool$true = true;

  function Cmp$as_eql$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
          case 'Cmp.gtn':
              var $25 = Bool$false;
              var $24 = $25;
              break;
          case 'Cmp.eql':
              var $26 = Bool$true;
              var $24 = $26;
              break;
      };
      return $24;
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
              var $28 = self.pred;
              var $29 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $31 = self.pred;
                          var $32 = (_a$pred$10 => {
                              var $33 = Word$cmp$go$(_a$pred$10, $31, _c$4);
                              return $33;
                          });
                          var $30 = $32;
                          break;
                      case 'Word.i':
                          var $34 = self.pred;
                          var $35 = (_a$pred$10 => {
                              var $36 = Word$cmp$go$(_a$pred$10, $34, Cmp$ltn);
                              return $36;
                          });
                          var $30 = $35;
                          break;
                      case 'Word.e':
                          var $37 = (_a$pred$8 => {
                              var $38 = _c$4;
                              return $38;
                          });
                          var $30 = $37;
                          break;
                  };
                  var $30 = $30($28);
                  return $30;
              });
              var $27 = $29;
              break;
          case 'Word.i':
              var $39 = self.pred;
              var $40 = (_b$7 => {
                  var self = _b$7;
                  switch (self._) {
                      case 'Word.o':
                          var $42 = self.pred;
                          var $43 = (_a$pred$10 => {
                              var $44 = Word$cmp$go$(_a$pred$10, $42, Cmp$gtn);
                              return $44;
                          });
                          var $41 = $43;
                          break;
                      case 'Word.i':
                          var $45 = self.pred;
                          var $46 = (_a$pred$10 => {
                              var $47 = Word$cmp$go$(_a$pred$10, $45, _c$4);
                              return $47;
                          });
                          var $41 = $46;
                          break;
                      case 'Word.e':
                          var $48 = (_a$pred$8 => {
                              var $49 = _c$4;
                              return $49;
                          });
                          var $41 = $48;
                          break;
                  };
                  var $41 = $41($39);
                  return $41;
              });
              var $27 = $40;
              break;
          case 'Word.e':
              var $50 = (_b$5 => {
                  var $51 = _c$4;
                  return $51;
              });
              var $27 = $50;
              break;
      };
      var $27 = $27(_b$3);
      return $27;
  };
  const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
  const Cmp$eql = ({
      _: 'Cmp.eql'
  });

  function Word$cmp$(_a$2, _b$3) {
      var $52 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
      return $52;
  };
  const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

  function Word$eql$(_a$2, _b$3) {
      var $53 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
      return $53;
  };
  const Word$eql = x0 => x1 => Word$eql$(x0, x1);

  function Nat$succ$(_pred$1) {
      var $54 = 1n + _pred$1;
      return $54;
  };
  const Nat$succ = x0 => Nat$succ$(x0);
  const Nat$zero = 0n;
  const U16$eql = a0 => a1 => (a0 === a1);

  function Char$parse$type$(_str$1) {
      var $55 = null;
      return $55;
  };
  const Char$parse$type = x0 => Char$parse$type$(x0);
  const Unit$new = null;

  function Char$parse$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $57 = Unit$new;
          var $56 = $57;
      } else {
          var $58 = self.charCodeAt(0);
          var $59 = self.slice(1);
          var $60 = $58;
          var $56 = $60;
      };
      return $56;
  };
  const Char$parse = x0 => Char$parse$(x0);
  const Bits$i = a0 => (a0 + '1');
  const Bits$o = a0 => (a0 + '0');

  function Bits$read$(_str$1) {
      var self = _str$1;
      if (self.length === 0) {
          var $62 = Bits$e;
          var $61 = $62;
      } else {
          var $63 = self.charCodeAt(0);
          var $64 = self.slice(1);
          var self = ($63 === Char$parse$("1"));
          if (self) {
              var $66 = (Bits$read$($64) + '1');
              var $65 = $66;
          } else {
              var $67 = (Bits$read$($64) + '0');
              var $65 = $67;
          };
          var $61 = $65;
      };
      return $61;
  };
  const Bits$read = x0 => Bits$read$(x0);

  function Pair$fst$(_pair$3) {
      var self = _pair$3;
      switch (self._) {
          case 'Pair.new':
              var $69 = self.fst;
              var $70 = $69;
              var $68 = $70;
              break;
      };
      return $68;
  };
  const Pair$fst = x0 => Pair$fst$(x0);

  function Either$(_A$1, _B$2) {
      var $71 = null;
      return $71;
  };
  const Either = x0 => x1 => Either$(x0, x1);

  function Either$left$(_value$3) {
      var $72 = ({
          _: 'Either.left',
          'value': _value$3
      });
      return $72;
  };
  const Either$left = x0 => Either$left$(x0);

  function Either$right$(_value$3) {
      var $73 = ({
          _: 'Either.right',
          'value': _value$3
      });
      return $73;
  };
  const Either$right = x0 => Either$right$(x0);

  function Nat$sub_rem$(_n$1, _m$2) {
      var Nat$sub_rem$ = (_n$1, _m$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2]
      });
      var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
      var arg = [_n$1, _m$2];
      while (true) {
          let [_n$1, _m$2] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $74 = Either$left$(_n$1);
                  return $74;
              } else {
                  var $75 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $77 = Either$right$(Nat$succ$($75));
                      var $76 = $77;
                  } else {
                      var $78 = (self - 1n);
                      var $79 = Nat$sub_rem$($78, $75);
                      var $76 = $79;
                  };
                  return $76;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

  function Pair$(_A$1, _B$2) {
      var $80 = null;
      return $80;
  };
  const Pair = x0 => x1 => Pair$(x0, x1);

  function Pair$new$(_fst$3, _snd$4) {
      var $81 = ({
          _: 'Pair.new',
          'fst': _fst$3,
          'snd': _snd$4
      });
      return $81;
  };
  const Pair$new = x0 => x1 => Pair$new$(x0, x1);

  function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
      var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _d$3]
      });
      var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
      var arg = [_n$1, _m$2, _d$3];
      while (true) {
          let [_n$1, _m$2, _d$3] = arg;
          var R = (() => {
              var self = Nat$sub_rem$(_n$1, _m$2);
              switch (self._) {
                  case 'Either.left':
                      var $82 = self.value;
                      var $83 = Nat$div_mod$go$($82, _m$2, Nat$succ$(_d$3));
                      return $83;
                  case 'Either.right':
                      var $84 = Pair$new$(_d$3, _n$1);
                      return $84;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
  const Nat$div_mod = a0 => a1 => (({
      _: 'Pair.new',
      'fst': a0 / a1,
      'snd': a0 % a1
  }));
  const Nat$div = a0 => a1 => (a0 / a1);

  function Bits$length$go$(_xs$1, _n$2) {
      var Bits$length$go$ = (_xs$1, _n$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _n$2]
      });
      var Bits$length$go = _xs$1 => _n$2 => Bits$length$go$(_xs$1, _n$2);
      var arg = [_xs$1, _n$2];
      while (true) {
          let [_xs$1, _n$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $85 = self.slice(0, -1);
                      var $86 = Bits$length$go$($85, Nat$succ$(_n$2));
                      return $86;
                  case 'i':
                      var $87 = self.slice(0, -1);
                      var $88 = Bits$length$go$($87, Nat$succ$(_n$2));
                      return $88;
                  case 'e':
                      var $89 = _n$2;
                      return $89;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$length$go = x0 => x1 => Bits$length$go$(x0, x1);

  function Bits$length$(_xs$1) {
      var $90 = Bits$length$go$(_xs$1, 0n);
      return $90;
  };
  const Bits$length = x0 => Bits$length$(x0);
  const Nat$gtn = a0 => a1 => (a0 > a1);

  function Nat$mod$go$(_n$1, _m$2, _r$3) {
      var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
          ctr: 'TCO',
          arg: [_n$1, _m$2, _r$3]
      });
      var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
      var arg = [_n$1, _m$2, _r$3];
      while (true) {
          let [_n$1, _m$2, _r$3] = arg;
          var R = (() => {
              var self = _m$2;
              if (self === 0n) {
                  var $91 = Nat$mod$go$(_n$1, _r$3, _m$2);
                  return $91;
              } else {
                  var $92 = (self - 1n);
                  var self = _n$1;
                  if (self === 0n) {
                      var $94 = _r$3;
                      var $93 = $94;
                  } else {
                      var $95 = (self - 1n);
                      var $96 = Nat$mod$go$($95, $92, Nat$succ$(_r$3));
                      var $93 = $96;
                  };
                  return $93;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
  const Nat$mod = a0 => a1 => (a0 % a1);
  const Nat$add = a0 => a1 => (a0 + a1);

  function Nat$max$(_a$1, _b$2) {
      var self = (_a$1 > _b$2);
      if (self) {
          var $98 = _a$1;
          var $97 = $98;
      } else {
          var $99 = _b$2;
          var $97 = $99;
      };
      return $97;
  };
  const Nat$max = x0 => x1 => Nat$max$(x0, x1);

  function Ether$Bits$get_bytes_size$(_bytes$1) {
      var _bytes_size$2 = (Bits$length$(_bytes$1) / 8n);
      var self = ((Bits$length$(_bytes$1) % 8n) > 0n);
      if (self) {
          var $101 = (_bytes_size$2 + 1n);
          var $100 = $101;
      } else {
          var $102 = Nat$max$(1n, _bytes_size$2);
          var $100 = $102;
      };
      return $100;
  };
  const Ether$Bits$get_bytes_size = x0 => Ether$Bits$get_bytes_size$(x0);
  const Bool$and = a0 => a1 => (a0 && a1);
  const Nat$eql = a0 => a1 => (a0 === a1);

  function Cmp$as_ltn$(_cmp$1) {
      var self = _cmp$1;
      switch (self._) {
          case 'Cmp.ltn':
              var $104 = Bool$true;
              var $103 = $104;
              break;
          case 'Cmp.eql':
          case 'Cmp.gtn':
              var $105 = Bool$false;
              var $103 = $105;
              break;
      };
      return $103;
  };
  const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

  function Bits$cmp$go$(_a$1, _b$2, _c$3) {
      var Bits$cmp$go$ = (_a$1, _b$2, _c$3) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2, _c$3]
      });
      var Bits$cmp$go = _a$1 => _b$2 => _c$3 => Bits$cmp$go$(_a$1, _b$2, _c$3);
      var arg = [_a$1, _b$2, _c$3];
      while (true) {
          let [_a$1, _b$2, _c$3] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $106 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $108 = self.slice(0, -1);
                              var $109 = Bits$cmp$go$($106, $108, _c$3);
                              var $107 = $109;
                              break;
                          case 'i':
                              var $110 = self.slice(0, -1);
                              var $111 = Bits$cmp$go$($106, $110, Cmp$ltn);
                              var $107 = $111;
                              break;
                          case 'e':
                              var $112 = Bits$cmp$go$($106, Bits$e, _c$3);
                              var $107 = $112;
                              break;
                      };
                      return $107;
                  case 'i':
                      var $113 = self.slice(0, -1);
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $115 = self.slice(0, -1);
                              var $116 = Bits$cmp$go$($113, $115, Cmp$gtn);
                              var $114 = $116;
                              break;
                          case 'i':
                              var $117 = self.slice(0, -1);
                              var $118 = Bits$cmp$go$($113, $117, _c$3);
                              var $114 = $118;
                              break;
                          case 'e':
                              var $119 = Cmp$gtn;
                              var $114 = $119;
                              break;
                      };
                      return $114;
                  case 'e':
                      var self = _b$2;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $121 = self.slice(0, -1);
                              var $122 = Bits$cmp$go$(Bits$e, $121, _c$3);
                              var $120 = $122;
                              break;
                          case 'e':
                              var $123 = _c$3;
                              var $120 = $123;
                              break;
                          case 'i':
                              var $124 = Cmp$ltn;
                              var $120 = $124;
                              break;
                      };
                      return $120;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$cmp$go = x0 => x1 => x2 => Bits$cmp$go$(x0, x1, x2);

  function Bits$cmp$(_a$1, _b$2) {
      var $125 = Bits$cmp$go$(_a$1, _b$2, Cmp$eql);
      return $125;
  };
  const Bits$cmp = x0 => x1 => Bits$cmp$(x0, x1);

  function Bits$ltn$(_a$1, _b$2) {
      var $126 = Cmp$as_ltn$(Bits$cmp$(_a$1, _b$2));
      return $126;
  };
  const Bits$ltn = x0 => x1 => Bits$ltn$(x0, x1);

  function Bits$inc$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $128 = self.slice(0, -1);
              var $129 = ($128 + '1');
              var $127 = $129;
              break;
          case 'i':
              var $130 = self.slice(0, -1);
              var $131 = (Bits$inc$($130) + '0');
              var $127 = $131;
              break;
          case 'e':
              var $132 = (Bits$e + '1');
              var $127 = $132;
              break;
      };
      return $127;
  };
  const Bits$inc = x0 => Bits$inc$(x0);
  const Nat$to_bits = a0 => (nat_to_bits(a0));
  const Ether$RLP$Constants$bits_128 = (nat_to_bits(128n));

  function Bits$concat$tail$(_a$1, _b$2) {
      var Bits$concat$tail$ = (_a$1, _b$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _b$2]
      });
      var Bits$concat$tail = _a$1 => _b$2 => Bits$concat$tail$(_a$1, _b$2);
      var arg = [_a$1, _b$2];
      while (true) {
          let [_a$1, _b$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $133 = self.slice(0, -1);
                      var $134 = Bits$concat$tail$($133, (_b$2 + '0'));
                      return $134;
                  case 'i':
                      var $135 = self.slice(0, -1);
                      var $136 = Bits$concat$tail$($135, (_b$2 + '1'));
                      return $136;
                  case 'e':
                      var $137 = _b$2;
                      return $137;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$concat$tail = x0 => x1 => Bits$concat$tail$(x0, x1);

  function Bits$reverse$tco$(_a$1, _r$2) {
      var Bits$reverse$tco$ = (_a$1, _r$2) => ({
          ctr: 'TCO',
          arg: [_a$1, _r$2]
      });
      var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
      var arg = [_a$1, _r$2];
      while (true) {
          let [_a$1, _r$2] = arg;
          var R = (() => {
              var self = _a$1;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $138 = self.slice(0, -1);
                      var $139 = Bits$reverse$tco$($138, (_r$2 + '0'));
                      return $139;
                  case 'i':
                      var $140 = self.slice(0, -1);
                      var $141 = Bits$reverse$tco$($140, (_r$2 + '1'));
                      return $141;
                  case 'e':
                      var $142 = _r$2;
                      return $142;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

  function Bits$reverse$(_a$1) {
      var $143 = Bits$reverse$tco$(_a$1, Bits$e);
      return $143;
  };
  const Bits$reverse = x0 => Bits$reverse$(x0);

  function Bits$concat$go$(_a$1, _b$2) {
      var $144 = Bits$concat$tail$(Bits$reverse$(_a$1), _b$2);
      return $144;
  };
  const Bits$concat$go = x0 => x1 => Bits$concat$go$(x0, x1);
  const Nat$ltn = a0 => a1 => (a0 < a1);

  function Ether$RPL$proof$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $146 = Bits$e;
          var $145 = $146;
      } else {
          var $147 = Bits$concat$go$(Ether$RPL$proof$encode$binary$((_value$1 / 256n)), (nat_to_bits((_value$1 % 256n))));
          var $145 = $147;
      };
      return $145;
  };
  const Ether$RPL$proof$encode$binary = x0 => Ether$RPL$proof$encode$binary$(x0);

  function Ether$RPL$proof$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $149 = (nat_to_bits((_value$1 + _offSet$2)));
          var $148 = $149;
      } else {
          var _binary_encoding$3 = Ether$RPL$proof$encode$binary$(_value$1);
          var _len$4 = Ether$Bits$get_bytes_size$(_binary_encoding$3);
          var $150 = Bits$concat$go$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), _binary_encoding$3);
          var $148 = $150;
      };
      return $148;
  };
  const Ether$RPL$proof$encode_length = x0 => x1 => Ether$RPL$proof$encode_length$(x0, x1);
  const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
  const Bits$concat = a0 => a1 => (a1 + a0);
  const Debug$log = a0 => a1 => ((console.log(a0), a1()));

  function String$cons$(_head$1, _tail$2) {
      var $151 = (String.fromCharCode(_head$1) + _tail$2);
      return $151;
  };
  const String$cons = x0 => x1 => String$cons$(x0, x1);
  const String$concat = a0 => a1 => (a0 + a1);

  function List$fold$(_list$2, _nil$4, _cons$5) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $153 = self.head;
              var $154 = self.tail;
              var $155 = _cons$5($153)(List$fold$($154, _nil$4, _cons$5));
              var $152 = $155;
              break;
          case 'List.nil':
              var $156 = _nil$4;
              var $152 = $156;
              break;
      };
      return $152;
  };
  const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

  function List$(_A$1) {
      var $157 = null;
      return $157;
  };
  const List = x0 => List$(x0);

  function List$cons$(_head$2, _tail$3) {
      var $158 = ({
          _: 'List.cons',
          'head': _head$2,
          'tail': _tail$3
      });
      return $158;
  };
  const List$cons = x0 => x1 => List$cons$(x0, x1);

  function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
      var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
          ctr: 'TCO',
          arg: [_base$1, _nat$2, _res$3]
      });
      var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
      var arg = [_base$1, _nat$2, _res$3];
      while (true) {
          let [_base$1, _nat$2, _res$3] = arg;
          var R = (() => {
              var self = (({
                  _: 'Pair.new',
                  'fst': _nat$2 / _base$1,
                  'snd': _nat$2 % _base$1
              }));
              switch (self._) {
                  case 'Pair.new':
                      var $159 = self.fst;
                      var $160 = self.snd;
                      var self = $159;
                      if (self === 0n) {
                          var $162 = List$cons$($160, _res$3);
                          var $161 = $162;
                      } else {
                          var $163 = (self - 1n);
                          var $164 = Nat$to_base$go$(_base$1, $159, List$cons$($160, _res$3));
                          var $161 = $164;
                      };
                      return $161;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
  const List$nil = ({
      _: 'List.nil'
  });

  function Nat$to_base$(_base$1, _nat$2) {
      var $165 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
      return $165;
  };
  const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
  const String$nil = '';
  const Nat$lte = a0 => a1 => (a0 <= a1);

  function Maybe$(_A$1) {
      var $166 = null;
      return $166;
  };
  const Maybe = x0 => Maybe$(x0);
  const Maybe$none = ({
      _: 'Maybe.none'
  });

  function Maybe$some$(_value$2) {
      var $167 = ({
          _: 'Maybe.some',
          'value': _value$2
      });
      return $167;
  };
  const Maybe$some = x0 => Maybe$some$(x0);

  function List$at$(_index$2, _list$3) {
      var List$at$ = (_index$2, _list$3) => ({
          ctr: 'TCO',
          arg: [_index$2, _list$3]
      });
      var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
      var arg = [_index$2, _list$3];
      while (true) {
          let [_index$2, _list$3] = arg;
          var R = (() => {
              var self = _list$3;
              switch (self._) {
                  case 'List.cons':
                      var $168 = self.head;
                      var $169 = self.tail;
                      var self = _index$2;
                      if (self === 0n) {
                          var $171 = Maybe$some$($168);
                          var $170 = $171;
                      } else {
                          var $172 = (self - 1n);
                          var $173 = List$at$($172, $169);
                          var $170 = $173;
                      };
                      return $170;
                  case 'List.nil':
                      var $174 = Maybe$none;
                      return $174;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const List$at = x0 => x1 => List$at$(x0, x1);

  function Nat$show_digit$(_base$1, _n$2) {
      var _m$3 = (_n$2 % _base$1);
      var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
      var self = ((_base$1 > 0n) && (_base$1 <= 64n));
      if (self) {
          var self = List$at$(_m$3, _base64$4);
          switch (self._) {
              case 'Maybe.some':
                  var $177 = self.value;
                  var $178 = $177;
                  var $176 = $178;
                  break;
              case 'Maybe.none':
                  var $179 = 35;
                  var $176 = $179;
                  break;
          };
          var $175 = $176;
      } else {
          var $180 = 35;
          var $175 = $180;
      };
      return $175;
  };
  const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

  function Nat$to_string_base$(_base$1, _nat$2) {
      var $181 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
          var $182 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
          return $182;
      }));
      return $181;
  };
  const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

  function Nat$show$(_n$1) {
      var $183 = Nat$to_string_base$(10n, _n$1);
      return $183;
  };
  const Nat$show = x0 => Nat$show$(x0);

  function Ether$RLP$proof$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $185 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($185);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($185, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $187 = $185;
                  var $186 = $187;
              } else {
                  var $188 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$3, 128n), $185);
                  var $186 = $188;
              };
              var $184 = $186;
              break;
          case 'Ether.RLP.Tree.list':
              var $189 = self.value;
              var _bytes$3 = Bits$e;
              var _bytes$4 = (() => {
                  var $192 = _bytes$3;
                  var $193 = $189;
                  let _bytes$5 = $192;
                  let _item$4;
                  while ($193._ === 'List.cons') {
                      _item$4 = $193.head;
                      var $192 = (Ether$RLP$proof$encode$bytes$(_item$4) + _bytes$5);
                      _bytes$5 = $192;
                      $193 = $193.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = Ether$Bits$get_bytes_size$(_bytes$4);
              var $190 = ((console.log(("Second encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $194 = Bits$concat$go$(Ether$RPL$proof$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $194;
              })()));
              var $184 = $190;
              break;
      };
      return $184;
  };
  const Ether$RLP$proof$encode$bytes = x0 => Ether$RLP$proof$encode$bytes$(x0);

  function List$concat$(_as$2, _bs$3) {
      var self = _as$2;
      switch (self._) {
          case 'List.cons':
              var $196 = self.head;
              var $197 = self.tail;
              var $198 = List$cons$($196, List$concat$($197, _bs$3));
              var $195 = $198;
              break;
          case 'List.nil':
              var $199 = _bs$3;
              var $195 = $199;
              break;
      };
      return $195;
  };
  const List$concat = x0 => x1 => List$concat$(x0, x1);

  function Ether$RPL$encode$binary$(_value$1) {
      var self = (_value$1 === 0n);
      if (self) {
          var $201 = List$nil;
          var $200 = $201;
      } else {
          var $202 = List$concat$(Ether$RPL$encode$binary$((_value$1 / 256n)), List$cons$((nat_to_bits((_value$1 % 256n))), List$nil));
          var $200 = $202;
      };
      return $200;
  };
  const Ether$RPL$encode$binary = x0 => Ether$RPL$encode$binary$(x0);

  function List$foldr$(_nil$3, _cons$4, _xs$5) {
      var self = _xs$5;
      switch (self._) {
          case 'List.cons':
              var $204 = self.head;
              var $205 = self.tail;
              var $206 = _cons$4($204)(List$foldr$(_nil$3, _cons$4, $205));
              var $203 = $206;
              break;
          case 'List.nil':
              var $207 = _nil$3;
              var $203 = $207;
              break;
      };
      return $203;
  };
  const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

  function Bits$show$(_a$1) {
      var self = _a$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $209 = self.slice(0, -1);
              var $210 = String$cons$(48, Bits$show$($209));
              var $208 = $210;
              break;
          case 'i':
              var $211 = self.slice(0, -1);
              var $212 = String$cons$(49, Bits$show$($211));
              var $208 = $212;
              break;
          case 'e':
              var $213 = "";
              var $208 = $213;
              break;
      };
      return $208;
  };
  const Bits$show = x0 => Bits$show$(x0);

  function Ether$RPL$encode_length$(_value$1, _offSet$2) {
      var self = (_value$1 < 56n);
      if (self) {
          var $215 = List$cons$((nat_to_bits((_value$1 + _offSet$2))), List$nil);
          var $214 = $215;
      } else {
          var self = (_value$1 < 18446744073709551616n);
          if (self) {
              var _binary_encoding$3 = Ether$RPL$encode$binary$(_value$1);
              var _len$4 = List$foldr$(0n, (_x$4 => _y$5 => {
                  var $218 = (Ether$Bits$get_bytes_size$(_x$4) + _y$5);
                  return $218;
              }), _binary_encoding$3);
              var $217 = ((console.log((Nat$show$(_value$1) + (" " + Bits$show$(List$foldr$(Bits$e, Bits$concat, List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3)))))), (_$5 => {
                  var $219 = List$concat$(List$cons$((nat_to_bits((_len$4 + (_offSet$2 + 55n)))), List$nil), _binary_encoding$3);
                  return $219;
              })()));
              var $216 = $217;
          } else {
              var $220 = List$nil;
              var $216 = $220;
          };
          var $214 = $216;
      };
      return $214;
  };
  const Ether$RPL$encode_length = x0 => x1 => Ether$RPL$encode_length$(x0, x1);

  function Ether$RLP$encode$bytes$(_tree$1) {
      var self = _tree$1;
      switch (self._) {
          case 'Ether.RLP.Tree.tip':
              var $222 = self.value;
              var _bytes_size$3 = Ether$Bits$get_bytes_size$($222);
              var self = ((_bytes_size$3 === 1n) && Bits$ltn$($222, Ether$RLP$Constants$bits_128));
              if (self) {
                  var $224 = List$cons$($222, List$nil);
                  var $223 = $224;
              } else {
                  var $225 = List$concat$(Ether$RPL$encode_length$(_bytes_size$3, 128n), List$cons$($222, List$nil));
                  var $223 = $225;
              };
              var $221 = $223;
              break;
          case 'Ether.RLP.Tree.list':
              var $226 = self.value;
              var _bytes$3 = List$nil;
              var _bytes$4 = (() => {
                  var $229 = _bytes$3;
                  var $230 = $226;
                  let _bytes$5 = $229;
                  let _item$4;
                  while ($230._ === 'List.cons') {
                      _item$4 = $230.head;
                      var $229 = List$concat$(_bytes$5, Ether$RLP$encode$bytes$(_item$4));
                      _bytes$5 = $229;
                      $230 = $230.tail;
                  }
                  return _bytes$5;
              })();
              var _bytes_size$5 = List$foldr$(0n, (_x$5 => _y$6 => {
                  var $231 = (Ether$Bits$get_bytes_size$(_x$5) + _y$6);
                  return $231;
              }), _bytes$4);
              var $227 = ((console.log(("first encoding " + Nat$show$(_bytes_size$5))), (_$6 => {
                  var $232 = List$concat$(Ether$RPL$encode_length$(_bytes_size$5, 192n), _bytes$4);
                  return $232;
              })()));
              var $221 = $227;
              break;
      };
      return $221;
  };
  const Ether$RLP$encode$bytes = x0 => Ether$RLP$encode$bytes$(x0);

  function Bits$take$(_n$1, _xs$2) {
      var self = _n$1;
      if (self === 0n) {
          var $234 = Bits$e;
          var $233 = $234;
      } else {
          var $235 = (self - 1n);
          var self = _xs$2;
          switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
              case 'o':
                  var $237 = self.slice(0, -1);
                  var $238 = (Bits$take$($235, $237) + '0');
                  var $236 = $238;
                  break;
              case 'i':
                  var $239 = self.slice(0, -1);
                  var $240 = (Bits$take$($235, $239) + '1');
                  var $236 = $240;
                  break;
              case 'e':
                  var $241 = Bits$e;
                  var $236 = $241;
                  break;
          };
          var $233 = $236;
      };
      return $233;
  };
  const Bits$take = x0 => x1 => Bits$take$(x0, x1);

  function Bits$drop$(_n$1, _xs$2) {
      var Bits$drop$ = (_n$1, _xs$2) => ({
          ctr: 'TCO',
          arg: [_n$1, _xs$2]
      });
      var Bits$drop = _n$1 => _xs$2 => Bits$drop$(_n$1, _xs$2);
      var arg = [_n$1, _xs$2];
      while (true) {
          let [_n$1, _xs$2] = arg;
          var R = (() => {
              var self = _n$1;
              if (self === 0n) {
                  var $242 = _xs$2;
                  return $242;
              } else {
                  var $243 = (self - 1n);
                  var self = _xs$2;
                  switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                      case 'o':
                          var $245 = self.slice(0, -1);
                          var $246 = Bits$drop$($243, $245);
                          var $244 = $246;
                          break;
                      case 'i':
                          var $247 = self.slice(0, -1);
                          var $248 = Bits$drop$($243, $247);
                          var $244 = $248;
                          break;
                      case 'e':
                          var $249 = _xs$2;
                          var $244 = $249;
                          break;
                  };
                  return $244;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const Bits$drop = x0 => x1 => Bits$drop$(x0, x1);

  function Bits$break$(_len$1, _bits$2) {
      var $250 = Pair$new$(Bits$take$(_len$1, _bits$2), Bits$drop$(_len$1, _bits$2));
      return $250;
  };
  const Bits$break = x0 => x1 => Bits$break$(x0, x1);

  function String$reverse$go$(_xs$1, _res$2) {
      var String$reverse$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$reverse$go = _xs$1 => _res$2 => String$reverse$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              if (self.length === 0) {
                  var $251 = _res$2;
                  return $251;
              } else {
                  var $252 = self.charCodeAt(0);
                  var $253 = self.slice(1);
                  var $254 = String$reverse$go$($253, String$cons$($252, _res$2));
                  return $254;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

  function String$reverse$(_xs$1) {
      var $255 = String$reverse$go$(_xs$1, String$nil);
      return $255;
  };
  const String$reverse = x0 => String$reverse$(x0);

  function Bits$hex$encode$(_x$1) {
      var self = _x$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $257 = self.slice(0, -1);
              var self = $257;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $259 = self.slice(0, -1);
                      var self = $259;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $261 = self.slice(0, -1);
                              var self = $261;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $263 = self.slice(0, -1);
                                      var $264 = ("0" + Bits$hex$encode$($263));
                                      var $262 = $264;
                                      break;
                                  case 'i':
                                      var $265 = self.slice(0, -1);
                                      var $266 = ("8" + Bits$hex$encode$($265));
                                      var $262 = $266;
                                      break;
                                  case 'e':
                                      var $267 = "0";
                                      var $262 = $267;
                                      break;
                              };
                              var $260 = $262;
                              break;
                          case 'i':
                              var $268 = self.slice(0, -1);
                              var self = $268;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $270 = self.slice(0, -1);
                                      var $271 = ("4" + Bits$hex$encode$($270));
                                      var $269 = $271;
                                      break;
                                  case 'i':
                                      var $272 = self.slice(0, -1);
                                      var $273 = ("c" + Bits$hex$encode$($272));
                                      var $269 = $273;
                                      break;
                                  case 'e':
                                      var $274 = "4";
                                      var $269 = $274;
                                      break;
                              };
                              var $260 = $269;
                              break;
                          case 'e':
                              var $275 = "0";
                              var $260 = $275;
                              break;
                      };
                      var $258 = $260;
                      break;
                  case 'i':
                      var $276 = self.slice(0, -1);
                      var self = $276;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $278 = self.slice(0, -1);
                              var self = $278;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $280 = self.slice(0, -1);
                                      var $281 = ("2" + Bits$hex$encode$($280));
                                      var $279 = $281;
                                      break;
                                  case 'i':
                                      var $282 = self.slice(0, -1);
                                      var $283 = ("a" + Bits$hex$encode$($282));
                                      var $279 = $283;
                                      break;
                                  case 'e':
                                      var $284 = "2";
                                      var $279 = $284;
                                      break;
                              };
                              var $277 = $279;
                              break;
                          case 'i':
                              var $285 = self.slice(0, -1);
                              var self = $285;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $287 = self.slice(0, -1);
                                      var $288 = ("6" + Bits$hex$encode$($287));
                                      var $286 = $288;
                                      break;
                                  case 'i':
                                      var $289 = self.slice(0, -1);
                                      var $290 = ("e" + Bits$hex$encode$($289));
                                      var $286 = $290;
                                      break;
                                  case 'e':
                                      var $291 = "6";
                                      var $286 = $291;
                                      break;
                              };
                              var $277 = $286;
                              break;
                          case 'e':
                              var $292 = "2";
                              var $277 = $292;
                              break;
                      };
                      var $258 = $277;
                      break;
                  case 'e':
                      var $293 = "0";
                      var $258 = $293;
                      break;
              };
              var $256 = $258;
              break;
          case 'i':
              var $294 = self.slice(0, -1);
              var self = $294;
              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                  case 'o':
                      var $296 = self.slice(0, -1);
                      var self = $296;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $298 = self.slice(0, -1);
                              var self = $298;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $300 = self.slice(0, -1);
                                      var $301 = ("1" + Bits$hex$encode$($300));
                                      var $299 = $301;
                                      break;
                                  case 'i':
                                      var $302 = self.slice(0, -1);
                                      var $303 = ("9" + Bits$hex$encode$($302));
                                      var $299 = $303;
                                      break;
                                  case 'e':
                                      var $304 = "1";
                                      var $299 = $304;
                                      break;
                              };
                              var $297 = $299;
                              break;
                          case 'i':
                              var $305 = self.slice(0, -1);
                              var self = $305;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $307 = self.slice(0, -1);
                                      var $308 = ("5" + Bits$hex$encode$($307));
                                      var $306 = $308;
                                      break;
                                  case 'i':
                                      var $309 = self.slice(0, -1);
                                      var $310 = ("d" + Bits$hex$encode$($309));
                                      var $306 = $310;
                                      break;
                                  case 'e':
                                      var $311 = "5";
                                      var $306 = $311;
                                      break;
                              };
                              var $297 = $306;
                              break;
                          case 'e':
                              var $312 = "1";
                              var $297 = $312;
                              break;
                      };
                      var $295 = $297;
                      break;
                  case 'i':
                      var $313 = self.slice(0, -1);
                      var self = $313;
                      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                          case 'o':
                              var $315 = self.slice(0, -1);
                              var self = $315;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $317 = self.slice(0, -1);
                                      var $318 = ("3" + Bits$hex$encode$($317));
                                      var $316 = $318;
                                      break;
                                  case 'i':
                                      var $319 = self.slice(0, -1);
                                      var $320 = ("b" + Bits$hex$encode$($319));
                                      var $316 = $320;
                                      break;
                                  case 'e':
                                      var $321 = "3";
                                      var $316 = $321;
                                      break;
                              };
                              var $314 = $316;
                              break;
                          case 'i':
                              var $322 = self.slice(0, -1);
                              var self = $322;
                              switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                  case 'o':
                                      var $324 = self.slice(0, -1);
                                      var $325 = ("7" + Bits$hex$encode$($324));
                                      var $323 = $325;
                                      break;
                                  case 'i':
                                      var $326 = self.slice(0, -1);
                                      var $327 = ("f" + Bits$hex$encode$($326));
                                      var $323 = $327;
                                      break;
                                  case 'e':
                                      var $328 = "7";
                                      var $323 = $328;
                                      break;
                              };
                              var $314 = $323;
                              break;
                          case 'e':
                              var $329 = "3";
                              var $314 = $329;
                              break;
                      };
                      var $295 = $314;
                      break;
                  case 'e':
                      var $330 = "1";
                      var $295 = $330;
                      break;
              };
              var $256 = $295;
              break;
          case 'e':
              var $331 = "";
              var $256 = $331;
              break;
      };
      return $256;
  };
  const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
  const Ether$RLP$Constants$bits_184 = (nat_to_bits(184n));
  const Nat$mul = a0 => a1 => (a0 * a1);
  const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

  function Bits$to_nat$(_b$1) {
      var self = _b$1;
      switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
          case 'o':
              var $333 = self.slice(0, -1);
              var $334 = (2n * Bits$to_nat$($333));
              var $332 = $334;
              break;
          case 'i':
              var $335 = self.slice(0, -1);
              var $336 = Nat$succ$((2n * Bits$to_nat$($335)));
              var $332 = $336;
              break;
          case 'e':
              var $337 = 0n;
              var $332 = $337;
              break;
      };
      return $332;
  };
  const Bits$to_nat = x0 => Bits$to_nat$(x0);
  const Ether$RLP$Constants$bits_192 = (nat_to_bits(192n));
  const Bits$eql = a0 => a1 => (a1 === a0);

  function Ether$RLP$proof$encode$read$binary$(_value$1) {
      var self = Bits$break$(8n, _value$1);
      switch (self._) {
          case 'Pair.new':
              var $339 = self.fst;
              var $340 = self.snd;
              var _decode$4 = Bits$to_nat$($339);
              var self = ((Bits$e + '0') === $340);
              if (self) {
                  var $342 = _decode$4;
                  var $341 = $342;
              } else {
                  var $343 = (Ether$RLP$proof$encode$read$binary$($340) + (_decode$4 * 256n));
                  var $341 = $343;
              };
              var $338 = $341;
              break;
      };
      return $338;
  };
  const Ether$RLP$proof$encode$read$binary = x0 => Ether$RLP$proof$encode$read$binary$(x0);

  function Ether$RLP$proof$encode$read$(_bits$1) {
      var self = Bits$break$(8n, _bits$1);
      switch (self._) {
          case 'Pair.new':
              var $345 = self.fst;
              var $346 = self.snd;
              var $347 = ("0x" + (() => {
                  var self = Bits$ltn$($345, Ether$RLP$Constants$bits_128);
                  if (self) {
                      var $348 = String$reverse$(Bits$hex$encode$(_bits$1));
                      return $348;
                  } else {
                      var self = Bits$ltn$($345, Ether$RLP$Constants$bits_184);
                      if (self) {
                          var _content_length$4 = ((Bits$to_nat$($345) - 128n <= 0n ? 0n : Bits$to_nat$($345) - 128n) * 8n);
                          var self = Bits$break$(_content_length$4, $346);
                          switch (self._) {
                              case 'Pair.new':
                                  var $351 = self.fst;
                                  var $352 = (String$reverse$(Bits$hex$encode$($345)) + String$reverse$(Bits$hex$encode$($351)));
                                  var $350 = $352;
                                  break;
                          };
                          var $349 = $350;
                      } else {
                          var self = Bits$ltn$($345, Ether$RLP$Constants$bits_192);
                          if (self) {
                              var _content_length$4 = ((Bits$to_nat$($345) - 183n <= 0n ? 0n : Bits$to_nat$($345) - 183n) * 8n);
                              var self = Bits$break$(_content_length$4, $346);
                              switch (self._) {
                                  case 'Pair.new':
                                      var $355 = self.fst;
                                      var $356 = self.snd;
                                      var _length$7 = Ether$RLP$proof$encode$read$binary$($355);
                                      var self = Bits$break$((_length$7 * 8n), $356);
                                      switch (self._) {
                                          case 'Pair.new':
                                              var $358 = self.fst;
                                              var $359 = (String$reverse$(Bits$hex$encode$($345)) + (String$reverse$(Bits$hex$encode$($355)) + String$reverse$(Bits$hex$encode$($358))));
                                              var $357 = $359;
                                              break;
                                      };
                                      var $354 = $357;
                                      break;
                              };
                              var $353 = $354;
                          } else {
                              var $360 = "";
                              var $353 = $360;
                          };
                          var $349 = $353;
                      };
                      return $349;
                  };
              })());
              var $344 = $347;
              break;
      };
      return $344;
  };
  const Ether$RLP$proof$encode$read = x0 => Ether$RLP$proof$encode$read$(x0);

  function List$map$(_f$3, _as$4) {
      var self = _as$4;
      switch (self._) {
          case 'List.cons':
              var $362 = self.head;
              var $363 = self.tail;
              var $364 = List$cons$(_f$3($362), List$map$(_f$3, $363));
              var $361 = $364;
              break;
          case 'List.nil':
              var $365 = List$nil;
              var $361 = $365;
              break;
      };
      return $361;
  };
  const List$map = x0 => x1 => List$map$(x0, x1);

  function String$pad_right$(_size$1, _chr$2, _str$3) {
      var self = _size$1;
      if (self === 0n) {
          var $367 = _str$3;
          var $366 = $367;
      } else {
          var $368 = (self - 1n);
          var self = _str$3;
          if (self.length === 0) {
              var $370 = String$cons$(_chr$2, String$pad_right$($368, _chr$2, ""));
              var $369 = $370;
          } else {
              var $371 = self.charCodeAt(0);
              var $372 = self.slice(1);
              var $373 = String$cons$($371, String$pad_right$($368, _chr$2, $372));
              var $369 = $373;
          };
          var $366 = $369;
      };
      return $366;
  };
  const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

  function String$pad_left$(_size$1, _chr$2, _str$3) {
      var $374 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
      return $374;
  };
  const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

  function String$flatten$go$(_xs$1, _res$2) {
      var String$flatten$go$ = (_xs$1, _res$2) => ({
          ctr: 'TCO',
          arg: [_xs$1, _res$2]
      });
      var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
      var arg = [_xs$1, _res$2];
      while (true) {
          let [_xs$1, _res$2] = arg;
          var R = (() => {
              var self = _xs$1;
              switch (self._) {
                  case 'List.cons':
                      var $375 = self.head;
                      var $376 = self.tail;
                      var $377 = String$flatten$go$($376, (_res$2 + $375));
                      return $377;
                  case 'List.nil':
                      var $378 = _res$2;
                      return $378;
              };
          })();
          if (R.ctr === 'TCO') arg = R.arg;
          else return R;
      }
  };
  const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

  function String$flatten$(_xs$1) {
      var $379 = String$flatten$go$(_xs$1, "");
      return $379;
  };
  const String$flatten = x0 => String$flatten$(x0);

  function String$join$go$(_sep$1, _list$2, _fst$3) {
      var self = _list$2;
      switch (self._) {
          case 'List.cons':
              var $381 = self.head;
              var $382 = self.tail;
              var $383 = String$flatten$(List$cons$((() => {
                  var self = _fst$3;
                  if (self) {
                      var $384 = "";
                      return $384;
                  } else {
                      var $385 = _sep$1;
                      return $385;
                  };
              })(), List$cons$($381, List$cons$(String$join$go$(_sep$1, $382, Bool$false), List$nil))));
              var $380 = $383;
              break;
          case 'List.nil':
              var $386 = "";
              var $380 = $386;
              break;
      };
      return $380;
  };
  const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

  function String$join$(_sep$1, _list$2) {
      var $387 = String$join$go$(_sep$1, _list$2, Bool$true);
      return $387;
  };
  const String$join = x0 => x1 => String$join$(x0, x1);

  function Ether$RLP$encode$read$(_bits$1) {
      var _hexfify$2 = List$map$((_x$2 => {
          var $389 = String$pad_left$(2n, 48, String$reverse$(Bits$hex$encode$(_x$2)));
          return $389;
      }), _bits$1);
      var $388 = ("0x" + String$join$("", _hexfify$2));
      return $388;
  };
  const Ether$RLP$encode$read = x0 => Ether$RLP$encode$read$(x0);
  const Ether$tests = (() => {
      var _v$1 = Ether$RLP$Tree$tip$(Bits$read$("1000000100000000000000000110110000000000000000000010000000000000000011011000111111111111111111111111111111111011111000000000000100011111111111111111111111111111111101111100000000000000000000000000000001000000000000000001101100100011111111111111111111111111111111101111100000000000010001111111111111111111111111111111110111110000000000000000000000000000000100000000000000000110110000000000000000000010000000000000000011011000000000000000000010110110"));
      var _test1$2 = Ether$RLP$proof$encode$bytes$(_v$1);
      var _test2$3 = Ether$RLP$encode$bytes$(_v$1);
      var $390 = ((console.log(Ether$RLP$proof$encode$read$(_test1$2)), (_$4 => {
          var $391 = ((console.log(Ether$RLP$encode$read$(_test2$3)), (_$5 => {
              var _test2$6 = List$foldr$(Bits$e, Bits$concat, _test2$3);
              var $392 = Pair$new$(_test1$2, _test2$6);
              return $392;
          })()));
          return $391;
      })()));
      return $390;
  })();
  return {
      'Ether.RLP.Tree.tip': Ether$RLP$Tree$tip,
      'Bits.e': Bits$e,
      'Bool.false': Bool$false,
      'Bool.true': Bool$true,
      'Cmp.as_eql': Cmp$as_eql,
      'Cmp.ltn': Cmp$ltn,
      'Cmp.gtn': Cmp$gtn,
      'Word.cmp.go': Word$cmp$go,
      'Cmp.eql': Cmp$eql,
      'Word.cmp': Word$cmp,
      'Word.eql': Word$eql,
      'Nat.succ': Nat$succ,
      'Nat.zero': Nat$zero,
      'U16.eql': U16$eql,
      'Char.parse.type': Char$parse$type,
      'Unit.new': Unit$new,
      'Char.parse': Char$parse,
      'Bits.i': Bits$i,
      'Bits.o': Bits$o,
      'Bits.read': Bits$read,
      'Pair.fst': Pair$fst,
      'Either': Either,
      'Either.left': Either$left,
      'Either.right': Either$right,
      'Nat.sub_rem': Nat$sub_rem,
      'Pair': Pair,
      'Pair.new': Pair$new,
      'Nat.div_mod.go': Nat$div_mod$go,
      'Nat.div_mod': Nat$div_mod,
      'Nat.div': Nat$div,
      'Bits.length.go': Bits$length$go,
      'Bits.length': Bits$length,
      'Nat.gtn': Nat$gtn,
      'Nat.mod.go': Nat$mod$go,
      'Nat.mod': Nat$mod,
      'Nat.add': Nat$add,
      'Nat.max': Nat$max,
      'Ether.Bits.get_bytes_size': Ether$Bits$get_bytes_size,
      'Bool.and': Bool$and,
      'Nat.eql': Nat$eql,
      'Cmp.as_ltn': Cmp$as_ltn,
      'Bits.cmp.go': Bits$cmp$go,
      'Bits.cmp': Bits$cmp,
      'Bits.ltn': Bits$ltn,
      'Bits.inc': Bits$inc,
      'Nat.to_bits': Nat$to_bits,
      'Ether.RLP.Constants.bits_128': Ether$RLP$Constants$bits_128,
      'Bits.concat.tail': Bits$concat$tail,
      'Bits.reverse.tco': Bits$reverse$tco,
      'Bits.reverse': Bits$reverse,
      'Bits.concat.go': Bits$concat$go,
      'Nat.ltn': Nat$ltn,
      'Ether.RPL.proof.encode.binary': Ether$RPL$proof$encode$binary,
      'Ether.RPL.proof.encode_length': Ether$RPL$proof$encode_length,
      'List.for': List$for,
      'Bits.concat': Bits$concat,
      'Debug.log': Debug$log,
      'String.cons': String$cons,
      'String.concat': String$concat,
      'List.fold': List$fold,
      'List': List,
      'List.cons': List$cons,
      'Nat.to_base.go': Nat$to_base$go,
      'List.nil': List$nil,
      'Nat.to_base': Nat$to_base,
      'String.nil': String$nil,
      'Nat.lte': Nat$lte,
      'Maybe': Maybe,
      'Maybe.none': Maybe$none,
      'Maybe.some': Maybe$some,
      'List.at': List$at,
      'Nat.show_digit': Nat$show_digit,
      'Nat.to_string_base': Nat$to_string_base,
      'Nat.show': Nat$show,
      'Ether.RLP.proof.encode.bytes': Ether$RLP$proof$encode$bytes,
      'List.concat': List$concat,
      'Ether.RPL.encode.binary': Ether$RPL$encode$binary,
      'List.foldr': List$foldr,
      'Bits.show': Bits$show,
      'Ether.RPL.encode_length': Ether$RPL$encode_length,
      'Ether.RLP.encode.bytes': Ether$RLP$encode$bytes,
      'Bits.take': Bits$take,
      'Bits.drop': Bits$drop,
      'Bits.break': Bits$break,
      'String.reverse.go': String$reverse$go,
      'String.reverse': String$reverse,
      'Bits.hex.encode': Bits$hex$encode,
      'Ether.RLP.Constants.bits_184': Ether$RLP$Constants$bits_184,
      'Nat.mul': Nat$mul,
      'Nat.sub': Nat$sub,
      'Bits.to_nat': Bits$to_nat,
      'Ether.RLP.Constants.bits_192': Ether$RLP$Constants$bits_192,
      'Bits.eql': Bits$eql,
      'Ether.RLP.proof.encode.read.binary': Ether$RLP$proof$encode$read$binary,
      'Ether.RLP.proof.encode.read': Ether$RLP$proof$encode$read,
      'List.map': List$map,
      'String.pad_right': String$pad_right,
      'String.pad_left': String$pad_left,
      'String.flatten.go': String$flatten$go,
      'String.flatten': String$flatten,
      'String.join.go': String$join$go,
      'String.join': String$join,
      'Ether.RLP.encode.read': Ether$RLP$encode$read,
      'Ether.tests': Ether$tests,
  };
})();
var MAIN = module.exports['Ether.tests'];
try {
  console.log(JSON.stringify(MAIN, null, 2) || '<unprintable>')
} catch (e) {
  console.log(MAIN);
};