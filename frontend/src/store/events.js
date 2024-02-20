
const EVENTS = '/events'
const SINGLE_EVENT = '/events/:eventId'



const allEvents = (events) => ({
    type: EVENTS,
    payload: events
})

const singleEvent = (event) => ({
    type:SINGLE_EVENT,
    payload: event
})





export const getAllEvents = () => async(dispatch) => {
    const res = await fetch('/api/events')

    const data = await res.json()
    dispatch(allEvents(data))

    return data

}

export const getSingleEvent = (id) => async(dispatch) => {
    const res = await fetch(`/api/events/${id}`)

    const data = await res.json()
    dispatch(singleEvent(data))

    return data
}


const initialState = { events: {} }

function eventReducer(state = initialState, action) {
    switch (action.type) {
        case EVENTS:
            return { ...state, events: action.payload}

        case SINGLE_EVENT:
            return {
                ...state,
                events: {
                    ...state.events, [action.payload.id]: action.payload
                }
            }

    default:
        return state
    }
}

export default eventReducer
