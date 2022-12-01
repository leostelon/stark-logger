const { CHAINS_CONFIG } = require("./constants");
const { RpcProvider } = require("starknet");
const { ERC721Logger } = require("./ERC721");
const { Log } = require("./models/logs");
const { v4: uuidv4 } = require("uuid");

const ERC721_EVENT_KEY =
	"0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9";

// GLobal Variables
let currentBlock = 0;
let indexingBlock = process.env.INDEXING_BLOCK;

const chain = CHAINS_CONFIG[process.env.CHAIN];
const rpcProvider = new RpcProvider({
	nodeUrl: chain.websocketRpcUrl,
});

class Listener {
	_erc721Logger;

	constructor() {
		this._erc721Logger = new ERC721Logger();
	}

	// Initializes Indexing
	async initiate() {
		try {
			while (true) {
				const cBlock = await rpcProvider.getBlockNumber();
				currentBlock = cBlock;
				if (!indexingBlock) indexingBlock = currentBlock;
				console.log({
					Message:
						"Current Block: " +
						currentBlock +
						"; Indexing Block: " +
						indexingBlock,
				});
				if (indexingBlock <= currentBlock) {
					console.log({ Message: "Indexing New Block: " + indexingBlock });

					const txs = await rpcProvider.getBlockWithTxs(indexingBlock);

					let logs721 = [];
					for await (let tx of txs.transactions) {
						try {
							const receipt = await rpcProvider.getTransactionReceipt(
								tx.transaction_hash
							);
							for await (let event of receipt.events) {
								if (event.keys.includes(ERC721_EVENT_KEY)) {
									const log = createLog(event, tx);
									await log.save();
									logs721.push(log);
								}
							}
						} catch (e) {
							console.log(e);
						}
					}

					// Concat events
					this._erc721Logger._addLogs(logs721);
				}
				await timeout(1000);
				indexingBlock++;
			}
		} catch (e) {
			console.log(e);
		}
	}
}

// Utils
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function createLog(event, tx) {
	return new Log({
		address: event.from_address,
		blockHash: tx.block_hash,
		blockNumber: tx.block_number,
		topics: [ERC721_EVENT_KEY, ...event.data],
		transactionHash: tx.transaction_hash,
		logIndex: 0,
		transactionIndex: 0,
		logId: uuidv4(),
		timestamp: Date.now(),
	});
}

module.exports = { Listener };
