import Colors from 'resources/colors'



export const ping = (url: string) => new Promise((resolve) => {
  const date1 = +Date.now()
  fetch(url)
  .then((response) => response.json())
  .then(() => { 
    const date2 = +Date.now()
    resolve(date2-date1)
  })
  .catch(() => { 
    resolve(9999)
  })
  
})

export const pingStatus = (value: any) => {
  if (!value) {
    return { color: Colors.textColor_107_107_107, value: '--' } 
  } else if (value > 0 && value <= 200) {
    return { color: Colors.greenSpeed, value }
  } else if (value > 200 && value <= 500) {
    return { color: Colors.yellowSpeed, value }
  } else if (value > 500 && value <= 999) {
    return { color: Colors.redSpeed, value }
  } else if (value === 9999) {
    return { color: Colors.textColor_107_107_107, value: '--' } 
  } else {
    return { color: Colors.redSpeed, value: '999+' }
  }
}