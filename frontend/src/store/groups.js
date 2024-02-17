const GROUPS = '/groups'

const allGroups = (groups) => ({
    type: GROUPS,
    payload: groups
})

export const getAllGroups = () => async(dispatch) => {
    const res = await fetch('/api/groups')

    const data = await res.json();
    console.log("🚀 ~ getAllGroups ~ data:", data)
    dispatch(allGroups(data))
}


const initialState = { groups: {} };

function groupReducer(state = initialState, action) {
    switch (action.type) {
      case GROUPS:
        return { ...state, groups: action.payload };
      default:
        return state;
    }
  }

  export default groupReducer;
