import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C'
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    color: '#d7d7d7',
    textAlign: 'left'
  },
  options: {
    margin: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  searchBar: {
    backgroundColor: '#373739',
    padding: 10,
    borderRadius: 8,
    width: '50%'
  },
  textInput: {
    color: '#959499',
    fontSize: 18
  },
  filter: {
    color: '#959499',
    fontSize: 16
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#484848',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  listItemSide: {
    marginRight: 20,
    paddingTop: 4,
    flex: 1
  },
  listItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 15
  },
  listItemMainCoin: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5
  },
  listItemMainMarketSize: {
    fontSize: 12,
    color: '#a2a29f'
  },
  listItemMainPrice: {
    color: '#61be79',
    fontSize: 18,
    marginBottom: 5
  },
  listItemMainChange: {
    fontSize: 12,
    color: '#5bab3a'
  },
  listItemRight: {
    alignItems: 'flex-end'
  }
})

export default styles
