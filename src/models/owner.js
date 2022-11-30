const mongoose = require("mongoose");
const { validateAndParseAddress, getChecksumAddress } = require("starknet");

const OwnerSchema = new mongoose.Schema(
	{
		nft_id: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		token_id: {
			type: String,
			required: true,
		},
		contract_address: {
			type: String,
			required: true,
			trim: true,
			validate(value) {
				if (!validateAndParseAddress(value.toString())) {
					throw new Error("Invalid nft contract address");
				}
			},
		},
		chain_id: {
			type: String,
			required: true,
			trim: true,
		},
		supply: {
			type: Number,
			required: true,
			trim: true,
			default: 1,
		},
		address: {
			type: String,
			required: true,
			trim: true,
			validate(value) {
				if (!validateAndParseAddress(value.toString())) {
					throw new Error("Invalid nft owner address");
				}
			},
		},
	},
	{ timestamps: true }
);

// Pre and Post Check
// Checksum conversion
OwnerSchema.pre("save", function (next) {
	if (this.isModified("address")) {
		this.address = getChecksumAddress(this.address);
	}
	if (this.isModified("contract_address")) {
		this.contract_address = getChecksumAddress(this.contract_address);
	}
	next();
});

const Owner = new mongoose.model("Owner", OwnerSchema);

module.exports = { Owner };
