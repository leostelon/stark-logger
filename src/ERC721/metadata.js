const { CHAINS_CONFIG, NULL_ADDRESS, IPFS_REGEX } = require("../constants");
const { download } = require("../utils/download");
const { fetchMetadata } = require("../utils/fetchMetadata");
const { getIpfsUrl } = require("../utils/getIpfsUrl");
const NFTJSONInterface = require("../contracts/ERC721.json");
const { parseChainId } = require("../utils/parseChainId");
const {
	getChecksumAddress,
	number,
	Contract,
	shortString,
	Provider,
	uint256,
} = require("starknet");

const chain = CHAINS_CONFIG[process.env.CHAIN];
const provider = new Provider({
	sequencer: {
		network: "goerli-alpha",
	},
});

process.on("message", async (response) => {
	const data = await mine(response.log);
	process.send(data);
});

const mine = async function (log) {
	let transferData = {};
	try {
		transferData = {
			contract_address: getChecksumAddress(log.address),
			from: convertZeroNonPadToPad(log.topics[1]),
			to: convertZeroNonPadToPad(log.topics[2]),
			tokenId: number.hexToDecimalString(log.topics[3]),
			chainId: parseChainId(chain.chainId),
			metadata: {},
		};

		if (log.topics[1] === NULL_ADDRESS) {
			///
			const aspectProxyAddress = transferData.contract_address;
			const contract = new Contract(
				NFTJSONInterface.abi,
				aspectProxyAddress,
				provider
			);

			const value = uint256.bnToUint256(1);

			let tkuri = await contract.tokenURI([value.low, value.high]);
			const strArray = tkuri[0].map((bigNumber) => {
				const hex = number.toHex(bigNumber);
				const str = shortString.decodeShortString(hex);
				return str;
			});
			// Fetch TOKENURI (ASYNC)
			let tokenURI = strArray.join("");
			// console.log("METADATA URL: ", tokenURI);

			// Fetch Metadata (ASYNC)
			const response = await fetchMetadata(tokenURI);

			transferData.nftTokenURI = tokenURI;
			transferData.metadata = response ? response.data : {};

			// Download Image (ASYNC)
			let imageUrl = transferData.metadata.image;
			if (imageUrl) {
				const match = imageUrl.match(IPFS_REGEX);
				if (match && match.length > 0) {
					imageUrl = getIpfsUrl(imageUrl);
				}
				const path = `${transferData.contract_address}/${transferData.tokenId}/`;
				transferData.image = await download(imageUrl, path);
				// console.log(`IMAGE URL: ${transferData.image}`);
			}
		} else {
			transferData.nftTokenURI = "";
			transferData.metadata = {};
		}

		return { log, transferData };
	} catch (e) {
		console.log(e);
		console.log({ "Transfer Message": e.message });
		return { log, transferData };
	}
};

// Utils
function convertZeroNonPadToPad(address) {
	return address === NULL_ADDRESS
		? "0x000000000000000000000000000000000000000000000000000000000000000"
		: address;
}
