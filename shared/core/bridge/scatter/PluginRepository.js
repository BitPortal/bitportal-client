import * as PluginTypes from './PluginTypes';
import EOS from './eos';

/***
 * Setting up for plugin based generators,
 * this will add more blockchain compatibility in the future.
 */

class PluginRepositorySingleton {
  constructor(){
    this.plugins = [];
    this.loadPlugins();
  }

  loadPlugins(){
    this.plugins.push(new EOS());
  }

  signatureProviders(){
    return this.plugins.filter(plugin => plugin.type === PluginTypes.BLOCKCHAIN_SUPPORT);
  }

  supportedBlockchains(){
    return this.signatureProviders().map(() => name)
  }

  plugin(name){
    return this.plugins.find(plugin => plugin.name === name);
  }

  async endorsedNetworks(){
    return Promise.all(this.signatureProviders().map(async plugin => plugin.getEndorsedNetwork()));
  }
}

const PluginRepository = new PluginRepositorySingleton();
export default PluginRepository;
