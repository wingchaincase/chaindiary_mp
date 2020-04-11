import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = {
  state: {
    publicKey: '',
    privateKey: '',
    key: '',
    send: '',
    memoryWord: '',
    dialryPublicKey: '',
    dialryPrivateKey: '',
    note: '',
    isNew: false,
  },
  mutations: {
    setPublicKey(state, publicKey) {
      state.publicKey = publicKey
    },
    setPrivateKey(state, privateKey) {
      state.privateKey = privateKey
    },
    setKey(state, key) {
      state.key = key
    },
    setSend(state, send) {
      state.send = send
    },
    setMemoryWord(state, memoryWord) {
      state.memoryWord = memoryWord
    },
    setDialryPublicKey(state, dialryPublicKey) {
      state.dialryPublicKey = dialryPublicKey
    },
    setDialryPrivateKey(state, dialryPrivateKey) {
      state.dialryPrivateKey = dialryPrivateKey
    },
    setNoteCall(state, note) {
      state.note = note
    },
    setIsNew(state, isNew) {
      state.isNew = isNew
    },
  },
  actions: {}
}


export default new Vuex.Store(store)