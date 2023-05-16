
import {Axios} from "axios";

function getBaseURL() {
    return "http://127.0.0.1:5002"
}

function generateAPI() {
    axios.defaults.baseURL = getBaseURL()

    const target = Axios.create({
        baseURL: getBaseURL(),
        timeout: 30000
    })

    return target
}

export default {
    instance: generateAPI(),
    baseURL: getBaseURL()
}
