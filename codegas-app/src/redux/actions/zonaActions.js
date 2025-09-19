import {
    GET_ZONAS,
    CREATE_ZONA,
    UPDATE_ZONA,
    DELETE_ZONA
} from "./constants/actionsTypes";
import axios from "axios";

const getZonas = () => {
    return dispatch => {
        return axios
            .get("zon/zona")
            .then(res => {
                console.log("Zonas response:", res.data);
                if (res.data.status) {
                    dispatch({
                        type: GET_ZONAS,
                        zonas: res.data.zona
                    });
                    return { success: true, zonas: res.data.zona };
                } else {
                    console.log("Error in zonas response:", res.data);
                    return { success: false, error: "No status in response" };
                }
            })
            .catch(err => {
                console.log("Error getting zonas:", err);
                return { success: false, error: err.message };
            });
    };
};

const createZona = (nombre) => {
    return dispatch => {
        return axios
            .post("zon/zona/", { nombre })
            .then(res => {
                if (res.data.status) {
                    dispatch({
                        type: CREATE_ZONA,
                        zona: res.data.zonas
                    });
                    return { success: true, data: res.data.zonas };
                } else {
                    return { success: false, error: "Error creating zona" };
                }
            })
            .catch(err => {
                console.log("Error creating zona:", err);
                return { success: false, error: "Error creating zona" };
            });
    };
};

const updateZona = (id, nombre) => {
    return dispatch => {
        const data = { _id: id, nombre };
        return axios({
            method: 'put',
            url: "zon/zona",
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.data.status) {
                    dispatch({
                        type: UPDATE_ZONA,
                        zona: { _id: id, nombre }
                    });
                    return { success: true };
                } else {
                    return { success: false, error: "Error updating zona" };
                }
            })
            .catch(err => {
                console.log("Error updating zona:", err);
                return { success: false, error: "Error updating zona" };
            });
    };
};

const deleteZona = (id) => {
    return dispatch => {
        const data = { _id: id };
        return axios({
            method: 'put',
            url: "zon/zona",
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.data.status) {
                    dispatch({
                        type: DELETE_ZONA,
                        zonaId: id
                    });
                    return { success: true };
                } else {
                    return { success: false, error: "Error deleting zona" };
                }
            })
            .catch(err => {
                console.log("Error deleting zona:", err);
                return { success: false, error: "Error deleting zona" };
            });
    };
};

export {
    getZonas,
    createZona,
    updateZona,
    deleteZona
};
