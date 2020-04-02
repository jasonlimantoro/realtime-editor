import { createSelector } from "reselect";
import moment from "moment";
import { AppState } from "src/modules/types";

const selectDrafts = (state: AppState) => state.draft.drafts;

const selectDraftsWithProps = (state: AppState, _props: any) =>
  selectDrafts(state);

export const selectDraftByDate = createSelector(selectDrafts, (state) => {
  const grouped = state.reduce((accum: any, current) => {
    const day = moment(Number(current._id)).format("YYYY-MM-DD");
    return {
      ...accum,
      [day]: accum[day]?.length > 0 ? accum[day].concat(current) : [current],
    };
  }, {});
  return grouped;
});

export const selectDraftCount = createSelector(
  selectDrafts,
  (state) => state.length
);
const propsForwarder = (_state: any, p: any) => p;

export const selectDraftById = createSelector(
  selectDraftsWithProps,
  propsForwarder,
  (state, { id }) => {
    const draft = state.find(({ _id }) => _id === id);
    return draft!;
  }
);
