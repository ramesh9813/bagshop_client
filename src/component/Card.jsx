import React from 'react'
import { Link } from 'react-router-dom';

const Card = (props) => {
  // console.log(props.data)
  if (!props.data) {
    return null; // or handle the absence of data as per your requirement
}
const strippedTitle = (title, carlength) => {
  let newvar = '';
  let spaceReq = carlength - title.length;
  if (title.length >= carlength) {
    for (let i = 0; i < carlength-3; i++) {
      newvar += title[i];
    }
    newvar+="..."
  } else {
    newvar = title;
    for (let i = 0; i < spaceReq; i++) {
      newvar += " ";
    }
  }
  return newvar
};

  return (
    <>
        <div className="col">
            <div className="card">
            <img src={props.data.imageUrl} className="card-img-top" alt={props.data.name}/>
            <div className="card-body">
                <h5 className="card-title">{strippedTitle(props.data.name,28)}</h5>
                <h5 className='text-warning'>${props.data.price} </h5>
                
                <Link to ={`/productdetails/${props.data._id}`}className='btn btn-warning'> View detial</Link>
              
            </div>
            </div>
        </div>
    </>
  )
}

export default Card