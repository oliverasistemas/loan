import { Client, registry, MissingWalletError } from 'loan-client-ts'

import { Loan } from "loan-client-ts/loan.loan/types"
import { Params } from "loan-client-ts/loan.loan/types"


export { Loan, Params };

function initClient(vuexGetters) {
	return new Client(vuexGetters['common/env/getEnv'], vuexGetters['common/wallet/signer'])
}

function mergeResults(value, next_values) {
	for (let prop of Object.keys(next_values)) {
		if (Array.isArray(next_values[prop])) {
			value[prop]=[...value[prop], ...next_values[prop]]
		}else{
			value[prop]=next_values[prop]
		}
	}
	return value
}

type Field = {
	name: string;
	type: unknown;
}
function getStructure(template) {
	let structure: {fields: Field[]} = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field = { name: key, type: typeof value }
		structure.fields.push(field)
	}
	return structure
}
const getDefaultState = () => {
	return {
				Params: {},
				Loan: {},
				LoanAll: {},
				
				_Structure: {
						Loan: getStructure(Loan.fromPartial({})),
						Params: getStructure(Params.fromPartial({})),
						
		},
		_Registry: registry,
		_Subscriptions: new Set(),
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(JSON.stringify(subscription))
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(JSON.stringify(subscription))
		}
	},
	getters: {
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getLoan: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Loan[JSON.stringify(params)] ?? {}
		},
				getLoanAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.LoanAll[JSON.stringify(params)] ?? {}
		},
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: loan.loan initialized!')
			if (rootGetters['common/env/client']) {
				rootGetters['common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach(async (subscription) => {
				try {
					const sub=JSON.parse(subscription)
					await dispatch(sub.action, sub.payload)
				}catch(e) {
					throw new Error('Subscriptions: ' + e.message)
				}
			})
		},
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.LoanLoan.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryLoan({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.LoanLoan.query.queryLoan( key.id)).data
				
					
				commit('QUERY', { query: 'Loan', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryLoan', payload: { options: { all }, params: {...key},query }})
				return getters['getLoan']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryLoan API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryLoanAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.LoanLoan.query.queryLoanAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.LoanLoan.query.queryLoanAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'LoanAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryLoanAll', payload: { options: { all }, params: {...key},query }})
				return getters['getLoanAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryLoanAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgCancelLoan({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.LoanLoan.tx.sendMsgCancelLoan({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelLoan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCancelLoan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgApproveLoan({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.LoanLoan.tx.sendMsgApproveLoan({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgApproveLoan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgApproveLoan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgLiquidateLoan({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.LoanLoan.tx.sendMsgLiquidateLoan({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLiquidateLoan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgLiquidateLoan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRequestLoan({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.LoanLoan.tx.sendMsgRequestLoan({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRequestLoan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRequestLoan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRepayLoan({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const result = await client.LoanLoan.tx.sendMsgRepayLoan({ value, fee: {amount: fee, gas: "200000"}, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRepayLoan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRepayLoan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgCancelLoan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.LoanLoan.tx.msgCancelLoan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelLoan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCancelLoan:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgApproveLoan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.LoanLoan.tx.msgApproveLoan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgApproveLoan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgApproveLoan:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgLiquidateLoan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.LoanLoan.tx.msgLiquidateLoan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLiquidateLoan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgLiquidateLoan:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRequestLoan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.LoanLoan.tx.msgRequestLoan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRequestLoan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRequestLoan:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRepayLoan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.LoanLoan.tx.msgRepayLoan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRepayLoan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRepayLoan:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}
