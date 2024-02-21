import Cookies from "js-cookie";


const ADD_IMAGE = '/events/:eventId/images'




const addImage = (image) => ({
    type: ADD_IMAGE,
    payload: image
})




export const addEventImage = (payload, eventId) => async(dispatch) => {
console.log("🚀 ~ addEventImage ~ eventId:", eventId)
console.log("🚀 ~ addEventImage ~ payload:", payload)


    const getCookie = () => {
        return Cookies.get("XSRF-TOKEN");
    };

    const res = await fetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'XSRF-TOKEN': getCookie()
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    dispatch(addImage(data))
    return data
}



const initialState = { eventimages: {} }

function eventImageReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_IMAGE:
            return {
                ...state,
                eventimages: {
                    ...state.eventimages, [action.payload.id]: action.payload
                }
            }

        default:
            return state
    }
}

export default eventImageReducer
