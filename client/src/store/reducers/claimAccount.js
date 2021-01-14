const SHOW_CLAIM_ACCOUNT = "SHOW_CLAIM_ACCOUNT";
const HIDE_CLAIM_ACCOUNT = "HIDE_CLAIM_ACCOUNT";

const claimAccountReducer = (state = false, action) => {
    switch (action.type) {
        case SHOW_CLAIM_ACCOUNT:
            return true;
        case HIDE_CLAIM_ACCOUNT:
            return false;
        default:
            return state;
    }
};

export default claimAccountReducer;
