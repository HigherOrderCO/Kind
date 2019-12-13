divert(-1)
;; calldata
;;   0x00        : RefId
;;   0x04        : [pointer, length, address] array
;;   ...         : term code
;; memory
;;   0x00 - 0x40 : node type jump table
;;   0x40        : memory size
;;   0x60        : root
;;   0x64        : memory start

define(MEM_SIZE, 0x40)
define(MEM_ROOT, 0x60)
define(MEM_BASE, 0x64)

define(VAR, 0)
define(LAM, 1)
define(APP, 2)
define(REF, 3)

define(MLOAD32,
	`MLOAD
	PUSH 224
	SHR')

define(MSTORE32,
	`SWAP1
	PUSH 224
	SHL
	DUP2
	MLOAD
	PUSH 0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff
	AND
	OR
	SWAP1
	MSTORE')

divert(0)
	PUSH @reduce_var
	PUSH 224
	SHL
	PUSH @reduce_lam
	PUSH 192
	SHL
	OR
	PUSH @reduce_app
	PUSH 160
	SHL
	OR
	PUSH @reduce_ref
	PUSH 128
	SHL
	OR

	PUSH 0
	MSTORE

	;; handle NIL (-1) like VAR
	PUSH @reduce_var
	PUSH 224
	SHL

	PUSH 0x3c
	MSTORE

;; begin reduce root
	PUSH MEM_ROOT

	PUSH 0
	CALLDATALOAD
	PUSH 224
	SHR

	PUSH 4
	SHL
	PUSH REF
	OR

	PUSH 224
	SHL

	DUP2
	MSTORE

	;; stack = [&root]

	PUSH @reduce_done
	PUSH 64
	SHL
	OR

	;; stack = [frame]

reduce_loop:
	DUP1
	JUMP @reduce
reduce_done:
	JUMPI @reduce_loop

	POP

	;; reduce finished
	PUSH MEM_SIZE
	MLOAD

	PUSH 2
	SHL
	PUSH eval(MEM_BASE - MEM_ROOT)
	ADD

	PUSH MEM_ROOT
	RETURN

reduce:
	;; load node
	DUP1
	PUSH 0xffffffff
	AND
	MLOAD32

	;; get node type
	DUP1
	PUSH 0xf
	AND

	;; stack = [node type, node, frame]

	;; jump to label based on node type
	PUSH 2
	SHL
	MLOAD32
	JUMP

reduce_var:
	POP

	;; return 0
	PUSH 0
	SWAP1
	PUSH 64
	SHR
	JUMP

reduce_lam:
	PUSH 0xfffffff0
	AND
	PUSH 2
	SHR
	PUSH MEM_BASE
	ADD

	DUP1
	MLOAD32

	DUP1
	PUSH 0xffffffff
	EQ

	JUMPI @reduce_lam_body

	;; stack = [val[0], val, frame]
	PUSH 2
	SHR
	PUSH MEM_BASE
	ADD

	;; NOD(VAR, depth)
	DUP3
	PUSH 28
	SHR
	PUSH 0xfffffff0
	AND

	DUP2
	MSTORE32

reduce_lam_body:
	POP
	;; stack = [val, frame]

	PUSH 4
	ADD

	;; stack = [&val[1], frame]

	DUP2
	PUSH 0xffffffff00000000
	AND

	OR

	PUSH 0x0000000100000000
	ADD

	PUSH @reduce_lam_done
	PUSH 64
	SHL
	OR

	;; stack = [new frame, frame]
	JUMP @reduce

reduce_lam_done:
	;; stack = [result, old frame]

	;; ignore result
	POP

	;; return 0
	PUSH 0
	SWAP1
	PUSH 64
	SHR
	JUMP

reduce_app:
	DUP1
	PUSH 0xfffffff0
	AND
	PUSH 2
	SHR
	PUSH MEM_BASE
	ADD

reduce_app_func:
	DUP1
	MLOAD32

	;; stack = [val[0], val, node, frame]

	DUP1
	PUSH 0xf
	AND

	PUSH LAM
	EQ
	JUMPI @reduce_app_subs

	POP

	;; stack = [val, node, frame]

	DUP1

	DUP4
	PUSH 0x00000000ffffffff00000000
	AND
	OR

	PUSH @reduce_app_func_done
	PUSH 64
	SHL
	OR

	JUMP @reduce
reduce_app_func_done:
	JUMPI @reduce_app_func

	DUP1
	PUSH 4
	ADD

	DUP4
	PUSH 0x00000000ffffffff00000000
	AND
	OR

	PUSH @reduce_app_argm_done
	PUSH 64
	SHL
	OR

	JUMP @reduce
reduce_app_argm_done:
	JUMPI @reduce_app_func

	;; no substitution, return 0
	POP
	POP
	PUSH 0
	SWAP1
	PUSH 64
	SHR
	JUMP

reduce_app_subs:
	PUSH 2
	SHR
	PUSH MEM_BASE
	ADD

	DUP1
	MLOAD32

	;; stack = [tmp, &mem[VAL(val[0])], val, node, frame]

	DUP1
	PUSH 0xffffffff
	EQ
	JUMPI @reduce_app_done

	DUP1
	PUSH 2
	SHR
	PUSH MEM_BASE
	ADD

	;; stack = [&mem[VAL(tmp)], tmp, &mem[VAL(val[0])], val, node, frame]

	DUP4
	PUSH 4
	ADD
	MLOAD32

	;; stack = [val[1], &mem[VAL(tmp)], tmp, &mem[VAL(val[0])], val, node, frame]

	SWAP1
	MSTORE32

reduce_app_done:
	POP
	;; stack = [&mem[VAL(val[0])], val, node, frame]

	PUSH 4
	ADD
	MLOAD32

	;; stack = [mem[VAL(val[0]) + 1], val, node, frame]
	DUP4
	PUSH 0xffffffff
	AND
	MSTORE32

	POP
	POP

	;; return 1
	PUSH 1
	SWAP1
	PUSH 64
	SHR
	JUMP

reduce_ref:
	;; stack = [node, frame]
	DUP1
	PUSH 4
	SHR
	PUSH 3
	MUL
	PUSH 1
	ADD
	PUSH 2
	SHL

	CALLDATALOAD

	PUSH MEM_SIZE
	MLOAD

	DUP2
	PUSH 190
	SHR
	PUSH 0x3fffffffc
	AND

	DUP2
	PUSH 2
	SHL
	PUSH MEM_BASE
	ADD

	DUP2
	DUP2
	ADD

	SWAP2

	DUP5
	PUSH 160
	SHR
	PUSH 0xffffffff
	AND

	DUP3

	CALLDATACOPY

	;; stack = [mem size, final mem size, term, node, frame]

reduce_ref_update:
	DUP2
	DUP2
	EQ
	JUMPI @reduce_ref_done

	DUP1
	MLOAD
	PUSH 224
	SHR

	DUP1
	PUSH 0xffffffff
	EQ

	SWAP1
	PUSH 0xf
	AND
	PUSH REF
	EQ

	OR

	JUMPI @reduce_ref_next

	DUP1
	MLOAD

	DUP4
	PUSH 228
	SHL

	ADD

	DUP2
	MSTORE

reduce_ref_next:
	PUSH 4
	ADD
	JUMP @reduce_ref_update

reduce_ref_done:
	POP

	PUSH MEM_BASE
	SWAP1
	SUB
	PUSH 2
	SHR

	PUSH MEM_SIZE
	MSTORE

	PUSH 4
	SHL
	SWAP1

	PUSH 224
	SHR

	ADD

	DUP3
	PUSH 0xffffffff
	AND

	MSTORE32

	;; return 1
	POP
	PUSH 1
	SWAP1
	PUSH 64
	SHR
	JUMP
