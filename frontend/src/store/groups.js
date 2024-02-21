import Cookies from "js-cookie";




const GROUPS = '/groups'
const SINGLE_GROUP = '/groups/:groupId'
const ADD_GROUP ='/groups/new'
const EDIT_GROUP = '/groups/:groupId/edit'
const REMOVE_GROUP = '/groups/:groupId'


const allGroups = (groups) => ({
    type: GROUPS,
    payload: groups
})
const singleGroup = (group) => ({
    type: SINGLE_GROUP,
    payload: group
})

const addGroup = (group) => ({
    type: ADD_GROUP,
    payload: group
})
const editGroup = (group) => ({
    type: EDIT_GROUP,
    payload: group
})
const removeGroup = (group) => ({
    type: REMOVE_GROUP,
    payload: group
})






export const getAllGroups = () => async(dispatch) => {
    const res = await fetch('/api/groups')
    if (!res.ok) {
        throw new Error('Failed to getAllGroups')
    }
    const data = await res.json();
    dispatch(allGroups(data))
}

export const getSingleGroup = (id) => async(dispatch) => {
    const res = await fetch(`/api/groups/${id}`)

    if (!res.ok) {
        throw new Error('Failed to getSingleGroup')
    }

    const data = await res.json()

    dispatch(singleGroup(data))
}


export const submitNewGroup = (payload) => async(dispatch) => {
    const getCookie = () => {
        return Cookies.get("XSRF-TOKEN");
    };

    const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'XSRF-TOKEN': getCookie()
        },
        body: JSON.stringify(payload)
    })
    if (!res.ok) {
        const data = await res.json()
        if (data?.errors) {
            throw new Error('Failed to submit new group')
        }
        throw new Error('Failed to submit new group')
    }
    const data  = await res.json()
    dispatch(addGroup(data))
    return data
}


export const editThisGroup = (payload, id) => async(dispatch) => {
    const getCookie = () => {
        return Cookies.get("XSRF-TOKEN");
    };

    const res = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'XSRF-TOKEN': getCookie()
        },
        body: JSON.stringify(payload)
    })
    if (!res.ok) {
        const data = await res.json()
        if (data?.errors) {
            throw new Error('Failed to submit new group')
        }
        throw new Error('Failed to submit new group')
    }
    const data  = await res.json()
    dispatch(editGroup(data))
    return data
}

export const deleteGroup = ({ id }) => {
    const getCookie = () => {
        return Cookies.get("XSRF-TOKEN");
    }

    return async (dispatch) => {
      const response = await fetch(`/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'XSRF-TOKEN': getCookie()
        },
      })
      if (response.ok) {
        dispatch(removeGroup(id))
      } else {
        throw new Error('Failed to delete new group')
      }
    }
  }


const initialState = { groups: {} };

function groupReducer(state = initialState, action) {
    switch (action.type) {
        case GROUPS:
            return { ...state, groups: action.payload };
        case SINGLE_GROUP:
         return {
            ...state,
            groups: {
                ...state.groups, [action.payload.id]: action.payload
            }
         }
        case ADD_GROUP:
            return {
                ...state,
                groups: {...state.groups, [action.payload.id]: action.payload}
            }
        case EDIT_GROUP:
            return {
                ...state,
                groups: {
                    ...state.groups, [action.payload.id]: action.payload
                }
            }
            case REMOVE_GROUP: {
                const newState = { ...state };
                delete newState.groups[action.reportId];
                return newState;
              }
      default:
        return state;
    }
}

  export default groupReducer;
