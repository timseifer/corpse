import React, { Component } from 'react';
import './App.css'

class Entry extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  myData: []
		};
	  }

	  async fetchData() {
		const data = await this.props.getArr(this.props.product.id.toNumber());
		this.setState({ myData: data });
	  }
	  componentDidMount() {
		this.fetchData();
	  }

	  

  render() {
	const { myData } = this.state;
	const concatenatedData = myData.join(" "); 

    return (
	((this.props.product.upvotes <= 2) ?
		<tr key={this.props.key}>
	   { !this.props.product.purchased
		   ?
	   <td>{this.props.name}</td> : null}
	   { !this.props.product.purchased
		   ?
	   <td>{window.web3.utils.fromWei(this.props.product.price.toString(), 'Ether')} Eth</td> : null}
	   { !this.props.product.purchased
		   ?
	   <td>{this.props.upvotes.toString()}</td>: null}
	   { !this.props.product.purchased
		   ?
	   <td>{this.props.product.owner}</td>: null}
		<td dangerouslySetInnerHTML={{ __html: concatenatedData}}></td>
	   <td>
		 { !this.props.product.purchased
		   ? <button
			   name={this.props.product.id}
			   value={this.props.product.price}
			   onClick={(event) => {
				 this.props.purchaseProduct(event.target.name, event.target.value)
			   }}
			 >
			   Buy
			 </button>
		   : null
		 }
		 </td>
		 
	 </tr>: null)
    );
  }
}

export default Entry;
