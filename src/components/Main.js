import React, { Component } from 'react';
import './App.css';
import Entry from './Entry'
import './typewriter.css'
import './Skull.css'

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      myArrContent: []
    }
  }


  render() {
    return (
<div id="content" className="content">
  <h1>
  Exquisite Corpse
  </h1>
<br>
  </br>
  <br>
  </br>
<div class="container">
<div class="skull">
		<div class="head">
			<div class="crack"></div>
		</div>
		<div class="mouth">
			<div class="teeth"></div>
		</div>
	</div>
  </div>
  <br>
  </br>
  <br>
  </br>
        <h2>Add a Sentence</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei("0.000005", 'Ether')
          var my_val = ['', '', '', '', ''];
          this.props.createProduct(name, price, 0, my_val)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Sentence"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Sentence</button>
        </form>
        <p>&nbsp;</p>
        <h2>How it Works</h2>
        <div>
          Every sentence is given a base price.
          Once a sentence, reaches 5 upvotes the word can no longer be purchased.
          The people who bought the sentence are listed as contributors to the story. Once
          the story reaches 10 sentences it is minted as its own contract available for purchase.
          The contributors are then sent an equal proportion of the sale of the story.
        </div>
        <h2>Buy Sentence</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Sentence</th>
              <th scope="col">Price</th>
              <th scope="col">Upvotes</th>
              <th scope="col">Owner</th>
              <th scope="col">Contributors</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
          { this.props.products.map((product, key) => {  
            	this.props.getArr(product.id.toNumber());         
              if (!product.purchased) {
                return <Entry key={key} product={product} name={product.name} upvotes={product.upvotes} purchaseProduct ={this.props.purchaseProduct} getArr ={this.props.getArr} data={this.state.myArrContent}/>;
              } else {
                return null;
              }

          })}
          </tbody>
        </table>
        <h2>
          The Story
        </h2>
        { 
        this.props.products.map((product, key) => {
              return(
                (product.upvotes >= 2) ?
                <div key={key}>
                    { product.purchased
                      ? <div  ref="setter" className="sentence" dangerouslySetInnerHTML={{ __html: product.name}}></div>
                      : null
                    }
                </div>
                : null
              )
            })}
            <br>
            </br>
          <h2>
            Vote to End
          </h2>
          <button
			   onClick={(event) => {
				 this.props.voteEnd()
			   }}>
			   Vote to End
			 </button>
       <div dangerouslySetInnerHTML={{ __html: this.props.votez}}></div>

       <h2>
          Past Stories
        </h2>
       <div  ref="setter" className="sentence" dangerouslySetInnerHTML={{ __html: this.props.historicalProducts}}></div>
       <br>
       </br>
       <br>
       </br>
       <div>
    Beta V1.0, UEP Lab Tufts University
  </div>
      </div>
    );
  }
}

export default Main;
