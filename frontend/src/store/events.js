
const EVENTS = '/events'

const allEvents = (events) => ({
    type: EVENTS,
    payload: events
})





export const getAllEvents = () => async(dispatch) => {
    const res = await fetch('/api/events')

    const data = await res.json()
    dispatch(allEvents(data))

    return data

}


const initialState = { events: {} }

function eventReducer(state = initialState, action) {
    switch (action.type) {
        case EVENTS:
            return { ...state, events: action.payload}

    default:
        return state
    }
}

export default eventReducer
