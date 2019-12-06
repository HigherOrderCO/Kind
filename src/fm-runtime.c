#include <stdarg.h>
#include <stddef.h>
#include <stdint.h>

#if DEBUG
void debug_str(const char *msg);
void debug_mem(uint32_t *ptr, uint32_t len);
static void debug(const char *fmt, ...);
#else
# define debug_str(msg)
# define debug_mem(ptr, len)
# define debug(fmt, ...)
#endif

enum {
	VAR,
	LAM,
	APP,
	REF,
};

typedef struct {
	uint32_t ptr;
	uint32_t len;
	uint32_t mem[];
} Term;

typedef struct {
	uint32_t ptr;
	uint32_t depth : 31;
	uint32_t side : 1;
} Frame;

typedef struct {
	uint32_t beta;
	uint32_t copy;
} Stats;

typedef struct {
	uint32_t root;
	uint32_t len;
	Stats stats;
} Result;

Result
fm_reduce(Term *defs[], uint32_t ptr, uint32_t *mem)
{
	Stats stats = {0, 0};
	Frame back[1024], *frame;
	size_t back_len, pos;
	Term *ref;
	uint32_t root, next, subs, func, argm, vari, num0, num1, i, tmp;
	uint32_t mem_len;
	unsigned depth;

	for (i = 0; i < defs[ptr]->len; ++i)
		mem[i] = defs[ptr]->mem[i];
	mem_len = i;
	root = defs[ptr]->ptr;

	depth = 0;
	back_len = 0;
	next = root;
	while (next != -1) {
		// XXX: garbage collection

		subs = -1;
		switch (next & 0xf) {
		case LAM:
			back[back_len++] = (Frame){next, 1, depth};
			vari = mem[next >> 4];
			if (vari != -1)
				mem[vari >> 4] = depth << 4 | VAR;
			++depth;
			next = mem[(next >> 4) + 1];
			break;
		case APP:
			func = mem[next >> 4];
			if ((func & 0xf) == LAM) {
				++stats.beta;
				argm = mem[(next >> 4) + 1];
				vari = mem[func >> 4];
				if (vari != -1)
					mem[vari >> 4] = argm;
				subs = mem[(func >> 4) + 1];
			} else {
				back[back_len++] = (Frame){next, 0, depth};
				next = func;
			}
			break;
		case REF:
			stats.copy += ref->len;
			pos = mem_len;
			ref = defs[next >> 4];
			for (i = 0; i < ref->len; ++i) {
				tmp = ref->mem[i];
				if (tmp != -1 && (tmp & 0xf) != REF)
					tmp += pos << 4;
				mem[pos + i] = tmp;
			}
			mem_len += ref->len;
			subs = ref->ptr + (pos << 4);
			break;
		case VAR:
			next = -1;
			break;
		}

		if (subs != -1) {
			if (back_len > 0) {
				frame = &back[--back_len];
				mem[(frame->ptr >> 4) + frame->side] = subs;
				next = frame->ptr;
				depth = frame->depth;
			} else {
				root = subs;
				next = subs;
			}
		}

		if (next == -1) {
			while (back_len > 0) {
				frame = &back[back_len - 1];
				if ((frame->ptr & 0xf) == APP && frame->side == 0) {
					frame->side = 1;
					depth = frame->depth;
					next = mem[(frame->ptr >> 4) + 1];
					break;
				}
				--back_len;
			}
		}
	}

	return (Result){
		.root = root,
		.len = mem_len,
		.stats = stats,
	};
}

#if DEBUG
static char *
stpcpy(char *dst, const char *src)
{
	while ((*dst = *src++))
		++dst;
	return dst;
}

// very simplified printf
static void debug(const char *fmt, ...)
{
	va_list ap;
	char *dst, *p, buf[256];
	int32_t d;
	uint32_t n;

	va_start(ap, fmt);
	for (dst = buf; *fmt; ++fmt) {
		if (*fmt == '%') {
			switch (*++fmt) {
			case '%':
				*dst++ = '%';
				break;
			case 's':
				dst = stpcpy(dst, va_arg(ap, const char *));
				break;
			case 'd':
				d = va_arg(ap, int32_t);
				if (d < 0) {
					*dst++ = '-';
					d = -d;
				}
				for (n = 10; n <= d; n *= 10, ++dst)
					;
				for (p = dst; n > 1; --p, d /= 10, n /= 10)
					*p = '0' + d % 10;
				++dst;
				break;
			case 'x':
				d = va_arg(ap, int32_t);
				if (d < 0) {
					*dst++ = '-';
					d = -d;
				}
				for (n = 0xf; n <= d; n <<= 4, ++dst)
					;
				for (p = dst; n > 1; --p, d >>= 4, n >>= 4)
					*p = ((d & 0xf) < 10 ? '0' : 'a' - 10) + (d & 0xf);
				++dst;
				break;
			}
		} else {
			*dst++ = *fmt;
		}
	}
	*dst++ = '\0';
	debug_str(buf);
}
#endif
