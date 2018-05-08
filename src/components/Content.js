import React, {Component} from 'react';


export default class Content extends Component {
  
render() {
    
    return (
      <div >
      
      {this.props.name === "intro" ? (
          <div className='intro'>
          Microsoft Cognitive Services is a collection of intelligent APIs 
          which provide developers with a way to add face recognition, computer vision and more to their apps and services.
          
      </div>
      ):null}

      {this.props.name === "section02" ? (
          <div className='intro'>
          <b>The Microsoft Face API </b>
            takes an image as an input, and
            returns JSON data            
            with confidence scores across a set of facial
            attributes for each face in the image.
            These attributes and emotions are cross-culturally
            and universally communicated with particular facial expressions
            as well as gender and approximate age.
            
      </div>
      ):null}

      {this.props.name === "footer-hdr" ? (
          <div >
          
          Our vision is for more personal computing experiences and
          enhanced productivity aided by systems that increasingly can see, hear, speak,
          understand and even begin to reason.
          
            
      </div>
      ):null}

      
      </div>
    )
  }
}