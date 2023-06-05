import Flow from ".";

interface Store {
  CURRENT_RUNNING_FLOW?: Flow<Object>;
}

export const store: Store = {
  CURRENT_RUNNING_FLOW: undefined,
};
