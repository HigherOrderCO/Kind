#include <stddef.h>
#include <stdint.h>

typedef struct Net {
  uint64_t *nodes;
  size_t nodes_len;
  uint64_t *redex;
  size_t redex_len;
  size_t freed;
} Net;

typedef struct Stats {
  uint32_t rewrites;
  uint32_t loops;
} Stats;

Stats net_reduce_strict(Net *);
void net_find_redexes(Net *);
