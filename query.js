const snapshot = require('@snapshot-labs/snapshot.js');

const options = {
      address: '0x25ed58c027921E14D86380eA2646E3a1B5C55A8b',
      symbol: 'DEVS'
}

const network = '1';

const provider = snapshot.utils.getProvider(network);

const abi = [
  'function balanceOf(address account) external view returns (uint256)'
];
blockTag = 'latest';

module.exports = {
    async verify(addresses){
        return snapshot.utils.multicall(
                network,
                provider,
                abi,
                addresses.map((address) => [options.address, 'balanceOf', [address]]),
                { blockTag });
}   
}

