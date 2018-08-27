import { typeOf } from 'utils'
import { DataProvider } from 'recyclerlistview'
import { List } from 'immutable'

export default class ImmutableDataProvider extends DataProvider {
  public rowHasChanged: (r1: any, r2: any) => boolean

  // In JS context make sure stable id is a string
  public getStableId: (index: number) => string
  private _firstIndexToProcessImmutable: number = 0
  private _sizeImmutable: number = 0
  private _dataImmutable: List<any> = List([])
  private _hasStableIdsImmutable = false
  private _requiresDataChangeHandlingImmutable = false

  constructor(rowHasChanged: (r1: any, r2: any) => boolean, getStableId?: (index: number) => string) {
    super(rowHasChanged)
    this.rowHasChanged = rowHasChanged
    if (getStableId) {
      this.getStableId = getStableId
      this._hasStableIdsImmutable = true
    } else {
      this.getStableId = (index) => index.toString()
    }
  }

  public getDataForIndex(index: number): any {
    return this._dataImmutable.get(index)
  }

  public getAllData(): any {
    return this._dataImmutable
  }

  public getSize(): number {
    return this._sizeImmutable
  }

  public hasStableIds(): boolean {
    return this._hasStableIdsImmutable
  }

  public requiresDataChangeHandling(): boolean {
    return this._requiresDataChangeHandlingImmutable
  }

  public getFirstIndexToProcessInternal(): number {
    return this._firstIndexToProcessImmutable
  }

  // No need to override this one
  // If you already know the first row where rowHasChanged will be false pass it upfront to avoid loop
  public cloneWithRows(newData: any, firstModifiedIndex?: number): ImmutableDataProvider {
    const dp = new ImmutableDataProvider(this.rowHasChanged, this.getStableId)
    const newSize = newData.size
    const iterCount = Math.min(this._sizeImmutable, newSize)

    if (typeOf(firstModifiedIndex) === 'Null' || typeOf(firstModifiedIndex) === 'Undefined' || typeof firstModifiedIndex === 'undefined') {
      let i = 0
      for (i = 0; i < iterCount; i++) {
        if (this.rowHasChanged(this._dataImmutable.get(i), newData.get(i))) {
          break
        }
      }
      dp._firstIndexToProcessImmutable = i
    } else {
      dp._firstIndexToProcessImmutable = Math.max(Math.min(firstModifiedIndex, this._dataImmutable.size), 0)
    }

    if (dp._firstIndexToProcessImmutable !== this._dataImmutable.size) {
      dp._requiresDataChangeHandlingImmutable = true
    }

    dp._dataImmutable = newData
    dp._sizeImmutable = newSize
    return dp
  }
}
