const fs = require('fs-extra')
const template = require('./template')
const swiftViewTemplate = template.swiftViewTemplate
const swiftViewManagerTemplate = template.swiftViewManagerTemplate
const objcViewManagerTemplate = template.objcViewManagerTemplate

const generateIOSViews = (name) => {
  fs.ensureFile(`./output/${name}/${name}.swift`, (error) => {
    if (error) throw error
    fs.writeFile(`./output/${name}/${name}.swift`, swiftViewTemplate(name), (error) => {
      if (error) throw error
      console.log(`./output/${name}/${name}.swift created!`)
    })
  })

  
  fs.ensureFile(`./output/${name}/${name}Manager.swift`, (error) => {
    if (error) throw error
    fs.writeFile(`./output/${name}/${name}Manager.swift`, swiftViewManagerTemplate(name), (error) => {
      if (error) throw error
      console.log(`./output/${name}/${name}Manager.swift created!`)
    })
  })

  
  fs.ensureFile(`./output/${name}/${name}Manager.m`, (error) => {
    if (error) throw error
    fs.writeFile(`./output/${name}/${name}Manager.m`, objcViewManagerTemplate(name), (error) => {
      if (error) throw error
      console.log(`./output/${name}/${name}Manager.m created!`)
    })
  })
}

const viewNames = [
  'AddAssets',
  'Asset',
  'TransferAsset',
  'ReceiveAsset',
  'WalletList',
  'SelectBridgeWallet',
  'ManageWallet',
  'Voting',
  'AddIdentity',
  'AuthorizeEOSAccount',
  'AuthorizeCreateEOSAccount',
  'MyIdentity',
  'CreateIdentity',
  'RecoverIdentity',
  'BackupIdentity',
  'SelectChainType',
  'ImportBTCWallet',
  'CreateEOSAccount',
  'ManageEOSResource',
  'ImportETHWallet',
  'ImportEOSWallet',
  'ImportChainxWallet',
  'ExportETHKeystore',
  'ExportETHPrivateKey',
  'ExportEOSPrivateKey',
  'ExportBTCPrivateKey',
  'ExportPCXPrivateKey',
  'SelectEOSAccount',
  'SwitchEOSAccount',
  'SwitchBTCAddress',
  'TransactionDetail',
  'ProducerDetail',
  'ChainXDeposit',
  'ChainXDepositClaim',
  'ChainXVoting',
  'ChainXValidatorDetail',
  'DappList',
  'Contacts',
  'Contact',
  'EditContact',
  'Browser',
  'Camera',
]

viewNames.forEach((name) => {
  generateIOSViews(name)
})

