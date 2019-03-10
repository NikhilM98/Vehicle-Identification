import React, { Component } from 'react'
import FetchApi from '../../utils/FetchAPI'
import axios from 'axios'

class WebIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            constraints: { audio: false, video: { width: 400, height: 300 } },
            msg: null,
            image:''
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
                const vendorURL = window.URL || window.webkitURL

                video.src = vendorURL.createObjectURL(stream)
                video.play()
            })
            .catch((err) => {
                console.log(err)
            })

    }

    handleStartClick = () => {
        this.takePicture()
    }

    takePicture = () => {
        const canvas = document.querySelector('canvas')
        const context = canvas.getContext('2d')
        const video = document.querySelector('video')
        const { width, height } = this.state.constraints.video
        canvas.width = width
        canvas.height = height
        context.drawImage(video, 0, 0, width, height)
        const data = canvas.toDataURL('image/png')
        const format = 'image/png'
        const uploadData = {
            image: data,
            format
        }
        console.log(uploadData,'data')
        this.setState({
            image: uploadData.image
        })
        axios({
            method: "Post",
            url: "https://api.openalpr.com/v2/recognize_bytes?recognize_vehicle=1&country=us&secret_key=sk_4e601d2372daae0efe473ce9",
            data: uploadData.image.substring(22),
            responseType: 'json'
        })
            .then(res => {
                if(res.data.results.length>0){
                    console.log(res.data.results[0].plate)
                    const data = {
                        number: res.data.results[0].plate
                    }
                    FetchApi('post', '/api/vehicle/verifyVehicle', data)
                        .then(r => {
                            if(r && r.data && r.data.body) {
                                console.log(r.data.body)
                                console.log("success")
                                alert("Vehicle number found in the database")
                            }
                            else {
                                console.log("Vehicle not found")
                            }
                        })
                        .catch(err => {
                            console.log("Something went wrong")
                        })
                }
                else {
                    console.log("Please re-take picture.Vehicle number is blurred")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        const Camera = (props) => (
            <div className="camera"
            >
                <video id="video"
                ></video>
                <a id="startButton"
                    onClick={props.handleStartClick}
                >Start Capturing</a>
            </div>
        )
        return (
            <div className="capture"
            >
                <Camera
                    handleStartClick={this.handleStartClick} />
                <canvas id="canvas"
                    hidden
                ></canvas>
            </div>
        )
    }
}
export default WebIndex
