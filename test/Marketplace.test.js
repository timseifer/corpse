const { assert } = require("chai")

const Marketplace = artifacts.require('./Marketplace.sol')

require("chai")
	.use(require('chai-as-promised'))
	.should()
contract('Marketplace', ([deployer, seller, buyer]) => {
	let marketplace

	before(async () => {
		marketplace = await Marketplace.deployed()
	})

	describe('deployment', async => {
		it('deploys succesfully', async () => {
			const address = await marketplace.address
			assert.notEqual(address, 0x0);
			assert.notEqual(address, '');
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		})

		it('has name', async() => {
			const name = await marketplace.name()
			assert.equal(name, "invictus words")
		})
	})

	describe('products', async => {
		let result, productCount, histproductCount 
		before(async () => {
			var my_val = ["", "", "", "", ""];
			result = await marketplace.createProduct('In the beginning', web3.utils.toWei('1', 'Ether'), 2, my_val, { from: seller})
			productCount = await marketplace.productCount()
			histproductCount = await marketplace.historyProdCount()
		})
	
		it('creates products', async() => {
			assert.equal(productCount, 1)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'In the beginning', 'name is correct')
			assert.equal(event.price, '1000000000000000000', 'price is correct')
			assert.equal(event.owner, seller, 'owner is correct')
			assert.equal(event.purchased, false, 'purchased is correct')
			// console.log(event.owner.toString())
			// console.log(event.contributors[event.upvotes].toString())
			// acontributors_as_string(

		// failures- product needs a name
		await marketplace.createProduct('', web3.utils.toWei('.0001', 'Ether'), { from: seller}).should.be.rejected;
				// failures- product needs a name
		await marketplace.createProduct('In the beginning', 0, { from: seller}).should.be.rejected;
		})

		it('lists products', async() => {
			const products = await marketplace.products(productCount);
			console.log(productCount.toNumber())
			assert.equal(products.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(products.name, 'In the beginning', 'name is correct')
			assert.equal(products.price, '1000000000000000000', 'price is correct')
			assert.equal(products.owner, seller, 'owner is correct')
			assert.equal(products.purchased, false, 'purchased is correct')
			const myArr = await marketplace.getArr(products.id.toNumber());
			console.log(myArr);
			// console.log(products.contributors[products.upvotes])

		})

		it('sells products', async() => {
			// track the seller balance before the purchase
			let oldSellerBalance
			oldSellerBalance = await web3.eth.getBalance(seller)
			oldSellerBalance = new web3.utils.BN(oldSellerBalance)
			// Sucess buyer makes purchase
			// result = await marketplace.createVoteEnd()
			let vote_end
			before(async () => {
				vote_end = await marketplace.vote_end()
			})
			// console.log(vote_end)
			result = await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('.0001', 'Ether')})
			
			//check logs
			const event = result.logs[0].args
			// console.log(event.contributors[0].toString())
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'In the beginning', 'name is correct')
			assert.equal(event.price, web3.utils.toWei('.0001', 'Ether'), 'price is correct')
			assert.equal(event.owner, buyer, 'owner is correct')
			assert.equal(event.purchased, true, 'purchased is correct')
			assert.equal(event.upvotes, '3', 'upvotes is correct')
			//check that seller recieved funds
			// let newSellerBalance
			// newSellerBalance = await web3.eth.getBalance(seller)
			// newSellerBalance = new web3.utils.BN(newSellerBalance)
			
			// let price
			// price = web3.utils.toWei('1', 'Ether')
			// price = new web3.utils.BN(price)

			// const expectedBalance = oldSellerBalance.add(price)
			// assert.equal(newSellerBalance.toString(), expectedBalance.toString())

			// //Failure
			// //trys to buy a product that does not exist
			// await marketplace.purchaseProduct(99, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
			// //buyer tries to buy with not enough ether
			// await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected
			// await marketplace.purchaseProduct(productCount, {from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
			// await marketplace.purchaseProduct(productCount, {from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected


			
		})

		it('reset products', async() => {
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		marketplace.createVoteEnd()
		const vote_end = await marketplace.getCurrentVote()
		assert.equal(vote_end, 2)
		
		//assert.equal(productCount, 0)
		// console.log(productCount.toNumber())
		console.log(histproductCount.toNumber())
		// console.log(vote_end.toNumber())
		})

	})

	
})