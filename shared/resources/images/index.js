import { Platform } from 'react-native'

const Images = {
  qrCode: require('./qrCode.png'),
  asset: require('./Asset.png'),
  asset_press: require('./Asset_Press.png'),
  market: require('./Market.png'),
  market_press: require('./Market_Press.png'),
  profile: require('./Profile.png'),
  profile_press: require('./Profile_Press.png'),
  discovery: require('./Discovery.png'),
  discovery_press: require('./Discovery_Press.png'),
  about_logo: require('./About_logo.png'),
  guide_bg: require('./guide_bg.png'),
  guide_asset:
    Platform.OS === 'ios'
      ? require('./guide_asset.png')
      : require('./guide_asset_android.png'),
  guide_asset_card: require('./guide_asset_card.png'),
  guide_asset_title: require('./guide_asset_title.png'),
  guide_market:
    Platform.OS === 'ios'
      ? require('./guide_market.png')
      : require('./guide_market_android.png'),
  guide_market_card: require('./guide_market_card.png'),
  guide_market_title: require('./guide_market_title.png'),
  guide_discovery:
    Platform.OS === 'ios'
      ? require('./guide_discovery.png')
      : require('./guide_discovery_android.png'),
  guide_discovery_card: require('./guide_discovery_card.png'),
  guide_discovery_title: require('./guide_discovery_title.png'),
  eyes_close: require('./eyes_close.png'),
  eyes_open: require('./eyes_open.png'),
  default_icon: require('./default_icon.png'),
  profile_about: require('./Profile_About.png'),
  profile_voting: require('./Profile_Voting.png'),
  profile_contacts: require('./Profile_Contacts.png'),
  profile_account: require('./Profile_Account.png'),
  profile_settings: require('./Profile_Settings.png'),
  profile_mediafax: require('./Profile_Mediafax.png'),
  profile_resources: require('./Profile_Resources.png'),
  about_wechat: require('./About_Wechat.png'),
  about_telegram: require('./About_Telegram.png'),
  about_kakao: require('./About_Kakao.png'),
  about_twitter: require('./About_Twitter.png'),
  about_facebook: require('./About_Facebook.png'),
  about_weibo: require('./About_Weibo.png'),
  transaction_history: require('./transaction_history.png'),
  transfer_sender: require('./transfer_sender.png'),
  transfer_receiver: require('./transfer_receiver.png'),
  EOSIcon: require('./EOSIcon.png'),
  tips: require('./tips.png'),
  coin_logo_default: require('./coin_logo_default.png'),
  help_center: require('./Profile_Help.png'),
  backup_group: require('./Backup_Group.png'),
  list_add: require('./list_add.png'),
  list_remove: require('./list_remove.png'),
  discovery_more: require('./Discovery_more.jpg'),
  list_favorite: require('./list_favorite.png'),
  sign_agreement: require('./agreement_sign.png'),
  unsign_agreement: require('./agreement_unsign.png')
}

export const assetIcons = {
  bitcoin: require('./btc_icon.png'),
  ethereum: require('./eth_icon.png'),
  eos: require('./eos_icon.png')
}

export const walletIcons = {
  bitcoin: require('./BTCWallet.png'),
  ethereum: require('./ETHWallet.png'),
  eos: require('./EOSWallet.png')
}

export const chainIcons = {
  bitcoin: require('./bitcoin_logo.png'),
  ethereum: require('./ethereum_logo.png'),
  eos: require('./eos_logo.png')
}

export default Images
