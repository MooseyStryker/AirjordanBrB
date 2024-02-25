import Cookies from "js-cookie";


const ADD_IMAGE = '/events/:eventId/images'




const addImage = (image) => ({
    type: ADD_IMAGE,
    payload: image
})




export const addEventImage = (payload, eventId) => async(dispatch) => {



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
    if(res.ok){
        const data = await res.json()
        console.log("🚀 ~ addEventImage ~ data:", data)
        dispatch(addImage(data))
        return data
    } else {
        throw new Error('Failed to submit new event Image')

    }

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
