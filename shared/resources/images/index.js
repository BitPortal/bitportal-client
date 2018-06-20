
import { Platform } from 'react-native' 

const Images = {
  qrCode:          require('./qrCode.png'),
  asset:           require('./Asset.png'),
  asset_press:     require('./Asset_Press.png'),
  market:          require('./Market.png'),
  market_press:    require('./Market_Press.png'),
  profile:         require('./Profile.png'),
  profile_press:   require('./Profile_Press.png'),
  discovery:       require('./Discovery.png'),
  discovery_press: require('./Discovery_Press.png'),
  seperator:       require('./seperator.png'),
  logo:            require('./logo.png'),
  guide_bg:        require('./guide_bg.png'),
  guide_asset:  Platform.OS === 'ios' ? require('./guide_asset.png') : require('./guide_asset_android.png'),
  guide_asset_card:      require('./guide_asset_card.png'),
  guide_asset_title:     require('./guide_asset_title.png'),
  guide_market: Platform.OS === 'ios' ? require('./guide_market.png') : require('./guide_market_android.png'), 
  guide_market_card:     require('./guide_market_card.png'),
  guide_market_title:    require('./guide_market_title.png'),
  guide_discovery: Platform.OS === 'ios' ? require('./guide_discovery.png') : require('./guide_discovery_android.png'), 
  guide_discovery_card:  require('./guide_discovery_card.png'),
  guide_discovery_title: require('./guide_discovery_title.png'),
  eyes_close: require('./eyes_close.png'),
  eyes_open:  require('./eyes_open.png')
}

export default Images