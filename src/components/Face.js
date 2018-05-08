import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import FaceMetaData from './FaceMetaData'
import * as utils from './../util'
import AIService from './../api'
import Content from './Content'
import { RingLoader } from 'react-spinners'
import { Container, Row, Col } from 'react-grid-system'
import Chart from './Chart'
import SBPieChart from './SBPieChart'
import SBScatterplotChart from './SBScatterplotChart'
import Footer from './Footer'
import { resource } from './Resource'
import Webcam from 'react-webcam'
import { Legend } from 'react-easy-chart'
import FaBeer from 'react-icons/lib/fa/camera'

class Face extends Component {
  constructor () {
    super()
    this.state = {
      files: [],
      metadata: [],
      preview: '',
      loading: false,
      showintro: true,
      reject: false,
      showCamera: false,
      imageSrc: '',
      isHidden: true,
      caption:'',
      captionJson:'',
      recognizeText:'',
      landmarks:'',
      landmarksJson:'',
      ocr:'',
      ocrJson:'',

    }
  }

  goHome = () => {
    this.setState({
      showintro: true,
      files: [],
      metadata: [],
      loading: false,
      imageSrc: '',
      showCamera: false,
      reject: false,
      isHidden: true,
      caption:''
    })
  }

  toggleImage () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  resetWebcam = () => {
    this.setState({
      showCamera: true,
      imageSrc: '',
      files: [],
      caption:'',
      captionJson:''
    })
  }

  onDragEnter () {
    this.setState({
      dropzoneActive: true
    })
  }

  onDragLeave () {
    this.setState({
      dropzoneActive: false
    })
  }

  successFaceCallback = (result)=> {
    this.setState({ metadata: result})
        if (this.state.metadata.length === 0) {
          this.setState({ reject: true })
        }
  }
  
  successLandmarkCallback = (result)=> {
    if(result.result.landmarks.length > 0){
      console.log(result.result.landmarks[0].name)
      this.setState({landmarks: result.result.landmarks[0].name,landmarksJson:result})
    } 
    this.setState({loading: false})
  }

  successCaptionCallback = (result)=> {
    if(result.description.captions.length){
      this.setState({caption: result.description.captions[0].text,captionJson:result})
    }
    this.setState({loading: false})
  }
  
  successOCRCallback = (result)=> {
    let ocr = utils.getOcrText(result);
    this.setState({ocr})
  }

  failureCallback(error) {
    console.log("failed: " + error);
  }

  reset () { 
    this.setState({
      dropzoneActive: false,
      loading: true,
      metadata: [],
      showintro: false,
      reject: false,
      showCamera: false,
      imageSrc: '',
      landmarks:'',
      landmarksJson:'',
      caption:'',
      captionJson:'',
    })
  }

  onDrop (files) {
    this.setState({
      files,
    })
    this.reset();

    utils.onDropRead(files).then(
      result => {
          AIService.getCaption(result).then(this.successCaptionCallback, this.failureCallback);
          AIService.getFace(result).then(this.successFaceCallback, this.failureCallback);
          AIService.getLandmark(result).then(this.successLandmarkCallback, this.failureCallback);
          AIService.getOCR(result).then(this.successOCRCallback, this.failureCallback);
      },
      err => {
        console.log(err)
      }
    )
  }

  cameraCapture = () => {
    const imageSrc = this.webcam.getScreenshot()
    AIService.getFace(imageSrc).then(this.successFaceCallback, this.failureCallback);
 
    this.setState({
      metadata: [],
      files: [],
      imageSrc: imageSrc,
      showintro: false,
      reject: false,
      showCamera: false,
      loading: false,
    })
  }

  render () {
    const {
      accept,
      dropzoneActive,
      metadata,
      showintro,
      reject,
      loading,
      files,
      imageSrc,
      showCamera,
      caption,
      landmarks,
      ocr
    } = this.state

    const overlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.2)'
    }

    const scatterStyle = {
      '.legend': {
        backgroundColor: '#f9f9f9',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        fontSize: '0.8em',
        padding: '12px',
        marginBottom: '10px',
        marginTop: '10px'
      }
    }

    const reactIconOn = {
      color: 'tomato',
      fontSize: '2em',
      cursor: 'pointer'
    }

    const reactIconOff = {
      color: '#097142',
      fontSize: '2em',
      cursor: 'pointer'
    }

    let males = utils.getMales(metadata).length
    let females = metadata.length - males

    const SwapIamge = () => (
      <img
        alt='Vision'
        className='swapimg'
        src={require('../images/csa.png')}
      />
    )

    const ShowConsoleLog = () => (
      <div>
        <pre className="landmarks">
            {JSON.stringify(this.state.landmarksJson, null, 3)}
      </pre>
      <pre className="captions">
            {JSON.stringify(this.state.captionJson, null, 3)}
      </pre>
      <pre className="faces">
            {JSON.stringify(this.state.metadata, null, 3)}
      </pre>
  </div>
    )

    return (
      <div>
        <div className='topsec'>
          <Container className='main-container' fluid>
            <Row>
              <Col md={1.5} className='container'>          
                <img
                  alt='siren'
                  onClick={this.goHome}
                  className='siren clearfix'
                  src={require('../images/siren.png')}
                />
              </Col>

              <Col md={9.5} className='container'>
                <h1 className='title'>
                  {resource.SITE_NAME}
                </h1>
                <div className='subtitle sectitle'>
                 <span >
                    Give your apps a human side
                </span>
                </div>
              </Col>

            </Row>
            <Row>
              <Col md={12} className='container'>
                <div className='header-bar' />
              </Col>
            </Row>
          </Container>

        </div>

        <Container
          className='main-container'
          fluid
          style={{ lineHeight: '32px' }}
        >
          <Row>
            <Col md={5} xs={12} className='container'>
           
              <div className='dropzone'>

                {showCamera
                  ? <FaBeer style={reactIconOn} onClick={this.cameraCapture} />
                  : <FaBeer style={reactIconOff} onClick={this.resetWebcam} />}
               
               <Dropzone
                  className='photo'
                  accept={accept}
                  onDrop={this.onDrop.bind(this)}
                  onDragEnter={this.onDragEnter.bind(this)}
                  onDragLeave={this.onDragLeave.bind(this)}
                >

                  {dropzoneActive && <div style={overlayStyle} />}
                  <div className='photo'>

                    {showCamera
                      ? <div>

                        <Webcam
                          height={350}
                          ref={this.setRef}
                          screenshotFormat='image/jpeg'
                          width={400}
                          />
                      </div>
                      : showintro
                          ? <img
                            alt=''
                            id='preview1'
                            className='preview'
                            src={require('../images/faceintro2.png')}
                            />
                          : null}

                    {!showCamera
                      ? <img
                        alt=''
                        id='preview2'
                        className='preview'
                        src={imageSrc}
                        />
                      : null}

                    {files.map(f => (
                      <img
                        id='preview3'
                        alt={f.name}
                        className='preview'
                        src={imageSrc || f.preview}
                        key={f.name}
                      />
                    ))}

                  </div>

                </Dropzone>
                {caption ?
                <p className="caption" >Caption: {caption}</p>
                :null}
                {landmarks ?
                  <p className="caption" >Landmarks: {landmarks}</p> 
                :null}
                {ocr ?
                    <p className="caption" >OCR: {ocr}</p> 
                  :null}
                </div>

              {showintro
                ? <div>                
                  <div className='subtitle sectitle upper'>
                      Drag & drop or click to analyze faces
                    </div>
                </div>
                : null}

            </Col>
            <Col md={7} xs={12}>

              {reject
                ? <div className='error'>
                    No faces found.
                  </div>
                : null}

              {showintro
                ? <span>

                  <Content name='intro' />
       
                  <div>
                    <span onClick={this.toggleImage.bind(this)}>
                      {this.state.isHidden
                          ? <img
                            alt='Vision API'
                            className='apimap'
                            src={require('../images/vision.png')}
                            />
                          : null}

                      {!this.state.isHidden && <SwapIamge />}
                    </span>
                  </div>

                   <Content name="section02"  />
  
                </span>
                : null}

              <div className='meta-data'>

                <RingLoader
                  className='ring-loader'
                  color={'#123abc'}
                  loading={loading}
                />

                {!loading && !showintro && !reject
                  ? <div>
                    <span className='meta right'>
                        Summary: total {metadata.length}
                    </span>
                    <div>
                      <Chart
                        size={500}
                        data={utils.getEmotionChartSummary(metadata)}
                        />
                    </div>
                  </div>
                  : null}
                <div />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                {metadata.length > 1
                  ? <span>
                    <Row>
                      <div className='label meta'>Facial Analysys</div>
                    </Row>
                    <SBScatterplotChart
                      width={150}
                      height={200}
                      data={utils.getScatterPlotData(metadata)}
                      />
                  </span>
                  : null}

                <span className='gender'>
                  {males
                    ? <span className='piechart male meta'>
                        Male {males}
                      <SBPieChart
                        size={150}
                        data={utils.getEmotionChartSummary(metadata, 'male')}
                        />
                    </span>
                    : null}
                  {females
                    ? <span className='piechart female meta'>
                        Female {females}
                      <SBPieChart
                        size={150}
                        data={utils.getEmotionChartSummary(metadata, 'female')}
                        />
                    </span>
                    : null}

                </span>
              </div>
            </Col>
          </Row>

          {metadata.length
            ? <Row>
              <Col>
                <Row>
                  <Legend
                    styles={scatterStyle}
                    horizontal
                    data={utils.getPieData(utils.getEmotionChartSummary(metadata))}
                    dataId={'key'}
                    />

                </Row>
                
                <Row>
                  {metadata.map((f, i) => (
                    <FaceMetaData
                      imageSrc={imageSrc}
                      key={f.faceId}
                      gender={f.faceAttributes.gender}
                      age={f.faceAttributes.age}
                      faceattributes={f.faceAttributes}
                      count={metadata.length}
                      metadata={this.state.metadata}
                      faceRectangle={f.faceRectangle}
                      files={files || imageSrc}
                      />
                    ))}
                </Row>
              </Col>
            </Row>
            : null}

        </Container>

        {showintro
          ? <div className='blurb'>
            <Content name="footer-hdr" />
          </div>
          : null}

        <Footer />

        {this.state.metadata.length > 0 ||
        this.state.landmarks.length > 0 ||
        this.state.caption.length > 0  ? 
          
            <ShowConsoleLog />
          
          :null}
          
      </div>
    )
  }
}

export default Face
