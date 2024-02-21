import Cookies from "js-cookie";



const EVENTS = '/events'
const ALL_EVENTS_VIA_GROUP = 'groups/:groupId/events'
const SINGLE_EVENT = '/events/:eventId'
const CREATE_EVENT = 'groups/:groupId/events'



const allEvents = (events) => ({
    type: EVENTS,
    payload: events
})
const allEventsViaGroupId = (events) => ({
    type: ALL_EVENTS_VIA_GROUP,
    payload: events
})

const singleEvent = (event) => ({
    type:SINGLE_EVENT,
    payload: event
})

const addEvent = (event) => ({
    type: CREATE_EVENT,
    payload: event
})





export const getAllEvents = () => async(dispatch) => {
    const res = await fetch('/api/events')

    const data = await res.json()
    dispatch(allEvents(data))

    return data

}

export const getAllEventsByGroupId = (id) => async(dispatch) => {
    const res = await fetch(`/api/groups/${id}/events`)

    const data = await res.json()
    dispatch(allEventsViaGroupId(data))
    return data
}

export const getSingleEvent = (id) => async(dispatch) => {
    const res = await fetch(`/api/events/${id}`)

    const data = await res.json()
    dispatch(singleEvent(data))

    return data
}

export const createAnEvent = (payload, id) => async(dispatch) => {

    const getCookie = () => {
        return Cookies.get("XSRF-TOKEN");
    };

    const res = await fetch(`/api/groups/${id}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'XSRF-TOKEN': getCookie()
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    console.log("🚀 ~ createAnEvent ~ data:", data)
    dispatch(addEvent(data))
    return data
}


const initialState = { events: {} }

function eventReducer(state = initialState, action) {
    switch (action.type) {
        case EVENTS:
            return { ...state, events: action.payload}

        case ALL_EVENTS_VIA_GROUP:
            return { ...state, events: action.payload}

        case SINGLE_EVENT:
            return {
                ...state,
                events: {
                    ...state.events, [action.payload.id]: action.payload
                }
            }

        case CREATE_EVENT:
        return{
            ...state,
            events: {
                ...state.events, [action.payload.id]:action.payload
            }
        }

    default:
        return state
    }
}

export default eventReducer
