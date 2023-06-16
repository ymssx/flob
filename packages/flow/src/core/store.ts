import Flob from ".";

interface Store {
  CURRENT_RUNNING_FLOW?: Flob<Object>;
}

export const store: Store = {
  CURRENT_RUNNING_FLOW: undefined,
};
