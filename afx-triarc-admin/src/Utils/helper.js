
// get token of loggedIn user
export const getToken = () => {
	return localStorage.getItem("api_token");
};

// set session data in local storage
export const setSession = (token, id, role) => {
	localStorage.setItem("api_token", token);
	localStorage.setItem("profile_id", id);
	localStorage.setItem("role", role);
};

// remove session data from local storage
export const removeSession = () => {
	localStorage.removeItem("api_token");
	localStorage.removeItem("profile_id");
	localStorage.removeItem("role");
};