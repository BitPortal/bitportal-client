const multiple = (position: number): number => (!position ? 1 : (10 * multiple(position - 1)))

export const roundDown = (value: number, decimal: number) => (value && (Math.floor(value * multiple(decimal)) / multiple(decimal)))

export const roundUp = (value: number, decimal: number) => (value && (Math.ceil(value * multiple(decimal)) / multiple(decimal)))

export const errorLoading = (err: string) => console.error('Dynamic page loading failed: ', err)

export const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

const loadedScripts: string[] = []

export const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (~loadedScripts.indexOf(src)) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = src
      script.addEventListener('load', () => {
        loadedScripts.push(src)
        resolve()
      })
      script.addEventListener('error', (e) => {
        reject(e)
      })
      document.head.appendChild(script)
    }
  })
}
