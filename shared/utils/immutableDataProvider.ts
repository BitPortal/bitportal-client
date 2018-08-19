import { typeOf } from 'utils'
import { DataProvider } from 'recyclerlistview'

export default class ImmutableDataProvider extends DataProvider {
  public rowHasChanged: (r1: any, r2: any) => boolean

  // In JS context make sure stable id is a string
  public getStableId: (index: number) => string
  private _firstIndexToProcess: number = 0
  private _size: number = 0
  private _data: any[] = []
  private _hasStableIds = false
  private _requiresDataChangeHandling = false

  constructor(rowHasChanged: (r1: any, r2: any) => boolean, getStableId?: (index: number) => string) {
    super(rowHasChanged, getStableId)
    this.rowHasChanged = rowHasChanged
    if (getStableId) {
      this.getStableId = getStableId
      this._hasStableIds = true
    } else {
      this.getStableId = (index) => index.toString()
    }
  }

  public getDataForIndex(index: number): any {
    return this._data.get(index)
  }

  public getAllData(): any[] {
    return this._data
  }

  public getSize(): number {
    return this._size
  }

  public hasStableIds(): boolean {
    return this._hasStableIds
  }

  public requiresDataChangeHandling(): boolean {
    return this._requiresDataChangeHandling
  }

  public getFirstIndexToProcessInternal(): number {
    return this._firstIndexToProcess
  }

  //No need to override this one
  //If you already know the first row where rowHasChanged will be false pass it upfront to avoid loop
  public cloneWithRows(newData: any[], firstModifiedIndex?: number): DataProvider {
    const dp = new ImmutableDataProvider(this.rowHasChanged, this.getStableId)
    const newSize = newData.size
    const iterCount = Math.min(this._size, newSize)

    if (typeOf(firstModifiedIndex) === 'Null' || typeOf(firstModifiedIndex) === 'Undefined') {
      let i = 0
      for (i = 0; i < iterCount; i++) {
        if (this.rowHasChanged(this._data.get(i), newData.get(i))) {
          break
        }
      }
      dp._firstIndexToProcess = i
    } else {
      dp._firstIndexToProcess = Math.max(Math.min(firstModifiedIndex, this._data.size), 0)
    }

    if (dp._firstIndexToProcess !== this._data.size) {
      dp._requiresDataChangeHandling = true
    }

    dp._data = newData
    dp._size = newSize
    return dp
  }
}
