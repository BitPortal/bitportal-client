import Images from 'resources/images'

export const DAPP_SECTIONS = [
  'FAVORITE',
  'SYSTEM',
  'GAME',
  'HIGH_RISK',
  'SOCIAL',
  'EXCHANGE',
  'MARKETPLACE',
  'TOOL',
  'EXPLORER',
  'NEWS',
  'OTHER'
]

export const DAPP_SECTION_ICONS = {
  all: { icon: Images.dapp_all, stringId: 'dapp_button_category_all' },
  high_risk: { icon: Images.dapp_high_risk_icon, stringId: 'dapp_label_high_risk_dapp' },
  system: { icon: Images.dapp_system, stringId: 'dapp_button_category_system' },
  game: { icon: Images.dapp_game, stringId: 'dapp_button_category_game' },
  exchange: { icon: Images.dapp_exchange, stringId: 'dapp_button_category_dex' },
  marketplace: { icon: Images.dapp_market, stringId: 'dapp_button_category_market' },
  tool: { icon: Images.dapp_tool, stringId: 'dapp_button_category_tool' },
  explorer: { icon: Images.dapp_browser, stringId: 'dapp_button_category_browser' },
  news: { icon: Images.dapp_news, stringId: 'dapp_button_category_news' },
  favorite: { icon: Images.dapp_favorite, stringId: 'dapp_list_label_favourite' },
  other: { icon: Images.dapp_other, stringId: 'dapp_list_label_other' }
}
