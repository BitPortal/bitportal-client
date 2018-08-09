

// μs ms s min hrs day

const calculateIndex = (timeValue: any) => {
  if (timeValue < Math.pow(10, 6)*60) {
    return Math.floor(Math.log(timeValue)/Math.log(1000))
  } else if (timeValue >= Math.pow(10, 6)*Math.pow(60, 1) && timeValue < Math.pow(10, 6)*Math.pow(60, 2)) {
    return 3
  } else if (timeValue >= Math.pow(10, 6)*Math.pow(60, 2) && timeValue < Math.pow(10, 6)*Math.pow(60, 2)*24) {
    return 4
  } else {
    return 5
  }
}

const calculateFormatValue = (timeValue: any) => {
  if (timeValue < Math.pow(10, 6)*60) {
    return timeValue/Math.pow(1000, calculateIndex(timeValue))
  } else if (timeValue >= Math.pow(10, 6)*Math.pow(60, 1) && timeValue < Math.pow(10, 6)*Math.pow(60, 2)) {
    return timeValue/Math.pow(1000, 2)/Math.pow(60, 1)
  } else if (timeValue >= Math.pow(10, 6)*Math.pow(60, 2) && timeValue < Math.pow(10, 6)*Math.pow(60, 2)*24) {
    return timeValue/Math.pow(1000, 2)/Math.pow(60, 2)
  } else {
    return timeValue/Math.pow(1000, 2)/Math.pow(60, 2)/Math.pow(24, 1)
  }
}

export const formatCycleTime = (value: any) => {
  if (null == value || value == '') return '0.00 μs'
  const quoteArr = ['μs','ms','s','min','hrs','day']
  let index = 0, timeValue = parseFloat(value)
  index = calculateIndex(timeValue)
  const formatValue = calculateFormatValue(timeValue)
  if (formatValue.toString().split('.').length <= 1) {
    return formatValue.toFixed(2) + ' ' + quoteArr[index]
  } else {
    return formatValue.toString().split('.')[0] + '.' + formatValue.toString().split('.')[1].substring(0,2) + ' ' + quoteArr[index]
  }
}

export const formatMemorySize = (value: any) => {
  if (null == value || value == '') return '0.00 byte'
  const quoteArr = ['byte','KB','MB','GB','TB','PB','EB','ZB','YB']
  let index = 0, srcSize = parseFloat(value)
  index = Math.floor(Math.log(srcSize)/Math.log(1024))
  const size = srcSize/Math.pow(1024,index)
  if (size.toString().split('.').length <= 1) {
    return size.toFixed(2) + ' ' + quoteArr[index]
  } else {
    return size.toString().split('.')[0] + '.' + size.toString().split('.')[1].substring(0,2) + ' ' + quoteArr[index]
  }
}