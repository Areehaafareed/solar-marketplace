// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch, action) => {
    dispatch({
      type: "updateUserInfoRequest",
    });
  };
