const fs = require('fs-extra')
const template = require('./template')
const swiftViewTemplate = template.swiftViewTemplate
const swiftViewManagerTemplate = template.swiftViewManagerTemplate
const objcViewManagerTemplate = template.objcViewManagerTemplate
const jsViewTemplate = template.jsViewTemplate

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

const pathMap = {
  Wallet: 'screens/Wallet',
  Profile: 'screens/Profile',
  Market: 'screens/Market',
  Discovery: 'screens/Discovery',
  Language: 'screens/Language',
  AddAssets: 'screens/AddAssets',
  Asset: 'screens/Asset',
  TransferAsset: 'screens/TransferAsset',
  ReceiveAsset: 'screens/ReceiveAsset',
  WalletList: 'screens/WalletList',
  SelectBridgeWallet: 'screens/SelectBridgeWallet',
  ManageWallet: 'screens/ManageWallet',
  Voting: 'screens/Voting',
  AddIdentity: 'screens/AddIdentity',
  AuthorizeEOSAccount: 'screens/AuthorizeEOSAccount',
  AuthorizeCreateEOSAccount: 'screens/AuthorizeCreateEOSAccount',
  MyIdentity: 'screens/MyIdentity',
  CreateIdentity: 'screens/CreateIdentity',
  RecoverIdentity: 'screens/RecoverIdentity',
  BackupIdentity: 'screens/BackupIdentity',
  SelectChainType: 'screens/SelectChainType',
  ImportBTCWallet: 'screens/ImportBTCWallet',
  CreateEOSAccount: 'screens/CreateEOSAccount',
  ManageEOSResource: 'screens/ManageEOSResource',
  ImportETHWallet: 'screens/ImportETHWallet',
  ImportEOSWallet: 'screens/ImportEOSWallet',
  ImportChainxWallet: 'screens/ImportChainxWallet',
  ExportETHKeystore: 'screens/ExportETHKeystore',
  ExportETHPrivateKey: 'screens/ExportETHPrivateKey',
  ExportEOSPrivateKey: 'screens/ExportEOSPrivateKey',
  ExportBTCPrivateKey: 'screens/ExportBTCPrivateKey',
  ExportPCXPrivateKey: 'screens/ExportPCXPrivateKey',
  SelectEOSAccount: 'screens/SelectEOSAccount',
  SwitchEOSAccount: 'screens/SwitchEOSAccount',
  SwitchBTCAddress: 'screens/SwitchBTCAddress',
  TransactionDetail: 'screens/TransactionDetail',
  ProducerDetail: 'screens/ProducerDetail',
  ChainXDeposit: 'screens/ChainX/Deposit',
  ChainXDepositClaim: 'screens/ChainX/Deposit/Claim',
  ChainXVoting: 'screens/ChainX/Voting',
  ChainXValidatorDetail: 'screens/ChainX/Voting/ValidatorDetail',
  DappList: 'screens/Discovery/DappList',
  Contacts: 'screens/Contacts',
  Contact: 'screens/Contact',
  EditContact: 'screens/EditContact',
  Currency: 'screens/Currency',
  Browser: 'screens/Browser',
  Camera: 'screens/Camera'
}

const generateJSViews = (name) => {
  fs.ensureFile(`shared/${pathMap(name)}/${name}View.js`, (error) => {
    if (error) throw error
    fs.writeFile(`shared/${pathMap(name)}/${name}View.js`, jsViewTemplate(name), (error) => {
      if (error) throw error
      console.log(`shared/${pathMap(name)}/${name}View.js created!`)
    })
  })
}

viewNames.forEach((name) => {
  generateJSViews(name)
})

