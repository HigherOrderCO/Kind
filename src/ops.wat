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

  (func $i32_store (param $x i32) (param $y i32)
    (i32.store (i32.const 0) (get_local $x))
    (i32.store (i32.const 4) (get_local $y))
  )
  (export "i32_store" (func $i32_store))

  (func $i64_store (param $x0 i32) (param $x1 i32)
                   (param $y0 i32) (param $y1 i32)
    (i32.store (i32.const 0)  (get_local $x0))
    (i32.store (i32.const 4)  (get_local $x1))
    (i32.store (i32.const 8)  (get_local $y0))
    (i32.store (i32.const 12) (get_local $y1))
  )
  (export "i64_store" (func $i64_store))

  (func $f32_store (param $x f32) (param $y f32)
    (f32.store (i32.const 0) (get_local $x))
    (f32.store (i32.const 4) (get_local $y))
  )
  (export "f32_store" (func $f32_store))

  (func $f32_load (result f32)
    (f32.load (i32.const 0))
  )
  (export "f32_load" (func $f32_load))

  (func $f64_store (param $x f64) (param $y f64)
    (f64.store (i32.const 0) (get_local $x))
    (f64.store (i32.const 8) (get_local $y))
  )
  (export "f64_store" (func $f64_store))

  (func $f64_load (result f64)
    (f64.load (i32.const 0))
  )
  (export "f64_load" (func $f64_load))

  (func $i32_add
      (i32.store (i32.const 0)
        (i32.add (i32.load (i32.const 0)) (i32.load (i32.const 4)))
      )
     (i32.store (i32.const 4) (i32.const 0))
  )
  (export "i32_add" (func $i32_add))

  (func $i64_add
      (i64.store (i32.const 0)
        (i64.add (i64.load (i32.const 0)) (i64.load (i32.const 8)))
      )
     (i64.store (i32.const 8) (i64.const 0))
  )
  (export "i64_add" (func $i64_add))

  (func $f32_add
      (f32.store (i32.const 0)
        (f32.add (f32.load (i32.const 0)) (f32.load (i32.const 4)))
      )
     (i32.store (i32.const 4) (i32.const 0))
  )
  (export "f32_add" (func $f32_add))

  (func $f64_add
      (f64.store (i32.const 0)
        (f64.add (f64.load (i32.const 0)) (f64.load (i32.const 8)))
      )
     (i64.store (i32.const 8) (i64.const 0))
  )
  (export "f64_add" (func $f64_add))

;;  (func $sub (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.sub)
;;  (export "sub" (func $sub))
;;
;;  (func $mul (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.mul)
;;  (export "mul" (func $mul))
;;
;;  (func $div_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.div_u)
;;  (export "div_u" (func $div_u))
;;
;;  (func $div_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.div_s)
;;  (export "div_s" (func $div_s))
;;
;;  (func $rem_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.rem_u)
;;  (export "rem_u" (func $rem_u))
;;
;;  (func $rem_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.rem_s)
;;  (export "rem_s" (func $rem_s))
;;
;;  (func $and (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.and)
;;  (export "and" (func $and))
;;
;;  (func $or (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.or)
;;  (export "or" (func $or))
;;
;;  (func $xor (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.xor)
;;  (export "xor" (func $xor))
;;
;;  (func $shl (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.shl)
;;  (export "shl" (func $shl))
;;
;;  (func $shr_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.shr_u)
;;  (export "shr_u" (func $shr_u))
;;
;;  (func $shr_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.shr_s)
;;  (export "shr_s" (func $shr_s))
;;
;;  (func $rotl (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.rotl)
;;  (export "rotl" (func $rotl))
;;
;;  (func $rotr (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.rotr)
;;  (export "rotr" (func $rotr))
;;
;;  (func $clz (param $lhs i32) (result i32)
;;    get_local $lhs i32.clz)
;;  (export "clz" (func $clz))
;;
;;  (func $ctz (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs i32.ctz)
;;  (export "ctz" (func $ctz))
;;
;;  (func $popcnt (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs i32.popcnt)
;;  (export "popcnt" (func $popcnt))
;;
;;  (func $eqz (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs i32.eqz)
;;  (export "eqz" (func $eqz))
;;
;;  (func $eq (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.eq)
;;  (export "eq" (func $eq))
;;
;;  (func $ne (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.ne)
;;  (export "ne" (func $ne))
;;
;;  (func $lt_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.lt_u)
;;  (export "lt_u" (func $lt_u))
;;
;;  (func $lt_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.lt_s)
;;  (export "lt_s" (func $lt_s))
;;
;;  (func $gt_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.gt_u)
;;  (export "gt_u" (func $gt_u))
;;
;;  (func $gt_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.gt_s)
;;  (export "gt_s" (func $gt_s))
;;
;;  (func $le_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.le_u)
;;  (export "le_u" (func $le_u))
;;
;;  (func $le_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.le_s)
;;  (export "le_s" (func $le_s))
;;
;;  (func $ge_u (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.ge_u)
;;  (export "ge_u" (func $ge_u))
;;
;;  (func $ge_s (param $lhs i32) (param $rhs i32) (result i32)
;;    get_local $lhs get_local $rhs i32.ge_s)
;;  (export "ge_s" (func $ge_s))

)

