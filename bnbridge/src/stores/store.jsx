import bnbClient from '@binance-chain/javascript-sdk';
import WalletConnect from "@walletconnect/browser";
import fetch from 'node-fetch';
import config from "../config";
import FileSaver from 'file-saver';
import {
  ERROR,
  GET_TOKENS,
  TOKENS_UPDATED,
  GET_FEES,
  FEES_UPDATED,
  ISSUE_TOKEN,
  TOKEN_ISSUED,
  FINALIZE_TOKEN,
  TOKEN_FINALIZED,
  SWAP_TOKEN,
  TOKEN_SWAPPED,
  FINALIZE_SWAP_TOKEN,
  TOKEN_SWAP_FINALIZED,
  SUBMIT_LIST_PROPOSAL,
  LIST_PROPOSAL_SUBMITTED,
  FINALIZE_LIST_PROPOSAL,
  LIST_PROPOSAL_FINALIZED,
  LIST_TOKEN,
  TOKEN_LISTED,
  GET_LIST_PROPOSAL,
  LIST_PROPOSAL_UPDATED,
  GET_BNB_BALANCES,
  BNB_BALANCES_UPDATED,
  GET_ETH_BALANCES,
  ETH_BALANCES_UPDATED,
  CREATE_BNB_ACCOUNT,
  BNB_ACCOUNT_CREATED,
  GET_ERC20_INFO,
  ERC20_INFO_UPDATED,
  DOWNLOAD_BNB_KEYSTORE,
  BNB_KEYSTORE_DOWNLOADED,
  SET_WALLET,
  WALLET_UPDATED,
  REQUST_WALLET_CONNECT,
  RETURN_WALLET_URI,
  CLOSE_WALLET_CONNECT_MODAL,
} from '../constants'
const crypto = require('crypto');
const bip39 = require('bip39');
const sha256 = require('sha256');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const apiUrl = config.apiUrl;

function encrypt(data, url) {
  const signJson = JSON.stringify(data);
  const signMnemonic = bip39.generateMnemonic();
  const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
  const signEncrypted =
    cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
  var signData = {
    e: signEncrypted.hexEncode(),
    m: signMnemonic.hexEncode(),
    u: sha256(url).toUpperCase(),
    p: sha256(sha256(url).toUpperCase()).toUpperCase(),
    t: new Date().getTime()
  };
  const signSeed = JSON.stringify(signData);
  const signSignature = sha256(signSeed);
  signData.s = signSignature;
  return JSON.stringify(signData);
}

/* eslint-disable */
String.prototype.hexEncode = function () {
  var hex, i;
  var result = '';
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }
  return result;
};
/* eslint-enable */

class Store {
  constructor() {
    const storage = JSON.parse(sessionStorage.getItem('user'));

    this.store = {
      tokens: [],
      fees: [],
      wallet: {},
      ...storage,
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_TOKENS:
            this.getTokens(payload);
            break;
          case GET_FEES:
            this.getFees(payload);
            break;
          case ISSUE_TOKEN:
            this.issueToken(payload);
            break;
          case FINALIZE_TOKEN:
            this.finalizeToken(payload);
            break;
          case SWAP_TOKEN:
            this.swapToken(payload);
            break;
          case FINALIZE_SWAP_TOKEN:
            this.finalizeSwapToken(payload);
            break;
          case LIST_TOKEN:
            this.listToken(payload);
            break;
          case SUBMIT_LIST_PROPOSAL:
            this.submitListProposal(payload);
            break;
          case FINALIZE_LIST_PROPOSAL:
            this.finalizeListProposal(payload);
            break;
          case GET_LIST_PROPOSAL:
            this.getListProposalStatus(payload);
            break;
          case GET_BNB_BALANCES:
            this.getBNBBalances(payload);
            break;
          case GET_ETH_BALANCES:
            this.getETHBalances(payload);
            break;
          case CREATE_BNB_ACCOUNT:
            this.createAccountBNB(payload);
            break;
          case DOWNLOAD_BNB_KEYSTORE:
            this.downloadKeystoreBNB(payload);
            break;
          case GET_ERC20_INFO:
            this.getERC20Info(payload);
            break;
          case SET_WALLET:
            this.setWallet(payload);
            break;
          case REQUST_WALLET_CONNECT:
            this.connectWallet(payload);
          default: {
          }
        }
      }.bind(this)
    );

    this.bncClient = new bnbClient(config.binanceUrl)
    this.rpcClient = new bnbClient.rpc(config.binanceRpcUrl, config.network)
    this.walletConnector = new WalletConnect({
      bridge: config.wcBridgeUrl
    })
    this.walletConnector.on('connect', (err, payload) => {
      console.log('connected')
      if (err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      console.log(payload)
      emitter.emit(CLOSE_WALLET_CONNECT_MODAL, {})
    })
  }

  async setPrivateKey(privateKey) {
    await this.bncClient.setPrivateKey(privateKey)
    this.bncClient.useDefaultSigningDelegate()
    this.bncClient.useDefaultBroadcastDelegate()
    await this.bncClient.initChain()
  };

  getStore(index) {
    return this.store[index]
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    sessionStorage.setItem('user', JSON.stringify(this.store))
    return emitter.emit('StoreUpdated')
  };

  setWallet(payload) {
    this.setStore({ wallet: payload.wallet })
    emitter.emit(WALLET_UPDATED, payload.wallet)
  };

  connectWallet(payload) {
    this.walletConnector.createSession()
      .then(() => {
        const uri = store.walletConnector.uri

        emitter.emit(RETURN_WALLET_URI, uri)
      })
      .catch(err => {
        console.log('wallet connect error : ', err)
        emitter.emit(ERROR, err)
      })
  };

  async getTokenInfo(symbol) {
    try {
      const tokenInfo = await this.rpcClient.getTokenInfo(symbol)

      return tokenInfo
    } catch (e) {
      return null
    }
  }

  async getAddressBalances(address) {
    try {
      const balances = await this.bncClient._httpClient.get(`/api/v1/account/${address}`);
      const assetBalances = balances.result.balances

      return assetBalances
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getTokenMarket(symbol) {
    try {
      const markets = await this.bncClient._httpClient.get(`/api/v1/markets`);
      let marketStatus = markets.result.find((market) => {
        return market['base_asset_symbol'] === symbol ? true : false
      })

      return marketStatus
    } catch (e) {
      return e.message
    }
  }

  getTokens(payload) {
    const url = "/api/v1/tokens"
    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      // console.log(data)
      this.setStore({ tokens: data.result })
      emitter.emit(TOKENS_UPDATED);
    });
  };

  getFees(payload) {
    const url = "/api/v1/fees"
    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      this.setStore({ fees: data.result })
      emitter.emit(FEES_UPDATED);
    });
  };

  issueToken(payload) {
    const url = "/api/v1/tokens"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(TOKEN_ISSUED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  finalizeToken(payload) {
    const url = "/api/v1/finalizeToken"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(TOKEN_FINALIZED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  swapToken(payload) {
    const url = "/api/v1/swaps"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(TOKEN_SWAPPED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  finalizeSwapToken(payload) {
    const url = "/api/v1/finalizeSwap"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(TOKEN_SWAP_FINALIZED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  listToken(payload) {
    const url = "/api/v1/lists"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(TOKEN_LISTED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  submitListProposal(payload) {
    const url = "/api/v1/listProposals"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(LIST_PROPOSAL_SUBMITTED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };
  finalizeListProposal(payload) {
    const url = "/api/v1/finalizeListProposal"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(LIST_PROPOSAL_FINALIZED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };

  getListProposal(payload) {
    const url = "/api/v1/listProposals/"+payload.content.uuid
    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit(LIST_PROPOSAL_UPDATED, data.result);
    });
  };

  getListProposalStatus(payload) {
    console.log('payload : ', payload)
    const url = `/api/v1/listProposalStatus/${payload.content.address}/${payload.content.symbol}`
    console.log('url : ', url)
    this.callApi(url, 'GET', null, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      console.log('data : ', data.result)
      emitter.emit(LIST_PROPOSAL_UPDATED, data.result);
    });
  };

  getBNBBalances(payload) {
    const url = "/api/v1/getBnbBalances"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      if(data.success) {
        emitter.emit(BNB_BALANCES_UPDATED, data.result);
      } else if (data.errorMsg) {
        emitter.emit(ERROR, data.errorMsg);
      } else {
        emitter.emit(ERROR, data.result);
      }
    });
  };

  getETHBalances(payload) {
    const url = "/api/v1/getEthBalances"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit(ETH_BALANCES_UPDATED, data.result);
    });
  };

  createAccountBNB(payload) {
    const url = "/api/v1/createAccountBNB"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit(BNB_ACCOUNT_CREATED, data.result);
    });
  };

  downloadKeystoreBNB(payload) {
    this.downloadKeystoreFile(payload.content.clientId, payload.content.keystore, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit(BNB_KEYSTORE_DOWNLOADED, data.result);
    });
  };

  getERC20Info(payload) {
    const url = "/api/v1/getERC20Info"
    this.callApi(url, 'POST', payload.content, payload, (err, data) => {
      if(err) {
        console.log(err)
        emitter.emit(ERROR, err);
        return
      }

      emitter.emit(ERC20_INFO_UPDATED, data.result);
    });
  }

  callApi = function (url, method, postData, payload, callback) {
    const call = apiUrl + url;

    if (method === 'GET') {
      postData = null;
    } else {
      console.log(postData)
      postData = encrypt(postData, url);
    }

    fetch(call, {
      method: method,
      body: postData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + config.apiToken,
      }
    })
      .then(res => {
        if (res.status === 401) {
          return emitter.emit('Unauthorised', null, null);
        }

        if (res.status === 400) {
          return res.json()
        }

        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then(res => {
        callback(null, res)
      })
      .catch(error => {
        console.log(error)
        callback(error, null)
      });
  };

  downloadFile = function (url, postData, callback) {
    const call = apiUrl + url;

    postData = encrypt(postData, url);

    fetch(call, {
      method: "POST",
      body: postData,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + config.apiToken,
      }
    })
    .then((response) => response.blob())
    .then(function(blob) {

      const fr = new FileReader();

      fr.onload = function() {
          console.log(JSON.parse(this.result))
          const response = JSON.parse(this.result)
    
          FileSaver.saveAs(blob, response.id+'_keystore.json');

          callback(null, response)
      };

      fr.readAsText(blob);
    })
  };

  downloadKeystoreFile = function (id, data, callback) {
    const fr = new FileReader();

    const blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"})

    fr.onload = function() {
      const response = JSON.parse(this.result)
      FileSaver.saveAs(blob, id+'_keystore.json');
      callback(null, response)
    };

    fr.readAsText(blob);
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
