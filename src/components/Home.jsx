import React, { Component } from 'react'
import FetchApi from '../utils/FetchAPI'
import axios from 'axios'

class WebIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            constraints: { audio: false, video: { width: 400, height: 300 } },
            msg: null,
            result: '',
            number: '',
            found: false
        }
    }
    componentDidMount() {
        const constraints = this.state.constraints
        const getUserMedia = (params) => (
            new Promise((successCallback, errorCallback) => {
                navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback)
            })
        )

        getUserMedia(constraints)
            .then((stream) => {
                const video = document.querySelector('video')
                // const vendorURL = window.URL || window.webkitURL
                video.srcObject = stream
                video.play()
            })
            .catch((err) => {
                console.log(err)
            })

    }

    componentDidUpdate() {
        const constraints = this.state.constraints
        const getUserMedia = (params) => (
            new Promise((successCallback, errorCallback) => {
                navigator.webkitGetUserMedia.call(navigator, params, successCallback, errorCallback)
            })
        )

        getUserMedia(constraints)
            .then((stream) => {
                const video = document.querySelector('video')
                // const vendorURL = window.URL || window.webkitURL
                video.srcObject = stream
                video.play()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    onAdd = (e) => {
        e.preventDefault()
        let data = {
            number: this.state.number
        }
        if(data) {
            FetchApi('Post', '/api/vehicle/add', data)
                .then(r => {
                    if(r && r.data && r.data.body) {
                        this.setState({msg: "Vehicle Added", found: true})
                    }
                })
                .catch(err => {
                    this.setState({msg: err.msg})
                })
        }

    }

    takePicture = () => {
        this.setState({msg: 'Analyzing...', result: ''})
        const canvas = document.querySelector('canvas')
        const context = canvas.getContext('2d')
        const video = document.querySelector('video')
        const { width, height } = this.state.constraints.video
        canvas.width = width
        canvas.height = height
        context.drawImage(video, 0, 0, width, height)
        const uploadData = canvas.toDataURL('image/png')
        axios({
            method: "POST",
            url: "https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_4e601d2372daae0efe473ce9",
            data: uploadData.substring(22),
            responseType: 'json'
        })
            .then(res => {
                if (res.data.results.length > 0) {
                    console.log(res.data.results, res.data.results[0].plate)
                    const data = {
                        number: res.data.results[0].plate
                    }
                    FetchApi('post', '/api/vehicle/verifyVehicle', data)
                        .then(r => {
                            if (r && r.data && r.data.body) {
                                this.setState({msg: `Vehicle number ${data.number} found in the database`, result: res.data.results[0], number: data.number, found: true})
                            } else {
                                this.setState({msg: `Vehicle number ${data.number} not found`, result: res.data.results[0], number: data.number, found: false})
                            }
                        })
                        .catch(err => {
                            this.setState({msg: 'Something went wrong'})
                            console.log(err)
                        })
                } else {
                    this.setState({msg: 'Vehicle number cannot be recognized'})
                    console.log(res.data);
                }
            })
            .catch(err => {
                this.setState({msg: 'Failed to recognize number'})
                console.log(err)
            })
    }

    render() {
        const Camera = () => (
            <div className="camera">
                <video id="video"></video>
                <button id="startButton" onClick={this.takePicture}>Capture</button>
            </div>
        )

        const PrintDetails = (props) => {
            let print = []
            let el
            for (let key in props.of) {
                el = []
                el.push(<div style={{fontWeight: '600', textAlign: 'center'}}>{key}</div>)
                el.push(
                    <div>
                        <div style={{float: 'left', margin: '10px'}}>
                            Confidence
                        </div>
                        <div style={{float: 'right', margin: '10px'}}>
                            Name
                        </div>
                    </div>
                )
                for (let i=0; i < props.of[key].length; i++) {
                    el.push(
                    <div>
                        <div style={{float: 'left', margin: '10px'}}>
                            {props.of[key][i].confidence}
                        </div>
                        <div style={{float: 'right', margin: '10px'}}>
                            {props.of[key][i].name}
                        </div>
                    </div>)
                }
                print.push(<div style={{float: 'left', margin: '10px', border: '5px black double' }}>{el}</div>)
            }
            return <div style={{border: '5px black solid', display: 'flex'} }>{print}</div>
        }

        const Result = () => (
            <div>
                {typeof this.state.result === "object" ? 
                <div>
                    {typeof this.state.result.vehicle === "object" ? 
                    <div>
                        <PrintDetails of={this.state.result.vehicle} />
                    </div> : null}
                </div> : this.state.result }
            </div>
        )
            
        
        return (
            <div>
                <div className="capture">
                    <Camera />
                    <canvas id="canvas" hidden ></canvas>
                </div>
                <h2>{this.state.msg}</h2>
                <Result />
                {(this.state.number && !this.state.found) ? <button onClick={this.onAdd}>
                    Add Vehicle
                </button> : null}
            </div>
        )
    }
}
export default WebIndex
