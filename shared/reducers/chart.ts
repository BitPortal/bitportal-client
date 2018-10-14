import Immutable from "immutable";
import { handleActions } from "redux-actions";
import * as actions from "actions/chart";
import { CHART_RANGES, RANGE_TO_CHART_TYPE } from "constants/chart";

const initialState = Immutable.fromJS({
  data: { histominute: [], histohour: [], histoday: [] },
  loading: false,
  loaded: false,
  error: null,
  range: CHART_RANGES["1M"],
  chartType: RANGE_TO_CHART_TYPE["1M"]
});

export default handleActions(
  {
    [actions.getChartRequested](state) {
      return state.set("loading", true);
    },
    [actions.getChartSucceeded](state, action) {
      return state
        .set("loaded", true)
        .set("loading", false)
        .setIn(
          ["data", action.payload.chartType],
          Immutable.fromJS(action.payload.data)
        );
    },
    [actions.getChartFailed](state, action) {
      return state.set("error", action.payload).set("loading", false);
    },
    [actions.changeChartRange](state, action) {
      return state
        .set("range", Immutable.fromJS(action.payload))
        .set(
          "chartType",
          Immutable.fromJS(RANGE_TO_CHART_TYPE[action.payload])
        );
    },
    [actions.clearChart](state, action) {
      return state.set(
        "data",
        Immutable.fromJS({ histominute: [], histohour: [], histoday: [] })
      );
    }
  },
  initialState
);
