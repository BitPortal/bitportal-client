typedef enum {
    BITCOIN_CHAIN,
    ETHEREUM_CHAIN,
    EOS_CHAIN,
    POLKADOT_CHAIN
} Chain;

typedef enum {
    BTC_SYMBOL,
    ETH_SYMBOL,
    EOS_SYMBOL,
    DOT_SYMBOL
} Symbol;

typedef enum {
    SCRYPT,
    PBKDF2
} KdfType;

typedef enum {
    MNEMONICS,
    PRIVATE_KEY,
    WIF,
    KEYSTORE,
    SURI
} Source;

typedef enum {
    P2SH_P2WPKH_ADDRESS,
    P2WPKH_ADDRESS
} AddressType;

static const char *chains[] = {
    "bitcoin",
    "ethereum",
    "eos",
    "polkadot"
};

static const char *symbols[] = {
    "BTC",
    "ETH",
    "EOS",
    "DOT"
};
