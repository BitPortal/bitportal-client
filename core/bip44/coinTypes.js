const coinTypes = {
  AC: 0x80000033,
  ACC: 0x800000a1,
  ACT: 0x8000029a,
  ADA: 0x80000717,
  AIB: 0x80000037,
  ARA: 0x80000138,
  ARG: 0x8000002d,
  ARK: 0x8000006f,
  ASK: 0x800000df,
  AUR: 0x80000055,
  AXE: 0x80001092,
  BBC: 0x80000457,
  BCA: 0x800000b9,
  BCD: 0x800003e7,
  BCH: 0x80000091,
  BCO: 0x800000a2,
  BCS: 0x8000022b,
  BELA: 0x80000049,
  BIGUP: 0x80000064,
  BIO: 0x8000009a,
  BIQ: 0x80000061,
  BITB: 0x80000058,
  BITG: 0x800000de,
  BLK: 0x8000000a,
  BLOCK: 0x80000148,
  BOXY: 0x800000d7,
  BPA: 0x80001a0a,
  BRIT: 0x80000046,
  BRK: 0x8000007e,
  BSD: 0x8000005b,
  BSQ: 0x8000008e,
  BTA: 0x80000059,
  BTC: 0x80000000,
  BTC2X: 0x8000009d,
  BTCD: 0x80000034,
  BTCP: 0x800000b7,
  BTCZ: 0x800000b1,
  BTF: 0x800026a0,
  BTG: 0x8000009c,
  BTM: 0x80000099,
  BTN: 0x800003e8,
  BTP: 0x80002327,
  BTQ: 0x80002093,
  BTV: 0x8000270f,
  BTW: 0x80000309,
  BTX: 0x800000a0,
  BURST: 0x8000001e,
  BUZZ: 0x800000a9,
  CCN: 0x80000013,
  CDN: 0x80000022,
  CDY: 0x80000479,
  CLAM: 0x80000017,
  CLUB: 0x8000004f,
  CMP: 0x80000047,
  CRAVE: 0x800000ba,
  CRW: 0x80000048,
  CRX: 0x80000060,
  DBIC: 0x80000068,
  DCR: 0x8000002a,
  DFC: 0x80000539,
  DGB: 0x80000014,
  DGC: 0x80000012,
  DLC: 0x80000066,
  DMD: 0x80000098,
  DNR: 0x80000074,
  DOGE: 0x80000003,
  DOPE: 0x80000035,
  DSH: 0x80000005,
  EC: 0x80000084,
  ECN: 0x80000073,
  EDRC: 0x80000038,
  EFL: 0x8000004e,
  ELLA: 0x800000a3,
  EMC2: 0x80000029,
  EOS: 0x800000c2,
  ERC: 0x80000097,
  ETC: 0x8000003d,
  ETH: 0x8000003c,
  EVO: 0x80000062,
  EXCL: 0x800000be,
  EXP: 0x80000028,
  FCT: 0x80000083,
  FJC: 0x8000004b,
  FLASH: 0x80000078,
  FRM: 0x800000c1,
  FRST: 0x800000a7,
  FTC: 0x80000008,
  GAME: 0x80000065,
  GB: 0x8000005e,
  GBX: 0x800000b0,
  GCR: 0x80000031,
  GRC: 0x80000054,
  GRS: 0x80000011,
  HMP: 0x80000071,
  HNC: 0x800000a8,
  HODL: 0x800007c5,
  HSR: 0x800000ab,
  HTML: 0x800000ac,
  HUSH: 0x800000c5,
  INSN: 0x80000044,
  IOP: 0x80000042,
  IXC: 0x80000056,
  JBS: 0x8000001a,
  KMD: 0x8000008d,
  KOTO: 0x800001fe,
  LBC: 0x8000008c,
  LCC: 0x800000c0,
  LCH: 0x800000bd,
  LDCN: 0x8000003f,
  LINX: 0x80000072,
  LSK: 0x80000086,
  LTC: 0x80000002,
  MARS: 0x8000006b,
  MBRS: 0x800000aa,
  MEM: 0x8000014d,
  MIX: 0x8000004c,
  MNX: 0x800000b6,
  MOIN: 0x80000027,
  MONA: 0x80000016,
  MTR: 0x8000005d,
  MUE: 0x8000001f,
  MUSIC: 0x800000b8,
  MXT: 0x800000b4,
  MZC: 0x8000000d,
  NANO: 0x80000100,
  NAV: 0x80000082,
  NBT: 0x8000000c,
  NEBL: 0x80000092,
  NEO: 0x80000378,
  NEOS: 0x80000019,
  NLC2: 0x80000095,
  NLG: 0x80000057,
  NMC: 0x80000007,
  NRC: 0x8000006e,
  NSR: 0x8000000b,
  NVC: 0x80000032,
  NXS: 0x80000043,
  NXT: 0x8000001d,
  NYC: 0x800000b3,
  ODN: 0x800000ad,
  OK: 0x80000045,
  OMNI: 0x800000c8,
  ONX: 0x800000ae,
  ORT: 0x80015b38,
  PART: 0x8000002c,
  PHR: 0x800001bc,
  PIGGY: 0x80000076,
  PINK: 0x80000075,
  PIRL: 0x800000a4,
  PIVX: 0x80000077,
  PKB: 0x80000024,
  PND: 0x80000025,
  POA: 0x800000b2,
  POT: 0x80000051,
  PPC: 0x80000006,
  PSB: 0x8000003e,
  PTC: 0x8000006d,
  PUT: 0x8000007a,
  QRK: 0x80000052,
  QTUM: 0x800008fd,
  QVT: 0x80000328,
  RAP: 0x80000141,
  RBY: 0x80000010,
  RDD: 0x80000004,
  RIC: 0x8000008f,
  RICHX: 0x80000050,
  RPT: 0x8000008b,
  RSK: 0x80000089,
  RVN: 0x800000af,
  SAFE: 0x80001a20,
  SBTC: 0x800022b8,
  SDC: 0x80000023,
  SH: 0x8000006a,
  SHM: 0x8000005f,
  SHR: 0x80000030,
  SLR: 0x8000003a,
  SMART: 0x800000e0,
  SMLY: 0x8000003b,
  SSN: 0x8000009e,
  STAK: 0x800000bb,
  START: 0x80000026,
  STEEM: 0x80000087,
  STO: 0x80000063,
  STRAT: 0x80000069,
  SYS: 0x80000039,
  TOA: 0x8000009f,
  TPC: 0x80000036,
  TRC: 0x80000053,
  UBQ: 0x8000006c,
  UC: 0x800000f7,
  UNIFY: 0x8000007c,
  UNO: 0x8000005c,
  USC: 0x80000070,
  VAR: 0x800000e9,
  VASH: 0x8000004a,
  VC: 0x8000007f,
  VIA: 0x8000000e,
  VIVO: 0x800000a6,
  VOX: 0x80000081,
  VPN: 0x80000021,
  VTC: 0x8000001c,
  WAN: 0x8057414e,
  WAVES: 0x80579bfc,
  WBTC: 0x800000bc,
  WC: 0x800000b5,
  WHL: 0x80000096,
  XBC: 0x80000041,
  XCH: 0x8000000f,
  XCP: 0x80000009,
  XEM: 0x8000002b,
  XLM: 0x80000094,
  XMR: 0x80000080,
  XMX: 0x800007b9,
  XMY: 0x8000005a,
  XPM: 0x80000018,
  XRB: 0x800000a5,
  XRD: 0x80000200,
  XRP: 0x80000090,
  XST: 0x8000007d,
  XUEZ: 0x800000e1,
  XVG: 0x8000004d,
  XWC: 0x8000009b,
  XZC: 0x80000088,
  ZCL: 0x80000093,
  ZEC: 0x80000085,
  ZEN: 0x80000079,
  ZNY: 0x8000007b,
  ZOOM: 0x80000020,
  ZRC: 0x8000001b,
  ZYD: 0x80000067
}

export default coinTypes
