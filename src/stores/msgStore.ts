import { create } from 'zustand';

type MsgStore = {
    msg: string;
    isError: boolean;
    setMsg: (message: string, isError: boolean) => void;
}

const useMsgStore = create<MsgStore>((set) => ({
    msg: '',
    isError: false,
    setMsg: (message: string, isError: boolean) => set({ msg: message, isError: isError }),
}));

export default useMsgStore;
