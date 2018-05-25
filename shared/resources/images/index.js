
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
  loading1:        require('./loading/1.png'),
  loading2:        require('./loading/2.png'),
  loading3:        require('./loading/3.png'),
  loading4:        require('./loading/4.png'),
  loading5:        require('./loading/5.png'),
  loading6:        require('./loading/6.png'),
  loading7:        require('./loading/7.png'),
  loading8:        require('./loading/8.png'),
  loading9:        require('./loading/9.png'),
  loading10:       require('./loading/10.png'),
  loading11:       require('./loading/11.png'),
  loading12:       require('./loading/12.png'),
  loading13:       require('./loading/13.png'),
  loading14:       require('./loading/14.png'),
  loading15:       require('./loading/15.png'),
  loading16:       require('./loading/16.png'),
  guide_bg:        require('./guide_bg.png'),
  guide_asset:  Platform.OS === 'ios' ? require('./guide_asset.png') : require('./guide_asset_android.png'),
  guide_asset_card:      require('./guide_asset_card.png'),
  guide_asset_title:     require('./guide_asset_title.png'),
  guide_market: Platform.OS === 'ios' ? require('./guide_market.png') : require('./guide_market_android.png'), 
  guide_market_card:     require('./guide_market_card.png'),
  guide_market_title:    require('./guide_market_title.png'),
  guide_discovery: Platform.OS === 'ios' ? require('./guide_discovery.png') : require('./guide_discovery_android.png'), 
  guide_discovery_card:  require('./guide_discovery_card.png'),
  guide_discovery_title: require('./guide_discovery_title.png')
}

export default Images