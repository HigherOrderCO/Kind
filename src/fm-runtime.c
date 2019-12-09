#include <stdint.h>

#define TYP(x) ((x) & 0xf)
#define VAL(x) ((x) >> 4)
#define NOD(t, v) ((v) << 4 | (t))

enum {
	VAR,
	LAM,
	APP,
	REF,
};

typedef struct {
	uint32_t ptr, len, mem[];
} Term;

Term **def;
uint32_t *mem, mem_len;
struct {
	uint32_t beta, copy;
} stats;

static int
do_reduce(uint32_t *node, uint32_t depth)
{
	Term *ref;
	uint32_t *val, tmp;

	switch (TYP(*node)) {
	case VAR:
		break;
	case LAM:
		val = &mem[VAL(*node)];
		if (val[0] != -1)
			mem[VAL(val[0])] = NOD(VAR, depth);
		do_reduce(&val[1], depth + 1);
		break;
	case APP:
		val = &mem[VAL(*node)];
		while (TYP(val[0]) != LAM) {
			if (!do_reduce(&val[0], depth) && !do_reduce(&val[1], depth))
				return 0;
		}
		++stats.beta;
		tmp = mem[VAL(val[0])];
		if (tmp != -1)
			mem[VAL(tmp)] = val[1];
		*node = mem[VAL(val[0]) + 1];
		return 1;
	case REF:
		ref = def[VAL(*node)];
		stats.copy += ref->len;
		for (uint32_t i = 0; i < ref->len; ++i) {
			tmp = ref->mem[i];
			if (tmp != -1 && TYP(tmp) != REF)
				tmp += mem_len << 4;
			mem[mem_len + i] = tmp;
		}
		*node = ref->ptr + (mem_len << 4);
		mem_len += ref->len;
		return 1;
	}
	return 0;
}

uint32_t
reduce(uint32_t id)
{
	uint32_t root = NOD(REF, id);

	while (do_reduce(&root, 0))
		;
	return root;
}
