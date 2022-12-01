const Web3 = require("web3");

const SAFETRANSFERFROM_METHODID = "0xb88d4fde";
const ERC721_TRANSFER_EVENT_HASH = Web3.utils.keccak256(
	"Transfer(address,address,uint256)"
);
const ERC1155_TRANSFER_EVENT_HASH = Web3.utils.keccak256(
	"TransferSingle(address,address,address,uint256,uint256)"
);
const ERC1155_BATCH_TRANSFER_EVENT_HASH = Web3.utils.keccak256(
	"TransferBatch(address,address,address,uint256[],uint256[])"
);

const IPFS_REGEX = /^ipfs:\/\//gm;
const NULL_ADDRESS = "0x0";

const CHAINS_CONFIG = {
	STARK: {
		chainId: "80001",
		chainName: "Mumbai",
		nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
		websocketRpcUrl:
			"https://starknet-goerli.infura.io/v3/cbabb2e79d6d4058816544b594e25341",
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
};

module.exports = {
	SAFETRANSFERFROM_METHODID,
	ERC721_TRANSFER_EVENT_HASH,
	ERC1155_TRANSFER_EVENT_HASH,
	ERC1155_BATCH_TRANSFER_EVENT_HASH,
	IPFS_REGEX,
	NULL_ADDRESS,
	CHAINS_CONFIG,
};
