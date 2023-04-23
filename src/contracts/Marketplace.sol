pragma solidity ^0.8.0;

contract Marketplace {
	string public name;
	uint public productCount = 0;
	uint public vote_end = 0;
	uint public historyProdCount = 0;
	mapping(uint => Product) public products;
	// store the stories that have reached ten upvotes for display
	string public products_historical;

	struct Product {
		uint id;
		string name;
		uint price;
		address owner;
		bool purchased;
		uint upvotes;
		string[5] contributors;
	}

	event ProductCreated(
		uint id,
		string name,
		uint price,
		address owner,
		bool purchased,
		uint upvotes,
		string[5] contributors	
	);

	event upVote(
		uint vote
	);

	event ProductPurchased(
		uint id,
		string name,
		uint price,
		address owner,
		bool purchased,
		uint upvotes,
		string[5] contributors
	);

	struct voteEnd{
		uint votes;
	}
	

	constructor() {
		name = "exquisite corpse";
		products_historical ='';
		vote_end = 0;
	}

	function getArr(uint _id) public view returns (string[5] memory) {
		Product storage myProduct = products[_id];
    	return myProduct.contributors;
	}

	function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
	uint i = 0;
    for (i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
	}

	function strConcat(string memory _a, string memory _b) internal pure returns (string memory) {
    return strConcat(_a, _b, "", "", "");
}

	function toString(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
	function addressToString(address _addr) public pure returns (string memory) {
		bytes32 value = bytes32(uint256(uint160(_addr)));
		bytes memory alphabet = "0123456789abcdef";

		bytes memory str = new bytes(42);
		str[0] = '0';
		str[1] = 'x';
		for (uint i = 0; i < 20; i++) {
			str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
			str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
		}
		return string(str);
	}

	function createVoteEnd() public {
		vote_end++;
		if(vote_end >= 10){
			Product memory _product;
			for(uint i = 0; i < vote_end; i++){
				_product = products[i];
				if(_product.upvotes >= 2){
						historyProdCount++;
						products_historical = strConcat(products_historical, strConcat(products[i].name, " "));
				}
			}
			products_historical = strConcat(products_historical, "\n\n");
			resetProducts();
			vote_end = 0;
			productCount = 0;
		}
		emit upVote(vote_end);
	}

	function getCurrentVote() public view returns (uint) {
		// portion where we plug in tufts account
		// address(_seller).transfer(msg.value);
		return vote_end;
	}


	// function checkVotesLoad() public{
	// 	Product memory _product;
	// 	for(uint i = 0; i < vote_end; i++){
	// 		_product = products[i];
	// 		if(_product.upvotes >= 2){
	// 				historyProdCount++;
	// 				_product = products[i];
 	// 				products_historical[historyProdCount] = _product;
	// 		}
	// 	}
	// }

	function resetProducts() public view{
		Product memory _product;
		for(uint i = 0; i < vote_end; i++){
			_product = products[i];
			_product.name = "";
			_product.upvotes = 0;
		}
	}


	function createProduct(string memory _name, uint _price, uint upvotes, string[5] memory contributors) public {
		// require a name
		require(bytes(_name).length > 0);
		// require a valid price
		require(_price > 0);
		// make sure params good
		// inc products count
		productCount++;
		//add owner to contributors
		contributors[upvotes] = addressToString(msg.sender);
		// create the product
		products[productCount] = Product(productCount, _name, _price, msg.sender, false, upvotes, contributors);
		// trigger an event	
		emit ProductCreated(productCount, _name, _price, msg.sender, false, upvotes, contributors);
	}

	function purchaseProduct(uint _id) public payable {
		// fetch product
		Product memory _product = products[_id];	
		// fetch the owner
		address _seller = _product.owner;
		// make sure the product has a valid id
		require(_product.id > 0 && _product.id <= productCount);
		// make sure they sent enough ether
		require(msg.value >= _product.price);
		// require product has not already been purchased
		require(!_product.purchased);
		// require that the buyer is not the seller
		require(_seller != msg.sender);
		// require that the buyer is not a previous contributor (i.e already upvoted)
		

		// purchase it -> transfer ownership to buyer
		_product.owner = msg.sender;
		// mark as purchased
		_product.purchased = true;
		// increment upvotes of product
		_product.upvotes += 1;
		//add purchaser to contributors
		_product.contributors[_product.upvotes] = addressToString(msg.sender);
		//update the product
		products[_id] = _product;
		// pay the seller by sending them ether
		// address(_seller).transfer(msg.value);
		// trigger an event
		emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true, _product.upvotes, _product.contributors);

		if(_product.upvotes < 2){
			createProduct(_product.name, _product.price, _product.upvotes, _product.contributors);
		}
	}
}