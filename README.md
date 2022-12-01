
## NFTY Gateway
*A realtime NFT search engine and analytics API⚡*

| Features |
| :-------------- | 

 - Search any NFT in Starknet, ***Params include***
	 - query (search with name, description, contract_address, token_id)
	 - owner
	 - limit
	 - skip
	 - createdAt (asc | desc)
	 - chain_id (string, hex converted to number)
- Analytics, get daily, weekly and monthly volume trade for NFTs
	- contract_address
	- start_date
	- end_date

| Available Endpoints |
| :-------------- | 
***NFT API***

    curl --location -g --request GET '{{base_url}}/api/nfts?limit=10&chain_id=8080&query=&skip=0&owner=0x320CC5B64B609703cB3Da5c7744E0991FD6C0675'
    
[TRY IT](http://142.93.219.224:3020/api/nfts?limit=10&chain_id=&query=&skip=0&owner=)
***ANALYTICS API***

    curl --location -g --request GET '{{base_url}}/api/analytics?contract_address=0x03090623ea32d932ca1236595076b00702e7d860696faf300ca9eb13bfe0a78c'
   [TRY IT](http://142.93.219.224:3020/api/analytics?contract_address=0x03090623ea32d932ca1236595076b00702e7d860696faf300ca9eb13bfe0a78c)

| How it works🤔 |
| :-------------- |

 - We regularly poll to the network and retrieve all the transactions
   for the current block.
   
 - Filter out all the NFT based transaction, i.e. ERC721, ERC1155.
 - We construct an NFT model, and store all the events to track the NFT activity.
 - We also fetch the metadata url and the actual metadata for the NFT if it exist's. Images are stored in centralized server for faster retrievel.
 - We index all these documents.

**⚠️🚨Server running on single thread CPU, so things might be slow🚨⚠️** 
