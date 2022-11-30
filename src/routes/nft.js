const { NFT } = require("../models/nft");

const router = require("express").Router();

router.get("/nft", async (req, res) => {
	try {
		const nfts = await NFT.aggregate([
			{
				$facet: {
					paginatedResults: [{ $skip: 0 }, { $limit: 1 }],
					totalCount: [
						{
							$count: "count",
						},
					],
				},
			},
		]);
		res.send(nfts);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
