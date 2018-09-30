#define WASM_EXPORT __attribute__ ((visibility ("default")))

void _start() {};

int add42(int num) {
    return num + 42;
}

WASM_EXPORT int fib(int n) {
    int i, t, a = 0, b = 1;
    int m = add42(n);
    for (i = 0; i < m; i++) {
        t = a + b; a = b; b = t;
    }
    return b;
}
