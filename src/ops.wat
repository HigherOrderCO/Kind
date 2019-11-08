(module

(memory (export "memory") 1)

  (func $mem_clear
    (i32.store (i32.const 0) (i32.const 0))
    (i32.store (i32.const 4) (i32.const 0))
    (i32.store (i32.const 8) (i32.const 0))
    (i32.store (i32.const 12) (i32.const 0))
    (i32.store (i32.const 16) (i32.const 0))
    (i32.store (i32.const 20) (i32.const 0))
  )
  (export "mem_clear" (func $mem_clear))

  (func $store (param $x0 i32) (param $x1 i32) (param $y0 i32) (param $y1 i32)
    (i32.store (i32.const 0)  (get_local $x0))
    (i32.store (i32.const 4)  (get_local $x1))
    (i32.store (i32.const 8)  (get_local $y0))
    (i32.store (i32.const 12) (get_local $y1))
  )
  (export "store" (func $store))

  (func $load0 (result i32) (i32.load (i32.const 0)))
  (export "load0" (func $load0))

  (func $load1  (result i32) (i32.load (i32.const 4)))
  (export "load1" (func $load1))

  (func $eq (i32.store (i32.const 0)
    (i64.eq (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "eq" (func $eq))

  (func $ne (i32.store (i32.const 0)
      (i64.ne (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "ne" (func $ne))

  (func $lt_s (i32.store (i32.const 0)
      (i64.lt_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "lt_s" (func $lt_s))

  (func $lt_u (i32.store (i32.const 0)
      (i64.lt_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "lt_u" (func $lt_u))

  (func $gt_s (i32.store (i32.const 0)
      (i64.gt_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "gt_s" (func $gt_s))

  (func $gt_u (i32.store (i32.const 0)
      (i64.gt_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "gt_u" (func $gt_u))

  (func $le_s (i32.store (i32.const 0)
      (i64.le_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "le_s" (func $le_s))

  (func $le_u (i32.store (i32.const 0)
    (i64.le_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "le_u" (func $le_u))

  (func $ge_u (i32.store (i32.const 0)
    (i64.ge_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "ge_u" (func $ge_u))

  (func $ge_s (i32.store (i32.const 0)
    (i64.ge_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "ge_s" (func $ge_s))

  (func $clz (i64.store (i32.const 0) (i64.clz (i64.load (i32.const 8))))
  ) (export "clz" (func $clz))

  (func $ctz (i64.store (i32.const 0) (i64.ctz (i64.load (i32.const 8))))
  ) (export "ctz" (func $ctz))

  (func $popcnt (i64.store (i32.const 0) (i64.popcnt (i64.load (i32.const 8))))
  ) (export "popcnt" (func $popcnt))

  (func $shl (i64.store (i32.const 0)
      (i64.shl (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "shl" (func $shl))

  (func $shr (i64.store (i32.const 0)
      (i64.shr_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "shr" (func $shr))

  (func $shr_s (i64.store (i32.const 0)
      (i64.shr_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "shr_s" (func $shr_s))

  (func $rotl (i64.store (i32.const 0)
      (i64.rotl (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "rotl" (func $rotl))

  (func $rotr (i64.store (i32.const 0)
      (i64.rotr (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "rotr" (func $rotr))

  (func $and (i64.store (i32.const 0)
      (i64.and (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "and" (func $and))

  (func $or (i64.store (i32.const 0)
      (i64.or (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "or" (func $or))

  (func $xor (i64.store (i32.const 0)
      (i64.xor (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "xor" (func $xor))

  (func $add (i64.store (i32.const 0)
      (i64.add (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "add" (func $add))

  (func $sub (i64.store (i32.const 0)
      (i64.sub (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "sub" (func $sub))

  (func $mul (i64.store (i32.const 0)
      (i64.mul (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "mul" (func $mul))

  (func $div_u (i64.store (i32.const 0)
      (i64.div_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "div_u" (func $div_u))

  (func $div_s (i64.store (i32.const 0)
      (i64.div_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "div_s" (func $div_s))

  (func $rem_u (i64.store (i32.const 0)
      (i64.rem_u (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "rem_u" (func $rem_u))

  (func $rem_s (i64.store (i32.const 0)
      (i64.rem_s (i64.load (i32.const 0)) (i64.load (i32.const 8))))
  ) (export "rem_s" (func $rem_s))

  (func $fabs
    (f64.store (i32.const 0) (f64.abs (f64.load (i32.const 8))))
  ) (export "fabs" (func $fabs))

  (func $fneg
    (f64.store (i32.const 0) (f64.neg (f64.load (i32.const 8))))
  ) (export "fneg" (func $fneg))

  (func $fceil
    (f64.store (i32.const 0) (f64.ceil (f64.load (i32.const 8))))
  ) (export "fceil" (func $fceil))

  (func $ffloor
    (f64.store (i32.const 0) (f64.floor (f64.load (i32.const 8))))
  ) (export "ffloor" (func $ffloor))

  (func $fnearest
    (f64.store (i32.const 0) (f64.nearest (f64.load (i32.const 8))))
  ) (export "fnearest" (func $fnearest))

  (func $fsqrt
    (f64.store (i32.const 0) (f64.sqrt (f64.load (i32.const 8))))
  ) (export "fsqrt" (func $fsqrt))

  (func $fadd (f64.store (i32.const 0)
      (f64.add (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fadd" (func $fadd))

  (func $fsub (f64.store (i32.const 0)
      (f64.sub (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fsub" (func $fsub))

  (func $fmul (f64.store (i32.const 0)
      (f64.mul (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fmul" (func $fmul))

  (func $fdiv (f64.store (i32.const 0)
      (f64.div (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fdiv" (func $fdiv))

  (func $fmin (f64.store (i32.const 0)
      (f64.min (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fmin" (func $fmin))

  (func $fmax (f64.store (i32.const 0)
      (f64.max (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fmax" (func $fmax))

  (func $fcopysign (f64.store (i32.const 0)
      (f64.copysign (f64.load (i32.const 0)) (f64.load (i32.const 8))))
  ) (export "fcopysign" (func $fcopysign))

  (func $feq (i32.store (i32.const 0)
      (f64.eq (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "feq" (func $feq))

  (func $fne (i32.store (i32.const 0)
      (f64.ne (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "fne" (func $fne))

  (func $flt (i32.store (i32.const 0)
      (f64.lt (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "flt" (func $flt))

  (func $fgt (i32.store (i32.const 0)
      (f64.gt (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "fgt" (func $fgt))

  (func $fle (i32.store (i32.const 0)
      (f64.le (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "fle" (func $fle))

  (func $fge (i32.store (i32.const 0)
      (f64.ge (f64.load (i32.const 0)) (f64.load (i32.const 8))))
    (i32.store (i32.const 4) (i32.const 0))
  ) (export "fge" (func $fge))

  (func $ext32_s
    (i64.store (i32.const 0) (i64.extend_i32_s (i32.load (i32.const 8))))
  ) (export "ext32_s" (func $ext32_s))

  (func $ftos
    (i64.store (i32.const 0) (i64.trunc_f64_s (f64.load (i32.const 8))))
  ) (export "ftos" (func $ftos))

  (func $ftou
    (i64.store (i32.const 0) (i64.trunc_f64_u (f64.load (i32.const 8))))
  ) (export "ftou" (func $ftou))

  (func $stof
    (f64.store (i32.const 0) (f64.convert_i64_s (i64.load (i32.const 8))))
  ) (export "stof" (func $stof))

  (func $utof
    (f64.store (i32.const 0) (f64.convert_i64_u (i64.load (i32.const 8))))
  ) (export "utof" (func $utof))


)

